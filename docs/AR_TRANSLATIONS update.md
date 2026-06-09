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
| Small tagline above the giant title | `tagline` | لعشاق الترحال والاستكشاف |
| Giant serif-italic title on sign-in | `welcomeBack` | أهلاً بك\nمن جديد. |
| Giant serif-italic title on sign-up | `startLedger` | ابدأ\nتدوين رحلاتك. |

### Mode toggle pill (sign in ↔ sign up)
| Where | Key | Arabic |
|---|---|---|
| Pill labels | `signIn`, `signUp` | تسجيل الدخول / حساب جديد |

### Form fields
| Where | Key | Arabic |
|---|---|---|
| Full name field label (sign up only) | `fullName` | الاسم الكامل |
| Full name placeholder (auth.jsx:195) | inline | اكتب اسمك الكامل |
| Email field label | `email` | البريد الإلكتروني |
| Password field label | `password` | كلمة المرور |
| "Forgot password?" link beside password label | `forgotPassword` | نسيتها؟ |
| New password label (in reset mode, auth.jsx:205) | inline | كلمة مرور جديدة |
| Confirm password label (in reset mode, auth.jsx:213) | inline | تأكيد كلمة المرور |

### Forgot / reset mode headers
| Where | Inline location | Arabic |
|---|---|---|
| Forgot mode title (serif 22px) | auth.jsx:173 | استعادة كلمة المرور |
| Forgot mode subtitle | auth.jsx:176 | سنرسل لك رابطاً لإعادة تعيين كلمة المرور |
| Reset mode title (after clicking email link) | auth.jsx:183 | تعيين كلمة المرور الجديدة |

### Submit buttons
| Where | Key/Inline | Arabic |
|---|---|---|
| Sign-in submit ("Continue") | `continue` | متابعة |
| Sign-up submit ("Create my ledger") | `createLedger` | إنشاء السجل |
| Forgot password submit (auth.jsx:293) | inline | إرسال رابط التعيين |
| Reset password submit (auth.jsx:294) | inline | تحديث كلمة المرور |

### Terms agreement (sign up only, beneath form)
| Where | Key | Arabic |
|---|---|---|
| Terms text | `agreeTerms` | بالتسجيل، أنت توافق على شروط الخدمة وسياسة خصوصية Voyage. رحلاتك ستبقى خاصة افتراضياً. |

### Confirmation / notice cards (moss-tinted)
| Condition | Where | Arabic |
|---|---|---|
| Sign-up returned no session (email confirm needed) | auth.jsx:223 | ✉️ يرجى التحقق من بريدك الإلكتروني والضغط على رابط التأكيد، ثم عُد إلى هنا لتسجيل الدخول |
| Resend confirmation button below | auth.jsx:227 | إعادة إرسال الرابط |
| Reset link sent | auth.jsx:239 | ✉️ تفقد بريدك الإلكتروني واضغط على رابط إعادة التعيين المرسل |

### Footer toggle (sign in ↔ sign up switch)
| Mode | Key | Arabic |
|---|---|---|
| Showing on sign-up | `alreadyHaveAccount` + `signinLink` | لديك حساب بالفعل؟ + تسجيل الدخول |
| Showing on sign-in | `newToVoyage` + `createOne` | جديد في Voyage؟ + أنشئ حسابك الآن |

### "Back to sign in" link (forgot / reset mode)
| Where | Inline | Arabic |
|---|---|---|
| auth.jsx:312 | inline | ← العودة لتسجيل الدخول |

### Error messages (thrown from handleSubmit)
| Trigger | Where | Arabic |
|---|---|---|
| Sign-in/up missing email or password | auth.jsx:40,48 | يرجى ملء جميع الحقول المطلوبة |
| Forgot mode missing email | auth.jsx:51 | يرجى إدخل بريدك الإلكتروني |
| Sign-in helper not loaded (CDN issue) | auth.jsx:36 | تعذر تحميل صفحة تسجيل الدخول بالكامل — يرجى إعادة تحميل التطبيق |
| Reset password < 6 chars | auth.jsx:58 | يجب أن تتكون كلمة المرور من 6 أحرف على الأقل |
| Reset password mismatch | auth.jsx:59 | كلمتا المرور غير متطابقتين |

### Toast confirmations
| Trigger | Where | Arabic |
|---|---|---|
| Reset link sent successfully | auth.jsx:54 | تم إرسال رابط إعادة التعيين بنجاح |
| Password updated successfully | auth.jsx:61 | تم تحديث كلمة المرور بنجاح |
| Confirmation resent | auth.jsx:81 | تم إعادة إرسال رابط التأكيد |

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
| Subtitle below | `obWelcomeSub` | وجهتك الواحدة للتخطيط لرحلاتك، تتبع مصروفاتك، ومشاركة تفاصيل السفر مع أصدقائك. |

**Feature cards (3 rows):**
| Row | Title key / Sub key | Arabic title / sub |
|---|---|---|
| 1 | `obFeature1Title` / `obFeature1Sub` | دعم كامل لجميع العملات والدول / ترحال سلس بين مختلف الدول بالعملة المحلية لكل وجهة. |
| 2 | `obFeature2Title` / `obFeature2Sub` | مشاركة ذكية مع أصدقائك في السفر / تحكم كامل بالخصوصية: يرى ضيوفك فقط الرحلات التي تدعوهم إليها. |
| 3 | `obFeature3Title` / `obFeature3Sub` | إحصائيات وتحليلات شاملة / تتبع كل مصروفاتك ووزّع الميزانية بوضوح في لوحة تحكم واحدة. |

### Step 2 — Basics (form fields)
| Where | Key | Arabic |
|---|---|---|
| Big title | `obBasicsTitle` | لنتعرف عليك أكثر |
| Subtitle | `obBasicsSub` | نستخدم هذه التفاصيل لتهيئة إعدادات التطبيق بما يناسبك. |
| Name field label | `obNameLabel` | الاسم الأول |
| Name placeholder | `obNamePlaceholder` | مثلاً: كريم |
| Home base field label | `obHomeLabel` | مدينتك الحالية |
| Home base placeholder | `obHomePlaceholder` | مكة، الرياض، دبي… |
| Default currency field label | `obCurrencyLabel` | العملة الافتراضية |

