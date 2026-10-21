// "اقترح لي" — place suggestions from the Tripadvisor Content API.
// Supabase Edge Function (Deno). The Tripadvisor key lives ONLY here, as a
// secret — the app never sees it.
//
// Secrets (Supabase → Edge Functions → Secrets):
//   TRIPADVISOR_KEY      your Content API key            (required)
//   TRIPADVISOR_REFERER  e.g. https://your-app.vercel.app (optional — only
//                        if you restricted the key to a domain)
//
// Only signed-in travelers can call it (Supabase verifies the JWT).
// Tripadvisor allows caching ONLY location ids, so nothing else is stored:
// every call fetches fresh details.
//
// Body:
//   { action: "anchor",  query, language }                     -> { id, name, lat, lng }
//   { action: "suggest", category, query, lat?, lng?, near?, language } -> { places: [...] }

const KEY = Deno.env.get("TRIPADVISOR_KEY") ?? "";
const REFERER = Deno.env.get("TRIPADVISOR_REFERER") ?? "";
const BASE = "https://api.content.tripadvisor.com/api/v1";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...cors, "Content-Type": "application/json" } });

async function ta(path: string, params: Record<string, string | undefined>) {
  const u = new URL(BASE + path);
  u.searchParams.set("key", KEY);
  for (const [k, v] of Object.entries(params)) if (v) u.searchParams.set(k, v);
  const headers: Record<string, string> = { accept: "application/json" };
  if (REFERER) headers["Referer"] = REFERER;
  const r = await fetch(u, { headers });
  if (!r.ok) throw new Error(`tripadvisor ${r.status}: ${(await r.text()).slice(0, 200)}`);
  return r.json();
}

const km = (a: number, b: number, c: number, d: number) => {
  const R = 6371, toR = Math.PI / 180;
  const x = Math.sin(((c - a) * toR) / 2) ** 2 +
    Math.cos(a * toR) * Math.cos(c * toR) * Math.sin(((d - b) * toR) / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(x));
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (!KEY) return json({ error: "missing_key" }, 503);
  try {
    const body = await req.json();
    const language = body.language === "ar" ? "ar" : "en";

    if (body.action === "anchor") {
      // Find a hotel / area by name and return its coordinates.
      const s = await ta("/location/search", { searchQuery: String(body.query || "").slice(0, 120), language });
      const first = (s.data || [])[0];
      if (!first) return json({ anchor: null });
      const d = await ta(`/location/${first.location_id}/details`, { language });
      return json({ anchor: {
        id: first.location_id, name: d.name,
        lat: Number(d.latitude), lng: Number(d.longitude),
      } });
    }

    if (body.action === "suggest") {
      const lat = Number(body.lat), lng = Number(body.lng);
      const hasLL = Number.isFinite(lat) && Number.isFinite(lng) && (lat !== 0 || lng !== 0);
      const searchQuery = `${body.query || ""}${!hasLL && body.near ? " " + body.near : ""}`.trim().slice(0, 120);
      const s = await ta("/location/search", {
        searchQuery,
        category: ["restaurants", "attractions", "hotels", "geos"].includes(body.category) ? body.category : undefined,
        latLong: hasLL ? `${lat},${lng}` : undefined,
        radius: hasLL ? "8" : undefined,
        radiusUnit: hasLL ? "km" : undefined,
        language,
      });
      const ids: string[] = (s.data || []).slice(0, 10).map((x: any) => x.location_id);
      const places = await Promise.all(ids.map(async (id) => {
        try {
          const [d, p] = await Promise.all([
            ta(`/location/${id}/details`, { language, currency: "SAR" }),
            ta(`/location/${id}/photos`, { language, limit: "1" }).catch(() => ({ data: [] })),
          ]);
          const img = p.data?.[0]?.images;
          const plat = Number(d.latitude), plng = Number(d.longitude);
          return {
            id,
            name: d.name,
            address: d.address_obj?.address_string || "",
            lat: plat, lng: plng,
            distanceKm: hasLL && Number.isFinite(plat) ? Math.round(km(lat, lng, plat, plng) * 10) / 10 : null,
            rating: d.rating ? Number(d.rating) : null,
            ratingImage: d.rating_image_url || null,
            reviews: d.num_reviews ? Number(d.num_reviews) : 0,
            ranking: d.ranking_data?.ranking_string || null,
            price: d.price_level || null,
            tags: [...(d.cuisine || []), ...(d.subcategory || []), ...(d.groups || []).flatMap((g: any) => g.categories || [])]
              .map((c: any) => c.localized_name || c.name).filter(Boolean).slice(0, 3),
            hours: d.hours?.weekday_text || null,
            description: (d.description || "").slice(0, 280),
            photo: img?.large?.url || img?.medium?.url || img?.original?.url || null,
            webUrl: d.web_url || null,
          };
        } catch (_) { return null; }
      }));
      return json({ places: places.filter(Boolean), asOf: new Date().toISOString() });
    }

    return json({ error: "unknown_action" }, 400);
  } catch (e) {
    return json({ error: String((e as Error).message || e) }, 502);
  }
});
