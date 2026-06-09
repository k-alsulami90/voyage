# Voyage — Arabic Translations Reference

This document collects every Arabic string used in the app, organized by screen and condition. Use this as the canonical source for rewriting the Arabic copy. Hand it back with your edits and we'll patch every file accordingly.

There are two layers of Arabic text in the codebase:

1. **i18n dictionary keys** in `i18n.jsx` (the `ar:` object, lines 195–380). Accessed via `t('keyName')`. Same key is used in many places. **Edit the value once and it changes everywhere.**
2. **Inline `window.isRTL ? 'AR' : 'EN'` strings** scattered through screen files (confirm dialogs, toasts, placeholders, ad-hoc labels). Each one is **edited at its own location.**

Throughout this doc:
- **{placeholder}** = a value injected at runtime (e.g. amount, name, count, currency code).
- File:line references point to where the string lives if you want to grep for them.

---

## 1. Auth — sign in / sign up / forgot / reset password

**File**: `screen-auth.jsx`. Dictionary section: `i18n.jsx:196-204`.

### Tagline & headlines (over the dark cover art)
| Where shown | Key / inline | Arabic |
|---|---|---|
| Small tagline above the giant title | `tagline` | لمن يحب التجوال |
| Giant serif-italic title on sign-in | `welcomeBack` | أهلاً\nبعودتك. |
| Giant serif-italic title on sign-up | `startLedger` | ابدأ\nسجل رحلاتك. |

### Mode toggle pill (sign in ↔ sign up)
| Where | Key | Arabic |
|---|---|---|
| Pill labels | `signIn`, `signUp` | تسجيل الدخول / إنشاء حساب |

### Form fields
| Where | Key | Arabic |
|---|---|---|
| Full name field label (sign up only) | `fullName` | الاسم الكامل |
| Full name placeholder (auth.jsx:195) | inline | الاسم الكامل |
| Email field label | `email` | البريد الإلكتروني |
| Password field label | `password` | كلمة المرور |
| "Forgot password?" link beside password label | `forgotPassword` | نسيت؟ |
| New password label (in reset mode, auth.jsx:205) | inline | كلمة مرور جديدة |
| Confirm password label (in reset mode, auth.jsx:213) | inline | تأكيد كلمة المرور |

### Forgot / reset mode headers
| Where | Inline location | Arabic |
|---|---|---|
| Forgot mode title (serif 22px) | auth.jsx:173 | استعادة كلمة المرور |
| Forgot mode subtitle | auth.jsx:176 | سنرسل رابطاً لبريدك |
| Reset mode title (after clicking email link) | auth.jsx:183 | كلمة مرور جديدة |

### Submit buttons
| Where | Key/Inline | Arabic |
|---|---|---|
| Sign-in submit ("Continue") | `continue` | متابعة |
| Sign-up submit ("Create my ledger") | `createLedger` | إنشاء سجلي |
| Forgot password submit (auth.jsx:293) | inline | إرسال رابط التعيين |
| Reset password submit (auth.jsx:294) | inline | تحديث كلمة المرور |

### Terms agreement (sign up only, beneath form)
| Where | Key | Arabic |
|---|---|---|
| Terms text | `agreeTerms` | أوافق على شروط وخصوصية Voyage. الرحلات خاصة افتراضياً. |

### Confirmation / notice cards (moss-tinted)
| Condition | Where | Arabic |
|---|---|---|
| Sign-up returned no session (email confirm needed) | auth.jsx:223 | ✉️ تحقق من بريدك الإلكتروني واضغط على رابط التأكيد، ثم عُد وسجّل الدخول |
| Resend confirmation button below | auth.jsx:227 | إعادة الإرسال |
| Reset link sent | auth.jsx:239 | ✉️ تحقق من بريدك واضغط على رابط التعيين |

### Footer toggle (sign in ↔ sign up switch)
| Mode | Key | Arabic |
|---|---|---|
| Showing on sign-up | `alreadyHaveAccount` + `signinLink` | لديك حساب؟ + دخول |
| Showing on sign-in | `newToVoyage` + `createOne` | جديد في Voyage؟ + إنشاء حساب |

### "Back to sign in" link (forgot / reset mode)
| Where | Inline | Arabic |
|---|---|---|
| auth.jsx:312 | inline | ← العودة لتسجيل الدخول |

### Error messages (thrown from handleSubmit)
| Trigger | Where | Arabic |
|---|---|---|
| Sign-in/up missing email or password | auth.jsx:40,48 | أكمل الحقول |
| Forgot mode missing email | auth.jsx:51 | أدخل بريدك |
| Sign-in helper not loaded (CDN issue) | auth.jsx:36 | لم تكتمل تحميل صفحة تسجيل الدخول — أعد تحميل التطبيق |
| Reset password < 6 chars | auth.jsx:58 | ٦ أحرف على الأقل |
| Reset password mismatch | auth.jsx:59 | كلمتا المرور غير متطابقتين |

### Toast confirmations
| Trigger | Where | Arabic |
|---|---|---|
| Reset link sent successfully | auth.jsx:54 | تم إرسال رابط التعيين |
| Password updated successfully | auth.jsx:61 | تم تحديث كلمة المرور |
| Confirmation resent | auth.jsx:81 | تم إعادة الإرسال |

---

## 2. Onboarding — first-run 3-step flow

**File**: `screen-onboarding.jsx`. Dictionary section: `i18n.jsx:229-253`.

### Top bar
| Where | Key | Arabic |
|---|---|---|
| Step indicator | `obStep` | الخطوة {a} من {b} |
| Skip button (top-right) | `obSkip` | تخطٍ |

### Step 1 — Welcome
| Where | Key | Arabic |
|---|---|---|
| Big serif-italic title (46px) | `obWelcomeTitle` | مرحباً بك في\nVoyage |
| Subtitle below | `obWelcomeSub` | خطط لرحلاتك، تتبع مصروفاتك، وشارك التجربة مع فريقك. |

**Feature cards (3 rows):**
| Row | Title key / Sub key | Arabic title / sub |
|---|---|---|
| 1 | `obFeature1Title` / `obFeature1Sub` | متعدد العملات والدول / رحلة واحدة عبر السعودية، أوروبا أو اليابان — كل العملات. |
| 2 | `obFeature2Title` / `obFeature2Sub` | مشاركة مع الطاقم / محدود بالرحلة: الضيوف يرون فقط ما تدعوهم إليه. |
| 3 | `obFeature3Title` / `obFeature3Sub` | إحصائيات شاملة / كل مصروف، كل دولة، في لوحة واحدة. |

### Step 2 — Basics (form fields)
| Where | Key | Arabic |
|---|---|---|
| Big title | `obBasicsTitle` | بعض المعلومات |
| Subtitle | `obBasicsSub` | نستخدمها لاختيار الإعدادات المناسبة لك. |
| Name field label | `obNameLabel` | اسمك |
| Name placeholder | `obNamePlaceholder` | كريم |
| Home base field label | `obHomeLabel` | مدينتك |
| Home base placeholder | `obHomePlaceholder` | مكة، الرياض، دبي… |
| Default currency field label | `obCurrencyLabel` | العملة الافتراضية |

