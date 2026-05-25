// Mock trip data
const TRIP = {
  id: 'kyoto-26',
  title: 'Kyoto · Hanami',
  subtitle: 'Cherry blossom run',
  dates: 'Apr 03 — Apr 14, 2026',
  daysIn: 6, daysTotal: 11,
  homeCurrency: 'USD',
  localCurrency: 'JPY',
  fx: 152.4, // 1 USD = 152.4 JPY
  budget: { plannedUSD: 4200, spentUSD: 2864.32 },
  cover: 'kyoto',
  weather: { temp: 18, cond: 'Light rain' },
  next: { label: 'Tea ceremony · Camellia', when: 'Tomorrow 14:00' },
};

const MEMBERS = [
  { id: 'u1', name: 'Sample User',  role: 'Admin',  hue: 35,  initials: 'SU' },
  { id: 'u2', name: 'Theo R.',  role: 'Editor', hue: 200, initials: 'TR' },
  { id: 'u3', name: 'Naomi S.', role: 'Editor', hue: 155, initials: 'NS' },
  { id: 'u4', name: 'Jules P.', role: 'Viewer', hue: 280, initials: 'JP' },
];

const CATEGORIES = [
  { key: 'lodging',  label: 'Lodging',   color: 'var(--clay)',      pct: 38, amt: 1088.40 },
  { key: 'food',     label: 'Food',      color: 'var(--honey)',     pct: 22, amt: 630.15 },
  { key: 'transit',  label: 'Transit',   color: 'var(--moss)',      pct: 18, amt: 515.58 },
  { key: 'culture',  label: 'Culture',   color: 'var(--indigo)',    pct: 14, amt: 401.00 },
  { key: 'misc',     label: 'Misc',      color: 'var(--ink-mute)',  pct: 8,  amt: 229.19 },
];

const EXPENSES = [
  { id: 'e1',  who: 'u1', cat: 'lodging',  title: 'Ryokan Tawaraya — 2 nights', jpy: 78400,  usd: 514.50, when: 'Today 09:12',  note: 'tatami suite, breakfast' },
  { id: 'e2',  who: 'u2', cat: 'food',     title: 'Omakase · Gion Sasaki',       jpy: 41200,  usd: 270.40, when: 'Today 08:01',  note: '4 ppl' },
  { id: 'e3',  who: 'u3', cat: 'transit',  title: 'JR Pass — 7 day',             jpy: 50000,  usd: 328.10, when: 'Yesterday',     note: 'group rate' },
  { id: 'e4',  who: 'u1', cat: 'culture',  title: 'Fushimi Inari guide',         jpy: 12000,  usd: 78.74,  when: 'Yesterday',     note: '' },
  { id: 'e5',  who: 'u2', cat: 'food',     title: 'Nishiki Market lunch',        jpy: 6480,   usd: 42.52,  when: 'Apr 04',        note: '' },
  { id: 'e6',  who: 'u4', cat: 'misc',     title: 'SIM card · 5GB',              jpy: 3200,   usd: 21.00,  when: 'Apr 04',        note: '' },
  { id: 'e7',  who: 'u3', cat: 'culture',  title: 'Kinkaku-ji entry × 4',         jpy: 1600,   usd: 10.50,  when: 'Apr 04',        note: '' },
];

const DOCS = [
  { id: 'd1', kind: 'pdf', title: 'KLM 8721 · Boarding',       sub: 'Apr 03 · 11:40',  size: '2.1 MB', tint: 'clay'   },
  { id: 'd2', kind: 'img', title: 'Visa stamp · JP',           sub: 'scanned · 4032×3024', size: '4.6 MB', tint: 'moss' },
  { id: 'd3', kind: 'pdf', title: 'Ryokan reservation',         sub: 'Tawaraya · #88241', size: '180 KB', tint: 'honey' },
  { id: 'd4', kind: 'pdf', title: 'Travel insurance',           sub: 'Allianz · policy',  size: '3.2 MB', tint: 'indigo' },
  { id: 'd5', kind: 'img', title: 'Passport copy',              sub: 'all members',       size: '8.1 MB', tint: 'clay'   },
  { id: 'd6', kind: 'pdf', title: 'JR Pass voucher',            sub: 'exchange in Kyoto', size: '420 KB', tint: 'moss'   },
];