### Step 3 — Done (success screen)
| Where | Key | Arabic |
|---|---|---|
| Big title (uses user's first name + this) | `obDoneTitle` | كل شيء جاهز! |
| Subtitle | `obDoneSub` | يمكنك الآن إنشاء رحلتك الأولى أو البدء باستكشاف التطبيق. |
| "Name" row label (onboarding.jsx:308) | inline | الاسم |
| "Home base" row label | `homeBase` | المدينة الرئيسية |
| "Default currency" row label | `defaultCurrency` | العملة الافتراضية |

### Action buttons (bottom of screen)
| Where | Key | Arabic |
|---|---|---|
| "Get started" (step 1 → 2) | `obGetStarted` | لنبدأ |
| "Continue" (step 2 → 3) | `obContinue` | متابعة |
| "Back" (steps 2,3) | `obBack` | رجوع |
| "Explore" (step 3, skip creating trip) | `obExplore` | استكشاف التطبيق |
| "Create first trip" (step 3 primary CTA) | `obCreateTrip` | إنشاء أول رحلة |

### Toast on finish
| Trigger | Where | Arabic |
|---|---|---|
| Onboarding saved successfully | onboarding.jsx:57 | أهلاً بك في Voyage! |

---

## 3. Trips Home — list of all trips (global view)

**File**: `screen-trips.jsx`. Dictionary section: `i18n.jsx:205-227`.

### Header
| Where | Key | Arabic |
|---|---|---|
| Large title | `yourTravels` | رحلاتك |
| Search button aria-label | trips.jsx:233 | بحث عن رحلة |
| Search input placeholder | trips.jsx:243 | ابحث عن رحلة... |

### Lifetime overview (editorial sentence card)
The card is dynamic — composed from counts. The current sentence uses raw English numbers; the surrounding chrome:
| Where | Key | Arabic |
|---|---|---|
| "See insights" link (right of card) | trips.jsx:206 | عرض الإحصائيات |

### Section headers
| Where | Key | Arabic |
|---|---|---|
| Currently traveling section | `currentlyTraveling` | في رحلة الآن |
| Upcoming section | `upcoming` | الرحلات القادمة |
| Past trips section | `pastTrips` | الرحلات السابقة |
| "Up next" event title above smart-track card | trips.jsx:257 | الحدث القادم |
| "See all" link on section headers | `seeAll` | عرض الكل |
| "Lifetime · all trips" | `lifetimeAllTrips` | سجل الإنفاق الكلي |

### Empty state (no trips yet)
| Where | Inline | Arabic |
|---|---|---|
| Big serif title | trips.jsx:316 | لا توجد رحلات بعد |
| Body text | trips.jsx:319 | ستظهر تفاصيل رحلاتك هنا بمجرد إنشائها |

### Smart Track card (next event countdown)
| Where | Inline | Arabic |
|---|---|---|
| "Trip" pill (above event title) | trips.jsx:804 | الرحلة |
| "Location" action pill | trips.jsx:794, 855 | الموقع |

### Current trip card (the live one)
| Where | Inline | Arabic |
|---|---|---|
| "LIVE" pill (top-left overlay) | trips.jsx:374 | الآن |
| Subtitle fallback "{N} days remaining" | trips.jsx:391 | متبقٍ {n} أيام |
| "Budget used" label | trips.jsx:407 | الميزانية المستهلكة |

### Past trip card
| Where | Key | Arabic |
|---|---|---|
| "Completed" badge | `completed` | مكتملة |
| "Lasted N days" text | `lastedDays` | استغرقت {n} أيام |
| Trip card aria-label | trips.jsx:864 | فتح تفاصيل الرحلة |

### Dynamic trip state labels (used per card)
| State | Key | Arabic |
|---|---|---|
| Trip starts today | `startingToday` | تبدأ اليوم |
| In progress | `inProgress` | جارية الآن |
| Day N of M | `dayOfTotal` | اليوم {n} من {total} |
| Tomorrow (1 day away) | `dayAway` | غداً |
| N days away | `daysAway` | بعد {n} أيام |
| Spent total label | `spentTotal` | إجمالي الإنفاق |
| "of {budget}" suffix | `budgetOf` | من أصل {b} |

---

## 4. Hub — single-trip dashboard

**File**: `screen-hub.jsx`. Uses dictionary heavily.

### Header (over hero photo)
| Where | Inline / Key | Arabic |
|---|---|---|
| Header search button aria-label (line 67) | inline | بحث في الرحلة |
| Day-of-trip pill labels | `dayLbl`, `ofLbl` | اليوم / من |
| "Day N of M" composite | `dayOfTotal` | اليوم {n} من {total} |

### Empty state (no trip selected)
| Where | Inline | Arabic |
|---|---|---|
| Title | hub.jsx:25 | لا توجد رحلة نشطة حالياً |
| CTA button | hub.jsx:30 | ← قائمة رحلاتي |

### Personal balance card (gradient moss / clay)
**v97 phrasing — single counterparty (most common: 2-person trip):**

Owed (he owes you):
- يترتب على **{Name}** لك مبلغ **{amount}**.

Owe (you owe him):
- أنت مدين لـ **{Name}** بمبلغ **{amount}**.

**Multi-counterparty fallback:**
- يترتب لك بذمة **{n}** أشخاص إجمالي **{amount}**.
- أنت مدين لـ **{n}** أشخاص بإجمالي **{amount}**.

Below the sentence:
| Where | Key | Arabic |
|---|---|---|
| "Tap to settle" hint | `balanceTapToSettle` | اضغط لتسوية الحسابات |

### Over-budget alert (when spent > planned)
| Where | Inline | Arabic |
|---|---|---|
| Sentence (hub.jsx:272) | inline | تجاوزت الميزانية بمقدار **{amount}** (أي بنسبة {pct}٪ فوق الخطة المحددة). |

### Budget Workspace card
| Where | Inline / Key | Arabic |
|---|---|---|
| Has planned budget (hub.jsx:305) | inline | أنفقت **{spent}** من أصل **{planned}**. |
| No planned budget | inline | إجمالي ما أنفقته حتى الآن: **{spent}**. |
| "left on pace · pct%" line | `leftOnPace` | المتبقي حسب وتيرة الصرف |
| Section subtitle "shared budget" | `sharedBudget` | الميزانية المشتركة للرحلة |

### Quick Actions tiles (4-tile grid)
| Tile | Key | Arabic |
|---|---|---|
| Add (primary, dark tile) | `add` | إضافة مصروف |
| Plan | `planNav` | خطة الأيام |
| Vault | `vaultNav` | المستندات |
| Stats | `statsNav` | الإحصائيات |

### Recent activity (3 rows)
| Where | Key | Arabic |
|---|---|---|
| Section header | `recentActivity` | أحدث العمليات |
| Row aria-label (hub.jsx) | inline | تعديل {title} بقيمة {amount} |
| Trip title fallback | hub.jsx:136 | رحلة |
| "of Total days" suffix | hub.jsx:150 | يوم |

---

## 5. Budget — expense list, filters, audit log

**File**: `screen-budget.jsx`. Dictionary keys: `budget`, `expenses`, `auditLog`, `totalSpent`, etc.

### Empty state (no trip)
| Where | Inline | Arabic |
|---|---|---|
| budget.jsx:42 | inline | يرجى تحديد وفتح رحلة أولاً |

### Statement card (dark hero)
**Editorial sentence (budget.jsx:111):**
- Has planned: أنفقت **{spent}** من أصل **{planned}**.
- No planned: إجمالي ما أنفقته حتى الآن: **{spent}**.

| Where | Inline | Arabic |
|---|---|---|
| Days chip (top-right) | budget.jsx:151 | يوم سفر |

### Over-budget alert (when spent > planned)
| Where | Inline | Arabic |
|---|---|---|
| Alert sentence | budget.jsx | تجاوزت الميزانية بمقدار **{amount}** (أي بنسبة {pct}٪ فوق الخطة المحددة). |

### Expense list header
| Where | Key | Arabic |
|---|---|---|
| "Expenses" title | `expenses` | قائمة المصروفات |
| Search button aria-label | budget.jsx:257 | بحث في المصروفات |
| Search input placeholder | budget.jsx:271 | ابحث في المصروفات... |
| Filters button | budget.jsx:303 | تصفية |

### Filter drawer
| Where | Inline | Arabic |
|---|---|---|
| "Paid by" label | budget.jsx:320 | دُفع بواسطة |
| "Day" label | budget.jsx:336 | اليوم المحدد |
| "Day N" filter chip | budget.jsx:342 | اليوم {d} |
| "All" chip | `all` | الكل |
| "Clear filters" button | budget.jsx:355,456 | مسح التصفية |

### Filter summary card (dark, when filters narrow results)
| Where | Inline | Arabic |
|---|---|---|
| Expense count line | budget.jsx:391 | من المصروفات |
| "paid by {name}" filter chip | budget.jsx:372 | دُفعت بواسطة {name} |
| "Day {n}" filter label | budget.jsx:375 | اليوم |

### Empty states
| Condition | Where | Arabic |
|---|---|---|
| No expenses at all | budget.jsx:417 | لا توجد مصروفات مسجلة لهذه الرحلة بعد |
| "Add first expense" CTA | budget.jsx:435 | أضف أول مصروف |
| Filter returns zero | budget.jsx:451 | لا توجد نتائج تطابق خيارات التصفية |
| "Show all" reset link | budget.jsx:456 | إعادة تعيين الفلاتر |

### Expense row interactions
| Action | Where | Arabic |
|---|---|---|
| Confirm delete dialog | budget.jsx:473 | هل تريد حذف "{title}"؟ |
| Delete success toast | budget.jsx:477 | تم الحذف بنجاح |

### Audit log
| Where | Key / Inline | Arabic |
|---|---|---|
| "Audit log" section header | `auditLog` | سجل التعديلات والمراجعة |
| Action verbs (used in log entries) | `added` / `edited` / `uploaded` / `invited` | أضاف / عدّل / رفع / دعا |
| Entries count text | budget.jsx:612 | من العمليات |

---

## 6. Plan — daily itinerary

**File**: `screen-plan.jsx`. Dictionary section: `i18n.jsx:343-347`.

### Header
| Where | Key | Arabic |
|---|---|---|
| Large title | `planNav` | خطة الأيام |

### Empty states
| Condition | Where | Arabic |
|---|---|---|
| No trip open | plan.jsx:18 | يرجى تحديد وفتح رحلة أولاً |
| Trip has no dates set | plan.jsx:65 | لم تُحدد تواريخ لهذه الرحلة بعد |
| Settings CTA | plan.jsx:79 | الانتقال إلى إعدادات الرحلة |

### Day header
| Where | Inline / Key | Arabic |
|---|---|---|
| "Day N" label (plan.jsx:162) | inline | اليوم {dayNumber} |
| Add activity button | `planAddBtn` | إضافة نشاط |

### Empty day row (no activities planned)
| Where | Key | Arabic |
|---|---|---|
| "Nothing planned yet" text | `planEmptyDay` | جدول هذا اليوم فارغ — اضغط لإضافة الأنشطة |

### Plan row (per activity)
| Where | Inline / Key | Arabic |
|---|---|---|
| Location pill aria-label | plan.jsx:289 | الموقع: {location} |
| "Log expense" pill | `planLogExpense` | تسجيل كمصروف |

### Add / Edit activity sheet
| Where | Key | Arabic |
|---|---|---|
| Add sheet title | `planAddTitle` | إضافة نشاط جديد |
| Edit sheet title | `planEditTitle` | تعديل النشاط |
| Activity title field label | `planFieldTitle` | عنوان النشاط |
| Title placeholder | plan.jsx:383 | مثلاً: زيارة المتاحف والحدائق |
| Category field label | `planFieldCategory` | فئة النشاط |
| Time field label | `planFieldTime` | الوقت (اختياري) |
| Location field label | `planFieldLocation` | المكان أو العنوان (اختياري) |
| Location placeholder | plan.jsx:418 | ابحث عن العنوان أو اسم المكان |
| Title required validation | `planTitleReq` | يرجى إدخال عنوان النشاط |

### Plan category labels (PLAN_CAT_META, plan.jsx:131-135)
| Category | Arabic label |
|---|---|
| food | مطاعم ومقاهي |
| sight | معالم سياحية |
| transport | تنقل ومواصلات |
| lodging | سكن وإقامة |
| misc | أنشطة أخرى |

### Save/cancel/delete buttons
| Action | Inline | Arabic |
|---|---|---|
| Save (new activity) | plan.jsx:454 | إضافة إلى الخطة |
| Save (edit existing) | plan.jsx:453 | حفظ التعديلات |
| Save while in flight | plan.jsx:451 | جارٍ الحفظ الآن… |
| Delete activity | plan.jsx:441 | حذف النشاط |
| Confirm delete dialog | plan.jsx:354 | هل تريد حذف هذا النشاط من الخطة؟ |

### Plan row swipe-to-delete
| Action | Inline | Arabic |
|---|---|---|
| Confirm delete dialog | plan.jsx:215 | هل تريد حذف "{title}"؟ |
| Delete toast | plan.jsx:219 | تم حذف النشاط |

---

## 7. Analytics — per-trip charts (currently-open trip)

**File**: `screen-analytics.jsx`. Dictionary uses `statsNav`, `used`.

### Empty state
| Where | Inline | Arabic |
|---|---|---|
| Title (analytics.jsx:125) | inline | لا توجد بيانات كافية حالياً |
| Body | analytics.jsx:128 | ابدأ بإضافة مصروفاتك لتظهر لك الرسوم البيانية والإحصاءات هنا |
| Go-to-Budget CTA | analytics.jsx:133 | ← سجل المصروفات |

### Daily Average hero card (dark statement)
Editorial sentence (analytics.jsx:170 area):
- With plan: معدل إنفاقك اليومي **{dailyAvg}**، بينما المخطط له **{dailyPlan}** (أي بنسبة إنجاز {burnPct}%).
- Without plan: معدل إنفاقك اليومي حالياً: **{dailyAvg}**.

| Where | Inline | Arabic |
|---|---|---|
| "Days" chip top-right | analytics.jsx:198 | أيام الرحلة |

### Day-by-day chart
| Where | Inline | Arabic |
|---|---|---|
| "Daily" legend swatch | analytics.jsx:379 | يومي |
| "Running total" legend swatch | analytics.jsx:383 | تراكمي |
| "Budget" reference line label | analytics.jsx:255,388 | الميزانية المحددة |
| "Peak: {amount}" inline annotation | analytics.jsx | أعلى ذروة إنفاق: {amount} |

### Selected-day detail card (appears when bar tapped)
| Where | Inline | Arabic |
|---|---|---|
| "Day N" headline | analytics.jsx:424 | تفاصيل اليوم {dayNum} |
| Empty day text | analytics.jsx:460 | لم تُسجل أي مصروفات في هذا اليوم |

### Top transaction card
| Where | Inline | Arabic |
|---|---|---|
| Quiet label inside the row | analytics.jsx:498 | العملية الأعلى إنفاقاً |

### Category breakdown section
| Where | Inline | Arabic |
|---|---|---|
| Section header | analytics.jsx:516 | توزيع المصروفات حسب الفئة |
| Total footer label | analytics.jsx:546 | المجموع الكلي |

### "Who's paying" contributor section
| Where | Inline | Arabic |
|---|---|---|
| Section header | analytics.jsx:558 | نسب وتحليلات الدفع |
| Member pct line | analytics.jsx:589 | من إجمالي المدفوعات |

### Day-by-day list
| Where | Inline | Arabic |
|---|---|---|
| Section header | analytics.jsx:601 | التفاصيل يوماً بيوم |
| "Day N" or fallback to date | analytics.jsx:630 | اليوم {dayNum} |
| Zero-spend row label | analytics.jsx:663 | لا توجد مصروفات |

### Pace summary (bottom editorial sentence card)
| Where | Inline | Arabic |
|---|---|---|
| Section header | analytics.jsx:695 | وتيرة الإنفاق والتوقعات |
| Sentence (with budget) | analytics.jsx:701 | أنفقت حتى الآن **{total}** من أصل **{planned}** بمعدل **{daily}** يومياً. وبهذه الوتيرة، يُتوقع أن تنهي رحلتك بإجمالي إنفاق **{projected}**. |
| Sentence (no budget) | analytics.jsx:707 | أنفقت حتى الآن **{total}** بمعدل **{daily}** يومياً. وبهذه الوتيرة، يُتوقع أن تنهي رحلتك بإجمالي إنفاق **{projected}**. |

---

## 8. Insights — Year Ledger (lifetime, global view)

**File**: `screen-insights.jsx`. Dictionary section: `i18n.jsx:300-323`.

### Header
| Where | Key | Arabic |
|---|---|---|
| insightsTitle | `insightsTitle` | الإحصائيات الشاملة |
| insightsSub | `insightsSub` | نظرة عامة وتحليلات مفصلة لكل رحلاتك ومصروفاتك |

### Empty state (no trips yet)
| Where | Key / Inline | Arabic |
|---|---|---|
| Title | `noInsightsYet` | لا توجد بيانات كافية حالياً |
| Body | `noInsightsSub` | ابدأ بإضافة رحلات ومصروفات جديدة لتظهر لك الإحصاءات العامة هنا |
| Go-to-Trips CTA | insights.jsx:68 | ← قائمة الرحلات |

### Year Hero
| Where | Inline | Arabic |
|---|---|---|
| Small label above the year number | insights.jsx:154 | سنة السفر والترحال |

### Ledger sentence (under the year)
Composed sentence (insights.jsx LedgerSentence):
- خضت **{trips}** رحلات شملت **{countries}** وجهات دولية عبر **{days}** أيام سفر. بلغ إجمالي إنفاقك **{spent}** بمعدل يومي قدره **{dailyAvg}**.

### Notable trips chapter
| Where | Inline | Arabic |
|---|---|---|
| Title (different trip is longest + biggest) | insights.jsx | محطات بارزة في رحلاتك |
| Subtitle | insights.jsx | مقتطفات متميزة من كافة أسفارك |
| "Longest" label | insights.jsx | الرحلة الأطول |
| "Biggest" label | insights.jsx | الرحلة الأعلى إنفاقاً |
| Title (same trip is both) | insights.jsx | المحطة الأبرز في رحلاتك |
| Combined subtitle | insights.jsx | الرحلة الأطول والأكثر إنفاقاً بين أسفارك |
| Combined stat line | insights.jsx | استغرقت {dur} يوماً · بإجمالي {amount} |

### Category stack chapter
| Where | Inline | Arabic |
|---|---|---|
| Title | insights.jsx | أين تذهب ميزانيتك؟ |
| Subtitle | insights.jsx | تحليل المصروفات لكافة الرحلات |
| Total footer label | insights.jsx | الإجمالي العام |

Category labels:
| Key | Arabic |
|---|---|
| `lodging` | السكن والإقامة |
| `food` | المطاعم والمقاهي |
| `transit` | المواصلات والتنقل |
| `culture` | الأنشطة والثقافة |
| `misc` | مصروفات متنوعة |

### Monthly sparkline chapter
| Where | Inline | Arabic |
|---|---|---|
| Title | insights.jsx | مواسم السفر والترحال |
| Subtitle | insights.jsx | تفاصيل النشاط خلال آخر 12 شهراً |
| Busiest month micro-line | insights.jsx | الشهر الأنشط: {month year} · بقيمة {amount} |

### Trip list chapter
| Where | Inline | Arabic |
|---|---|---|
| Title | insights.jsx | حصاد رحلات عام {year} |
| Subtitle | insights.jsx | خضت فيها {n} من الرحلات |
| Row aria-label | insights.jsx | فتح تفاصيل {title} |
| Days suffix | insights.jsx | يوم |

### Previous years chapter
| Where | Inline | Arabic |
|---|---|---|
| Title | insights.jsx | أرشيف السنوات السابقة |
| Per-row trips count | insights.jsx | شملت {n} رحلات · بإجمالي {amount} |

### Lifetime imprint footer
| Where | Inline | Arabic |
|---|---|---|
| Lifetime line | insights.jsx | السجل الكلي للترحال: {n} رحلة · شملت {countries} وجهات دولية \n على مدار {days} يوماً من السفر · بإجمالي إنفاق {amount} |

### Dictionary keys also used (in legacy summary card / older surfaces)
| Key | Arabic |
|---|---|
| `kpiTotalTrips` | إجمالي الرحلات |
| `kpiCountries` | الدول والوجهات |
| `kpiTravelDays` | أيام السفر الكلية |
| `kpiLifetimeSpent` | إجمالي الإنفاق العام |
| `sectionByYear` | تفصيل السنوات |
| `sectionByCategory` | تحليل المصروفات |
| `sectionTopTrips` | الرحلات الأعلى إنفاقاً |
| `sectionTripStatus` | حالة الرحلات الحالية |
| `sectionMembers` | الأصدقاء الرئيسيون |
| `sectionPace` | متوسط وتيرة الإنفاق |
| `statAvgTrip` | متوسط تكلفة الرحلة |
| `statLongestTrip` | الرحلة الأطول |
| `statDailyAvg` | المعدل اليومي العام |
| `statTopTransaction` | أكبر مصروف فردي |
| `statMostExpensive` | الوجهة الأغلى تكلفة |
| `statTotalExpenses` | المصروفات المسجلة |
| `statCurrencies` | العملات المستخدمة |
| `yearTrips` / `yearDays` | {n} رحلة / {n} يوماً |
| `statusCurrent` / `statusUpcoming` / `statusPast` | جارية الآن / قادمة / سابقة |
| `ofTotal` | ٪ من الإجمالي العام |
| `used` | مستخدم |

---

## 9. Vault — documents grid/list (global view)

**File**: `screen-docs.jsx`. Dictionary section: `vault`, `addDocument`, etc.

### Header
| Where | Key | Arabic |
|---|---|---|
| Large title | `vault` | مستودع المستندات |
| Search placeholder | docs.jsx:88 | ابحث في مستنداتك... |

### Filter chips
| Where | Key | Arabic |
|---|---|---|
| "All" chip | `all` | كل المستندات |
| Category chips (each) | `docFlights`, `docLodging`, `docVisas`, `docTransport` | تذاكر الطيران / ححوزات السكن / التأشيرات / وسائل النقل والمسارات |

### View toggle
| Where | Inline | Arabic |
|---|---|---|
| Grid pill aria-label | docs.jsx:267 | عرض كشبكة |
| List pill aria-label | docs.jsx:268 | عرض كقائمة |

### Sort menu
| Where | Inline | Arabic |
|---|---|---|
| Button label "Sort:" prefix | docs.jsx:326 | ترتيب حسب: |
| Options | docs.jsx:308-310 | الأحدث تاريخاً / الترتيب الأبجدي / حسب الفئة |

### Status pill (per document)
| Where | Inline | Arabic |
|---|---|---|
| Synced (has uploaded file) | docs.jsx:372 | تم الحفظ |
| Link (URL-only, no file) | docs.jsx:373 | رابط ويب |
| Pending (no file yet) | docs.jsx:374 | بانتظار الرفع |

### Add tile (in grid)
| Where | Inline | Arabic |
|---|---|---|
| Label below dashed border | docs.jsx:203 | إضافة مستند |

### Empty states
| Condition | Where | Arabic |
|---|---|---|
| Filter empty (category selected) | docs.jsx:154 | لا توجد مستندات مسجلة في فئة {catLabel} |
| Filter empty (search active) | docs.jsx:155 | لم نجد أي نتائج تطابق بحثك |
| Empty vault (no docs at all) | docs.jsx:559 | مستودع مستنداتك فارغ حالياً |
| Empty CTA button | docs.jsx:574 | إضافة أول مستند للرحلة |

### Swipe-to-delete row
| Action | Where | Arabic |
|---|---|---|
| Confirm delete dialog | docs.jsx:220 | هل تريد حذف مستند "{title}"؟ |
| Delete success toast | docs.jsx:224 | تم حذف المستند بنجاح |

---

## 10. Doc Detail — single document view + edit mode

**File**: `screen-doc-detail.jsx`.

### Top buttons (over cover photo)
| Where | Inline | Arabic |
|---|---|---|
| Save button (edit mode) | doc-detail.jsx:219 | حفظ التعديلات |
| Cover photo "Change" (when cover exists) | doc-detail.jsx:243 | تغيير الصورة |
| Cover photo "Add cover" (no cover yet) | doc-detail.jsx:243 | إضافة غلاف |

### Section headers (read mode + edit mode)
| Where | Inline | Arabic |
|---|---|---|
| "Details" section (read & edit) | doc-detail.jsx:291,338 | البيانات والتفاصيل |
| "Cost" section (read & edit) | doc-detail.jsx:314,368 | تفاصيل التكلفة |
| "Category" field label (edit) | doc-detail.jsx:295 | الفئة |
| "Files" section | doc-detail.jsx:416 | الملفات المرفقة |

### Cost + expense toggle row (read mode)
| Where | Inline | Arabic |
|---|---|---|
| Logged-in-expenses status | doc-detail.jsx:387 | مُدرج في قائمة المصروفات |
| Not-logged status | doc-detail.jsx:391 | غير مدرج في ميزانية الرحلة |
| Add to expenses button | doc-detail.jsx:406 | إدراج في المصروفات |
| Remove from expenses button | doc-detail.jsx:405 | استبعاد من المصروفات |

### File row component
| Where | Inline | Arabic |
|---|---|---|
| "Uploaded" placeholder name | doc-detail.jsx:423,436 | ملف مرفوع |
| "No file yet" empty state | doc-detail.jsx:534 | لا يوجد ملف مرفق حتى الآن |
| Open file button | doc-detail.jsx:547 | فتح الملف |
| Replace button (when file exists) | doc-detail.jsx:556 | استبدال الملف |
| Upload button (no file) | doc-detail.jsx:556 | رفع ملف جديد |

### "Open" link (DocInfoRow with URL type)
| Where | Inline | Arabic |
|---|---|---|
| URL row open link | doc-detail.jsx:487 | الانتقال للرابط |

### Delete document button (edit mode, at bottom)
| Where | Inline | Arabic |
|---|---|---|
| Button label | doc-detail.jsx:462 | حذف المستند بالكامل |

### Confirms & toasts
| Trigger | Where | Arabic |
|---|---|---|
| Confirm remove cover photo | doc-detail.jsx:85 | هل تريد إزالة صورة الغلاف؟ |
| Confirm remove primary file | doc-detail.jsx:93 | هل تريد إزالة هذا الملف المرفق؟ |
| Confirm remove secondary file | doc-detail.jsx:101 | هل تريد إزالة الملف الإضافي؟ |
| Confirm delete document | doc-detail.jsx:146 | هل أنت متأكد من حذف هذا المستند نهائياً؟ |
| Title required error toast | doc-detail.jsx:110 | يرجى إدخال عنوان للمستند |
| Save success toast | doc-detail.jsx:124 | تم حفظ جميع التعديلات بنجاح |
| File replaced toast | doc-detail.jsx:57,68 | تم استبدال الملف المرفق بنجاح |
| Added to expenses toast | doc-detail.jsx:139 | تم إدراج التكلفة في سجل المصروفات |
| Removed from expenses toast | doc-detail.jsx:136 | تم استبعاد التكلفة من سجل المصروفات |
| Auto link label (when URL set) | doc-detail.jsx:120 | الرابط المرجعي |

---

## 11. Add Doc — multi-step new-document flow

**File**: `screen-add-doc.jsx`.

### Header & navigation
| Where | Inline | Arabic |
|---|---|---|
| Page title | add-doc.jsx:108 | إضافة مستند جديد |
| Cancel button | add-doc.jsx:286 | إلغاء |
| Save button | add-doc.jsx:304 | حفظ ومتابعة |
| "Optional" badge (per step) | add-doc.jsx:343 | اختياري |

### Step 1 — What is it?
| Where | Inline | Arabic |
|---|---|---|
| Step title | add-doc.jsx:116 | حدد نوع المستند |

### Step 2 — Title
The step title comes from the per-category `titleLabel()` (see §15 Document Schemas below).

### Step 3 — Details
| Where | Inline | Arabic |
|---|---|---|
| Step title | add-doc.jsx:150 | أدخل تفاصيل المستند |

### Step 4 — Primary file
File label comes from schema (e.g. "التذكرة الإلكترونية" for flights).
| Where | Inline | Arabic |
|---|---|---|
| File-type hint | add-doc.jsx:157 | الصيغ المدعومة: PDF أو صور — بحد أقصى 25 ميغابايت |

### Cost step (if category opts in)
| Where | Inline | Arabic |
|---|---|---|
| Step title | add-doc.jsx:170 | قيمة التكلفة ورسوم الحجز |
| "Add to expenses" checkbox label | add-doc.jsx:193 | إدراج تلقائي في ميزانية ومصروفات الرحلة |
| Helper text below checkbox | add-doc.jsx:196 | عند التفعيل، ستتم إضافة هذا المبلغ تلقائياً لعملياتك المالية |

### Cover photo step
| Where | Inline | Arabic |
|---|---|---|
| Step title | add-doc.jsx:205 | تعيين صورة الغلاف |
| Replace button | add-doc.jsx:230 | تغيير الصورة |
| Add a photo CTA | add-doc.jsx:246 | إدراج صورة من المعرض |

### FilePicker component (re-used)
| Where | Inline | Arabic |
|---|---|---|
| File size + replace hint | add-doc.jsx:469 | اضغط هنا لاستبدال الملف المرفق |
| Empty state CTA | add-doc.jsx:484 | اختر ملفاً للرفع |
| File-type hint | add-doc.jsx:487 | الصيغ المدعومة: PDF أو صور |

### Validation
| Trigger | Where | Arabic |
|---|---|---|
| Missing title | add-doc.jsx:52 | يرجى إدخال عنوان للمستند |
| Auto link label | add-doc.jsx:70 | الرابط المرفق |

---

## 12. Trip Settings — single-trip settings

**File**: `screen-settings.jsx`. Dictionary uses `settings`, `crewSection`, etc.

### Header & cover
| Where | Inline / Key | Arabic |
|---|---|---|
| Page title | `settings` | إعدادات الرحلة |
| "Edit cover" pill | `editCover` | تعديل غلاف الرحلة |
| Uploading state | settings.jsx:81 | جاري رفع الصورة الآن... |
| Empty state (no trip) | settings.jsx:37 | يرجى تحديد وفتح رحلة أولاً |

### Crew section header
| Where | Key | Arabic |
|---|---|---|
| Section label "Crew · N" | `crewSection` + count | الأصدقاء والمسافرون معك · {N} |
| "Invite" action button | `invite` | دعوة عضو جديد |

### Crew strip (avatars + counts sentence)
| Where | Inline | Arabic |
|---|---|---|
| "{N} travelers" headline | `travelers` | مسافرون معك |
| Role tally inline (plural) | settings.jsx:123 | مشرفون |
| Role tally inline (plural) | settings.jsx:124 | محررون |
| Role tally inline (plural) | settings.jsx:125 | قراء ومستكشفون |

### Member row labels
| Where | Inline | Arabic |
|---|---|---|
| Self (owner) sub-line | settings.jsx:158 | أنت · مالك السجل |
| Other member sub-line | settings.jsx:158 | صديق في الرحلة |
| Confirm remove member | settings.jsx:141 | هل تريد إزالة {name} واستبعاده من هذه الرحلة؟ |
| Remove success toast | settings.jsx:145 | تم استبعاد العضو بنجاح |

### Permissions matrix (collapsed under "View permissions")
| Where | Key | Arabic |
|---|---|---|
| Disclosure button | `viewPermissions` | استعراض وفهم صلاحيات الأدوار |

Matrix rows (settings.jsx:189-193):
| Permission | Arabic |
|---|---|
| View trip & docs | استعراض وتصفح تفاصيل الرحلة ومستنداتها |
| Add expenses & docs | إضافة بنود مصروفات أو مستندات جديدة |
| Invite members | إرسال روابط دعوة لأصدقاء جدد |
| Edit trip settings | تعديل المعطيات والإعدادات العامة للرحلة |
| Archive or delete | أرشفة الرحلة أو حذف سجلها بالكامل |

Column headers (settings.jsx:227-229):
| Where | Arabic |
|---|---|
| Admin | مشرف |
| Editor | محرر |
| Viewer | قارئ |

### Active invites list
| Where | Key / Inline | Arabic |
|---|---|---|
| Section header | `activeInvites` | روابط الدعوة النشطة |
| Per-row expiry hint | settings.jsx:329 | تنتهي صلاحية الرابط خلال {n} أيام |
| Copy button | `copy` | نسخ الرابط |
| Empty state | settings.jsx:351 | لا توجد روابط دعوة نشطة حالياً |
| Inactive count line | settings.jsx:359 | الروابط منتهية الصلاحية أو الملغاة |
| Confirm revoke link | settings.jsx:283 | هل تريد إلغاء صلاحية هذا الرابط نهائياً؟ |
| Revoke toast | `inviteRevoked` | تم إلغاء رابط الدعوة بنجاح |

### Trip Parameters section
| Where | Key | Arabic |
|---|---|---|
| Section header | `tripParameters` | معطيات ومحددات الرحلة |
| Destination row label | `destination` | وجهة السفر الرئيسية |
| Title input placeholder | settings.jsx:606 | اكتب اسماً مميزاً للرحلة |
| Subtitle input placeholder | settings.jsx:607 | اكتب وصفاً مختصراً للرحلة |
| Countries row label | settings.jsx:613 | الدول المشمولة |
| Countries empty value | settings.jsx:614 | لم تُحدد دول بعد |
| Dates row label | `dates` | فترة وتواريخ السفر |
| Budget cap row label | `budgetCap` | سقف الميزانية الكلية |
| Currency picker label | settings.jsx:654 | عملة الحساب |
| Amount field label | settings.jsx:676 | المبلغ الإجمالي ({code}) |
| Home currency label | settings.jsx:698 | عملتك الرئيسية (في بلدك) |
| Local currency label | settings.jsx:711 | العملة المحلية لوجهة السفر |
| Currencies row label | `currencies` | قائمة العملات المفعلة |
| Cover style row label | `coverStyle` | نمط وتصميم الغلاف |

### Save/Cancel inline buttons
| Where | Inline | Arabic |
|---|---|---|
| Save (settings.jsx:771) | inline | حفظ التغييرات |
| Cancel (settings.jsx:775) | inline | إلغاء |
| Save toast | settings.jsx:571 | تم حفظ التعديلات بنجاح |

### Trip Lifecycle section
| Where | Key | Arabic |
|---|---|---|
| Section header | `tripLifecycle` | إدارة حالة وسجل الرحلة |
| Archive button (unarchived state) | `archiveTrip` | أرشفة الرحلة الحالية |
| Archive sub | `archiveSub` | إخفاء الرحلة من القائمة النشطة مع الاحتفاظ بكافة بياناتها |
| Archived state label | `archived` | تمت أرشفتها بنجاح |
| Archived sub | `archivedSub` | الرحلة مخفية الآن وموجودة في الأرشيف |
| Delete button | `deleteTrip` | حذف سجل الرحلة نهائياً |
| Delete sub | `deleteSub` | إجراء دائم يترتب عليه مسح كافة المصروفات والمستندات ولا يمكن التراجع عنه |
| Delete confirm dialog title | `deleteTrip` | تأكيد حذف الرحلة |
| Delete confirm Yes | `delete` | نعم، احذف الرحلة |
| Delete toast | settings.jsx:478 | تم حذف الرحلة وسجلها بالكامل |

---

## 13. App Settings — global account/preferences

**File**: `screen-app-settings.jsx`. Dictionary uses `account`, `preferences`, etc.

### Header
| Where | Key | Arabic |
|---|---|---|
| Large title | `account` | حسابك وإعداداتك |

### Profile card (dark gradient)
| Where | Inline | Arabic |
|---|---|---|
| Email "Loading…" placeholder | app-settings.jsx:85 | جارٍ تحميل البيانات… |

Profile sentence (app-settings.jsx:89):
- سجل الترحال: خضت **{trips}** رحلات · على مدار **{days}** يوماً · شملت **{countries}** دول ووجهات

### Preferences section
| Where | Key | Arabic |
|---|---|---|
| Section header | `preferences` | التفضيلات العامة للتطبيق |
| Appearance row | `appearance` | مظهر التطبيق (داكن/فاتح) |
| Language row label | app-settings.jsx:151 | لغة الواجهة |
| Default currency row | `defaultCurrency` | العملة الافتراضية للحساب |
| Home base row | `homeBase` | مدينتك الرئيسية المقيم بها |

### Privacy explainer card
| Where | Key | Arabic |
|---|---|---|
| Section header | `privacy` | معايير وسياسة الخصوصية |
| Card title | `tripScopedCollab` | تعاون آمن ومحدود بالرحلة |
| Card body | `tripScopedSub` | الأصدقاء والضيوف الذين تدعوهم لرحلة معينة لن يتمكنوا أبداً من رؤية بقية رحلاتك أو تفاصيل بياناتك الشخصية الأخرى. |

### Account / Danger section
| Where | Key / Inline | Arabic |
|---|---|---|
| Section header | `account` | إدارة الحساب والبيانات |
| Reset cache row label | app-settings.jsx:226 | إعادة تعيين وإصلاح التطبيق |
| Sign out row | `signOut` | تسجيل الخروج |
| Delete account row | `deleteAccount` | إغلاق وحذف الحساب نهائياً |

### Footer
| Where | Inline | Arabic |
|---|---|---|
| Imprint line | app-settings.jsx:248 | الإصدار 1.0.0 · صُنع بكل حب في مكة |

### Install card (PWA prompt)
| Where | Inline | Arabic |
|---|---|---|
| Title | app-settings.jsx:300 | ثبّت تطبيق Voyage على شاشتك الرئيسية |
| Install button | app-settings.jsx:309 | تثبيت التطبيق الآن |

---

## 14. Settle Up — invoice settlement (per-trip)

**File**: `screen-settle-up.jsx`. Dictionary section: `i18n.jsx:264-281`.

### Header
| Where | Key | Arabic |
|---|---|---|
| Large title | `settleUp` | تسوية العبء المالي والحسابات |
| Subtitle when invoices exist | settle-up.jsx:76 | رحلة {trip} · تشمل {N} من الفواتير غير المُسوّاة |

### Empty state (zero invoices)
| Where | Key | Arabic |
|---|---|---|
| Big serif-italic celebration | `settleAllSettled` | رائع! جميع الحسابات والفواتير مُسوّاة بالكامل. |
| Body (when no expenses at all) | `settleNoActivity` | لا توجد مصاريف مشتركة مسجلة لهذه الرحلة حتى الآن للبدء في تسويتها. |

### Invoice list
| Where | Key | Arabic |
|---|---|---|
| "Self" name placeholder | settle-up.jsx:22 | أنت |

### Per-invoice action buttons
| Where | Key | Arabic |
|---|---|---|
| Share via WhatsApp | `settleShare` | مشاركة التفاصيل |
| Mark as settled | `settleMarkPaid` | تأكيد السداد والتسوية |

### Mark-as-settled confirm dialog
| Where | Key | Arabic |
|---|---|---|
| Action sheet title | `settleConfirmTitle` | هل تود تأكيد تسوية هذه الفاتورة؟ |
| Message | `settleConfirmMsg` | قام {from} بسداد مبلغ {amount} إلى {to}. سيتم نقل هذه العملية مباشرة إلى قائمة المعاملات المُسوّاة والمكتملة. |
| Confirm action | `settleConfirmYes` | نعم، تمت التسوية والسداد |

### WhatsApp share copy
| Where | Key | Arabic |
|---|---|---|
| Pre-filled message | `settleWhatsappCopy` | مرحباً {to}، لقد قمت بتسوية وسداد مبلغ {amount} المترتب عليّ من رحلتنا الأخيرة — دُوّنت التسوية عبر تطبيق Voyage. |

### History section (settled invoices)
| Where | Key | Arabic |
|---|---|---|
| Section header | `settleHistoryTitle` | سجل التسويات المكتملة |

---

## 15. Trip Search — full-screen search overlay

**File**: `screen-trip-search.jsx`.

### Header
| Where | Inline | Arabic |
|---|---|---|
| Search input placeholder | trip-search.jsx:76 | ابحث عن مصروفات، مستندات، تفاصيل في الخطة… |
| Cancel button | trip-search.jsx:94 | إلغاء البحث |

### Results count indicator
| Where | Inline | Arabic |
|---|---|---|
| Zero results | trip-search.jsx:105 | لم نجد أي نتائج تطابق كلمة البحث |
| N results | trip-search.jsx:106 | وجدنا {n} من النتائج |

### Initial empty state (no query yet)
| Where | Inline | Arabic |
|---|---|---|
| Big serif title | trip-search.jsx:123 | ابحث في تفاصيل ومحتوى الرحلة |
| Body explanation | trip-search.jsx:126 | تتبع وابحث في كل مكان: قائمة مصروفاتك، ححوزاتك ومستنداتك (تذاكر وفنادق وتأشيرات)، وجداول أنشطة الأيام — كل شيء متاح هنا فوراً. |

---

## 16. Add Expense Sheet (bottom sheet)

**File**: `app.jsx` (inline sheet). Triggered from Hub Quick Actions or Plan "Log expense".

### Header
| Where | Inline | Arabic |
|---|---|---|
| Edit expense sheet title | app.jsx:454 | تعديل بيانات المصروف |

### Amount field
| Where | Inline | Arabic |
|---|---|---|
| Amount label (with currency code) | app.jsx:1033 | قيمة المبلغ ({code}) |

### Title field
| Where | Inline | Arabic |
|---|---|---|
| Field label | app.jsx:1068 | المسمى / المكان |

### Category field
| Where | Inline / Key | Arabic |
|---|---|---|
| Label | app.jsx:1080 | فئة المصروف |
| Category labels | `lodging` / `food` / `transit` / `culture` / `misc` | السكن والإقامة / المطاعم والمقاهي / المواصلات والتنقل / الأنشطة والثقافة / مصروفات متنوعة |

### Paid by field
| Where | Inline | Arabic |
|---|---|---|
| Label | app.jsx:1109 | جرى الدفع بواسطة |

### Split with field (already in dictionary)
| Where | Key | Arabic |
|---|---|---|
| Label | `splitWithLabel` | آلية تقسيم التكلفة |
| "Everyone" option | `splitEveryone` | تقسيم بالتساوي على الجميع |
| "Just me" option | `splitJustMe` | أتحمل التكلفة بمفردي فقط |
| "Choose people" option | `splitCustom` | تقسيم على أشخاص محددين |
| Split count "split N ways" | `splitWithCount` | مقسوم بالتساوي بين {n} أشخاص |
| Per-person share label | `splitYourShare` | حصتك الصافية من التكلفة |
| "Covering this" indicator | `splitCovered` | تكفلت بسدادها بالكامل |

### Receipt section
| Where | Key | Arabic |
|---|---|---|
| Section label | `receiptLabel` | إيصال وفاتورة الدفع |
| Add receipt button | `receiptAdd` | إرفاق إيصال الدفع |

### Submit buttons
| Where | Inline | Arabic |
|---|---|---|
| Save changes (edit mode) | app.jsx:1334 | حفظ التغييرات الحالية |
| Add expense (new) | app.jsx:1335 | تأكيد وإضافة المصروف — {trip title} |

---

## 17. Add Trip Sheet (bottom sheet)

**File**: `app.jsx` (inline). Triggered from Trips home + button.

### Header
| Where | Inline | Arabic |
|---|---|---|
| Sheet title | app.jsx:439 | التخطيط لرحلة جديدة |

### Form fields
| Where | Inline | Arabic |
|---|---|---|
| Trip name label (required) | app.jsx:1503 | مسمى الرحلة * |
| Start date label (required) | app.jsx:1520 | تاريخ بداية الرحلة * |
| End date label (required) | app.jsx:1525 | تاريخ نهاية الرحلة * |

---

## 18. Add Doc Sheet (legacy/quick add inline in app.jsx)

**File**: `app.jsx` (inline). Some screens use this instead of the full screen-add-doc.

### Form fields
| Where | Inline | Arabic |
|---|---|---|
| Title field label | app.jsx:1380 | عنوان ومسمى المستند |
| Submit button (with category appended) | app.jsx:1444 | إضافة مباشرة إلى {category} |

---

## 19. Shared UI — toasts, dialogs, banners, cropper

**File**: `ui.jsx`.

### Action sheet (generic confirm dialog)
| Where | Inline | Arabic |
|---|---|---|
| Default cancel button | ui.jsx:538 | إلغاء الإجراء |

### Offline banner (top of screen)
| Where | Inline | Arabic |
|---|---|---|
| Banner | ui.jsx:711 | ⚠ أنت تعمل بدون اتصال بالإنترنت حالياً · سيتم حفظ كافة مدخلاتك محلياً ومزامنتها لاحقاً |

---

## 20. Document schemas — per-category fields

**File**: `docs-schema.jsx`. These are the field labels users see when adding/editing a document.

### Flights category
| Field | Label key | Arabic | Placeholder |
|---|---|---|---|
| Title (the trip) | titleLabel | مسار خط الطيران | مثال: الخطوط السعودية SV777 · طوكيو - الرياض |
| Airline | label | خطوط / ناقل الطيران | Saudia · Emirates · JAL |
| Departure airport | label | مطار المغادرة | اكتب رمز المطار (مثل HND) |
| Arrival airport | label | مطار الوصول | اكتب رمز مطار الهبوط (مثل RUH) |
| Primary file label | primaryFileLabel | التذكرة الإلكترونية الرسمية (PDF) | أرفق ملف تذكرتك |

### Lodging category
| Field | Arabic | Placeholder |
|---|---|---|
| Title | اسم المنشأة / الفندق | مثال: فندق نيكو طوكيو |
| Check-in | موعد تسجيل الدخول (Check-in) | حدد تاريخ ووقت الدخول |
| Check-out | موعد مغادرة السكن (Check-out) | حدد تاريخ ووقت الخروج |

### Transport (rental) category
| Field | Arabic | Placeholder |
|---|---|---|
| Title | مسمى شركة / خدمة التنقل | مثال: Hertz · إيجار سيارة عائلية |

### Visas category
| Field | Arabic | Placeholder |
|---|---|---|
| Title | مسمى التأشيرة والوثيقة | مثال: تأشيرة اليابان السياحية |

---

## 21. Misc — fallback labels in supabase/client.jsx

| Where | Inline | Arabic |
|---|---|---|
| Auto-resolved PDF action label | supabase/client.jsx:586 | استعراض وملف الـ PDF |