### Step 3 — Done (success screen)
| Where | Key | Arabic |
|---|---|---|
| Big title (uses user's first name + this) | `obDoneTitle` | كل شيء جاهز |
| Subtitle | `obDoneSub` | أنشئ أول رحلة لك أو ابدأ بالاستكشاف. |
| "Name" row label (onboarding.jsx:308) | inline | الاسم |
| "Home base" row label | `homeBase` | المدينة الرئيسية |
| "Default currency" row label | `defaultCurrency` | العملة الافتراضية |

### Action buttons (bottom of screen)
| Where | Key | Arabic |
|---|---|---|
| "Get started" (step 1 → 2) | `obGetStarted` | لنبدأ |
| "Continue" (step 2 → 3) | `obContinue` | متابعة |
| "Back" (steps 2,3) | `obBack` | رجوع |
| "Explore" (step 3, skip creating trip) | `obExplore` | استكشاف فقط |
| "Create first trip" (step 3 primary CTA) | `obCreateTrip` | إنشاء أول رحلة |

### Toast on finish
| Trigger | Where | Arabic |
|---|---|---|
| Onboarding saved successfully | onboarding.jsx:57 | مرحباً بك |

---

## 3. Trips Home — list of all trips (global view)

**File**: `screen-trips.jsx`. Dictionary section: `i18n.jsx:205-227`.

### Header
| Where | Key | Arabic |
|---|---|---|
| Large title | `yourTravels` | رحلاتك |
| Search button aria-label | trips.jsx:233 | بحث |
| Search input placeholder | trips.jsx:243 | ابحث عن رحلة... |

### Lifetime overview (editorial sentence card)
The card is dynamic — composed from counts. The current sentence uses raw English numbers; the surrounding chrome:
| Where | Key | Arabic |
|---|---|---|
| "See insights" link (right of card) | trips.jsx:206 | الإحصائيات |

### Section headers
| Where | Key | Arabic |
|---|---|---|
| Currently traveling section | `currentlyTraveling` | في رحلة الآن |
| Upcoming section | `upcoming` | القادمة |
| Past trips section | `pastTrips` | الرحلات السابقة |
| "Up next" event title above smart-track card | trips.jsx:257 | القادم |
| "See all" link on section headers | `seeAll` | عرض الكل |
| "Lifetime · all trips" | `lifetimeAllTrips` | المجموع الكلي |

### Empty state (no trips yet)
| Where | Inline | Arabic |
|---|---|---|
| Big serif title | trips.jsx:316 | لا توجد رحلات بعد |
| Body text | trips.jsx:319 | ستظهر رحلاتك هنا بمجرد إنشائها |

### Smart Track card (next event countdown)
| Where | Inline | Arabic |
|---|---|---|
| "Trip" pill (above event title) | trips.jsx:804 | الرحلة |
| "Location" action pill | trips.jsx:794, 855 | الموقع |

### Current trip card (the live one)
| Where | Inline | Arabic |
|---|---|---|
| "LIVE" pill (top-left overlay) | trips.jsx:374 | مباشر |
| Subtitle fallback "{N} days remaining" | trips.jsx:391 | أيام متبقية |
| "Budget used" label | trips.jsx:407 | الميزانية |

### Past trip card
| Where | Key | Arabic |
|---|---|---|
| "Completed" badge | `completed` | مكتملة |
| "Lasted N days" text | `lastedDays` | {n} أيام |
| Trip card aria-label | trips.jsx:864 | افتح الرحلة |

### Dynamic trip state labels (used per card)
| State | Key | Arabic |
|---|---|---|
| Trip starts today | `startingToday` | تبدأ اليوم |
| In progress | `inProgress` | جارية |
| Day N of M | `dayOfTotal` | اليوم {n} من {total} |
| Tomorrow (1 day away) | `dayAway` | غداً |
| N days away | `daysAway` | بعد {n} أيام |
| Spent total label | `spentTotal` | الإجمالي المنفق |
| "of {budget}" suffix | `budgetOf` | من {b} |

---

## 4. Hub — single-trip dashboard

**File**: `screen-hub.jsx`. Uses dictionary heavily.

### Header (over hero photo)
| Where | Inline / Key | Arabic |
|---|---|---|
| Header search button aria-label (line 67) | inline | بحث |
| Day-of-trip pill labels | `dayLbl`, `ofLbl` | اليوم / من |
| "Day N of M" composite | `dayOfTotal` | اليوم {n} من {total} |

### Empty state (no trip selected)
| Where | Inline | Arabic |
|---|---|---|
| Title | hub.jsx:25 | لا توجد رحلة نشطة |
| CTA button | hub.jsx:30 | ← رحلاتي |

### Personal balance card (gradient moss / clay)
**v97 phrasing — single counterparty (most common: 2-person trip):**

Owed (he owes you):
- يدين **{Name}** لك بمبلغ **{amount}**.

Owe (you owe him):
- أنت مدين لـ **{Name}** بمبلغ **{amount}**.

**Multi-counterparty fallback:**
- يدين لك **{n}** {شخص/أشخاص} بإجمالي **{amount}**.
- أنت مدين لـ **{n}** {شخص/أشخاص} بإجمالي **{amount}**.

Below the sentence:
| Where | Key | Arabic |
|---|---|---|
| "Tap to settle" hint | `balanceTapToSettle` | اضغط للتسوية |

aria-labels (read by screen readers, hub.jsx:196):
- يدين {Name} لك بمبلغ {amount}
- أنت مدين لـ {Name} بمبلغ {amount}
- يدين لك {n} أشخاص بإجمالي {amount}
- أنت مدين لـ {n} أشخاص بإجمالي {amount}

### Over-budget alert (when spent > planned)
| Where | Inline | Arabic |
|---|---|---|
| Sentence (hub.jsx:272) | inline | تجاوزت الميزانية بـ **{amount}** ({pct}٪ فوق الخطة). |

### Budget Workspace card
| Where | Inline / Key | Arabic |
|---|---|---|
| Has planned budget (hub.jsx:305) | inline | صرفت **{spent}** من **{planned}**. |
| No planned budget | inline | صرفت **{spent}** حتى الآن. |
| "left on pace · pct%" line | `leftOnPace` | متبقي · في المسار |
| Section subtitle "shared budget" | `sharedBudget` | الميزانية المشتركة |

### Quick Actions tiles (4-tile grid)
| Tile | Key | Arabic |
|---|---|---|
| Add (primary, dark tile) | `add` | إضافة |
| Plan | `planNav` | الخطة |
| Vault | `vaultNav` | المستندات |
| Stats | `statsNav` | إحصائيات |

### Recent activity (3 rows)
| Where | Key | Arabic |
|---|---|---|
| Section header | `recentActivity` | النشاط الأخير |
| Row aria-label (hub.jsx) | inline | تعديل {title}، {amount} |
| Trip title fallback | hub.jsx:136 | رحلة |
| "of Total days" suffix | hub.jsx:150 | يوم |

---

## 5. Budget — expense list, filters, audit log

**File**: `screen-budget.jsx`. Dictionary keys: `budget`, `expenses`, `auditLog`, `totalSpent`, etc.

### Empty state (no trip)
| Where | Inline | Arabic |
|---|---|---|
| budget.jsx:42 | inline | الرجاء فتح رحلة أولاً |

### Statement card (dark hero)
**Editorial sentence (budget.jsx:111):**
- Has planned: صرفت **{spent}** من **{planned}**.
- No planned: صرفت **{spent}** حتى الآن.

| Where | Inline | Arabic |
|---|---|---|
| Days chip (top-right) | budget.jsx:151 | يوم |
| Currency toggle pills (Home / Local) | dynamic | shows currency codes (HOME / LOCAL) |

### Over-budget alert (when spent > planned)
| Where | Inline | Arabic |
|---|---|---|
| Alert sentence | budget.jsx | تجاوزت الميزانية بـ **{amount}** ({pct}٪ فوق الخطة). |

### Expense list header
| Where | Key | Arabic |
|---|---|---|
| "Expenses" title | `expenses` | المصروفات |
| Search button aria-label | budget.jsx:257 | بحث في المصروفات |
| Search input placeholder | budget.jsx:271 | ابحث في المصروفات... |
| Filters button | budget.jsx:303 | فلاتر |

### Filter drawer
| Where | Inline | Arabic |
|---|---|---|
| "Paid by" label | budget.jsx:320 | دفع بواسطة |
| "Day" label | budget.jsx:336 | اليوم |
| "Day N" filter chip | budget.jsx:342 | يوم {d} |
| "All" chip | `all` | الكل |
| "Clear filters" button | budget.jsx:355,456 | مسح الفلاتر |

### Filter summary card (dark, when filters narrow results)
| Where | Inline | Arabic |
|---|---|---|
| Expense count line | budget.jsx:391 | مصروف (or pluralized) |
| "paid by {name}" filter chip | budget.jsx:372 | دفعها {name} |
| "Day {n}" filter label | budget.jsx:375 | يوم |

### Empty states
| Condition | Where | Arabic |
|---|---|---|
| No expenses at all | budget.jsx:417 | لا توجد مصروفات بعد |
| "Add first expense" CTA | budget.jsx:435 | أضف أول مصروف |
| Filter returns zero | budget.jsx:451 | لا توجد نتائج |
| "Show all" reset link | budget.jsx:456 | مسح الفلاتر |

### Expense row interactions
| Action | Where | Arabic |
|---|---|---|
| Confirm delete dialog | budget.jsx:473 | حذف "{title}"؟ |
| Delete success toast | budget.jsx:477 | تم الحذف |

### Audit log
| Where | Key / Inline | Arabic |
|---|---|---|
| "Audit log" section header | `auditLog` | سجل المراجعة |
| Action verbs (used in log entries) | `added` / `edited` / `uploaded` / `invited` | أضاف / عدّل / رفع / دعا |
| Entries count text | budget.jsx:612 | إجراء |

---

## 6. Plan — daily itinerary

**File**: `screen-plan.jsx`. Dictionary section: `i18n.jsx:343-347`.

### Header
| Where | Key | Arabic |
|---|---|---|
| Large title | `planNav` | الخطة |

### Empty states
| Condition | Where | Arabic |
|---|---|---|
| No trip open | plan.jsx:18 | الرجاء فتح رحلة أولاً |
| Trip has no dates set | plan.jsx:65 | لا توجد أيام للتخطيط بعد |
| Settings CTA | plan.jsx:79 | إعدادات الرحلة |

### Day header
| Where | Inline / Key | Arabic |
|---|---|---|
| "Day N" label (plan.jsx:162) | inline | اليوم {dayNumber} |
| Add activity button | `planAddBtn` | إضافة |
| Add button aria-label | plan.jsx:172 | إضافة نشاط |

### Empty day row (no activities planned)
| Where | Key | Arabic |
|---|---|---|
| "Nothing planned yet" text | `planEmptyDay` | لا يوجد شيء مخطط — اضغط للإضافة |

### Plan row (per activity)
| Where | Inline / Key | Arabic |
|---|---|---|
| Location pill aria-label | plan.jsx:289 | الموقع: {location} |
| "Log expense" pill | `planLogExpense` | تسجيل مصروف |
| Log expense aria-label | plan.jsx:303 | سجل مصروف لهذا النشاط |

### Add / Edit activity sheet
| Where | Key | Arabic |
|---|---|---|
| Add sheet title | `planAddTitle` | إضافة للخطة |
| Edit sheet title | `planEditTitle` | تعديل النشاط |
| Activity title field label | `planFieldTitle` | النشاط |
| Title placeholder | plan.jsx:383 | مثلاً: زيارة المتحف |
| Category field label | `planFieldCategory` | الفئة |
| Time field label | `planFieldTime` | الوقت (اختياري) |
| Location field label | `planFieldLocation` | الموقع (اختياري) |
| Location placeholder | plan.jsx:418 | العنوان أو اسم المكان |
| Title required validation | `planTitleReq` | أدخل عنواناً |

### Plan category labels (PLAN_CAT_META, plan.jsx:131-135)
| Category | Arabic label |
|---|---|
| food | طعام |
| sight | معلم |
| transport | تنقل |
| lodging | إقامة |
| misc | متنوع |

### Save/cancel/delete buttons
| Action | Inline | Arabic |
|---|---|---|
| Save (new activity) | plan.jsx:454 | إضافة للخطة |
| Save (edit existing) | plan.jsx:453 | حفظ التعديلات |
| Save while in flight | plan.jsx:451 | جارٍ الحفظ… |
| Delete activity | plan.jsx:441 | حذف |
| Confirm delete dialog | plan.jsx:354 | حذف هذا النشاط؟ |

### Plan row swipe-to-delete
| Action | Inline | Arabic |
|---|---|---|
| Confirm delete dialog | plan.jsx:215 | حذف "{title}"؟ |
| Delete toast | plan.jsx:219 | تم الحذف |

---

## 7. Analytics — per-trip charts (currently-open trip)

**File**: `screen-analytics.jsx`. Dictionary uses `statsNav`, `used`.

### Empty state
| Where | Inline | Arabic |
|---|---|---|
| Title (analytics.jsx:125) | inline | لا توجد بيانات بعد |
| Body | analytics.jsx:128 | أضف مصروفات لرؤية الإحصائيات هنا |
| Go-to-Budget CTA | analytics.jsx:133 | ← الميزانية |

### Daily Average hero card (dark statement)
Editorial sentence (analytics.jsx:170 area):
- With plan: تصرف **{dailyAvg}** يومياً، الخطة **{dailyPlan}**. **{burnPct}%**
- Without plan: تصرف **{dailyAvg}** يومياً.

| Where | Inline | Arabic |
|---|---|---|
| "Days" chip top-right | analytics.jsx:198 | يوم |

### Day-by-day chart
| Where | Inline | Arabic |
|---|---|---|
| "Daily" legend swatch | analytics.jsx:379 | يومي |
| "Running total" legend swatch | analytics.jsx:383 | تراكمي |
| "Budget" reference line label | analytics.jsx:255,388 | الميزانية |
| "Peak: {amount}" inline annotation | analytics.jsx | أعلى يوم: {amount} |

### Selected-day detail card (appears when bar tapped)
| Where | Inline | Arabic |
|---|---|---|
| "Day N" headline | analytics.jsx:424 | اليوم {dayNum} |
| Empty day text | analytics.jsx:460 | لا مصروفات في هذا اليوم |

### Top transaction card
| Where | Inline | Arabic |
|---|---|---|
| Quiet label inside the row | analytics.jsx:498 | أكبر مصروف |

### Category breakdown section
| Where | Inline | Arabic |
|---|---|---|
| Section header | analytics.jsx:516 | حسب الفئة |
| Total footer label | analytics.jsx:546 | المجموع |

### "Who's paying" contributor section
| Where | Inline | Arabic |
|---|---|---|
| Section header | analytics.jsx:558 | من يدفع |
| Member pct line | analytics.jsx:589 | من الإجمالي |

### Day-by-day list
| Where | Inline | Arabic |
|---|---|---|
| Section header | analytics.jsx:601 | يوم بيوم |
| "Day N" or fallback to date | analytics.jsx:630 | يوم {dayNum} |
| Zero-spend row label | analytics.jsx:663 | لا مصروفات |

### Pace summary (bottom editorial sentence card)
| Where | Inline | Arabic |
|---|---|---|
| Section header | analytics.jsx:695 | الإيقاع |
| Sentence (with budget) | analytics.jsx:701 | صرفت **{total}** من **{planned}**، بمعدل **{daily}** يومياً. بهذا الإيقاع ستنهي الرحلة على **{projected}**. |
| Sentence (no budget) | analytics.jsx:707 | صرفت **{total}** بمعدل **{daily}** يومياً. بهذا الإيقاع ستنهي الرحلة على **{projected}**. |

---

## 8. Insights — Year Ledger (lifetime, global view)

**File**: `screen-insights.jsx`. Dictionary section: `i18n.jsx:300-323`.

### Header
| Where | Key | Arabic |
|---|---|---|
| Large title | `insightsTitle` | إحصائيات شاملة |
| Subtitle | `insightsSub` | كل رحلة، كل مصروف — في لمحة |

### Empty state (no trips yet)
| Where | Key / Inline | Arabic |
|---|---|---|
| Title | `noInsightsYet` | لا توجد بيانات بعد |
| Body | `noInsightsSub` | أضف رحلات ومصاريف لترى الإحصائيات الشاملة |
| Go-to-Trips CTA | insights.jsx:68 | ← الرحلات |

### Year Hero
| Where | Inline | Arabic |
|---|---|---|
| Small label above the year number | insights.jsx:154 | سنة السفر |

### Ledger sentence (under the year)
Composed sentence (insights.jsx LedgerSentence):
- **{trips}** {رحلة/رحلات}، في **{countries}** {دولة/دول}، خلال **{days}** يوم سفر. صرفت **{spent}** بمعدل **{dailyAvg}** يومياً.

### Notable trips chapter
| Where | Inline | Arabic |
|---|---|---|
| Title (different trip is longest + biggest) | insights.jsx | الأبرز عبر الرحلات |
| Subtitle | insights.jsx | عبر كل رحلاتك |
| "Longest" label | insights.jsx | الأطول |
| "Biggest" label | insights.jsx | الأكثر إنفاقاً |
| Title (same trip is both) | insights.jsx | الأبرز عبر الرحلات (singular) |
| Combined subtitle | insights.jsx | الأطول والأغلى في رحلاتك |
| Combined stat line | insights.jsx | {dur} يوم · {amount} |

### Category stack chapter
| Where | Inline | Arabic |
|---|---|---|
| Title | insights.jsx | كيف تصرف |
| Subtitle | insights.jsx | لكل الرحلات |
| Total footer label | insights.jsx | الإجمالي |

Category labels:
| Key | Arabic |
|---|---|
| `lodging` | الإقامة |
| `food` | الطعام |
| `transit` | المواصلات |
| `culture` | الثقافة |
| `misc` | متنوع |

### Monthly sparkline chapter
| Where | Inline | Arabic |
|---|---|---|
| Title | insights.jsx | متى سافرت |
| Subtitle | insights.jsx | آخر 12 شهر |
| Busiest month micro-line | insights.jsx | الأنشط: {month year} · {amount} |

### Trip list chapter
| Where | Inline | Arabic |
|---|---|---|
| Title | insights.jsx | رحلات {year} |
| Subtitle | insights.jsx | {n} {رحلة/رحلات} |
| Row aria-label | insights.jsx | افتح {title} |
| Days suffix | insights.jsx | يوم |

### Previous years chapter
| Where | Inline | Arabic |
|---|---|---|
| Title | insights.jsx | السنوات السابقة |
| Per-row trips count | insights.jsx | {n} {رحلة/رحلات} · {amount} |

### Lifetime imprint footer
| Where | Inline | Arabic |
|---|---|---|
| Lifetime line | insights.jsx | الإجمالي: {n} رحلة · {countries} {دولة/دول} \n {days} يوم سفر · {amount} |

### Dictionary keys also used (in legacy summary card / older surfaces)
| Key | Arabic |
|---|---|
| `kpiTotalTrips` | إجمالي الرحلات |
| `kpiCountries` | الدول |
| `kpiTravelDays` | أيام السفر |
| `kpiLifetimeSpent` | الإجمالي المنفق |
| `sectionByYear` | سنة بسنة |
| `sectionByCategory` | أين يذهب المال |
| `sectionTopTrips` | أعلى الرحلات إنفاقاً |
| `sectionTripStatus` | حالة الرحلات |
| `sectionMembers` | أكبر المساهمين |
| `sectionPace` | وتيرة الإنفاق |
| `statAvgTrip` | متوسط الرحلة |
| `statLongestTrip` | الأطول |
| `statDailyAvg` | المعدل اليومي |
| `statTopTransaction` | أكبر مصروف |
| `statMostExpensive` | الأغلى |
| `statTotalExpenses` | مصاريف مسجلة |
| `statCurrencies` | العملات المستخدمة |
| `yearTrips` / `yearDays` | {n} رحلة / {n} يوم |
| `statusCurrent` / `statusUpcoming` / `statusPast` | جارية / قادمة / سابقة |
| `ofTotal` | ٪ من الإجمالي |
| `used` | مستخدم |

---

## 9. Vault — documents grid/list (global view)

**File**: `screen-docs.jsx`. Dictionary section: `vault`, `addDocument`, etc.

### Header
| Where | Key | Arabic |
|---|---|---|
| Large title | `vault` | المستندات |
| Search placeholder | docs.jsx:88 | ابحث في المستندات... |

### Filter chips
| Where | Key | Arabic |
|---|---|---|
| "All" chip | `all` | الكل |
| Category chips (each) | `docFlights`, `docLodging`, `docVisas`, `docTransport` | الرحلات / الفنادق / التأشيرات / الإيجارات |

### View toggle
| Where | Inline | Arabic |
|---|---|---|
| Grid pill aria-label | docs.jsx:267 | شبكة |
| List pill aria-label | docs.jsx:268 | قائمة |

### Sort menu
| Where | Inline | Arabic |
|---|---|---|
| Button label "Sort:" prefix | docs.jsx:326 | الترتيب |
| Button aria-label "Sort: Newest" | docs.jsx:320 | الترتيب: {current} |
| Options | docs.jsx:308-310 | الأحدث / الاسم / الفئة |

### Status pill (per document)
| Where | Inline | Arabic |
|---|---|---|
| Synced (has uploaded file) | docs.jsx:372 | محفوظ |
| Link (URL-only, no file) | docs.jsx:373 | رابط |
| Pending (no file yet) | docs.jsx:374 | بانتظار الرفع |

### Add tile (in grid)
| Where | Inline | Arabic |
|---|---|---|
| Label below dashed border | docs.jsx:203 | إضافة |

### Empty states
| Condition | Where | Arabic |
|---|---|---|
| Filter empty (category selected) | docs.jsx:154 | لا يوجد في {catLabel} |
| Filter empty (search active) | docs.jsx:155 | لا توجد نتائج |
| Filter "Add {Category}" CTA | docs.jsx:168 | أضف {catLabel} |
| "Show all" link | docs.jsx:174 | الكل |
| Empty vault (no docs at all) | docs.jsx:559 | مستوداع المستندات فارغ |
| Empty CTA button | docs.jsx:574 | إضافة أول مستند |

### Swipe-to-delete row
| Action | Where | Arabic |
|---|---|---|
| Confirm delete dialog | docs.jsx:220 | حذف "{title}"؟ |
| Delete success toast | docs.jsx:224 | تم الحذف |

---

## 10. Doc Detail — single document view + edit mode

**File**: `screen-doc-detail.jsx`.

### Top buttons (over cover photo)
| Where | Inline | Arabic |
|---|---|---|
| Save button (edit mode) | doc-detail.jsx:219 | حفظ |
| Cover photo "Change" (when cover exists) | doc-detail.jsx:243 | تغيير |
| Cover photo "Add cover" (no cover yet) | doc-detail.jsx:243 | إضافة |

### Section headers (read mode + edit mode)
| Where | Inline | Arabic |
|---|---|---|
| "Details" section (read & edit) | doc-detail.jsx:291,338 | التفاصيل |
| "Cost" section (read & edit) | doc-detail.jsx:314,368 | التكلفة |
| "Category" field label (edit) | doc-detail.jsx:295 | الفئة |
| "Files" section | doc-detail.jsx:416 | الملفات |

### Cost + expense toggle row (read mode)
| Where | Inline | Arabic |
|---|---|---|
| Logged-in-expenses status | doc-detail.jsx:387 | مُسجَّل في المصروفات |
| Not-logged status | doc-detail.jsx:391 | غير مُسجَّل في الميزانية |
| Add to expenses button | doc-detail.jsx:406 | أضف |
| Remove from expenses button | doc-detail.jsx:405 | إزالة |

### File row component
| Where | Inline | Arabic |
|---|---|---|
| "Uploaded" placeholder name | doc-detail.jsx:423,436 | مرفوع |
| "No file yet" empty state | doc-detail.jsx:534 | لا يوجد ملف |
| Open file button | doc-detail.jsx:547 | فتح |
| Replace button (when file exists) | doc-detail.jsx:556 | استبدال |
| Upload button (no file) | doc-detail.jsx:556 | رفع |

### "Open" link (DocInfoRow with URL type)
| Where | Inline | Arabic |
|---|---|---|
| URL row open link | doc-detail.jsx:487 | افتح |

### Delete document button (edit mode, at bottom)
| Where | Inline | Arabic |
|---|---|---|
| Button label | doc-detail.jsx:462 | حذف المستند |

### Confirms & toasts
| Trigger | Where | Arabic |
|---|---|---|
| Confirm remove cover photo | doc-detail.jsx:85 | إزالة صورة الغلاف؟ |
| Confirm remove primary file | doc-detail.jsx:93 | إزالة الملف؟ |
| Confirm remove secondary file | doc-detail.jsx:101 | إزالة الملف؟ |
| Confirm delete document | doc-detail.jsx:146 | حذف هذا المستند؟ |
| Title required error toast | doc-detail.jsx:110 | العنوان مطلوب |
| Save success toast | doc-detail.jsx:124 | تم الحفظ |
| File replaced toast | doc-detail.jsx:57,68 | تم الاستبدال |
| Added to expenses toast | doc-detail.jsx:139 | أُضيف للمصروفات |
| Removed from expenses toast | doc-detail.jsx:136 | أُزيل من المصروفات |
| Auto link label (when URL set) | doc-detail.jsx:120 | الموقع |

---

## 11. Add Doc — multi-step new-document flow

**File**: `screen-add-doc.jsx`.

### Header & navigation
| Where | Inline | Arabic |
|---|---|---|
| Page title | add-doc.jsx:108 | مستند جديد |
| Cancel button | add-doc.jsx:286 | إلغاء |
| Save button | add-doc.jsx:304 | حفظ |
| "Optional" badge (per step) | add-doc.jsx:343 | اختياري |

### Step 1 — What is it?
| Where | Inline | Arabic |
|---|---|---|
| Step title | add-doc.jsx:116 | النوع |

(Category buttons use `docFlights` / `docLodging` etc from dictionary — see §1 above.)

### Step 2 — Title
The step title comes from the per-category `titleLabel()` (see §15 Document Schemas below).

### Step 3 — Details
| Where | Inline | Arabic |
|---|---|---|
| Step title | add-doc.jsx:150 | التفاصيل |

(Field labels come from per-category schemas — see §15.)

### Step 4 — Primary file
File label comes from schema (e.g. "التذكرة الإلكترونية" for flights).
| Where | Inline | Arabic |
|---|---|---|
| File-type hint | add-doc.jsx:157 | PDF أو صورة — حتى 25 ميغا |

### Cost step (if category opts in)
| Where | Inline | Arabic |
|---|---|---|
| Step title | add-doc.jsx:170 | التكلفة |
| "Add to expenses" checkbox label | add-doc.jsx:193 | أضف إلى المصروفات |
| Helper text below checkbox | add-doc.jsx:196 | سيُسجَّل تلقائياً في الميزانية |

### Cover photo step
| Where | Inline | Arabic |
|---|---|---|
| Step title | add-doc.jsx:205 | صورة الغلاف |
| Replace button | add-doc.jsx:230 | تغيير |
| Add a photo CTA | add-doc.jsx:246 | إضافة صورة |

### FilePicker component (re-used)
| Where | Inline | Arabic |
|---|---|---|
| File size + replace hint | add-doc.jsx:469 | اضغط للاستبدال |
| Empty state CTA | add-doc.jsx:484 | اختر ملفاً |
| File-type hint | add-doc.jsx:487 | PDF أو صورة |

### Validation
| Trigger | Where | Arabic |
|---|---|---|
| Missing title | add-doc.jsx:52 | أدخل عنواناً |
| Auto link label | add-doc.jsx:70 | الموقع |

---

## 12. Trip Settings — single-trip settings

**File**: `screen-settings.jsx`. Dictionary uses `settings`, `crewSection`, etc.

### Header & cover
| Where | Inline / Key | Arabic |
|---|---|---|
| Page title | `settings` | الإعدادات |
| "Edit cover" pill | `editCover` | تعديل الغلاف |
| Uploading state | settings.jsx:81 | جاري الرفع... |
| Empty state (no trip) | settings.jsx:37 | الرجاء فتح رحلة أولاً |

### Crew section header
| Where | Key | Arabic |
|---|---|---|
| Section label "Crew · N" | `crewSection` + count | الطاقم · {N} |
| "Invite" action button | `invite` | دعوة |

### Crew strip (avatars + counts sentence)
| Where | Inline | Arabic |
|---|---|---|
| "{N} travelers" headline | `travelers` | مسافرون |
| Role tally inline (plural) | settings.jsx:123 | مديرون |
| Role tally inline (plural) | settings.jsx:124 | محررون |
| Role tally inline (plural) | settings.jsx:125 | مشاهدون |

Singular forms come from `t('admin')` / `t('editor')` / `t('viewer')` (مشرف / محرر / قارئ).

### Member row labels
| Where | Inline | Arabic |
|---|---|---|
| Self (owner) sub-line | settings.jsx:158 | أنت · المالك |
| Other member sub-line | settings.jsx:158 | عضو في الرحلة |
| Confirm remove member | settings.jsx:141 | إزالة {name} من الرحلة؟ |
| Remove success toast | settings.jsx:145 | تمت الإزالة |

### Permissions matrix (collapsed under "View permissions")
| Where | Key | Arabic |
|---|---|---|
| Disclosure button | `viewPermissions` | عرض الصلاحيات |

Matrix rows (settings.jsx:189-193):
| Permission | Arabic |
|---|---|
| View trip & docs | عرض الرحلة والمستندات |
| Add expenses & docs | إضافة مصروفات ومستندات |
| Invite members | دعوة أعضاء |
| Edit trip settings | تعديل إعدادات الرحلة |
| Archive or delete | أرشفة أو حذف |

Column headers (settings.jsx:227-229):
| Where | Arabic |
|---|---|
| Admin | مدير |
| Editor | محرر |
| Viewer | مشاهد |

### Active invites list
| Where | Key / Inline | Arabic |
|---|---|---|
| Section header | `activeInvites` | الروابط النشطة |
| Per-row expiry hint | settings.jsx:329 | ينتهي خلال {n} يوم |
| Copy button | `copy` | نسخ |
| Empty state | settings.jsx:351 | لا توجد روابط نشطة |
| Inactive count line | settings.jsx:359 | رابط منتهي أو ملغى |
| Confirm revoke link | settings.jsx:283 | إلغاء هذا الرابط؟ |
| Revoke toast | `inviteRevoked` | تم إلغاء الرابط |

### Trip Parameters section
| Where | Key | Arabic |
|---|---|---|
| Section header | `tripParameters` | معطيات الرحلة |
| Destination row label | `destination` | الوجهة |
| Title input placeholder | settings.jsx:606 | اسم الرحلة |
| Subtitle input placeholder | settings.jsx:607 | وصف |
| Countries row label | settings.jsx:613 | الدول |
| Countries empty value | settings.jsx:614 | لم تُحدد |
| Countries hint | settings.jsx:617 | افصل بفاصلة — مثال: سويسرا, البرتغال, اسكتلندا |
| Countries placeholder | settings.jsx:620 | الدول التي زرتها |
| Dates row label | `dates` | التواريخ |
| Budget cap row label | `budgetCap` | حد الميزانية |
| Currency picker label | settings.jsx:654 | العملة |
| Amount field label | settings.jsx:676 | المبلغ ({code}) |
| Home currency label | settings.jsx:698 | العملة الرئيسية |
| Local currency label | settings.jsx:711 | العملة المحلية |
| FX rate label | settings.jsx:724 | سعر USD → {homeCur} (افتراضي {n}) |
| FX reference line | settings.jsx:728 | 1 {localCur} = {n} USD (مرجعي) |
| FX info card (when rates were updated) | settings.jsx:735 | ⓘ أسعار مرجعية حدّثت في {date}. عدّل الحقل أعلاه إذا كان السعر غير صحيح. |
| Currencies row label | `currencies` | العملات |
| Cover style row label | `coverStyle` | نمط الغلاف |

### Save/Cancel inline buttons
| Where | Inline | Arabic |
|---|---|---|
| Save (settings.jsx:771) | inline | حفظ |
| Cancel (settings.jsx:775) | inline | إلغاء |
| Save toast | settings.jsx:571 | تم الحفظ |

### Trip Lifecycle section
| Where | Key | Arabic |
|---|---|---|
| Section header | `tripLifecycle` | دورة الرحلة |
| Archive button (unarchived state) | `archiveTrip` | أرشفة الرحلة |
| Archive sub | `archiveSub` | تخفيها مع حفظ البيانات |
| Archived state label | `archived` | مؤرشفة |
| Archived sub | `archivedSub` | تمت إزالتها من القائمة |
| Delete button | `deleteTrip` | حذف الرحلة |
| Delete sub | `deleteSub` | دائم، لا يمكن التراجع |
| Delete confirm dialog title | `deleteTrip` | حذف الرحلة |
| Delete confirm message | `areYouSure` | متأكد؟ لا يمكن التراجع. |
| Delete confirm Yes | `delete` | حذف |
| Delete toast | settings.jsx:478 | تم حذف الرحلة |

### Footer (under voyage wordmark)
| Where | Inline | Arabic |
|---|---|---|
| Trip ID label | settings.jsx:255 | معرف الرحلة |

---

## 13. App Settings — global account/preferences

**File**: `screen-app-settings.jsx`. Dictionary uses `account`, `preferences`, etc.

### Header
| Where | Key | Arabic |
|---|---|---|
| Large title | `account` | الحساب |

### Profile card (dark gradient)
| Where | Inline | Arabic |
|---|---|---|
| Email "Loading…" placeholder | app-settings.jsx:85 | جاري التحميل… |

Profile sentence (app-settings.jsx:89):
- **{trips}** {رحلة/رحلات} · **{days}** يوم · **{countries}** {دولة/دول}

### Preferences section
| Where | Key | Arabic |
|---|---|---|
| Section header | `preferences` | التفضيلات |
| Appearance row | `appearance` | المظهر |
| Language row label | app-settings.jsx:151 | اللغة |
| Default currency row | `defaultCurrency` | العملة الافتراضية |
| Home base row | `homeBase` | المدينة الرئيسية |
| Home base empty value | app-settings.jsx:447 | لم تُحدد |
| Home base placeholder | app-settings.jsx:456 | مثال: مكة، الرياض، جدة |

### Privacy explainer card
| Where | Key | Arabic |
|---|---|---|
| Section header | `privacy` | الخصوصية |
| Card title | `tripScopedCollab` | تعاون محدود بالرحلة |
| Card body | `tripScopedSub` | المدعوون لرحلة لا يرون رحلاتك الأخرى أو بياناتك الشخصية. |

### Account / Danger section
| Where | Key / Inline | Arabic |
|---|---|---|
| Section header | `account` | الحساب |
| Reset cache row label | app-settings.jsx:226 | إعادة تعيين التطبيق |
| Reset cache sub | app-settings.jsx:226 | مسح والتحميل من جديد إذا حدث خلل |
| Reset confirm title | app-settings.jsx:208 | إعادة تعيين التطبيق |
| Reset confirm message | app-settings.jsx:209 | بياناتك في السحابة آمنة. سيُعاد تحميل التطبيق. |
| Reset confirm action | app-settings.jsx:211 | إعادة تعيين |
| Sign out row | `signOut` | تسجيل الخروج |
| Sign out confirm message | app-settings.jsx:230 | سيتم تسجيل خروجك. يمكنك العودة في أي وقت. |
| Delete account row | `deleteAccount` | حذف الحساب |
| Delete account sub | `deleteAccountSub` | يحذف كل الرحلات والتاريخ |

### Footer
| Where | Inline | Arabic |
|---|---|---|
| Imprint line | app-settings.jsx:248 | v 1.0.0 · صُنع في مكة |

### Install card (PWA prompt)
| Where | Inline | Arabic |
|---|---|---|
| Title | app-settings.jsx:300 | ثبّت Voyage على شاشتك الرئيسية |
| Sub | app-settings.jsx:303 | وصول أسرع وعمل بدون إنترنت |
| Install button | app-settings.jsx:309 | تثبيت |
| Got-it dismiss button | app-settings.jsx:324 | تم |

### Edit drawer save/cancel
| Where | Inline | Arabic |
|---|---|---|
| Save button (each drawer) | app-settings.jsx:431,462 | حفظ |
| Cancel button | app-settings.jsx:435,466 | إلغاء |
| Save toast | app-settings.jsx:378 | تم الحفظ |

---

## 14. Settle Up — invoice settlement (per-trip)

**File**: `screen-settle-up.jsx`. Dictionary section: `i18n.jsx:264-281`.

### Header
| Where | Key | Arabic |
|---|---|---|
| Large title | `settleUp` | تسوية الحسابات |
| Subtitle when invoices exist | settle-up.jsx:76 | {trip} · {N} {فاتورة/فواتير} |

### Empty state (zero invoices)
| Where | Key | Arabic |
|---|---|---|
| Big serif-italic celebration | `settleAllSettled` | لا توجد فواتير للتسوية. |
| Body (when no expenses at all) | `settleNoActivity` | لا توجد مصاريف بعد — أضف بعضاً للبدء. |

### Invoice list
| Where | Key | Arabic |
|---|---|---|
| Section header in v82 redesign | implicit | (subtitle shown above) |
| "Self" name placeholder | settle-up.jsx:22 | أنت |
| Direction arrow (RTL only) | settle-up.jsx:150,222 | ← (visual arrow flips per-direction) |

### Per-invoice action buttons
| Where | Key | Arabic |
|---|---|---|
| Share via WhatsApp | `settleShare` | مشاركة |
| Mark as settled | `settleMarkPaid` | تأكيد التسوية |
| Mark while in progress | settle-up.jsx:186 | … |

### Mark-as-settled confirm dialog
| Where | Key | Arabic |
|---|---|---|
| Action sheet title | `settleConfirmTitle` | تأكيد تسوية الفاتورة؟ |
| Message | `settleConfirmMsg` | {from} دفع {to} مبلغ {amount}. ستنتقل الفاتورة إلى المُسوّاة. |
| Confirm action | `settleConfirmYes` | نعم، تمت التسوية |
| Success toast | settle-up.jsx:41 | تمت تسوية الفاتورة |

### WhatsApp share copy
| Where | Key | Arabic |
|---|---|---|
| Pre-filled message | `settleWhatsappCopy` | مرحباً {to}، أدين لك بـ {amount} من رحلتنا — تمت التسوية عبر Voyage. |

### History section (settled invoices)
| Where | Key | Arabic |
|---|---|---|
| Section header | `settleHistoryTitle` | التسويات السابقة |
| Confirm undo (swipe) | settle-up.jsx:202 | إلغاء تسوية هذه الفاتورة؟ |
| Undo toast | settle-up.jsx:205 | تم إلغاء التسوية |

---

## 15. Trip Search — full-screen search overlay

**File**: `screen-trip-search.jsx`.

### Header
| Where | Inline | Arabic |
|---|---|---|
| Search input placeholder | trip-search.jsx:76 | ابحث في المصروفات، المستندات، الخطة… |
| Cancel button | trip-search.jsx:94 | إلغاء |

### Results count indicator
| Where | Inline | Arabic |
|---|---|---|
| Zero results | trip-search.jsx:105 | لا توجد نتائج |
| N results | trip-search.jsx:106 | {n} نتيجة |

### Initial empty state (no query yet)
| Where | Inline | Arabic |
|---|---|---|
| Big serif title | trip-search.jsx:123 | ابحث في الرحلة |
| Body explanation | trip-search.jsx:126 | مصروفات، مستندات (تذاكر، فنادق، تأشيرات)، وعناصر الخطة — كلها في مكان واحد |

### Section headers
| Where | Inline | Arabic |
|---|---|---|
| Expenses section | trip-search.jsx:136 | مصروفات |
| Documents section | trip-search.jsx:163 | مستندات |
| Plan section | trip-search.jsx:195 | الخطة |

### Empty results (query returned nothing)
| Where | Inline | Arabic |
|---|---|---|
| Title | trip-search.jsx:229 | لا توجد نتائج لـ "{query}" |
| Body | trip-search.jsx:232 | جرّب كلمة أخرى |

---

## 16. Add Expense Sheet (bottom sheet)

**File**: `app.jsx` (inline sheet). Triggered from Hub Quick Actions or Plan "Log expense".

### Header
| Where | Inline | Arabic |
|---|---|---|
| New expense sheet title | app.jsx:439 | رحلة جديدة (this is actually for Add Trip sheet, see §17) |
| Edit expense sheet title | app.jsx:454 | تعديل المصروف |

### Amount field
| Where | Inline | Arabic |
|---|---|---|
| Amount label (with currency code) | app.jsx:1033 | {code} المبلغ |

### Title field
| Where | Inline | Arabic |
|---|---|---|
| Field label | app.jsx:1068 | الاسم / المكان |
| Placeholder | app.jsx:1072 | مطعم، فندق، وسيلة نقل... |

### Category field
| Where | Inline / Key | Arabic |
|---|---|---|
| Label | app.jsx:1080 | الفئة |
| Category labels | `lodging` / `food` / `transit` / `culture` / `misc` | الإقامة / الطعام / المواصلات / الثقافة / متنوع |

### Paid by field
| Where | Inline | Arabic |
|---|---|---|
| Label | app.jsx:1109 | دفع بواسطة |

### Split with field (already in dictionary)
| Where | Key | Arabic |
|---|---|---|
| Label | `splitWithLabel` | تقسيم مع |
| "Everyone" option | `splitEveryone` | الجميع |
| "Just me" option | `splitJustMe`| أنا فقط |
| "Choose people" option | `splitCustom` | اختر أشخاصاً |
| Split count "split N ways" | `splitWithCount` | مقسوم بين {n} |
| Per-person share label | `splitYourShare` | حصتك |
| "Covering this" indicator | `splitCovered` | تكفّلت بها |

### Note field
| Where | Inline | Arabic |
|---|---|---|
| Label | app.jsx:1214 | ملاحظة (اختياري) |
| Placeholder | app.jsx:1218 | تفاصيل إضافية... |

### Receipt section
| Where | Key | Arabic |
|---|---|---|
| Section label | `receiptLabel` | الإيصال |
| Add receipt button | `receiptAdd` | إضافة إيصال |
| Replace receipt | `receiptReplace` | استبدال |
| Remove receipt | `receiptRemove` | حذف |
| Uploading state | `receiptUploading` | جاري الرفع… |
| Helper hint | `receiptHint` | اختياري · صورة من الكاميرا أو المعرض |
| Open full receipt | `receiptOpenFull` | فتح بالحجم الكامل |
| Current receipt fallback name | app.jsx:1256 | الإيصال الحالي |

### Submit buttons
| Where | Inline | Arabic |
|---|---|---|
| Save changes (edit mode) | app.jsx:1334 | حفظ التعديلات |
| Add expense (new) | app.jsx:1335 | إضافة — {trip title} |
| Delete button (edit mode) | app.jsx:1316 | حذف |
| Confirm delete dialog | app.jsx:1301 | حذف هذا المصروف؟ |

### Validation
| Trigger | Where | Arabic |
|---|---|---|
| Missing title or amount | uses fillRequired key | (key fillRequired not in AR dict; falls back to EN) |

---

## 17. Add Trip Sheet (bottom sheet)

**File**: `app.jsx` (inline). Triggered from Trips home + button.

### Header
| Where | Inline | Arabic |
|---|---|---|
| Sheet title | app.jsx:439 | رحلة جديدة |

### Form fields
| Where | Inline | Arabic |
|---|---|---|
| Trip name label (required) | app.jsx:1503 | اسم الرحلة * |
| Trip name placeholder | app.jsx:1505 | مثال: طوكيو · الربيع |
| Subtitle label | app.jsx:1511 | وصف مختصر |
| Subtitle placeholder | app.jsx:1513 | مثال: رحلة شهر العسل |
| Start date label (required) | app.jsx:1520 | تاريخ البداية * |
| End date label (required) | app.jsx:1525 | تاريخ النهاية * |

### Validation errors
| Trigger | Where | Arabic |
|---|---|---|
| Missing title | app.jsx:1480 | أدخل اسم الرحلة |
| Missing dates | app.jsx:1481 | أدخل التواريخ |
| End < start | app.jsx:1482 | تاريخ النهاية قبل البداية |

---

## 18. Add Doc Sheet (legacy/quick add inline in app.jsx)

**File**: `app.jsx` (inline). Some screens use this instead of the full screen-add-doc.

### Form fields
| Where | Inline | Arabic |
|---|---|---|
| Title field label | app.jsx:1380 | العنوان |
| Title placeholder | app.jsx:1383 | اسم المستند... |
| Link field label | app.jsx:1418 | رابط (اختياري) |
| Submit button (with category appended) | app.jsx:1444 | إضافة إلى {category} |

### Validation
| Trigger | Where | Arabic |
|---|---|---|
| Missing title | app.jsx:1356 | أدخل عنواناً |

---

## 19. Shared UI — toasts, dialogs, banners, cropper

**File**: `ui.jsx`.

### Action sheet (generic confirm dialog)
| Where | Inline | Arabic |
|---|---|---|
| Default cancel button | ui.jsx:538 | إلغاء |

### Pull-to-refresh
| Where | Inline | Arabic |
|---|---|---|
| Release threshold | ui.jsx:673 | حرّر للتحديث |
| Pulling state | ui.jsx:674 | اسحب للتحديث |

### Offline banner (top of screen)
| Where | Inline | Arabic |
|---|---|---|
| Banner | ui.jsx:711 | ⚠ غير متصل · بياناتك محفوظة محلياً |

### Image cropper (used for cover photos)
| Where | Inline | Arabic |
|---|---|---|
| Cancel button | ui.jsx:807 | إلغاء |
| Header title | ui.jsx:809 | اضبط صورة الغلاف |
| Done button (or loading "…") | ui.jsx:816 | تم |

---

## 20. Document schemas — per-category fields

**File**: `docs-schema.jsx`. These are the field labels users see when adding/editing a document.

### Flights category
| Field | Label key | Arabic | Placeholder |
|---|---|---|---|
| Title (the trip) | titleLabel | الرحلة | مثال: السعودية SV777 · طوكيو - الرياض |
| Airline | label | الناقل | Saudia · Emirates · JAL (kept Latin in placeholder) |
| Departure airport | label | مطار المغادرة | HND |
| Departure terminal | label | الصالة | 3 |
| Departure datetime | label | موعد الإقلاع | — |
| Arrival airport | label | مطار الوصول | RUH |
| Arrival terminal | label | الصالة | 1 |
| Arrival datetime | label | موعد الهبوط | — |
| Airport map link | label | رابط المطار | https://maps.google.com/... |
| Primary file label | primaryFileLabel | التذكرة الإلكترونية | — |
| Secondary file label | secondaryFile.label | بطاقة الصعود | — |

### Lodging category
| Field | Arabic | Placeholder |
|---|---|---|
| Title | اسم الفندق | مثال: فندق نيكو طوكيو |
| Check-in | تسجيل الدخول | — |
| Check-out | تسجيل الخروج | — |
| Address | العنوان | Street, city (kept English placeholder) |
| Location link | رابط الموقع | https://maps.google.com/... |
| Primary file | مرجع الحجز | — |

### Transport (rental) category
| Field | Arabic | Placeholder |
|---|---|---|
| Title | المزود / الخدمة | مثال: Hertz · إيجار سيارة |
| Vendor | المزود | Hertz · Avis · JR |
| Pick-up | الاستلام | — |
| Drop-off | التسليم | — |
| Location link | رابط الموقع | https://maps.google.com/... |
| Primary file | مرجع الإيجار | — |

### Visas category
| Field | Arabic | Placeholder |
|---|---|---|
| Title | الاسم | مثال: تأشيرة اليابان |
| Visa type | نوع التأشيرة | Tourist · Business |
| Issued | تاريخ الإصدار | — |
| Expires | تاريخ الانتهاء | — |
| Primary file | وثيقة التأشيرة | — |

---

## 21. Misc — fallback labels in supabase/client.jsx

| Where | Inline | Arabic |
|---|---|---|
| Auto-resolved PDF action label | supabase/client.jsx:586 | فتح PDF |

---

# How to give edits back

You can:

1. **Edit this doc in place** — change the Arabic value in any cell. We'll diff against the original and patch every file.
2. **Or grouped by file** — give us "in `screen-hub.jsx`, change X to Y." That works too.
3. **For i18n.jsx dictionary keys** — just say "change the value of key `balanceOwedFrom` to: ..." and we'll patch once. It cascades everywhere.

Notes for your rewrite:

- **Pluralization**: Strings with `{n,plural,one{...}other{...}}` syntax are parsed automatically — keep that format if you want different singular/plural forms. If you don't care about it, you can simplify to a single form.
- **Placeholders**: Anything in `{curly}` is replaced at runtime. Keep the `{}` token but you can move it within the sentence.
- **Bold inline emphasis**: Words wrapped in `**bold**` here are rendered as the heavier `BalanceAmt` / `BudgetNum` / `AnaNum` / `InsNum` / `ProfileNum` helpers — they're a SEPARATE React component, not a markdown convention. Don't add `**` characters; just rewrite the sentence and we'll wire the bold parts into the right helper.