const AUDIT = [
  { id: 'a1', who: 'u1', action: 'added',   target: 'Ryokan Tawaraya — 2 nights', when: '09:12' },
  { id: 'a2', who: 'u2', action: 'edited',  target: 'Omakase · Gion Sasaki',      when: '08:04' },
  { id: 'a3', who: 'u3', action: 'uploaded',target: 'JR Pass voucher.pdf',         when: 'Yesterday' },
  { id: 'a4', who: 'u1', action: 'invited', target: 'jules@p.co',                  when: 'Apr 02' },
];

// All trips visible to the current user — mix of private and shared.
const TRIPS = [
  { id: 'kyoto-26',   title: 'Kyoto',       sub: 'Hanami run',          dates: 'Apr 03 — 14',  country: 'JP', shared: true,  members: 4, cover: 'kyoto',     budgetPct: 68, status: 'active' },
  { id: 'lisbon-25',  title: 'Lisbon',      sub: 'Solo retreat',        dates: 'Sep 12 — 22',  country: 'PT', shared: false, members: 1, cover: 'lisbon',    budgetPct: 92, status: 'past' },
  { id: 'oaxaca-25',  title: 'Oaxaca',      sub: 'Mezcal trail',        dates: 'Nov 01 — 09',  country: 'MX', shared: true,  members: 3, cover: 'oaxaca',    budgetPct: 76, status: 'past' },
  { id: 'lofoten-26', title: 'Lofoten',     sub: 'Northern lights',     dates: 'Dec 28 — Jan 04', country: 'NO', shared: false, members: 1, cover: 'lofoten', budgetPct: 12, status: 'upcoming' },
  { id: 'patagon-26', title: 'Patagonia',   sub: 'Glacier hike',        dates: 'Feb 04 — 18',  country: 'AR', shared: true,  members: 5, cover: 'patagon',   budgetPct: 24, status: 'upcoming' },
];

// Global, lifetime (app-level) stats
const GLOBAL = {
  countries: 14, continents: 4, days: 187, lifetimeUSD: 28412,
  longestTrip: { name: 'Patagonia', days: 22 },
  topCategory:   { name: 'Lodging', usd: 11240, pct: 39 },
  byContinent: [
    { name: 'Europe',        days: 78, color: 'var(--indigo)' },
    { name: 'Asia',          days: 54, color: 'var(--clay)' },
    { name: 'South America', days: 32, color: 'var(--moss)' },
    { name: 'North America', days: 23, color: 'var(--honey)' },
  ],
  yearly: [
    { y: 2020, days: 12, usd: 1800 },
    { y: 2021, days: 18, usd: 2400 },
    { y: 2022, days: 34, usd: 5100 },
    { y: 2023, days: 41, usd: 6200 },
    { y: 2024, days: 38, usd: 7400 },
    { y: 2025, days: 44, usd: 5512 },
  ],
};

// Docs nested by category — replaces flat list for the vault
const DOC_CATEGORIES = [
  { key: 'flights',      label: 'Flights',      tint: 'indigo', icon: 'plane',  count: 4 },
  { key: 'lodging',      label: 'Accommodation',tint: 'clay',   icon: 'bed',    count: 3 },
  { key: 'visas',        label: 'Visas & Official', tint: 'moss',  icon: 'stamp',  count: 5 },
  { key: 'transport',    label: 'Rentals',          tint: 'honey', icon: 'rail',   count: 3 },
];

