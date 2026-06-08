// i18n.jsx — translations + direction helpers
// Sets window.t(), window.isRTL, window.LANG

const TRANSLATIONS = {
  en: {
    signIn:'Sign in', signUp:'Sign up', email:'Email', password:'Password',
    fullName:'Full name', continue:'Continue', createLedger:'Create my ledger',
    forgotPassword:'Forgot?', orContinueWith:'OR CONTINUE WITH',
    alreadyHaveAccount:'ALREADY HAVE AN ACCOUNT?', newToVoyage:'NEW TO VOYAGE?',
    createOne:'CREATE ONE', signinLink:'SIGN IN',
    agreeTerms:"I agree to Voyage's Terms and Privacy. Trips are private by default.",
    welcomeBack:'Welcome\nback.', startLedger:'Start your\ntravel ledger.',
    tagline:'FOR PEOPLE WHO WANDER',
    apple:'Apple', google:'Google', passkey:'Passkey',
    yourTravels:'Your travels', all:'All', private:'Private', shared:'Shared',
    currentlyTraveling:'Currently traveling', upcoming:'Upcoming', pastTrips:'Past trips',
    seeAll:'See all', lifetimeAllTrips:'LIFETIME · ALL TRIPS',
    countries:'countries', continents:'continents', travelDays:'travel days',
    trips:'Trips', lifetime:'Lifetime', longest:'Longest', logged:'logged', spent:'spent',
    crewPrivacy:'Crew lives inside each trip',
    crewPrivacySub:"Guests only see what you've explicitly shared.",
    sharedBudget:'SHARED BUDGET', leftOnPace:'left · on pace',
    upNext:'Up next', quickActions:'Quick actions',
    add:'Add', upload:'Upload', invite:'Invite', plan:'Plan',
    recentActivity:'Recent activity', splitting:'splitting', daysLeft:'DAYS LEFT',
    budget:'Budget', totalSpent:'TOTAL SPENT', ofPlanned:'of',
    expenses:'Expenses', auditLog:'Audit log',
    lodging:'Lodging', food:'Food', transit:'Transit', culture:'Culture', misc:'Misc',
    // Document categories (separate from expense categories above)
    docFlights:'Flights', docLodging:'Hotels', docVisas:'Visas', docTransport:'Rentals',
    // Dynamic trip card states
    daysAway:'{n} days away',    dayAway:'Tomorrow',
    startingToday:'Starting today',
    inProgress:'In progress',    dayOfTotal:'Day {n} of {total}',
    completed:'Completed',       lastedDays:'{n} days',
    spentTotal:'Total spent',    budgetOf:'of {b}',
    today:'Today',

    // Onboarding
    obStep:'STEP {a} OF {b}',
    obSkip:'Skip',
    obContinue:'Continue',
    obBack:'Back',
    obGetStarted:'Get started',
    obWelcomeTitle:'Welcome to\nVoyage',
    obWelcomeSub:'Plan trips, track expenses, and share the journey with your crew.',
    obFeature1Title:'Multi-currency, multi-country',
    obFeature1Sub:'One trip across Saudi, Europe or Japan — all currencies handled.',
    obFeature2Title:'Shared with your crew',
    obFeature2Sub:'Trip-scoped: guests only see the trip you invite them to.',
    obFeature3Title:'Lifetime insights',
    obFeature3Sub:'Every expense, every country, in one dashboard.',
    obBasicsTitle:'A few basics',
    obBasicsSub:'We use these to pick the right defaults for you.',
    obNameLabel:'YOUR NAME',
    obNamePlaceholder:'Your name',
    obHomeLabel:'HOME BASE',
    obHomePlaceholder:'Makkah, Riyadh, Dubai…',
    obCurrencyLabel:'DEFAULT CURRENCY',
    obDoneTitle:'You\'re ready',
    obDoneSub:'Create your first trip or jump in and explore.',
    obCreateTrip:'Create my first trip',
    obExplore:'Just explore for now',

    // Receipts (Phase 3)
    receiptLabel:'Receipt',
    receiptAdd:'Add receipt',
    receiptReplace:'Replace',
    receiptRemove:'Remove',
    receiptUploading:'Uploading…',
    receiptHint:'Optional · take a photo or pick from library',
    receiptOpenFull:'Open full size',

    // Settle up (Phase 2)
    settleUp:'Settle up',
    settleAllSettled:'All balances are zero. Nice trip.',
    settleTransactions:'Transactions to settle',
    settleSummary:'{n} {n,plural,one{transaction}other{transactions}} to balance everyone',
    settleMarkPaid:'I paid this',
    settleShare:'Share',
    settleHistory:'Already settled',
    settleNoActivity:'No expenses yet — add some to get started.',
    settleConfirmTitle:'Mark as paid?',
    settleConfirmMsg:'{from} paid {to} {amount}. This will appear in everyone\'s balance.',
    settleConfirmYes:'Yes, paid',
    settleWhatsappCopy:'Hey {to}, I owe you {amount} from our trip — settled via Voyage.',
    settleHistoryTitle:'Settlements so far',

    // Splits & shared trips
    splitWithLabel:'Split with',
    splitEveryone:'Everyone',
    splitJustMe:'Just me',
    splitCustom:'Choose people',
    splitWithCount:'split {n} ways',
    splitYourShare:'your share',
    splitCovered:"I'm covering this",
    balanceOwed:"You're owed",
    balanceOwe:'You owe',
    balanceSettled:'All settled',
    balanceFrom:'from {n} {n,plural,one{person}other{people}}',
    balanceTo:'to {n} {n,plural,one{person}other{people}}',
    balanceTapToSettle:'Tap to settle up',

    // Insights dashboard
    insightsTitle:'Lifetime insights',
    insightsSub:'Every trip, every expense — at a glance',
    kpiTotalTrips:'Total trips',     kpiCountries:'Countries',
    kpiTravelDays:'Travel days',     kpiLifetimeSpent:'Lifetime spent',
    sectionByYear:'Year over year',
    sectionByCategory:'Where your money goes',
    sectionTopTrips:'Most expensive trips',
    sectionTripStatus:'Trip status',
    sectionMembers:'Top contributors',
    sectionPace:'Spending pace',
    statAvgTrip:'Avg trip cost',     statLongestTrip:'Longest trip',
    statDailyAvg:'Daily average',    statTopTransaction:'Biggest expense',
    statMostExpensive:'Most expensive trip',
    statTotalExpenses:'Total expenses logged',
    statCurrencies:'Currencies used',
    yearTrips:'{n} trips',          yearDays:'{n} days',
    statusCurrent:'In progress',    statusUpcoming:'Upcoming',
    statusPast:'Past',
    noInsightsYet:'No data yet',
    noInsightsSub:'Add trips and expenses to see lifetime analytics',
    added:'added', edited:'edited', uploaded:'uploaded', invited:'invited',
    ofTotal:'% of total', used:'USED',
    vault:'Vault', piles:'Piles', recentlyShared:'Recently shared',
    addDocument:'Add document', uploadHint:'Drag a ticket or visa',
    autoSort:"We'll auto-sort it into the right pile", browse:'Browse',
    details:'Details', link:'Link', photos:'Photos', activity:'Activity',
    edit:'Edit', share:'Share', uploadBtn:'Upload',
    addLink:'Add a link', linkHint:'Maps, booking confirmation, website…',
    linkPlaceholder:'https://maps.google.com/...', save:'Save', open:'Open',
    addPhoto:'Add photo', sizeLbl:'SIZE', pagesLbl:'PAGES', syncedLbl:'SYNCED',
    settings:'Settings', crewSection:'Crew', travelers:'travelers',
    viewPermissions:'View role permissions', tripParameters:'Trip parameters',
    notifications:'Notifications', tripLifecycle:'Trip lifecycle',
    archiveTrip:'Archive trip', archiveSub:'Hides from active list, keeps data',
    exportPDF:'Export as PDF', exportSub:'Receipts, audit log, summary',
    deleteTrip:'Delete trip', deleteSub:"Permanent, can't be undone",
    archived:'Archived', archivedSub:'Removed from active list', pdfReady:'PDF ready',
    areYouSure:"Are you sure? This can't be undone.", cancel:'Cancel', delete:'Delete',
    destination:'Destination', dates:'Dates', budgetCap:'Budget cap',
    currencies:'Currencies', coverStyle:'Cover style',
    newExpenses:'New expenses', memberJoins:'Member joins', docUploads:'Doc uploads',
    hub:'Hub', planNav:'Plan', budgetNav:'Budget', vaultNav:'Vault', statsNav:'Stats',
    planAddTitle:'Add to plan', planEditTitle:'Edit activity', planAddBtn:'Add',
    planEmptyDay:'Nothing planned yet — tap to add',
    planFieldTitle:'Activity', planFieldCategory:'Category',
    planFieldTime:'Time (optional)', planFieldLocation:'Location (optional)',
    planTitleReq:'Enter a title', planLogExpense:'Log expense',
    exitTrip:'Exit trip', myTrips:'Trips', insightsNav:'Insights', accountNav:'Account',
    since2020:'SINCE 2020', travelDaysByYear:'Travel days · by year',
    daysByContinent:'Days by continent', whereMoneyGoes:'Where your money goes',
    topCategoryLifetime:'TOP CATEGORY · LIFETIME', acrossAllTrips:'across all trips',
    proTraveler:'PRO · TRAVELER', preferences:'Preferences',
    defaultCurrency:'Default currency', homeBase:'Home base',
    appearance:'Appearance', units:'Units', privacy:'Privacy',
    tripScopedCollab:'Trip-scoped collaboration',
    tripScopedSub:"Guests invited to one trip can never see your other trips, profile data, or lifetime stats.",
    dataExport:'Data export', connectedAccounts:'Connected accounts',
    archivedTrips:'Archived trips', account:'Account',
    referFriend:'Refer a friend', referSub:'Both get 30 days of Pro',
    signOut:'Sign out', deleteAccount:'Delete account',
    deleteAccountSub:'Wipes all trips and history',
    scanToJoin:'Scan to join', guestsSeeOnly:'Guests only see this trip · expires in 7 days',
    copy:'Copy', inviteWithRole:'Invite with role · scope: this trip only',
    fullControl:'Full control', addExpenses:'Add expenses', readOnly:'Read only',
    inviteTheCrew:'Invite the crew',
    inviteHeadline:'Invite to', inviteSubline:'Anyone with the link can join this trip with the role you choose.',
    inviteShareBtn:'Share link', inviteLoading:'Generating link…',
    inviteExpiryHint:'Link expires in 30 days. You can revoke it any time.',
    joinJoining:'Joining trip…', joinSuccess:'You joined the trip',
    activeInvites:'Active invites', inviteRevoked:'Invite revoked',
    addExpenseTitle:'Add expense', amountJPY:'AMOUNT · JPY',
    category:'Category', splitBetween:'Split between', people:'people', each:'each',
    addToKyoto:'Add to Kyoto trip',
    addDocTitle:'Add document', pile:'Pile',
    pdfJpgPng:'PDF, JPG, PNG · up to 25 MB', dropHere:'Drop here',
    dayLbl:'Day', ofLbl:'of', heySunday:'HEY MIRA · SUNDAY',
    uploadedBy:'uploaded by', admin:'Admin', editor:'Editor', viewer:'Viewer',
    onPace:'on pace', editCover:'Edit cover', tripScopedNote:'TRIP-SCOPED',
    daily:'daily', planned:'planned',
  },
  ar: {
    signIn:'تسجيل الدخول', signUp:'إنشاء حساب', email:'البريد الإلكتروني',
    password:'كلمة المرور', fullName:'الاسم الكامل', continue:'متابعة',
    createLedger:'إنشاء سجلي', forgotPassword:'نسيت؟', orContinueWith:'أو تابع بـ',
    alreadyHaveAccount:'لديك حساب؟', newToVoyage:'جديد في Voyage؟',
    createOne:'إنشاء حساب', signinLink:'دخول',
    agreeTerms:'أوافق على شروط وخصوصية Voyage. الرحلات خاصة افتراضياً.',
    welcomeBack:'أهلاً\nبعودتك.', startLedger:'ابدأ\nسجل رحلاتك.',
    tagline:'لمن يحب التجوال',
    apple:'آبل', google:'جوجل', passkey:'مفتاح',
    yourTravels:'رحلاتك', all:'الكل', private:'خاصة', shared:'مشتركة',
    currentlyTraveling:'في رحلة الآن', upcoming:'القادمة', pastTrips:'الرحلات السابقة',
    seeAll:'عرض الكل', lifetimeAllTrips:'المجموع الكلي',
    countries:'دولة', continents:'قارات', travelDays:'يوم سفر',
    trips:'رحلات', lifetime:'المجموع', longest:'الأطول', logged:'مسجلة', spent:'أُنفق',
    crewPrivacy:'الطاقم يعيش داخل كل رحلة',
    crewPrivacySub:'الضيوف يرون فقط ما شاركته معهم.',
    sharedBudget:'الميزانية المشتركة', leftOnPace:'متبقي · في المسار',
    upNext:'القادم', quickActions:'إجراءات سريعة',
    add:'إضافة', upload:'رفع', invite:'دعوة', plan:'تخطيط',
    recentActivity:'النشاط الأخير', splitting:'مشاركة', daysLeft:'أيام متبقية',
    budget:'الميزانية', totalSpent:'الإجمالي المنفق', ofPlanned:'من',
    expenses:'المصروفات', auditLog:'سجل المراجعة',
    lodging:'الإقامة', food:'الطعام', transit:'المواصلات', culture:'الثقافة', misc:'متنوع',
    // Document categories — premium phrasing for Gulf users
    docFlights:'الرحلات', docLodging:'الفنادق', docVisas:'التأشيرات', docTransport:'الإيجارات',
    // Dynamic trip card states
    daysAway:'بعد {n} أيام',    dayAway:'غداً',
    startingToday:'تبدأ اليوم',
    inProgress:'جارية',          dayOfTotal:'اليوم {n} من {total}',
    completed:'مكتملة',          lastedDays:'{n} أيام',
    spentTotal:'الإجمالي المنفق', budgetOf:'من {b}',
    today:'اليوم',

    // Onboarding
    obStep:'الخطوة {a} من {b}',
    obSkip:'تخطٍ',
    obContinue:'متابعة',
    obBack:'رجوع',
    obGetStarted:'لنبدأ',
    obWelcomeTitle:'مرحباً بك في\nVoyage',
    obWelcomeSub:'خطط لرحلاتك، تتبع مصروفاتك، وشارك التجربة مع فريقك.',
    obFeature1Title:'متعدد العملات والدول',
    obFeature1Sub:'رحلة واحدة عبر السعودية، أوروبا أو اليابان — كل العملات.',
    obFeature2Title:'مشاركة مع الطاقم',
    obFeature2Sub:'محدود بالرحلة: الضيوف يرون فقط ما تدعوهم إليه.',
    obFeature3Title:'إحصائيات شاملة',
    obFeature3Sub:'كل مصروف، كل دولة، في لوحة واحدة.',
    obBasicsTitle:'بعض المعلومات',
    obBasicsSub:'نستخدمها لاختيار الإعدادات المناسبة لك.',
    obNameLabel:'اسمك',
    obNamePlaceholder:'كريم',
    obHomeLabel:'مدينتك',
    obHomePlaceholder:'مكة، الرياض، دبي…',
    obCurrencyLabel:'العملة الافتراضية',
    obDoneTitle:'كل شيء جاهز',
    obDoneSub:'أنشئ أول رحلة لك أو ابدأ بالاستكشاف.',
    obCreateTrip:'إنشاء أول رحلة',
    obExplore:'استكشاف فقط',

    // Receipts
    receiptLabel:'الإيصال',
    receiptAdd:'إضافة إيصال',
    receiptReplace:'استبدال',
    receiptRemove:'حذف',
    receiptUploading:'جاري الرفع…',
    receiptHint:'اختياري · صورة من الكاميرا أو المعرض',
    receiptOpenFull:'فتح بالحجم الكامل',

    // Settle up
    settleUp:'تسوية الحسابات',
    settleAllSettled:'كل الحسابات متسوية. رحلة موفقة.',
    settleTransactions:'تحويلات لتسوية الحسابات',
    settleSummary:'{n} {n,plural,one{تحويل}other{تحويلات}} لتسوية الجميع',
    settleMarkPaid:'تم الدفع',
    settleShare:'مشاركة',
    settleHistory:'تمت التسوية',
    settleNoActivity:'لا توجد مصاريف بعد — أضف بعضاً للبدء.',
    settleConfirmTitle:'تأكيد الدفع؟',
    settleConfirmMsg:'{from} دفع {to} مبلغ {amount}. سيظهر في رصيد الجميع.',
    settleConfirmYes:'نعم، تم الدفع',
    settleWhatsappCopy:'مرحباً {to}، أدين لك بـ {amount} من رحلتنا — تمت التسوية عبر Voyage.',
    settleHistoryTitle:'التسويات السابقة',

    // Splits & shared trips
    splitWithLabel:'تقسيم مع',
    splitEveryone:'الجميع',
    splitJustMe:'أنا فقط',
    splitCustom:'اختر أشخاصاً',
    splitWithCount:'مقسوم بين {n}',
    splitYourShare:'حصتك',
    splitCovered:'تكفّلت بها',
    balanceOwed:'مدين لك',
    balanceOwe:'تدين بـ',
    balanceSettled:'كل الحسابات متسوية',
    balanceFrom:'من {n} {n,plural,one{شخص}other{أشخاص}}',
    balanceTo:'إلى {n} {n,plural,one{شخص}other{أشخاص}}',
    balanceTapToSettle:'اضغط للتسوية',

    // Insights dashboard
    insightsTitle:'إحصائيات شاملة',
    insightsSub:'كل رحلة، كل مصروف — في لمحة',
    kpiTotalTrips:'إجمالي الرحلات',  kpiCountries:'الدول',
    kpiTravelDays:'أيام السفر',      kpiLifetimeSpent:'الإجمالي المنفق',
    sectionByYear:'سنة بسنة',
    sectionByCategory:'أين يذهب المال',
    sectionTopTrips:'أعلى الرحلات إنفاقاً',
    sectionTripStatus:'حالة الرحلات',
    sectionMembers:'أكبر المساهمين',
    sectionPace:'وتيرة الإنفاق',
    statAvgTrip:'متوسط الرحلة',      statLongestTrip:'الأطول',
    statDailyAvg:'المعدل اليومي',     statTopTransaction:'أكبر مصروف',
    statMostExpensive:'الأغلى',
    statTotalExpenses:'مصاريف مسجلة',
    statCurrencies:'العملات المستخدمة',
    yearTrips:'{n} رحلة',           yearDays:'{n} يوم',
    statusCurrent:'جارية',           statusUpcoming:'قادمة',
    statusPast:'سابقة',
    noInsightsYet:'لا توجد بيانات بعد',
    noInsightsSub:'أضف رحلات ومصاريف لترى الإحصائيات الشاملة',
    added:'أضاف', edited:'عدّل', uploaded:'رفع', invited:'دعا',
    ofTotal:'٪ من الإجمالي', used:'مستخدم',
    vault:'المستندات', piles:'المجلدات', recentlyShared:'مشاركة مؤخراً',
    addDocument:'إضافة مستند', uploadHint:'اسحب تذكرة أو تأشيرة',
    autoSort:'سيتم ترتيبه تلقائياً', browse:'استعراض',
    details:'التفاصيل', link:'الرابط', photos:'الصور', activity:'النشاط',
    edit:'تعديل', share:'مشاركة', uploadBtn:'رفع',
    addLink:'إضافة رابط', linkHint:'خرائط، تأكيد الحجز، موقع إلكتروني…',
    linkPlaceholder:'https://maps.google.com/...', save:'حفظ', open:'فتح',
    addPhoto:'إضافة صورة', sizeLbl:'الحجم', pagesLbl:'الصفحات', syncedLbl:'تزامن',
    settings:'الإعدادات', crewSection:'الطاقم', travelers:'مسافرون',
    viewPermissions:'عرض الصلاحيات', tripParameters:'معطيات الرحلة',
    notifications:'الإشعارات', tripLifecycle:'دورة الرحلة',
    archiveTrip:'أرشفة الرحلة', archiveSub:'تخفيها مع حفظ البيانات',
    exportPDF:'تصدير PDF', exportSub:'الإيصالات، السجل، الملخص',
    deleteTrip:'حذف الرحلة', deleteSub:'دائم، لا يمكن التراجع',
    archived:'مؤرشفة', archivedSub:'تمت إزالتها من القائمة', pdfReady:'PDF جاهز',
    areYouSure:'متأكد؟ لا يمكن التراجع.', cancel:'إلغاء', delete:'حذف',
    destination:'الوجهة', dates:'التواريخ', budgetCap:'حد الميزانية',
    currencies:'العملات', coverStyle:'نمط الغلاف',
    newExpenses:'مصروفات جديدة', memberJoins:'انضمام أعضاء', docUploads:'رفع مستندات',
    hub:'الرئيسية', planNav:'الخطة', budgetNav:'الميزانية', vaultNav:'المستندات', statsNav:'إحصائيات',
    planAddTitle:'إضافة للخطة', planEditTitle:'تعديل النشاط', planAddBtn:'إضافة',
    planEmptyDay:'لا يوجد شيء مخطط — اضغط للإضافة',
    planFieldTitle:'النشاط', planFieldCategory:'الفئة',
    planFieldTime:'الوقت (اختياري)', planFieldLocation:'الموقع (اختياري)',
    planTitleReq:'أدخل عنواناً', planLogExpense:'تسجيل مصروف',
    exitTrip:'خروج', myTrips:'رحلاتي', insightsNav:'إحصائيات', accountNav:'الحساب',
    since2020:'منذ 2020', travelDaysByYear:'أيام السفر · بالسنة',
    daysByContinent:'الأيام بالقارة', whereMoneyGoes:'أين يذهب المال',
    topCategoryLifetime:'أعلى فئة · مدى الحياة', acrossAllTrips:'عبر كل الرحلات',
    proTraveler:'مسافر محترف', preferences:'التفضيلات',
    defaultCurrency:'العملة الافتراضية', homeBase:'المدينة الرئيسية',
    appearance:'المظهر', units:'الوحدات', privacy:'الخصوصية',
    tripScopedCollab:'تعاون محدود بالرحلة',
    tripScopedSub:'المدعوون لرحلة لا يرون رحلاتك الأخرى أو بياناتك الشخصية.',
    dataExport:'تصدير البيانات', connectedAccounts:'الحسابات المرتبطة',
    archivedTrips:'الرحلات المؤرشفة', account:'الحساب',
    referFriend:'دعوة صديق', referSub:'كلاكما يحصل على 30 يوماً مجاناً',
    signOut:'تسجيل الخروج', deleteAccount:'حذف الحساب',
    deleteAccountSub:'يحذف كل الرحلات والتاريخ',
    scanToJoin:'امسح للانضمام إلى', guestsSeeOnly:'الضيوف يرون هذه الرحلة فقط · تنتهي خلال 7 أيام',
    copy:'نسخ', inviteWithRole:'دعوة بصلاحية · نطاق: هذه الرحلة فقط',
    fullControl:'تحكم كامل', addExpenses:'إضافة مصروفات', readOnly:'قراءة فقط',
    inviteTheCrew:'دعوة الطاقم',
    inviteHeadline:'دعوة إلى', inviteSubline:'أي شخص لديه الرابط يمكنه الانضمام إلى الرحلة بالصلاحية التي تختارها.',
    inviteShareBtn:'مشاركة الرابط', inviteLoading:'جارٍ إنشاء الرابط…',
    inviteExpiryHint:'ينتهي الرابط خلال 30 يوماً. يمكنك إلغاؤه في أي وقت.',
    joinJoining:'جارٍ الانضمام للرحلة…', joinSuccess:'انضممت إلى الرحلة',
    activeInvites:'الروابط النشطة', inviteRevoked:'تم إلغاء الرابط',
    addExpenseTitle:'إضافة مصروف', amountJPY:'المبلغ · ين',
    category:'الفئة', splitBetween:'توزيع بين', people:'أشخاص', each:'لكل',
    addToKyoto:'إضافة إلى رحلة كيوتو',
    addDocTitle:'إضافة مستند', pile:'المجلد',
    pdfJpgPng:'PDF، JPG، PNG · حتى 25 ميغابايت', dropHere:'أفلت هنا',
    dayLbl:'اليوم', ofLbl:'من', heySunday:'مرحباً · الأحد',
    uploadedBy:'رُفع بواسطة', admin:'مشرف', editor:'محرر', viewer:'قارئ',
    onPace:'في المسار', editCover:'تعديل الغلاف', tripScopedNote:'محدود بالرحلة',
    daily:'يومي', planned:'مخطط',
  },
};