const DOCS_BY_CAT = {
  flights: [
    { id: 'f1', kind: 'pdf', title: 'KLM 8721 · AMS → KIX',      sub: 'Apr 03 · 11:40', size: '2.1 MB', tint: 'indigo', link: 'https://checkin.klm.com', linkLabel: 'Online check-in', photos: [] },
    { id: 'f2', kind: 'pdf', title: 'KLM 8722 · KIX → AMS',      sub: 'Apr 14 · 19:25', size: '2.0 MB', tint: 'indigo', link: 'https://checkin.klm.com', linkLabel: 'Online check-in', photos: [] },
    { id: 'f3', kind: 'pdf', title: 'Seat selection',             sub: 'window 18A',     size: '410 KB', tint: 'indigo', link: null, photos: [] },
    { id: 'f4', kind: 'img', title: 'Frequent flyer · KLM',       sub: 'Elite Plus',     size: '1.4 MB', tint: 'indigo', link: 'https://klm.com/frequentflyer', linkLabel: 'Flying Blue portal', photos: [] },
  ],
  lodging: [
    { id: 'l1', kind: 'pdf', title: 'Ryokan Tawaraya · 2 nights', sub: 'Confirmation #88241', size: '180 KB', tint: 'clay', link: 'https://maps.google.com/?q=Tawaraya+Kyoto+Japan', linkLabel: 'Google Maps', photos: ['photo'] },
    { id: 'l2', kind: 'pdf', title: 'Park Hyatt Kyoto · 5 nights',sub: 'Confirmation #A7-44', size: '320 KB', tint: 'clay', link: 'https://maps.google.com/?q=Park+Hyatt+Kyoto', linkLabel: 'Google Maps', photos: ['photo'] },
    { id: 'l3', kind: 'img', title: 'Airbnb check-in note',       sub: 'Kawabata-dōri',  size: '780 KB', tint: 'clay', link: null, photos: ['photo'] },
  ],
  visas: [
    { id: 'v1', kind: 'img', title: 'Japan visa stamp',           sub: '4032×3024',      size: '4.6 MB', tint: 'moss', link: 'https://www.mofa.go.jp/j_info/visit/visa/', linkLabel: 'MOFA visa info', photos: ['photo'] },
    { id: 'v2', kind: 'pdf', title: 'Travel insurance · Allianz', sub: 'policy A-44291', size: '3.2 MB', tint: 'moss', link: 'https://allianz-assistance.com', linkLabel: 'Allianz portal', photos: [] },
    { id: 'v3', kind: 'img', title: 'Passport copy · all crew',   sub: '4 members',      size: '8.1 MB', tint: 'moss', link: null, photos: ['photo'] },
    { id: 'v4', kind: 'pdf', title: 'Vaccination record',          sub: 'WHO carte jaune',size: '480 KB', tint: 'moss', link: null, photos: [] },
    { id: 'v5', kind: 'pdf', title: 'Emergency contacts',          sub: 'embassy + family',size: '90 KB', tint: 'moss', link: 'https://jp.usembassy.gov', linkLabel: 'Embassy website', photos: [] },
  ],
  transport: [
    { id: 't1', kind: 'pdf', title: 'JR Pass voucher',             sub: 'exchange in Kyoto',size: '420 KB', tint: 'honey', link: 'https://www.jrpass.com', linkLabel: 'JR Pass site', photos: [] },
    { id: 't2', kind: 'pdf', title: 'Shinkansen · Kyoto → Tokyo',  sub: 'reserved · car 9', size: '210 KB', tint: 'honey', link: 'https://maps.google.com/?q=Kyoto+Station', linkLabel: 'Kyoto Station map', photos: [] },
    { id: 't3', kind: 'img', title: 'IC card · Suica top-up',      sub: '¥10,000 loaded',   size: '220 KB', tint: 'honey', link: null, photos: ['photo'] },
  ],
};

// Trip-level analytics
const TRIP_ANALYTICS = {
  dailyAvgUSD: 477.4,
  dailyPlanUSD: 382,
  topDay: { date: 'Apr 04', usd: 612 },
  contribs: [
    { id: 'u1', usd: 1142, pct: 40 },
    { id: 'u2', usd: 802,  pct: 28 },
    { id: 'u3', usd: 632,  pct: 22 },
    { id: 'u4', usd: 288,  pct: 10 },
  ],
  spendByDay: [120, 410, 612, 280, 540, 902.32],
};

Object.assign(window, {
  TRIP, MEMBERS, CATEGORIES, EXPENSES, DOCS, AUDIT,
  TRIPS, GLOBAL, DOC_CATEGORIES, DOCS_BY_CAT, TRIP_ANALYTICS,
});