window.LANG = 'en';
window.isRTL = false;
window.t = function(key, vars) {
  let s = (TRANSLATIONS[window.LANG] && TRANSLATIONS[window.LANG][key])
    || TRANSLATIONS.en[key] || key;
  if (vars && typeof s === 'string') {
    for (const k in vars) s = s.split('{' + k + '}').join(String(vars[k]));
  }
  return s;
};

// Format any date-ish input as YY/MM/DD (e.g. "25/11/12")
window.fmtDate = function(input) {
  if (!input) return '';
  const d = (input instanceof Date) ? input : new Date(input);
  if (isNaN(d.getTime())) return String(input);
  const yy = String(d.getFullYear()).slice(-2);
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yy}/${mm}/${dd}`;
};
// Range helper: "25/11/08 → 25/11/27"
window.fmtDateRange = function(a, b) {
  const arrow = window.isRTL ? '←' : '→';
  return `${window.fmtDate(a)} ${arrow} ${window.fmtDate(b)}`;
};

// ── Currency formatting ─────────────────────────────────────
// Symbols by ISO code. Trailing space for letter codes so they read nicely.
window.CUR_SYM = {
  USD:'$', EUR:'€', GBP:'£', JPY:'¥',
  SAR:'SAR ', AED:'AED ', EGP:'EGP ', MAD:'MAD ',
  CHF:'CHF ', TRY:'₺', INR:'₹', KWD:'KWD ', BHD:'BHD ',
};
// Currencies that shouldn't show decimals
window.CUR_WHOLE = new Set(['JPY','SAR','KWD','BHD','EGP']);

// USD-based FX rates: 1 USD = N <code>. Realistic mid-market rates (Nov 2025-ish).
// User can override per trip via Settings → Currencies → FX rate (stored in trip.fx
// as USD→home rate). For local currency we always fall back to this table.
// Bump this date whenever you refresh the table.
window.FX_RATES_UPDATED = '2025-11-15';
window.FX_RATES = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
  JPY: 149,
  CHF: 0.88,
  SAR: 3.75,
  AED: 3.67,
  EGP: 48,
  MAD: 9.85,
  TRY: 32,
  INR: 83,
  KWD: 0.31,
  BHD: 0.38,
};
// Effective rate USD → code. Trip-specific override for home currency, else table.
window.fxRate = function(code) {
  if (!code || code === 'USD') return 1;
  const trip = window.TRIP || {};
  if (code === trip.homeCurrency && trip.fx && trip.fx > 0) return trip.fx;
  return window.FX_RATES[code] || 1;
};

// Format a USD-based amount in the trip's chosen display currency.
// Pass { in: 'home' | 'local' | 'USD' | <ISO> } to override which currency to show.
//
// "home" resolves to:
//   1. The current trip's homeCurrency, if a trip is open.
//   2. Else the signed-in user's profile default_currency
//      (window.USER_DEFAULT_CURRENCY -- loaded at app boot).
//   3. Else USD (defensive).
// This means the Trips home, Insights, App Settings -- all the views
// rendered when no trip is open -- show money in the user's chosen
// currency from the start, instead of silently falling back to USD
// until the user opens a trip and "primes" window.TRIP.
window.fmtMoney = function(usdAmount, opts) {
  const trip = window.TRIP || {};
  const userDefault = window.USER_DEFAULT_CURRENCY || 'USD';
  const home  = trip.homeCurrency  || userDefault;
  const local = trip.localCurrency || home;
  const in_   = (opts && opts.in) || 'home';

  let code;
  if (in_ === 'home')  code = home;
  else if (in_ === 'local') code = local;
  else code = in_; // explicit ISO code

  const rate = window.fxRate(code);
  const v = (usdAmount || 0) * rate;
  const sym = window.CUR_SYM[code] || (code + ' ');
  const whole = window.CUR_WHOLE.has(code);
  const formatted = v.toLocaleString('en', {
    minimumFractionDigits: 0,
    maximumFractionDigits: whole ? 0 : 2,
  });
  return `${sym}${formatted}`;
};

// Format a USD-based amount in the CURRENCY OF A SPECIFIC TRIP, using
// that trip's own home_currency + fx_rate from the DB. Use this for any
// per-trip value displayed on a global view (Trips home cards, Insights
// trip list, etc.) so each trip's number is rendered in its own currency
// regardless of which trip is currently open in window.TRIP.
//
// Without this, every trip card was formatted using whichever trip was
// last opened -- if you opened a USD trip, your SAR trips' cards
// suddenly displayed at the USD rate. That bug is what made the same
// trip appear to show different amounts depending on what you'd just
// tapped.
//
// Expects a trip object with shape { homeCurrency, fx } -- both already
// present on every item in window.TRIPS via loadTrips. Falls back to
// window.fmtMoney's default behavior if either is missing.
window.fmtTripMoney = function(usdAmount, trip) {
  if (!trip || !trip.homeCurrency) return window.fmtMoney(usdAmount);
  const code = String(trip.homeCurrency).toUpperCase();
  // Trip's own fx wins (it's the rate the user committed to at trip
  // setup). If absent or non-positive, fall back to the global table
  // for this currency.
  const fx = (trip.fx && trip.fx > 0)
    ? trip.fx
    : (code === 'USD' ? 1 : (window.FX_RATES[code] || 1));
  const v = (usdAmount || 0) * fx;
  const sym = window.CUR_SYM[code] || (code + ' ');
  const whole = window.CUR_WHOLE.has(code);
  const formatted = v.toLocaleString('en', {
    minimumFractionDigits: 0,
    maximumFractionDigits: whole ? 0 : 2,
  });
  return `${sym}${formatted}`;
};

// Reverse: take an amount entered in any currency code, return USD value.
window.toUSD = function(amount, fromCode) {
  const n = parseFloat(amount) || 0;
  if (!fromCode || fromCode === 'USD') return n;
  const rate = window.fxRate(fromCode);
  return rate > 0 ? n / rate : n;
};

// RTL-aware flex row style helper — spread this into any horizontal flex container
window.fRow = function(extra) {
  return Object.assign(
    { display: 'flex', flexDirection: 'row', alignItems: 'center' },
    extra || {}
  );
};
// Flip a left/right pixel value based on direction
window.fStart = function(val) { return window.isRTL ? { right: val } : { left: val }; };
window.fEnd   = function(val) { return window.isRTL ? { left:  val } : { right: val }; };
