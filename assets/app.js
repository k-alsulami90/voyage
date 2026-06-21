const TRANSLATIONS = {
  en: {
    signIn: "Sign in",
    signUp: "Sign up",
    email: "Email",
    password: "Password",
    fullName: "Full name",
    continue: "Continue",
    createLedger: "Create my ledger",
    forgotPassword: "Forgot?",
    orContinueWith: "OR CONTINUE WITH",
    alreadyHaveAccount: "ALREADY HAVE AN ACCOUNT?",
    newToVoyage: "NEW TO VOYAGE?",
    createOne: "CREATE ONE",
    signinLink: "SIGN IN",
    agreeTerms: "I agree to Voyage's Terms and Privacy. Trips are private by default.",
    welcomeBack: "Welcome\nback.",
    startLedger: "Start your\ntravel ledger.",
    tagline: "FOR PEOPLE WHO WANDER",
    apple: "Apple",
    google: "Google",
    passkey: "Passkey",
    yourTravels: "Your travels",
    all: "All",
    private: "Private",
    shared: "Shared",
    currentlyTraveling: "Currently traveling",
    upcoming: "Upcoming",
    pastTrips: "Past trips",
    seeAll: "See all",
    lifetimeAllTrips: "LIFETIME · ALL TRIPS",
    countries: "countries",
    continents: "continents",
    travelDays: "travel days",
    trips: "Trips",
    lifetime: "Lifetime",
    longest: "Longest",
    logged: "logged",
    spent: "spent",
    crewPrivacy: "Crew lives inside each trip",
    crewPrivacySub: "Guests only see what you've explicitly shared.",
    sharedBudget: "SHARED BUDGET",
    leftOnPace: "left · on pace",
    upNext: "Up next",
    quickActions: "Quick actions",
    add: "Add",
    upload: "Upload",
    invite: "Invite",
    plan: "Plan",
    recentActivity: "Recent activity",
    splitting: "splitting",
    daysLeft: "DAYS LEFT",
    budget: "Budget",
    totalSpent: "TOTAL SPENT",
    ofPlanned: "of",
    expenses: "Expenses",
    auditLog: "Audit log",
    lodging: "Lodging",
    food: "Food",
    transit: "Transit",
    culture: "Culture",
    misc: "Misc",
    // Document categories (separate from expense categories above)
    docFlights: "Flights",
    docLodging: "Hotels",
    docVisas: "Visas",
    docTransport: "Rentals",
    // Dynamic trip card states
    daysAway: "{n} days away",
    dayAway: "Tomorrow",
    startingToday: "Starting today",
    inProgress: "In progress",
    dayOfTotal: "Day {n} of {total}",
    completed: "Completed",
    lastedDays: "{n} days",
    spentTotal: "Total spent",
    budgetOf: "of {b}",
    today: "Today",
    // Onboarding
    obStep: "STEP {a} OF {b}",
    obSkip: "Skip",
    obContinue: "Continue",
    obBack: "Back",
    obGetStarted: "Get started",
    obWelcomeTitle: "Welcome to\nVoyage",
    obWelcomeSub: "Plan trips, track expenses, and share the journey with your crew.",
    obFeature1Title: "Multi-currency, multi-country",
    obFeature1Sub: "One trip across Saudi, Europe or Japan — all currencies handled.",
    obFeature2Title: "Shared with your crew",
    obFeature2Sub: "Trip-scoped: guests only see the trip you invite them to.",
    obFeature3Title: "Lifetime insights",
    obFeature3Sub: "Every expense, every country, in one dashboard.",
    obBasicsTitle: "A few basics",
    obBasicsSub: "We use these to pick the right defaults for you.",
    obNameLabel: "YOUR NAME",
    obNamePlaceholder: "Your name",
    obHomeLabel: "HOME BASE",
    obHomePlaceholder: "Makkah, Riyadh, Dubai…",
    obCurrencyLabel: "DEFAULT CURRENCY",
    obDoneTitle: "You're ready",
    obDoneSub: "Create your first trip or jump in and explore.",
    obCreateTrip: "Create my first trip",
    obExplore: "Just explore for now",
    // Receipts (Phase 3)
    receiptLabel: "Receipt",
    receiptAdd: "Add receipt",
    receiptReplace: "Replace",
    receiptRemove: "Remove",
    receiptUploading: "Uploading…",
    receiptHint: "Optional · take a photo or pick from library",
    receiptOpenFull: "Open full size",
    // Settle up — keep the language about INVOICES and SETTLING, not
    // transfers or transactions. "Invoice" reads concretely in both
    // English and Arabic and avoids the bookkeeping connotation of
    // "transaction." Each line in Settle Up is one outstanding
    // invoice between two people; marking it paid clears it.
    settleUp: "Settle up",
    settleAllSettled: "No invoices to settle.",
    settleTransactions: "Open invoices",
    settleSummary: "{n} {n,plural,one{invoice}other{invoices}} to settle",
    settleMarkPaid: "Mark as settled",
    settleShare: "Share",
    settleHistory: "Settled",
    settleNoActivity: "No expenses yet — add some to start tracking.",
    settleConfirmTitle: "Mark invoice as settled?",
    settleConfirmMsg: "{from} paid {to} {amount}. The invoice will move to Settled.",
    settleConfirmYes: "Yes, settled",
    settleWhatsappCopy: "Hey {to}, I owe you {amount} from our trip — settling via Voyage.",
    settleHistoryTitle: "Past settlements",
    settleInvoiceSettled: "Invoice settled.",
    // Splits & shared trips
    splitWithLabel: "Split with",
    splitEveryone: "Everyone",
    splitJustMe: "Just me",
    splitCustom: "Choose people",
    splitWithCount: "split {n} ways",
    splitYourShare: "your share",
    splitCovered: "I'm covering this",
    // Direction-aware balance phrasing -- "{name} owes you" reads
    // clearer than the previous abstract "You're owed". The {amount}
    // placeholder is inserted by the caller for both variants. When
    // there's more than one counterparty the caller uses balanceFromN /
    // balanceToN forms instead.
    balanceOwedFrom: "{name} owes you {amount}",
    balanceOweTo: "You owe {name} {amount}",
    balanceOwedFromN: "{n} people owe you {amount}",
    balanceOweToN: "You owe {n} people {amount}",
    balanceSettled: "All settled",
    balanceTapToSettle: "Tap to settle",
    // Insights dashboard
    insightsTitle: "Lifetime insights",
    insightsSub: "Every trip, every expense — at a glance",
    kpiTotalTrips: "Total trips",
    kpiCountries: "Countries",
    kpiTravelDays: "Travel days",
    kpiLifetimeSpent: "Lifetime spent",
    sectionByYear: "Year over year",
    sectionByCategory: "Where your money goes",
    sectionTopTrips: "Most expensive trips",
    sectionTripStatus: "Trip status",
    sectionMembers: "Top contributors",
    sectionPace: "Spending pace",
    statAvgTrip: "Avg trip cost",
    statLongestTrip: "Longest trip",
    statDailyAvg: "Daily average",
    statTopTransaction: "Biggest expense",
    statMostExpensive: "Most expensive trip",
    statTotalExpenses: "Total expenses logged",
    statCurrencies: "Currencies used",
    yearTrips: "{n} trips",
    yearDays: "{n} days",
    statusCurrent: "In progress",
    statusUpcoming: "Upcoming",
    statusPast: "Past",
    noInsightsYet: "No data yet",
    noInsightsSub: "Add trips and expenses to see lifetime analytics",
    added: "added",
    edited: "edited",
    uploaded: "uploaded",
    invited: "invited",
    ofTotal: "% of total",
    used: "USED",
    vault: "Vault",
    piles: "Piles",
    recentlyShared: "Recently shared",
    addDocument: "Add document",
    uploadHint: "Drag a ticket or visa",
    autoSort: "We'll auto-sort it into the right pile",
    browse: "Browse",
    details: "Details",
    link: "Link",
    photos: "Photos",
    activity: "Activity",
    edit: "Edit",
    share: "Share",
    uploadBtn: "Upload",
    addLink: "Add a link",
    linkHint: "Maps, booking confirmation, website…",
    linkPlaceholder: "https://maps.google.com/...",
    save: "Save",
    open: "Open",
    addPhoto: "Add photo",
    sizeLbl: "SIZE",
    pagesLbl: "PAGES",
    syncedLbl: "SYNCED",
    settings: "Settings",
    crewSection: "Crew",
    travelers: "travelers",
    viewPermissions: "View role permissions",
    tripParameters: "Trip parameters",
    notifications: "Notifications",
    tripLifecycle: "Trip lifecycle",
    archiveTrip: "Archive trip",
    archiveSub: "Hides from active list, keeps data",
    exportPDF: "Export as PDF",
    exportSub: "Receipts, audit log, summary",
    deleteTrip: "Delete trip",
    deleteSub: "Permanent, can't be undone",
    archived: "Archived",
    archivedSub: "Removed from active list",
    pdfReady: "PDF ready",
    areYouSure: "Are you sure? This can't be undone.",
    cancel: "Cancel",
    delete: "Delete",
    destination: "Destination",
    dates: "Dates",
    budgetCap: "Budget cap",
    currencies: "Currencies",
    coverStyle: "Cover style",
    newExpenses: "New expenses",
    memberJoins: "Member joins",
    docUploads: "Doc uploads",
    hub: "Hub",
    planNav: "Plan",
    budgetNav: "Budget",
    vaultNav: "Vault",
    statsNav: "Stats",
    planAddTitle: "Add to plan",
    planEditTitle: "Edit activity",
    planAddBtn: "Add",
    planEmptyDay: "Nothing planned yet — tap to add",
    planFieldTitle: "Activity",
    planFieldCategory: "Category",
    planFieldTime: "Time (optional)",
    planFieldLocation: "Location (optional)",
    planTitleReq: "Enter a title",
    planLogExpense: "Log expense",
    exitTrip: "Exit trip",
    myTrips: "Trips",
    insightsNav: "Insights",
    accountNav: "Account",
    since2020: "SINCE 2020",
    travelDaysByYear: "Travel days · by year",
    daysByContinent: "Days by continent",
    whereMoneyGoes: "Where your money goes",
    topCategoryLifetime: "TOP CATEGORY · LIFETIME",
    acrossAllTrips: "across all trips",
    proTraveler: "PRO · TRAVELER",
    preferences: "Preferences",
    defaultCurrency: "Default currency",
    homeBase: "Home base",
    appearance: "Appearance",
    units: "Units",
    privacy: "Privacy",
    tripScopedCollab: "Trip-scoped collaboration",
    tripScopedSub: "Guests invited to one trip can never see your other trips, profile data, or lifetime stats.",
    dataExport: "Data export",
    connectedAccounts: "Connected accounts",
    archivedTrips: "Archived trips",
    account: "Account",
    referFriend: "Refer a friend",
    referSub: "Both get 30 days of Pro",
    signOut: "Sign out",
    deleteAccount: "Delete account",
    deleteAccountSub: "Wipes all trips and history",
    scanToJoin: "Scan to join",
    guestsSeeOnly: "Guests only see this trip · expires in 7 days",
    copy: "Copy",
    inviteWithRole: "Invite with role · scope: this trip only",
    fullControl: "Full control",
    addExpenses: "Add expenses",
    readOnly: "Read only",
    inviteTheCrew: "Invite the crew",
    inviteHeadline: "Invite to",
    inviteSubline: "Anyone with the link can join this trip with the role you choose.",
    inviteShareBtn: "Share link",
    inviteLoading: "Generating link…",
    inviteExpiryHint: "Link expires in 30 days. You can revoke it any time.",
    joinJoining: "Joining trip…",
    joinSuccess: "You joined the trip",
    activeInvites: "Active invites",
    inviteRevoked: "Invite revoked",
    addExpenseTitle: "Add expense",
    amountJPY: "AMOUNT · JPY",
    category: "Category",
    splitBetween: "Split between",
    people: "people",
    each: "each",
    addToKyoto: "Add to Kyoto trip",
    addDocTitle: "Add document",
    pile: "Pile",
    pdfJpgPng: "PDF, JPG, PNG · up to 25 MB",
    dropHere: "Drop here",
    dayLbl: "Day",
    ofLbl: "of",
    heySunday: "HEY MIRA · SUNDAY",
    uploadedBy: "uploaded by",
    admin: "Admin",
    editor: "Editor",
    viewer: "Viewer",
    onPace: "on pace",
    editCover: "Edit cover",
    tripScopedNote: "TRIP-SCOPED",
    daily: "daily",
    planned: "planned"
  },
  ar: {
    // ── Auth ──
    signIn: "تسجيل الدخول",
    signUp: "حساب جديد",
    email: "البريد الإلكتروني",
    password: "كلمة المرور",
    fullName: "الاسم الكامل",
    continue: "متابعة",
    createLedger: "إنشاء السجل",
    forgotPassword: "نسيتها؟",
    orContinueWith: "أو تابع بـ",
    alreadyHaveAccount: "لديك حساب بالفعل؟",
    newToVoyage: "جديد في Voyage؟",
    createOne: "أنشئ حسابك الآن",
    signinLink: "تسجيل الدخول",
    agreeTerms: "بالتسجيل، أنت توافق على شروط الخدمة وسياسة خصوصية Voyage. رحلاتك ستبقى خاصة افتراضياً.",
    welcomeBack: "أهلاً بك\nمن جديد.",
    startLedger: "ابدأ\nتدوين رحلاتك.",
    tagline: "لعشاق الترحال والاستكشاف",
    apple: "آبل",
    google: "جوجل",
    passkey: "مفتاح",
    // ── Trips home ──
    yourTravels: "رحلاتي",
    all: "الكل",
    private: "خاصة",
    shared: "مشتركة",
    currentlyTraveling: "في رحلة الآن",
    upcoming: "الرحلات القادمة",
    pastTrips: "الرحلات السابقة",
    seeAll: "عرض الكل",
    lifetimeAllTrips: "سجل الإنفاق الكلي",
    countries: "دولة",
    continents: "قارات",
    travelDays: "يوم سفر",
    trips: "رحلات",
    lifetime: "المجموع",
    longest: "الأطول",
    logged: "مسجلة",
    spent: "أُنفق",
    crewPrivacy: "الطاقم يعيش داخل كل رحلة",
    crewPrivacySub: "الضيوف يرون فقط ما شاركته معهم.",
    sharedBudget: "الميزانية المشتركة للرحلة",
    leftOnPace: "المتبقي حسب وتيرة الصرف",
    upNext: "الحدث القادم",
    quickActions: "إجراءات سريعة",
    add: "إضافة مصروف",
    upload: "رفع",
    invite: "دعوة عضو جديد",
    plan: "تخطيط",
    recentActivity: "أحدث العمليات",
    splitting: "مشاركة",
    daysLeft: "أيام متبقية",
    budget: "الميزانية",
    totalSpent: "إجمالي الإنفاق",
    ofPlanned: "من",
    expenses: "قائمة المصروفات",
    auditLog: "سجل التعديلات والمراجعة",
    lodging: "السكن والإقامة",
    food: "المطاعم والمقاهي",
    transit: "المواصلات والتنقل",
    culture: "الأنشطة والثقافة",
    misc: "مصروفات متنوعة",
    // Document categories
    docFlights: "تذاكر الطيران",
    docLodging: "ححوزات السكن",
    docVisas: "التأشيرات",
    docTransport: "وسائل النقل والمسارات",
    // Dynamic trip card states
    daysAway: "بعد {n} أيام",
    dayAway: "غداً",
    startingToday: "تبدأ اليوم",
    inProgress: "جارية الآن",
    dayOfTotal: "اليوم {n} من {total}",
    completed: "مكتملة",
    lastedDays: "استغرقت {n} أيام",
    spentTotal: "إجمالي الإنفاق",
    budgetOf: "من أصل {b}",
    today: "اليوم",
    // ── Onboarding ──
    obStep: "الخطوة {a} من {b}",
    obSkip: "تخطٍ",
    obContinue: "متابعة",
    obBack: "رجوع",
    obGetStarted: "لنبدأ",
    obWelcomeTitle: "مرحباً بك في\nVoyage",
    obWelcomeSub: "وجهتك الواحدة للتخطيط لرحلاتك، تتبع مصروفاتك، ومشاركة تفاصيل السفر مع أصدقائك.",
    obFeature1Title: "دعم كامل لجميع العملات والدول",
    obFeature1Sub: "ترحال سلس بين مختلف الدول بالعملة المحلية لكل وجهة.",
    obFeature2Title: "مشاركة ذكية مع أصدقائك في السفر",
    obFeature2Sub: "تحكم كامل بالخصوصية: يرى ضيوفك فقط الرحلات التي تدعوهم إليها.",
    obFeature3Title: "إحصائيات وتحليلات شاملة",
    obFeature3Sub: "تتبع كل مصروفاتك ووزّع الميزانية بوضوح في لوحة تحكم واحدة.",
    obBasicsTitle: "لنتعرف عليك أكثر",
    obBasicsSub: "نستخدم هذه التفاصيل لتهيئة إعدادات التطبيق بما يناسبك.",
    obNameLabel: "الاسم الأول",
    obNamePlaceholder: "مثلاً: كريم",
    obHomeLabel: "مدينتك الحالية",
    obHomePlaceholder: "مكة، الرياض، دبي…",
    obCurrencyLabel: "العملة الافتراضية",
    obDoneTitle: "كل شيء جاهز!",
    obDoneSub: "يمكنك الآن إنشاء رحلتك الأولى أو البدء باستكشاف التطبيق.",
    obCreateTrip: "إنشاء أول رحلة",
    obExplore: "استكشاف التطبيق",
    // ── Receipts ──
    receiptLabel: "إيصال وفاتورة الدفع",
    receiptAdd: "إرفاق إيصال الدفع",
    receiptReplace: "استبدال",
    receiptRemove: "حذف",
    receiptUploading: "جاري الرفع…",
    receiptHint: "اختياري · صورة من الكاميرا أو المعرض",
    receiptOpenFull: "فتح بالحجم الكامل",
    // ── Settle up ──
    settleUp: "تسوية العبء المالي والحسابات",
    settleAllSettled: "رائع! جميع الحسابات والفواتير مُسوّاة بالكامل.",
    settleTransactions: "فواتير مفتوحة",
    settleSummary: "{n} {n,plural,one{فاتورة}other{فواتير}} للتسوية",
    settleMarkPaid: "تأكيد السداد والتسوية",
    settleShare: "مشاركة التفاصيل",
    settleHistory: "مُسوّاة",
    settleNoActivity: "لا توجد مصاريف مشتركة مسجلة لهذه الرحلة حتى الآن للبدء في تسويتها.",
    settleConfirmTitle: "هل تود تأكيد تسوية هذه الفاتورة؟",
    settleConfirmMsg: "قام {from} بسداد مبلغ {amount} إلى {to}. سيتم نقل هذه العملية مباشرة إلى قائمة المعاملات المُسوّاة والمكتملة.",
    settleConfirmYes: "نعم، تمت التسوية والسداد",
    settleWhatsappCopy: "مرحباً {to}، لقد قمت بتسوية وسداد مبلغ {amount} المترتب عليّ من رحلتنا الأخيرة — دُوّنت التسوية عبر تطبيق Voyage.",
    settleHistoryTitle: "سجل التسويات المكتملة",
    // ── Splits & shared trips ──
    splitWithLabel: "آلية تقسيم التكلفة",
    splitEveryone: "تقسيم بالتساوي على الجميع",
    splitJustMe: "أتحمل التكلفة بمفردي فقط",
    splitCustom: "تقسيم على أشخاص محددين",
    splitWithCount: "مقسوم بالتساوي بين {n} أشخاص",
    splitYourShare: "حصتك الصافية من التكلفة",
    splitCovered: "تكفلت بسدادها بالكامل",
    // Direction-aware balance phrasing
    balanceOwedFrom: "يترتب على {name} لك مبلغ {amount}",
    balanceOweTo: "أنت مدين لـ {name} بمبلغ {amount}",
    balanceOwedFromN: "يترتب لك بذمة {n} {n,plural,one{شخص}other{أشخاص}} إجمالي {amount}",
    balanceOweToN: "أنت مدين لـ {n} {n,plural,one{شخص}other{أشخاص}} بإجمالي {amount}",
    balanceSettled: "كل الحسابات متسوية",
    balanceTapToSettle: "اضغط لتسوية الحسابات",
    // ── Insights dashboard ──
    insightsTitle: "الإحصائيات الشاملة",
    insightsSub: "نظرة عامة وتحليلات مفصلة لكل رحلاتك ومصروفاتك",
    kpiTotalTrips: "إجمالي الرحلات",
    kpiCountries: "الدول والوجهات",
    kpiTravelDays: "أيام السفر الكلية",
    kpiLifetimeSpent: "إجمالي الإنفاق العام",
    sectionByYear: "تفصيل السنوات",
    sectionByCategory: "تحليل المصروفات",
    sectionTopTrips: "الرحلات الأعلى إنفاقاً",
    sectionTripStatus: "حالة الرحلات الحالية",
    sectionMembers: "الأصدقاء الرئيسيون",
    sectionPace: "متوسط وتيرة الإنفاق",
    statAvgTrip: "متوسط تكلفة الرحلة",
    statLongestTrip: "الرحلة الأطول",
    statDailyAvg: "المعدل اليومي العام",
    statTopTransaction: "أكبر مصروف فردي",
    statMostExpensive: "الوجهة الأغلى تكلفة",
    statTotalExpenses: "المصروفات المسجلة",
    statCurrencies: "العملات المستخدمة",
    yearTrips: "{n} رحلة",
    yearDays: "{n} يوماً",
    statusCurrent: "جارية الآن",
    statusUpcoming: "قادمة",
    statusPast: "سابقة",
    noInsightsYet: "لا توجد بيانات كافية حالياً",
    noInsightsSub: "ابدأ بإضافة رحلات ومصروفات جديدة لتظهر لك الإحصاءات العامة هنا",
    added: "أضاف",
    edited: "عدّل",
    uploaded: "رفع",
    invited: "دعا",
    ofTotal: "٪ من الإجمالي العام",
    used: "مستخدم",
    // ── Vault ──
    vault: "مستودع المستندات",
    piles: "المجلدات",
    recentlyShared: "مشاركة مؤخراً",
    addDocument: "إضافة مستند",
    uploadHint: "اسحب تذكرة أو تأشيرة",
    autoSort: "سيتم ترتيبه تلقائياً",
    browse: "استعراض",
    details: "التفاصيل",
    link: "الرابط",
    photos: "الصور",
    activity: "النشاط",
    edit: "تعديل",
    share: "مشاركة",
    uploadBtn: "رفع",
    addLink: "إضافة رابط",
    linkHint: "خرائط، تأكيد الحجز، موقع إلكتروني…",
    linkPlaceholder: "https://maps.google.com/...",
    save: "حفظ",
    open: "فتح",
    addPhoto: "إضافة صورة",
    sizeLbl: "الحجم",
    pagesLbl: "الصفحات",
    syncedLbl: "تزامن",
    // ── Trip Settings ──
    settings: "إعدادات الرحلة",
    crewSection: "الأصدقاء والمسافرون معي",
    travelers: "مسافرون معي",
    viewPermissions: "استعراض وفهم صلاحيات الأدوار",
    tripParameters: "معطيات ومحددات الرحلة",
    notifications: "الإشعارات",
    tripLifecycle: "إدارة حالة وسجل الرحلة",
    archiveTrip: "أرشفة الرحلة الحالية",
    archiveSub: "إخفاء الرحلة من القائمة النشطة مع الاحتفاظ بكافة بياناتها",
    exportPDF: "تصدير PDF",
    exportSub: "الإيصالات، السجل، الملخص",
    deleteTrip: "حذف سجل الرحلة نهائياً",
    deleteSub: "إجراء دائم يترتب عليه مسح كافة المصروفات والمستندات ولا يمكن التراجع عنه",
    archived: "تمت أرشفتها بنجاح",
    archivedSub: "الرحلة مخفية الآن وموجودة في الأرشيف",
    pdfReady: "PDF جاهز",
    areYouSure: "متأكد؟ لا يمكن التراجع.",
    cancel: "إلغاء",
    delete: "نعم، احذف الرحلة",
    destination: "وجهة السفر الرئيسية",
    dates: "فترة وتواريخ السفر",
    budgetCap: "سقف الميزانية الكلية",
    currencies: "قائمة العملات المفعلة",
    coverStyle: "نمط وتصميم الغلاف",
    newExpenses: "مصروفات جديدة",
    memberJoins: "انضمام أعضاء",
    docUploads: "رفع مستندات",
    hub: "الرئيسية",
    planNav: "خطة الأيام",
    budgetNav: "الميزانية",
    vaultNav: "المستندات",
    statsNav: "الإحصائيات",
    planAddTitle: "إضافة نشاط جديد",
    planEditTitle: "تعديل النشاط",
    planAddBtn: "إضافة نشاط",
    planEmptyDay: "جدول هذا اليوم فارغ — اضغط لإضافة الأنشطة",
    planFieldTitle: "عنوان النشاط",
    planFieldCategory: "فئة النشاط",
    planFieldTime: "الوقت (اختياري)",
    planFieldLocation: "المكان أو العنوان (اختياري)",
    planTitleReq: "يرجى إدخال عنوان النشاط",
    planLogExpense: "تسجيل كمصروف",
    exitTrip: "خروج",
    myTrips: "رحلاتي",
    insightsNav: "إحصائيات",
    accountNav: "الحساب",
    since2020: "منذ 2020",
    travelDaysByYear: "أيام السفر · بالسنة",
    daysByContinent: "الأيام بالقارة",
    whereMoneyGoes: "أين يذهب المال",
    topCategoryLifetime: "أعلى فئة · مدى الحياة",
    acrossAllTrips: "عبر كل الرحلات",
    // ── App Settings ──
    proTraveler: "مسافر محترف",
    preferences: "التفضيلات العامة للتطبيق",
    defaultCurrency: "العملة الافتراضية للحساب",
    homeBase: "مدينتك الرئيسية المقيم بها",
    appearance: "مظهر التطبيق (داكن/فاتح)",
    units: "الوحدات",
    privacy: "معايير وسياسة الخصوصية",
    tripScopedCollab: "تعاون آمن ومحدود بالرحلة",
    tripScopedSub: "الأصدقاء والضيوف الذين تدعوهم لرحلة معينة لن يتمكنوا أبداً من رؤية بقية رحلاتك أو تفاصيل بياناتك الشخصية الأخرى.",
    dataExport: "تصدير البيانات",
    connectedAccounts: "الحسابات المرتبطة",
    archivedTrips: "الرحلات المؤرشفة",
    account: "إدارة الحساب والبيانات",
    referFriend: "دعوة صديق",
    referSub: "كلاكما يحصل على 30 يوماً مجاناً",
    signOut: "تسجيل الخروج",
    deleteAccount: "إغلاق وحذف الحساب نهائياً",
    deleteAccountSub: "يحذف كل الرحلات والتاريخ",
    scanToJoin: "امسح للانضمام إلى",
    guestsSeeOnly: "الضيوف يرون هذه الرحلة فقط · تنتهي خلال 7 أيام",
    copy: "نسخ الرابط",
    inviteWithRole: "دعوة بصلاحية · نطاق: هذه الرحلة فقط",
    fullControl: "تحكم كامل",
    addExpenses: "إضافة مصروفات",
    readOnly: "قراءة فقط",
    inviteTheCrew: "دعوة الطاقم",
    inviteHeadline: "دعوة إلى",
    inviteSubline: "أي شخص لديه الرابط يمكنه الانضمام إلى الرحلة بالصلاحية التي تختارها.",
    inviteShareBtn: "مشاركة الرابط",
    inviteLoading: "جارٍ إنشاء الرابط…",
    inviteExpiryHint: "ينتهي الرابط خلال 30 يوماً. يمكنك إلغاؤه في أي وقت.",
    joinJoining: "جارٍ الانضمام للرحلة…",
    joinSuccess: "انضممت إلى الرحلة",
    activeInvites: "روابط الدعوة النشطة",
    inviteRevoked: "تم إلغاء رابط الدعوة بنجاح",
    addExpenseTitle: "إضافة مصروف",
    amountJPY: "المبلغ · ين",
    category: "الفئة",
    splitBetween: "توزيع بين",
    people: "أشخاص",
    each: "لكل",
    addToKyoto: "إضافة إلى رحلة كيوتو",
    addDocTitle: "إضافة مستند",
    pile: "المجلد",
    pdfJpgPng: "PDF، JPG، PNG · حتى 25 ميغابايت",
    dropHere: "أفلت هنا",
    dayLbl: "اليوم",
    ofLbl: "من",
    heySunday: "مرحباً · الأحد",
    uploadedBy: "رُفع بواسطة",
    admin: "مشرف",
    editor: "محرر",
    viewer: "قارئ",
    onPace: "في المسار",
    editCover: "تعديل غلاف الرحلة",
    tripScopedNote: "محدود بالرحلة",
    daily: "يومي",
    planned: "مخطط"
  }
};
window.LANG = "en";
window.isRTL = false;
window.arPlural = function(n, forms) {
  if (!forms) return String(n);
  const abs = Math.abs(n);
  if (abs === 0 && forms.zero != null) return forms.zero;
  if (abs === 1 && forms.one != null) return forms.one;
  if (abs === 2 && forms.two != null) return forms.two;
  if (abs >= 3 && abs <= 10 && forms.few != null) return forms.few;
  if (abs >= 11 && abs <= 99 && forms.many != null) return forms.many;
  return forms.other != null ? forms.other : String(n);
};
window.t = function(key, vars) {
  let s = TRANSLATIONS[window.LANG] && TRANSLATIONS[window.LANG][key] || TRANSLATIONS.en[key] || key;
  if (vars && typeof s === "string") {
    for (const k in vars) s = s.split("{" + k + "}").join(String(vars[k]));
  }
  return s;
};
window.fmtDate = function(input) {
  if (!input) return "";
  const d = input instanceof Date ? input : new Date(input);
  if (isNaN(d.getTime())) return String(input);
  const yy = String(d.getFullYear()).slice(-2);
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yy}/${mm}/${dd}`;
};
window.fmtDateRange = function(a, b) {
  const arrow = window.isRTL ? "←" : "→";
  return `${window.fmtDate(a)} ${arrow} ${window.fmtDate(b)}`;
};
window.tripDays = function(startDate, endDate) {
  if (!startDate || !endDate) return { daysIn: 1, daysTotal: 1 };
  const MS = 864e5;
  const start = new Date(startDate);
  start.setHours(0, 0, 0, 0);
  const end = new Date(endDate);
  end.setHours(0, 0, 0, 0);
  const now = /* @__PURE__ */ new Date();
  now.setHours(0, 0, 0, 0);
  if (isNaN(start) || isNaN(end)) return { daysIn: 1, daysTotal: 1 };
  const daysTotal = Math.max(1, Math.round((end - start) / MS) + 1);
  const daysIn = Math.min(Math.max(1, Math.round((now - start) / MS) + 1), daysTotal);
  return { daysIn, daysTotal };
};
window.CUR_SYM = {
  USD: "$",
  EUR: "€",
  GBP: "£",
  JPY: "¥",
  SAR: "SAR ",
  AED: "AED ",
  EGP: "EGP ",
  MAD: "MAD ",
  CHF: "CHF ",
  TRY: "₺",
  INR: "₹",
  KWD: "KWD ",
  BHD: "BHD "
};
window.CUR_WHOLE = /* @__PURE__ */ new Set(["JPY", "SAR", "KWD", "BHD", "EGP"]);
window.FX_RATES_UPDATED = "2025-11-15";
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
  BHD: 0.38
};
window.fxRate = function(code) {
  if (!code || code === "USD") return 1;
  return window.FX_RATES[code] || 1;
};
window.refreshFxRates = async function() {
  var _a;
  try {
    const cached = JSON.parse(localStorage.getItem("voyage_fx") || "null");
    if (cached && cached.rates) {
      Object.assign(window.FX_RATES, cached.rates);
      if (cached.updated) window.FX_RATES_UPDATED = cached.updated;
    }
  } catch (_) {
  }
  try {
    const res = await fetch("https://open.er-api.com/v6/latest/USD", { cache: "no-store" });
    if (!res.ok) return;
    const json = await res.json();
    if (!json || !json.rates) return;
    const next = {};
    Object.keys(window.FX_RATES).forEach((c) => {
      if (typeof json.rates[c] === "number" && json.rates[c] > 0) next[c] = json.rates[c];
    });
    if (Object.keys(next).length === 0) return;
    Object.assign(window.FX_RATES, next);
    const updated = (json.time_last_update_utc ? new Date(json.time_last_update_utc) : /* @__PURE__ */ new Date()).toISOString().slice(0, 10);
    window.FX_RATES_UPDATED = updated;
    localStorage.setItem("voyage_fx", JSON.stringify({ rates: next, updated }));
    (_a = window.notifyDataChange) == null ? void 0 : _a.call(window);
  } catch (_) {
  }
};
window.refreshFxRates();
window.fmtMoney = function(usdAmount, opts) {
  const trip = window.TRIP || {};
  const userDefault = window.USER_DEFAULT_CURRENCY || "USD";
  const home = trip.homeCurrency || userDefault;
  const local = trip.localCurrency || home;
  const in_ = opts && opts.in || "home";
  let code;
  if (in_ === "home") code = home;
  else if (in_ === "local") code = local;
  else code = in_;
  const rate = window.fxRate(code);
  const v = (usdAmount || 0) * rate;
  const sym = window.CUR_SYM[code] || code + " ";
  const whole = window.CUR_WHOLE.has(code);
  const formatted = v.toLocaleString("en", {
    minimumFractionDigits: 0,
    maximumFractionDigits: whole ? 0 : 2
  });
  return `${sym}${formatted}`;
};
window.fmtTripMoney = function(usdAmount, trip) {
  if (!trip || !trip.homeCurrency) return window.fmtMoney(usdAmount);
  const code = String(trip.homeCurrency).toUpperCase();
  const fx = trip.fx && trip.fx > 0 ? trip.fx : code === "USD" ? 1 : window.FX_RATES[code] || 1;
  const v = (usdAmount || 0) * fx;
  const sym = window.CUR_SYM[code] || code + " ";
  const whole = window.CUR_WHOLE.has(code);
  const formatted = v.toLocaleString("en", {
    minimumFractionDigits: 0,
    maximumFractionDigits: whole ? 0 : 2
  });
  return `${sym}${formatted}`;
};
window.toUSD = function(amount, fromCode) {
  const n = parseFloat(amount) || 0;
  if (!fromCode || fromCode === "USD") return n;
  const rate = window.fxRate(fromCode);
  return rate > 0 ? n / rate : n;
};
window.fRow = function(extra) {
  return Object.assign(
    { display: "flex", flexDirection: "row", alignItems: "center" },
    extra || {}
  );
};
window.fStart = function(val) {
  return window.isRTL ? { right: val } : { left: val };
};
window.fEnd = function(val) {
  return window.isRTL ? { left: val } : { right: val };
};
(function() {
  const DB_NAME = "voyage-cache";
  const STORE = "kv";
  let dbp = null;
  function db() {
    if (dbp) return dbp;
    dbp = new Promise((resolve, reject) => {
      let req;
      try {
        req = indexedDB.open(DB_NAME, 1);
      } catch (e) {
        reject(e);
        return;
      }
      req.onupgradeneeded = () => {
        if (!req.result.objectStoreNames.contains(STORE)) req.result.createObjectStore(STORE);
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
    return dbp;
  }
  window.cacheGet = async (key) => {
    try {
      const d = await db();
      return await new Promise((res, rej) => {
        const tx = d.transaction(STORE, "readonly");
        const r = tx.objectStore(STORE).get(key);
        r.onsuccess = () => res(r.result == null ? null : r.result);
        r.onerror = () => rej(r.error);
      });
    } catch (_) {
      return null;
    }
  };
  window.cachePut = async (key, value) => {
    try {
      const d = await db();
      await new Promise((res, rej) => {
        const tx = d.transaction(STORE, "readwrite");
        tx.objectStore(STORE).put(value, key);
        tx.oncomplete = () => res();
        tx.onerror = () => rej(tx.error);
      });
    } catch (_) {
    }
  };
  window.cacheClearAll = async () => {
    try {
      const d = await db();
      await new Promise((res) => {
        const tx = d.transaction(STORE, "readwrite");
        tx.objectStore(STORE).clear();
        tx.oncomplete = () => res();
        tx.onerror = () => res();
      });
    } catch (_) {
    }
  };
  window.cachePersistTrips = () => window.cachePut("trips", window.TRIPS || []);
  window.cachePersistTrip = (tripId) => {
    if (!tripId) return;
    window.cachePut("trip:" + tripId, {
      detail: window.TRIP && window.TRIP.id === tripId ? window.TRIP : null,
      expenses: window.EXPENSES || [],
      members: window.MEMBERS || [],
      docs: window.DOCS_BY_CAT || {},
      itinerary: window.ITINERARY || [],
      settlements: window.SETTLEMENTS || []
    });
  };
  window.cacheHydrateTrips = async () => {
    if (window.TRIPS && window.TRIPS.length) return false;
    const t2 = await window.cacheGet("trips");
    if (Array.isArray(t2) && t2.length) {
      window.TRIPS = t2;
      return true;
    }
    return false;
  };
  window.cacheHydrateTrip = async (tripId) => {
    var _a;
    if (!tripId) return false;
    const c = await window.cacheGet("trip:" + tripId);
    if (!c) return false;
    if (c.detail && (!window.TRIP || window.TRIP.id !== tripId)) window.TRIP = c.detail;
    if (!(window.EXPENSES || []).length && (c.expenses || []).length) window.EXPENSES = c.expenses;
    if (!(window.MEMBERS || []).length && (c.members || []).length) window.MEMBERS = c.members;
    const docsEmpty = !window.DOCS_BY_CAT || Object.values(window.DOCS_BY_CAT).every((a) => !a || !a.length);
    if (docsEmpty && c.docs) {
      window.DOCS_BY_CAT = c.docs;
      window.DOCS_TRIP_ID = tripId;
    }
    if (!(window.ITINERARY || []).length && (c.itinerary || []).length) window.ITINERARY = c.itinerary;
    if (!(window.SETTLEMENTS || []).length && (c.settlements || []).length) window.SETTLEMENTS = c.settlements;
    (_a = window.recomputeExpenseDerived) == null ? void 0 : _a.call(window, tripId);
    return true;
  };
  window.outboxEnqueue = async (item) => {
    const list = await window.cacheGet("outbox") || [];
    list.push({ ...item, queuedAt: Date.now() });
    await window.cachePut("outbox", list);
  };
  window.outboxCount = async () => (await window.cacheGet("outbox") || []).length;
  let replaying = false;
  window.replayOutbox = async () => {
    var _a, _b;
    if (replaying) return;
    if (!navigator.onLine || !window.sb || !window.currentUserId) return;
    const list = await window.cacheGet("outbox") || [];
    if (!list.length) return;
    replaying = true;
    const remaining = [];
    const touchedTrips = /* @__PURE__ */ new Set();
    for (const item of list) {
      try {
        if (item.type === "expense" && typeof window.addExpense === "function") {
          await window.addExpense(item.tripId, item.createdBy, item.payload);
          touchedTrips.add(item.tripId);
        } else {
        }
      } catch (e) {
        remaining.push(item);
      }
    }
    await window.cachePut("outbox", remaining);
    replaying = false;
    const synced = list.length - remaining.length;
    if (synced > 0) {
      if (window.TRIP && touchedTrips.has(window.TRIP.id)) {
        try {
          await window.loadExpenses(window.TRIP.id);
        } catch (_) {
        }
      }
      (_a = window.notifyDataChange) == null ? void 0 : _a.call(window);
      (_b = window.toast) == null ? void 0 : _b.call(
        window,
        remaining.length === 0 ? window.isRTL ? "تمت مزامنة تغييراتك دون اتصال" : "Synced your offline changes" : window.isRTL ? "تمت مزامنة بعض التغييرات" : "Synced some changes",
        "success"
      );
    }
  };
  window.addEventListener("online", () => {
    var _a;
    (_a = window.replayOutbox) == null ? void 0 : _a.call(window);
  });
})();
const _SUPABASE_URL = "https://ydbpkimqibfviqxaicld.supabase.co";
const _SUPABASE_ANON = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlkYnBraW1xaWJmdmlxeGFpY2xkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg2ODUzMjYsImV4cCI6MjA5NDI2MTMyNn0.3dgxXZz-xyB7DLVmXUQUrbjhXS_uRs69Ue-9VRuo0ko";
window.sb = window.supabase.createClient(_SUPABASE_URL, _SUPABASE_ANON);
window.sbSignIn = async (email, password) => {
  const { data, error } = await window.sb.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
};
window.sbSignUp = async (email, password, name) => {
  const initials = name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);
  const hue = Math.floor(Math.random() * 360);
  const { data, error } = await window.sb.auth.signUp({
    email,
    password,
    options: { data: { name, initials, avatar_hue: hue } }
  });
  if (error) throw error;
  if (data.user) {
    await window.sb.from("profiles").upsert({
      id: data.user.id,
      name,
      initials,
      avatar_hue: hue,
      default_currency: "USD"
    });
  }
  return data;
};
window.sbSignOut = () => window.sb.auth.signOut();
window.sbResetPassword = async (email) => {
  const redirectTo = `${window.location.origin}${window.location.pathname}#reset`;
  const { error } = await window.sb.auth.resetPasswordForEmail(email, { redirectTo });
  if (error) throw error;
};
window.sbUpdatePassword = async (newPassword) => {
  const { error } = await window.sb.auth.updateUser({ password: newPassword });
  if (error) throw error;
};
window.sbResendConfirmation = async (email) => {
  const { error } = await window.sb.auth.resend({ type: "signup", email });
  if (error) throw error;
};
window.loadUserPreferences = async (userId) => {
  if (!userId) return;
  try {
    const { data, error } = await window.sb.from("profiles").select("default_currency, name, initials, avatar_hue, home_base").eq("id", userId).maybeSingle();
    if (error) throw error;
    if (data) {
      window.ACCOUNT = {
        ...window.ACCOUNT || {},
        profile: { id: userId, name: data.name, initials: data.initials, hue: data.avatar_hue || 35 },
        currency: (data.default_currency || "USD").trim().toUpperCase(),
        home: data.home_base || ""
      };
    }
    const profileCur = ((data == null ? void 0 : data.default_currency) || "").trim().toUpperCase();
    if (profileCur && profileCur !== "USD") {
      window.USER_DEFAULT_CURRENCY = profileCur;
      return;
    }
    const trips = window.TRIPS || [];
    if (trips.length > 0) {
      const counts = {};
      trips.forEach((tr) => {
        const c = (tr.homeCurrency || "").trim().toUpperCase();
        if (c && c !== "USD") counts[c] = (counts[c] || 0) + 1;
      });
      const top = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
      if (top) {
        window.USER_DEFAULT_CURRENCY = top[0];
        return;
      }
    }
    window.USER_DEFAULT_CURRENCY = profileCur || "USD";
  } catch (err) {
    console.warn("loadUserPreferences failed", err);
    window.USER_DEFAULT_CURRENCY = "USD";
  }
};
window.clearAllMockData = () => {
  var _a, _b;
  window.TRIPS = [];
  window.TRIP = null;
  window.MEMBERS = [];
  window.EXPENSES = [];
  window.DOCS = [];
  window.AUDIT = [];
  window.LIFETIME_STATS = null;
  window.LIFETIME_STATS_LKG = null;
  window.ACCOUNT = null;
  window.USER_DEFAULT_CURRENCY = null;
  window.DOCS_BY_CAT = { flights: [], lodging: [], visas: [], transport: [] };
  window.DOCS_TRIP_ID = null;
  window.DOC_CATEGORIES = ((_a = window.DOC_CATEGORIES) == null ? void 0 : _a.map((c) => ({ ...c, count: 0 }))) || [];
  window.CATEGORIES = ((_b = window.CATEGORIES) == null ? void 0 : _b.map((c) => ({ ...c, amt: 0, pct: 0 }))) || [];
  window.TRIP_ANALYTICS = {
    dailyAvgUSD: 0,
    dailyPlanUSD: 0,
    topDay: { date: "--", usd: 0 },
    contribs: [],
    spendByDay: []
  };
  window.GLOBAL = {
    countries: 0,
    continents: 0,
    days: 0,
    lifetimeUSD: 0,
    longestTrip: { name: "--", days: 0 },
    topCategory: { name: "--", usd: 0, pct: 0 },
    byContinent: [],
    yearly: []
  };
};
window.loadTrips = async (userId) => {
  var _a, _b;
  const { data, error } = await window.sb.from("trips").select("*, trip_members(user_id, role)").order("start_date", { ascending: false });
  if (error) {
    console.error("loadTrips", error);
    return;
  }
  window.TRIPS = (data || []).map((r) => ({
    id: r.id,
    title: r.title,
    sub: r.subtitle || "",
    dates: window.fmtDateRange(r.start_date, r.end_date),
    startDate: r.start_date,
    endDate: r.end_date,
    country: r.country_code || "",
    countries: Array.isArray(r.countries) && r.countries.length > 0 ? r.countries.filter(Boolean) : r.country_code ? [r.country_code] : [],
    shared: (r.trip_members || []).length > 1,
    members: (r.trip_members || []).length,
    cover: r.cover_style || "kyoto",
    coverImageUrl: r.cover_image_url || null,
    coverUrl: r.cover_url || null,
    coverPath: r.cover_path || null,
    budgetPct: 0,
    budgetPlannedUSD: parseFloat(r.budget_planned_usd) || 0,
    // Home currency follows the viewer's account preference, not the stored
    // per-trip value (which legacy trips may have left at USD).
    homeCurrency: window.USER_DEFAULT_CURRENCY || r.home_currency || "USD",
    fx: parseFloat(r.fx_rate) || 1,
    status: r.status
  }));
  (_a = window.cachePersistTrips) == null ? void 0 : _a.call(window);
  (_b = window.cachePut) == null ? void 0 : _b.call(window, "prefs", { currency: window.USER_DEFAULT_CURRENCY });
};
window.loadSettlements = async (tripId) => {
  if (!tripId || !window.sb) return [];
  const { data, error } = await window.sb.from("settlements").select("*").eq("trip_id", tripId).order("created_at", { ascending: false });
  if (error) {
    if (/settlements/i.test(error.message || "")) {
      window.SETTLEMENTS = [];
      return [];
    }
    console.error("loadSettlements", error);
    window.SETTLEMENTS = [];
    return [];
  }
  window.SETTLEMENTS = data || [];
  return window.SETTLEMENTS;
};
window.recordSettlement = async (tripId, fromUser, toUser, amountUSD, note = null) => {
  if (!window.sb) throw new Error("Not signed in");
  if (fromUser === toUser) throw new Error("Cannot pay yourself");
  const { data, error } = await window.sb.from("settlements").insert({
    trip_id: tripId,
    from_user: fromUser,
    to_user: toUser,
    amount_usd: Math.round(amountUSD * 100) / 100,
    note,
    created_by: window.currentUserId
  }).select().single();
  if (error) throw error;
  await window.loadSettlements(tripId);
  window.LIFETIME_STATS = null;
  try {
    await window.sb.from("audit_log").insert({
      trip_id: tripId,
      user_id: window.currentUserId,
      action: "edited",
      target: `Settlement: ${(amountUSD || 0).toFixed(0)}`
    });
  } catch (_) {
  }
  return data;
};
window.deleteSettlement = async (settlementId, tripId) => {
  if (!window.sb) throw new Error("Not signed in");
  const { error } = await window.sb.from("settlements").delete().eq("id", settlementId);
  if (error) throw error;
  await window.loadSettlements(tripId);
  window.LIFETIME_STATS = null;
};
window.ITINERARY = [];
window.loadItinerary = async (tripId) => {
  if (!tripId || !window.sb) {
    window.ITINERARY = [];
    return [];
  }
  const { data, error } = await window.sb.from("itinerary_items").select("*").eq("trip_id", tripId).order("day_date", { ascending: true }).order("start_time", { ascending: true, nullsFirst: false }).order("sort_order", { ascending: true });
  if (error) {
    if (/itinerary_items/i.test(error.message || "")) {
      window.ITINERARY = [];
      return [];
    }
    console.error("loadItinerary", error);
    window.ITINERARY = [];
    return [];
  }
  window.ITINERARY = (data || []).map((r) => ({
    id: r.id,
    tripId: r.trip_id,
    dayDate: r.day_date,
    startTime: r.start_time,
    title: r.title,
    category: r.category || "misc",
    location: r.location,
    sortOrder: r.sort_order,
    createdBy: r.created_by,
    // Present only after the linked-expense migration runs; null otherwise.
    linkedExpenseId: r.linked_expense_id || null
  }));
  return window.ITINERARY;
};
window.attachExpenseToItineraryItem = async (itemId, expenseId, tripId) => {
  if (!window.sb || !itemId || !expenseId) return;
  const { error } = await window.sb.from("itinerary_items").update({ linked_expense_id: expenseId }).eq("id", itemId);
  if (error && !/linked_expense_id/i.test(error.message || "")) throw error;
  if (tripId) await window.loadItinerary(tripId);
};
window.attachExpenseToDoc = async (docId, expenseId, tripId) => {
  if (!window.sb || !docId || !expenseId) return;
  const { error } = await window.sb.from("documents").update({ linked_expense_id: expenseId }).eq("id", docId);
  if (error) throw error;
  window.LIFETIME_STATS = null;
  if (tripId) await window.loadDocuments(tripId);
};
window.addItineraryItem = async (tripId, fields) => {
  if (!window.sb) throw new Error("Not signed in");
  const { data, error } = await window.sb.from("itinerary_items").insert({
    trip_id: tripId,
    day_date: fields.dayDate,
    start_time: fields.startTime || null,
    title: (fields.title || "").trim(),
    category: fields.category || "misc",
    location: (fields.location || "").trim() || null,
    sort_order: fields.sortOrder || 0,
    created_by: window.currentUserId
  }).select().single();
  if (error) throw error;
  return data;
};
window.updateItineraryItem = async (itemId, tripId, fields) => {
  if (!window.sb) throw new Error("Not signed in");
  const { error } = await window.sb.from("itinerary_items").update({
    day_date: fields.dayDate,
    start_time: fields.startTime || null,
    title: (fields.title || "").trim(),
    category: fields.category || "misc",
    location: (fields.location || "").trim() || null,
    updated_at: (/* @__PURE__ */ new Date()).toISOString()
  }).eq("id", itemId);
  if (error) throw error;
};
window.deleteItineraryItem = async (itemId, tripId) => {
  if (!window.sb) throw new Error("Not signed in");
  const { error } = await window.sb.from("itinerary_items").delete().eq("id", itemId);
  if (error) throw error;
};
window.computeUserBalance = function(userId, expenses, settlements) {
  let paid = 0;
  let owes = 0;
  const byOther = {};
  (expenses || []).forEach((e) => {
    const splitters = (e.splitWith || []).filter(Boolean).filter((uid) => uid !== e.who);
    const isShared = splitters.length > 0;
    const totalSharers = isShared ? splitters.length + 1 : 1;
    const shareAmount = (e.usd || 0) / totalSharers;
    if (e.who === userId) {
      paid += e.usd || 0;
      if (isShared) {
        splitters.forEach((uid) => {
          byOther[uid] = (byOther[uid] || 0) + shareAmount;
        });
      }
    } else if (isShared && splitters.includes(userId)) {
      owes += shareAmount;
      byOther[e.who] = (byOther[e.who] || 0) - shareAmount;
    }
  });
  (settlements || []).forEach((s) => {
    const amt = parseFloat(s.amount_usd) || 0;
    if (s.from_user === userId) {
      byOther[s.to_user] = (byOther[s.to_user] || 0) + amt;
      paid += amt;
    } else if (s.to_user === userId) {
      byOther[s.from_user] = (byOther[s.from_user] || 0) - amt;
      owes += amt;
    }
  });
  delete byOther[userId];
  const net = Object.values(byOther).reduce((s, v) => s + v, 0);
  return { paid, owes, net, byOther };
};
window.computeSettlements = function(balances) {
  const creditors = [];
  const debtors = [];
  Object.entries(balances || {}).forEach(([id, net]) => {
    if (net > 0.5) creditors.push({ id, amount: net });
    else if (net < -0.5) debtors.push({ id, amount: -net });
  });
  creditors.sort((a, b) => b.amount - a.amount);
  debtors.sort((a, b) => b.amount - a.amount);
  const transfers = [];
  let i = 0, j = 0;
  while (i < debtors.length && j < creditors.length) {
    const d = debtors[i], c = creditors[j];
    const amt = Math.min(d.amount, c.amount);
    if (amt >= 0.5) {
      transfers.push({ from: d.id, to: c.id, amount: Math.round(amt * 100) / 100 });
    }
    d.amount -= amt;
    c.amount -= amt;
    if (d.amount < 0.5) i++;
    if (c.amount < 0.5) j++;
  }
  return transfers;
};
window.computeAllBalances = function(memberIds, expenses, settlements) {
  const balances = {};
  (memberIds || []).forEach((uid) => {
    balances[uid] = window.computeUserBalance(uid, expenses, settlements).net;
  });
  return balances;
};
window._tripDataLoadedAt = window._tripDataLoadedAt || {};
window.isTripDataReady = (tripId) => !!(window._tripDataLoadedAt && tripId && window._tripDataLoadedAt[tripId]);
window._cacheTripSummary = (tripId) => {
  var _a;
  try {
    if (!tripId || !window.TRIP || window.TRIP.id !== tripId) return;
    const expenses = window.EXPENSES || [];
    const summary = {
      tripId,
      title: window.TRIP.title,
      subtitle: window.TRIP.subtitle,
      cover: window.TRIP.cover,
      coverImageUrl: window.TRIP.coverImageUrl,
      dates: window.TRIP.dates,
      countries: window.TRIP.countries || [],
      homeCurrency: window.TRIP.homeCurrency,
      localCurrency: window.TRIP.localCurrency,
      fx: window.TRIP.fx,
      plannedUSD: ((_a = window.TRIP.budget) == null ? void 0 : _a.plannedUSD) || 0,
      spentUSD: expenses.reduce((s, e) => s + (e.usd || 0), 0),
      expenseCount: expenses.length,
      memberCount: (window.MEMBERS || []).length,
      cachedAt: Date.now()
    };
    localStorage.setItem(`voyage:trip:${tripId}:summary`, JSON.stringify(summary));
  } catch (_) {
  }
};
window._readTripSummary = (tripId) => {
  try {
    const raw = localStorage.getItem(`voyage:trip:${tripId}:summary`);
    return raw ? JSON.parse(raw) : null;
  } catch (_) {
    return null;
  }
};
window.loadExpenses = async (tripId) => {
  const { data, error } = await window.sb.from("expenses").select("*, profiles ( name, initials, avatar_hue )").eq("trip_id", tripId).order("created_at", { ascending: false });
  if (error) {
    console.error("loadExpenses", error);
    return;
  }
  const rows = data || [];
  const signed = await window._signDocPaths(rows.map((r) => r.receipt_path));
  window.EXPENSES = rows.map((r) => ({
    id: r.id,
    who: r.created_by,
    cat: r.category,
    title: r.title,
    jpy: r.local_currency === "JPY" ? parseFloat(r.amount_local) : 0,
    usd: parseFloat(r.amount_usd),
    when: window.fmtDate(r.created_at),
    createdAt: r.created_at,
    note: r.note || "",
    splitWith: Array.isArray(r.split_with) ? r.split_with.filter(Boolean) : [],
    receiptPath: r.receipt_path || null,
    receiptUrl: (r.receipt_path ? signed.get(r.receipt_path) : null) || null
  }));
  window.recomputeExpenseDerived(tripId);
  window._tripDataLoadedAt[tripId] = Date.now();
  window._cacheTripSummary(tripId);
};
window.recomputeExpenseDerived = (tripId) => {
  window.LIFETIME_STATS = null;
  const totals = {};
  (window.EXPENSES || []).forEach((e) => {
    totals[e.cat] = (totals[e.cat] || 0) + e.usd;
  });
  const total = Object.values(totals).reduce((s, v) => s + v, 0) || 1;
  window.CATEGORIES = (window.CATEGORIES || []).map((c) => ({
    ...c,
    amt: totals[c.key] || 0,
    pct: Math.round((totals[c.key] || 0) / total * 100)
  }));
  if (window.TRIP && window.TRIP.id === tripId) {
    window.TRIP.budget.spentUSD = Object.values(totals).reduce((s, v) => s + v, 0);
  }
};
window.loadMembers = async (tripId) => {
  const { data, error } = await window.sb.from("trip_members").select("*, profiles ( name, initials, avatar_hue )").eq("trip_id", tripId);
  if (error) {
    console.error("loadMembers", error);
    return;
  }
  window.MEMBERS = (data || []).map((r) => {
    var _a, _b, _c;
    return {
      id: r.user_id,
      name: ((_a = r.profiles) == null ? void 0 : _a.name) || "Unknown",
      role: r.role,
      hue: ((_b = r.profiles) == null ? void 0 : _b.avatar_hue) || 35,
      initials: ((_c = r.profiles) == null ? void 0 : _c.initials) || "?"
    };
  });
};
window._signDocPaths = async (paths, expiresIn = 7200) => {
  const map = /* @__PURE__ */ new Map();
  const unique = [...new Set((paths || []).filter(Boolean))];
  if (unique.length === 0 || !window.sb) return map;
  try {
    const { data, error } = await window.sb.storage.from("documents").createSignedUrls(unique, expiresIn);
    if (error) {
      console.error("createSignedUrls", error);
      return map;
    }
    (data || []).forEach((d) => {
      if (d && d.signedUrl && !d.error) map.set(d.path, d.signedUrl);
    });
  } catch (e) {
    console.error("signDocPaths", e);
  }
  return map;
};
window.loadDocuments = async (tripId) => {
  const { data, error } = await window.sb.from("documents").select("*, document_photos ( storage_path )").eq("trip_id", tripId).order("created_at", { ascending: false });
  if (error) {
    console.error("loadDocuments", error);
    return;
  }
  const rows = data || [];
  const toSign = [];
  rows.forEach((r) => {
    if (r.file_path) toSign.push(r.file_path);
    if (r.secondary_file_path) toSign.push(r.secondary_file_path);
    if (r.cover_path) toSign.push(r.cover_path);
  });
  const signed = await window._signDocPaths(toSign);
  const byCat = { flights: [], lodging: [], visas: [], transport: [] };
  rows.forEach((r) => {
    let resolvedLink = null;
    let resolvedLabel = null;
    if (r.file_path) {
      resolvedLink = signed.get(r.file_path) || null;
      resolvedLabel = window.isRTL ? "استعراض ملف PDF" : "Open PDF";
    }
    let secondaryLink = null;
    if (r.secondary_file_path) {
      secondaryLink = signed.get(r.secondary_file_path) || null;
    }
    const doc = {
      id: r.id,
      category: r.category,
      kind: r.kind,
      title: r.title,
      sub: r.subtitle || "",
      size: r.file_size_bytes ? `${(r.file_size_bytes / 1024 / 1024).toFixed(1)} MB` : r.file_path ? "..." : "--",
      tint: r.tint,
      filePath: r.file_path || null,
      coverUrl: (r.cover_path ? signed.get(r.cover_path) : null) || null,
      coverPath: r.cover_path || null,
      link: resolvedLink,
      linkLabel: resolvedLabel,
      photos: (r.document_photos || []).map((p) => p.storage_path),
      // Phase 8 — structured per-category data
      details: r.details || {},
      costUSD: r.cost_usd != null ? parseFloat(r.cost_usd) : null,
      costLocal: r.cost_local != null ? parseFloat(r.cost_local) : null,
      costCurrency: r.cost_currency || null,
      linkedExpenseId: r.linked_expense_id || null,
      // null = shared with everyone; a user id = that traveler's own doc.
      ownerUserId: r.owner_user_id || null,
      secondaryFilePath: r.secondary_file_path || null,
      secondaryFileSize: r.secondary_file_size || null,
      secondaryLink
    };
    if (byCat[r.category]) byCat[r.category].push(doc);
  });
  window.DOCS_BY_CAT = byCat;
  window.DOCS_TRIP_ID = tripId;
  window.DOC_CATEGORIES = window.DOC_CATEGORIES.map((c) => ({
    ...c,
    count: (byCat[c.key] || []).length
  }));
};
window.uploadReceipt = async (expenseId, tripId, file) => {
  if (!file || !expenseId || !tripId) throw new Error("Missing receipt args");
  const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
  const path = `${tripId}/receipts/${expenseId}.${ext}`;
  const { error: upErr } = await window.sb.storage.from("documents").upload(path, file, {
    upsert: true,
    contentType: file.type || "image/jpeg"
  });
  if (upErr) throw upErr;
  const { data: signedData } = await window.sb.storage.from("documents").createSignedUrl(path, 7200);
  const publicUrl = (signedData == null ? void 0 : signedData.signedUrl) || null;
  const { error: dbErr } = await window.sb.from("expenses").update({
    receipt_path: path,
    receipt_url: publicUrl
  }).eq("id", expenseId);
  if (dbErr) {
    if (!/receipt/i.test(dbErr.message || "")) throw dbErr;
  }
  return publicUrl;
};
window.deleteReceipt = async (expenseId, receiptPath) => {
  if (receiptPath) {
    try {
      await window.sb.storage.from("documents").remove([receiptPath]);
    } catch (_) {
    }
  }
  const { error } = await window.sb.from("expenses").update({
    receipt_path: null,
    receipt_url: null
  }).eq("id", expenseId);
  if (error && !/receipt/i.test(error.message || "")) throw error;
};
function _makeInviteToken() {
  const alpha = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";
  let out = "";
  const buf = new Uint8Array(10);
  crypto.getRandomValues(buf);
  for (let i = 0; i < 10; i++) out += alpha[buf[i] % alpha.length];
  return out;
}
window.getOrCreateInvite = async (tripId, role = "Editor") => {
  const { data: existing, error: selErr } = await window.sb.from("trip_invites").select("token, revoked_at, expires_at").eq("trip_id", tripId).eq("role", role).maybeSingle();
  if (selErr) throw selErr;
  if (existing && !existing.revoked_at && (!existing.expires_at || new Date(existing.expires_at) > /* @__PURE__ */ new Date())) {
    return existing.token;
  }
  if (existing) {
    await window.sb.from("trip_invites").delete().eq("token", existing.token);
  }
  const token = _makeInviteToken();
  const expires = /* @__PURE__ */ new Date();
  expires.setDate(expires.getDate() + 30);
  const { error: insErr } = await window.sb.from("trip_invites").insert({
    token,
    trip_id: tripId,
    role,
    created_by: window.currentUserId,
    expires_at: expires.toISOString()
  });
  if (insErr) throw insErr;
  return token;
};
window.loadTripInvites = async (tripId) => {
  if (!tripId || !window.sb) return [];
  const { data, error } = await window.sb.from("trip_invites").select("*").eq("trip_id", tripId).order("created_at", { ascending: false });
  if (error) {
    if (/trip_invites/i.test(error.message || "")) return [];
    console.error("loadTripInvites", error);
    return [];
  }
  return data || [];
};
window.revokeInvite = async (token) => {
  const { error } = await window.sb.from("trip_invites").update({ revoked_at: (/* @__PURE__ */ new Date()).toISOString() }).eq("token", token);
  if (error) throw error;
};
window.redeemInvite = async (token) => {
  if (!token) throw new Error("No invite token");
  const { data, error } = await window.sb.rpc("redeem_trip_invite", { p_token: token });
  if (error) throw error;
  const row = Array.isArray(data) ? data[0] : data;
  if (!row) return null;
  return {
    tripId: row.out_trip_id || row.trip_id,
    role: row.out_role || row.role
  };
};
window.inviteLink = (token) => `${window.location.origin}/?join=${token}`;
window.uploadTripCover = async (tripId, file) => {
  if (!tripId || !file) throw new Error("Missing cover args");
  const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
  const path = `${tripId}/cover.${ext}`;
  const { error: upErr } = await window.sb.storage.from("documents").upload(path, file, {
    upsert: true,
    contentType: file.type || "image/jpeg"
  });
  if (upErr) throw upErr;
  const { data: { publicUrl } } = window.sb.storage.from("documents").getPublicUrl(path);
  const url = `${publicUrl}?v=${Date.now()}`;
  const { error: dbErr } = await window.sb.from("trips").update({
    cover_path: path,
    cover_url: url
  }).eq("id", tripId);
  if (dbErr) {
    if (!/cover/i.test(dbErr.message || "")) throw dbErr;
  }
  return url;
};
window.deleteTripCover = async (tripId, coverPath) => {
  if (coverPath) {
    try {
      await window.sb.storage.from("documents").remove([coverPath]);
    } catch (_) {
    }
  }
  const { error } = await window.sb.from("trips").update({
    cover_path: null,
    cover_url: null
  }).eq("id", tripId);
  if (error && !/cover/i.test(error.message || "")) throw error;
};
window.uploadDocCover = async (docId, tripId, file) => {
  if (!docId || !tripId || !file) throw new Error("Missing cover args");
  const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
  const path = `${tripId}/doc-covers/${docId}.${ext}`;
  const { error: upErr } = await window.sb.storage.from("documents").upload(path, file, {
    upsert: true,
    contentType: file.type || "image/jpeg"
  });
  if (upErr) throw upErr;
  const { data: signedData } = await window.sb.storage.from("documents").createSignedUrl(path, 7200);
  const url = (signedData == null ? void 0 : signedData.signedUrl) || null;
  const { error: dbErr } = await window.sb.from("documents").update({
    cover_path: path,
    cover_url: url
  }).eq("id", docId);
  if (dbErr) {
    if (!/cover/i.test(dbErr.message || "")) throw dbErr;
  }
  return url;
};
window.deleteDocCover = async (docId, coverPath) => {
  if (coverPath) {
    try {
      await window.sb.storage.from("documents").remove([coverPath]);
    } catch (_) {
    }
  }
  const { error } = await window.sb.from("documents").update({
    cover_path: null,
    cover_url: null
  }).eq("id", docId);
  if (error && !/cover/i.test(error.message || "")) throw error;
};
window.removeDocumentFile = async (docId, filePath) => {
  if (!window.sb) throw new Error("Not signed in");
  if (filePath) {
    try {
      await window.sb.storage.from("documents").remove([filePath]);
    } catch (_) {
    }
  }
  const { data: row } = await window.sb.from("documents").select("link_label").eq("id", docId).maybeSingle();
  const fileOwnsLink = row && /^Open (PDF|file)/i.test(row.link_label || "");
  const patch = { file_path: null, file_size_bytes: null };
  if (fileOwnsLink) {
    patch.link_url = null;
    patch.link_label = null;
  }
  const { error } = await window.sb.from("documents").update(patch).eq("id", docId);
  if (error) throw error;
};
window.uploadDocumentFile = async (docId, tripId, file) => {
  const ext = file.name.split(".").pop().toLowerCase();
  const path = `${tripId}/${docId}.${ext}`;
  const { error: upErr } = await window.sb.storage.from("documents").upload(path, file, { upsert: true, contentType: file.type });
  if (upErr) throw upErr;
  const { data: signedData } = await window.sb.storage.from("documents").createSignedUrl(path, 7200);
  const publicUrl = (signedData == null ? void 0 : signedData.signedUrl) || null;
  const { error: dbErr } = await window.sb.from("documents").update({
    file_path: path,
    file_size_bytes: file.size,
    link_url: publicUrl,
    link_label: "Open PDF"
  }).eq("id", docId);
  if (dbErr) throw dbErr;
  return publicUrl;
};
window.loadLifetimeStats = async () => {
  const { data, error } = await window.sb.from("expenses").select("*").order("created_at", { ascending: false });
  if (error) {
    console.error("loadLifetimeStats", error);
    return;
  }
  let allSettlements = [];
  try {
    const { data: sData, error: sErr } = await window.sb.from("settlements").select("*");
    if (!sErr) allSettlements = sData || [];
  } catch (_) {
  }
  const trips = window.TRIPS || [];
  const expenses = data || [];
  const totalSpentUSD = expenses.reduce((s, e) => s + (parseFloat(e.amount_usd) || 0), 0);
  const totalTrips = trips.length;
  let totalDays = 0;
  trips.forEach((t2) => {
    if (!t2.startDate || !t2.endDate) return;
    const ms = new Date(t2.endDate) - new Date(t2.startDate);
    totalDays += Math.max(1, Math.round(ms / 864e5) + 1);
  });
  const countriesSet = /* @__PURE__ */ new Set();
  trips.forEach((t2) => {
    (t2.countries || []).forEach((c) => c && countriesSet.add(c));
    if (t2.country) countriesSet.add(t2.country);
  });
  const countries = [...countriesSet];
  const byYearMap = {};
  expenses.forEach((e) => {
    const y = new Date(e.created_at).getFullYear();
    byYearMap[y] = byYearMap[y] || { year: y, spent: 0, count: 0 };
    byYearMap[y].spent += parseFloat(e.amount_usd) || 0;
    byYearMap[y].count += 1;
  });
  const yearCountrySets = {};
  trips.forEach((t2) => {
    if (!t2.startDate) return;
    const y = new Date(t2.startDate).getFullYear();
    byYearMap[y] = byYearMap[y] || { year: y, spent: 0, count: 0, trips: 0, days: 0 };
    byYearMap[y].trips = (byYearMap[y].trips || 0) + 1;
    const dur = t2.endDate ? Math.round((new Date(t2.endDate) - new Date(t2.startDate)) / 864e5) + 1 : 1;
    byYearMap[y].days = (byYearMap[y].days || 0) + Math.max(1, dur);
    yearCountrySets[y] = yearCountrySets[y] || /* @__PURE__ */ new Set();
    const list = Array.isArray(t2.countries) && t2.countries.length > 0 ? t2.countries.filter(Boolean) : t2.country_code ? [t2.country_code] : [];
    list.forEach((c) => yearCountrySets[y].add(c));
  });
  Object.keys(byYearMap).forEach((y) => {
    byYearMap[y].countries = yearCountrySets[y] ? yearCountrySets[y].size : 0;
  });
  const byYear = Object.values(byYearMap).sort((a, b) => a.year - b.year);
  const now = /* @__PURE__ */ new Date();
  const byMonth = [];
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    byMonth.push({
      key: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`,
      year: d.getFullYear(),
      month: d.getMonth(),
      spent: 0,
      count: 0
    });
  }
  const monthIndex = Object.fromEntries(byMonth.map((m, i) => [m.key, i]));
  expenses.forEach((e) => {
    const dt = new Date(e.created_at);
    const key = `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}`;
    const idx = monthIndex[key];
    if (idx == null) return;
    byMonth[idx].spent += parseFloat(e.amount_usd) || 0;
    byMonth[idx].count += 1;
  });
  const wkSpend = [0, 0, 0, 0, 0, 0, 0];
  const wkDays = [/* @__PURE__ */ new Set(), /* @__PURE__ */ new Set(), /* @__PURE__ */ new Set(), /* @__PURE__ */ new Set(), /* @__PURE__ */ new Set(), /* @__PURE__ */ new Set(), /* @__PURE__ */ new Set()];
  expenses.forEach((e) => {
    const dt = new Date(e.created_at);
    const wd = dt.getDay();
    wkSpend[wd] += parseFloat(e.amount_usd) || 0;
    wkDays[wd].add(dt.toISOString().slice(0, 10));
  });
  const byWeekday = wkSpend.map((spent, i) => ({
    day: i,
    spent,
    avg: wkDays[i].size > 0 ? spent / wkDays[i].size : 0
  }));
  const byCatMap = {};
  expenses.forEach((e) => {
    const c = e.category || "misc";
    byCatMap[c] = (byCatMap[c] || 0) + (parseFloat(e.amount_usd) || 0);
  });
  const byCategory = Object.entries(byCatMap).map(([key, value]) => ({ key, value, pct: totalSpentUSD > 0 ? value / totalSpentUSD * 100 : 0 })).sort((a, b) => b.value - a.value);
  const tripSpendMap = {};
  expenses.forEach((e) => {
    tripSpendMap[e.trip_id] = (tripSpendMap[e.trip_id] || 0) + (parseFloat(e.amount_usd) || 0);
  });
  const userId = window.currentUserId;
  const balanceByTrip = {};
  if (userId) {
    expenses.forEach((e) => {
      const splitters = Array.isArray(e.split_with) ? e.split_with.filter(Boolean) : [];
      const isShared = splitters.length > 0;
      const totalSharers = isShared ? splitters.length + 1 : 1;
      const share = (parseFloat(e.amount_usd) || 0) / totalSharers;
      balanceByTrip[e.trip_id] = balanceByTrip[e.trip_id] || 0;
      if (e.created_by === userId) {
        balanceByTrip[e.trip_id] += parseFloat(e.amount_usd) || 0;
        if (isShared) balanceByTrip[e.trip_id] -= share;
      } else if (isShared && splitters.includes(userId)) {
        balanceByTrip[e.trip_id] -= share;
      }
    });
    allSettlements.forEach((s) => {
      const amt = parseFloat(s.amount_usd) || 0;
      balanceByTrip[s.trip_id] = balanceByTrip[s.trip_id] || 0;
      if (s.from_user === userId) balanceByTrip[s.trip_id] += amt;
      else if (s.to_user === userId) balanceByTrip[s.trip_id] -= amt;
    });
  }
  const tripSpend = trips.map((t2) => {
    const dur = t2.startDate && t2.endDate ? Math.max(1, Math.round((new Date(t2.endDate) - new Date(t2.startDate)) / 864e5) + 1) : 1;
    const spent = tripSpendMap[t2.id] || 0;
    return {
      id: t2.id,
      title: t2.title,
      country: t2.country,
      cover: t2.cover,
      coverImageUrl: t2.coverImageUrl,
      spent,
      dur,
      dailyAvg: spent / dur,
      budgetPlanned: t2.budgetPlannedUSD || 0,
      startDate: t2.startDate,
      endDate: t2.endDate,
      personalBalance: balanceByTrip[t2.id] || 0,
      // Per-trip currency context -- needed so Insights' TripList and any
      // other per-trip display surface can format each row in its OWN
      // currency via fmtTripMoney, instead of inheriting whatever
      // currency the user-last-opened trip happens to have.
      homeCurrency: t2.homeCurrency || "USD",
      fx: t2.fx || 1
    };
  }).sort((a, b) => b.spent - a.spent);
  const topTx = expenses.reduce((m, e) => {
    const v = parseFloat(e.amount_usd) || 0;
    return v > ((m == null ? void 0 : m.value) || 0) ? { value: v, when: e.created_at, trip_id: e.trip_id, category: e.category } : m;
  }, null);
  const byMemberMap = {};
  expenses.forEach((e) => {
    if (!e.created_by) return;
    byMemberMap[e.created_by] = (byMemberMap[e.created_by] || 0) + (parseFloat(e.amount_usd) || 0);
  });
  const byMember = Object.entries(byMemberMap).map(([userId2, value]) => ({ userId: userId2, value, pct: totalSpentUSD > 0 ? value / totalSpentUSD * 100 : 0 })).sort((a, b) => b.value - a.value);
  const todayMidnight = /* @__PURE__ */ new Date();
  todayMidnight.setHours(0, 0, 0, 0);
  const statusCounts = { current: 0, upcoming: 0, past: 0 };
  trips.forEach((t2) => {
    if (!t2.startDate || !t2.endDate) {
      statusCounts.past++;
      return;
    }
    const s = new Date(t2.startDate);
    s.setHours(0, 0, 0, 0);
    const e = new Date(t2.endDate);
    e.setHours(0, 0, 0, 0);
    if (todayMidnight < s) statusCounts.upcoming++;
    else if (todayMidnight > e) statusCounts.past++;
    else statusCounts.current++;
  });
  const longestTrip = tripSpend.reduce((m, t2) => t2.dur > ((m == null ? void 0 : m.dur) || 0) ? t2 : m, null);
  const mostExpensive = tripSpend[0] || null;
  const avgTripCost = tripSpend.length > 0 ? totalSpentUSD / tripSpend.length : 0;
  const avgDailyAcrossLifetime = totalDays > 0 ? totalSpentUSD / totalDays : 0;
  const currencyMix = [...new Set(expenses.map((e) => e.local_currency).filter(Boolean))];
  window.LIFETIME_STATS = {
    totalSpentUSD,
    totalTrips,
    totalDays,
    countries: countries.length,
    countriesList: countries,
    byYear,
    byMonth,
    byWeekday,
    byCategory,
    tripSpend,
    byMember,
    statusCounts,
    longestTrip,
    mostExpensive,
    avgTripCost,
    avgDailyAcrossLifetime,
    topTx,
    currencyMix,
    balanceByTrip,
    expenseCount: expenses.length,
    loadedAt: Date.now()
  };
  window.LIFETIME_STATS_LKG = window.LIFETIME_STATS;
  return window.LIFETIME_STATS;
};
window.loadAuditLog = async (tripId) => {
  const { data, error } = await window.sb.from("audit_log").select("*, profiles ( name, initials, avatar_hue )").eq("trip_id", tripId).order("created_at", { ascending: false }).limit(20);
  if (error) {
    console.error("loadAuditLog", error);
    return;
  }
  window.AUDIT = (data || []).map((r) => ({
    id: r.id,
    who: r.user_id,
    action: r.action,
    target: r.target,
    when: new Date(r.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }));
};
window.addExpense = async (tripId, userId, fields) => {
  const basePayload = {
    trip_id: tripId,
    created_by: userId,
    title: fields.title,
    category: fields.category,
    amount_usd: fields.amountUSD,
    amount_local: fields.amountLocal,
    local_currency: fields.localCurrency,
    note: fields.note || null
  };
  let { data, error } = await window.sb.from("expenses").insert({ ...basePayload, split_with: fields.splitWith || [] }).select().single();
  if (error && /split_with/i.test(error.message || "")) {
    ({ data, error } = await window.sb.from("expenses").insert(basePayload).select().single());
  }
  if (error) throw error;
  window.LIFETIME_STATS = null;
  window.sb.from("audit_log").insert({
    trip_id: tripId,
    user_id: userId,
    action: "added",
    target: fields.title
  }).then(() => {
  }, () => {
  });
  return data;
};
window.updateDocument = async (docId, fields) => {
  if (!window.sb) throw new Error("Not signed in");
  const payload = {};
  if (fields.title !== void 0) payload.title = (fields.title || "").trim();
  if (fields.subtitle !== void 0) payload.subtitle = (fields.subtitle || "").trim() || null;
  if (fields.category !== void 0) payload.category = fields.category;
  if (fields.linkUrl !== void 0) payload.link_url = (fields.linkUrl || "").trim() || null;
  if (fields.linkLabel !== void 0) payload.link_label = (fields.linkLabel || "").trim() || null;
  if (fields.details !== void 0) payload.details = fields.details || {};
  if (fields.costUSD !== void 0) payload.cost_usd = fields.costUSD == null ? null : Number(fields.costUSD);
  if (fields.costLocal !== void 0) payload.cost_local = fields.costLocal == null ? null : Number(fields.costLocal);
  if (fields.costCurrency !== void 0) payload.cost_currency = fields.costCurrency || null;
  if (fields.ownerUserId !== void 0) payload.owner_user_id = fields.ownerUserId || null;
  if (Object.keys(payload).length === 0) return;
  let { error } = await window.sb.from("documents").update(payload).eq("id", docId);
  if (error && /owner_user_id/i.test(error.message || "") && "owner_user_id" in payload) {
    delete payload.owner_user_id;
    if (Object.keys(payload).length > 0) {
      ({ error } = await window.sb.from("documents").update(payload).eq("id", docId));
    } else {
      error = null;
    }
  }
  if (error) throw error;
};
window.linkDocExpense = async (docId, tripId) => {
  if (!window.sb || !tripId) throw new Error("Missing context");
  const { data: doc, error: docErr } = await window.sb.from("documents").select("*").eq("id", docId).single();
  if (docErr) throw docErr;
  if (doc.linked_expense_id) return doc.linked_expense_id;
  if (doc.cost_usd == null || doc.cost_usd <= 0) throw new Error("Set a cost first");
  const CAT_MAP = { flights: "transit", lodging: "lodging", transport: "transit", visas: "misc" };
  const expenseCat = CAT_MAP[doc.category] || "misc";
  const titlePrefix = doc.category === "flights" ? "✈ " : doc.category === "lodging" ? "🏨 " : doc.category === "transport" ? "🚆 " : "";
  const { data: exp, error: expErr } = await window.sb.from("expenses").insert({
    trip_id: tripId,
    created_by: window.currentUserId,
    title: (titlePrefix + (doc.title || "Document")).slice(0, 100),
    category: expenseCat,
    amount_usd: Number(doc.cost_usd),
    amount_local: doc.cost_local != null ? Number(doc.cost_local) : null,
    local_currency: doc.cost_currency || null,
    note: doc.subtitle || null
  }).select().single();
  if (expErr) throw expErr;
  const { error: linkErr } = await window.sb.from("documents").update({ linked_expense_id: exp.id }).eq("id", docId);
  if (linkErr) throw linkErr;
  window.LIFETIME_STATS = null;
  await window.loadExpenses(tripId);
  await window.loadDocuments(tripId);
  return exp.id;
};
window.unlinkDocExpense = async (docId, tripId) => {
  if (!window.sb) throw new Error("Not signed in");
  const { data: doc } = await window.sb.from("documents").select("linked_expense_id").eq("id", docId).single();
  if (!(doc == null ? void 0 : doc.linked_expense_id)) return;
  await window.sb.from("expenses").delete().eq("id", doc.linked_expense_id);
  window.LIFETIME_STATS = null;
  await window.loadExpenses(tripId);
  await window.loadDocuments(tripId);
};
window.uploadDocumentSecondaryFile = async (docId, tripId, file) => {
  if (!docId || !tripId || !file) throw new Error("Missing args");
  const ext = (file.name.split(".").pop() || "pdf").toLowerCase();
  const path = `${tripId}/${docId}-2.${ext}`;
  const { error: upErr } = await window.sb.storage.from("documents").upload(path, file, { upsert: true, contentType: file.type || "application/pdf" });
  if (upErr) throw upErr;
  const { error: dbErr } = await window.sb.from("documents").update({
    secondary_file_path: path,
    secondary_file_size: file.size
  }).eq("id", docId);
  if (dbErr && !/secondary/i.test(dbErr.message || "")) throw dbErr;
};
window.removeDocumentSecondaryFile = async (docId, secondaryPath) => {
  if (!window.sb) throw new Error("Not signed in");
  if (secondaryPath) {
    try {
      await window.sb.storage.from("documents").remove([secondaryPath]);
    } catch (_) {
    }
  }
  const { error } = await window.sb.from("documents").update({
    secondary_file_path: null,
    secondary_file_size: null
  }).eq("id", docId);
  if (error && !/secondary/i.test(error.message || "")) throw error;
};
window.addDocument = async (tripId, userId, fields) => {
  const base = {
    trip_id: tripId,
    uploaded_by: userId,
    title: fields.title,
    subtitle: fields.subtitle || null,
    category: fields.category,
    kind: fields.kind || "pdf",
    tint: fields.tint || "clay",
    link_url: fields.linkUrl || null,
    link_label: fields.linkLabel || null,
    details: fields.details || {},
    cost_usd: fields.costUSD != null ? Number(fields.costUSD) : null,
    cost_local: fields.costLocal != null ? Number(fields.costLocal) : null,
    cost_currency: fields.costCurrency || null
  };
  let { data, error } = await window.sb.from("documents").insert({ ...base, owner_user_id: fields.ownerUserId || null }).select().single();
  if (error && /owner_user_id/i.test(error.message || "")) {
    ({ data, error } = await window.sb.from("documents").insert(base).select().single());
  }
  if (error) throw error;
  window.sb.from("audit_log").insert({
    trip_id: tripId,
    user_id: userId,
    action: "uploaded",
    target: fields.title
  }).then(() => {
  }, () => {
  });
  return data;
};
window.loadTripDetail = async (tripId) => {
  const { data, error } = await window.sb.from("trips").select("*").eq("id", tripId).single();
  if (error) {
    console.error("loadTripDetail", error);
    return;
  }
  const { daysIn, daysTotal } = window.tripDays(data.start_date, data.end_date);
  window.TRIP = {
    id: data.id,
    title: data.title,
    subtitle: data.subtitle || "",
    dates: window.fmtDateRange(data.start_date, data.end_date),
    startDate: data.start_date,
    endDate: data.end_date,
    country: data.country_code || "",
    countries: Array.isArray(data.countries) && data.countries.length > 0 ? data.countries.filter(Boolean) : data.country_code ? [data.country_code] : [],
    daysIn,
    daysTotal,
    // Home currency = viewer's account preference (see loadTrips note).
    homeCurrency: window.USER_DEFAULT_CURRENCY || data.home_currency || "USD",
    localCurrency: data.local_currency || "USD",
    fx: parseFloat(data.fx_rate) || 1,
    budget: { plannedUSD: parseFloat(data.budget_planned_usd) || 0, spentUSD: 0 },
    cover: data.cover_style || "kyoto",
    coverImageUrl: data.cover_image_url || null,
    status: data.status,
    weather: { temp: "--", cond: "" },
    next: { label: "", when: "" }
  };
};
window.seedTripFromList = (tripId) => {
  var _a;
  if (!tripId) return false;
  if (window.TRIP && window.TRIP.id === tripId) return true;
  const t2 = (window.TRIPS || []).find((x) => x.id === tripId);
  if (!t2) return false;
  const { daysIn, daysTotal } = window.tripDays(t2.startDate, t2.endDate);
  window.TRIP = {
    id: t2.id,
    title: t2.title,
    subtitle: t2.sub || "",
    dates: t2.dates,
    startDate: t2.startDate,
    endDate: t2.endDate,
    country: t2.country || "",
    countries: t2.countries || [],
    daysIn,
    daysTotal,
    homeCurrency: window.USER_DEFAULT_CURRENCY || t2.homeCurrency || "USD",
    localCurrency: t2.localCurrency || t2.homeCurrency || "USD",
    fx: t2.fx || 1,
    budget: { plannedUSD: t2.budgetPlannedUSD || 0, spentUSD: 0 },
    cover: t2.cover || "kyoto",
    coverImageUrl: t2.coverImageUrl || null,
    status: t2.status,
    weather: { temp: "--", cond: "" },
    next: { label: "", when: "" }
  };
  window.EXPENSES = [];
  window.MEMBERS = [];
  window.DOCS_BY_CAT = { flights: [], lodging: [], visas: [], transport: [] };
  window.DOCS_TRIP_ID = null;
  window.ITINERARY = [];
  window.SETTLEMENTS = [];
  window.AUDIT = [];
  (_a = window.recomputeExpenseDerived) == null ? void 0 : _a.call(window, t2.id);
  return true;
};
window.uploadTripCover = async (tripId, file) => {
  var _a;
  const ext = file.name.split(".").pop();
  const path = `${window.currentUserId}/${tripId}.${ext}`;
  const { error: upErr } = await window.sb.storage.from("covers").upload(path, file, { upsert: true });
  if (upErr) throw upErr;
  const { data: { publicUrl } } = window.sb.storage.from("covers").getPublicUrl(path);
  const { error: dbErr } = await window.sb.from("trips").update({ cover_image_url: publicUrl }).eq("id", tripId);
  if (dbErr) throw dbErr;
  if (((_a = window.TRIP) == null ? void 0 : _a.id) === tripId) window.TRIP.coverImageUrl = publicUrl;
  return publicUrl;
};
window.createTrip = async (fields) => {
  const userId = window.currentUserId;
  if (!userId) throw new Error("Not signed in");
  const slug = fields.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 20) + "-" + (/* @__PURE__ */ new Date()).getFullYear().toString().slice(2);
  const uniqueId = slug + "-" + Math.random().toString(36).slice(2, 6);
  const { data: trip, error: tripErr } = await window.sb.from("trips").insert({
    id: uniqueId,
    owner_id: userId,
    title: fields.title,
    subtitle: fields.subtitle || null,
    start_date: fields.startDate,
    end_date: fields.endDate,
    country_code: fields.countryCode || null,
    // Home currency is ALWAYS the user's account preference — it is not a
    // per-trip choice. (Budget amounts are stored in USD; home currency is
    // only the display currency, and every user views trips in their own.)
    home_currency: window.USER_DEFAULT_CURRENCY || "USD",
    local_currency: fields.localCurrency || "USD",
    // FX is auto from the live table, never hand-entered.
    fx_rate: window.FX_RATES[window.USER_DEFAULT_CURRENCY] || 1,
    budget_planned_usd: fields.budgetUSD || null,
    cover_style: fields.coverStyle || "kyoto",
    status: fields.status || "upcoming"
  }).select().single();
  if (tripErr) throw tripErr;
  await window.sb.from("trip_members").insert({
    trip_id: trip.id,
    user_id: userId,
    role: "Admin"
  });
  return trip;
};
window.removeMember = async (tripId, userId) => {
  const { error } = await window.sb.from("trip_members").delete().eq("trip_id", tripId).eq("user_id", userId);
  if (error) throw error;
};
window.updateMemberRole = async (tripId, userId, role) => {
  const { error } = await window.sb.from("trip_members").update({ role }).eq("trip_id", tripId).eq("user_id", userId);
  if (error) throw error;
};
window.updateExpense = async (expenseId, tripId, fields) => {
  const baseUpdate = {
    title: fields.title,
    category: fields.category,
    amount_usd: fields.amountUSD,
    amount_local: fields.amountLocal,
    local_currency: fields.localCurrency,
    note: fields.note || null
  };
  let { error } = await window.sb.from("expenses").update({ ...baseUpdate, split_with: fields.splitWith || [] }).eq("id", expenseId);
  if (error && /split_with/i.test(error.message || "")) {
    ({ error } = await window.sb.from("expenses").update(baseUpdate).eq("id", expenseId));
  }
  if (error) throw error;
  window.LIFETIME_STATS = null;
  await window.sb.from("audit_log").insert({
    trip_id: tripId,
    user_id: window.currentUserId,
    action: "edited",
    target: fields.title
  });
};
window.deleteExpense = async (expenseId, tripId) => {
  try {
    await window.sb.from("documents").update({ linked_expense_id: null }).eq("linked_expense_id", expenseId);
  } catch (_) {
  }
  try {
    await window.sb.from("itinerary_items").update({ linked_expense_id: null }).eq("linked_expense_id", expenseId);
  } catch (_) {
  }
  const { error } = await window.sb.from("expenses").delete().eq("id", expenseId);
  if (error) throw error;
  window.LIFETIME_STATS = null;
  await window.sb.from("audit_log").insert({
    trip_id: tripId,
    user_id: window.currentUserId,
    action: "removed",
    target: `Expense ${expenseId}`
  }).then(() => {
  });
  if (tripId) {
    try {
      await window.loadDocuments(tripId);
    } catch (_) {
    }
    try {
      await window.loadItinerary(tripId);
    } catch (_) {
    }
  }
};
window.updateExpenseLink = async (docId, linkUrl, linkLabel) => {
  const { error } = await window.sb.from("documents").update({ link_url: linkUrl, link_label: linkLabel }).eq("id", docId);
  if (error) throw error;
};
window.deleteDocument = async (docId, tripId, title) => {
  const { error } = await window.sb.from("documents").delete().eq("id", docId);
  if (error) throw error;
  await window.sb.from("audit_log").insert({
    trip_id: tripId,
    user_id: window.currentUserId,
    action: "removed",
    target: title || `Document ${docId}`
  }).then(() => {
  });
};
window._activeRtChannels = window._activeRtChannels || /* @__PURE__ */ new Map();
window.subscribeToTrip = (tripId, onChange) => {
  const existing = window._activeRtChannels.get(tripId);
  if (existing) {
    try {
      window.sb.removeChannel(existing);
    } catch (_) {
    }
    window._activeRtChannels.delete(tripId);
  }
  const channel = window.sb.channel(`trip:${tripId}`).on("postgres_changes", {
    event: "*",
    schema: "public",
    table: "expenses",
    filter: `trip_id=eq.${tripId}`
  }, async () => {
    await window.loadExpenses(tripId);
    onChange == null ? void 0 : onChange();
  }).on("postgres_changes", {
    event: "*",
    schema: "public",
    table: "documents",
    filter: `trip_id=eq.${tripId}`
  }, async () => {
    await window.loadDocuments(tripId);
    onChange == null ? void 0 : onChange();
  }).on("postgres_changes", {
    event: "*",
    schema: "public",
    table: "trip_members",
    filter: `trip_id=eq.${tripId}`
  }, async () => {
    await window.loadMembers(tripId);
    onChange == null ? void 0 : onChange();
  }).subscribe();
  window._activeRtChannels.set(tripId, channel);
  return () => {
    try {
      window.sb.removeChannel(channel);
    } catch (_) {
    }
    window._activeRtChannels.delete(tripId);
  };
};
[
  "loadTrips",
  "loadTripDetail",
  "loadMembers",
  "loadExpenses",
  "loadDocuments",
  "loadAuditLog",
  "loadSettlements",
  "loadItinerary",
  "loadLifetimeStats",
  "loadTripInvites"
].forEach((name) => {
  const orig = window[name];
  if (typeof orig !== "function") return;
  window[name] = async (...args) => {
    var _a;
    const out = await orig(...args);
    try {
      (_a = window.notifyDataChange) == null ? void 0 : _a.call(window);
    } catch (_) {
    }
    return out;
  };
});
window.PUSH_VAPID_PUBLIC = "BAhkqnHnpWAMntnCQoIr1vKH3hZLfO0rBaRpdvGPPNxNUA1a78-cQEZQZ_21nExLmamhlzBmMekzBhcU4oxO3pc";
function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(base64);
  const arr = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) arr[i] = raw.charCodeAt(i);
  return arr;
}
window.pushSupported = () => !!window.PUSH_VAPID_PUBLIC && "serviceWorker" in navigator && "PushManager" in window && "Notification" in window;
window.pushStatus = async () => {
  if (!window.pushSupported()) return "unsupported";
  if (Notification.permission === "denied") return "denied";
  try {
    const reg = await navigator.serviceWorker.ready;
    const sub = await reg.pushManager.getSubscription();
    return sub ? "on" : "off";
  } catch (_) {
    return "off";
  }
};
window.pushSubscribe = async () => {
  if (!window.pushSupported()) throw new Error("Push not supported on this device");
  const perm = await Notification.requestPermission();
  if (perm !== "granted") throw new Error(window.isRTL ? "لم يُمنح إذن الإشعارات" : "Notification permission denied");
  const reg = await navigator.serviceWorker.ready;
  let sub = await reg.pushManager.getSubscription();
  if (!sub) {
    sub = await reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(window.PUSH_VAPID_PUBLIC)
    });
  }
  const json = sub.toJSON();
  const { error } = await window.sb.from("push_subscriptions").upsert({
    user_id: window.currentUserId,
    endpoint: sub.endpoint,
    p256dh: json.keys.p256dh,
    auth: json.keys.auth
  }, { onConflict: "endpoint" });
  if (error) throw error;
  return "on";
};
window.pushUnsubscribe = async () => {
  try {
    const reg = await navigator.serviceWorker.ready;
    const sub = await reg.pushManager.getSubscription();
    if (sub) {
      try {
        await window.sb.from("push_subscriptions").delete().eq("endpoint", sub.endpoint);
      } catch (_) {
      }
      try {
        await sub.unsubscribe();
      } catch (_) {
      }
    }
  } catch (_) {
  }
  return "off";
};
function IOSStatusBar({ dark = false, time = "9:41" }) {
  const c = dark ? "#fff" : "#000";
  return /* @__PURE__ */ React.createElement("div", { style: {
    display: "flex",
    gap: 154,
    alignItems: "center",
    justifyContent: "center",
    padding: "21px 24px 19px",
    boxSizing: "border-box",
    position: "relative",
    zIndex: 20,
    width: "100%"
  } }, /* @__PURE__ */ React.createElement("div", { style: { flex: 1, height: 22, display: "flex", alignItems: "center", justifyContent: "center", paddingTop: 1.5 } }, /* @__PURE__ */ React.createElement("span", { style: {
    fontFamily: '-apple-system, "SF Pro", system-ui',
    fontWeight: 590,
    fontSize: 17,
    lineHeight: "22px",
    color: c
  } }, time)), /* @__PURE__ */ React.createElement("div", { style: { flex: 1, height: 22, display: "flex", alignItems: "center", justifyContent: "center", gap: 7, paddingTop: 1, paddingInlineEnd: 1 } }, /* @__PURE__ */ React.createElement("svg", { width: "19", height: "12", viewBox: "0 0 19 12" }, /* @__PURE__ */ React.createElement("rect", { x: "0", y: "7.5", width: "3.2", height: "4.5", rx: "0.7", fill: c }), /* @__PURE__ */ React.createElement("rect", { x: "4.8", y: "5", width: "3.2", height: "7", rx: "0.7", fill: c }), /* @__PURE__ */ React.createElement("rect", { x: "9.6", y: "2.5", width: "3.2", height: "9.5", rx: "0.7", fill: c }), /* @__PURE__ */ React.createElement("rect", { x: "14.4", y: "0", width: "3.2", height: "12", rx: "0.7", fill: c })), /* @__PURE__ */ React.createElement("svg", { width: "17", height: "12", viewBox: "0 0 17 12" }, /* @__PURE__ */ React.createElement("path", { d: "M8.5 3.2C10.8 3.2 12.9 4.1 14.4 5.6L15.5 4.5C13.7 2.7 11.2 1.5 8.5 1.5C5.8 1.5 3.3 2.7 1.5 4.5L2.6 5.6C4.1 4.1 6.2 3.2 8.5 3.2Z", fill: c }), /* @__PURE__ */ React.createElement("path", { d: "M8.5 6.8C9.9 6.8 11.1 7.3 12 8.2L13.1 7.1C11.8 5.9 10.2 5.1 8.5 5.1C6.8 5.1 5.2 5.9 3.9 7.1L5 8.2C5.9 7.3 7.1 6.8 8.5 6.8Z", fill: c }), /* @__PURE__ */ React.createElement("circle", { cx: "8.5", cy: "10.5", r: "1.5", fill: c })), /* @__PURE__ */ React.createElement("svg", { width: "27", height: "13", viewBox: "0 0 27 13" }, /* @__PURE__ */ React.createElement("rect", { x: "0.5", y: "0.5", width: "23", height: "12", rx: "3.5", stroke: c, strokeOpacity: "0.35", fill: "none" }), /* @__PURE__ */ React.createElement("rect", { x: "2", y: "2", width: "20", height: "9", rx: "2", fill: c }), /* @__PURE__ */ React.createElement("path", { d: "M25 4.5V8.5C25.8 8.2 26.5 7.2 26.5 6.5C26.5 5.8 25.8 4.8 25 4.5Z", fill: c, fillOpacity: "0.4" }))));
}
function IOSGlassPill({ children, dark = false, style = {} }) {
  return /* @__PURE__ */ React.createElement("div", { style: {
    height: 44,
    minWidth: 44,
    borderRadius: 9999,
    position: "relative",
    overflow: "hidden",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: dark ? "0 2px 6px rgba(0,0,0,0.35), 0 6px 16px rgba(0,0,0,0.2)" : "0 1px 3px rgba(0,0,0,0.07), 0 3px 10px rgba(0,0,0,0.06)",
    ...style
  } }, /* @__PURE__ */ React.createElement("div", { style: {
    position: "absolute",
    inset: 0,
    borderRadius: 9999,
    backdropFilter: "blur(12px) saturate(180%)",
    WebkitBackdropFilter: "blur(12px) saturate(180%)",
    background: dark ? "rgba(120,120,128,0.28)" : "rgba(255,255,255,0.5)"
  } }), /* @__PURE__ */ React.createElement("div", { style: {
    position: "absolute",
    inset: 0,
    borderRadius: 9999,
    boxShadow: dark ? "inset 1.5px 1.5px 1px rgba(255,255,255,0.15), inset -1px -1px 1px rgba(255,255,255,0.08)" : "inset 1.5px 1.5px 1px rgba(255,255,255,0.7), inset -1px -1px 1px rgba(255,255,255,0.4)",
    border: dark ? "0.5px solid rgba(255,255,255,0.15)" : "0.5px solid rgba(0,0,0,0.06)"
  } }), /* @__PURE__ */ React.createElement("div", { style: { position: "relative", zIndex: 1, display: "flex", alignItems: "center", padding: "0 4px" } }, children));
}
function IOSNavBar({ title = "Title", dark = false, trailingIcon = true }) {
  const muted = dark ? "rgba(255,255,255,0.6)" : "#404040";
  const text = dark ? "#fff" : "#000";
  const pillIcon = (content) => /* @__PURE__ */ React.createElement(IOSGlassPill, { dark }, /* @__PURE__ */ React.createElement("div", { style: { width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center" } }, content));
  return /* @__PURE__ */ React.createElement("div", { style: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
    paddingTop: 62,
    paddingBottom: 10,
    position: "relative",
    zIndex: 5
  } }, /* @__PURE__ */ React.createElement("div", { style: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 16px"
  } }, pillIcon(
    /* @__PURE__ */ React.createElement("svg", { width: "12", height: "20", viewBox: "0 0 12 20", fill: "none", style: { marginInlineStart: -1 } }, /* @__PURE__ */ React.createElement("path", { d: "M10 2L2 10l8 8", stroke: muted, strokeWidth: "2.5", strokeLinecap: "round", strokeLinejoin: "round" }))
  ), trailingIcon && pillIcon(
    /* @__PURE__ */ React.createElement("svg", { width: "22", height: "6", viewBox: "0 0 22 6" }, /* @__PURE__ */ React.createElement("circle", { cx: "3", cy: "3", r: "2.5", fill: muted }), /* @__PURE__ */ React.createElement("circle", { cx: "11", cy: "3", r: "2.5", fill: muted }), /* @__PURE__ */ React.createElement("circle", { cx: "19", cy: "3", r: "2.5", fill: muted }))
  )), /* @__PURE__ */ React.createElement("div", { style: {
    padding: "0 16px",
    fontFamily: "-apple-system, system-ui",
    fontSize: 34,
    fontWeight: 700,
    lineHeight: "41px",
    color: text,
    letterSpacing: 0.4
  } }, title));
}
function IOSListRow({ title, detail, icon, chevron = true, isLast = false, dark = false }) {
  const text = dark ? "#fff" : "#000";
  const sec = dark ? "rgba(235,235,245,0.6)" : "rgba(60,60,67,0.6)";
  const ter = dark ? "rgba(235,235,245,0.3)" : "rgba(60,60,67,0.3)";
  const sep = dark ? "rgba(84,84,88,0.65)" : "rgba(60,60,67,0.12)";
  return /* @__PURE__ */ React.createElement("div", { style: {
    display: "flex",
    alignItems: "center",
    minHeight: 52,
    padding: "0 16px",
    position: "relative",
    fontFamily: "-apple-system, system-ui",
    fontSize: 17,
    letterSpacing: -0.43
  } }, icon && /* @__PURE__ */ React.createElement("div", { style: {
    width: 30,
    height: 30,
    borderRadius: 7,
    background: icon,
    marginInlineEnd: 12,
    flexShrink: 0
  } }), /* @__PURE__ */ React.createElement("div", { style: { flex: 1, color: text } }, title), detail && /* @__PURE__ */ React.createElement("span", { style: { color: sec, marginInlineEnd: 6 } }, detail), chevron && /* @__PURE__ */ React.createElement("svg", { width: "8", height: "14", viewBox: "0 0 8 14", style: { flexShrink: 0 } }, /* @__PURE__ */ React.createElement("path", { d: "M1 1l6 6-6 6", stroke: ter, strokeWidth: "2", fill: "none", strokeLinecap: "round", strokeLinejoin: "round" })), !isLast && /* @__PURE__ */ React.createElement("div", { style: {
    position: "absolute",
    bottom: 0,
    right: 0,
    left: icon ? 58 : 16,
    height: 0.5,
    background: sep
  } }));
}
function IOSList({ header, children, dark = false }) {
  const hc = dark ? "rgba(235,235,245,0.6)" : "rgba(60,60,67,0.6)";
  const bg = dark ? "#1C1C1E" : "#fff";
  return /* @__PURE__ */ React.createElement("div", null, header && /* @__PURE__ */ React.createElement("div", { style: {
    fontFamily: "-apple-system, system-ui",
    fontSize: 13,
    color: hc,
    textTransform: "uppercase",
    padding: "8px 36px 6px",
    letterSpacing: -0.08
  } }, header), /* @__PURE__ */ React.createElement("div", { style: {
    background: bg,
    borderRadius: 26,
    margin: "0 16px",
    overflow: "hidden"
  } }, children));
}
function IOSDevice({
  children,
  width = 402,
  height = 874,
  dark = false,
  title,
  keyboard = false
}) {
  return /* @__PURE__ */ React.createElement("div", { style: {
    width,
    height,
    borderRadius: 48,
    overflow: "hidden",
    position: "relative",
    background: dark ? "#000" : "#F2F2F7",
    boxShadow: "0 40px 80px rgba(0,0,0,0.18), 0 0 0 1px rgba(0,0,0,0.12)",
    fontFamily: "-apple-system, system-ui, sans-serif",
    WebkitFontSmoothing: "antialiased"
  } }, /* @__PURE__ */ React.createElement("div", { style: {
    position: "absolute",
    top: 11,
    left: "50%",
    transform: "translateX(-50%)",
    width: 126,
    height: 37,
    borderRadius: 24,
    background: "#000",
    zIndex: 50
  } }), /* @__PURE__ */ React.createElement("div", { style: { position: "absolute", top: 0, left: 0, right: 0, zIndex: 10 } }, /* @__PURE__ */ React.createElement(IOSStatusBar, { dark })), /* @__PURE__ */ React.createElement("div", { style: { height: "100%", display: "flex", flexDirection: "column" } }, title !== void 0 && /* @__PURE__ */ React.createElement(IOSNavBar, { title, dark }), /* @__PURE__ */ React.createElement("div", { style: { flex: 1, overflow: "auto" } }, children), keyboard && /* @__PURE__ */ React.createElement(IOSKeyboard, { dark })), /* @__PURE__ */ React.createElement("div", { style: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 60,
    height: 34,
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-end",
    paddingBottom: 8,
    pointerEvents: "none"
  } }, /* @__PURE__ */ React.createElement("div", { style: {
    width: 139,
    height: 5,
    borderRadius: 100,
    background: dark ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.25)"
  } })));
}
function IOSKeyboard({ dark = false }) {
  const glyph = dark ? "rgba(255,255,255,0.7)" : "#595959";
  const sugg = dark ? "rgba(255,255,255,0.6)" : "#333";
  const keyBg = dark ? "rgba(255,255,255,0.22)" : "rgba(255,255,255,0.85)";
  const icons = {
    shift: /* @__PURE__ */ React.createElement("svg", { width: "19", height: "17", viewBox: "0 0 19 17" }, /* @__PURE__ */ React.createElement("path", { d: "M9.5 1L1 9.5h4.5V16h8V9.5H18L9.5 1z", fill: glyph })),
    del: /* @__PURE__ */ React.createElement("svg", { width: "23", height: "17", viewBox: "0 0 23 17" }, /* @__PURE__ */ React.createElement("path", { d: "M7 1h13a2 2 0 012 2v11a2 2 0 01-2 2H7l-6-7.5L7 1z", fill: "none", stroke: glyph, strokeWidth: "1.6", strokeLinejoin: "round" }), /* @__PURE__ */ React.createElement("path", { d: "M10 5l7 7M17 5l-7 7", stroke: glyph, strokeWidth: "1.6", strokeLinecap: "round" })),
    ret: /* @__PURE__ */ React.createElement("svg", { width: "20", height: "14", viewBox: "0 0 20 14" }, /* @__PURE__ */ React.createElement("path", { d: "M18 1v6H4m0 0l4-4M4 7l4 4", fill: "none", stroke: "#fff", strokeWidth: "1.8", strokeLinecap: "round", strokeLinejoin: "round" }))
  };
  const key = (content, { w, flex, ret, fs = 25, k } = {}) => /* @__PURE__ */ React.createElement("div", { key: k, style: {
    height: 42,
    borderRadius: 8.5,
    flex: flex ? 1 : void 0,
    width: w,
    minWidth: 0,
    background: ret ? "#08f" : keyBg,
    boxShadow: "0 1px 0 rgba(0,0,0,0.075)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: '-apple-system, "SF Compact", system-ui',
    fontSize: fs,
    fontWeight: 458,
    color: ret ? "#fff" : glyph
  } }, content);
  const row = (keys, pad = 0) => /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 6.5, justifyContent: "center", padding: `0 ${pad}px` } }, keys.map((l) => key(l, { flex: true, k: l })));
  return /* @__PURE__ */ React.createElement("div", { style: {
    position: "relative",
    zIndex: 15,
    borderRadius: 27,
    overflow: "hidden",
    padding: "11px 0 2px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    boxShadow: dark ? "0 -2px 20px rgba(0,0,0,0.09)" : "0 -1px 6px rgba(0,0,0,0.018), 0 -3px 20px rgba(0,0,0,0.012)"
  } }, /* @__PURE__ */ React.createElement("div", { style: {
    position: "absolute",
    inset: 0,
    borderRadius: 27,
    backdropFilter: "blur(12px) saturate(180%)",
    WebkitBackdropFilter: "blur(12px) saturate(180%)",
    background: dark ? "rgba(120,120,128,0.14)" : "rgba(255,255,255,0.25)"
  } }), /* @__PURE__ */ React.createElement("div", { style: {
    position: "absolute",
    inset: 0,
    borderRadius: 27,
    boxShadow: dark ? "inset 1.5px 1.5px 1px rgba(255,255,255,0.15)" : "inset 1.5px 1.5px 1px rgba(255,255,255,0.7), inset -1px -1px 1px rgba(255,255,255,0.4)",
    border: dark ? "0.5px solid rgba(255,255,255,0.15)" : "0.5px solid rgba(0,0,0,0.06)",
    pointerEvents: "none"
  } }), /* @__PURE__ */ React.createElement("div", { style: {
    display: "flex",
    gap: 20,
    alignItems: "center",
    padding: "8px 22px 13px",
    width: "100%",
    boxSizing: "border-box",
    position: "relative"
  } }, ['"The"', "the", "to"].map((w, i) => /* @__PURE__ */ React.createElement(React.Fragment, { key: i }, i > 0 && /* @__PURE__ */ React.createElement("div", { style: { width: 1, height: 25, background: "#ccc", opacity: 0.3 } }), /* @__PURE__ */ React.createElement("div", { style: {
    flex: 1,
    textAlign: "center",
    fontFamily: "-apple-system, system-ui",
    fontSize: 17,
    color: sugg,
    letterSpacing: -0.43,
    lineHeight: "22px"
  } }, w)))), /* @__PURE__ */ React.createElement("div", { style: {
    display: "flex",
    flexDirection: "column",
    gap: 13,
    padding: "0 6.5px",
    width: "100%",
    boxSizing: "border-box",
    position: "relative"
  } }, row(["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"]), row(["a", "s", "d", "f", "g", "h", "j", "k", "l"], 20), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 14.25, alignItems: "center" } }, key(icons.shift, { w: 45, k: "shift" }), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 6.5, flex: 1 } }, ["z", "x", "c", "v", "b", "n", "m"].map((l) => key(l, { flex: true, k: l }))), key(icons.del, { w: 45, k: "del" })), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 6, alignItems: "center" } }, key("ABC", { w: 92.25, fs: 18, k: "abc" }), key("", { flex: true, k: "space" }), key(icons.ret, { w: 92.25, ret: true, k: "ret" }))), /* @__PURE__ */ React.createElement("div", { style: { height: 56, width: "100%", position: "relative" } }));
}
Object.assign(window, {
  IOSDevice,
  IOSStatusBar,
  IOSNavBar,
  IOSGlassPill,
  IOSList,
  IOSListRow,
  IOSKeyboard
});
const __TWEAKS_STYLE = `
  .twk-panel{position:fixed;right:16px;bottom:16px;z-index:2147483646;width:280px;
    max-height:calc(100vh - 32px);display:flex;flex-direction:column;
    transform:scale(var(--dc-inv-zoom,1));transform-origin:bottom right;
    background:rgba(250,249,247,.78);color:#29261b;
    -webkit-backdrop-filter:blur(24px) saturate(160%);backdrop-filter:blur(24px) saturate(160%);
    border:.5px solid rgba(255,255,255,.6);border-radius:14px;
    box-shadow:0 1px 0 rgba(255,255,255,.5) inset,0 12px 40px rgba(0,0,0,.18);
    font:11.5px/1.4 ui-sans-serif,system-ui,-apple-system,sans-serif;overflow:hidden}
  .twk-hd{display:flex;align-items:center;justify-content:space-between;
    padding:10px 8px 10px 14px;cursor:move;user-select:none}
  .twk-hd b{font-size:12px;font-weight:600;letter-spacing:.01em}
  .twk-x{appearance:none;border:0;background:transparent;color:rgba(41,38,27,.55);
    width:22px;height:22px;border-radius:6px;cursor:default;font-size:13px;line-height:1}
  .twk-x:hover{background:rgba(0,0,0,.06);color:#29261b}
  .twk-body{padding:2px 14px 14px;display:flex;flex-direction:column;gap:10px;
    overflow-y:auto;overflow-x:hidden;min-height:0;
    scrollbar-width:thin;scrollbar-color:rgba(0,0,0,.15) transparent}
  .twk-body::-webkit-scrollbar{width:8px}
  .twk-body::-webkit-scrollbar-track{background:transparent;margin:2px}
  .twk-body::-webkit-scrollbar-thumb{background:rgba(0,0,0,.15);border-radius:4px;
    border:2px solid transparent;background-clip:content-box}
  .twk-body::-webkit-scrollbar-thumb:hover{background:rgba(0,0,0,.25);
    border:2px solid transparent;background-clip:content-box}
  .twk-row{display:flex;flex-direction:column;gap:5px}
  .twk-row-h{flex-direction:row;align-items:center;justify-content:space-between;gap:10px}
  .twk-lbl{display:flex;justify-content:space-between;align-items:baseline;
    color:rgba(41,38,27,.72)}
  .twk-lbl>span:first-child{font-weight:500}
  .twk-val{color:rgba(41,38,27,.5);font-variant-numeric:tabular-nums}

  .twk-sect{font-size:10px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;
    color:rgba(41,38,27,.45);padding:10px 0 0}
  .twk-sect:first-child{padding-top:0}

  .twk-field{appearance:none;box-sizing:border-box;width:100%;min-width:0;height:26px;padding:0 8px;
    border:.5px solid rgba(0,0,0,.1);border-radius:7px;
    background:rgba(255,255,255,.6);color:inherit;font:inherit;outline:none}
  .twk-field:focus{border-color:rgba(0,0,0,.25);background:rgba(255,255,255,.85)}
  select.twk-field{padding-right:22px;
    background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'><path fill='rgba(0,0,0,.5)' d='M0 0h10L5 6z'/></svg>");
    background-repeat:no-repeat;background-position:right 8px center}

  .twk-slider{appearance:none;-webkit-appearance:none;width:100%;height:4px;margin:6px 0;
    border-radius:999px;background:rgba(0,0,0,.12);outline:none}
  .twk-slider::-webkit-slider-thumb{-webkit-appearance:none;appearance:none;
    width:14px;height:14px;border-radius:50%;background:#fff;
    border:.5px solid rgba(0,0,0,.12);box-shadow:0 1px 3px rgba(0,0,0,.2);cursor:default}
  .twk-slider::-moz-range-thumb{width:14px;height:14px;border-radius:50%;
    background:#fff;border:.5px solid rgba(0,0,0,.12);box-shadow:0 1px 3px rgba(0,0,0,.2);cursor:default}

  .twk-seg{position:relative;display:flex;padding:2px;border-radius:8px;
    background:rgba(0,0,0,.06);user-select:none}
  .twk-seg-thumb{position:absolute;top:2px;bottom:2px;border-radius:6px;
    background:rgba(255,255,255,.9);box-shadow:0 1px 2px rgba(0,0,0,.12);
    transition:left .15s cubic-bezier(.3,.7,.4,1),width .15s}
  .twk-seg.dragging .twk-seg-thumb{transition:none}
  .twk-seg button{appearance:none;position:relative;z-index:1;flex:1;border:0;
    background:transparent;color:inherit;font:inherit;font-weight:500;min-height:22px;
    border-radius:6px;cursor:default;padding:4px 6px;line-height:1.2;
    overflow-wrap:anywhere}

  .twk-toggle{position:relative;width:32px;height:18px;border:0;border-radius:999px;
    background:rgba(0,0,0,.15);transition:background .15s;cursor:default;padding:0}
  .twk-toggle[data-on="1"]{background:#34c759}
  .twk-toggle i{position:absolute;top:2px;left:2px;width:14px;height:14px;border-radius:50%;
    background:#fff;box-shadow:0 1px 2px rgba(0,0,0,.25);transition:transform .15s}
  .twk-toggle[data-on="1"] i{transform:translateX(14px)}

  .twk-num{display:flex;align-items:center;box-sizing:border-box;min-width:0;height:26px;padding:0 0 0 8px;
    border:.5px solid rgba(0,0,0,.1);border-radius:7px;background:rgba(255,255,255,.6)}
  .twk-num-lbl{font-weight:500;color:rgba(41,38,27,.6);cursor:ew-resize;
    user-select:none;padding-right:8px}
  .twk-num input{flex:1;min-width:0;height:100%;border:0;background:transparent;
    font:inherit;font-variant-numeric:tabular-nums;text-align:right;padding:0 8px 0 0;
    outline:none;color:inherit;-moz-appearance:textfield}
  .twk-num input::-webkit-inner-spin-button,.twk-num input::-webkit-outer-spin-button{
    -webkit-appearance:none;margin:0}
  .twk-num-unit{padding-right:8px;color:rgba(41,38,27,.45)}

  .twk-btn{appearance:none;height:26px;padding:0 12px;border:0;border-radius:7px;
    background:rgba(0,0,0,.78);color:#fff;font:inherit;font-weight:500;cursor:default}
  .twk-btn:hover{background:rgba(0,0,0,.88)}
  .twk-btn.secondary{background:rgba(0,0,0,.06);color:inherit}
  .twk-btn.secondary:hover{background:rgba(0,0,0,.1)}

  .twk-swatch{appearance:none;-webkit-appearance:none;width:56px;height:22px;
    border:.5px solid rgba(0,0,0,.1);border-radius:6px;padding:0;cursor:default;
    background:transparent;flex-shrink:0}
  .twk-swatch::-webkit-color-swatch-wrapper{padding:0}
  .twk-swatch::-webkit-color-swatch{border:0;border-radius:5.5px}
  .twk-swatch::-moz-color-swatch{border:0;border-radius:5.5px}

  .twk-chips{display:flex;gap:6px}
  .twk-chip{position:relative;appearance:none;flex:1;min-width:0;height:46px;
    padding:0;border:0;border-radius:6px;overflow:hidden;cursor:default;
    box-shadow:0 0 0 .5px rgba(0,0,0,.12),0 1px 2px rgba(0,0,0,.06);
    transition:transform .12s cubic-bezier(.3,.7,.4,1),box-shadow .12s}
  .twk-chip:hover{transform:translateY(-1px);
    box-shadow:0 0 0 .5px rgba(0,0,0,.18),0 4px 10px rgba(0,0,0,.12)}
  .twk-chip[data-on="1"]{box-shadow:0 0 0 1.5px rgba(0,0,0,.85),
    0 2px 6px rgba(0,0,0,.15)}
  .twk-chip>span{position:absolute;top:0;bottom:0;right:0;width:34%;
    display:flex;flex-direction:column;box-shadow:-1px 0 0 rgba(0,0,0,.1)}
  .twk-chip>span>i{flex:1;box-shadow:0 -1px 0 rgba(0,0,0,.1)}
  .twk-chip>span>i:first-child{box-shadow:none}
  .twk-chip svg{position:absolute;top:6px;left:6px;width:13px;height:13px;
    filter:drop-shadow(0 1px 1px rgba(0,0,0,.3))}
`;
const _LS_KEY = "voyage:tweaks";
function _loadFromLS(defaults) {
  try {
    const raw = localStorage.getItem(_LS_KEY);
    if (!raw) return defaults;
    return { ...defaults, ...JSON.parse(raw) };
  } catch (_) {
    return defaults;
  }
}
function _saveToLS(values) {
  try {
    localStorage.setItem(_LS_KEY, JSON.stringify(values));
  } catch (_) {
  }
}
function useTweaks(defaults) {
  const [values, setValues] = React.useState(() => _loadFromLS(defaults));
  const setTweak = React.useCallback((keyOrEdits, val) => {
    const edits = typeof keyOrEdits === "object" && keyOrEdits !== null ? keyOrEdits : { [keyOrEdits]: val };
    setValues((prev) => {
      const next = { ...prev, ...edits };
      _saveToLS(next);
      return next;
    });
    window.parent.postMessage({ type: "__edit_mode_set_keys", edits }, "*");
    window.dispatchEvent(new CustomEvent("tweakchange", { detail: edits }));
  }, []);
  return [values, setTweak];
}
function TweaksPanel({ title = "Tweaks", noDeckControls = false, children }) {
  const [open, setOpen] = React.useState(false);
  const dragRef = React.useRef(null);
  const hasDeckStage = React.useMemo(
    () => typeof document !== "undefined" && !!document.querySelector("deck-stage"),
    []
  );
  const [railEnabled, setRailEnabled] = React.useState(
    () => {
      var _a;
      return hasDeckStage && !!((_a = document.querySelector("deck-stage")) == null ? void 0 : _a._railEnabled);
    }
  );
  React.useEffect(() => {
    if (!hasDeckStage || railEnabled) return void 0;
    const onMsg = (e) => {
      if (e.data && e.data.type === "__omelette_rail_enabled") setRailEnabled(true);
    };
    window.addEventListener("message", onMsg);
    return () => window.removeEventListener("message", onMsg);
  }, [hasDeckStage, railEnabled]);
  const [railVisible, setRailVisible] = React.useState(() => {
    try {
      return localStorage.getItem("deck-stage.railVisible") !== "0";
    } catch (e) {
      return true;
    }
  });
  const toggleRail = (on) => {
    setRailVisible(on);
    window.postMessage({ type: "__deck_rail_visible", on }, "*");
  };
  const offsetRef = React.useRef({ x: 16, y: 16 });
  const PAD = 16;
  const clampToViewport = React.useCallback(() => {
    const panel = dragRef.current;
    if (!panel) return;
    const w = panel.offsetWidth, h = panel.offsetHeight;
    const maxRight = Math.max(PAD, window.innerWidth - w - PAD);
    const maxBottom = Math.max(PAD, window.innerHeight - h - PAD);
    offsetRef.current = {
      x: Math.min(maxRight, Math.max(PAD, offsetRef.current.x)),
      y: Math.min(maxBottom, Math.max(PAD, offsetRef.current.y))
    };
    panel.style.right = offsetRef.current.x + "px";
    panel.style.bottom = offsetRef.current.y + "px";
  }, []);
  React.useEffect(() => {
    if (!open) return;
    clampToViewport();
    if (typeof ResizeObserver === "undefined") {
      window.addEventListener("resize", clampToViewport);
      return () => window.removeEventListener("resize", clampToViewport);
    }
    const ro = new ResizeObserver(clampToViewport);
    ro.observe(document.documentElement);
    return () => ro.disconnect();
  }, [open, clampToViewport]);
  React.useEffect(() => {
    const onMsg = (e) => {
      var _a;
      const t2 = (_a = e == null ? void 0 : e.data) == null ? void 0 : _a.type;
      if (t2 === "__activate_edit_mode") setOpen(true);
      else if (t2 === "__deactivate_edit_mode") setOpen(false);
    };
    window.addEventListener("message", onMsg);
    window.parent.postMessage({ type: "__edit_mode_available" }, "*");
    return () => window.removeEventListener("message", onMsg);
  }, []);
  const dismiss = () => {
    setOpen(false);
    window.parent.postMessage({ type: "__edit_mode_dismissed" }, "*");
  };
  const onDragStart = (e) => {
    const panel = dragRef.current;
    if (!panel) return;
    const r = panel.getBoundingClientRect();
    const sx = e.clientX, sy = e.clientY;
    const startRight = window.innerWidth - r.right;
    const startBottom = window.innerHeight - r.bottom;
    const move = (ev) => {
      offsetRef.current = {
        x: startRight - (ev.clientX - sx),
        y: startBottom - (ev.clientY - sy)
      };
      clampToViewport();
    };
    const up = () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", up);
    };
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
  };
  if (!open) return null;
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("style", null, __TWEAKS_STYLE), /* @__PURE__ */ React.createElement(
    "div",
    {
      ref: dragRef,
      className: "twk-panel",
      "data-noncommentable": "",
      style: { right: offsetRef.current.x, bottom: offsetRef.current.y }
    },
    /* @__PURE__ */ React.createElement("div", { className: "twk-hd", onMouseDown: onDragStart }, /* @__PURE__ */ React.createElement("b", null, title), /* @__PURE__ */ React.createElement(
      "button",
      {
        className: "twk-x",
        "aria-label": "Close tweaks",
        onMouseDown: (e) => e.stopPropagation(),
        onClick: dismiss
      },
      "✕"
    )),
    /* @__PURE__ */ React.createElement("div", { className: "twk-body" }, children, hasDeckStage && railEnabled && !noDeckControls && /* @__PURE__ */ React.createElement(TweakSection, { label: "Deck" }, /* @__PURE__ */ React.createElement(TweakToggle, { label: "Thumbnail rail", value: railVisible, onChange: toggleRail })))
  ));
}
function TweakSection({ label, children }) {
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { className: "twk-sect" }, label), children);
}
function TweakRow({ label, value, children, inline = false }) {
  return /* @__PURE__ */ React.createElement("div", { className: inline ? "twk-row twk-row-h" : "twk-row" }, /* @__PURE__ */ React.createElement("div", { className: "twk-lbl" }, /* @__PURE__ */ React.createElement("span", null, label), value != null && /* @__PURE__ */ React.createElement("span", { className: "twk-val" }, value)), children);
}
function TweakSlider({ label, value, min = 0, max = 100, step = 1, unit = "", onChange }) {
  return /* @__PURE__ */ React.createElement(TweakRow, { label, value: `${value}${unit}` }, /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "range",
      className: "twk-slider",
      min,
      max,
      step,
      value,
      onChange: (e) => onChange(Number(e.target.value))
    }
  ));
}
function TweakToggle({ label, value, onChange }) {
  return /* @__PURE__ */ React.createElement("div", { className: "twk-row twk-row-h" }, /* @__PURE__ */ React.createElement("div", { className: "twk-lbl" }, /* @__PURE__ */ React.createElement("span", null, label)), /* @__PURE__ */ React.createElement(
    "button",
    {
      type: "button",
      className: "twk-toggle",
      "data-on": value ? "1" : "0",
      role: "switch",
      "aria-checked": !!value,
      onClick: () => onChange(!value)
    },
    /* @__PURE__ */ React.createElement("i", null)
  ));
}
function TweakRadio({ label, value, options, onChange }) {
  var _a;
  const trackRef = React.useRef(null);
  const [dragging, setDragging] = React.useState(false);
  const valueRef = React.useRef(value);
  valueRef.current = value;
  const labelLen = (o) => String(typeof o === "object" ? o.label : o).length;
  const maxLen = options.reduce((m, o) => Math.max(m, labelLen(o)), 0);
  const fitsAsSegments = maxLen <= ((_a = { 2: 16, 3: 10 }[options.length]) != null ? _a : 0);
  if (!fitsAsSegments) {
    const resolve = (s) => {
      const m = options.find((o) => String(typeof o === "object" ? o.value : o) === s);
      return m === void 0 ? s : typeof m === "object" ? m.value : m;
    };
    return /* @__PURE__ */ React.createElement(
      TweakSelect,
      {
        label,
        value,
        options,
        onChange: (s) => onChange(resolve(s))
      }
    );
  }
  const opts = options.map((o) => typeof o === "object" ? o : { value: o, label: o });
  const idx = Math.max(0, opts.findIndex((o) => o.value === value));
  const n = opts.length;
  const segAt = (clientX) => {
    const r = trackRef.current.getBoundingClientRect();
    const inner = r.width - 4;
    const i = Math.floor((clientX - r.left - 2) / inner * n);
    return opts[Math.max(0, Math.min(n - 1, i))].value;
  };
  const onPointerDown = (e) => {
    setDragging(true);
    const v0 = segAt(e.clientX);
    if (v0 !== valueRef.current) onChange(v0);
    const move = (ev) => {
      if (!trackRef.current) return;
      const v = segAt(ev.clientX);
      if (v !== valueRef.current) onChange(v);
    };
    const up = () => {
      setDragging(false);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  };
  return /* @__PURE__ */ React.createElement(TweakRow, { label }, /* @__PURE__ */ React.createElement(
    "div",
    {
      ref: trackRef,
      role: "radiogroup",
      onPointerDown,
      className: dragging ? "twk-seg dragging" : "twk-seg"
    },
    /* @__PURE__ */ React.createElement(
      "div",
      {
        className: "twk-seg-thumb",
        style: {
          left: `calc(2px + ${idx} * (100% - 4px) / ${n})`,
          width: `calc((100% - 4px) / ${n})`
        }
      }
    ),
    opts.map((o) => /* @__PURE__ */ React.createElement("button", { key: o.value, type: "button", role: "radio", "aria-checked": o.value === value }, o.label))
  ));
}
function TweakSelect({ label, value, options, onChange }) {
  return /* @__PURE__ */ React.createElement(TweakRow, { label }, /* @__PURE__ */ React.createElement("select", { className: "twk-field", value, onChange: (e) => onChange(e.target.value) }, options.map((o) => {
    const v = typeof o === "object" ? o.value : o;
    const l = typeof o === "object" ? o.label : o;
    return /* @__PURE__ */ React.createElement("option", { key: v, value: v }, l);
  })));
}
function TweakText({ label, value, placeholder, onChange }) {
  return /* @__PURE__ */ React.createElement(TweakRow, { label }, /* @__PURE__ */ React.createElement(
    "input",
    {
      className: "twk-field",
      type: "text",
      value,
      placeholder,
      onChange: (e) => onChange(e.target.value)
    }
  ));
}
function TweakNumber({ label, value, min, max, step = 1, unit = "", onChange }) {
  const clamp = (n) => {
    if (min != null && n < min) return min;
    if (max != null && n > max) return max;
    return n;
  };
  const startRef = React.useRef({ x: 0, val: 0 });
  const onScrubStart = (e) => {
    e.preventDefault();
    startRef.current = { x: e.clientX, val: value };
    const decimals = (String(step).split(".")[1] || "").length;
    const move = (ev) => {
      const dx = ev.clientX - startRef.current.x;
      const raw = startRef.current.val + dx * step;
      const snapped = Math.round(raw / step) * step;
      onChange(clamp(Number(snapped.toFixed(decimals))));
    };
    const up = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  };
  return /* @__PURE__ */ React.createElement("div", { className: "twk-num" }, /* @__PURE__ */ React.createElement("span", { className: "twk-num-lbl", onPointerDown: onScrubStart }, label), /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "number",
      value,
      min,
      max,
      step,
      onChange: (e) => onChange(clamp(Number(e.target.value)))
    }
  ), unit && /* @__PURE__ */ React.createElement("span", { className: "twk-num-unit" }, unit));
}
function __twkIsLight(hex) {
  const h = String(hex).replace("#", "");
  const x = h.length === 3 ? h.replace(/./g, (c) => c + c) : h.padEnd(6, "0");
  const n = parseInt(x.slice(0, 6), 16);
  if (Number.isNaN(n)) return true;
  const r = n >> 16 & 255, g = n >> 8 & 255, b = n & 255;
  return r * 299 + g * 587 + b * 114 > 148e3;
}
const __TwkCheck = ({ light }) => /* @__PURE__ */ React.createElement("svg", { viewBox: "0 0 14 14", "aria-hidden": "true" }, /* @__PURE__ */ React.createElement(
  "path",
  {
    d: "M3 7.2 5.8 10 11 4.2",
    fill: "none",
    strokeWidth: "2.2",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    stroke: light ? "rgba(0,0,0,.78)" : "#fff"
  }
));
function TweakColor({ label, value, options, onChange }) {
  if (!options || !options.length) {
    return /* @__PURE__ */ React.createElement("div", { className: "twk-row twk-row-h" }, /* @__PURE__ */ React.createElement("div", { className: "twk-lbl" }, /* @__PURE__ */ React.createElement("span", null, label)), /* @__PURE__ */ React.createElement(
      "input",
      {
        type: "color",
        className: "twk-swatch",
        value,
        onChange: (e) => onChange(e.target.value)
      }
    ));
  }
  const key = (o) => String(JSON.stringify(o)).toLowerCase();
  const cur = key(value);
  return /* @__PURE__ */ React.createElement(TweakRow, { label }, /* @__PURE__ */ React.createElement("div", { className: "twk-chips", role: "radiogroup" }, options.map((o, i) => {
    const colors = Array.isArray(o) ? o : [o];
    const [hero, ...rest] = colors;
    const sup = rest.slice(0, 4);
    const on = key(o) === cur;
    return /* @__PURE__ */ React.createElement(
      "button",
      {
        key: i,
        type: "button",
        className: "twk-chip",
        role: "radio",
        "aria-checked": on,
        "data-on": on ? "1" : "0",
        "aria-label": colors.join(", "),
        title: colors.join(" · "),
        style: { background: hero },
        onClick: () => onChange(o)
      },
      sup.length > 0 && /* @__PURE__ */ React.createElement("span", null, sup.map((c, j) => /* @__PURE__ */ React.createElement("i", { key: j, style: { background: c } }))),
      on && /* @__PURE__ */ React.createElement(__TwkCheck, { light: __twkIsLight(hero) })
    );
  })));
}
function TweakButton({ label, onClick, secondary = false }) {
  return /* @__PURE__ */ React.createElement(
    "button",
    {
      type: "button",
      className: secondary ? "twk-btn secondary" : "twk-btn",
      onClick
    },
    label
  );
}
Object.assign(window, {
  useTweaks,
  TweaksPanel,
  TweakSection,
  TweakRow,
  TweakSlider,
  TweakToggle,
  TweakRadio,
  TweakSelect,
  TweakText,
  TweakNumber,
  TweakColor,
  TweakButton
});
const TRIP = {
  id: "kyoto-26",
  title: "Kyoto · Hanami",
  subtitle: "Cherry blossom run",
  dates: "Apr 03 — Apr 14, 2026",
  daysIn: 6,
  daysTotal: 11,
  homeCurrency: "USD",
  localCurrency: "JPY",
  fx: 152.4,
  // 1 USD = 152.4 JPY
  budget: { plannedUSD: 4200, spentUSD: 2864.32 },
  cover: "kyoto",
  weather: { temp: 18, cond: "Light rain" },
  next: { label: "Tea ceremony · Camellia", when: "Tomorrow 14:00" }
};
const MEMBERS = [
  { id: "u1", name: "Sample User", role: "Admin", hue: 35, initials: "SU" },
  { id: "u2", name: "Theo R.", role: "Editor", hue: 200, initials: "TR" },
  { id: "u3", name: "Naomi S.", role: "Editor", hue: 155, initials: "NS" },
  { id: "u4", name: "Jules P.", role: "Viewer", hue: 280, initials: "JP" }
];
const CATEGORIES = [
  { key: "lodging", label: "Lodging", color: "var(--clay)", pct: 38, amt: 1088.4 },
  { key: "food", label: "Food", color: "var(--honey)", pct: 22, amt: 630.15 },
  { key: "transit", label: "Transit", color: "var(--moss)", pct: 18, amt: 515.58 },
  { key: "culture", label: "Culture", color: "var(--indigo)", pct: 14, amt: 401 },
  { key: "misc", label: "Misc", color: "var(--ink-mute)", pct: 8, amt: 229.19 }
];
const EXPENSES = [
  { id: "e1", who: "u1", cat: "lodging", title: "Ryokan Tawaraya — 2 nights", jpy: 78400, usd: 514.5, when: "Today 09:12", note: "tatami suite, breakfast" },
  { id: "e2", who: "u2", cat: "food", title: "Omakase · Gion Sasaki", jpy: 41200, usd: 270.4, when: "Today 08:01", note: "4 ppl" },
  { id: "e3", who: "u3", cat: "transit", title: "JR Pass — 7 day", jpy: 5e4, usd: 328.1, when: "Yesterday", note: "group rate" },
  { id: "e4", who: "u1", cat: "culture", title: "Fushimi Inari guide", jpy: 12e3, usd: 78.74, when: "Yesterday", note: "" },
  { id: "e5", who: "u2", cat: "food", title: "Nishiki Market lunch", jpy: 6480, usd: 42.52, when: "Apr 04", note: "" },
  { id: "e6", who: "u4", cat: "misc", title: "SIM card · 5GB", jpy: 3200, usd: 21, when: "Apr 04", note: "" },
  { id: "e7", who: "u3", cat: "culture", title: "Kinkaku-ji entry × 4", jpy: 1600, usd: 10.5, when: "Apr 04", note: "" }
];
const DOCS = [
  { id: "d1", kind: "pdf", title: "KLM 8721 · Boarding", sub: "Apr 03 · 11:40", size: "2.1 MB", tint: "clay" },
  { id: "d2", kind: "img", title: "Visa stamp · JP", sub: "scanned · 4032×3024", size: "4.6 MB", tint: "moss" },
  { id: "d3", kind: "pdf", title: "Ryokan reservation", sub: "Tawaraya · #88241", size: "180 KB", tint: "honey" },
  { id: "d4", kind: "pdf", title: "Travel insurance", sub: "Allianz · policy", size: "3.2 MB", tint: "indigo" },
  { id: "d5", kind: "img", title: "Passport copy", sub: "all members", size: "8.1 MB", tint: "clay" },
  { id: "d6", kind: "pdf", title: "JR Pass voucher", sub: "exchange in Kyoto", size: "420 KB", tint: "moss" }
];
const AUDIT = [
  { id: "a1", who: "u1", action: "added", target: "Ryokan Tawaraya — 2 nights", when: "09:12" },
  { id: "a2", who: "u2", action: "edited", target: "Omakase · Gion Sasaki", when: "08:04" },
  { id: "a3", who: "u3", action: "uploaded", target: "JR Pass voucher.pdf", when: "Yesterday" },
  { id: "a4", who: "u1", action: "invited", target: "jules@p.co", when: "Apr 02" }
];
const TRIPS = [
  { id: "kyoto-26", title: "Kyoto", sub: "Hanami run", dates: "Apr 03 — 14", country: "JP", shared: true, members: 4, cover: "kyoto", budgetPct: 68, status: "active" },
  { id: "lisbon-25", title: "Lisbon", sub: "Solo retreat", dates: "Sep 12 — 22", country: "PT", shared: false, members: 1, cover: "lisbon", budgetPct: 92, status: "past" },
  { id: "oaxaca-25", title: "Oaxaca", sub: "Mezcal trail", dates: "Nov 01 — 09", country: "MX", shared: true, members: 3, cover: "oaxaca", budgetPct: 76, status: "past" },
  { id: "lofoten-26", title: "Lofoten", sub: "Northern lights", dates: "Dec 28 — Jan 04", country: "NO", shared: false, members: 1, cover: "lofoten", budgetPct: 12, status: "upcoming" },
  { id: "patagon-26", title: "Patagonia", sub: "Glacier hike", dates: "Feb 04 — 18", country: "AR", shared: true, members: 5, cover: "patagon", budgetPct: 24, status: "upcoming" }
];
const GLOBAL = {
  countries: 14,
  continents: 4,
  days: 187,
  lifetimeUSD: 28412,
  longestTrip: { name: "Patagonia", days: 22 },
  topCategory: { name: "Lodging", usd: 11240, pct: 39 },
  byContinent: [
    { name: "Europe", days: 78, color: "var(--indigo)" },
    { name: "Asia", days: 54, color: "var(--clay)" },
    { name: "South America", days: 32, color: "var(--moss)" },
    { name: "North America", days: 23, color: "var(--honey)" }
  ],
  yearly: [
    { y: 2020, days: 12, usd: 1800 },
    { y: 2021, days: 18, usd: 2400 },
    { y: 2022, days: 34, usd: 5100 },
    { y: 2023, days: 41, usd: 6200 },
    { y: 2024, days: 38, usd: 7400 },
    { y: 2025, days: 44, usd: 5512 }
  ]
};
const DOC_CATEGORIES = [
  { key: "flights", label: "Flights", tint: "indigo", icon: "plane", count: 4 },
  { key: "lodging", label: "Accommodation", tint: "clay", icon: "bed", count: 3 },
  { key: "visas", label: "Visas & Official", tint: "moss", icon: "stamp", count: 5 },
  { key: "transport", label: "Rentals", tint: "honey", icon: "rail", count: 3 }
];
const DOCS_BY_CAT = {
  flights: [
    { id: "f1", kind: "pdf", title: "KLM 8721 · AMS → KIX", sub: "Apr 03 · 11:40", size: "2.1 MB", tint: "indigo", link: "https://checkin.klm.com", linkLabel: "Online check-in", photos: [] },
    { id: "f2", kind: "pdf", title: "KLM 8722 · KIX → AMS", sub: "Apr 14 · 19:25", size: "2.0 MB", tint: "indigo", link: "https://checkin.klm.com", linkLabel: "Online check-in", photos: [] },
    { id: "f3", kind: "pdf", title: "Seat selection", sub: "window 18A", size: "410 KB", tint: "indigo", link: null, photos: [] },
    { id: "f4", kind: "img", title: "Frequent flyer · KLM", sub: "Elite Plus", size: "1.4 MB", tint: "indigo", link: "https://klm.com/frequentflyer", linkLabel: "Flying Blue portal", photos: [] }
  ],
  lodging: [
    { id: "l1", kind: "pdf", title: "Ryokan Tawaraya · 2 nights", sub: "Confirmation #88241", size: "180 KB", tint: "clay", link: "https://maps.google.com/?q=Tawaraya+Kyoto+Japan", linkLabel: "Google Maps", photos: ["photo"] },
    { id: "l2", kind: "pdf", title: "Park Hyatt Kyoto · 5 nights", sub: "Confirmation #A7-44", size: "320 KB", tint: "clay", link: "https://maps.google.com/?q=Park+Hyatt+Kyoto", linkLabel: "Google Maps", photos: ["photo"] },
    { id: "l3", kind: "img", title: "Airbnb check-in note", sub: "Kawabata-dōri", size: "780 KB", tint: "clay", link: null, photos: ["photo"] }
  ],
  visas: [
    { id: "v1", kind: "img", title: "Japan visa stamp", sub: "4032×3024", size: "4.6 MB", tint: "moss", link: "https://www.mofa.go.jp/j_info/visit/visa/", linkLabel: "MOFA visa info", photos: ["photo"] },
    { id: "v2", kind: "pdf", title: "Travel insurance · Allianz", sub: "policy A-44291", size: "3.2 MB", tint: "moss", link: "https://allianz-assistance.com", linkLabel: "Allianz portal", photos: [] },
    { id: "v3", kind: "img", title: "Passport copy · all crew", sub: "4 members", size: "8.1 MB", tint: "moss", link: null, photos: ["photo"] },
    { id: "v4", kind: "pdf", title: "Vaccination record", sub: "WHO carte jaune", size: "480 KB", tint: "moss", link: null, photos: [] },
    { id: "v5", kind: "pdf", title: "Emergency contacts", sub: "embassy + family", size: "90 KB", tint: "moss", link: "https://jp.usembassy.gov", linkLabel: "Embassy website", photos: [] }
  ],
  transport: [
    { id: "t1", kind: "pdf", title: "JR Pass voucher", sub: "exchange in Kyoto", size: "420 KB", tint: "honey", link: "https://www.jrpass.com", linkLabel: "JR Pass site", photos: [] },
    { id: "t2", kind: "pdf", title: "Shinkansen · Kyoto → Tokyo", sub: "reserved · car 9", size: "210 KB", tint: "honey", link: "https://maps.google.com/?q=Kyoto+Station", linkLabel: "Kyoto Station map", photos: [] },
    { id: "t3", kind: "img", title: "IC card · Suica top-up", sub: "¥10,000 loaded", size: "220 KB", tint: "honey", link: null, photos: ["photo"] }
  ]
};
const TRIP_ANALYTICS = {
  dailyAvgUSD: 477.4,
  dailyPlanUSD: 382,
  topDay: { date: "Apr 04", usd: 612 },
  contribs: [
    { id: "u1", usd: 1142, pct: 40 },
    { id: "u2", usd: 802, pct: 28 },
    { id: "u3", usd: 632, pct: 22 },
    { id: "u4", usd: 288, pct: 10 }
  ],
  spendByDay: [120, 410, 612, 280, 540, 902.32]
};
Object.assign(window, {
  TRIP,
  MEMBERS,
  CATEGORIES,
  EXPENSES,
  DOCS,
  AUDIT,
  TRIPS,
  GLOBAL,
  DOC_CATEGORIES,
  DOCS_BY_CAT,
  TRIP_ANALYTICS
});
const Ico = ({ d, size = 22, stroke = "currentColor", sw = 1.6, fill = "none" }) => /* @__PURE__ */ React.createElement(
  "svg",
  {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill,
    stroke,
    strokeWidth: sw,
    strokeLinecap: "round",
    strokeLinejoin: "round"
  },
  d
);
const IconHome = (p) => /* @__PURE__ */ React.createElement(Ico, { ...p, d: /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("path", { d: "M3 11l9-7 9 7" }), /* @__PURE__ */ React.createElement("path", { d: "M5 10v10h14V10" })) });
const IconWallet = (p) => /* @__PURE__ */ React.createElement(Ico, { ...p, d: /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("rect", { x: "3", y: "6", width: "18", height: "13", rx: "3" }), /* @__PURE__ */ React.createElement("path", { d: "M16 12.5h3" }), /* @__PURE__ */ React.createElement("path", { d: "M3 9h14a2 2 0 012 2" })) });
const IconDoc = (p) => /* @__PURE__ */ React.createElement(Ico, { ...p, d: /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("path", { d: "M7 3h7l4 4v14H7z" }), /* @__PURE__ */ React.createElement("path", { d: "M14 3v4h4" })) });
const IconUsers = (p) => /* @__PURE__ */ React.createElement(Ico, { ...p, d: /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("circle", { cx: "9", cy: "8", r: "3.2" }), /* @__PURE__ */ React.createElement("path", { d: "M3.5 19c.6-3 3-4.6 5.5-4.6S14 16 14.5 19" }), /* @__PURE__ */ React.createElement("circle", { cx: "17", cy: "9", r: "2.5" }), /* @__PURE__ */ React.createElement("path", { d: "M15.5 14.5c2 .1 3.7 1.5 4.5 4" })) });
const IconGear = (p) => /* @__PURE__ */ React.createElement(Ico, { ...p, d: /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("circle", { cx: "12", cy: "12", r: "3" }), /* @__PURE__ */ React.createElement("path", { d: "M19.4 12a7.4 7.4 0 00-.1-1.4l2-1.5-2-3.4-2.4.9a7.5 7.5 0 00-2.5-1.4L14 3h-4l-.4 2.2a7.5 7.5 0 00-2.5 1.4L4.7 5.7l-2 3.4 2 1.5a7.4 7.4 0 000 2.8l-2 1.5 2 3.4 2.4-.9a7.5 7.5 0 002.5 1.4L10 21h4l.4-2.2a7.5 7.5 0 002.5-1.4l2.4.9 2-3.4-2-1.5c.1-.5.1-.9.1-1.4z" })) });
const IconPlus = (p) => /* @__PURE__ */ React.createElement(Ico, { ...p, sw: 2, d: /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("path", { d: "M12 5v14M5 12h14" })) });
const IconBack = (p) => /* @__PURE__ */ React.createElement(Ico, { ...p, d: /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("path", { d: "M15 5l-7 7 7 7" })) });
const IconChevron = (p) => /* @__PURE__ */ React.createElement(Ico, { ...p, d: /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("path", { d: "M9 6l6 6-6 6" })) });
const IconMore = (p) => /* @__PURE__ */ React.createElement(Ico, { ...p, d: /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("circle", { cx: "5", cy: "12", r: "1.2", fill: "currentColor" }), /* @__PURE__ */ React.createElement("circle", { cx: "12", cy: "12", r: "1.2", fill: "currentColor" }), /* @__PURE__ */ React.createElement("circle", { cx: "19", cy: "12", r: "1.2", fill: "currentColor" })) });
const IconShare = (p) => /* @__PURE__ */ React.createElement(Ico, { ...p, d: /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("path", { d: "M12 4v12" }), /* @__PURE__ */ React.createElement("path", { d: "M8 8l4-4 4 4" }), /* @__PURE__ */ React.createElement("path", { d: "M5 14v4a2 2 0 002 2h10a2 2 0 002-2v-4" })) });
const IconQR = (p) => /* @__PURE__ */ React.createElement(Ico, { ...p, d: /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("rect", { x: "3", y: "3", width: "7", height: "7", rx: "1" }), /* @__PURE__ */ React.createElement("rect", { x: "14", y: "3", width: "7", height: "7", rx: "1" }), /* @__PURE__ */ React.createElement("rect", { x: "3", y: "14", width: "7", height: "7", rx: "1" }), /* @__PURE__ */ React.createElement("path", { d: "M14 14h3v3M21 14v3M14 18v3h3M21 21h-1" })) });
const IconPin = (p) => /* @__PURE__ */ React.createElement(Ico, { ...p, d: /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("path", { d: "M12 21s7-7.5 7-13a7 7 0 10-14 0c0 5.5 7 13 7 13z" }), /* @__PURE__ */ React.createElement("circle", { cx: "12", cy: "8", r: "2.5" })) });
const IconClock = (p) => /* @__PURE__ */ React.createElement(Ico, { ...p, d: /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("circle", { cx: "12", cy: "12", r: "9" }), /* @__PURE__ */ React.createElement("path", { d: "M12 7v5l3 2" })) });
const IconCloud = (p) => /* @__PURE__ */ React.createElement(Ico, { ...p, d: /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("path", { d: "M7 17h10a4 4 0 100-8 6 6 0 00-11.6 1.5A3.5 3.5 0 007 17z" })) });
const IconUpload = (p) => /* @__PURE__ */ React.createElement(Ico, { ...p, d: /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("path", { d: "M12 16V4" }), /* @__PURE__ */ React.createElement("path", { d: "M7 9l5-5 5 5" }), /* @__PURE__ */ React.createElement("path", { d: "M4 18v2h16v-2" })) });
const IconImg = (p) => /* @__PURE__ */ React.createElement(Ico, { ...p, d: /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("rect", { x: "3", y: "4", width: "18", height: "16", rx: "2" }), /* @__PURE__ */ React.createElement("circle", { cx: "9", cy: "10", r: "1.8" }), /* @__PURE__ */ React.createElement("path", { d: "M4 18l5-5 4 4 3-3 4 4" })) });
const IconPdf = (p) => /* @__PURE__ */ React.createElement(Ico, { ...p, d: /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("path", { d: "M7 3h8l4 4v14H7z" }), /* @__PURE__ */ React.createElement("path", { d: "M14 3v4h4" }), /* @__PURE__ */ React.createElement("path", { d: "M10 12v6" }), /* @__PURE__ */ React.createElement("path", { d: "M10 12h2a1.5 1.5 0 010 3h-2" })) });
const IconSearch = (p) => /* @__PURE__ */ React.createElement(Ico, { ...p, d: /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("circle", { cx: "11", cy: "11", r: "6.5" }), /* @__PURE__ */ React.createElement("path", { d: "M20 20l-4-4" })) });
const IconFilter = (p) => /* @__PURE__ */ React.createElement(Ico, { ...p, d: /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("path", { d: "M3 5h18" }), /* @__PURE__ */ React.createElement("path", { d: "M6 12h12" }), /* @__PURE__ */ React.createElement("path", { d: "M10 19h4" })) });
const IconSwap = (p) => /* @__PURE__ */ React.createElement(Ico, { ...p, d: /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("path", { d: "M4 7h13l-3-3" }), /* @__PURE__ */ React.createElement("path", { d: "M20 17H7l3 3" })) });
const IconEdit = (p) => /* @__PURE__ */ React.createElement(Ico, { ...p, d: /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("path", { d: "M5 19l3-.6L19 7.4 16.6 5 5.6 16zM14.5 7l2.5 2.5" })) });
const IconTrash = (p) => /* @__PURE__ */ React.createElement(Ico, { ...p, d: /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("path", { d: "M5 7h14" }), /* @__PURE__ */ React.createElement("path", { d: "M9 7V4h6v3" }), /* @__PURE__ */ React.createElement("path", { d: "M7 7l1 13h8l1-13" })) });
const IconCheck = (p) => /* @__PURE__ */ React.createElement(Ico, { ...p, sw: 2, d: /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("path", { d: "M5 12l4 4 10-10" })) });
const IconLink = (p) => /* @__PURE__ */ React.createElement(Ico, { ...p, d: /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("path", { d: "M10 14a4 4 0 005.6 0l3-3a4 4 0 10-5.6-5.6l-1 1" }), /* @__PURE__ */ React.createElement("path", { d: "M14 10a4 4 0 00-5.6 0l-3 3a4 4 0 005.6 5.6l1-1" })) });
const IconBell = (p) => /* @__PURE__ */ React.createElement(Ico, { ...p, d: /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("path", { d: "M6 17h12l-1.5-2V11a4.5 4.5 0 10-9 0v4z" }), /* @__PURE__ */ React.createElement("path", { d: "M10 20a2 2 0 004 0" })) });
const IconArchive = (p) => /* @__PURE__ */ React.createElement(Ico, { ...p, d: /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("rect", { x: "3", y: "5", width: "18", height: "4", rx: "1" }), /* @__PURE__ */ React.createElement("path", { d: "M5 9v11h14V9" }), /* @__PURE__ */ React.createElement("path", { d: "M10 13h4" })) });
const IconSun = (p) => /* @__PURE__ */ React.createElement(Ico, { ...p, d: /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("circle", { cx: "12", cy: "12", r: "3.5" }), /* @__PURE__ */ React.createElement("path", { d: "M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M5.6 18.4l1.4-1.4M17 7l1.4-1.4" })) });
const IconCompass = (p) => /* @__PURE__ */ React.createElement(Ico, { ...p, d: /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("circle", { cx: "12", cy: "12", r: "9" }), /* @__PURE__ */ React.createElement("path", { d: "M9 15l1.5-4.5L15 9l-1.5 4.5z", fill: "currentColor" })) });
const IconSparkle = (p) => /* @__PURE__ */ React.createElement(Ico, { ...p, d: /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("path", { d: "M12 4l1.5 4.5L18 10l-4.5 1.5L12 16l-1.5-4.5L6 10l4.5-1.5z" })) });
const IconCamera = (p) => /* @__PURE__ */ React.createElement(Ico, { ...p, d: /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("path", { d: "M4 8h3l1.5-2h7L17 8h3a1 1 0 011 1v9a1 1 0 01-1 1H4a1 1 0 01-1-1V9a1 1 0 011-1z" }), /* @__PURE__ */ React.createElement("circle", { cx: "12", cy: "13", r: "3.5" })) });
const IconClose = (p) => /* @__PURE__ */ React.createElement(Ico, { ...p, sw: 2, d: /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("path", { d: "M6 6l12 12M18 6L6 18" })) });
const IconLock = (p) => /* @__PURE__ */ React.createElement(Ico, { ...p, d: /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("rect", { x: "5", y: "11", width: "14", height: "9", rx: "2" }), /* @__PURE__ */ React.createElement("path", { d: "M8 11V8a4 4 0 018 0v3" })) });
Object.assign(window, {
  IconHome,
  IconWallet,
  IconDoc,
  IconUsers,
  IconGear,
  IconPlus,
  IconBack,
  IconChevron,
  IconMore,
  IconShare,
  IconQR,
  IconPin,
  IconClock,
  IconCloud,
  IconUpload,
  IconImg,
  IconPdf,
  IconSearch,
  IconFilter,
  IconSwap,
  IconEdit,
  IconTrash,
  IconCheck,
  IconLink,
  IconBell,
  IconArchive,
  IconSun,
  IconCompass,
  IconSparkle,
  IconCamera,
  IconClose,
  IconLock
});
const Avatar = ({ m, size = 28, ring = false, off = 0, marginRight = 0 }) => /* @__PURE__ */ React.createElement("div", { style: {
  width: size,
  height: size,
  borderRadius: "50%",
  background: `linear-gradient(140deg, oklch(0.78 0.09 ${m.hue}) 0%, oklch(0.55 0.12 ${m.hue}) 100%)`,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#fff",
  fontFamily: "var(--sans)",
  fontWeight: 600,
  fontSize: size * 0.38,
  letterSpacing: "-0.02em",
  boxShadow: ring ? "0 0 0 2.5px var(--cream), 0 4px 10px rgba(0,0,0,0.18)" : "0 2px 4px rgba(0,0,0,0.15)",
  marginInlineStart: off,
  marginInlineEnd: marginRight,
  flexShrink: 0
} }, m.initials);
const AvatarStack = ({ members, size = 26 }) => /* @__PURE__ */ React.createElement("div", { style: { display: "inline-flex", flexDirection: "row" } }, members.map((m, i) => /* @__PURE__ */ React.createElement(
  Avatar,
  {
    key: m.id,
    m,
    size,
    ring: true,
    off: window.isRTL ? 0 : i === 0 ? 0 : -size * 0.35,
    marginRight: window.isRTL && i > 0 ? -(size * 0.35) : 0
  }
)));
const RoleBadge = ({ role }) => {
  const map = {
    Admin: { bg: "oklch(0.62 0.13 35 / 0.14)", fg: "var(--clay-deep)", dot: "var(--clay)" },
    Editor: { bg: "oklch(0.50 0.08 155 / 0.14)", fg: "oklch(0.34 0.07 155)", dot: "var(--moss)" },
    Viewer: { bg: "oklch(0.42 0.10 260 / 0.12)", fg: "oklch(0.30 0.08 260)", dot: "var(--indigo)" }
  };
  const s = map[role] || map.Viewer;
  return /* @__PURE__ */ React.createElement("span", { style: {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    flexDirection: "row",
    padding: "4px 9px 4px 7px",
    borderRadius: 999,
    background: s.bg,
    color: s.fg,
    fontSize: 11,
    fontWeight: 600,
    letterSpacing: "-0.005em"
  } }, /* @__PURE__ */ React.createElement("span", { style: { width: 6, height: 6, borderRadius: 999, background: s.dot } }), role);
};
const Chip = ({ children, active = false, onClick, tone = "default" }) => {
  const styles = {
    default: { bg: active ? "var(--ink)" : "rgba(255,255,255,0.6)", fg: active ? "var(--cream)" : "var(--ink-soft)" },
    glass: { bg: active ? "var(--ink)" : "rgba(255,255,255,0.55)", fg: active ? "var(--cream)" : "var(--ink)" }
  }[tone];
  return /* @__PURE__ */ React.createElement("button", { onClick, style: {
    padding: "7px 13px",
    borderRadius: 999,
    background: styles.bg,
    color: styles.fg,
    fontSize: 12.5,
    fontWeight: 500,
    border: "0.5px solid " + (active ? "transparent" : "var(--hairline)"),
    backdropFilter: "blur(8px)",
    transition: "all 180ms",
    whiteSpace: "nowrap"
  } }, children);
};
const SectionLabel = ({ children, action, onAction }) => {
  const text = typeof children === "string" ? children.charAt(0).toUpperCase() + children.slice(1).toLowerCase() : children;
  return /* @__PURE__ */ React.createElement("div", { style: {
    display: "flex",
    alignItems: "baseline",
    justifyContent: "space-between",
    flexDirection: "row",
    padding: "0 22px",
    marginBottom: 10
  } }, /* @__PURE__ */ React.createElement("div", { style: {
    fontSize: 13,
    fontWeight: 600,
    color: "var(--ink)",
    letterSpacing: "-0.01em"
  } }, text), action && /* @__PURE__ */ React.createElement("button", { onClick: onAction, style: {
    fontSize: 12.5,
    color: "var(--clay-deep)",
    fontWeight: 500,
    background: "none",
    border: 0
  } }, action));
};
const KyotoHero = ({ tilt = -2 }) => /* @__PURE__ */ React.createElement("div", { style: {
  position: "relative",
  width: "100%",
  height: "100%",
  borderRadius: "inherit",
  overflow: "hidden",
  background: "linear-gradient(170deg, oklch(0.78 0.06 30) 0%, oklch(0.66 0.08 25) 45%, oklch(0.42 0.07 285) 100%)"
} }, /* @__PURE__ */ React.createElement("div", { style: {
  position: "absolute",
  top: 26,
  right: 32,
  width: 76,
  height: 76,
  borderRadius: "50%",
  background: "radial-gradient(circle, oklch(0.94 0.08 75) 0%, oklch(0.82 0.12 50) 60%, transparent 100%)",
  filter: "blur(0.5px)"
} }), /* @__PURE__ */ React.createElement("svg", { viewBox: "0 0 400 260", preserveAspectRatio: "none", style: { position: "absolute", inset: 0, width: "100%", height: "100%" } }, /* @__PURE__ */ React.createElement(
  "polygon",
  {
    points: "0,200 90,110 160,150 230,90 320,160 400,130 400,260 0,260",
    fill: "oklch(0.36 0.06 285 / 0.55)"
  }
), /* @__PURE__ */ React.createElement(
  "polygon",
  {
    points: "0,230 60,180 140,210 220,160 300,200 400,180 400,260 0,260",
    fill: "oklch(0.26 0.05 280 / 0.78)"
  }
)), /* @__PURE__ */ React.createElement("svg", { viewBox: "0 0 400 260", preserveAspectRatio: "none", style: { position: "absolute", inset: 0, width: "100%", height: "100%" } }, /* @__PURE__ */ React.createElement(
  "path",
  {
    d: "M-10 80 C 80 50, 160 70, 230 40 S 380 30, 420 10",
    stroke: "oklch(0.25 0.03 30)",
    strokeWidth: "2.5",
    fill: "none",
    strokeLinecap: "round"
  }
), /* @__PURE__ */ React.createElement("path", { d: "M 60 70 Q 90 30, 130 50", stroke: "oklch(0.25 0.03 30)", strokeWidth: "1.6", fill: "none", strokeLinecap: "round" }), /* @__PURE__ */ React.createElement("path", { d: "M 250 35 Q 280 8, 320 25", stroke: "oklch(0.25 0.03 30)", strokeWidth: "1.6", fill: "none", strokeLinecap: "round" })), [
  [40, 72, 9],
  [70, 60, 11],
  [98, 45, 8],
  [120, 60, 10],
  [165, 55, 9],
  [200, 38, 7],
  [228, 42, 11],
  [262, 26, 9],
  [300, 18, 10],
  [340, 28, 8],
  [55, 90, 6],
  [180, 70, 7],
  [380, 38, 9],
  [240, 60, 6]
].map(([x, y, r], i) => /* @__PURE__ */ React.createElement("div", { key: i, style: {
  position: "absolute",
  left: x,
  top: y,
  width: r * 2,
  height: r * 2,
  borderRadius: "50%",
  background: "radial-gradient(circle, oklch(0.96 0.05 25) 0%, oklch(0.84 0.10 20) 70%, oklch(0.74 0.13 18) 100%)",
  boxShadow: "0 1px 2px rgba(60,30,30,0.2)"
} })), /* @__PURE__ */ React.createElement("div", { style: {
  position: "absolute",
  inset: 0,
  background: "radial-gradient(120% 70% at 50% 100%, transparent 50%, rgba(20,10,20,0.45) 100%)"
} }), /* @__PURE__ */ React.createElement("div", { style: {
  position: "absolute",
  inset: 0,
  opacity: 0.06,
  mixBlendMode: "overlay",
  backgroundImage: 'url("data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22120%22 height=%22120%22><filter id=%22n%22><feTurbulence baseFrequency=%221.2%22/></filter><rect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23n)%22/></svg>")'
} }));
const TintCard = ({ tint = "clay", children }) => {
  const grads = {
    clay: ["oklch(0.85 0.07 40)", "oklch(0.62 0.13 35)"],
    moss: ["oklch(0.82 0.05 155)", "oklch(0.50 0.08 155)"],
    indigo: ["oklch(0.78 0.06 260)", "oklch(0.42 0.10 260)"],
    honey: ["oklch(0.88 0.08 80)", "oklch(0.68 0.13 70)"]
  };
  const [a, b] = grads[tint] || grads.clay;
  return /* @__PURE__ */ React.createElement("div", { style: {
    position: "relative",
    width: "100%",
    height: "100%",
    background: `linear-gradient(155deg, ${a} 0%, ${b} 100%)`,
    borderRadius: "inherit",
    overflow: "hidden"
  } }, /* @__PURE__ */ React.createElement("div", { style: {
    position: "absolute",
    inset: 0,
    background: "radial-gradient(80% 60% at 20% 10%, rgba(255,255,255,0.45) 0%, transparent 60%)"
  } }), children);
};
const Sheet = ({ open, onClose, children, title, height = 0.7 }) => {
  if (!open) return null;
  return /* @__PURE__ */ React.createElement("div", { style: {
    position: "absolute",
    inset: 0,
    zIndex: 100,
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end"
  } }, /* @__PURE__ */ React.createElement("div", { onClick: onClose, style: {
    position: "absolute",
    inset: 0,
    background: "rgba(20,15,10,0.4)",
    backdropFilter: "blur(6px)",
    animation: "fadeIn 200ms"
  } }), /* @__PURE__ */ React.createElement("div", { style: {
    position: "relative",
    height: `${height * 100}%`,
    background: "var(--cream)",
    borderRadius: "24px 24px 0 0",
    boxShadow: "0 -20px 60px rgba(0,0,0,0.35)",
    animation: "slideUp 320ms cubic-bezier(.32,.72,0,1)",
    // iOS spring curve
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    paddingBottom: "env(safe-area-inset-bottom)"
  } }, /* @__PURE__ */ React.createElement("div", { style: { padding: "8px 0 4px", display: "flex", justifyContent: "center", flexShrink: 0 } }, /* @__PURE__ */ React.createElement("div", { style: {
    width: 36,
    height: 5,
    borderRadius: 999,
    background: "var(--ink-mute)",
    opacity: 0.4
  } })), title && /* @__PURE__ */ React.createElement("div", { style: {
    padding: "8px 22px 4px",
    fontFamily: "var(--serif)",
    fontSize: 22,
    letterSpacing: "-0.01em",
    color: "var(--ink)",
    textAlign: "center",
    flexShrink: 0
  } }, title), /* @__PURE__ */ React.createElement("div", { style: { flex: 1, overflow: "auto", WebkitOverflowScrolling: "touch" }, className: "no-scrollbar" }, children)), /* @__PURE__ */ React.createElement("style", null, `
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes slideUp { from { transform: translateY(100%) } to { transform: translateY(0) } }
      `));
};
function SwipeRow({ children, actions, onAction }) {
  if (!actions || actions.length === 0) return children;
  const rtl = !!window.isRTL;
  const dir = rtl ? 1 : -1;
  const max = 150 * dir;
  const openAt = 130 * dir;
  const threshold = 60;
  const [dx, setDx] = React.useState(0);
  const [open, setOpen] = React.useState(false);
  const startX = React.useRef(0);
  const startedAt = React.useRef(0);
  const onStart = (e) => {
    const x = e.touches ? e.touches[0].clientX : e.clientX;
    startX.current = x - dx;
    startedAt.current = Date.now();
  };
  const onMove = (e) => {
    if (!startX.current) return;
    const x = e.touches ? e.touches[0].clientX : e.clientX;
    const raw = x - startX.current;
    const next = rtl ? Math.max(0, Math.min(max, raw)) : Math.min(0, Math.max(max, raw));
    setDx(next);
  };
  const onEnd = () => {
    if (Math.abs(dx) > threshold) {
      setDx(openAt);
      setOpen(true);
    } else {
      setDx(0);
      setOpen(false);
    }
    startX.current = 0;
  };
  return /* @__PURE__ */ React.createElement("div", { className: "swipe-row" }, /* @__PURE__ */ React.createElement("div", { className: "swipe-actions" }, actions.map((a, i) => /* @__PURE__ */ React.createElement("button", { key: i, onClick: () => {
    onAction == null ? void 0 : onAction(a.key);
    setDx(0);
    setOpen(false);
  }, style: {
    width: 58,
    height: 58,
    borderRadius: 16,
    background: a.bg,
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 4px 12px rgba(0,0,0,0.18)"
  } }, a.icon))), /* @__PURE__ */ React.createElement(
    "div",
    {
      onMouseDown: onStart,
      onMouseMove: (e) => startX.current && onMove(e),
      onMouseUp: onEnd,
      onMouseLeave: onEnd,
      onTouchStart: onStart,
      onTouchMove: onMove,
      onTouchEnd: onEnd,
      style: {
        transform: `translateX(${dx}px)`,
        transition: startX.current ? "none" : "transform 280ms cubic-bezier(.2,.8,.2,1)",
        willChange: "transform"
      }
    },
    children
  ));
}
function Skeleton({ w = "100%", h = 14, r = 8, style }) {
  return /* @__PURE__ */ React.createElement("div", { style: {
    width: w,
    height: h,
    borderRadius: r,
    background: "linear-gradient(90deg, var(--sand) 0%, var(--sand-deep) 50%, var(--sand) 100%)",
    backgroundSize: "200% 100%",
    animation: "sk-shimmer 1.4s ease-in-out infinite",
    ...style
  } });
}
const _skStyle = document.createElement("style");
_skStyle.textContent = "@keyframes sk-shimmer { 0% { background-position: 200% 0 } 100% { background-position: -200% 0 } }";
document.head.appendChild(_skStyle);
function TripSkeleton() {
  return /* @__PURE__ */ React.createElement("div", { style: { padding: "60px 14px 100px" } }, /* @__PURE__ */ React.createElement(Skeleton, { h: 170, r: 26, style: { marginBottom: 14 } }), /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginBottom: 18 } }, [0, 1, 2].map((i) => /* @__PURE__ */ React.createElement(Skeleton, { key: i, h: 70, r: 16 }))), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 8 } }, [0, 1, 2, 3].map((i) => /* @__PURE__ */ React.createElement(Skeleton, { key: i, h: 56, r: 18 }))));
}
window._toastSubs = window._toastSubs || /* @__PURE__ */ new Set();
window._toastSeq = 0;
window.toast = function(msg, type = "info", durationMs = 3200) {
  if (!msg) return;
  const id = ++window._toastSeq;
  const item = { id, msg: String(msg), type, at: Date.now(), durationMs };
  window._toastSubs.forEach((fn) => fn(item));
  return id;
};
function ToastHost() {
  const [items, setItems] = React.useState([]);
  React.useEffect(() => {
    const handler = (item) => {
      setItems((prev) => [...prev, item]);
      setTimeout(() => {
        setItems((prev) => prev.filter((x) => x.id !== item.id));
      }, item.durationMs);
    };
    window._toastSubs.add(handler);
    return () => {
      window._toastSubs.delete(handler);
    };
  }, []);
  if (items.length === 0) return null;
  return /* @__PURE__ */ React.createElement("div", { style: {
    position: "fixed",
    zIndex: 9999,
    top: "calc(env(safe-area-inset-top) + 14px)",
    left: 14,
    right: 14,
    display: "flex",
    flexDirection: "column",
    gap: 8,
    pointerEvents: "none"
  } }, items.map((t2) => {
    const colors = {
      success: { bg: "var(--moss)", fg: "#fff", icon: "✓" },
      error: { bg: "var(--clay-deep)", fg: "#fff", icon: "⚠" },
      info: { bg: "var(--statement)", fg: "var(--statement-fg)", icon: "i" }
    }[t2.type] || { bg: "var(--statement)", fg: "var(--statement-fg)", icon: "i" };
    return /* @__PURE__ */ React.createElement("div", { key: t2.id, style: {
      padding: "11px 14px",
      borderRadius: 14,
      background: colors.bg,
      color: colors.fg,
      display: "flex",
      alignItems: "center",
      gap: 10,
      flexDirection: "row",
      boxShadow: "0 12px 28px rgba(0,0,0,0.22)",
      pointerEvents: "auto",
      fontSize: 13,
      fontWeight: 500,
      animation: "toast-in 220ms cubic-bezier(.2,.8,.2,1)"
    } }, /* @__PURE__ */ React.createElement("div", { style: {
      width: 22,
      height: 22,
      borderRadius: 999,
      flexShrink: 0,
      background: "rgba(255,255,255,0.18)",
      display: "grid",
      placeItems: "center",
      fontSize: 13,
      fontWeight: 700
    } }, colors.icon), /* @__PURE__ */ React.createElement("div", { style: { flex: 1, minWidth: 0, textAlign: "start" } }, t2.msg));
  }), /* @__PURE__ */ React.createElement("style", null, `@keyframes toast-in { from { transform: translateY(-12px); opacity: 0 } to { transform: translateY(0); opacity: 1 } }`));
}
window.ToastHost = ToastHost;
function LargeTitleHeader({ title, subtitle, action, onBack }) {
  const [scrolled, setScrolled] = React.useState(false);
  const sentinelRef = React.useRef(null);
  React.useEffect(() => {
    if (!sentinelRef.current) return;
    const obs = new IntersectionObserver(
      ([entry]) => setScrolled(!entry.isIntersecting),
      { threshold: 0, rootMargin: "-44px 0px 0px 0px" }
    );
    obs.observe(sentinelRef.current);
    return () => obs.disconnect();
  }, []);
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { style: {
    position: "sticky",
    top: 0,
    zIndex: 30,
    paddingTop: "max(54px, calc(env(safe-area-inset-top) + 10px))",
    paddingBottom: 8,
    paddingInlineStart: onBack ? 12 : 22,
    paddingInlineEnd: 22,
    background: scrolled ? "rgba(245, 238, 216, 0.85)" : "transparent",
    backdropFilter: scrolled ? "blur(20px) saturate(180%)" : "none",
    WebkitBackdropFilter: scrolled ? "blur(20px) saturate(180%)" : "none",
    borderBottom: scrolled ? "0.5px solid var(--hairline)" : "0.5px solid transparent",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
    transition: "background 200ms, border-color 200ms, backdrop-filter 200ms"
  } }, onBack ? /* @__PURE__ */ React.createElement("button", { onClick: onBack, "aria-label": "Back", style: {
    width: 36,
    height: 36,
    borderRadius: 999,
    background: scrolled ? "rgba(0,0,0,0)" : "var(--cream-2)",
    border: scrolled ? "0.5px solid transparent" : "0.5px solid var(--hairline)",
    display: "grid",
    placeItems: "center",
    flexShrink: 0,
    transition: "background 200ms, border-color 200ms"
  } }, /* @__PURE__ */ React.createElement("span", { className: "icon-flip" }, /* @__PURE__ */ React.createElement(IconBack, { size: 17, stroke: "var(--ink)" }))) : /* @__PURE__ */ React.createElement("span", { style: { width: 36, height: 36, flexShrink: 0 } }), /* @__PURE__ */ React.createElement("div", { style: {
    flex: 1,
    minWidth: 0,
    textAlign: "center",
    fontFamily: "var(--sans)",
    fontSize: 16,
    fontWeight: 600,
    color: "var(--ink)",
    opacity: scrolled ? 1 : 0,
    transform: scrolled ? "translateY(0)" : "translateY(4px)",
    transition: "opacity 200ms, transform 200ms",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap"
  } }, title), /* @__PURE__ */ React.createElement("div", { style: { width: 36, minWidth: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "flex-end" } }, action || null)), /* @__PURE__ */ React.createElement("div", { style: { padding: "4px 22px 8px" } }, /* @__PURE__ */ React.createElement("div", { style: {
    fontFamily: "var(--sans)",
    fontWeight: 700,
    fontSize: 34,
    lineHeight: 1.1,
    color: "var(--ink)",
    letterSpacing: "-0.02em"
  } }, title), subtitle && /* @__PURE__ */ React.createElement("div", { style: {
    fontSize: 13,
    color: "var(--ink-mute)",
    marginTop: 4,
    lineHeight: 1.4
  } }, subtitle)), /* @__PURE__ */ React.createElement("div", { ref: sentinelRef, style: { height: 1, marginTop: 2 }, "aria-hidden": "true" }));
}
window.__actionSheetSubs = window.__actionSheetSubs || /* @__PURE__ */ new Set();
window.__actionSheetSeq = window.__actionSheetSeq || 0;
window.actionSheet = function(config) {
  window.__actionSheetSeq += 1;
  const item = Object.assign({ id: window.__actionSheetSeq }, config);
  window.__actionSheetSubs.forEach((fn) => fn(item));
};
function ActionSheetHost() {
  const [item, setItem] = React.useState(null);
  React.useEffect(() => {
    const handler = (it) => setItem(it);
    window.__actionSheetSubs.add(handler);
    return () => {
      window.__actionSheetSubs.delete(handler);
    };
  }, []);
  if (!item) return null;
  const close = () => setItem(null);
  return /* @__PURE__ */ React.createElement("div", { style: {
    position: "fixed",
    inset: 0,
    zIndex: 9999,
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
    pointerEvents: "auto"
  } }, /* @__PURE__ */ React.createElement("div", { onClick: close, style: {
    position: "absolute",
    inset: 0,
    background: "rgba(0,0,0,0.32)",
    animation: "as-fade 220ms ease-out forwards"
  } }), /* @__PURE__ */ React.createElement("div", { style: {
    position: "relative",
    padding: "10px",
    paddingBottom: "calc(10px + env(safe-area-inset-bottom))",
    animation: "as-up 320ms cubic-bezier(.32,.72,0,1) both"
  } }, /* @__PURE__ */ React.createElement("div", { style: {
    background: "var(--cream-2)",
    borderRadius: 14,
    overflow: "hidden",
    backdropFilter: "blur(28px) saturate(180%)",
    WebkitBackdropFilter: "blur(28px) saturate(180%)"
  } }, (item.title || item.message) && /* @__PURE__ */ React.createElement("div", { style: {
    padding: "14px 16px",
    borderBottom: "0.5px solid var(--hairline-2)",
    textAlign: "center"
  } }, item.title && /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, fontWeight: 600, color: "var(--ink)" } }, item.title), item.message && /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, color: "var(--ink-mute)", marginTop: 4, lineHeight: 1.4 } }, item.message)), (item.actions || []).map((a, i) => /* @__PURE__ */ React.createElement("button", { key: i, onClick: () => {
    var _a;
    close();
    (_a = a.onPress) == null ? void 0 : _a.call(a);
  }, style: {
    width: "100%",
    padding: "15px 16px",
    borderTop: i > 0 ? "0.5px solid var(--hairline-2)" : "none",
    background: "transparent",
    color: a.destructive ? "var(--clay-deep)" : "var(--ink)",
    fontSize: 17,
    fontWeight: a.destructive ? 600 : 400,
    textAlign: "center",
    fontFamily: "var(--sans)"
  } }, a.label))), /* @__PURE__ */ React.createElement("button", { onClick: close, style: {
    width: "100%",
    marginTop: 8,
    padding: "15px 16px",
    borderRadius: 14,
    background: "var(--cream-2)",
    backdropFilter: "blur(28px) saturate(180%)",
    WebkitBackdropFilter: "blur(28px) saturate(180%)",
    color: "var(--ink)",
    fontSize: 17,
    fontWeight: 600,
    fontFamily: "var(--sans)"
  } }, item.cancelLabel || (window.isRTL ? "إلغاء الإجراء" : "Cancel"))), /* @__PURE__ */ React.createElement("style", null, `
        @keyframes as-fade { from { opacity: 0 } to { opacity: 1 } }
        @keyframes as-up   { from { transform: translateY(100%) } to { transform: translateY(0) } }
      `));
}
window.ActionSheetHost = ActionSheetHost;
window.LargeTitleHeader = LargeTitleHeader;
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }
  static getDerivedStateFromError(error) {
    return { error };
  }
  componentDidCatch(error, info) {
    console.error("[ErrorBoundary]", error, info);
  }
  async hardReset() {
    try {
      if ("caches" in window) {
        const names = await caches.keys();
        await Promise.all(names.map((n) => caches.delete(n)));
      }
      if ("serviceWorker" in navigator) {
        const regs = await navigator.serviceWorker.getRegistrations();
        await Promise.all(regs.map((r) => r.unregister()));
      }
      try {
        sessionStorage.clear();
      } catch (_) {
      }
    } catch (_) {
    }
    location.reload();
  }
  render() {
    var _a, _b;
    if (!this.state.error) return this.props.children;
    const rtl = window.isRTL;
    return /* @__PURE__ */ React.createElement("div", { style: {
      position: "fixed",
      inset: 0,
      background: "#f3eed8",
      color: "#221c16",
      display: "grid",
      placeItems: "center",
      textAlign: "center",
      padding: 24,
      fontFamily: "-apple-system, system-ui, sans-serif",
      direction: rtl ? "rtl" : "ltr"
    } }, /* @__PURE__ */ React.createElement("div", { style: { maxWidth: 320 } }, /* @__PURE__ */ React.createElement("div", { style: { fontFamily: "Instrument Serif, Georgia, serif", fontStyle: "italic", fontSize: 36, marginBottom: 24 } }, "voyage"), /* @__PURE__ */ React.createElement("div", { style: {
      width: 64,
      height: 64,
      borderRadius: 20,
      margin: "0 auto 16px",
      background: "#fff",
      border: "1px solid rgba(0,0,0,0.08)",
      display: "grid",
      placeItems: "center",
      fontSize: 28
    } }, "⚠"), /* @__PURE__ */ React.createElement("div", { style: { fontFamily: "Instrument Serif, Georgia, serif", fontSize: 24, marginBottom: 6 } }, rtl ? "حدث خطأ ما" : "Something went wrong"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, color: "#666", marginBottom: 20, lineHeight: 1.5 } }, rtl ? "حاول تحديث الصفحة. إذا استمرت المشكلة، اضغط على إعادة التعيين." : "Try reloading. If the problem persists, tap Reset."), ((_a = this.state.error) == null ? void 0 : _a.message) && /* @__PURE__ */ React.createElement("details", { style: { fontSize: 11, color: "#888", marginBottom: 16, textAlign: "left" } }, /* @__PURE__ */ React.createElement("summary", { style: { cursor: "pointer" } }, rtl ? "التفاصيل التقنية" : "Technical details"), /* @__PURE__ */ React.createElement("pre", { style: { fontFamily: "monospace", whiteSpace: "pre-wrap", wordBreak: "break-word", marginTop: 8 } }, String((_b = this.state.error) == null ? void 0 : _b.message))), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 8, justifyContent: "center" } }, /* @__PURE__ */ React.createElement("button", { onClick: () => location.reload(), style: {
      padding: "12px 20px",
      borderRadius: 14,
      border: 0,
      background: "#221c16",
      color: "#f3eed8",
      fontWeight: 600,
      fontSize: 14,
      cursor: "pointer"
    } }, rtl ? "تحديث" : "Reload"), /* @__PURE__ */ React.createElement("button", { onClick: () => this.hardReset(), style: {
      padding: "12px 20px",
      borderRadius: 14,
      border: "1px solid rgba(0,0,0,0.15)",
      background: "#fff",
      color: "#221c16",
      fontWeight: 600,
      fontSize: 14,
      cursor: "pointer"
    } }, rtl ? "إعادة تعيين" : "Reset app"))));
  }
}
window.ErrorBoundary = ErrorBoundary;
function PullToRefresh({ onRefresh, children }) {
  const [pull, setPull] = React.useState(0);
  const [refreshing, setRefreshing] = React.useState(false);
  const startY = React.useRef(null);
  const scrollerRef = React.useRef(null);
  const THRESHOLD = 70;
  const onTouchStart = (e) => {
    if (!scrollerRef.current || scrollerRef.current.scrollTop > 0) return;
    startY.current = e.touches[0].clientY;
  };
  const onTouchMove = (e) => {
    if (startY.current == null || refreshing) return;
    const dy = e.touches[0].clientY - startY.current;
    if (dy <= 0) return;
    const damped = Math.min(120, Math.pow(dy, 0.85));
    setPull(damped);
  };
  const onTouchEnd = async () => {
    var _a;
    if (startY.current == null) return;
    const triggered = pull >= THRESHOLD;
    startY.current = null;
    if (triggered) {
      setRefreshing(true);
      setPull(THRESHOLD);
      try {
        await (onRefresh == null ? void 0 : onRefresh());
      } catch (e) {
        (_a = window.toast) == null ? void 0 : _a.call(window, e.message || "Refresh failed", "error");
      } finally {
        setRefreshing(false);
        setPull(0);
      }
    } else {
      setPull(0);
    }
  };
  return /* @__PURE__ */ React.createElement("div", { style: { position: "relative", height: "100%", overflow: "hidden" } }, /* @__PURE__ */ React.createElement("div", { className: `ptr-indicator ${pull >= THRESHOLD ? "armed" : ""}`, style: {
    height: pull,
    opacity: pull > 0 ? 1 : 0
  } }, refreshing ? /* @__PURE__ */ React.createElement("div", { className: "ptr-spin" }) : /* @__PURE__ */ React.createElement("span", { style: { fontSize: 12, fontWeight: 500 } }, pull >= THRESHOLD ? window.isRTL ? "حرّر للتحديث" : "Release to refresh" : window.isRTL ? "اسحب للتحديث" : "Pull to refresh")), /* @__PURE__ */ React.createElement(
    "div",
    {
      ref: scrollerRef,
      onTouchStart,
      onTouchMove,
      onTouchEnd,
      style: {
        height: "100%",
        overflow: "auto",
        WebkitOverflowScrolling: "touch",
        transform: `translateY(${pull}px)`,
        transition: startY.current === null ? "transform 220ms cubic-bezier(.32,.72,0,1)" : "none"
      },
      className: "no-scrollbar"
    },
    children
  ));
}
function OfflineBanner() {
  const [online, setOnline] = React.useState(typeof navigator !== "undefined" ? navigator.onLine : true);
  React.useEffect(() => {
    const up = () => setOnline(true);
    const down = () => setOnline(false);
    window.addEventListener("online", up);
    window.addEventListener("offline", down);
    return () => {
      window.removeEventListener("online", up);
      window.removeEventListener("offline", down);
    };
  }, []);
  if (online) return null;
  return /* @__PURE__ */ React.createElement("div", { className: "offline-banner" }, window.isRTL ? "⚠ أنت غير متصل · المصروفات التي تسجّلها تُزامن عند عودة الاتصال" : "⚠ Offline · expenses you log will sync when you reconnect");
}
function ImageCropper({ file, onCancel, onDone, frameSize = 280, outputSize = 800 }) {
  const [src, setSrc] = React.useState(null);
  const [img, setImg] = React.useState(null);
  const [scale, setScale] = React.useState(1);
  const [off, setOff] = React.useState({ x: 0, y: 0 });
  const [busy, setBusy] = React.useState(false);
  React.useEffect(() => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setSrc(url);
    const el = new Image();
    el.onload = () => {
      setImg(el);
      const fit = frameSize / Math.min(el.naturalWidth, el.naturalHeight);
      setScale(fit);
      setOff({ x: 0, y: 0 });
    };
    el.src = url;
    return () => URL.revokeObjectURL(url);
  }, [file, frameSize]);
  const dragRef = React.useRef(null);
  const onStart = (e) => {
    const p = e.touches ? e.touches[0] : e;
    dragRef.current = { x: p.clientX, y: p.clientY, ox: off.x, oy: off.y };
  };
  const onMove = (e) => {
    if (!dragRef.current) return;
    const p = e.touches ? e.touches[0] : e;
    setOff(clampOffset({
      x: dragRef.current.ox + (p.clientX - dragRef.current.x),
      y: dragRef.current.oy + (p.clientY - dragRef.current.y)
    }, img, scale, frameSize));
  };
  const onEnd = () => {
    dragRef.current = null;
  };
  React.useEffect(() => {
    if (!img) return;
    setOff((o) => clampOffset(o, img, scale, frameSize));
  }, [scale, img, frameSize]);
  const minScale = img ? frameSize / Math.min(img.naturalWidth, img.naturalHeight) : 1;
  const maxScale = minScale * 4;
  const handleConfirm = async () => {
    if (!img) return;
    setBusy(true);
    try {
      const blob = await renderCrop(img, scale, off, frameSize, outputSize);
      const out = new File([blob], "cover.jpg", { type: "image/jpeg" });
      onDone(out);
    } finally {
      setBusy(false);
    }
  };
  if (!src) return null;
  return /* @__PURE__ */ React.createElement("div", { style: {
    position: "absolute",
    inset: 0,
    zIndex: 300,
    background: "rgba(0,0,0,0.95)",
    display: "flex",
    flexDirection: "column",
    animation: "fadeIn 180ms ease"
  } }, /* @__PURE__ */ React.createElement("div", { style: {
    padding: "max(54px, calc(env(safe-area-inset-top) + 14px)) 18px 12px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row"
  } }, /* @__PURE__ */ React.createElement("button", { onClick: onCancel, style: {
    padding: "8px 14px",
    borderRadius: 999,
    color: "#fff",
    background: "rgba(255,255,255,0.12)",
    fontSize: 13,
    fontWeight: 500,
    border: "0.5px solid rgba(255,255,255,0.18)"
  } }, window.isRTL ? "إلغاء" : "Cancel"), /* @__PURE__ */ React.createElement("div", { style: { color: "#fff", fontSize: 13.5, fontWeight: 500 } }, window.isRTL ? "اضبط صورة الغلاف" : "Adjust cover"), /* @__PURE__ */ React.createElement("button", { onClick: handleConfirm, disabled: busy, style: {
    padding: "8px 14px",
    borderRadius: 999,
    color: "#fff",
    background: "var(--clay)",
    fontSize: 13,
    fontWeight: 600,
    border: "none",
    boxShadow: "0 4px 12px oklch(0.62 0.13 35 / 0.4)"
  } }, busy ? "…" : window.isRTL ? "تم" : "Done")), /* @__PURE__ */ React.createElement("div", { style: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden"
  } }, /* @__PURE__ */ React.createElement(
    "div",
    {
      onMouseDown: onStart,
      onMouseMove: (e) => dragRef.current && onMove(e),
      onMouseUp: onEnd,
      onMouseLeave: onEnd,
      onTouchStart: onStart,
      onTouchMove: onMove,
      onTouchEnd: onEnd,
      style: {
        position: "relative",
        width: frameSize,
        height: frameSize,
        cursor: "move",
        touchAction: "none",
        userSelect: "none",
        WebkitUserSelect: "none",
        overflow: "hidden",
        borderRadius: 6,
        background: "#000",
        boxShadow: "0 0 0 1px rgba(255,255,255,0.2), 0 0 0 9999px rgba(0,0,0,0.5)"
      }
    },
    img && /* @__PURE__ */ React.createElement(
      "img",
      {
        src,
        draggable: false,
        alt: "",
        style: {
          position: "absolute",
          top: "50%",
          left: "50%",
          width: img.naturalWidth * scale,
          height: img.naturalHeight * scale,
          transform: `translate(calc(-50% + ${off.x}px), calc(-50% + ${off.y}px))`,
          pointerEvents: "none",
          maxWidth: "none"
        }
      }
    ),
    /* @__PURE__ */ React.createElement("div", { style: {
      position: "absolute",
      inset: 0,
      pointerEvents: "none",
      backgroundImage: `
              linear-gradient(to right, transparent 33%, rgba(255,255,255,0.18) 33%, rgba(255,255,255,0.18) 33.5%, transparent 33.5%, transparent 66.5%, rgba(255,255,255,0.18) 66.5%, rgba(255,255,255,0.18) 67%, transparent 67%),
              linear-gradient(to bottom, transparent 33%, rgba(255,255,255,0.18) 33%, rgba(255,255,255,0.18) 33.5%, transparent 33.5%, transparent 66.5%, rgba(255,255,255,0.18) 66.5%, rgba(255,255,255,0.18) 67%, transparent 67%)
            `
    } })
  )), /* @__PURE__ */ React.createElement("div", { style: {
    padding: "0 30px",
    marginBottom: "calc(env(safe-area-inset-bottom) + 22px)",
    display: "flex",
    alignItems: "center",
    gap: 12,
    flexDirection: "row"
  } }, /* @__PURE__ */ React.createElement("span", { style: { color: "rgba(255,255,255,0.6)", fontSize: 13 } }, "−"), /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "range",
      min: minScale,
      max: maxScale,
      step: (maxScale - minScale) / 100,
      value: scale,
      onChange: (e) => setScale(parseFloat(e.target.value)),
      style: { flex: 1, accentColor: "var(--clay)" }
    }
  ), /* @__PURE__ */ React.createElement("span", { style: { color: "rgba(255,255,255,0.6)", fontSize: 13 } }, "+")));
}
function clampOffset(off, img, scale, frame) {
  if (!img) return off;
  const w = img.naturalWidth * scale;
  const h = img.naturalHeight * scale;
  const maxX = Math.max(0, (w - frame) / 2);
  const maxY = Math.max(0, (h - frame) / 2);
  return {
    x: Math.min(maxX, Math.max(-maxX, off.x)),
    y: Math.min(maxY, Math.max(-maxY, off.y))
  };
}
async function renderCrop(img, scale, off, frame, outputSize) {
  const canvas = document.createElement("canvas");
  canvas.width = outputSize;
  canvas.height = outputSize;
  const ctx = canvas.getContext("2d");
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  const dispW = img.naturalWidth * scale;
  const dispH = img.naturalHeight * scale;
  const imgLeft = (frame - dispW) / 2 + off.x;
  const imgTop = (frame - dispH) / 2 + off.y;
  const sx = -imgLeft / scale;
  const sy = -imgTop / scale;
  const sSize = frame / scale;
  ctx.drawImage(img, sx, sy, sSize, sSize, 0, 0, outputSize, outputSize);
  return new Promise(
    (resolve) => canvas.toBlob(resolve, "image/jpeg", 0.9)
  );
}
Object.assign(window, { Avatar, AvatarStack, RoleBadge, Chip, SectionLabel, KyotoHero, TintCard, Sheet, SwipeRow, Skeleton, TripSkeleton, ToastHost, ErrorBoundary, PullToRefresh, OfflineBanner, LargeTitleHeader, ActionSheetHost, ImageCropper });
function ScreenAuth({ go, mode: initMode = "signin" }) {
  const [mode, setMode] = React.useState(initMode);
  const [email, setEmail] = React.useState("");
  const [password, setPass] = React.useState("");
  const [confirmPw, setConfirmPw] = React.useState("");
  const [name, setName] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [checkEmail, setCheckEmail] = React.useState(false);
  const [resetSent, setResetSent] = React.useState(false);
  React.useEffect(() => {
    setMode(initMode);
  }, [initMode]);
  React.useEffect(() => {
    if (window._authRecoveryActive) setMode("reset");
  }, []);
  const handleSubmit = async () => {
    var _a, _b, _c;
    setLoading(true);
    setError(null);
    try {
      if (typeof window.sbSignIn !== "function" || typeof window.sbSignUp !== "function") {
        throw new Error(window.isRTL ? "تعذر تحميل صفحة تسجيل الدخول بالكامل — يرجى إعادة تحميل التطبيق" : "Sign-in didn't finish loading. Reload the app.");
      }
      if (mode === "signup") {
        if (!email || !password) throw new Error(window.isRTL ? "يرجى ملء جميع الحقول المطلوبة" : "Fill all fields");
        const { data } = await window.sbSignUp(email, password, name || email.split("@")[0]);
        if (!(data == null ? void 0 : data.session)) {
          setCheckEmail(true);
          setLoading(false);
          return;
        }
      } else if (mode === "signin") {
        if (!email || !password) throw new Error(window.isRTL ? "يرجى ملء جميع الحقول المطلوبة" : "Fill all fields");
        await window.sbSignIn(email, password);
      } else if (mode === "forgot") {
        if (!email) throw new Error(window.isRTL ? "يرجى إدخل بريدك الإلكتروني" : "Enter your email");
        await window.sbResetPassword(email);
        setResetSent(true);
        (_a = window.toast) == null ? void 0 : _a.call(window, window.isRTL ? "تم إرسال رابط إعادة التعيين بنجاح" : "Reset link sent", "success");
        setLoading(false);
        return;
      } else if (mode === "reset") {
        if (!password || password.length < 6) throw new Error(window.isRTL ? "يجب أن تتكون كلمة المرور من 6 أحرف على الأقل" : "Min 6 characters");
        if (password !== confirmPw) throw new Error(window.isRTL ? "كلمتا المرور غير متطابقتين" : "Passwords don't match");
        await window.sbUpdatePassword(password);
        (_b = window.toast) == null ? void 0 : _b.call(window, window.isRTL ? "تم تحديث كلمة المرور بنجاح" : "Password updated", "success");
        window._authRecoveryActive = false;
        window.location.hash = "";
        setPass("");
        setConfirmPw("");
        setLoading(false);
        go && go("trips");
        return;
      }
    } catch (err) {
      setError(err.message);
      (_c = window.toast) == null ? void 0 : _c.call(window, err.message, "error");
      setLoading(false);
    }
  };
  const handleResendConfirmation = async () => {
    var _a, _b;
    try {
      await window.sbResendConfirmation(email);
      (_a = window.toast) == null ? void 0 : _a.call(window, window.isRTL ? "تم إعادة إرسال رابط التأكيد" : "Confirmation resent", "success");
    } catch (err) {
      (_b = window.toast) == null ? void 0 : _b.call(window, err.message, "error");
    }
  };
  return /* @__PURE__ */ React.createElement("div", { "data-screen-label": mode === "signup" ? "00 Sign up" : "00 Sign in", style: {
    minHeight: "100%",
    position: "relative",
    overflow: "hidden",
    background: "var(--cream)"
  } }, /* @__PURE__ */ React.createElement("div", { style: { position: "absolute", inset: 0, overflow: "hidden" } }, /* @__PURE__ */ React.createElement("div", { style: {
    position: "absolute",
    inset: 0,
    background: "linear-gradient(170deg, oklch(0.36 0.06 30) 0%, oklch(0.22 0.04 280) 60%, oklch(0.18 0.03 280) 100%)"
  } }), /* @__PURE__ */ React.createElement("div", { style: {
    position: "absolute",
    top: "14%",
    right: "-10%",
    width: 280,
    height: 280,
    borderRadius: "50%",
    background: "radial-gradient(circle, oklch(0.94 0.10 70) 0%, oklch(0.74 0.16 35) 60%, transparent 100%)",
    filter: "blur(1px)"
  } }), /* @__PURE__ */ React.createElement("svg", { viewBox: "0 0 400 600", preserveAspectRatio: "none", style: { position: "absolute", inset: 0, width: "100%", height: "100%" } }, /* @__PURE__ */ React.createElement("polygon", { points: "0,420 90,290 180,360 260,260 340,340 400,310 400,600 0,600", fill: "oklch(0.30 0.04 280 / 0.6)" }), /* @__PURE__ */ React.createElement("polygon", { points: "0,470 80,380 170,420 250,360 330,400 400,380 400,600 0,600", fill: "oklch(0.22 0.03 275 / 0.85)" })), [[35, 80, 8], [70, 60, 10], [110, 90, 7], [170, 50, 9], [210, 80, 11], [260, 55, 8], [310, 95, 9], [350, 70, 7]].map(([x, y, r], i) => /* @__PURE__ */ React.createElement("div", { key: i, style: {
    position: "absolute",
    left: x,
    top: y,
    width: r * 2,
    height: r * 2,
    borderRadius: "50%",
    background: "radial-gradient(circle, oklch(0.96 0.05 25) 0%, oklch(0.78 0.14 18) 100%)",
    boxShadow: "0 1px 2px rgba(60,30,30,0.18)"
  } })), /* @__PURE__ */ React.createElement("div", { style: { position: "absolute", inset: 0, background: "radial-gradient(120% 60% at 50% 100%, transparent 30%, rgba(20,10,20,0.5) 100%)" } })), /* @__PURE__ */ React.createElement("div", { style: { position: "relative", padding: "max(70px, calc(env(safe-area-inset-top) + 20px)) 32px 0", color: "#fff" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 8, flexDirection: "row" } }, /* @__PURE__ */ React.createElement("div", { style: {
    width: 32,
    height: 32,
    borderRadius: 10,
    background: "var(--cream)",
    display: "grid",
    placeItems: "center",
    transform: "rotate(-4deg)",
    boxShadow: "0 4px 10px rgba(0,0,0,0.2)"
  } }, /* @__PURE__ */ React.createElement(IconCompass, { size: 18, stroke: "var(--ink)" })), /* @__PURE__ */ React.createElement("div", { className: "serif-italic", style: { fontSize: 26, letterSpacing: "-0.02em" } }, "voyage")), /* @__PURE__ */ React.createElement("div", { style: { marginTop: 64 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, fontWeight: 500, opacity: 0.78 } }, t("tagline")), /* @__PURE__ */ React.createElement("div", { className: "serif-italic", style: { fontSize: 54, lineHeight: 0.95, marginTop: 8, letterSpacing: "-0.02em" } }, mode === "signup" ? t("startLedger").split("\n").map((line, i) => /* @__PURE__ */ React.createElement(React.Fragment, { key: i }, line, i === 0 && /* @__PURE__ */ React.createElement("br", null))) : t("welcomeBack").split("\n").map((line, i) => /* @__PURE__ */ React.createElement(React.Fragment, { key: i }, line, i === 0 && /* @__PURE__ */ React.createElement("br", null)))))), /* @__PURE__ */ React.createElement("div", { style: {
    position: "relative",
    margin: "60px 14px 0",
    borderRadius: 28,
    padding: "22px 22px 18px",
    background: "rgba(255, 251, 244, 0.88)",
    backdropFilter: "blur(28px) saturate(180%)",
    WebkitBackdropFilter: "blur(28px) saturate(180%)",
    border: "0.5px solid rgba(255,255,255,0.6)",
    boxShadow: "0 40px 60px -20px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.6)"
  } }, (mode === "signin" || mode === "signup") && /* @__PURE__ */ React.createElement("div", { style: {
    display: "inline-flex",
    padding: 3,
    background: "var(--sand)",
    borderRadius: 999,
    marginBottom: 16,
    flexDirection: "row"
  } }, ["signin", "signup"].map((m) => /* @__PURE__ */ React.createElement("button", { key: m, onClick: () => setMode(m), style: {
    padding: "6px 14px",
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 500,
    background: mode === m ? "var(--ink)" : "transparent",
    color: mode === m ? "var(--cream)" : "var(--ink-soft)",
    transition: "all 200ms"
  } }, m === "signin" ? t("signIn") : t("signUp")))), mode === "forgot" && /* @__PURE__ */ React.createElement("div", { style: { marginBottom: 14 } }, /* @__PURE__ */ React.createElement("div", { className: "serif", style: { fontSize: 22, lineHeight: 1.1 } }, window.isRTL ? "استعادة كلمة المرور" : "Reset your password"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12.5, color: "var(--ink-mute)", marginTop: 4 } }, window.isRTL ? "سنرسل لك رابطاً لإعادة تعيين كلمة المرور" : "We'll email you a reset link")), mode === "reset" && /* @__PURE__ */ React.createElement("div", { style: { marginBottom: 14 } }, /* @__PURE__ */ React.createElement("div", { className: "serif", style: { fontSize: 22, lineHeight: 1.1 } }, window.isRTL ? "تعيين كلمة المرور الجديدة" : "Choose a new password")), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 10 } }, mode === "signup" && /* @__PURE__ */ React.createElement(
    Field,
    {
      label: t("fullName"),
      placeholder: window.isRTL ? "اكتب اسمك الكامل" : "Your full name",
      value: name,
      onChange: setName,
      icon: /* @__PURE__ */ React.createElement(IconUsers, { size: 14, stroke: "var(--ink-mute)" })
    }
  ), (mode === "signin" || mode === "signup" || mode === "forgot") && /* @__PURE__ */ React.createElement(
    Field,
    {
      label: t("email"),
      placeholder: "you@example.com",
      type: "email",
      value: email,
      onChange: setEmail,
      icon: /* @__PURE__ */ React.createElement(IconLink, { size: 14, stroke: "var(--ink-mute)" })
    }
  ), (mode === "signin" || mode === "signup" || mode === "reset") && /* @__PURE__ */ React.createElement(
    Field,
    {
      label: mode === "reset" ? window.isRTL ? "كلمة مرور جديدة" : "New password" : t("password"),
      placeholder: "••••••••",
      type: "password",
      value: password,
      onChange: setPass,
      icon: /* @__PURE__ */ React.createElement(IconLock, { size: 14, stroke: "var(--ink-mute)" }),
      action: mode === "signin" && t("forgotPassword"),
      onAction: mode === "signin" ? () => {
        setMode("forgot");
        setError(null);
      } : null
    }
  ), mode === "reset" && /* @__PURE__ */ React.createElement(
    Field,
    {
      label: window.isRTL ? "تأكيد كلمة المرور" : "Confirm password",
      placeholder: "••••••••",
      type: "password",
      value: confirmPw,
      onChange: setConfirmPw,
      icon: /* @__PURE__ */ React.createElement(IconLock, { size: 14, stroke: "var(--ink-mute)" })
    }
  ), checkEmail && /* @__PURE__ */ React.createElement("div", { style: {
    padding: "12px 14px",
    borderRadius: 12,
    background: "oklch(0.50 0.08 155 / 0.10)",
    border: "0.5px solid oklch(0.50 0.08 155 / 0.35)",
    fontSize: 12.5,
    color: "var(--moss)",
    lineHeight: 1.5
  } }, "✉️ ", window.isRTL ? "يرجى التحقق من بريدك الإلكتروني والضغط على رابط التأكيد، ثم عُد إلى هنا لتسجيل الدخول" : "Check your email and click the confirmation link, then come back and sign in.", /* @__PURE__ */ React.createElement("button", { onClick: handleResendConfirmation, style: {
    display: "block",
    marginTop: 8,
    color: "var(--moss)",
    fontWeight: 600,
    fontSize: 12,
    textDecoration: "underline"
  } }, window.isRTL ? "إعادة إرسال الرابط" : "Resend confirmation")), resetSent && mode === "forgot" && /* @__PURE__ */ React.createElement("div", { style: {
    padding: "12px 14px",
    borderRadius: 12,
    background: "oklch(0.50 0.08 155 / 0.10)",
    border: "0.5px solid oklch(0.50 0.08 155 / 0.35)",
    fontSize: 12.5,
    color: "var(--moss)",
    lineHeight: 1.5
  } }, "✉️ ", window.isRTL ? "تفقد بريدك الإلكتروني واضغط على رابط إعادة التعيين المرسل" : "Check your inbox and click the reset link."), error && /* @__PURE__ */ React.createElement("div", { style: {
    padding: "10px 14px",
    borderRadius: 12,
    background: "oklch(0.62 0.13 35 / 0.10)",
    border: "0.5px solid oklch(0.62 0.13 35 / 0.3)",
    fontSize: 12.5,
    color: "var(--clay-deep)",
    lineHeight: 1.4
  } }, error), mode === "signup" && /* @__PURE__ */ React.createElement("div", { style: {
    display: "flex",
    alignItems: "flex-start",
    gap: 10,
    flexDirection: "row",
    padding: "10px 12px",
    borderRadius: 14,
    background: "var(--sand)",
    marginTop: 2
  } }, /* @__PURE__ */ React.createElement("div", { style: {
    width: 18,
    height: 18,
    borderRadius: 6,
    background: "var(--ink)",
    display: "grid",
    placeItems: "center",
    flexShrink: 0,
    marginTop: 1
  } }, /* @__PURE__ */ React.createElement(IconCheck, { size: 11, stroke: "#fff" })), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: "var(--ink-soft)", lineHeight: 1.4, textAlign: "start" } }, t("agreeTerms")))), /* @__PURE__ */ React.createElement("button", { onClick: handleSubmit, disabled: loading, style: {
    width: "100%",
    marginTop: 14,
    padding: 15,
    borderRadius: 16,
    background: loading ? "var(--ink-soft)" : "var(--ink)",
    color: "var(--cream)",
    fontSize: 14,
    fontWeight: 600,
    letterSpacing: "-0.005em",
    cursor: loading ? "not-allowed" : "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    flexDirection: "row",
    boxShadow: "0 10px 22px rgba(34,28,22,0.3)"
  } }, loading ? /* @__PURE__ */ React.createElement("span", { style: {
    width: 16,
    height: 16,
    borderRadius: "50%",
    border: "2px solid rgba(255,255,255,0.35)",
    borderTopColor: "#fff",
    display: "inline-block",
    animation: "authspin 0.7s linear infinite"
  } }) : /* @__PURE__ */ React.createElement(React.Fragment, null, mode === "signup" ? t("createLedger") : mode === "forgot" ? window.isRTL ? "إرسال رابط إعادة التعيين" : "Send reset link" : mode === "reset" ? window.isRTL ? "تحديث كلمة المرور" : "Update password" : t("continue"), /* @__PURE__ */ React.createElement(IconChevron, { size: 14, stroke: "currentColor" }))), /* @__PURE__ */ React.createElement("style", null, `@keyframes authspin { to { transform: rotate(360deg) } }`), (mode === "forgot" || mode === "reset") && /* @__PURE__ */ React.createElement("button", { onClick: () => {
    setMode("signin");
    setError(null);
    setResetSent(false);
    window.location.hash = "";
  }, style: {
    display: "block",
    margin: "12px auto 0",
    fontSize: 12,
    color: "var(--ink-soft)",
    textDecoration: "underline"
  } }, window.isRTL ? "← العودة لتسجيل الدخول" : "← Back to sign in")), (mode === "signin" || mode === "signup") && /* @__PURE__ */ React.createElement("div", { style: {
    textAlign: "center",
    padding: "20px 0 28px",
    fontSize: 12.5,
    color: "var(--ink-mute)"
  } }, mode === "signup" ? t("alreadyHaveAccount") : t("newToVoyage"), /* @__PURE__ */ React.createElement("button", { onClick: () => setMode(mode === "signup" ? "signin" : "signup"), style: {
    marginInlineStart: 6,
    color: "var(--clay-deep)",
    fontWeight: 600
  } }, mode === "signup" ? t("signinLink") : t("createOne"))));
}
function Field({ label, placeholder, type = "text", icon, action, onAction, value, onChange }) {
  return /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: {
    display: "flex",
    justifyContent: "space-between",
    flexDirection: "row",
    fontSize: 12,
    fontWeight: 600,
    color: "var(--ink-soft)",
    marginBottom: 5,
    padding: "0 4px"
  } }, /* @__PURE__ */ React.createElement("span", null, label), action && /* @__PURE__ */ React.createElement("button", { onClick: onAction || void 0, style: { color: "var(--clay-deep)", fontWeight: 500 } }, action)), /* @__PURE__ */ React.createElement("div", { style: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    flexDirection: "row",
    padding: "12px 14px",
    borderRadius: 14,
    background: "rgba(255,255,255,0.7)",
    border: "0.5px solid var(--hairline)"
  } }, icon, /* @__PURE__ */ React.createElement(
    "input",
    {
      type,
      placeholder,
      value: value !== void 0 ? value : void 0,
      onChange: onChange ? (e) => onChange(e.target.value) : void 0,
      style: {
        flex: 1,
        border: 0,
        outline: 0,
        background: "transparent",
        fontSize: 14,
        fontFamily: "var(--sans)",
        color: "var(--ink)",
        textAlign: "start"
      }
    }
  )));
}
window.ScreenAuth = ScreenAuth;
function ScreenOnboarding({ onComplete, onCreateTrip }) {
  const [step, setStep] = React.useState(1);
  const [name, setName] = React.useState("");
  const [home, setHome] = React.useState("");
  const [currency, setCurrency] = React.useState("USD");
  const [saving, setSaving] = React.useState(false);
  const TOTAL = 3;
  React.useEffect(() => {
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
      const gulfTz = /Riyadh|Mecca|Makkah|Dubai|Doha|Kuwait|Bahrain|Muscat|Abu_Dhabi|Qatar|Manama/i;
      if (gulfTz.test(tz)) {
        setCurrency("SAR");
        if (tz.includes("Riyadh") || tz.includes("Mecca") || tz.includes("Makkah")) setHome("Makkah");
        else if (tz.includes("Dubai") || tz.includes("Abu_Dhabi")) setHome("Dubai");
        else if (tz.includes("Kuwait")) setHome("Kuwait City");
        else if (tz.includes("Doha") || tz.includes("Qatar")) setHome("Doha");
        else if (tz.includes("Muscat")) setHome("Muscat");
        else if (tz.includes("Bahrain") || tz.includes("Manama")) setHome("Manama");
      }
    } catch (_) {
    }
    if (window.sb && window.currentUserId) {
      window.sb.auth.getUser().then(({ data }) => {
        var _a;
        const meta = (_a = data == null ? void 0 : data.user) == null ? void 0 : _a.user_metadata;
        if ((meta == null ? void 0 : meta.name) && !name) setName(meta.name);
      }).catch(() => {
      });
    }
  }, []);
  const persistAndFinish = async (alsoCreateTrip = false) => {
    var _a, _b;
    setSaving(true);
    try {
      if (window.sb && window.currentUserId) {
        const updates = { default_currency: currency };
        if (name.trim()) {
          updates.name = name.trim();
          updates.initials = name.trim().split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2) || "V";
        }
        if (home.trim()) updates.home_base = home.trim();
        await window.sb.from("profiles").update(updates).eq("id", window.currentUserId);
        window.USER_DEFAULT_CURRENCY = (updates.default_currency || "USD").trim().toUpperCase();
      }
      try {
        localStorage.setItem("voyage:onboarded", "1");
      } catch (_) {
      }
      (_a = window.toast) == null ? void 0 : _a.call(window, window.isRTL ? "أهلاً بك في Voyage!" : "Welcome aboard", "success");
      onComplete == null ? void 0 : onComplete(alsoCreateTrip);
    } catch (err) {
      (_b = window.toast) == null ? void 0 : _b.call(window, err.message || "Could not save", "error");
    } finally {
      setSaving(false);
    }
  };
  const CURRENCIES = ["USD", "SAR", "EUR", "GBP", "JPY", "AED", "EGP", "MAD", "TRY", "INR", "CHF", "KWD", "BHD"];
  return /* @__PURE__ */ React.createElement("div", { "data-screen-label": "Onboarding", style: {
    position: "relative",
    minHeight: "100%",
    background: "var(--cream)",
    display: "flex",
    flexDirection: "column"
  } }, /* @__PURE__ */ React.createElement("div", { style: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 360,
    background: "radial-gradient(ellipse 85% 70% at 50% 18%, rgba(255,138,92,0.20) 0%, transparent 65%)",
    pointerEvents: "none"
  } }), /* @__PURE__ */ React.createElement("div", { style: {
    position: "relative",
    zIndex: 2,
    padding: "max(54px, calc(env(safe-area-inset-top) + 14px)) 22px 14px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  } }, /* @__PURE__ */ React.createElement("div", { style: {
    fontSize: 12,
    fontWeight: 600,
    color: "var(--ink-soft)"
  } }, t("obStep").replace("{a}", step).replace("{b}", TOTAL)), step < TOTAL && /* @__PURE__ */ React.createElement("button", { onClick: () => persistAndFinish(false), style: {
    fontSize: 13,
    color: "var(--ink-soft)",
    fontWeight: 500,
    padding: "6px 12px",
    borderRadius: 999
  } }, t("obSkip"))), /* @__PURE__ */ React.createElement("div", { style: {
    flex: 1,
    position: "relative",
    zIndex: 2,
    padding: "12px 24px 0",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start"
  } }, step === 1 && /* @__PURE__ */ React.createElement(StepWelcome, null), step === 2 && /* @__PURE__ */ React.createElement(StepBasics, { name, setName, home, setHome, currency, setCurrency, currencies: CURRENCIES }), step === 3 && /* @__PURE__ */ React.createElement(StepDone, { name, home, currency })), /* @__PURE__ */ React.createElement("div", { style: {
    display: "flex",
    justifyContent: "center",
    gap: 6,
    padding: "12px 0 4px"
  } }, [1, 2, 3].map((i) => /* @__PURE__ */ React.createElement("div", { key: i, style: {
    width: i === step ? 20 : 6,
    height: 6,
    borderRadius: 999,
    background: i === step ? "var(--ink)" : "var(--sand-deep)",
    transition: "all 280ms cubic-bezier(.32,.72,0,1)"
  } }))), /* @__PURE__ */ React.createElement("div", { style: {
    padding: "12px 22px calc(28px + env(safe-area-inset-bottom))",
    display: "flex",
    gap: 10
  } }, step > 1 && /* @__PURE__ */ React.createElement("button", { onClick: () => setStep(step - 1), disabled: saving, style: {
    padding: "15px 22px",
    borderRadius: 16,
    background: "var(--cream-2)",
    border: "0.5px solid var(--hairline-2)",
    color: "var(--ink-soft)",
    fontSize: 13.5,
    fontWeight: 500
  } }, t("obBack")), step === 1 && /* @__PURE__ */ React.createElement("button", { onClick: () => setStep(2), style: {
    flex: 1,
    padding: "15px",
    borderRadius: 16,
    background: "var(--ink)",
    color: "var(--cream)",
    fontSize: 14,
    fontWeight: 600,
    boxShadow: "0 8px 20px rgba(34,28,22,0.3)"
  } }, t("obGetStarted")), step === 2 && /* @__PURE__ */ React.createElement("button", { onClick: () => setStep(3), disabled: saving, style: {
    flex: 1,
    padding: "15px",
    borderRadius: 16,
    background: "var(--ink)",
    color: "var(--cream)",
    fontSize: 14,
    fontWeight: 600,
    boxShadow: "0 8px 20px rgba(34,28,22,0.3)"
  } }, t("obContinue")), step === 3 && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("button", { onClick: () => persistAndFinish(false), disabled: saving, style: {
    flex: 1,
    padding: "15px",
    borderRadius: 16,
    background: "var(--cream-2)",
    border: "0.5px solid var(--hairline-2)",
    color: "var(--ink)",
    fontSize: 13,
    fontWeight: 500
  } }, t("obExplore")), /* @__PURE__ */ React.createElement("button", { onClick: () => persistAndFinish(true), disabled: saving, style: {
    flex: 1.4,
    padding: "15px",
    borderRadius: 16,
    background: "var(--clay)",
    color: "#fff",
    fontSize: 14,
    fontWeight: 600,
    boxShadow: "0 8px 20px oklch(0.62 0.13 35 / 0.4)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 6
  } }, /* @__PURE__ */ React.createElement(IconPlus, { size: 14, stroke: "#fff" }), " ", t("obCreateTrip")))));
}
function StepWelcome() {
  const features = [
    { icon: /* @__PURE__ */ React.createElement(IconSwap, { size: 20, stroke: "#fff" }), tint: "var(--clay)", title: t("obFeature1Title"), sub: t("obFeature1Sub") },
    { icon: /* @__PURE__ */ React.createElement(IconUsers, { size: 20, stroke: "#fff" }), tint: "var(--moss)", title: t("obFeature2Title"), sub: t("obFeature2Sub") },
    { icon: /* @__PURE__ */ React.createElement(IconSparkle, { size: 20, stroke: "#fff" }), tint: "var(--indigo)", title: t("obFeature3Title"), sub: t("obFeature3Sub") }
  ];
  return /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 24, paddingTop: 16 } }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "serif-italic", style: {
    fontSize: 46,
    lineHeight: 1.02,
    letterSpacing: "-0.02em",
    color: "var(--ink)",
    whiteSpace: "pre-line"
  } }, t("obWelcomeTitle")), /* @__PURE__ */ React.createElement("div", { style: {
    fontSize: 14,
    color: "var(--ink-soft)",
    marginTop: 10,
    maxWidth: 320,
    lineHeight: 1.55
  } }, t("obWelcomeSub"))), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 12, marginTop: 8 } }, features.map((f, i) => /* @__PURE__ */ React.createElement("div", { key: i, style: {
    display: "flex",
    alignItems: "center",
    gap: 14,
    padding: "12px 14px",
    borderRadius: 16,
    background: "var(--cream-2)",
    border: "0.5px solid var(--hairline)"
  } }, /* @__PURE__ */ React.createElement("div", { style: {
    width: 40,
    height: 40,
    borderRadius: 12,
    background: f.tint,
    display: "grid",
    placeItems: "center",
    flexShrink: 0,
    boxShadow: "var(--shadow-sm)"
  } }, f.icon), /* @__PURE__ */ React.createElement("div", { style: { flex: 1, minWidth: 0 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13.5, fontWeight: 600, color: "var(--ink)" } }, f.title), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11.5, color: "var(--ink-mute)", marginTop: 2, lineHeight: 1.45 } }, f.sub))))));
}
function StepBasics({ name, setName, home, setHome, currency, setCurrency, currencies }) {
  const inputStyle = {
    width: "100%",
    padding: "14px 16px",
    borderRadius: 14,
    border: "0.5px solid var(--hairline-2)",
    background: "var(--cream-2)",
    color: "var(--ink)",
    fontSize: 16,
    outline: "none",
    textAlign: "start"
  };
  const labelStyle = {
    fontSize: 12,
    fontWeight: 600,
    color: "var(--ink)",
    marginBottom: 6,
    display: "block"
  };
  return /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 18, paddingTop: 16 } }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "serif-italic", style: { fontSize: 36, lineHeight: 1.05, color: "var(--ink)" } }, t("obBasicsTitle")), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, color: "var(--ink-soft)", marginTop: 6 } }, t("obBasicsSub"))), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { style: labelStyle }, t("obNameLabel")), /* @__PURE__ */ React.createElement(
    "input",
    {
      value: name,
      onChange: (e) => setName(e.target.value),
      placeholder: t("obNamePlaceholder"),
      style: inputStyle,
      autoFocus: true
    }
  )), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { style: labelStyle }, t("obHomeLabel")), /* @__PURE__ */ React.createElement(
    "input",
    {
      value: home,
      onChange: (e) => setHome(e.target.value),
      placeholder: t("obHomePlaceholder"),
      style: inputStyle
    }
  )), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { style: labelStyle }, t("obCurrencyLabel")), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexWrap: "wrap", gap: 6 } }, currencies.map((c) => /* @__PURE__ */ React.createElement("button", { key: c, onClick: () => setCurrency(c), style: {
    padding: "8px 13px",
    borderRadius: 10,
    fontSize: 12,
    fontWeight: 500,
    background: currency === c ? "var(--ink)" : "var(--cream-2)",
    color: currency === c ? "var(--cream)" : "var(--ink-soft)",
    border: "0.5px solid var(--hairline)"
  } }, c)))));
}
function StepDone({ name, home, currency }) {
  const first = (name || "").trim().split(" ")[0];
  return /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 24, paddingTop: 30 } }, /* @__PURE__ */ React.createElement("div", { style: { textAlign: "center" } }, /* @__PURE__ */ React.createElement("div", { style: {
    width: 80,
    height: 80,
    margin: "0 auto 16px",
    borderRadius: 24,
    background: "linear-gradient(140deg, var(--clay) 0%, var(--clay-deep) 100%)",
    display: "grid",
    placeItems: "center",
    boxShadow: "0 14px 32px oklch(0.62 0.13 35 / 0.45)"
  } }, /* @__PURE__ */ React.createElement(IconCheck, { size: 36, stroke: "#fff" })), /* @__PURE__ */ React.createElement("div", { className: "serif-italic", style: {
    fontSize: 42,
    lineHeight: 1.05,
    color: "var(--ink)",
    letterSpacing: "-0.02em"
  } }, first ? `${first}, ${t("obDoneTitle").toLowerCase()}` : t("obDoneTitle")), /* @__PURE__ */ React.createElement("div", { style: {
    fontSize: 13.5,
    color: "var(--ink-soft)",
    marginTop: 8,
    maxWidth: 280,
    marginInline: "auto",
    lineHeight: 1.55
  } }, t("obDoneSub"))), /* @__PURE__ */ React.createElement("div", { style: {
    background: "var(--cream-2)",
    border: "0.5px solid var(--hairline)",
    borderRadius: 18,
    padding: "14px 16px",
    display: "flex",
    flexDirection: "column",
    gap: 10
  } }, [
    { label: window.isRTL ? "الاسم الأول" : "Name", value: name || "—" },
    { label: t("homeBase"), value: home || "—" },
    { label: t("defaultCurrency"), value: currency }
  ].map((row, i) => /* @__PURE__ */ React.createElement("div", { key: i, style: {
    display: "flex",
    justifyContent: "space-between",
    borderTop: i ? "0.5px solid var(--hairline)" : "none",
    paddingTop: i ? 10 : 0
  } }, /* @__PURE__ */ React.createElement("span", { style: {
    fontSize: 12,
    color: "var(--ink-mute)"
  } }, row.label), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 13, color: "var(--ink)", fontWeight: 500 } }, row.value)))));
}
window.ScreenOnboarding = ScreenOnboarding;
function tripTemporalState(trip) {
  if (!(trip == null ? void 0 : trip.startDate) || !(trip == null ? void 0 : trip.endDate)) return { kind: (trip == null ? void 0 : trip.status) || "upcoming" };
  const now = /* @__PURE__ */ new Date();
  now.setHours(0, 0, 0, 0);
  const start = new Date(trip.startDate);
  start.setHours(0, 0, 0, 0);
  const end = new Date(trip.endDate);
  end.setHours(0, 0, 0, 0);
  const ms = 864e5;
  const { daysIn, daysTotal } = window.tripDays(trip.startDate, trip.endDate);
  if (now < start) {
    return { kind: "upcoming", daysUntil: Math.round((start - now) / ms), totalDays: daysTotal };
  }
  if (now > end) {
    return { kind: "past", totalDays: daysTotal };
  }
  return { kind: "current", dayN: daysIn, totalDays: daysTotal, daysRemaining: daysTotal - daysIn };
}
function ScreenTrips({ goTrip, go }) {
  var _a, _b, _c, _d, _e;
  const [scope, setScope] = React.useState("all");
  const [showSearch, setShowSearch] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const [initialLoad, setInitialLoad] = React.useState(!window.TRIPS || window.TRIPS.length === 0);
  const [stats, setStats] = React.useState(window.LIFETIME_STATS || window.LIFETIME_STATS_LKG || null);
  const [, forceTick] = React.useState(0);
  React.useEffect(() => {
    const id = setInterval(() => forceTick((n) => n + 1), 6e4);
    return () => clearInterval(id);
  }, []);
  const smartTripCandidate = (() => {
    const list = (window.TRIPS || []).map((trip) => ({ ...trip, state: tripTemporalState(trip) }));
    return list.find((t2) => t2.state.kind === "current") || list.find((t2) => t2.state.kind === "upcoming") || null;
  })();
  React.useEffect(() => {
    var _a2, _b2;
    if (!smartTripCandidate) return;
    if (((_a2 = window.TRIP) == null ? void 0 : _a2.id) === smartTripCandidate.id) return;
    (_b2 = window.loadTripData) == null ? void 0 : _b2.call(window, smartTripCandidate.id);
  }, [smartTripCandidate == null ? void 0 : smartTripCandidate.id]);
  React.useEffect(() => {
    if (window.TRIPS && window.TRIPS.length > 0 && window.loadLifetimeStats) {
      window.loadLifetimeStats().then((s) => {
        if (s) setStats(s);
      }).catch(() => {
      });
    }
  }, [(_a = window.TRIPS) == null ? void 0 : _a.length]);
  React.useEffect(() => {
    if ((window.TRIPS || []).length > 0) setInitialLoad(false);
    else {
      const t2 = setTimeout(() => setInitialLoad(false), 2e3);
      return () => clearTimeout(t2);
    }
  }, [(_b = window.TRIPS) == null ? void 0 : _b.length]);
  if (initialLoad && (!window.TRIPS || window.TRIPS.length === 0)) {
    return /* @__PURE__ */ React.createElement("div", { style: { background: "var(--cream)", minHeight: "100%", paddingBottom: 100 } }, /* @__PURE__ */ React.createElement("div", { style: { padding: "max(54px, calc(env(safe-area-inset-top) + 14px)) 22px 14px" } }, /* @__PURE__ */ React.createElement(Skeleton, { w: 120, h: 12, style: { marginBottom: 8 } }), /* @__PURE__ */ React.createElement(Skeleton, { w: 200, h: 28, r: 6 })), /* @__PURE__ */ React.createElement("div", { style: { padding: "0 14px" } }, /* @__PURE__ */ React.createElement(Skeleton, { h: 180, r: 28, style: { marginBottom: 24 } }), /* @__PURE__ */ React.createElement(Skeleton, { h: 48, r: 14, style: { marginBottom: 12 } }), /* @__PURE__ */ React.createElement(Skeleton, { h: 48, r: 14, style: { marginBottom: 12 } }), /* @__PURE__ */ React.createElement(Skeleton, { h: 48, r: 14 })));
  }
  const enrichedTrips = (window.TRIPS || []).map((trip) => ({
    ...trip,
    state: tripTemporalState(trip)
  }));
  const matchesScope = (t2) => scope === "all" || (scope === "shared" ? t2.shared : !t2.shared);
  const matchesSearch = (t2) => !search || (t2.title || "").toLowerCase().includes(search.toLowerCase());
  const trips = enrichedTrips.filter((t2) => matchesScope(t2) && matchesSearch(t2));
  const current = enrichedTrips.filter((t2) => t2.state.kind === "current");
  const upcoming = enrichedTrips.filter((t2) => t2.state.kind === "upcoming");
  const past = enrichedTrips.filter((t2) => t2.state.kind === "past");
  let events = [];
  if (smartTripCandidate && ((_c = window.TRIP) == null ? void 0 : _c.id) === smartTripCandidate.id && window.DOCS_TRIP_ID === smartTripCandidate.id) {
    events = ((_d = window.computeUpcomingEvents) == null ? void 0 : _d.call(window)) || [];
    window._smartEventsCache = { id: smartTripCandidate.id, events };
  } else if (smartTripCandidate && ((_e = window._smartEventsCache) == null ? void 0 : _e.id) === smartTripCandidate.id) {
    events = window._smartEventsCache.events;
  }
  const nextEvent = events[0] || null;
  return /* @__PURE__ */ React.createElement("div", { "data-screen-label": "00 Trips Home", style: {
    background: "var(--cream)",
    minHeight: "100%",
    paddingBottom: 100
  } }, /* @__PURE__ */ React.createElement(
    LargeTitleHeader,
    {
      title: t("yourTravels"),
      subtitle: t("heySunday")
    }
  ), stats && stats.totalTrips > 0 && /* @__PURE__ */ React.createElement("div", { style: { padding: "0 14px" } }, /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: () => go("insights"),
      "aria-label": window.isRTL ? `افتح الإحصائيات — ${stats.totalTrips} رحلات، ${stats.totalDays} يوم سفر` : `Open insights — ${stats.totalTrips} trips, ${stats.totalDays} travel days`,
      style: {
        all: "unset",
        cursor: "pointer",
        width: "100%",
        boxSizing: "border-box",
        background: "var(--statement)",
        color: "var(--statement-fg)",
        borderRadius: 26,
        padding: "20px 22px",
        position: "relative",
        overflow: "hidden",
        boxShadow: "var(--shadow-card)",
        display: "block"
      }
    },
    /* @__PURE__ */ React.createElement("div", { style: {
      position: "absolute",
      inset: 0,
      background: "radial-gradient(70% 60% at 100% 0%, oklch(0.45 0.10 35 / 0.42) 0%, transparent 65%)",
      pointerEvents: "none"
    } }),
    /* @__PURE__ */ React.createElement("div", { style: { position: "relative" } }, /* @__PURE__ */ React.createElement("div", { style: {
      fontSize: 17,
      lineHeight: 1.45,
      color: "var(--statement-sub)",
      fontWeight: 400
    } }, window.isRTL ? /* @__PURE__ */ React.createElement(React.Fragment, null, "خضت ", /* @__PURE__ */ React.createElement(NumSpan, null, window.arPlural(stats.totalTrips, { one: "رحلة واحدة", two: "رحلتين", few: `${stats.totalTrips} رحلات`, many: `${stats.totalTrips} رحلة`, other: `${stats.totalTrips} رحلة` })), " · ", "على مدار ", /* @__PURE__ */ React.createElement(NumSpan, null, window.arPlural(stats.totalDays, { one: "يوم واحد", two: "يومين", few: `${stats.totalDays} أيام`, many: `${stats.totalDays} يوماً`, other: `${stats.totalDays} يوماً` })), " من السفر", " · ", "شملت ", /* @__PURE__ */ React.createElement(NumSpan, null, window.arPlural(stats.countries, { one: "دولة واحدة", two: "دولتين", few: `${stats.countries} دول`, many: `${stats.countries} دولة`, other: `${stats.countries} دولة` }))) : /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(NumSpan, null, stats.totalTrips), " ", stats.totalTrips === 1 ? "trip" : "trips", " · ", /* @__PURE__ */ React.createElement(NumSpan, null, stats.totalDays), " travel days", " · ", /* @__PURE__ */ React.createElement(NumSpan, null, stats.countries), " ", stats.countries === 1 ? "country" : "countries")), /* @__PURE__ */ React.createElement("div", { style: {
      marginTop: 10,
      display: "flex",
      alignItems: "baseline",
      justifyContent: "space-between",
      gap: 8,
      flexDirection: "row"
    } }, stats.totalSpentUSD > 0 ? /* @__PURE__ */ React.createElement("div", { className: "mono", style: {
      fontSize: 26,
      fontWeight: 600,
      color: "var(--statement-fg)",
      letterSpacing: "-0.02em"
    } }, window.fmtMoney(stats.totalSpentUSD, { in: "home" })) : (
      // Keep the row anchored even with no spend yet — empty
      // span pushes the affordance to the trailing edge.
      /* @__PURE__ */ React.createElement("span", null)
    ), /* @__PURE__ */ React.createElement("div", { style: {
      fontSize: 12,
      color: "var(--statement-sub)",
      display: "inline-flex",
      alignItems: "center",
      gap: 4,
      flexDirection: "row"
    } }, window.isRTL ? "عرض الإحصائيات" : "See insights", /* @__PURE__ */ React.createElement("span", { className: "icon-flip" }, /* @__PURE__ */ React.createElement(IconChevron, { size: 12, stroke: "currentColor" })))))
  )), /* @__PURE__ */ React.createElement("div", { style: { padding: "20px 22px 10px" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 6, flexDirection: "row" } }, [
    { k: "all", l: t("all"), n: window.TRIPS.length },
    { k: "private", l: t("private"), n: window.TRIPS.filter((x) => !x.shared).length },
    { k: "shared", l: t("shared"), n: window.TRIPS.filter((x) => x.shared).length }
  ].map((s) => /* @__PURE__ */ React.createElement(Chip, { key: s.k, active: scope === s.k, onClick: () => setScope(s.k) }, s.l, " · ", s.n)), /* @__PURE__ */ React.createElement("div", { style: { flex: 1 } }), /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: () => {
        setShowSearch(!showSearch);
        setSearch("");
      },
      "aria-label": window.isRTL ? "بحث عن رحلة" : "Search trips",
      style: {
        width: 38,
        height: 38,
        borderRadius: 999,
        background: showSearch ? "var(--ink)" : "var(--cream-2)",
        border: "0.5px solid var(--hairline)",
        display: "grid",
        placeItems: "center",
        flexShrink: 0
      }
    },
    /* @__PURE__ */ React.createElement(IconSearch, { size: 15, stroke: showSearch ? "var(--cream)" : "var(--ink-soft)" })
  )), showSearch && /* @__PURE__ */ React.createElement("div", { style: { marginTop: 10 } }, /* @__PURE__ */ React.createElement(
    "input",
    {
      autoFocus: true,
      value: search,
      onChange: (e) => setSearch(e.target.value),
      placeholder: window.isRTL ? "ابحث عن رحلة..." : "Search trips...",
      style: {
        width: "100%",
        padding: "10px 14px",
        borderRadius: 12,
        border: "1px solid var(--hairline-2)",
        background: "var(--cream-2)",
        color: "var(--ink)",
        fontSize: 13.5,
        outline: "none",
        textAlign: "start"
      }
    }
  ))), nextEvent && scope === "all" && /* @__PURE__ */ React.createElement("div", { style: { padding: "4px 14px 0" } }, /* @__PURE__ */ React.createElement(SectionLabel, null, window.isRTL ? "الحدث القادم" : "Up next"), events.length > 1 ? /* @__PURE__ */ React.createElement(
    SmartTrackStack,
    {
      events: events.slice(0, 5),
      trip: smartTripCandidate,
      onOpen: () => goTrip(smartTripCandidate.id)
    }
  ) : /* @__PURE__ */ React.createElement(
    SmartTrackCard,
    {
      event: nextEvent,
      trip: smartTripCandidate,
      onOpenTrip: () => goTrip(smartTripCandidate.id)
    }
  )), (() => {
    const live = current.filter((tr) => scope === "all" || scope === (tr.shared ? "shared" : "private"));
    if (live.length === 0) return null;
    return /* @__PURE__ */ React.createElement("div", { style: { padding: "4px 14px 0" } }, /* @__PURE__ */ React.createElement(SectionLabel, null, t("currentlyTraveling")), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 14 } }, live.map((tr) => /* @__PURE__ */ React.createElement(CurrentTripCard, { key: tr.id, trip: tr, onOpen: () => goTrip(tr.id) }))));
  })(), upcoming.length > 0 && scope === "all" && /* @__PURE__ */ React.createElement("div", { style: { padding: "24px 0 0" } }, /* @__PURE__ */ React.createElement(SectionLabel, null, t("upcoming")), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 12, padding: "0 22px 4px", overflowX: "auto" }, className: "no-scrollbar" }, upcoming.map((trip) => /* @__PURE__ */ React.createElement(UpcomingTripCard, { key: trip.id, trip, onOpen: () => goTrip(trip.id) })))), past.length > 0 && (scope === "all" || past.some((x) => scope === (x.shared ? "shared" : "private"))) && /* @__PURE__ */ React.createElement("div", { style: { padding: "24px 14px 0" } }, /* @__PURE__ */ React.createElement(SectionLabel, null, t("pastTrips")), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 8, padding: "0 8px" } }, trips.filter((tr) => tr.state.kind === "past").map((trip) => /* @__PURE__ */ React.createElement(PastTripCard, { key: trip.id, trip, onOpen: () => goTrip(trip.id) })))), trips.length === 0 && /* @__PURE__ */ React.createElement("div", { style: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "48px 32px",
    textAlign: "center",
    gap: 12
  } }, /* @__PURE__ */ React.createElement("div", { style: {
    width: 64,
    height: 64,
    borderRadius: 20,
    background: "var(--cream-2)",
    display: "grid",
    placeItems: "center",
    border: "0.5px solid var(--hairline)"
  } }, /* @__PURE__ */ React.createElement(IconCompass, { size: 28, stroke: "var(--ink-mute)" })), /* @__PURE__ */ React.createElement("div", { className: "serif", style: { fontSize: 22, color: "var(--ink)" } }, window.isRTL ? "لا توجد رحلات بعد" : "No trips yet"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13.5, color: "var(--ink-mute)", lineHeight: 1.5, maxWidth: 220 } }, window.isRTL ? "ستظهر تفاصيل رحلاتك هنا بمجرد إنشائها" : "Your trips will appear here once created")));
}
function CurrentTripCard({ trip, onOpen }) {
  var _a;
  const { dayN, totalDays, daysRemaining } = trip.state;
  return /* @__PURE__ */ React.createElement("button", { onClick: onOpen, className: "press-soft", style: {
    width: "100%",
    textAlign: "start",
    borderRadius: 28,
    overflow: "hidden",
    position: "relative",
    background: "var(--cream-2)",
    border: "0.5px solid var(--hairline)",
    boxShadow: "var(--shadow-card)"
  } }, /* @__PURE__ */ React.createElement("div", { style: { height: 180, position: "relative", overflow: "hidden" } }, /* @__PURE__ */ React.createElement(CoverArt, { kind: trip.cover, imageUrl: trip.coverUrl || trip.coverImageUrl }), /* @__PURE__ */ React.createElement("div", { className: "glass", style: {
    position: "absolute",
    top: 14,
    insetInlineStart: 14,
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    padding: "5px 11px 5px 9px",
    borderRadius: 999,
    background: "rgba(0,0,0,0.40)",
    color: "#fff",
    fontSize: 11,
    fontWeight: 600,
    letterSpacing: "0.04em",
    backdropFilter: "blur(8px)"
  } }, /* @__PURE__ */ React.createElement("span", { style: {
    width: 7,
    height: 7,
    borderRadius: 999,
    background: "oklch(0.78 0.18 145)",
    boxShadow: "0 0 8px oklch(0.78 0.18 145)",
    animation: "pulse 1.6s ease-in-out infinite"
  } }), /* @__PURE__ */ React.createElement("span", null, window.isRTL ? "الآن" : "LIVE")), /* @__PURE__ */ React.createElement("div", { className: "glass", style: {
    position: "absolute",
    top: 14,
    insetInlineEnd: 14,
    padding: "5px 11px",
    borderRadius: 999,
    background: "rgba(0,0,0,0.40)",
    color: "#fff",
    fontFamily: "var(--mono)",
    fontSize: 11,
    letterSpacing: 0,
    fontWeight: 600
  } }, t("dayOfTotal", { n: dayN, total: totalDays })), /* @__PURE__ */ React.createElement("div", { style: {
    position: "absolute",
    bottom: 14,
    insetInlineStart: 18,
    insetInlineEnd: 18,
    color: "#fff",
    textShadow: "0 4px 14px rgba(0,0,0,0.4)"
  } }, /* @__PURE__ */ React.createElement("div", { className: "serif-italic", style: { fontSize: 36, lineHeight: 1 } }, trip.title), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, opacity: 0.9, marginTop: 2 } }, trip.sub || (window.isRTL ? ((_a = window.arPlural) == null ? void 0 : _a.call(window, daysRemaining, { zero: "لا توجد أيام متبقية", one: "يوم واحد متبقٍ", two: "يومان متبقيان", few: `${daysRemaining} أيام متبقية`, many: `${daysRemaining} يوماً متبقياً`, other: `${daysRemaining} يوم متبقٍ` })) || `${daysRemaining} أيام متبقية` : `${daysRemaining} days remaining`)))), /* @__PURE__ */ React.createElement("div", { style: {
    margin: "-22px 14px 0",
    position: "relative",
    background: "var(--cream)",
    borderRadius: 18,
    padding: "12px 14px",
    boxShadow: "var(--shadow-md)",
    border: "0.5px solid var(--hairline)",
    display: "flex",
    alignItems: "center",
    gap: 10
  } }, trip.members > 0 && /* @__PURE__ */ React.createElement(AvatarStack, { members: window.MEMBERS.slice(0, trip.members), size: 26 }), /* @__PURE__ */ React.createElement("div", { style: { flex: 1, minWidth: 0 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11.5, color: "var(--ink-mute)" } }, window.isRTL ? "الميزانية المستهلكة" : "Budget used"), /* @__PURE__ */ React.createElement("div", { style: {
    height: 5,
    marginTop: 4,
    borderRadius: 3,
    background: "var(--sand)",
    overflow: "hidden"
  } }, /* @__PURE__ */ React.createElement("div", { style: {
    width: "100%",
    height: "100%",
    background: trip.budgetPct > 100 ? "var(--clay-deep)" : "var(--clay)",
    transform: `scaleX(${Math.min(trip.budgetPct, 100) / 100})`,
    transformOrigin: window.isRTL ? "right center" : "left center",
    transition: "transform 380ms cubic-bezier(.2,.8,.2,1)",
    willChange: "transform"
  } }))), /* @__PURE__ */ React.createElement("div", { className: "mono", style: { fontSize: 14, fontWeight: 600, color: "var(--ink)" } }, trip.budgetPct, "%"), /* @__PURE__ */ React.createElement("span", { className: "icon-flip" }, /* @__PURE__ */ React.createElement(IconChevron, { size: 14, stroke: "var(--ink-mute)" }))), /* @__PURE__ */ React.createElement("div", { style: { height: 12 } }));
}
function UpcomingTripCard({ trip, onOpen }) {
  const { daysUntil } = trip.state;
  const countdownLabel = daysUntil === 0 ? t("startingToday") : daysUntil === 1 ? t("dayAway") : t("daysAway", { n: daysUntil });
  return /* @__PURE__ */ React.createElement("button", { onClick: onOpen, className: "press-soft", style: {
    flexShrink: 0,
    width: 220,
    textAlign: "start",
    borderRadius: 22,
    overflow: "hidden",
    background: "var(--cream-2)",
    border: "0.5px solid var(--hairline)",
    boxShadow: "var(--shadow-card)"
  } }, /* @__PURE__ */ React.createElement("div", { style: { height: 140, position: "relative", overflow: "hidden" } }, /* @__PURE__ */ React.createElement(CoverArt, { kind: trip.cover, imageUrl: trip.coverUrl || trip.coverImageUrl }), /* @__PURE__ */ React.createElement("div", { className: "glass", style: {
    position: "absolute",
    top: 12,
    left: "50%",
    transform: "translateX(-50%)",
    padding: "5px 12px",
    borderRadius: 999,
    background: "rgba(0,0,0,0.45)",
    color: "#fff",
    fontSize: 11,
    fontWeight: 600,
    letterSpacing: "0.02em",
    backdropFilter: "blur(8px)",
    display: "inline-flex",
    alignItems: "center",
    gap: 5,
    whiteSpace: "nowrap"
  } }, /* @__PURE__ */ React.createElement(IconClock, { size: 11, stroke: "#fff" }), countdownLabel), trip.country && /* @__PURE__ */ React.createElement("div", { className: "glass", style: {
    position: "absolute",
    top: 12,
    insetInlineStart: 10,
    padding: "4px 9px",
    borderRadius: 999,
    fontSize: 10.5,
    color: "#fff",
    background: "rgba(0,0,0,0.40)",
    fontFamily: "var(--mono)",
    letterSpacing: 0,
    fontWeight: 600
  } }, trip.country), trip.shared && /* @__PURE__ */ React.createElement("div", { style: { position: "absolute", bottom: -10, insetInlineEnd: 14 } }, /* @__PURE__ */ React.createElement(AvatarStack, { members: window.MEMBERS.slice(0, trip.members), size: 22 }))), /* @__PURE__ */ React.createElement("div", { style: { padding: "14px 14px 12px" } }, /* @__PURE__ */ React.createElement("div", { className: "serif", style: { fontSize: 22, lineHeight: 1, color: "var(--ink)" } }, trip.title), /* @__PURE__ */ React.createElement("div", { style: {
    fontSize: 11.5,
    color: "var(--ink-mute)",
    marginTop: 4,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8
  } }, /* @__PURE__ */ React.createElement("span", { style: { overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" } }, trip.dates), /* @__PURE__ */ React.createElement(BalancePill, { tripId: trip.id }))));
}
function BalancePill({ tripId, big = false }) {
  var _a, _b;
  const balance = (_b = (_a = window.LIFETIME_STATS) == null ? void 0 : _a.balanceByTrip) == null ? void 0 : _b[tripId];
  if (!balance || Math.abs(balance) < 0.5) return null;
  const trip = (window.TRIPS || []).find((t2) => t2.id === tripId);
  const owed = balance > 0;
  return /* @__PURE__ */ React.createElement("span", { style: {
    display: "inline-flex",
    alignItems: "center",
    gap: 4,
    padding: big ? "4px 10px" : "2px 8px",
    borderRadius: 999,
    background: owed ? "oklch(0.50 0.08 155 / 0.15)" : "oklch(0.62 0.13 35 / 0.15)",
    color: owed ? "var(--moss)" : "var(--clay-deep)",
    fontSize: big ? 11.5 : 10,
    fontWeight: 600,
    fontFamily: "var(--mono)",
    letterSpacing: "0.04em",
    flexShrink: 0
  } }, owed ? "+" : "−", " ", window.fmtTripMoney(Math.abs(balance), trip));
}
function PastTripCard({ trip, onOpen }) {
  var _a;
  const { totalDays } = trip.state;
  const tripStat = (((_a = window.LIFETIME_STATS) == null ? void 0 : _a.tripSpend) || []).find((t2) => t2.id === trip.id);
  const spent = (tripStat == null ? void 0 : tripStat.spent) || 0;
  return /* @__PURE__ */ React.createElement("button", { onClick: onOpen, className: "press-soft", style: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "12px 14px",
    borderRadius: 18,
    textAlign: "start",
    width: "100%",
    background: "var(--cream-2)",
    border: "0.5px solid var(--hairline)"
  } }, /* @__PURE__ */ React.createElement("div", { style: {
    width: 54,
    height: 54,
    borderRadius: 14,
    overflow: "hidden",
    flexShrink: 0,
    position: "relative"
  } }, /* @__PURE__ */ React.createElement(CoverArt, { kind: trip.cover, imageUrl: trip.coverUrl || trip.coverImageUrl }), /* @__PURE__ */ React.createElement("div", { style: {
    position: "absolute",
    bottom: 4,
    insetInlineEnd: 4,
    width: 20,
    height: 20,
    borderRadius: 999,
    background: "var(--moss)",
    display: "grid",
    placeItems: "center",
    boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
    border: "1.5px solid #fff"
  } }, /* @__PURE__ */ React.createElement(IconCheck, { size: 11, stroke: "#fff" }))), /* @__PURE__ */ React.createElement("div", { style: { flex: 1, minWidth: 0 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 6 } }, /* @__PURE__ */ React.createElement("span", { className: "serif", style: { fontSize: 17, lineHeight: 1.1, color: "var(--ink)" } }, trip.title), trip.shared && /* @__PURE__ */ React.createElement(RoleBadgeMini, { icon: /* @__PURE__ */ React.createElement(IconUsers, { size: 10, stroke: "var(--ink-soft)" }), label: `${trip.members}` })), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: "var(--ink-mute)", marginTop: 3, display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" } }, /* @__PURE__ */ React.createElement("span", { style: {
    padding: "2px 8px",
    borderRadius: 999,
    background: "oklch(0.50 0.08 155 / 0.14)",
    color: "var(--moss)",
    fontSize: 10.5,
    fontWeight: 500,
    flexShrink: 0
  } }, t("completed")), /* @__PURE__ */ React.createElement("span", { style: { overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" } }, t("lastedDays", { n: totalDays }), " · ", trip.dates)), spent > 0 && /* @__PURE__ */ React.createElement("div", { style: {
    fontSize: 11.5,
    color: "var(--ink-soft)",
    marginTop: 3,
    display: "flex",
    alignItems: "baseline",
    gap: 5,
    flexDirection: "row"
  } }, /* @__PURE__ */ React.createElement("span", { className: "mono", style: { fontWeight: 600, color: "var(--ink)" } }, window.fmtTripMoney(spent, trip)), /* @__PURE__ */ React.createElement("span", { style: { color: "var(--ink-mute)" } }, t("spentTotal").toLowerCase()))), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", alignItems: "center", gap: 4, flexShrink: 0 } }, /* @__PURE__ */ React.createElement(BalancePill, { tripId: trip.id }), /* @__PURE__ */ React.createElement("span", { className: "icon-flip" }, /* @__PURE__ */ React.createElement(IconChevron, { size: 14, stroke: "var(--ink-mute)" }))));
}
function RoleBadgeMini({ icon, label }) {
  return /* @__PURE__ */ React.createElement("span", { style: {
    display: "inline-flex",
    alignItems: "center",
    gap: 3,
    flexDirection: "row",
    padding: "2px 6px",
    borderRadius: 999,
    background: "var(--sand)",
    color: "var(--ink-soft)",
    fontSize: 10,
    fontWeight: 500
  } }, icon, label);
}
function CoverArt({ kind, imageUrl }) {
  if (imageUrl) {
    return /* @__PURE__ */ React.createElement("div", { style: {
      position: "absolute",
      inset: 0,
      overflow: "hidden",
      backgroundImage: `url(${imageUrl})`,
      backgroundSize: "cover",
      backgroundPosition: "center"
    } }, /* @__PURE__ */ React.createElement("div", { style: { position: "absolute", inset: 0, background: "radial-gradient(120% 60% at 50% 100%, transparent 50%, rgba(20,10,20,0.4) 100%)" } }));
  }
  const presets = {
    kyoto: { from: "oklch(0.74 0.07 30)", to: "oklch(0.36 0.05 285)", shapes: "mountains" },
    lisbon: { from: "oklch(0.78 0.09 70)", to: "oklch(0.50 0.10 35)", shapes: "tile" },
    oaxaca: { from: "oklch(0.74 0.13 60)", to: "oklch(0.42 0.13 30)", shapes: "sun" },
    lofoten: { from: "oklch(0.58 0.10 260)", to: "oklch(0.22 0.06 270)", shapes: "aurora" },
    patagon: { from: "oklch(0.70 0.07 200)", to: "oklch(0.34 0.07 250)", shapes: "peaks" }
  };
  const p = presets[kind] || presets.kyoto;
  return /* @__PURE__ */ React.createElement("div", { style: {
    position: "absolute",
    inset: 0,
    overflow: "hidden",
    background: `linear-gradient(160deg, ${p.from} 0%, ${p.to} 100%)`
  } }, p.shapes === "mountains" && /* @__PURE__ */ React.createElement(KyotoHero, null), p.shapes === "tile" && /* @__PURE__ */ React.createElement(TileCover, null), p.shapes === "sun" && /* @__PURE__ */ React.createElement(SunCover, null), p.shapes === "aurora" && /* @__PURE__ */ React.createElement(AuroraCover, null), p.shapes === "peaks" && /* @__PURE__ */ React.createElement(PeaksCover, null), /* @__PURE__ */ React.createElement("div", { style: {
    position: "absolute",
    inset: 0,
    background: "radial-gradient(120% 60% at 50% 100%, transparent 50%, rgba(20,10,20,0.4) 100%)"
  } }));
}
const TileCover = () => /* @__PURE__ */ React.createElement("div", { style: {
  position: "absolute",
  inset: 0,
  backgroundImage: "radial-gradient(circle at 25% 25%, oklch(0.94 0.05 75) 0 4px, transparent 5px),radial-gradient(circle at 75% 75%, oklch(0.94 0.05 75) 0 4px, transparent 5px)",
  backgroundSize: "40px 40px",
  opacity: 0.6
} });
const SunCover = () => /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { style: {
  position: "absolute",
  bottom: -30,
  left: "50%",
  transform: "translateX(-50%)",
  width: 200,
  height: 200,
  borderRadius: "50%",
  background: "radial-gradient(circle, oklch(0.92 0.13 80) 0%, oklch(0.78 0.17 40) 100%)",
  filter: "blur(2px)"
} }), /* @__PURE__ */ React.createElement("div", { style: { position: "absolute", inset: 0, background: "repeating-linear-gradient(180deg, transparent 0 18px, oklch(0.20 0.06 30 / 0.18) 18px 19px)" } }));
const AuroraCover = () => /* @__PURE__ */ React.createElement(React.Fragment, null, [0, 1, 2].map((i) => /* @__PURE__ */ React.createElement("div", { key: i, style: {
  position: "absolute",
  inset: 0,
  background: `radial-gradient(50% 30% at ${20 + i * 25}% ${20 + i * 12}%, oklch(0.78 0.13 ${145 + i * 30} / 0.6) 0%, transparent 60%)`,
  mixBlendMode: "screen"
} })), [20, 60, 120, 180, 240, 300].map((x, i) => /* @__PURE__ */ React.createElement("div", { key: i, style: {
  position: "absolute",
  left: x,
  top: 10 + i % 3 * 18,
  width: 2,
  height: 2,
  borderRadius: "50%",
  background: "#fff",
  opacity: 0.7
} })));
const PeaksCover = () => /* @__PURE__ */ React.createElement("svg", { viewBox: "0 0 400 200", preserveAspectRatio: "none", style: { position: "absolute", inset: 0, width: "100%", height: "100%" } }, /* @__PURE__ */ React.createElement("polygon", { points: "0,160 80,40 150,110 220,30 290,90 360,50 400,80 400,200 0,200", fill: "rgba(255,255,255,0.16)" }), /* @__PURE__ */ React.createElement("polygon", { points: "0,180 90,90 170,130 240,80 320,130 400,100 400,200 0,200", fill: "rgba(255,255,255,0.28)" }), /* @__PURE__ */ React.createElement("polygon", { points: "0,200 60,160 140,180 240,150 320,180 400,160 400,200", fill: "rgba(255,255,255,0.42)" }));
const SMART_TRACK_PALETTES = {
  flight: { surface: "oklch(0.28 0.10 260)", glow: "oklch(0.55 0.16 260)", chip: "var(--indigo)" },
  lodging: { surface: "oklch(0.32 0.10 35)", glow: "oklch(0.60 0.14 35)", chip: "var(--clay)" },
  "lodging-out": { surface: "oklch(0.32 0.10 35)", glow: "oklch(0.60 0.14 35)", chip: "var(--clay)" },
  transport: { surface: "oklch(0.34 0.08 75)", glow: "oklch(0.74 0.13 80)", chip: "var(--honey)" },
  plan: { surface: "oklch(0.30 0.09 155)", glow: "oklch(0.55 0.13 155)", chip: "var(--moss)" }
};
function getSmartTrackPalette(type) {
  return SMART_TRACK_PALETTES[type] || SMART_TRACK_PALETTES.plan;
}
function SmartTrackStack({ events, trip, onOpen }) {
  const n = events.length;
  const reduce = React.useRef(
    typeof window !== "undefined" && window.matchMedia ? window.matchMedia("(prefers-reduced-motion: reduce)").matches : false
  ).current;
  const [index, setIndex] = React.useState(0);
  const [dx, setDx] = React.useState(0);
  const drag = React.useRef({ x: 0, active: false, moved: false });
  if (reduce || n <= 1) {
    const rows = events.slice(1, 4);
    return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(SmartTrackCard, { event: events[0], trip, onOpenTrip: onOpen }), rows.length > 0 && /* @__PURE__ */ React.createElement("div", { style: {
      marginTop: 8,
      background: "var(--cream-2)",
      borderRadius: 18,
      border: "0.5px solid var(--hairline)",
      overflow: "hidden"
    } }, rows.map((ev, i) => /* @__PURE__ */ React.createElement(SmartTrackRow, { key: ev.id, event: ev, last: i === rows.length - 1, onOpenTrip: onOpen }))));
  }
  const advance = () => {
    setDx(0);
    setIndex((i) => (i + 1) % n);
  };
  const onDown = (e) => {
    drag.current = { x: e.clientX, active: true, moved: false };
  };
  const onMove = (e) => {
    if (!drag.current.active) return;
    const d = e.clientX - drag.current.x;
    if (Math.abs(d) > 4) drag.current.moved = true;
    setDx(d);
  };
  const onUp = () => {
    if (!drag.current.active) return;
    drag.current.active = false;
    if (Math.abs(dx) > 64) advance();
    else setDx(0);
  };
  const MAX = Math.min(n, 3);
  return /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { position: "relative" } }, /* @__PURE__ */ React.createElement("div", { "aria-hidden": "true", style: { visibility: "hidden", pointerEvents: "none" } }, /* @__PURE__ */ React.createElement(SmartTrackCard, { event: events[index], trip, onOpenTrip: () => {
  } })), events.map((ev, i) => {
    const rel = (i - index + n) % n;
    const depth = Math.min(rel, MAX - 1);
    const isFront = rel === 0;
    const transform = isFront ? `translateX(${dx}px) rotate(${dx * 0.02}deg)` : `translateY(${-depth * 10}px) scale(${1 - depth * 0.05})`;
    const opacity = rel >= MAX ? 0 : isFront ? 1 : 1 - depth * 0.22;
    return /* @__PURE__ */ React.createElement(
      "div",
      {
        key: ev.id,
        onPointerDown: isFront ? onDown : void 0,
        onPointerMove: isFront ? onMove : void 0,
        onPointerUp: isFront ? onUp : void 0,
        onPointerCancel: isFront ? onUp : void 0,
        style: {
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 30 - rel,
          transform,
          opacity,
          transition: isFront && drag.current.active ? "none" : "transform 320ms cubic-bezier(.2,.8,.2,1), opacity 280ms",
          pointerEvents: isFront ? "auto" : "none",
          touchAction: "pan-y",
          willChange: "transform"
        }
      },
      /* @__PURE__ */ React.createElement(SmartTrackCard, { event: ev, trip, onOpenTrip: onOpen })
    );
  })), /* @__PURE__ */ React.createElement("div", { style: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 10,
    padding: "0 4px",
    flexDirection: "row"
  } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 5, flexDirection: "row" } }, events.map((_, i) => /* @__PURE__ */ React.createElement("span", { key: i, style: {
    width: i === index ? 16 : 6,
    height: 6,
    borderRadius: 999,
    background: i === index ? "var(--ink)" : "var(--hairline-2)",
    transition: "width 220ms, background 220ms"
  } }))), /* @__PURE__ */ React.createElement("span", { style: { fontFamily: "var(--mono)", fontSize: 10.5, color: "var(--ink-mute)", letterSpacing: "0.04em" } }, index % n + 1, " / ", n, " · ", window.isRTL ? "اسحب للتالي" : "swipe")));
}
function SmartTrackCard({ event, trip, onOpenTrip }) {
  const when = window.relativeWhenLabel(event.startAt);
  const isNow = /now|الآن/i.test(when);
  const palette = getSmartTrackPalette(event.type);
  return /* @__PURE__ */ React.createElement("div", { style: {
    position: "relative",
    borderRadius: 24,
    overflow: "hidden",
    background: palette.surface,
    color: "#fff",
    boxShadow: "var(--shadow-card)"
  } }, /* @__PURE__ */ React.createElement("div", { style: {
    position: "absolute",
    inset: 0,
    background: `radial-gradient(85% 60% at 100% 0%, ${palette.glow} 0%, transparent 60%)`,
    opacity: 0.38,
    pointerEvents: "none"
  } }), /* @__PURE__ */ React.createElement("div", { style: { position: "relative", padding: "18px 18px 16px" } }, /* @__PURE__ */ React.createElement("div", { style: {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    padding: "4px 10px",
    borderRadius: 999,
    background: isNow ? palette.chip : "rgba(255,255,255,0.14)",
    border: "0.5px solid rgba(255,255,255,0.20)",
    fontFamily: "var(--mono)",
    fontSize: 11,
    fontWeight: 600,
    letterSpacing: 0
  } }, isNow && /* @__PURE__ */ React.createElement("span", { style: {
    width: 6,
    height: 6,
    borderRadius: "50%",
    background: "#fff",
    boxShadow: "0 0 8px #fff",
    animation: "pulse-fade 1.6s ease-in-out infinite"
  } }), when), /* @__PURE__ */ React.createElement("div", { style: {
    marginTop: 12,
    display: "flex",
    alignItems: "center",
    gap: 12,
    flexDirection: "row"
  } }, /* @__PURE__ */ React.createElement("div", { style: {
    width: 44,
    height: 44,
    borderRadius: 12,
    flexShrink: 0,
    background: "rgba(255,255,255,0.15)",
    border: "0.5px solid rgba(255,255,255,0.25)",
    display: "grid",
    placeItems: "center",
    backdropFilter: "blur(8px)"
  } }, /* @__PURE__ */ React.createElement(SmartTrackTypeIcon, { type: event.type })), /* @__PURE__ */ React.createElement("div", { style: { flex: 1, minWidth: 0 } }, /* @__PURE__ */ React.createElement("div", { className: "serif", style: {
    fontSize: 22,
    lineHeight: 1.15,
    color: "#fff",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap"
  } }, event.title), event.detail && /* @__PURE__ */ React.createElement("div", { className: "mono", style: {
    fontSize: 13,
    color: "rgba(255,255,255,0.86)",
    marginTop: 3,
    letterSpacing: "0.02em"
  } }, event.detail), event.subtle && /* @__PURE__ */ React.createElement("div", { style: {
    fontSize: 11.5,
    color: "rgba(255,255,255,0.68)",
    marginTop: 2,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap"
  } }, event.subtle))), (event.primaryFileUrl || event.secondaryFileUrl || event.locationUrl) && /* @__PURE__ */ React.createElement("div", { style: {
    marginTop: 14,
    display: "flex",
    gap: 8,
    flexDirection: "row",
    flexWrap: "wrap"
  } }, event.secondaryFileUrl && /* @__PURE__ */ React.createElement(
    ActionPill,
    {
      label: event.secondaryFileLabel || "Open",
      href: event.secondaryFileUrl,
      icon: /* @__PURE__ */ React.createElement(window.IconDoc, { size: 13, stroke: "currentColor" }),
      primary: true
    }
  ), event.primaryFileUrl && /* @__PURE__ */ React.createElement(
    ActionPill,
    {
      label: event.primaryFileLabel || "Open file",
      href: event.primaryFileUrl,
      icon: /* @__PURE__ */ React.createElement(window.IconDoc, { size: 13, stroke: "currentColor" }),
      primary: !event.secondaryFileUrl
    }
  ), event.locationUrl && /* @__PURE__ */ React.createElement(
    ActionPill,
    {
      label: window.isRTL ? "الموقع" : "Location",
      href: event.locationUrl,
      icon: /* @__PURE__ */ React.createElement(window.IconPin, { size: 13, stroke: "currentColor" })
    }
  ), /* @__PURE__ */ React.createElement("button", { onClick: onOpenTrip, style: {
    padding: "8px 12px",
    borderRadius: 999,
    background: "transparent",
    color: "rgba(255,255,255,0.85)",
    border: "0.5px solid rgba(255,255,255,0.22)",
    fontSize: 12,
    fontWeight: 500,
    display: "inline-flex",
    alignItems: "center",
    gap: 5,
    flexDirection: "row"
  } }, window.isRTL ? "الرحلة" : "Trip", /* @__PURE__ */ React.createElement("span", { className: "icon-flip", style: { opacity: 0.7 } }, /* @__PURE__ */ React.createElement(window.IconChevron, { size: 11, stroke: "currentColor" }))))));
}
function SmartTrackRow({ event, last, onOpenTrip }) {
  const when = window.relativeWhenLabel(event.startAt);
  return /* @__PURE__ */ React.createElement("div", { style: {
    padding: "12px 14px",
    display: "flex",
    alignItems: "center",
    gap: 12,
    flexDirection: "row",
    borderTop: last ? "none" : "none",
    borderBottom: last ? "none" : "0.5px solid var(--hairline)"
  } }, /* @__PURE__ */ React.createElement("div", { style: {
    width: 30,
    height: 30,
    borderRadius: 9,
    flexShrink: 0,
    background: event.type === "flight" ? "var(--indigo)" : event.type === "lodging" || event.type === "lodging-out" ? "var(--clay)" : event.type === "transport" ? "var(--honey)" : "var(--moss)",
    display: "grid",
    placeItems: "center"
  } }, /* @__PURE__ */ React.createElement(SmartTrackTypeIcon, { type: event.type, size: 14 })), /* @__PURE__ */ React.createElement("div", { style: { flex: 1, minWidth: 0 } }, /* @__PURE__ */ React.createElement("div", { style: {
    fontSize: 13.5,
    fontWeight: 500,
    color: "var(--ink)",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap"
  } }, event.title), /* @__PURE__ */ React.createElement("div", { style: {
    fontSize: 11,
    color: "var(--ink-mute)",
    marginTop: 1,
    display: "flex",
    alignItems: "center",
    gap: 6,
    flexDirection: "row"
  } }, /* @__PURE__ */ React.createElement("span", null, when), event.detail && /* @__PURE__ */ React.createElement("span", null, "· ", event.detail))), event.locationUrl && /* @__PURE__ */ React.createElement(
    "a",
    {
      href: event.locationUrl,
      target: "_blank",
      rel: "noreferrer",
      onClick: (e) => e.stopPropagation(),
      "aria-label": window.isRTL ? "الموقع" : "Location",
      style: {
        minWidth: 36,
        minHeight: 36,
        padding: 11,
        borderRadius: 10,
        background: "var(--cream)",
        color: "var(--ink-soft)",
        border: "0.5px solid var(--hairline)",
        display: "grid",
        placeItems: "center",
        textDecoration: "none",
        boxSizing: "border-box"
      }
    },
    /* @__PURE__ */ React.createElement(window.IconPin, { size: 14, stroke: "currentColor" })
  ), /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: onOpenTrip,
      "aria-label": window.isRTL ? "فتح تفاصيل الرحلة" : "Open trip",
      style: {
        minWidth: 36,
        minHeight: 36,
        padding: 11,
        borderRadius: 10,
        background: "transparent",
        color: "var(--ink-mute)",
        border: "0.5px solid var(--hairline)",
        display: "grid",
        placeItems: "center",
        boxSizing: "border-box"
      }
    },
    /* @__PURE__ */ React.createElement("span", { className: "icon-flip" }, /* @__PURE__ */ React.createElement(window.IconChevron, { size: 14, stroke: "currentColor" }))
  ));
}
function ActionPill({ label, href, icon, primary }) {
  return /* @__PURE__ */ React.createElement("a", { href, target: "_blank", rel: "noreferrer", style: {
    padding: "8px 12px",
    borderRadius: 999,
    background: primary ? "#fff" : "transparent",
    color: primary ? "oklch(0.22 0.025 250)" : "rgba(255,255,255,0.92)",
    border: primary ? "none" : "0.5px solid rgba(255,255,255,0.22)",
    fontSize: 12,
    fontWeight: 500,
    display: "inline-flex",
    alignItems: "center",
    gap: 5,
    flexDirection: "row",
    textDecoration: "none"
  } }, icon, label);
}
function NumSpan({ children }) {
  return /* @__PURE__ */ React.createElement("span", { style: {
    color: "var(--statement-fg)",
    fontWeight: 600
  } }, children);
}
function SmartTrackTypeIcon({ type, size = 22 }) {
  const stroke = "#fff";
  if (type === "flight") {
    return /* @__PURE__ */ React.createElement(
      "svg",
      {
        width: size,
        height: size,
        viewBox: "0 0 24 24",
        fill: "none",
        stroke,
        strokeWidth: "1.8",
        strokeLinecap: "round",
        strokeLinejoin: "round"
      },
      /* @__PURE__ */ React.createElement("path", { d: "M21 16v-2l-8-5V3.5a1.5 1.5 0 00-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1L15 22v-1.5L13 19v-5.5l8 2.5z" })
    );
  }
  if (type === "lodging" || type === "lodging-out") {
    return /* @__PURE__ */ React.createElement(
      "svg",
      {
        width: size,
        height: size,
        viewBox: "0 0 24 24",
        fill: "none",
        stroke,
        strokeWidth: "1.8",
        strokeLinecap: "round",
        strokeLinejoin: "round"
      },
      /* @__PURE__ */ React.createElement("path", { d: "M3 21V8a1 1 0 011-1h16a1 1 0 011 1v13" }),
      /* @__PURE__ */ React.createElement("path", { d: "M3 21h18M7 12h2M7 16h2M13 12h4v9h-4z" })
    );
  }
  if (type === "transport") {
    return /* @__PURE__ */ React.createElement(
      "svg",
      {
        width: size,
        height: size,
        viewBox: "0 0 24 24",
        fill: "none",
        stroke,
        strokeWidth: "1.8",
        strokeLinecap: "round",
        strokeLinejoin: "round"
      },
      /* @__PURE__ */ React.createElement("rect", { x: "4", y: "4", width: "16", height: "13", rx: "2.5" }),
      /* @__PURE__ */ React.createElement("path", { d: "M4 11h16M8 17v3M16 17v3" }),
      /* @__PURE__ */ React.createElement("circle", { cx: "8.5", cy: "14.5", r: ".8", fill: stroke }),
      /* @__PURE__ */ React.createElement("circle", { cx: "15.5", cy: "14.5", r: ".8", fill: stroke })
    );
  }
  return /* @__PURE__ */ React.createElement(
    "svg",
    {
      width: size,
      height: size,
      viewBox: "0 0 24 24",
      fill: "none",
      stroke,
      strokeWidth: "1.8",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    },
    /* @__PURE__ */ React.createElement("circle", { cx: "12", cy: "12", r: "9" }),
    /* @__PURE__ */ React.createElement("path", { d: "M12 7v5l3 2" })
  );
}
Object.assign(window, { ScreenTrips, CoverArt, SmartTrackCard, SmartTrackRow, SmartTrackStack });
function ScreenInsights({ go, goTrip }) {
  const [stats, setStats] = React.useState(window.LIFETIME_STATS || window.LIFETIME_STATS_LKG || null);
  const [loading, setLoading] = React.useState(!(window.LIFETIME_STATS || window.LIFETIME_STATS_LKG));
  React.useEffect(() => {
    let alive = true;
    (async () => {
      var _a, _b;
      const seed = window.LIFETIME_STATS || window.LIFETIME_STATS_LKG;
      if (seed) setStats(seed);
      else setLoading(true);
      try {
        const s = await ((_a = window.loadLifetimeStats) == null ? void 0 : _a.call(window));
        if (alive && s) setStats(s);
      } catch (err) {
        console.error("insights load", err);
        if (!window.LIFETIME_STATS) (_b = window.toast) == null ? void 0 : _b.call(window, err.message || "Failed to load insights", "error");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);
  const HeaderEl = /* @__PURE__ */ React.createElement(
    LargeTitleHeader,
    {
      title: t("insightsTitle"),
      subtitle: t("insightsSub"),
      onBack: () => go("trips")
    }
  );
  if (loading) {
    return /* @__PURE__ */ React.createElement("div", { style: { background: "var(--cream)", minHeight: "100%", paddingBottom: 100 } }, HeaderEl, /* @__PURE__ */ React.createElement(TripSkeleton, null));
  }
  if (!stats || stats.totalTrips === 0) {
    return /* @__PURE__ */ React.createElement("div", { style: { background: "var(--cream)", minHeight: "100%", paddingBottom: 100 } }, HeaderEl, /* @__PURE__ */ React.createElement("div", { style: {
      padding: "60px 24px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      textAlign: "center",
      gap: 12
    } }, /* @__PURE__ */ React.createElement("div", { style: {
      width: 72,
      height: 72,
      borderRadius: 20,
      background: "var(--cream-2)",
      border: "0.5px solid var(--hairline)",
      display: "grid",
      placeItems: "center"
    } }, /* @__PURE__ */ React.createElement(IconSparkle, { size: 32, stroke: "var(--ink-mute)" })), /* @__PURE__ */ React.createElement("div", { className: "serif", style: { fontSize: 22, color: "var(--ink)" } }, t("noInsightsYet")), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, color: "var(--ink-mute)", maxWidth: 260, lineHeight: 1.5 } }, t("noInsightsSub")), /* @__PURE__ */ React.createElement("button", { onClick: () => go("trips"), style: {
      marginTop: 4,
      padding: "12px 22px",
      borderRadius: 14,
      background: "var(--ink)",
      color: "var(--cream)",
      fontSize: 13.5,
      fontWeight: 600
    } }, window.isRTL ? "← قائمة الرحلات" : "Go to trips →")));
  }
  const yearsWithActivity = stats.byYear.filter((y) => (y.trips || 0) > 0);
  const heroYearRow = yearsWithActivity.length > 0 ? yearsWithActivity[yearsWithActivity.length - 1] : stats.byYear[stats.byYear.length - 1];
  const heroYear = heroYearRow.year;
  const yearTrips = stats.tripSpend.filter((tr) => tr.startDate && new Date(tr.startDate).getFullYear() === heroYear).sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
  const previousYears = stats.byYear.filter((y) => y.year !== heroYear && (y.trips || 0) > 0).sort((a, b) => b.year - a.year);
  return /* @__PURE__ */ React.createElement("div", { "data-screen-label": "Lifetime Insights · Year Ledger", style: {
    background: "var(--cream)",
    minHeight: "100%",
    paddingBottom: 100
  } }, HeaderEl, /* @__PURE__ */ React.createElement(YearHero, { year: heroYear }), /* @__PURE__ */ React.createElement(LedgerSentence, { row: heroYearRow }), /* @__PURE__ */ React.createElement(LedgerDivider, null), /* @__PURE__ */ React.createElement(NotableTrips, { stats }), stats.byCategory.length > 0 && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(LedgerDivider, null), /* @__PURE__ */ React.createElement(CategoryStack, { stats })), stats.byMonth.some((m) => m.spent > 0) && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(LedgerDivider, null), /* @__PURE__ */ React.createElement(MonthSparkline, { byMonth: stats.byMonth })), yearTrips.length > 0 && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(LedgerDivider, null), /* @__PURE__ */ React.createElement(TripList, { trips: yearTrips, year: heroYear, goTrip })), previousYears.length > 0 && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(LedgerDivider, null), /* @__PURE__ */ React.createElement(PreviousYears, { years: previousYears })), /* @__PURE__ */ React.createElement(LedgerFooter, { stats }));
}
function YearHero({ year }) {
  return /* @__PURE__ */ React.createElement("div", { style: {
    padding: "20px 22px 18px",
    textAlign: "center"
  } }, /* @__PURE__ */ React.createElement("div", { style: {
    fontSize: 12,
    fontWeight: 500,
    color: "var(--ink-mute)",
    marginBottom: 6,
    letterSpacing: 0
  } }, window.isRTL ? "سنة السفر والترحال" : "Travel year"), /* @__PURE__ */ React.createElement("div", { style: {
    fontFamily: "var(--sans)",
    fontSize: "clamp(80px, 22vw, 128px)",
    fontWeight: 600,
    lineHeight: 1,
    color: "var(--ink)",
    letterSpacing: "-0.05em",
    fontVariantNumeric: "tabular-nums"
  } }, year));
}
function LedgerSentence({ row }) {
  const isAr = !!window.isRTL;
  const fmt = (n) => window.fmtMoney(n, { in: "home" });
  const trips = row.trips || 0;
  const countries = row.countries || 0;
  const days = row.days || 0;
  const spent = row.spent || 0;
  const dailyAvg = days > 0 ? spent / days : 0;
  return /* @__PURE__ */ React.createElement("div", { style: {
    padding: "0 22px",
    display: "flex",
    justifyContent: "center"
  } }, /* @__PURE__ */ React.createElement("p", { style: {
    margin: 0,
    maxWidth: "42ch",
    textAlign: "center",
    fontSize: 17,
    lineHeight: 1.55,
    color: "var(--ink-soft)",
    fontWeight: 400
  } }, isAr ? /* @__PURE__ */ React.createElement(React.Fragment, null, "خضت ", /* @__PURE__ */ React.createElement(LN, null, window.arPlural(trips, { one: "رحلة واحدة", two: "رحلتين", few: `${trips} رحلات`, many: `${trips} رحلة`, other: `${trips} رحلة` })), " ", "شملت ", /* @__PURE__ */ React.createElement(LN, null, window.arPlural(countries, { one: "وجهة دولية واحدة", two: "وجهتين دوليتين", few: `${countries} وجهات دولية`, many: `${countries} وجهة دولية`, other: `${countries} وجهة دولية` })), " ", "عبر ", /* @__PURE__ */ React.createElement(LN, null, window.arPlural(days, { one: "يوم سفر واحد", two: "يومي سفر", few: `${days} أيام سفر`, many: `${days} يوماً من السفر`, other: `${days} يوم سفر` })), ".", " ", "بلغ إجمالي إنفاقك ", /* @__PURE__ */ React.createElement(LN, null, fmt(spent)), days > 0 && /* @__PURE__ */ React.createElement(React.Fragment, null, " بمعدل يومي قدره ", /* @__PURE__ */ React.createElement(LN, null, fmt(dailyAvg))), ".") : /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(LN, null, trips), " ", trips === 1 ? "trip" : "trips", ", in ", /* @__PURE__ */ React.createElement(LN, null, countries), " ", countries === 1 ? "country" : "countries", ", across ", /* @__PURE__ */ React.createElement(LN, null, days), " ", days === 1 ? "day" : "days", " of travel. You spent ", /* @__PURE__ */ React.createElement(LN, null, fmt(spent)), days > 0 && /* @__PURE__ */ React.createElement(React.Fragment, null, ", averaging ", /* @__PURE__ */ React.createElement(LN, null, fmt(dailyAvg)), " a day"), ".")));
}
function LN({ children }) {
  return /* @__PURE__ */ React.createElement("span", { style: {
    fontWeight: 700,
    color: "var(--ink)",
    letterSpacing: "-0.005em"
  } }, children);
}
function NotableTrips({ stats }) {
  const longest = stats.longestTrip;
  const expensive = stats.mostExpensive;
  const isAr = !!window.isRTL;
  const fmt = (n) => window.fmtMoney(n, { in: "home" });
  if (!longest && !expensive) return null;
  const sameTrip = longest && expensive && longest.id === expensive.id;
  if (sameTrip) {
    return /* @__PURE__ */ React.createElement(
      ChapterFrame,
      {
        title: isAr ? "المحطة الأبرز في رحلاتك" : "Notable trip",
        subtitle: isAr ? "الرحلة الأطول والأكثر إنفاقاً بين أسفارك" : "longest and biggest of all your travel"
      },
      /* @__PURE__ */ React.createElement("div", { style: { padding: "0 22px", textAlign: "center" } }, /* @__PURE__ */ React.createElement("div", { className: "serif-italic", style: {
        fontSize: 26,
        lineHeight: 1.2,
        color: "var(--ink)",
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap"
      } }, longest.title), /* @__PURE__ */ React.createElement("div", { className: "mono", style: {
        marginTop: 6,
        fontSize: 13.5,
        fontWeight: 600,
        color: "var(--ink-soft)",
        fontVariantNumeric: "tabular-nums"
      } }, isAr ? `استغرقت ${window.arPlural(longest.dur, { one: "يوماً واحداً", two: "يومين", few: `${longest.dur} أيام`, many: `${longest.dur} يوماً`, other: `${longest.dur} يوماً` })}` : `${longest.dur} ${longest.dur === 1 ? "day" : "days"}`, /* @__PURE__ */ React.createElement("span", { style: { color: "var(--ink-mute)" } }, " · ", isAr ? "بإجمالي" : "", " "), window.fmtTripMoney(expensive.spent, expensive)))
    );
  }
  return /* @__PURE__ */ React.createElement(
    ChapterFrame,
    {
      title: isAr ? "محطات بارزة في رحلاتك" : "Notable trips",
      subtitle: isAr ? "مقتطفات متميزة من كافة أسفارك" : "across all your travel"
    },
    /* @__PURE__ */ React.createElement("div", { style: {
      display: "grid",
      gridTemplateColumns: longest && expensive ? "1fr 1fr" : "1fr",
      gap: 24,
      padding: "0 22px"
    } }, longest && /* @__PURE__ */ React.createElement(
      NotableEntry,
      {
        label: isAr ? "الرحلة الأطول" : "Longest",
        name: longest.title,
        stat: isAr ? window.arPlural(longest.dur, { one: "يوم واحد", two: "يومان", few: `${longest.dur} أيام`, many: `${longest.dur} يوماً`, other: `${longest.dur} يوم` }) : `${longest.dur} ${longest.dur === 1 ? "day" : "days"}`
      }
    ), expensive && /* @__PURE__ */ React.createElement(
      NotableEntry,
      {
        label: isAr ? "الرحلة الأعلى إنفاقاً" : "Biggest",
        name: expensive.title,
        stat: window.fmtTripMoney(expensive.spent, expensive)
      }
    ))
  );
}
function NotableEntry({ label, name, stat }) {
  return /* @__PURE__ */ React.createElement("div", { style: { textAlign: "center" } }, /* @__PURE__ */ React.createElement("div", { style: {
    fontSize: 11,
    fontWeight: 500,
    color: "var(--ink-mute)",
    marginBottom: 6
  } }, label), /* @__PURE__ */ React.createElement("div", { className: "serif-italic", style: {
    fontSize: 22,
    lineHeight: 1.2,
    color: "var(--ink)",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    padding: "0 4px"
  } }, name), /* @__PURE__ */ React.createElement("div", { className: "mono", style: {
    marginTop: 4,
    fontSize: 13.5,
    fontWeight: 600,
    color: "var(--ink-soft)",
    fontVariantNumeric: "tabular-nums"
  } }, stat));
}
function CategoryStack({ stats }) {
  const isAr = !!window.isRTL;
  const fmt = (n) => window.fmtMoney(n, { in: "home" });
  const CAT_COLOR = {
    lodging: "var(--clay)",
    food: "var(--honey)",
    transit: "var(--moss)",
    culture: "var(--indigo)",
    misc: "var(--ink-mute)"
  };
  const cats = stats.byCategory.slice(0, 5);
  const total = cats.reduce((s, c) => s + c.value, 0);
  if (total === 0) return null;
  return /* @__PURE__ */ React.createElement(
    ChapterFrame,
    {
      title: isAr ? "أين تذهب ميزانيتك؟" : "How you spend",
      subtitle: isAr ? "تحليل المصروفات لكافة الرحلات" : "across all your travel"
    },
    /* @__PURE__ */ React.createElement("div", { style: { padding: "0 28px" } }, /* @__PURE__ */ React.createElement("div", { style: {
      display: "flex",
      height: 14,
      borderRadius: 8,
      overflow: "hidden",
      boxShadow: "inset 0 0 0 0.5px rgba(0,0,0,0.05)"
    } }, cats.map((c, i) => /* @__PURE__ */ React.createElement("div", { key: c.key, style: {
      flex: c.value,
      background: CAT_COLOR[c.key] || "var(--ink-mute)",
      boxShadow: i > 0 ? `inset ${window.isRTL ? "-" : ""}2px 0 0 var(--cream)` : "none"
    } }))), /* @__PURE__ */ React.createElement("div", { style: {
      marginTop: 14,
      display: "flex",
      flexDirection: "column",
      gap: 8
    } }, cats.map((c) => /* @__PURE__ */ React.createElement("div", { key: c.key, style: {
      display: "flex",
      alignItems: "baseline",
      gap: 10,
      flexDirection: "row"
    } }, /* @__PURE__ */ React.createElement("span", { style: {
      width: 9,
      height: 9,
      borderRadius: 3,
      background: CAT_COLOR[c.key] || "var(--ink-mute)",
      flexShrink: 0,
      transform: "translateY(1px)"
    } }), /* @__PURE__ */ React.createElement("span", { style: {
      flex: 1,
      fontSize: 13.5,
      color: "var(--ink)",
      textAlign: "start"
    } }, t(c.key) || c.key), /* @__PURE__ */ React.createElement("span", { className: "mono", style: {
      fontSize: 13,
      fontWeight: 600,
      color: "var(--ink)",
      fontVariantNumeric: "tabular-nums"
    } }, fmt(c.value)), /* @__PURE__ */ React.createElement("span", { className: "mono", style: {
      fontSize: 12,
      color: "var(--ink-mute)",
      minWidth: 32,
      textAlign: "end",
      fontVariantNumeric: "tabular-nums"
    } }, Math.round(c.pct), "%")))))
  );
}
function MonthSparkline({ byMonth }) {
  const isAr = !!window.isRTL;
  const maxVal = Math.max(...byMonth.map((m) => m.spent || 0), 1);
  const now = /* @__PURE__ */ new Date();
  const isCurrent = (m) => m.year === now.getFullYear() && m.month === now.getMonth();
  const heightOf = (m) => m.spent > 0 ? Math.max(Math.sqrt(m.spent / maxVal) * 100, 8) : 4;
  const monthShort = (m) => new Date(2e3, m.month, 1).toLocaleDateString(isAr ? "ar" : "en", { month: "short" });
  const busiest = byMonth.reduce((m, x) => (x.spent || 0) > ((m == null ? void 0 : m.spent) || 0) ? x : m, null);
  return /* @__PURE__ */ React.createElement(
    ChapterFrame,
    {
      title: isAr ? "مواسم السفر والترحال" : "When you travel",
      subtitle: isAr ? "تفاصيل النشاط خلال آخر 12 شهراً" : "last 12 months"
    },
    /* @__PURE__ */ React.createElement("div", { style: { padding: "0 26px" } }, /* @__PURE__ */ React.createElement("div", { style: { position: "relative", height: 40 } }, /* @__PURE__ */ React.createElement("div", { style: {
      display: "flex",
      alignItems: "flex-end",
      gap: 4,
      height: "100%"
    } }, byMonth.map((m) => {
      const h = heightOf(m);
      const cur = isCurrent(m);
      return /* @__PURE__ */ React.createElement("div", { key: m.key, style: {
        flex: 1,
        height: "100%",
        display: "flex",
        alignItems: "flex-end",
        minWidth: 0
      } }, /* @__PURE__ */ React.createElement("div", { style: {
        width: "100%",
        height: `${h}%`,
        background: m.spent === 0 ? "var(--hairline-2)" : cur ? "var(--clay)" : "var(--ink-soft)",
        borderRadius: "2px 2px 0 0",
        transition: "background 200ms"
      } }));
    })), /* @__PURE__ */ React.createElement("div", { style: {
      position: "absolute",
      left: 0,
      right: 0,
      bottom: 0,
      height: 0.5,
      background: "var(--hairline)"
    } })), /* @__PURE__ */ React.createElement("div", { style: {
      display: "flex",
      gap: 4,
      marginTop: 6
    } }, byMonth.map((m) => /* @__PURE__ */ React.createElement("div", { key: m.key, style: {
      flex: 1,
      textAlign: "center",
      minWidth: 0,
      fontSize: 9.5,
      fontFamily: "var(--mono)",
      color: isCurrent(m) ? "var(--clay-deep)" : "var(--ink-mute)",
      fontWeight: isCurrent(m) ? 600 : 500,
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis"
    } }, monthShort(m)))), busiest && busiest.spent > 0 && /* @__PURE__ */ React.createElement("div", { style: {
      marginTop: 14,
      fontSize: 12.5,
      color: "var(--ink-soft)",
      textAlign: "center"
    } }, isAr ? "الشهر الأنشط" : "Busiest", ":", " ", /* @__PURE__ */ React.createElement("span", { style: { color: "var(--ink)", fontWeight: 600 } }, monthShort(busiest), " ", busiest.year), " · ", /* @__PURE__ */ React.createElement("span", { className: "mono", style: { color: "var(--ink-soft)", fontWeight: 500 } }, window.fmtMoney(busiest.spent, { in: "home" }))))
  );
}
function TripList({ trips, year, goTrip }) {
  const isAr = !!window.isRTL;
  const fmt = (n) => window.fmtMoney(n, { in: "home" });
  const monthDay = (iso) => {
    if (!iso) return "—";
    const d = new Date(iso);
    return d.toLocaleDateString(isAr ? "ar" : "en", { month: "short", day: "numeric" });
  };
  return /* @__PURE__ */ React.createElement(
    ChapterFrame,
    {
      title: isAr ? `حصاد رحلات عام ${year}` : `Trips in ${year}`,
      subtitle: isAr ? `خضت فيها ${window.arPlural(trips.length, { one: "رحلة واحدة", two: "رحلتين", few: `${trips.length} رحلات`, many: `${trips.length} رحلة`, other: `${trips.length} رحلة` })}` : `${trips.length} ${trips.length === 1 ? "trip" : "trips"}`
    },
    /* @__PURE__ */ React.createElement("div", { style: {
      padding: "0 22px",
      display: "flex",
      flexDirection: "column"
    } }, trips.map((tr, i) => {
      const dateRange = tr.startDate && tr.endDate ? `${monthDay(tr.startDate)} – ${monthDay(tr.endDate)}` : "—";
      return /* @__PURE__ */ React.createElement(
        "button",
        {
          key: tr.id,
          onClick: () => goTrip == null ? void 0 : goTrip(tr.id),
          "aria-label": isAr ? `فتح تفاصيل ${tr.title}` : `Open ${tr.title}`,
          style: {
            all: "unset",
            cursor: "pointer",
            width: "100%",
            boxSizing: "border-box",
            display: "grid",
            gridTemplateColumns: "1fr auto",
            gap: 12,
            alignItems: "baseline",
            padding: "14px 0",
            borderTop: i > 0 ? "0.5px solid var(--hairline)" : "none"
          }
        },
        /* @__PURE__ */ React.createElement("div", { style: { minWidth: 0 } }, /* @__PURE__ */ React.createElement("div", { className: "serif-italic", style: {
          fontSize: 18,
          color: "var(--ink)",
          lineHeight: 1.2,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap"
        } }, tr.title), /* @__PURE__ */ React.createElement("div", { style: {
          marginTop: 3,
          fontSize: 12,
          color: "var(--ink-mute)",
          display: "flex",
          alignItems: "center",
          gap: 6,
          flexDirection: "row"
        } }, /* @__PURE__ */ React.createElement("span", null, dateRange), /* @__PURE__ */ React.createElement("span", null, "·"), /* @__PURE__ */ React.createElement("span", { className: "mono", style: { fontVariantNumeric: "tabular-nums" } }, isAr ? window.arPlural(tr.dur, { one: "يوم واحد", two: "يومان", few: `${tr.dur} أيام`, many: `${tr.dur} يوماً`, other: `${tr.dur} يوماً` }) : `${tr.dur} ${tr.dur === 1 ? "day" : "days"}`))),
        /* @__PURE__ */ React.createElement("div", { className: "mono", style: {
          fontSize: 15,
          fontWeight: 600,
          color: "var(--ink)",
          fontVariantNumeric: "tabular-nums",
          textAlign: "end"
        } }, window.fmtTripMoney(tr.spent, tr))
      );
    }))
  );
}
function PreviousYears({ years }) {
  const isAr = !!window.isRTL;
  const fmt = (n) => window.fmtMoney(n, { in: "home" });
  return /* @__PURE__ */ React.createElement(ChapterFrame, { title: isAr ? "أرشيف السنوات السابقة" : "Previous years" }, /* @__PURE__ */ React.createElement("div", { style: {
    padding: "0 22px",
    display: "flex",
    flexDirection: "column"
  } }, years.map((y, i) => /* @__PURE__ */ React.createElement("div", { key: y.year, style: {
    display: "flex",
    alignItems: "baseline",
    justifyContent: "space-between",
    gap: 12,
    padding: "12px 0",
    borderTop: i > 0 ? "0.5px solid var(--hairline)" : "none",
    flexDirection: "row"
  } }, /* @__PURE__ */ React.createElement("div", { style: {
    fontSize: 16,
    fontWeight: 600,
    color: "var(--ink)",
    fontVariantNumeric: "tabular-nums",
    letterSpacing: "-0.01em"
  } }, y.year), /* @__PURE__ */ React.createElement("div", { style: {
    flex: 1,
    textAlign: "end",
    fontSize: 12.5,
    color: "var(--ink-mute)"
  } }, isAr ? `شملت ${window.arPlural(y.trips || 0, { zero: "لا توجد رحلات", one: "رحلة واحدة", two: "رحلتين", few: `${y.trips} رحلات`, many: `${y.trips} رحلة`, other: `${y.trips} رحلة` })}` : `${y.trips || 0} ${(y.trips || 0) === 1 ? "trip" : "trips"}`, " · ", isAr ? "بإجمالي " : "", /* @__PURE__ */ React.createElement("span", { className: "mono", style: {
    color: "var(--ink-soft)",
    fontWeight: 600,
    fontVariantNumeric: "tabular-nums"
  } }, fmt(y.spent)))))));
}
function LedgerFooter({ stats }) {
  const isAr = !!window.isRTL;
  const fmt = (n) => window.fmtMoney(n, { in: "home" });
  return /* @__PURE__ */ React.createElement("div", { style: {
    padding: "48px 22px 24px",
    textAlign: "center"
  } }, /* @__PURE__ */ React.createElement("div", { className: "wordmark", style: {
    fontSize: 28,
    color: "var(--ink-soft)",
    lineHeight: 1
  } }, "voyage"), /* @__PURE__ */ React.createElement("div", { style: {
    marginTop: 10,
    fontSize: 11.5,
    color: "var(--ink-mute)",
    lineHeight: 1.6
  } }, isAr ? /* @__PURE__ */ React.createElement(React.Fragment, null, "السجل الكلي للترحال: ", window.arPlural(stats.totalTrips, { one: "رحلة واحدة", two: "رحلتان", few: `${stats.totalTrips} رحلات`, many: `${stats.totalTrips} رحلة`, other: `${stats.totalTrips} رحلة` }), " · شملت ", window.arPlural(stats.countries, { one: "وجهة دولية واحدة", two: "وجهتين دوليتين", few: `${stats.countries} وجهات دولية`, many: `${stats.countries} وجهة دولية`, other: `${stats.countries} وجهة دولية` }), /* @__PURE__ */ React.createElement("br", null), "على مدار ", window.arPlural(stats.totalDays, { one: "يوم واحد", two: "يومين", few: `${stats.totalDays} أيام`, many: `${stats.totalDays} يوماً`, other: `${stats.totalDays} يوماً` }), " من السفر · بإجمالي إنفاق ", /* @__PURE__ */ React.createElement("span", { className: "mono" }, fmt(stats.totalSpentUSD))) : /* @__PURE__ */ React.createElement(React.Fragment, null, "Lifetime: ", stats.totalTrips, " ", stats.totalTrips === 1 ? "trip" : "trips", " · ", stats.countries, " ", stats.countries === 1 ? "country" : "countries", /* @__PURE__ */ React.createElement("br", null), stats.totalDays, " ", stats.totalDays === 1 ? "day" : "days", " of travel · ", /* @__PURE__ */ React.createElement("span", { className: "mono" }, fmt(stats.totalSpentUSD)))));
}
function ChapterFrame({ title, subtitle, children }) {
  return /* @__PURE__ */ React.createElement("div", { style: { padding: "32px 0 0" } }, /* @__PURE__ */ React.createElement("div", { style: {
    padding: "0 22px 16px",
    textAlign: "center"
  } }, /* @__PURE__ */ React.createElement("div", { style: {
    fontSize: 13,
    fontWeight: 600,
    color: "var(--ink)",
    letterSpacing: "-0.01em"
  } }, title), subtitle && /* @__PURE__ */ React.createElement("div", { style: {
    marginTop: 3,
    fontSize: 11,
    color: "var(--ink-mute)"
  } }, subtitle)), children);
}
function LedgerDivider() {
  return /* @__PURE__ */ React.createElement("div", { style: {
    display: "flex",
    justifyContent: "center",
    padding: "0 22px",
    marginTop: 32
  } }, /* @__PURE__ */ React.createElement("div", { style: {
    width: "min(120px, 30%)",
    height: 0.5,
    background: "var(--ink-mute)",
    opacity: 0.4
  } }));
}
window.ScreenInsights = ScreenInsights;
function AppToggle({ on, onChange }) {
  return /* @__PURE__ */ React.createElement("button", { onClick: () => onChange == null ? void 0 : onChange(!on), style: {
    width: 40,
    height: 24,
    borderRadius: 999,
    background: on ? "var(--ink)" : "var(--sand-deep)",
    padding: 2,
    transition: "background 200ms",
    position: "relative",
    flexShrink: 0
  } }, /* @__PURE__ */ React.createElement("div", { style: {
    width: 20,
    height: 20,
    borderRadius: "50%",
    background: "#fff",
    boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
    transform: on ? `translateX(${window.isRTL ? -16 : 16}px)` : "translateX(0)",
    transition: "transform 220ms cubic-bezier(.2,.8,.2,1)"
  } }));
}
function ScreenAppSettings({ go, onSignOut, dark = false, lang = "en", onDarkToggle, onLangChange }) {
  var _a, _b, _c, _d, _e;
  const [profile, setProfile] = React.useState(((_a = window.ACCOUNT) == null ? void 0 : _a.profile) || null);
  const [email, setEmail] = React.useState(((_b = window.ACCOUNT) == null ? void 0 : _b.email) || "");
  const [stats, setStats] = React.useState(window.LIFETIME_STATS || window.LIFETIME_STATS_LKG || null);
  const [activityOn, setActivityOn] = React.useState(((_c = window.ACCOUNT) == null ? void 0 : _c.activity) !== false);
  const pushAvailable = !!((_d = window.pushSupported) == null ? void 0 : _d.call(window));
  const [pushState, setPushState] = React.useState(((_e = window.ACCOUNT) == null ? void 0 : _e.pushState) || "off");
  React.useEffect(() => {
    var _a2;
    if (!pushAvailable) return;
    (_a2 = window.pushStatus) == null ? void 0 : _a2.call(window).then((s) => {
      setPushState(s);
      window.ACCOUNT = { ...window.ACCOUNT || {}, pushState: s };
    }).catch(() => {
    });
  }, [pushAvailable]);
  const togglePush = async () => {
    var _a2, _b2, _c2;
    if (pushState === "busy") return;
    const goingOn = pushState !== "on";
    setPushState("busy");
    try {
      const next = goingOn ? await window.pushSubscribe() : await window.pushUnsubscribe();
      setPushState(next);
      window.ACCOUNT = { ...window.ACCOUNT || {}, pushState: next };
      if (goingOn) (_a2 = window.toast) == null ? void 0 : _a2.call(window, window.isRTL ? "تم تفعيل تذكيرات الرحلة" : "Trip reminders on", "success");
    } catch (e) {
      setPushState(await (((_b2 = window.pushStatus) == null ? void 0 : _b2.call(window)) || "off"));
      (_c2 = window.toast) == null ? void 0 : _c2.call(window, e.message || "Could not change reminders", "error");
    }
  };
  const toggleActivity = async () => {
    var _a2;
    const next = !activityOn;
    setActivityOn(next);
    window.ACCOUNT = { ...window.ACCOUNT || {}, activity: next };
    try {
      const { error } = await window.sb.from("profiles").update({ notify_activity: next }).eq("id", window.currentUserId);
      if (error) throw error;
    } catch (e) {
      setActivityOn(!next);
      window.ACCOUNT = { ...window.ACCOUNT || {}, activity: !next };
      (_a2 = window.toast) == null ? void 0 : _a2.call(window, e.message || "Could not change setting", "error");
    }
  };
  React.useEffect(() => {
    var _a2;
    const uid = window.currentUserId;
    if (!uid || !window.sb) return;
    window.sb.from("profiles").select("*").eq("id", uid).single().then(({ data }) => {
      if (!data) return;
      const p = { id: data.id, name: data.name, initials: data.initials, hue: data.avatar_hue || 35 };
      setProfile(p);
      const act = data.notify_activity !== false;
      setActivityOn(act);
      window.ACCOUNT = { ...window.ACCOUNT || {}, profile: p, activity: act };
    }).catch(() => {
    });
    window.sb.auth.getUser().then(({ data }) => {
      var _a3;
      if (!((_a3 = data == null ? void 0 : data.user) == null ? void 0 : _a3.email)) return;
      setEmail(data.user.email);
      window.ACCOUNT = { ...window.ACCOUNT || {}, email: data.user.email };
    }).catch(() => {
    });
    if (!window.LIFETIME_STATS) {
      (_a2 = window.loadLifetimeStats) == null ? void 0 : _a2.call(window).then((s) => setStats(s || null)).catch(() => {
      });
    }
  }, []);
  const me = profile || { id: window.currentUserId || "me", name: "You", initials: "ME", hue: 35 };
  const stat = stats || { totalTrips: 0, totalDays: 0, countries: 0 };
  return /* @__PURE__ */ React.createElement("div", { "data-screen-label": "App Settings", style: {
    background: "var(--cream)",
    minHeight: "100%",
    paddingBottom: 100
  } }, /* @__PURE__ */ React.createElement(LargeTitleHeader, { title: t("account") }), /* @__PURE__ */ React.createElement("div", { style: { padding: "0 14px 14px" } }, /* @__PURE__ */ React.createElement("div", { style: {
    position: "relative",
    borderRadius: 28,
    padding: window.isRTL ? "22px 100px 20px 22px" : "22px 22px 20px 100px",
    background: "linear-gradient(140deg, oklch(0.32 0.04 30) 0%, oklch(0.20 0.04 280) 100%)",
    color: "#fff",
    boxShadow: "var(--shadow-card)",
    overflow: "visible"
  } }, /* @__PURE__ */ React.createElement("div", { style: {
    position: "absolute",
    top: "50%",
    insetInlineStart: -10,
    transform: "translateY(-50%) rotate(-4deg)",
    width: 86,
    height: 86,
    borderRadius: 22,
    overflow: "hidden",
    background: `linear-gradient(140deg, oklch(0.78 0.09 ${me.hue}) 0%, oklch(0.50 0.13 ${me.hue}) 100%)`,
    display: "grid",
    placeItems: "center",
    color: "#fff",
    fontFamily: "var(--sans)",
    fontWeight: 600,
    fontSize: 32,
    boxShadow: "0 10px 22px rgba(0,0,0,0.4)",
    border: "4px solid var(--cream)"
  } }, me.initials), /* @__PURE__ */ React.createElement("div", { style: { position: "relative" } }, /* @__PURE__ */ React.createElement("div", { className: "serif", style: { fontSize: 22, lineHeight: 1.05 } }, me.name), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11.5, opacity: 0.78, marginTop: 2 } }, email || (window.isRTL ? "جارٍ تحميل البيانات…" : "Loading…")), /* @__PURE__ */ React.createElement("div", { style: {
    marginTop: 10,
    fontSize: 12,
    color: "rgba(255,251,244,0.78)"
  } }, window.isRTL ? /* @__PURE__ */ React.createElement(React.Fragment, null, "سجل الترحال: خضت ", /* @__PURE__ */ React.createElement(ProfileNum, null, window.arPlural(stat.totalTrips, { one: "رحلة واحدة", two: "رحلتين", few: `${stat.totalTrips} رحلات`, many: `${stat.totalTrips} رحلة`, other: `${stat.totalTrips} رحلة` })), " · ", "على مدار ", /* @__PURE__ */ React.createElement(ProfileNum, null, window.arPlural(stat.totalDays, { one: "يوم واحد", two: "يومين", few: `${stat.totalDays} أيام`, many: `${stat.totalDays} يوماً`, other: `${stat.totalDays} يوماً` })), " · ", "شملت ", /* @__PURE__ */ React.createElement(ProfileNum, null, window.arPlural(stat.countries, { one: "دولة واحدة", two: "دولتين", few: `${stat.countries} دول ووجهات`, many: `${stat.countries} دولة`, other: `${stat.countries} دولة` }))) : /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(ProfileNum, null, stat.totalTrips), " ", stat.totalTrips === 1 ? "trip" : "trips", " · ", /* @__PURE__ */ React.createElement(ProfileNum, null, stat.totalDays), " ", stat.totalDays === 1 ? "day" : "days", " · ", /* @__PURE__ */ React.createElement(ProfileNum, null, stat.countries), " ", stat.countries === 1 ? "country" : "countries"))))), /* @__PURE__ */ React.createElement(InstallCard, null), /* @__PURE__ */ React.createElement("div", { style: { padding: "12px 14px 0" } }, /* @__PURE__ */ React.createElement(SectionLabel, null, t("preferences")), /* @__PURE__ */ React.createElement("div", { style: {
    background: "var(--cream-2)",
    borderRadius: 22,
    margin: "0 8px",
    overflow: "hidden",
    border: "0.5px solid var(--hairline)"
  } }, /* @__PURE__ */ React.createElement("div", { style: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    flexDirection: "row",
    padding: "13px 16px"
  } }, /* @__PURE__ */ React.createElement("div", { style: {
    width: 30,
    height: 30,
    borderRadius: 9,
    display: "grid",
    placeItems: "center",
    background: "var(--cream)",
    border: "0.5px solid var(--hairline)"
  } }, /* @__PURE__ */ React.createElement(IconSun, { size: 16, stroke: "var(--ink)" })), /* @__PURE__ */ React.createElement("div", { style: { flex: 1, fontSize: 13.5, color: "var(--ink)", textAlign: "start" } }, t("appearance")), /* @__PURE__ */ React.createElement(AppToggle, { on: dark, onChange: onDarkToggle })), /* @__PURE__ */ React.createElement("div", { style: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    flexDirection: "row",
    padding: "13px 16px",
    borderTop: "0.5px solid var(--hairline)"
  } }, /* @__PURE__ */ React.createElement("div", { style: {
    width: 30,
    height: 30,
    borderRadius: 9,
    display: "grid",
    placeItems: "center",
    background: "var(--cream)",
    border: "0.5px solid var(--hairline)",
    fontSize: 13,
    fontWeight: 600,
    color: "var(--ink)"
  } }, "Aع"), /* @__PURE__ */ React.createElement("div", { style: { flex: 1, fontSize: 13.5, color: "var(--ink)", textAlign: "start" } }, window.isRTL ? "لغة الواجهة" : "Language"), /* @__PURE__ */ React.createElement("div", { style: {
    display: "inline-flex",
    padding: 3,
    background: "var(--sand)",
    borderRadius: 999,
    flexDirection: "row"
  } }, ["en", "ar"].map((l) => /* @__PURE__ */ React.createElement("button", { key: l, onClick: () => onLangChange == null ? void 0 : onLangChange(l), style: {
    padding: "5px 14px",
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 500,
    background: lang === l ? "var(--ink)" : "transparent",
    color: lang === l ? "var(--cream)" : "var(--ink-soft)",
    transition: "all 180ms"
  } }, l === "en" ? "EN" : "عر")))), pushAvailable && /* @__PURE__ */ React.createElement("div", { style: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    flexDirection: "row",
    padding: "13px 16px",
    borderTop: "0.5px solid var(--hairline)"
  } }, /* @__PURE__ */ React.createElement("div", { style: {
    width: 30,
    height: 30,
    borderRadius: 9,
    display: "grid",
    placeItems: "center",
    background: "var(--cream)",
    border: "0.5px solid var(--hairline)"
  } }, /* @__PURE__ */ React.createElement(IconBell, { size: 16, stroke: "var(--ink)" })), /* @__PURE__ */ React.createElement("div", { style: { flex: 1, textAlign: "start" } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13.5, color: "var(--ink)" } }, window.isRTL ? "تذكيرات الرحلة" : "Trip reminders"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: "var(--ink-mute)", marginTop: 1 } }, pushState === "denied" ? window.isRTL ? "الإشعارات محظورة في إعدادات النظام" : "Notifications blocked in system settings" : window.isRTL ? "بطاقة الصعود وتسجيل الدخول قبل موعدها بـ 24 ساعة" : "Boarding pass & check-in 24h before")), /* @__PURE__ */ React.createElement(AppToggle, { on: pushState === "on", onChange: togglePush })), pushAvailable && pushState === "on" && /* @__PURE__ */ React.createElement("div", { style: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    flexDirection: "row",
    padding: "13px 16px",
    borderTop: "0.5px solid var(--hairline)"
  } }, /* @__PURE__ */ React.createElement("div", { style: {
    width: 30,
    height: 30,
    borderRadius: 9,
    display: "grid",
    placeItems: "center",
    background: "var(--cream)",
    border: "0.5px solid var(--hairline)"
  } }, /* @__PURE__ */ React.createElement(IconUsers, { size: 16, stroke: "var(--ink)" })), /* @__PURE__ */ React.createElement("div", { style: { flex: 1, textAlign: "start" } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13.5, color: "var(--ink)" } }, window.isRTL ? "نشاط الرحلة" : "Trip activity"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: "var(--ink-mute)", marginTop: 1 } }, window.isRTL ? "عند إضافة الرفاق مصاريف أو مستندات لرحلة مشتركة" : "When crew add expenses or documents to a shared trip")), /* @__PURE__ */ React.createElement(AppToggle, { on: activityOn, onChange: toggleActivity })), /* @__PURE__ */ React.createElement(ProfileEditRows, { me }))), /* @__PURE__ */ React.createElement("div", { style: { padding: "18px 14px 0" } }, /* @__PURE__ */ React.createElement(SectionLabel, null, t("privacy")), /* @__PURE__ */ React.createElement("div", { style: {
    background: "oklch(0.50 0.08 155 / 0.08)",
    borderRadius: 22,
    margin: "0 8px",
    padding: "14px 16px",
    border: "0.5px dashed oklch(0.50 0.08 155 / 0.35)"
  } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "flex-start", gap: 12, flexDirection: "row" } }, /* @__PURE__ */ React.createElement("div", { style: {
    width: 32,
    height: 32,
    borderRadius: 10,
    background: "var(--moss)",
    display: "grid",
    placeItems: "center",
    flexShrink: 0
  } }, /* @__PURE__ */ React.createElement(IconUsers, { size: 16, stroke: "#fff" })), /* @__PURE__ */ React.createElement("div", { style: { flex: 1 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, fontWeight: 500, color: "var(--moss)" } }, t("tripScopedCollab")), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11.5, color: "var(--ink-soft)", marginTop: 3, lineHeight: 1.45, textAlign: "start" } }, t("tripScopedSub")))))), /* @__PURE__ */ React.createElement("div", { style: { padding: "18px 14px 0" } }, /* @__PURE__ */ React.createElement(SectionLabel, null, t("account")), /* @__PURE__ */ React.createElement("div", { style: {
    background: "var(--cream-2)",
    borderRadius: 22,
    margin: "0 8px",
    overflow: "hidden",
    border: "0.5px solid var(--hairline)"
  } }, /* @__PURE__ */ React.createElement(ActionRow, { onClick: () => {
    var _a2;
    (_a2 = window.actionSheet) == null ? void 0 : _a2.call(window, {
      title: window.isRTL ? "إعادة تعيين وإصلاح التطبيق" : "Reset app cache",
      message: window.isRTL ? "بياناتك المخزنة في السحابة بأمان تام. سيُعاد تحميل التطبيق فقط لإصلاح أي مشاكل ظاهرية." : "Your cloud data is safe. The app will reload.",
      actions: [
        { label: window.isRTL ? "متابعة وإعادة التعيين" : "Reset", destructive: true, onPress: async () => {
          try {
            if ("caches" in window) {
              const names = await caches.keys();
              await Promise.all(names.map((n) => caches.delete(n)));
            }
            if ("serviceWorker" in navigator) {
              const regs = await navigator.serviceWorker.getRegistrations();
              await Promise.all(regs.map((r) => r.unregister()));
            }
            try {
              sessionStorage.clear();
            } catch (_) {
            }
          } finally {
            location.reload();
          }
        } }
      ]
    });
  }, icon: /* @__PURE__ */ React.createElement(IconGear, { size: 17, stroke: "var(--ink)" }), label: window.isRTL ? "إعادة تعيين وإصلاح التطبيق" : "Reset app cache", sub: window.isRTL ? "استخدم هذا الإجراء إذا واجهت أي مشاكل في الواجهة أو الأداء" : "Clear cache & reload if something looks broken" }), /* @__PURE__ */ React.createElement(ActionRow, { onClick: () => {
    var _a2;
    (_a2 = window.actionSheet) == null ? void 0 : _a2.call(window, {
      title: t("signOut"),
      message: window.isRTL ? "سيتم تسجيل خروجك من الحساب. يمكنك العودة وتسجيل الدخول في أي وقت." : "You'll be signed out. You can sign back in anytime.",
      actions: [
        { label: t("signOut"), destructive: true, onPress: () => onSignOut == null ? void 0 : onSignOut() }
      ]
    });
  }, icon: /* @__PURE__ */ React.createElement("span", { className: "icon-flip" }, /* @__PURE__ */ React.createElement(IconBack, { size: 17, stroke: "var(--ink)" })), label: t("signOut"), sub: email ? `${me.name.split(" ")[0]} · ${email}` : me.name.split(" ")[0] }), /* @__PURE__ */ React.createElement(ActionRow, { icon: /* @__PURE__ */ React.createElement(IconTrash, { size: 17, stroke: "var(--clay-deep)" }), labelColor: "var(--clay-deep)", label: t("deleteAccount"), sub: t("deleteAccountSub"), last: true }))), /* @__PURE__ */ React.createElement("div", { style: { textAlign: "center", padding: "32px 0 20px", color: "var(--ink-mute)" } }, /* @__PURE__ */ React.createElement("div", { className: "serif-italic", style: { fontSize: 18 } }, "voyage"), /* @__PURE__ */ React.createElement("div", { className: "mono", style: { fontSize: 10.5, marginTop: 6 } }, window.isRTL ? "الإصدار 1.0.0 · صُنع بكل حب في مكة" : "v 1.0.0 · Built in Makkah")));
}
function InstallCard() {
  var _a, _b, _c;
  const [canInstall, setCanInstall] = React.useState(!!window._deferredInstallPrompt);
  const [showIOSHelp, setShowIOSHelp] = React.useState(false);
  React.useEffect(() => {
    const handler = () => setCanInstall(true);
    window.addEventListener("voyage:install-available", handler);
    return () => window.removeEventListener("voyage:install-available", handler);
  }, []);
  const standalone = ((_a = window.matchMedia) == null ? void 0 : _a.call(window, "(display-mode: standalone)").matches) || ((_b = window.isIOSStandalone) == null ? void 0 : _b.call(window));
  if (standalone) return null;
  const onIOS = (_c = window.isIOS) == null ? void 0 : _c.call(window);
  if (!canInstall && !onIOS) return null;
  const handleInstall = async () => {
    if (window._deferredInstallPrompt) {
      window._deferredInstallPrompt.prompt();
      const { outcome } = await window._deferredInstallPrompt.userChoice;
      if (outcome === "accepted") window._deferredInstallPrompt = null;
      setCanInstall(false);
    } else if (onIOS) {
      setShowIOSHelp(true);
    }
  };
  return /* @__PURE__ */ React.createElement("div", { style: { padding: "12px 14px 0" } }, /* @__PURE__ */ React.createElement("div", { style: {
    margin: "0 8px",
    borderRadius: 22,
    padding: "14px 16px",
    background: "linear-gradient(135deg, var(--clay) 0%, var(--clay-deep) 100%)",
    color: "#fff",
    boxShadow: "var(--shadow-md)",
    display: "flex",
    alignItems: "center",
    gap: 12,
    flexDirection: "row"
  } }, /* @__PURE__ */ React.createElement("div", { style: {
    width: 40,
    height: 40,
    borderRadius: 12,
    flexShrink: 0,
    background: "rgba(255,255,255,0.18)",
    display: "grid",
    placeItems: "center",
    fontSize: 20
  } }, "✦"), /* @__PURE__ */ React.createElement("div", { style: { flex: 1, minWidth: 0 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13.5, fontWeight: 600 } }, window.isRTL ? "ثبّت تطبيق Voyage على شاشتك الرئيسية" : "Install Voyage on your home screen"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11.5, opacity: 0.88, marginTop: 2 } }, window.isRTL ? "وصول أسرع وعمل كامل بدون اتصال بالإنترنت" : "Faster access · works offline")), /* @__PURE__ */ React.createElement("button", { onClick: handleInstall, style: {
    padding: "8px 14px",
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 600,
    background: "#fff",
    color: "var(--clay-deep)",
    flexShrink: 0
  } }, window.isRTL ? "تثبيت التطبيق الآن" : "Install")), showIOSHelp && /* @__PURE__ */ React.createElement("div", { style: {
    margin: "8px 8px 0",
    padding: "12px 14px",
    borderRadius: 14,
    background: "var(--cream-2)",
    border: "0.5px solid var(--hairline)",
    fontSize: 12.5,
    color: "var(--ink-soft)",
    lineHeight: 1.5
  } }, window.isRTL ? /* @__PURE__ */ React.createElement(React.Fragment, null, "على iOS: اضغط زر المشاركة ", /* @__PURE__ */ React.createElement("b", null, "⎙"), " في Safari ثم اختر ", /* @__PURE__ */ React.createElement("b", null, "«إضافة إلى الشاشة الرئيسية»"), ".") : /* @__PURE__ */ React.createElement(React.Fragment, null, "On iOS: tap the Share button ", /* @__PURE__ */ React.createElement("b", null, "⎙"), " in Safari, then choose ", /* @__PURE__ */ React.createElement("b", null, '"Add to Home Screen"'), "."), /* @__PURE__ */ React.createElement("button", { onClick: () => setShowIOSHelp(false), style: {
    display: "block",
    marginTop: 8,
    color: "var(--clay-deep)",
    fontWeight: 600,
    fontSize: 11.5
  } }, window.isRTL ? "حسناً، فهمت" : "Got it")));
}
function ProfileNum({ children }) {
  return /* @__PURE__ */ React.createElement("span", { className: "mono", style: {
    fontWeight: 700,
    color: "#fff",
    letterSpacing: "-0.005em"
  } }, children);
}
function ProfileEditRows({ me }) {
  var _a, _b;
  const [editing, setEditing] = React.useState(null);
  const [currency, setCurrency] = React.useState(((_a = window.ACCOUNT) == null ? void 0 : _a.currency) || window.USER_DEFAULT_CURRENCY || "USD");
  const [home, setHome] = React.useState(((_b = window.ACCOUNT) == null ? void 0 : _b.home) || "");
  const [saving, setSaving] = React.useState(false);
  React.useEffect(() => {
    if (!window.sb || !window.currentUserId) return;
    window.sb.from("profiles").select("default_currency, home_base").eq("id", window.currentUserId).single().then(({ data }) => {
      if (!data) return;
      const cur = (data.default_currency || "USD").trim();
      const hb = data.home_base || "";
      setCurrency(cur);
      setHome(hb);
      window.ACCOUNT = { ...window.ACCOUNT || {}, currency: cur, home: hb };
    }).catch(() => {
    });
  }, []);
  const save = async (fields) => {
    var _a2, _b2, _c;
    setSaving(true);
    try {
      const { error } = await window.sb.from("profiles").update(fields).eq("id", window.currentUserId);
      if (error) throw error;
      if (fields.default_currency) {
        window.USER_DEFAULT_CURRENCY = fields.default_currency.trim().toUpperCase();
      }
      window.ACCOUNT = {
        ...window.ACCOUNT || {},
        ...fields.default_currency != null ? { currency: fields.default_currency.trim() } : {},
        ..."home_base" in fields ? { home: fields.home_base || "" } : {}
      };
      (_a2 = window.notifyDataChange) == null ? void 0 : _a2.call(window);
      (_b2 = window.toast) == null ? void 0 : _b2.call(window, window.isRTL ? "تم حفظ التعديلات بنجاح" : "Saved", "success");
      setEditing(null);
    } catch (err) {
      (_c = window.toast) == null ? void 0 : _c.call(window, err.message || "Save failed", "error");
    } finally {
      setSaving(false);
    }
  };
  const CURRENCIES = ["USD", "SAR", "EUR", "GBP", "JPY", "AED", "EGP", "MAD", "TRY", "INR", "CHF", "KWD", "BHD"];
  const rowStyle = {
    display: "flex",
    alignItems: "center",
    gap: 12,
    flexDirection: "row",
    padding: "13px 16px",
    width: "100%",
    textAlign: "start",
    borderTop: "0.5px solid var(--hairline)"
  };
  const iconBox = {
    width: 30,
    height: 30,
    borderRadius: 9,
    display: "grid",
    placeItems: "center",
    background: "var(--cream)",
    border: "0.5px solid var(--hairline)"
  };
  const inputStyle = {
    width: "100%",
    padding: "10px 12px",
    borderRadius: 10,
    border: "0.5px solid var(--hairline-2)",
    background: "var(--cream)",
    color: "var(--ink)",
    fontSize: 14,
    outline: "none",
    textAlign: "start"
  };
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("button", { onClick: () => setEditing(editing === "currency" ? null : "currency"), style: rowStyle }, /* @__PURE__ */ React.createElement("div", { style: iconBox }, /* @__PURE__ */ React.createElement(IconWallet, { size: 16, stroke: "var(--ink)" })), /* @__PURE__ */ React.createElement("div", { style: { flex: 1, fontSize: 13.5, color: "var(--ink)" } }, t("defaultCurrency")), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 6, flexDirection: "row" } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 12.5, color: "var(--ink-mute)" } }, currency), /* @__PURE__ */ React.createElement("span", { style: { transform: editing === "currency" ? "rotate(90deg)" : "none", transition: "transform 200ms", display: "inline-block" } }, /* @__PURE__ */ React.createElement(IconChevron, { size: 13, stroke: "var(--ink-mute)" })))), editing === "currency" && /* @__PURE__ */ React.createElement("div", { style: { padding: "0 16px 14px", display: "flex", flexDirection: "column", gap: 8 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexWrap: "wrap", gap: 6 } }, CURRENCIES.map((c) => /* @__PURE__ */ React.createElement("button", { key: c, onClick: () => setCurrency(c), style: {
    padding: "6px 10px",
    borderRadius: 8,
    fontSize: 11.5,
    fontWeight: 500,
    background: currency === c ? "var(--ink)" : "var(--cream)",
    color: currency === c ? "var(--cream)" : "var(--ink-soft)",
    border: "0.5px solid var(--hairline)"
  } }, c))), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 8, marginTop: 2 } }, /* @__PURE__ */ React.createElement("button", { disabled: saving, onClick: () => save({ default_currency: currency }), style: {
    flex: 1,
    padding: "10px",
    borderRadius: 10,
    fontSize: 12.5,
    fontWeight: 600,
    background: saving ? "var(--ink-mute)" : "var(--ink)",
    color: "var(--cream)"
  } }, saving ? "…" : window.isRTL ? "حفظ" : "Save"), /* @__PURE__ */ React.createElement("button", { disabled: saving, onClick: () => setEditing(null), style: {
    padding: "10px 16px",
    borderRadius: 10,
    fontSize: 12.5,
    background: "var(--cream)",
    border: "0.5px solid var(--hairline-2)",
    color: "var(--ink-soft)"
  } }, window.isRTL ? "إلغاء" : "Cancel")))), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("button", { onClick: () => setEditing(editing === "home" ? null : "home"), style: rowStyle }, /* @__PURE__ */ React.createElement("div", { style: iconBox }, /* @__PURE__ */ React.createElement(IconCompass, { size: 16, stroke: "var(--ink)" })), /* @__PURE__ */ React.createElement("div", { style: { flex: 1, fontSize: 13.5, color: "var(--ink)" } }, t("homeBase")), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 6, flexDirection: "row" } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 12.5, color: "var(--ink-mute)" } }, home || (window.isRTL ? "لم تُحدد بعد" : "Not set")), /* @__PURE__ */ React.createElement("span", { style: { transform: editing === "home" ? "rotate(90deg)" : "none", transition: "transform 200ms", display: "inline-block" } }, /* @__PURE__ */ React.createElement(IconChevron, { size: 13, stroke: "var(--ink-mute)" })))), editing === "home" && /* @__PURE__ */ React.createElement("div", { style: { padding: "0 16px 14px", display: "flex", flexDirection: "column", gap: 8 } }, /* @__PURE__ */ React.createElement(
    "input",
    {
      value: home,
      onChange: (e) => setHome(e.target.value),
      placeholder: window.isRTL ? "مثلاً: مكة، الرياض، جدة" : "e.g. Makkah, Riyadh, Dubai",
      style: inputStyle
    }
  ), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 8, marginTop: 2 } }, /* @__PURE__ */ React.createElement("button", { disabled: saving, onClick: () => save({ home_base: home.trim() || null }), style: {
    flex: 1,
    padding: "10px",
    borderRadius: 10,
    fontSize: 12.5,
    fontWeight: 600,
    background: saving ? "var(--ink-mute)" : "var(--ink)",
    color: "var(--cream)"
  } }, saving ? "…" : window.isRTL ? "حفظ" : "Save"), /* @__PURE__ */ React.createElement("button", { disabled: saving, onClick: () => setEditing(null), style: {
    padding: "10px 16px",
    borderRadius: 10,
    fontSize: 12.5,
    background: "var(--cream)",
    border: "0.5px solid var(--hairline-2)",
    color: "var(--ink-soft)"
  } }, window.isRTL ? "إلغاء" : "Cancel")))));
}
Object.assign(window, { ScreenAppSettings, InstallCard, ProfileEditRows });
function ScreenHub({ go, openSheet, loading }) {
  var _a, _b, _c;
  const trip = window.TRIP;
  const dataReady = trip && ((_a = window.isTripDataReady) == null ? void 0 : _a.call(window, trip.id));
  if (loading || !trip || !dataReady) {
    return /* @__PURE__ */ React.createElement("div", { style: { background: "var(--cream)", minHeight: "100%" } }, /* @__PURE__ */ React.createElement(TripSkeleton, null));
  }
  const spent = ((_b = trip == null ? void 0 : trip.budget) == null ? void 0 : _b.spentUSD) || (window.EXPENSES || []).reduce((s, e) => s + (e.usd || 0), 0);
  const planned = ((_c = trip == null ? void 0 : trip.budget) == null ? void 0 : _c.plannedUSD) || 0;
  const pct = planned > 0 ? spent / planned * 100 : 0;
  const remaining = planned - spent;
  const fmtC = (usd) => window.fmtMoney(usd, { in: "home" });
  if (!trip) {
    return /* @__PURE__ */ React.createElement("div", { style: { background: "var(--cream)", minHeight: "100%", display: "flex", alignItems: "center", justifyContent: "center", paddingBottom: 100 } }, /* @__PURE__ */ React.createElement("div", { style: { textAlign: "center", padding: 32 } }, /* @__PURE__ */ React.createElement("div", { className: "serif", style: { fontSize: 20, color: "var(--ink-mute)" } }, window.isRTL ? "لا توجد رحلة نشطة حالياً" : "No active trip"), /* @__PURE__ */ React.createElement("button", { onClick: () => go("trips"), style: {
      marginTop: 14,
      padding: "10px 20px",
      borderRadius: 12,
      background: "var(--ink)",
      color: "var(--cream)",
      fontSize: 13.5
    } }, window.isRTL ? "← قائمة رحلاتي" : "My Trips →")));
  }
  return /* @__PURE__ */ React.createElement("div", { "data-screen-label": "01 Trip Hub", style: {
    background: "var(--cream)",
    minHeight: "100%",
    paddingBottom: 100
  } }, /* @__PURE__ */ React.createElement("div", { style: {
    position: "absolute",
    top: "max(60px, calc(env(safe-area-inset-top) + 14px))",
    left: 0,
    right: 0,
    zIndex: 30,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    padding: "0 18px"
  } }, /* @__PURE__ */ React.createElement("button", { onClick: () => go("trips"), className: "glass", style: {
    width: 38,
    height: 38,
    borderRadius: 999,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "var(--ink)"
  } }, /* @__PURE__ */ React.createElement("span", { className: "icon-flip" }, /* @__PURE__ */ React.createElement(IconBack, { size: 18 }))), /* @__PURE__ */ React.createElement("div", { className: "glass", style: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    flexDirection: "row",
    padding: "7px 14px",
    borderRadius: 999,
    color: "var(--ink)"
  } }, /* @__PURE__ */ React.createElement("span", { style: {
    width: 6,
    height: 6,
    borderRadius: 999,
    background: "var(--moss)",
    boxShadow: "0 0 6px var(--moss)"
  } }), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 12, fontWeight: 500 } }, t("dayLbl"), " ", trip.daysIn, " ", t("ofLbl"), " ", trip.daysTotal)), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 8, flexDirection: "row" } }, /* @__PURE__ */ React.createElement(
    "button",
    {
      className: "glass",
      style: btnGlass,
      onClick: () => openSheet("search"),
      "aria-label": window.isRTL ? "بحث في الرحلة" : "Search"
    },
    /* @__PURE__ */ React.createElement(IconSearch, { size: 18 })
  ), /* @__PURE__ */ React.createElement(
    "button",
    {
      className: "glass",
      style: btnGlass,
      onClick: () => openSheet("share"),
      "aria-label": t("inviteTheCrew")
    },
    /* @__PURE__ */ React.createElement(IconShare, { size: 18 })
  ))), /* @__PURE__ */ React.createElement("div", { style: { position: "relative", padding: "0 14px", paddingTop: 110 } }, /* @__PURE__ */ React.createElement("div", { style: {
    position: "relative",
    height: 330,
    borderRadius: 32,
    overflow: "hidden",
    boxShadow: "var(--shadow-lg)"
  } }, trip.coverUrl || trip.coverImageUrl ? /* @__PURE__ */ React.createElement("div", { style: {
    position: "absolute",
    inset: 0,
    backgroundImage: `url(${trip.coverUrl || trip.coverImageUrl})`,
    backgroundSize: "cover",
    backgroundPosition: "center"
  } }, /* @__PURE__ */ React.createElement("div", { style: { position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.45) 0%, transparent 55%)" } })) : /* @__PURE__ */ React.createElement(CoverArt, { kind: trip.cover || "kyoto" }), trip.countries && trip.countries.length > 0 && /* @__PURE__ */ React.createElement("div", { style: {
    position: "absolute",
    top: 18,
    insetInlineStart: 18,
    display: "flex",
    alignItems: "center",
    gap: 6,
    flexDirection: "row",
    maxWidth: "60%",
    padding: "5px 11px 5px 9px",
    borderRadius: 999,
    background: "rgba(255,255,255,0.18)",
    backdropFilter: "blur(10px)",
    color: "#fff",
    fontSize: 11,
    fontWeight: 500,
    letterSpacing: 0.04
  } }, /* @__PURE__ */ React.createElement(IconPin, { size: 12, stroke: "#fff" }), /* @__PURE__ */ React.createElement("span", { style: { overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" } }, trip.countries.join(" · "))), /* @__PURE__ */ React.createElement("div", { style: {
    position: "absolute",
    top: 18,
    insetInlineEnd: 18,
    color: "#fff",
    textAlign: "end"
  } }, /* @__PURE__ */ React.createElement("div", { className: "mono", style: {
    fontSize: 11.5,
    fontWeight: 500,
    color: "rgba(255,255,255,0.92)",
    textShadow: "0 1px 4px rgba(0,0,0,0.4)"
  } }, trip.dates)), /* @__PURE__ */ React.createElement("div", { style: {
    position: "absolute",
    insetInlineStart: 0,
    insetInlineEnd: 0,
    bottom: 0,
    padding: "60px 22px 18px",
    background: "linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.45) 50%, transparent 100%)",
    color: "#fff"
  } }, /* @__PURE__ */ React.createElement("div", { className: "serif-italic", style: { fontSize: 32, lineHeight: 1.05, letterSpacing: "-0.02em" } }, trip.title || (window.isRTL ? "رحلة" : "Trip")), trip.subtitle && /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12.5, opacity: 0.92, marginTop: 4, fontWeight: 500 } }, trip.subtitle), /* @__PURE__ */ React.createElement("div", { style: {
    display: "flex",
    alignItems: "center",
    gap: 14,
    marginTop: 12,
    flexDirection: "row",
    flexWrap: "wrap"
  } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "baseline", gap: 4 } }, /* @__PURE__ */ React.createElement("span", { className: "mono", style: { fontSize: 16, fontWeight: 600 } }, trip.daysIn), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 11, opacity: 0.75 } }, "/", trip.daysTotal, " ", window.isRTL ? "يوم" : "days")), planned > 0 && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("span", { style: { width: 3, height: 3, borderRadius: 999, background: "rgba(255,255,255,0.5)" } }), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "baseline", gap: 4 } }, /* @__PURE__ */ React.createElement("span", { className: "mono", style: { fontSize: 16, fontWeight: 600 } }, fmtC(spent)), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 11, opacity: 0.75 } }, "/ ", fmtC(planned)))))))), (window.MEMBERS || []).length > 1 && (() => {
    var _a2;
    const balance = (_a2 = window.computeUserBalance) == null ? void 0 : _a2.call(
      window,
      window.currentUserId,
      window.EXPENSES || [],
      window.SETTLEMENTS || []
    );
    if (!balance || Math.abs(balance.net) < 0.5) return null;
    const owed = balance.net > 0;
    const amount = fmtC(Math.abs(balance.net));
    const pairs = Object.entries(balance.byOther || {}).filter(([, v]) => Math.abs(v) > 0.5);
    const otherCount = pairs.length;
    let singleName = null;
    if (otherCount === 1) {
      const otherId = pairs[0][0];
      const member = (window.MEMBERS || []).find((m) => m.id === otherId);
      singleName = ((member == null ? void 0 : member.name) || "").split(" ")[0] || (member == null ? void 0 : member.name) || "";
    }
    const arPeopleNoun = window.isRTL ? window.arPlural(otherCount, {
      one: "شخص واحد",
      two: "شخصان",
      few: `${otherCount} أشخاص`,
      many: `${otherCount} شخصاً`,
      other: `${otherCount} شخص`
    }) : null;
    const sentence = otherCount === 1 && singleName ? owed ? /* @__PURE__ */ React.createElement(React.Fragment, null, window.isRTL ? /* @__PURE__ */ React.createElement(React.Fragment, null, "يترتب على ", /* @__PURE__ */ React.createElement(BalanceAmt, null, singleName), " لك مبلغ ", /* @__PURE__ */ React.createElement(BalanceAmt, null, amount), ".") : /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(BalanceAmt, null, singleName), " owes you ", /* @__PURE__ */ React.createElement(BalanceAmt, null, amount), ".")) : /* @__PURE__ */ React.createElement(React.Fragment, null, window.isRTL ? /* @__PURE__ */ React.createElement(React.Fragment, null, "أنت مدين لـ ", /* @__PURE__ */ React.createElement(BalanceAmt, null, singleName), " بمبلغ ", /* @__PURE__ */ React.createElement(BalanceAmt, null, amount), ".") : /* @__PURE__ */ React.createElement(React.Fragment, null, "You owe ", /* @__PURE__ */ React.createElement(BalanceAmt, null, singleName), " ", /* @__PURE__ */ React.createElement(BalanceAmt, null, amount), ".")) : owed ? /* @__PURE__ */ React.createElement(React.Fragment, null, window.isRTL ? /* @__PURE__ */ React.createElement(React.Fragment, null, "يترتب لك بذمة ", /* @__PURE__ */ React.createElement(BalanceAmt, null, arPeopleNoun), " إجمالي ", /* @__PURE__ */ React.createElement(BalanceAmt, null, amount), ".") : /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(BalanceAmt, null, otherCount), " ", otherCount === 1 ? "person owes" : "people owe", " you ", /* @__PURE__ */ React.createElement(BalanceAmt, null, amount), " total.")) : /* @__PURE__ */ React.createElement(React.Fragment, null, window.isRTL ? /* @__PURE__ */ React.createElement(React.Fragment, null, "أنت مدين لـ ", /* @__PURE__ */ React.createElement(BalanceAmt, null, arPeopleNoun), " بإجمالي ", /* @__PURE__ */ React.createElement(BalanceAmt, null, amount), ".") : /* @__PURE__ */ React.createElement(React.Fragment, null, "You owe ", /* @__PURE__ */ React.createElement(BalanceAmt, null, otherCount), " ", otherCount === 1 ? "person" : "people", " ", /* @__PURE__ */ React.createElement(BalanceAmt, null, amount), " total."));
    return /* @__PURE__ */ React.createElement("div", { style: { padding: "24px 14px 0", position: "relative", zIndex: 3 } }, /* @__PURE__ */ React.createElement(
      "button",
      {
        onClick: () => openSheet == null ? void 0 : openSheet("settleUp"),
        "aria-label": window.isRTL ? owed ? singleName ? `يترتب على ${singleName} لك مبلغ ${amount}` : `يترتب لك بذمة ${arPeopleNoun} إجمالي ${amount}` : singleName ? `أنت مدين لـ ${singleName} بمبلغ ${amount}` : `أنت مدين لـ ${arPeopleNoun} بإجمالي ${amount}` : owed ? singleName ? `${singleName} owes you ${amount}` : `${otherCount} people owe you ${amount}` : singleName ? `You owe ${singleName} ${amount}` : `You owe ${otherCount} people ${amount}`,
        style: {
          width: "100%",
          textAlign: "start",
          borderRadius: 22,
          padding: "16px 18px",
          // Gradient uses FIXED oklch values (not var(--moss) /
          // var(--clay) tokens) because those tokens shift with the
          // theme -- in light mode the top-left stop landed at
          // lightness 0.62, against which the white amount text
          // failed WCAG AA contrast (only ~3.5:1) and read as
          // "white on cream." Hardcoding the darker end of each
          // spectrum keeps the gradient identifiable AND keeps the
          // white sentence + bolded numbers readable in both themes.
          background: owed ? "linear-gradient(135deg, oklch(0.45 0.10 155) 0%, oklch(0.32 0.09 155) 100%)" : "linear-gradient(135deg, oklch(0.48 0.13 32) 0%, oklch(0.36 0.12 32) 100%)",
          color: "#fff",
          boxShadow: "var(--shadow-md)",
          display: "flex",
          alignItems: "center",
          gap: 14,
          flexDirection: "row"
        }
      },
      /* @__PURE__ */ React.createElement("div", { style: { flex: 1, minWidth: 0 } }, /* @__PURE__ */ React.createElement("div", { style: {
        fontSize: 17,
        lineHeight: 1.4,
        color: "#fff",
        fontWeight: 400
      } }, sentence), /* @__PURE__ */ React.createElement("div", { style: {
        marginTop: 6,
        fontSize: 12,
        color: "rgba(255,255,255,0.85)",
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        flexDirection: "row"
      } }, t("balanceTapToSettle"), /* @__PURE__ */ React.createElement("span", { className: "icon-flip", style: { opacity: 0.85 } }, /* @__PURE__ */ React.createElement(IconChevron, { size: 11, stroke: "currentColor" }))))
    ));
  })(), planned > 0 && spent > planned && /* @__PURE__ */ React.createElement("div", { style: { padding: "24px 14px 0", position: "relative", zIndex: 3 } }, /* @__PURE__ */ React.createElement("div", { style: {
    borderRadius: 14,
    padding: "12px 14px",
    background: "oklch(0.62 0.13 35 / 0.10)",
    border: "0.5px solid oklch(0.62 0.13 35 / 0.30)",
    display: "flex",
    alignItems: "center",
    gap: 10,
    flexDirection: "row"
  } }, /* @__PURE__ */ React.createElement("div", { style: {
    width: 28,
    height: 28,
    borderRadius: 8,
    flexShrink: 0,
    background: "var(--clay)",
    color: "#fff",
    display: "grid",
    placeItems: "center",
    fontSize: 14,
    lineHeight: 1
  } }, "⚠"), /* @__PURE__ */ React.createElement("div", { style: { flex: 1, minWidth: 0, fontSize: 12.5, color: "var(--clay-deep)" } }, window.isRTL ? /* @__PURE__ */ React.createElement(React.Fragment, null, "تجاوزت الميزانية بمقدار ", /* @__PURE__ */ React.createElement("strong", null, fmtC(spent - planned)), " (أي بنسبة ", Math.round((spent - planned) / planned * 100), "٪ فوق الخطة المحددة).") : /* @__PURE__ */ React.createElement(React.Fragment, null, "Over budget by ", /* @__PURE__ */ React.createElement("strong", null, fmtC(spent - planned)), " (", Math.round((spent - planned) / planned * 100), "% above plan).")))), /* @__PURE__ */ React.createElement("div", { style: { padding: "24px 14px 0", position: "relative", zIndex: 3 } }, /* @__PURE__ */ React.createElement("button", { onClick: () => go("budget"), style: {
    display: "block",
    width: "100%",
    textAlign: "start",
    background: "var(--cream-2)",
    borderRadius: 28,
    padding: "20px 20px 18px",
    boxShadow: "var(--shadow-card)",
    position: "relative",
    overflow: "visible",
    border: "0.5px solid var(--hairline)"
  } }, /* @__PURE__ */ React.createElement("div", { style: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 14,
    flexDirection: "row"
  } }, /* @__PURE__ */ React.createElement("div", { style: { flex: 1, minWidth: 0 } }, /* @__PURE__ */ React.createElement("div", { style: {
    fontSize: 17,
    lineHeight: 1.5,
    color: "var(--ink-soft)",
    fontWeight: 400
  } }, window.isRTL ? planned > 0 ? /* @__PURE__ */ React.createElement(React.Fragment, null, "أنفقت ", /* @__PURE__ */ React.createElement(HubBudgetNum, null, fmtC(spent)), " من أصل ", /* @__PURE__ */ React.createElement(HubBudgetNum, { dim: true }, fmtC(planned)), ".") : /* @__PURE__ */ React.createElement(React.Fragment, null, "إجمالي ما أنفقته حتى الآن: ", /* @__PURE__ */ React.createElement(HubBudgetNum, null, fmtC(spent)), ".") : planned > 0 ? /* @__PURE__ */ React.createElement(React.Fragment, null, "Spent ", /* @__PURE__ */ React.createElement(HubBudgetNum, null, fmtC(spent)), " of ", /* @__PURE__ */ React.createElement(HubBudgetNum, { dim: true }, fmtC(planned)), " planned.") : /* @__PURE__ */ React.createElement(React.Fragment, null, "Spent ", /* @__PURE__ */ React.createElement(HubBudgetNum, null, fmtC(spent)), " so far.")), planned > 0 && spent <= planned && /* @__PURE__ */ React.createElement("div", { style: {
    marginTop: 6,
    fontSize: 12.5,
    color: "var(--moss)",
    fontWeight: 500,
    display: "inline-flex",
    alignItems: "center",
    gap: 5,
    flexDirection: "row"
  } }, /* @__PURE__ */ React.createElement("span", { style: {
    width: 6,
    height: 6,
    borderRadius: 999,
    background: "var(--moss)"
  } }), fmtC(remaining), " ", t("leftOnPace"), /* @__PURE__ */ React.createElement("span", { style: { color: "var(--ink-mute)" } }, "· ", Math.round(pct), "%"))), /* @__PURE__ */ React.createElement(IconChevron, { size: 16, stroke: "var(--ink-mute)" })), spent > 0 && (window.CATEGORIES || []).some((c) => c.amt > 0) && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { style: {
    display: "flex",
    borderRadius: 12,
    overflow: "hidden",
    height: 16,
    marginBottom: 14,
    boxShadow: "inset 0 0 0 0.5px rgba(0,0,0,0.05)",
    flexDirection: "row"
  } }, window.CATEGORIES.filter((c) => c.amt > 0).map((c, i) => /* @__PURE__ */ React.createElement("div", { key: c.key, style: {
    flex: c.pct || c.amt,
    background: c.color,
    boxShadow: i > 0 ? "inset 2px 0 0 var(--cream-2)" : "none"
  } }))), /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px 14px" } }, window.CATEGORIES.filter((c) => c.amt > 0).slice(0, 4).map((c) => /* @__PURE__ */ React.createElement("div", { key: c.key, style: { display: "flex", alignItems: "center", gap: 8, flexDirection: "row" } }, /* @__PURE__ */ React.createElement("span", { style: { width: 8, height: 8, borderRadius: 2, background: c.color } }), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 12.5, color: "var(--ink-soft)", flex: 1 } }, t(c.key) || c.label), /* @__PURE__ */ React.createElement("span", { className: "mono", style: { fontSize: 11.5, color: "var(--ink)", fontWeight: 500 } }, fmtC(c.amt)))))), (window.MEMBERS || []).length > 1 && /* @__PURE__ */ React.createElement("div", { style: {
    position: "absolute",
    bottom: -14,
    insetInlineStart: 22,
    display: "flex",
    alignItems: "center",
    gap: 8,
    flexDirection: "row",
    padding: "7px 12px 7px 8px",
    borderRadius: 999,
    background: "var(--statement)",
    color: "var(--statement-fg)",
    boxShadow: "0 6px 16px rgba(0,0,0,0.3)"
  } }, /* @__PURE__ */ React.createElement(AvatarStack, { members: (window.MEMBERS || []).slice(0, 3), size: 20 }), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 11.5, fontWeight: 500 } }, window.MEMBERS.length, " ", t("splitting"))))), /* @__PURE__ */ React.createElement("div", { style: { padding: "24px 14px 0" } }, /* @__PURE__ */ React.createElement(SectionLabel, null, t("quickActions")), /* @__PURE__ */ React.createElement("div", { style: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: 8,
    padding: "0 14px"
  } }, [
    { i: /* @__PURE__ */ React.createElement(IconPlus, { size: 20 }), l: t("add"), primary: true, onClick: () => openSheet("addExpense") },
    { i: /* @__PURE__ */ React.createElement(IconCompass, { size: 18 }), l: t("planNav") || t("plan"), onClick: () => go("plan") },
    { i: /* @__PURE__ */ React.createElement(IconDoc, { size: 18 }), l: t("vaultNav"), onClick: () => go("docs") },
    { i: /* @__PURE__ */ React.createElement(IconSparkle, { size: 18 }), l: t("statsNav"), onClick: () => go("analytics") }
  ].map((q, i) => /* @__PURE__ */ React.createElement(
    "button",
    {
      key: i,
      onClick: q.onClick,
      "aria-label": q.l,
      style: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 7,
        padding: "14px 4px 12px",
        borderRadius: 18,
        background: q.primary ? "var(--ink)" : "var(--cream-2)",
        border: q.primary ? "none" : "0.5px solid var(--hairline)",
        boxShadow: q.primary ? "0 8px 18px -8px oklch(0.22 0.025 250 / 0.4)" : "var(--shadow-xs)"
      }
    },
    /* @__PURE__ */ React.createElement("div", { style: {
      width: 32,
      height: 32,
      borderRadius: 10,
      background: q.primary ? "rgba(255,255,255,0.14)" : "var(--cream)",
      color: q.primary ? "var(--cream)" : "var(--ink)",
      display: "grid",
      placeItems: "center",
      border: q.primary ? "0.5px solid rgba(255,255,255,0.2)" : "0.5px solid var(--hairline)"
    } }, q.i),
    /* @__PURE__ */ React.createElement("span", { style: {
      fontSize: 11.5,
      fontWeight: q.primary ? 600 : 500,
      color: q.primary ? "var(--cream)" : "var(--ink-soft)",
      letterSpacing: q.primary ? "-0.005em" : 0
    } }, q.l)
  )))), (window.EXPENSES || []).length > 0 && /* @__PURE__ */ React.createElement("div", { style: { padding: "24px 14px 0" } }, /* @__PURE__ */ React.createElement(SectionLabel, { action: t("seeAll"), onAction: () => go("budget") }, t("recentActivity")), /* @__PURE__ */ React.createElement("div", { style: { padding: "0 14px", display: "flex", flexDirection: "column", gap: 9 } }, (window.EXPENSES || []).slice(0, 3).map((e, i) => {
    var _a2, _b2;
    const m = (window.MEMBERS || []).find((x) => x.id === e.who) || { name: "—", hue: 200, initials: "?" };
    const c = (window.CATEGORIES || []).find((x) => x.key === e.cat) || { color: "var(--ink-mute)", label: e.cat || "—" };
    return /* @__PURE__ */ React.createElement(
      "button",
      {
        key: e.id,
        onClick: () => openSheet == null ? void 0 : openSheet("editExpense", e),
        "aria-label": window.isRTL ? `تعديل ${e.title}، ${fmtC(e.usd)}` : `Edit ${e.title}, ${fmtC(e.usd)}`,
        style: {
          all: "unset",
          cursor: "pointer",
          width: "100%",
          boxSizing: "border-box",
          background: "var(--cream-2)",
          borderRadius: 18,
          padding: "12px 14px",
          border: "0.5px solid var(--hairline)",
          boxShadow: "var(--shadow-xs)",
          display: "flex",
          alignItems: "center",
          gap: 12,
          flexDirection: "row"
        }
      },
      /* @__PURE__ */ React.createElement("div", { style: {
        width: 38,
        height: 38,
        borderRadius: 11,
        background: c.color,
        display: "grid",
        placeItems: "center",
        fontSize: 19,
        lineHeight: 1,
        flexShrink: 0
      } }, ((_b2 = (_a2 = window.CAT_META) == null ? void 0 : _a2[e.cat]) == null ? void 0 : _b2.emoji) || "·"),
      /* @__PURE__ */ React.createElement("div", { style: { flex: 1, minWidth: 0 } }, /* @__PURE__ */ React.createElement("div", { style: {
        fontSize: 13.5,
        fontWeight: 500,
        color: "var(--ink)",
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap"
      } }, e.title), /* @__PURE__ */ React.createElement("div", { style: {
        fontSize: 11,
        color: "var(--ink-mute)",
        marginTop: 1,
        display: "flex",
        alignItems: "center",
        gap: 5,
        flexDirection: "row"
      } }, /* @__PURE__ */ React.createElement(Avatar, { m, size: 14 }), " ", m.name.split(" ")[0], " · ", e.when)),
      /* @__PURE__ */ React.createElement("div", { className: "mono", style: {
        fontSize: 13.5,
        color: "var(--ink)",
        fontWeight: 600,
        flexShrink: 0
      } }, fmtC(e.usd)),
      /* @__PURE__ */ React.createElement("span", { className: "icon-flip", style: { color: "var(--ink-mute)", flexShrink: 0 } }, /* @__PURE__ */ React.createElement(IconChevron, { size: 13, stroke: "currentColor" }))
    );
  }))));
}
const btnGlass = {
  width: 38,
  height: 38,
  borderRadius: 999,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "var(--ink)"
};
const miniCard = {
  background: "var(--cream-2)",
  borderRadius: 18,
  padding: "10px 14px",
  boxShadow: "var(--shadow-md)",
  border: "0.5px solid var(--hairline)"
};
function BalanceAmt({ children }) {
  return /* @__PURE__ */ React.createElement("span", { className: "mono", style: {
    fontWeight: 700,
    fontSize: "1.15em",
    letterSpacing: "-0.01em"
  } }, children);
}
function HubBudgetNum({ children, dim }) {
  const isDark = typeof document !== "undefined" && document.documentElement.getAttribute("data-theme") === "dark";
  const color = isDark ? dim ? "oklch(0.72 0.014 250)" : "oklch(0.96 0.010 250)" : dim ? "oklch(0.40 0.020 248)" : "oklch(0.18 0.020 250)";
  return /* @__PURE__ */ React.createElement("span", { className: "mono", style: {
    fontWeight: dim ? 500 : 700,
    fontSize: "1.15em",
    color,
    letterSpacing: "-0.01em"
  } }, children);
}
window.ScreenHub = ScreenHub;
function ScreenBudget({ go, openSheet, loading }) {
  var _a, _b;
  const trip = window.TRIP;
  const [displayMode, setDisplayMode] = React.useState("home");
  const [filter, setFilter] = React.useState("all");
  const [paidBy, setPaidBy] = React.useState("all");
  const [dayFilter, setDayFilter] = React.useState("all");
  const [search, setSearch] = React.useState("");
  const [showSearch, setShowSearch] = React.useState(false);
  const [showFilters, setShowFilters] = React.useState(false);
  const cats = window.CATEGORIES || [];
  const tripStart = (trip == null ? void 0 : trip.startDate) ? new Date(trip.startDate) : null;
  const dayOf = (createdAt) => {
    if (!tripStart || !createdAt) return 0;
    const diff = Math.floor((new Date(createdAt) - tripStart) / 864e5) + 1;
    return Math.max(1, Math.min(diff, (trip == null ? void 0 : trip.daysTotal) || 30));
  };
  const daysAvailable = (trip == null ? void 0 : trip.daysTotal) ? Array.from({ length: trip.daysTotal }, (_, i) => i + 1) : [];
  const filteredExpenses = (window.EXPENSES || []).filter(
    (e) => {
      var _a2, _b2;
      return (filter === "all" || e.cat === filter) && (paidBy === "all" || e.who === paidBy) && (dayFilter === "all" || dayOf(e.createdAt) === dayFilter) && (!search || ((_a2 = e.title) == null ? void 0 : _a2.toLowerCase().includes(search.toLowerCase())) || ((_b2 = e.note) == null ? void 0 : _b2.toLowerCase().includes(search.toLowerCase())));
    }
  );
  const dataReady = trip && ((_a = window.isTripDataReady) == null ? void 0 : _a.call(window, trip.id));
  if (loading || !trip || !dataReady) {
    return /* @__PURE__ */ React.createElement("div", { style: { background: "var(--cream)", minHeight: "100%", paddingBottom: 100 } }, /* @__PURE__ */ React.createElement(Header, { title: t("budget"), onBack: () => go("hub") }), !trip && !loading ? /* @__PURE__ */ React.createElement("div", { style: { padding: "48px 32px", textAlign: "center", color: "var(--ink-mute)" } }, /* @__PURE__ */ React.createElement("div", { className: "serif", style: { fontSize: 18 } }, window.isRTL ? "يرجى تحديد وفتح رحلة أولاً" : "Open a trip first")) : /* @__PURE__ */ React.createElement(TripSkeleton, null));
  }
  const home = trip.homeCurrency || "USD";
  const local = trip.localCurrency || home;
  const sameHomeLocal = home === local;
  const conv = (usd) => window.fmtMoney(usd, { in: displayMode === "home" ? home : local });
  const expenses = window.EXPENSES || [];
  const realSpent = expenses.reduce((s, e) => s + (e.usd || 0), 0);
  const planned = ((_b = trip.budget) == null ? void 0 : _b.plannedUSD) || 0;
  const remaining = planned - realSpent;
  const overBudget = planned > 0 && realSpent > planned;
  const overPct = planned > 0 ? Math.round((realSpent - planned) / planned * 100) : 0;
  const R = 64, C = 2 * Math.PI * R;
  let offset = 0;
  return /* @__PURE__ */ React.createElement("div", { "data-screen-label": "02 Budget", style: { background: "var(--cream)", minHeight: "100%", paddingBottom: 100 } }, /* @__PURE__ */ React.createElement(Header, { title: t("budget"), onBack: () => go("hub"), action: /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("button", { onClick: () => go("analytics"), "aria-label": t("statsNav"), title: t("statsNav"), style: {
    width: 36,
    height: 36,
    borderRadius: 999,
    background: "var(--cream-2)",
    color: "var(--ink-soft)",
    border: "0.5px solid var(--hairline)",
    display: "grid",
    placeItems: "center"
  } }, /* @__PURE__ */ React.createElement(IconSparkle, { size: 15, stroke: "currentColor" })), /* @__PURE__ */ React.createElement("button", { onClick: () => openSheet == null ? void 0 : openSheet("addExpense"), "aria-label": t("add"), style: {
    width: 36,
    height: 36,
    borderRadius: 999,
    background: "var(--clay)",
    display: "grid",
    placeItems: "center",
    boxShadow: "0 4px 10px oklch(0.62 0.13 35 / 0.4)"
  } }, /* @__PURE__ */ React.createElement(IconPlus, { size: 16, stroke: "#fff" }))) }), overBudget && /* @__PURE__ */ React.createElement("div", { style: { padding: "4px 14px 0" } }, /* @__PURE__ */ React.createElement("div", { style: {
    borderRadius: 14,
    padding: "12px 14px",
    background: "oklch(0.62 0.13 35 / 0.10)",
    border: "0.5px solid oklch(0.62 0.13 35 / 0.30)",
    display: "flex",
    alignItems: "center",
    gap: 10,
    flexDirection: "row"
  } }, /* @__PURE__ */ React.createElement("div", { style: {
    width: 28,
    height: 28,
    borderRadius: 8,
    flexShrink: 0,
    background: "var(--clay)",
    color: "#fff",
    display: "grid",
    placeItems: "center",
    fontSize: 14,
    lineHeight: 1
  } }, "⚠"), /* @__PURE__ */ React.createElement("div", { style: { flex: 1, minWidth: 0, fontSize: 12.5, color: "var(--clay-deep)" } }, window.isRTL ? /* @__PURE__ */ React.createElement(React.Fragment, null, "تجاوزت الميزانية بمقدار ", /* @__PURE__ */ React.createElement("strong", null, conv(realSpent - planned)), " (أي بنسبة ", overPct, "٪ فوق الخطة المحددة).") : /* @__PURE__ */ React.createElement(React.Fragment, null, "Over budget by ", /* @__PURE__ */ React.createElement("strong", null, conv(realSpent - planned)), " (", overPct, "% above plan).")))), /* @__PURE__ */ React.createElement("div", { style: { padding: "6px 14px 0", position: "relative" } }, /* @__PURE__ */ React.createElement("div", { style: {
    background: "var(--statement)",
    color: "var(--statement-fg)",
    borderRadius: 28,
    padding: "22px 22px 26px",
    position: "relative",
    overflow: "hidden",
    boxShadow: "var(--shadow-card)"
  } }, /* @__PURE__ */ React.createElement("div", { style: {
    position: "absolute",
    inset: 0,
    background: "radial-gradient(60% 50% at 80% 0%, oklch(0.40 0.06 35 / 0.6) 0%, transparent 60%)",
    pointerEvents: "none"
  } }), /* @__PURE__ */ React.createElement("div", { style: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    flexDirection: "row",
    position: "relative"
  } }, /* @__PURE__ */ React.createElement("div", { style: { flex: 1, minWidth: 0 } }, /* @__PURE__ */ React.createElement("div", { style: {
    fontSize: 17,
    lineHeight: 1.5,
    color: "var(--statement-sub)",
    fontWeight: 400
  } }, window.isRTL ? planned > 0 ? /* @__PURE__ */ React.createElement(React.Fragment, null, "أنفقت ", /* @__PURE__ */ React.createElement(BudgetNum, null, conv(realSpent)), " من أصل ", /* @__PURE__ */ React.createElement(BudgetNum, { dim: true }, conv(planned)), ".") : /* @__PURE__ */ React.createElement(React.Fragment, null, "إجمالي ما أنفقته حتى الآن: ", /* @__PURE__ */ React.createElement(BudgetNum, null, conv(realSpent)), ".") : planned > 0 ? /* @__PURE__ */ React.createElement(React.Fragment, null, "Spent ", /* @__PURE__ */ React.createElement(BudgetNum, null, conv(realSpent)), " of ", /* @__PURE__ */ React.createElement(BudgetNum, { dim: true }, conv(planned)), " planned.") : /* @__PURE__ */ React.createElement(React.Fragment, null, "Spent ", /* @__PURE__ */ React.createElement(BudgetNum, null, conv(realSpent)), " so far.")), !sameHomeLocal && /* @__PURE__ */ React.createElement("div", { style: {
    marginTop: 14,
    display: "inline-flex",
    padding: 3,
    background: "rgba(255,255,255,0.08)",
    borderRadius: 999,
    border: "0.5px solid rgba(255,255,255,0.1)",
    flexDirection: "row"
  } }, [["home", home], ["local", local]].map(([m, code]) => /* @__PURE__ */ React.createElement("button", { key: m, onClick: () => setDisplayMode(m), style: {
    padding: "5px 12px",
    borderRadius: 999,
    fontSize: 11.5,
    fontWeight: 500,
    background: displayMode === m ? "var(--cream)" : "transparent",
    color: displayMode === m ? "var(--ink)" : "var(--cream)",
    display: "flex",
    alignItems: "center",
    gap: 5,
    flexDirection: "row"
  } }, displayMode !== m && /* @__PURE__ */ React.createElement(IconSwap, { size: 11, stroke: "currentColor" }), code)))), /* @__PURE__ */ React.createElement("div", { style: { position: "relative", width: 150, height: 150, flexShrink: 0 } }, /* @__PURE__ */ React.createElement("svg", { width: "150", height: "150", viewBox: "0 0 150 150", style: { transform: "rotate(-90deg)" } }, /* @__PURE__ */ React.createElement("circle", { cx: "75", cy: "75", r: R, fill: "none", stroke: "rgba(255,255,255,0.06)", strokeWidth: "14" }), cats.map((c) => {
    const len = c.pct / 100 * C;
    const dasharray = `${len} ${C - len}`;
    const el = /* @__PURE__ */ React.createElement(
      "circle",
      {
        key: c.key,
        cx: "75",
        cy: "75",
        r: R,
        fill: "none",
        stroke: c.color,
        strokeWidth: "14",
        strokeLinecap: "butt",
        strokeDasharray: dasharray,
        strokeDashoffset: -offset
      }
    );
    offset += len + 2;
    return el;
  })), /* @__PURE__ */ React.createElement("div", { style: {
    position: "absolute",
    inset: 0,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center"
  } }, /* @__PURE__ */ React.createElement("div", { className: "mono", style: { fontSize: 32, lineHeight: 1, fontWeight: 600, letterSpacing: "-0.02em" } }, planned > 0 ? Math.min(Math.round(realSpent / planned * 100), 999) : 0, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 16, opacity: 0.65 } }, "%")), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, opacity: 0.62, marginTop: 3 } }, t("used")))))), /* @__PURE__ */ React.createElement("div", { style: {
    marginTop: 12,
    display: "flex",
    gap: 9,
    overflowX: "auto",
    padding: "0 4px 8px",
    flexDirection: "row"
  }, className: "no-scrollbar" }, cats.map((c) => /* @__PURE__ */ React.createElement("div", { key: c.key, style: {
    flexShrink: 0,
    minWidth: 110,
    background: "var(--cream-2)",
    borderRadius: 18,
    padding: "12px 14px",
    boxShadow: "var(--shadow-sm)",
    border: "0.5px solid var(--hairline)"
  } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 6, flexDirection: "row" } }, /* @__PURE__ */ React.createElement("span", { style: { width: 7, height: 7, borderRadius: 2, background: c.color } }), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 11.5, fontWeight: 500, color: "var(--ink-soft)" } }, t(c.key) || c.label)), /* @__PURE__ */ React.createElement("div", { className: "mono", style: { fontSize: 17, marginTop: 4, color: "var(--ink)", fontWeight: 500 } }, conv(c.amt)), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10.5, color: "var(--ink-mute)", marginTop: 1, fontFamily: "var(--mono)" } }, c.pct, t("ofTotal")))))), /* @__PURE__ */ React.createElement("div", { style: { padding: "18px 14px 0" } }, /* @__PURE__ */ React.createElement("div", { style: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    padding: "0 8px 10px"
  } }, /* @__PURE__ */ React.createElement("div", { className: "serif", style: { fontSize: 22 } }, t("expenses")), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 5, flexDirection: "row" } }, /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: () => {
        setShowSearch(!showSearch);
        setSearch("");
      },
      "aria-label": window.isRTL ? "بحث في المصروفات" : "Search expenses",
      style: {
        width: 38,
        height: 38,
        borderRadius: 12,
        background: showSearch ? "var(--ink)" : "var(--cream-2)",
        border: "0.5px solid var(--hairline)",
        display: "grid",
        placeItems: "center",
        flexShrink: 0
      }
    },
    /* @__PURE__ */ React.createElement(IconSearch, { size: 16, stroke: showSearch ? "var(--cream)" : "var(--ink-soft)" })
  ))), showSearch && /* @__PURE__ */ React.createElement("div", { style: { padding: "0 8px 10px" } }, /* @__PURE__ */ React.createElement(
    "input",
    {
      autoFocus: true,
      type: "text",
      value: search,
      onChange: (e) => setSearch(e.target.value),
      placeholder: window.isRTL ? "ابحث في المصروفات..." : "Search expenses...",
      style: {
        width: "100%",
        padding: "10px 14px",
        borderRadius: 12,
        border: "1px solid var(--clay)",
        background: "var(--cream)",
        color: "var(--ink)",
        fontSize: 13.5,
        outline: "none",
        textAlign: "start"
      }
    }
  )), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 6, padding: "0 4px 10px", overflowX: "auto", flexDirection: "row", alignItems: "center" }, className: "no-scrollbar" }, /* @__PURE__ */ React.createElement(Chip, { active: filter === "all", onClick: () => setFilter("all") }, t("all"), " · ", window.EXPENSES.length), cats.map((c) => /* @__PURE__ */ React.createElement(Chip, { key: c.key, active: filter === c.key, onClick: () => setFilter(c.key) }, t(c.key) || c.label)), /* @__PURE__ */ React.createElement("div", { style: { flex: 1 } }), /* @__PURE__ */ React.createElement("button", { onClick: () => setShowFilters(!showFilters), style: {
    flexShrink: 0,
    padding: "6px 12px 6px 10px",
    borderRadius: 999,
    fontSize: 11.5,
    fontWeight: 500,
    background: showFilters || paidBy !== "all" || dayFilter !== "all" ? "var(--ink)" : "var(--cream-2)",
    color: showFilters || paidBy !== "all" || dayFilter !== "all" ? "var(--cream)" : "var(--ink-soft)",
    border: "0.5px solid var(--hairline)",
    display: "inline-flex",
    alignItems: "center",
    gap: 5
  } }, /* @__PURE__ */ React.createElement(IconFilter, { size: 12, stroke: "currentColor" }), window.isRTL ? "تصفية" : "Filters", (paidBy !== "all" || dayFilter !== "all") && /* @__PURE__ */ React.createElement("span", { style: { width: 6, height: 6, borderRadius: 999, background: "var(--clay)" } }))), showFilters && /* @__PURE__ */ React.createElement("div", { style: {
    margin: "0 4px 12px",
    padding: "12px 14px",
    borderRadius: 16,
    background: "var(--cream-2)",
    border: "0.5px solid var(--hairline)",
    display: "flex",
    flexDirection: "column",
    gap: 12
  } }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, fontWeight: 600, color: "var(--ink)", marginBottom: 6 } }, window.isRTL ? "دُفع بواسطة" : "Paid by"), /* @__PURE__ */ React.createElement("div", { className: "no-scrollbar", style: { display: "flex", gap: 6, overflowX: "auto", flexDirection: "row" } }, /* @__PURE__ */ React.createElement(Chip, { active: paidBy === "all", onClick: () => setPaidBy("all") }, t("all")), (window.MEMBERS || []).map((m) => /* @__PURE__ */ React.createElement(Chip, { key: m.id, active: paidBy === m.id, onClick: () => setPaidBy(m.id) }, m.name.split(" ")[0])))), daysAvailable.length > 0 && /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, fontWeight: 600, color: "var(--ink)", marginBottom: 6 } }, window.isRTL ? "اليوم المحدد" : "Day"), /* @__PURE__ */ React.createElement("div", { className: "no-scrollbar", style: { display: "flex", gap: 6, overflowX: "auto", flexDirection: "row" } }, /* @__PURE__ */ React.createElement(Chip, { active: dayFilter === "all", onClick: () => setDayFilter("all") }, t("all")), daysAvailable.map((d) => /* @__PURE__ */ React.createElement(Chip, { key: d, active: dayFilter === d, onClick: () => setDayFilter(d) }, window.isRTL ? `يوم ${d}` : `Day ${d}`)))), (paidBy !== "all" || dayFilter !== "all" || filter !== "all") && /* @__PURE__ */ React.createElement("button", { onClick: () => {
    setPaidBy("all");
    setDayFilter("all");
    setFilter("all");
  }, style: {
    alignSelf: "flex-start",
    padding: "6px 12px",
    borderRadius: 999,
    fontSize: 11.5,
    background: "var(--cream)",
    border: "0.5px solid var(--hairline-2)",
    color: "var(--ink-soft)"
  } }, window.isRTL ? "مسح التصفية" : "Clear filters")), (paidBy !== "all" || dayFilter !== "all" || filter !== "all" || search) && filteredExpenses.length > 0 && (() => {
    const total = filteredExpenses.reduce((s, e) => s + (e.usd || 0), 0);
    const labels = [];
    if (filter !== "all") {
      const c = cats.find((x) => x.key === filter);
      labels.push((c == null ? void 0 : c.label) || filter);
    }
    if (paidBy !== "all") {
      const m = (window.MEMBERS || []).find((x) => x.id === paidBy);
      if (m) labels.push(`${window.isRTL ? "دُفعت بواسطة" : "paid by"} ${m.name.split(" ")[0]}`);
    }
    if (dayFilter !== "all") {
      labels.push(`${window.isRTL ? "يوم" : "Day"} ${dayFilter}`);
    }
    if (search) labels.push(`"${search}"`);
    return /* @__PURE__ */ React.createElement("div", { style: {
      margin: "0 4px 8px",
      padding: "12px 14px",
      borderRadius: 16,
      background: "var(--statement)",
      color: "var(--statement-fg)",
      border: "0.5px solid var(--hairline-2)",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      flexDirection: "row",
      gap: 12
    } }, /* @__PURE__ */ React.createElement("div", { style: { minWidth: 0 } }, /* @__PURE__ */ React.createElement("div", { style: {
      fontSize: 13,
      fontWeight: 600,
      color: "var(--statement-fg)"
    } }, window.isRTL ? window.arPlural(filteredExpenses.length, {
      zero: "لا توجد مصروفات",
      one: "مصروف واحد",
      two: "مصروفان",
      few: `${filteredExpenses.length} مصروفات`,
      many: `${filteredExpenses.length} مصروفاً`,
      other: `${filteredExpenses.length} مصروف`
    }) : `${filteredExpenses.length} ${filteredExpenses.length === 1 ? "expense" : "expenses"}`), /* @__PURE__ */ React.createElement("div", { style: {
      fontSize: 12,
      marginTop: 3,
      opacity: 0.78,
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap"
    } }, labels.join(" · "))), /* @__PURE__ */ React.createElement("div", { className: "mono", style: {
      fontSize: 18,
      fontWeight: 600,
      flexShrink: 0
    } }, window.fmtMoney(total, { in: "home" })));
  })(), window.EXPENSES.length === 0 && /* @__PURE__ */ React.createElement("div", { style: {
    padding: "40px 24px",
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 12
  } }, /* @__PURE__ */ React.createElement("div", { style: {
    width: 64,
    height: 64,
    borderRadius: 18,
    background: "var(--cream-2)",
    display: "grid",
    placeItems: "center",
    border: "0.5px solid var(--hairline)"
  } }, /* @__PURE__ */ React.createElement(IconWallet, { size: 28, stroke: "var(--ink-mute)" })), /* @__PURE__ */ React.createElement("div", { className: "serif", style: { fontSize: 20, color: "var(--ink)" } }, window.isRTL ? "لا توجد مصروفات مسجلة لهذه الرحلة بعد" : "No expenses yet"), /* @__PURE__ */ React.createElement("div", { style: {
    fontSize: 13,
    color: "var(--ink-mute)",
    maxWidth: 260,
    lineHeight: 1.5
  } }, window.isRTL ? "تتبَّع كل ما تصرفه في الرحلة — تظهر الإحصائيات تلقائياً" : "Track every expense — stats and charts update automatically."), /* @__PURE__ */ React.createElement("button", { onClick: () => openSheet == null ? void 0 : openSheet("addExpense"), style: {
    marginTop: 6,
    padding: "12px 22px",
    borderRadius: 14,
    background: "var(--clay)",
    color: "#fff",
    fontSize: 13.5,
    fontWeight: 600,
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    flexDirection: "row",
    boxShadow: "0 6px 14px oklch(0.62 0.13 35 / 0.35)"
  } }, /* @__PURE__ */ React.createElement(IconPlus, { size: 14, stroke: "currentColor" }), window.isRTL ? "أضف أول مصروف" : "Add first expense")), window.EXPENSES.length > 0 && filteredExpenses.length === 0 && /* @__PURE__ */ React.createElement("div", { style: {
    padding: "28px 24px",
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 10
  } }, /* @__PURE__ */ React.createElement("div", { style: {
    width: 44,
    height: 44,
    borderRadius: 12,
    background: "var(--cream-2)",
    display: "grid",
    placeItems: "center",
    border: "0.5px solid var(--hairline)"
  } }, /* @__PURE__ */ React.createElement(IconSearch, { size: 18, stroke: "var(--ink-mute)" })), /* @__PURE__ */ React.createElement("div", { className: "serif", style: { fontSize: 16, color: "var(--ink)" } }, window.isRTL ? "لا توجد نتائج تطابق خيارات التصفية" : "No matching expenses"), /* @__PURE__ */ React.createElement("button", { onClick: () => {
    setFilter("all");
    setPaidBy("all");
    setDayFilter("all");
    setSearch("");
  }, style: {
    padding: "6px 14px",
    borderRadius: 999,
    fontSize: 12.5,
    fontWeight: 500,
    background: "var(--cream-2)",
    border: "0.5px solid var(--hairline)",
    color: "var(--ink-soft)"
  } }, window.isRTL ? "إعادة تعيين الفلاتر" : "Show all")), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 8, padding: "0 4px" } }, filteredExpenses.map((e) => {
    const m = window.MEMBERS.find((x) => x.id === e.who) || { name: "Unknown", hue: 200, initials: "?" };
    const c = cats.find((x) => x.key === e.cat) || { color: "var(--ink-mute)" };
    const localAmt = e.jpy > 0 ? `¥${e.jpy.toLocaleString()}` : null;
    return /* @__PURE__ */ React.createElement(
      SwipeRow,
      {
        key: e.id,
        actions: [
          { key: "delete", bg: "var(--clay)", icon: /* @__PURE__ */ React.createElement(IconTrash, { size: 18, stroke: "#fff" }) }
        ],
        onAction: async (key) => {
          var _a2, _b2;
          if (key !== "delete") return;
          if (!confirm(window.isRTL ? `هل تريد حذف "${e.title}"؟` : `Delete "${e.title}"?`)) return;
          try {
            await window.deleteExpense(e.id, trip.id);
            await window.loadExpenses(trip.id);
            (_a2 = window.toast) == null ? void 0 : _a2.call(window, window.isRTL ? "تم الحذف بنجاح" : "Deleted", "success");
          } catch (err) {
            (_b2 = window.toast) == null ? void 0 : _b2.call(window, err.message || "Failed", "error");
          }
        }
      },
      /* @__PURE__ */ React.createElement("div", { onClick: () => openSheet == null ? void 0 : openSheet("editExpense", e), style: {
        background: "var(--cream-2)",
        borderRadius: 18,
        cursor: "pointer",
        padding: "12px 14px",
        display: "flex",
        alignItems: "center",
        gap: 12,
        flexDirection: "row",
        border: "0.5px solid var(--hairline)"
      } }, /* @__PURE__ */ React.createElement("div", { style: { flex: 1, minWidth: 0 } }, /* @__PURE__ */ React.createElement("div", { style: {
        display: "flex",
        alignItems: "center",
        gap: 8,
        flexDirection: "row"
      } }, /* @__PURE__ */ React.createElement("span", { style: {
        width: 8,
        height: 8,
        borderRadius: 999,
        background: c.color,
        flexShrink: 0
      } }), /* @__PURE__ */ React.createElement("span", { style: {
        fontSize: 13.5,
        fontWeight: 500,
        color: "var(--ink)",
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap"
      } }, e.title), String(e.id).startsWith("temp-") && /* @__PURE__ */ React.createElement("span", { style: {
        flexShrink: 0,
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        padding: "2px 7px",
        borderRadius: 999,
        background: "oklch(0.78 0.13 80 / 0.18)",
        color: "var(--honey)",
        fontSize: 9.5,
        fontWeight: 700
      } }, /* @__PURE__ */ React.createElement(IconClock, { size: 9, stroke: "currentColor" }), window.isRTL ? "بانتظار المزامنة" : "Pending")), /* @__PURE__ */ React.createElement("div", { style: {
        fontSize: 11.5,
        color: "var(--ink-mute)",
        marginTop: 4,
        display: "flex",
        alignItems: "center",
        gap: 6,
        flexDirection: "row",
        paddingInlineStart: 16
      } }, /* @__PURE__ */ React.createElement(Avatar, { m, size: 15 }), /* @__PURE__ */ React.createElement("span", null, m.name.split(" ")[0], " · ", e.when), e.note && /* @__PURE__ */ React.createElement("span", { style: { opacity: 0.7 } }, "· ", e.note)), e.splitWith && e.splitWith.length > 0 && (() => {
        const totalSharers = e.splitWith.length + 1;
        const userIsInSplit = e.who === window.currentUserId || e.splitWith.includes(window.currentUserId);
        const yourShare = userIsInSplit ? (e.usd || 0) / totalSharers : 0;
        return /* @__PURE__ */ React.createElement("div", { style: {
          fontSize: 10.5,
          color: "var(--moss)",
          marginTop: 4,
          fontWeight: 500,
          display: "flex",
          alignItems: "center",
          gap: 5,
          flexDirection: "row"
        } }, /* @__PURE__ */ React.createElement("span", { style: {
          padding: "2px 6px",
          borderRadius: 999,
          background: "oklch(0.50 0.08 155 / 0.12)",
          fontFamily: "var(--mono)",
          fontSize: 9.5,
          letterSpacing: "0.06em"
        } }, "÷", totalSharers), userIsInSplit && /* @__PURE__ */ React.createElement("span", null, t("splitYourShare"), ": ", /* @__PURE__ */ React.createElement("strong", null, conv(yourShare))));
      })()), e.receiptUrl && /* @__PURE__ */ React.createElement(
        "img",
        {
          src: e.receiptUrl,
          alt: "receipt",
          onClick: (ev) => {
            var _a2;
            ev.stopPropagation();
            (_a2 = window.openImageOverlay) == null ? void 0 : _a2.call(window, e.receiptUrl);
          },
          style: {
            width: 32,
            height: 32,
            objectFit: "cover",
            borderRadius: 8,
            border: "0.5px solid var(--hairline)",
            flexShrink: 0,
            cursor: "zoom-in"
          }
        }
      ), /* @__PURE__ */ React.createElement("div", { style: { textAlign: "end" } }, /* @__PURE__ */ React.createElement("div", { className: "mono", style: { fontSize: 14, fontWeight: 500, color: "var(--ink)" } }, conv(e.usd)), !sameHomeLocal && /* @__PURE__ */ React.createElement("div", { className: "mono", style: { fontSize: 10, color: "var(--ink-mute)" } }, window.fmtMoney(e.usd, { in: displayMode === "home" ? local : home }))))
    );
  }))), (window.AUDIT || []).length > 0 && /* @__PURE__ */ React.createElement("div", { style: { padding: "22px 14px 0" } }, /* @__PURE__ */ React.createElement(SectionLabel, null, t("auditLog")), /* @__PURE__ */ React.createElement(AuditLogPanel, { entries: window.AUDIT })));
}
function AuditLogPanel({ entries }) {
  const [open, setOpen] = React.useState(false);
  const list = entries || [];
  const latest = list[0];
  const m = latest && (window.MEMBERS || []).find((x) => x.id === latest.who);
  return /* @__PURE__ */ React.createElement("div", { style: {
    background: "var(--cream-2)",
    borderRadius: 22,
    margin: "0 8px",
    border: "0.5px solid var(--hairline)",
    overflow: "hidden"
  } }, /* @__PURE__ */ React.createElement("button", { onClick: () => setOpen((v) => !v), style: {
    all: "unset",
    cursor: "pointer",
    width: "100%",
    boxSizing: "border-box",
    padding: "12px 16px",
    display: "flex",
    alignItems: "center",
    gap: 10,
    flexDirection: "row"
  } }, latest && m ? /* @__PURE__ */ React.createElement(Avatar, { m, size: 22 }) : /* @__PURE__ */ React.createElement("div", { style: {
    width: 22,
    height: 22,
    borderRadius: 999,
    background: "var(--cream)",
    display: "grid",
    placeItems: "center",
    border: "0.5px solid var(--hairline)"
  } }, /* @__PURE__ */ React.createElement(IconClock, { size: 11, stroke: "var(--ink-mute)" })), /* @__PURE__ */ React.createElement("div", { style: { flex: 1, minWidth: 0, textAlign: "start" } }, latest ? /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { style: {
    fontSize: 12.5,
    color: "var(--ink-soft)",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap"
  } }, /* @__PURE__ */ React.createElement("span", { style: { fontWeight: 500, color: "var(--ink)" } }, ((m == null ? void 0 : m.name) || "—").split(" ")[0]), /* @__PURE__ */ React.createElement("span", { style: { color: "var(--ink-mute)" } }, " ", latest.action, " "), /* @__PURE__ */ React.createElement("span", { style: { fontWeight: 500 } }, latest.target)), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10.5, color: "var(--ink-mute)", marginTop: 1 } }, window.isRTL ? window.arPlural(list.length, {
    zero: "لا توجد عمليات",
    one: "عملية واحدة",
    two: "عمليتان",
    few: `${list.length} عمليات`,
    many: `${list.length} عملية`,
    other: `${list.length} من العمليات`
  }) : `${list.length} ${list.length === 1 ? "entry" : "entries"}`)) : /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12.5, color: "var(--ink-mute)" } }, window.isRTL ? "لا يوجد سجل بعد" : "No activity yet")), /* @__PURE__ */ React.createElement("span", { style: {
    color: "var(--ink-mute)",
    transform: open ? "rotate(90deg)" : "rotate(0deg)",
    transition: "transform 200ms"
  }, className: "icon-flip" }, /* @__PURE__ */ React.createElement(IconChevron, { size: 13, stroke: "currentColor" }))), open && /* @__PURE__ */ React.createElement("div", { style: { padding: "0 16px 12px", borderTop: "0.5px solid var(--hairline)" } }, list.slice(1).map((a) => {
    const am = (window.MEMBERS || []).find((x) => x.id === a.who);
    return /* @__PURE__ */ React.createElement("div", { key: a.id, style: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      flexDirection: "row",
      padding: "8px 0",
      borderTop: "0.5px solid var(--hairline)"
    } }, /* @__PURE__ */ React.createElement(Avatar, { m: am, size: 22 }), /* @__PURE__ */ React.createElement("div", { style: { flex: 1, fontSize: 12.5, color: "var(--ink-soft)", textAlign: "start" } }, /* @__PURE__ */ React.createElement("span", { style: { fontWeight: 500, color: "var(--ink)" } }, ((am == null ? void 0 : am.name) || "—").split(" ")[0]), /* @__PURE__ */ React.createElement("span", { style: { color: "var(--ink-mute)" } }, " ", a.action, " "), /* @__PURE__ */ React.createElement("span", { style: { fontWeight: 500 } }, a.target)), /* @__PURE__ */ React.createElement("div", { className: "mono", style: { fontSize: 10.5, color: "var(--ink-mute)" } }, a.when));
  }), list.length === 1 && /* @__PURE__ */ React.createElement("div", { style: {
    padding: "10px 0 0",
    fontSize: 11.5,
    color: "var(--ink-mute)",
    textAlign: "center"
  } }, window.isRTL ? "هذا كل النشاط" : "That's all the activity")));
}
function Header({ title, onBack, action }) {
  return /* @__PURE__ */ React.createElement("div", { style: {
    position: "sticky",
    top: 0,
    zIndex: 20,
    padding: "max(54px, calc(env(safe-area-inset-top) + 14px)) 18px 14px",
    background: "linear-gradient(180deg, var(--cream) 85%, transparent)",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row"
  } }, /* @__PURE__ */ React.createElement("button", { onClick: onBack, style: {
    width: 36,
    height: 36,
    borderRadius: 999,
    background: "var(--cream-2)",
    border: "0.5px solid var(--hairline)",
    display: "grid",
    placeItems: "center",
    color: "var(--ink)"
  } }, /* @__PURE__ */ React.createElement("span", { className: "icon-flip" }, /* @__PURE__ */ React.createElement(IconBack, { size: 17 }))), /* @__PURE__ */ React.createElement("div", { className: "serif", style: {
    fontSize: 22,
    color: "var(--ink)",
    flex: 1,
    textAlign: "center",
    minWidth: 0,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    padding: "0 8px"
  } }, title), /* @__PURE__ */ React.createElement("div", { style: {
    minHeight: 36,
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    flexShrink: 0,
    gap: 8,
    flexDirection: "row"
  } }, action || /* @__PURE__ */ React.createElement(IconMore, { size: 18, stroke: "var(--ink-soft)" })));
}
function BudgetNum({ children, dim }) {
  return /* @__PURE__ */ React.createElement("span", { className: "mono", style: {
    fontWeight: dim ? 500 : 700,
    fontSize: "1.18em",
    color: dim ? "rgba(255,251,244,0.55)" : "var(--statement-fg)",
    letterSpacing: "-0.01em"
  } }, children);
}
Object.assign(window, { ScreenBudget, Header });
function PieChart({ data, size = 148 }) {
  const total = data.reduce((s, d) => s + d.value, 0);
  if (total === 0) return null;
  const cx = size / 2, cy = size / 2, r = size / 2 - 10, ir = r * 0.52;
  let angle = -Math.PI / 2;
  return /* @__PURE__ */ React.createElement("svg", { width: size, height: size, viewBox: `0 0 ${size} ${size}`, style: { flexShrink: 0 } }, data.map((d, i) => {
    const slice = d.value / total * 2 * Math.PI;
    const x1 = cx + r * Math.cos(angle);
    const y1 = cy + r * Math.sin(angle);
    angle += slice;
    const x2 = cx + r * Math.cos(angle);
    const y2 = cy + r * Math.sin(angle);
    const xi1 = cx + ir * Math.cos(angle - slice);
    const yi1 = cy + ir * Math.sin(angle - slice);
    const xi2 = cx + ir * Math.cos(angle);
    const yi2 = cy + ir * Math.sin(angle);
    const large = slice > Math.PI ? 1 : 0;
    return /* @__PURE__ */ React.createElement(
      "path",
      {
        key: i,
        d: `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} L ${xi2} ${yi2} A ${ir} ${ir} 0 ${large} 0 ${xi1} ${yi1} Z`,
        fill: d.color,
        stroke: "var(--cream-2)",
        strokeWidth: "1.5"
      }
    );
  }), /* @__PURE__ */ React.createElement("circle", { cx, cy, r: ir - 2, fill: "var(--cream-2)" }));
}
function ScreenAnalytics({ go, loading }) {
  var _a, _b, _c, _d;
  const [selectedDay, setSelectedDay] = React.useState(null);
  if (loading) return /* @__PURE__ */ React.createElement("div", { style: { background: "var(--cream)", minHeight: "100%" } }, /* @__PURE__ */ React.createElement(TripSkeleton, null));
  const expenses = window.EXPENSES || [];
  const trip = window.TRIP;
  const members = window.MEMBERS || [];
  const cats = window.CATEGORIES || [];
  const fmtC = (usd) => window.fmtMoney(usd, { in: "home" });
  const totalUSD = expenses.reduce((s, e) => s + (e.usd || 0), 0);
  const daysElapsed = Math.max((trip == null ? void 0 : trip.daysIn) || 1, 1);
  const daysTotal = Math.max((trip == null ? void 0 : trip.daysTotal) || daysElapsed, 1);
  const dailyAvg = totalUSD / daysElapsed;
  const dailyPlan = (((_a = trip == null ? void 0 : trip.budget) == null ? void 0 : _a.plannedUSD) || 0) / daysTotal;
  const burnPct = dailyPlan > 0 ? dailyAvg / dailyPlan * 100 - 100 : 0;
  const byDate = expenses.reduce((acc, e) => {
    const d = e.when || "Unknown";
    acc[d] = (acc[d] || 0) + (e.usd || 0);
    return acc;
  }, {});
  const dateEntries = Object.entries(byDate).sort((a, b) => a[0].localeCompare(b[0]));
  const maxDay = dateEntries.reduce((m, [d, v]) => v > m.val ? { date: d, val: v } : m, { date: "--", val: 0 });
  const minDay = dateEntries.length > 1 ? dateEntries.reduce((m, [d, v]) => v < m.val ? { date: d, val: v } : m, { date: "--", val: Infinity }) : { date: "--", val: 0 };
  const topTx = expenses.reduce((m, e) => (e.usd || 0) > ((m == null ? void 0 : m.usd) || 0) ? e : m, null);
  const catTotals = cats.map((c) => ({
    key: c.key,
    label: c.label,
    color: c.color,
    value: expenses.filter((e) => e.cat === c.key).reduce((s, e) => s + (e.usd || 0), 0)
  })).filter((c) => c.value > 0);
  const contribs = members.map((m) => {
    const paid = expenses.filter((e) => e.who === m.id).reduce((s, e) => s + (e.usd || 0), 0);
    return { ...m, paid, pct: totalUSD > 0 ? Math.round(paid / totalUSD * 100) : 0 };
  }).filter((m) => m.paid > 0).sort((a, b) => b.paid - a.paid);
  const isoOf = (iso) => (iso || "").slice(0, 10);
  const dailyByISO = {};
  const dailyByISOCats = {};
  expenses.forEach((e) => {
    const k = isoOf(e.createdAt);
    if (!k) return;
    dailyByISO[k] = (dailyByISO[k] || 0) + (e.usd || 0);
    const m = dailyByISOCats[k] || (dailyByISOCats[k] = {});
    m[e.cat] = (m[e.cat] || 0) + (e.usd || 0);
  });
  const allDays = (() => {
    if (!(trip == null ? void 0 : trip.startDate)) return Object.keys(dailyByISO).sort();
    const start = /* @__PURE__ */ new Date(trip.startDate + "T00:00:00");
    const endRaw = trip.endDate ? /* @__PURE__ */ new Date(trip.endDate + "T00:00:00") : /* @__PURE__ */ new Date();
    const end = endRaw < /* @__PURE__ */ new Date() ? endRaw : /* @__PURE__ */ new Date();
    const out = [];
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      out.push(d.toISOString().slice(0, 10));
    }
    return out;
  })();
  const dailyMax = Math.max(...allDays.map((k) => dailyByISO[k] || 0), 1);
  const peakISO = allDays.reduce((m, k) => (dailyByISO[k] || 0) > (dailyByISO[m] || 0) ? k : m, allDays[0]);
  if (expenses.length === 0) {
    return /* @__PURE__ */ React.createElement("div", { style: { background: "var(--cream)", minHeight: "100%", paddingBottom: 100 } }, /* @__PURE__ */ React.createElement(Header, { title: t("statsNav"), onBack: () => go("hub") }), /* @__PURE__ */ React.createElement("div", { style: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "60px 32px",
      textAlign: "center",
      gap: 14
    } }, /* @__PURE__ */ React.createElement("div", { style: {
      width: 64,
      height: 64,
      borderRadius: 20,
      background: "var(--cream-2)",
      display: "grid",
      placeItems: "center",
      border: "0.5px solid var(--hairline)"
    } }, /* @__PURE__ */ React.createElement(IconSparkle, { size: 28, stroke: "var(--ink-mute)" })), /* @__PURE__ */ React.createElement("div", { className: "serif", style: { fontSize: 22, color: "var(--ink)" } }, window.isRTL ? "لا توجد بيانات كافية حالياً" : "No data yet"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13.5, color: "var(--ink-mute)", lineHeight: 1.5, maxWidth: 240 } }, window.isRTL ? "ابدأ بإضافة مصروفاتك لتظهر لك الرسوم البيانية والإحصاءات هنا" : "Add expenses to see analytics here"), /* @__PURE__ */ React.createElement("button", { onClick: () => go("budget"), style: {
      marginTop: 6,
      padding: "12px 22px",
      borderRadius: 14,
      background: "var(--statement)",
      color: "var(--statement-fg)",
      fontSize: 13.5,
      fontWeight: 500
    } }, window.isRTL ? "← سجل المصروفات" : "Go to Budget →")));
  }
  return /* @__PURE__ */ React.createElement("div", { "data-screen-label": "06 Trip Analytics", style: {
    background: "var(--cream)",
    minHeight: "100%",
    paddingBottom: 100
  } }, /* @__PURE__ */ React.createElement(Header, { title: t("statsNav"), onBack: () => go("hub") }), /* @__PURE__ */ React.createElement("div", { style: { padding: "0 14px" } }, /* @__PURE__ */ React.createElement("div", { style: {
    background: "var(--statement)",
    color: "var(--statement-fg)",
    borderRadius: 28,
    padding: "22px",
    position: "relative",
    overflow: "hidden",
    boxShadow: "var(--shadow-card)"
  } }, /* @__PURE__ */ React.createElement("div", { style: {
    position: "absolute",
    inset: 0,
    background: "radial-gradient(60% 50% at 90% 0%, oklch(0.42 0.10 260 / 0.5) 0%, transparent 60%)"
  } }), /* @__PURE__ */ React.createElement("div", { style: {
    position: "relative",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    flexDirection: "row"
  } }, /* @__PURE__ */ React.createElement("div", { style: { flex: 1, minWidth: 0 } }, /* @__PURE__ */ React.createElement("div", { style: {
    fontSize: 17,
    lineHeight: 1.5,
    color: "var(--statement-sub)",
    fontWeight: 400
  } }, window.isRTL ? dailyPlan > 0 ? /* @__PURE__ */ React.createElement(React.Fragment, null, "معدل إنفاقك اليومي ", /* @__PURE__ */ React.createElement(AnaNum, null, fmtC(dailyAvg)), "، بينما المخطط له ", /* @__PURE__ */ React.createElement(AnaNum, { dim: true }, fmtC(dailyPlan)), " (أي بنسبة إنجاز", " ", /* @__PURE__ */ React.createElement("span", { style: {
    color: burnPct > 0 ? "oklch(0.78 0.13 30)" : "oklch(0.78 0.13 145)",
    fontWeight: 600
  } }, burnPct > 0 ? "+" : "", burnPct.toFixed(0), "%"), ").") : /* @__PURE__ */ React.createElement(React.Fragment, null, "معدل إنفاقك اليومي حالياً: ", /* @__PURE__ */ React.createElement(AnaNum, null, fmtC(dailyAvg)), ".") : dailyPlan > 0 ? /* @__PURE__ */ React.createElement(React.Fragment, null, "You're spending ", /* @__PURE__ */ React.createElement(AnaNum, null, fmtC(dailyAvg)), " a day, ", /* @__PURE__ */ React.createElement(AnaNum, { dim: true }, fmtC(dailyPlan)), " planned.", " ", /* @__PURE__ */ React.createElement("span", { style: {
    color: burnPct > 0 ? "oklch(0.78 0.13 30)" : "oklch(0.78 0.13 145)",
    fontWeight: 600
  } }, burnPct > 0 ? "+" : "", burnPct.toFixed(0), "%")) : /* @__PURE__ */ React.createElement(React.Fragment, null, "You're spending ", /* @__PURE__ */ React.createElement(AnaNum, null, fmtC(dailyAvg)), " a day."))), /* @__PURE__ */ React.createElement("div", { style: {
    padding: "6px 10px",
    borderRadius: 10,
    background: "rgba(255,255,255,0.08)",
    border: "0.5px solid rgba(255,255,255,0.1)",
    fontSize: 11,
    fontWeight: 500
  } }, daysElapsed, " / ", daysTotal, " ", window.isRTL ? "أيام الرحلة" : "days")), allDays.length > 0 && (() => {
    var _a2, _b2;
    const cumByDay = [];
    let running = 0;
    allDays.forEach((iso) => {
      running += dailyByISO[iso] || 0;
      cumByDay.push(running);
    });
    const cumMax = Math.max(running, ((_a2 = trip == null ? void 0 : trip.budget) == null ? void 0 : _a2.plannedUSD) || 0, 1);
    const plannedY = ((_b2 = trip == null ? void 0 : trip.budget) == null ? void 0 : _b2.plannedUSD) ? 100 - trip.budget.plannedUSD / cumMax * 100 : null;
    const barWidth = 18;
    const barGap = 5;
    const slot = barWidth + barGap;
    const totalWidth = Math.max(allDays.length * slot - barGap, 100);
    const BARS_H = 64;
    return /* @__PURE__ */ React.createElement("div", { className: "no-scrollbar", style: {
      position: "relative",
      marginTop: 18,
      overflowX: "auto",
      overflowY: "hidden",
      WebkitOverflowScrolling: "touch"
    } }, /* @__PURE__ */ React.createElement("div", { style: {
      minWidth: "100%",
      width: totalWidth
    } }, /* @__PURE__ */ React.createElement("div", { style: { position: "relative", height: BARS_H } }, plannedY !== null && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { style: {
      position: "absolute",
      left: 0,
      right: 0,
      top: `${plannedY}%`,
      borderTop: "1px dashed rgba(255,255,255,0.5)",
      pointerEvents: "none",
      zIndex: 2
    } }), /* @__PURE__ */ React.createElement("div", { style: {
      position: "absolute",
      insetInlineEnd: 0,
      top: `${plannedY}%`,
      transform: "translateY(-110%)",
      fontSize: 9,
      color: "rgba(255,255,255,0.7)",
      padding: "0 2px",
      zIndex: 3
    } }, window.isRTL ? "الميزانية المحددة" : "budget")), /* @__PURE__ */ React.createElement(
      "svg",
      {
        width: totalWidth,
        height: BARS_H,
        viewBox: `0 0 ${totalWidth} ${BARS_H}`,
        style: { position: "absolute", left: 0, top: 0, pointerEvents: "none", zIndex: 1 }
      },
      /* @__PURE__ */ React.createElement(
        "polyline",
        {
          fill: "none",
          stroke: "var(--clay)",
          strokeWidth: "1.75",
          strokeLinecap: "round",
          strokeLinejoin: "round",
          points: cumByDay.map((c, i) => {
            const x = i * slot + barWidth / 2;
            const y = BARS_H - c / cumMax * (BARS_H - 4);
            return `${x},${y}`;
          }).join(" ")
        }
      )
    ), /* @__PURE__ */ React.createElement("div", { style: {
      display: "flex",
      alignItems: "flex-end",
      gap: barGap,
      height: "100%",
      position: "relative",
      zIndex: 0
    } }, allDays.map((iso, i) => {
      const val = dailyByISO[iso] || 0;
      const isPeak = iso === peakISO && val > 0;
      const isSelected = iso === selectedDay;
      const heightPct = val > 0 ? Math.max(val / dailyMax * 88, 9) : 5;
      return /* @__PURE__ */ React.createElement(
        "button",
        {
          key: iso,
          onClick: () => setSelectedDay((cur) => cur === iso ? null : iso),
          "aria-label": `Day ${i + 1}`,
          style: {
            all: "unset",
            cursor: "pointer",
            flex: "0 0 auto",
            width: barWidth,
            height: "100%",
            display: "flex",
            alignItems: "flex-end"
          }
        },
        /* @__PURE__ */ React.createElement("div", { style: {
          width: "100%",
          height: `${heightPct}%`,
          // Non-peak bars opacity bumped 0.32 -> 0.45
          // for readable contrast against the dark
          // statement card. Zero-spend day is a thin
          // marker, not a faint ghost.
          background: val === 0 ? "rgba(255,255,255,0.18)" : isSelected ? "#fff" : isPeak ? "var(--clay)" : "rgba(255,255,255,0.45)",
          borderRadius: "3px 3px 0 0",
          outline: isSelected ? "1.5px solid var(--clay)" : "none",
          // Background animates on tap-select. Height
          // is data-driven (changes only on re-render,
          // not via CSS transition) so animating it
          // would just trigger layout reflow per frame.
          transition: "background 160ms"
        } })
      );
    })), /* @__PURE__ */ React.createElement("div", { style: {
      position: "absolute",
      left: 0,
      right: 0,
      bottom: 0,
      height: 1,
      background: "rgba(255,255,255,0.30)",
      pointerEvents: "none",
      zIndex: 4
    } })), /* @__PURE__ */ React.createElement("div", { style: {
      display: "flex",
      gap: barGap,
      marginTop: 6
    } }, allDays.map((iso, i) => {
      const dayNum = i + 1;
      const isSelected = iso === selectedDay;
      const labelEvery = allDays.length <= 7 ? 1 : allDays.length <= 14 ? 2 : 5;
      const showLabel = dayNum === 1 || dayNum === allDays.length || dayNum % labelEvery === 0;
      return /* @__PURE__ */ React.createElement("div", { key: iso, style: {
        flex: "0 0 auto",
        width: barWidth,
        textAlign: "center",
        height: 13,
        fontSize: 9,
        fontFamily: "var(--mono)",
        whiteSpace: "nowrap",
        color: isSelected ? "var(--clay)" : "rgba(255,255,255,0.65)",
        fontWeight: isSelected ? 700 : 500
      } }, showLabel ? dayNum : "");
    }))), /* @__PURE__ */ React.createElement("div", { style: {
      marginTop: 8,
      display: "flex",
      gap: 12,
      flexDirection: "row",
      flexWrap: "wrap",
      fontSize: 10.5,
      color: "rgba(255,255,255,0.65)"
    } }, /* @__PURE__ */ React.createElement("span", { style: { display: "inline-flex", alignItems: "center", gap: 5 } }, /* @__PURE__ */ React.createElement("span", { style: { width: 8, height: 8, borderRadius: 2, background: "rgba(255,255,255,0.32)" } }), window.isRTL ? "يومي" : "daily"), /* @__PURE__ */ React.createElement("span", { style: { display: "inline-flex", alignItems: "center", gap: 5 } }, /* @__PURE__ */ React.createElement("span", { style: { width: 12, height: 2, background: "var(--clay)" } }), window.isRTL ? "تراكمي" : "running total"), plannedY !== null && /* @__PURE__ */ React.createElement("span", { style: { display: "inline-flex", alignItems: "center", gap: 5 } }, /* @__PURE__ */ React.createElement("span", { style: { width: 12, height: 1, borderTop: "1px dashed rgba(255,255,255,0.45)" } }), window.isRTL ? "الميزانية" : "budget"), maxDay.val > 0 && /* @__PURE__ */ React.createElement("span", { style: {
      marginInlineStart: "auto",
      color: "rgba(255,255,255,0.85)",
      fontWeight: 500
    } }, window.isRTL ? `أعلى ذروة إنفاق: ${fmtC(maxDay.val)}` : `Peak: ${fmtC(maxDay.val)}`)), selectedDay && (() => {
      const val = dailyByISO[selectedDay] || 0;
      const catMix = dailyByISOCats[selectedDay] || {};
      const dayNum = allDays.indexOf(selectedDay) + 1;
      const d = /* @__PURE__ */ new Date(selectedDay + "T00:00:00");
      const dateStr = d.toLocaleDateString(
        window.isRTL ? "ar" : "en",
        { weekday: "short", month: "short", day: "numeric" }
      );
      const sortedCats = Object.entries(catMix).sort((a, b) => b[1] - a[1]);
      return /* @__PURE__ */ React.createElement("div", { style: {
        marginTop: 12,
        padding: "12px 14px",
        borderRadius: 14,
        background: "rgba(255,255,255,0.10)",
        border: "0.5px solid rgba(255,255,255,0.18)"
      } }, /* @__PURE__ */ React.createElement("div", { style: {
        display: "flex",
        alignItems: "baseline",
        justifyContent: "space-between",
        gap: 8,
        flexDirection: "row"
      } }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "serif", style: { fontSize: 18, lineHeight: 1.1 } }, window.isRTL ? `تفاصيل اليوم ${dayNum}` : `Day ${dayNum}`), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, opacity: 0.72, marginTop: 2, fontFamily: "var(--mono)" } }, dateStr)), /* @__PURE__ */ React.createElement("div", { className: "mono", style: {
        fontSize: 22,
        fontWeight: 600
      } }, fmtC(val))), sortedCats.length > 0 ? /* @__PURE__ */ React.createElement("div", { style: { marginTop: 10, display: "flex", flexDirection: "column", gap: 5 } }, sortedCats.slice(0, 4).map(([k, v]) => {
        const c = cats.find((x) => x.key === k);
        const pct = val > 0 ? v / val * 100 : 0;
        return /* @__PURE__ */ React.createElement("div", { key: k, style: {
          display: "flex",
          alignItems: "center",
          gap: 8,
          flexDirection: "row"
        } }, /* @__PURE__ */ React.createElement("span", { style: {
          width: 8,
          height: 8,
          borderRadius: 2,
          background: (c == null ? void 0 : c.color) || "rgba(255,255,255,0.4)",
          flexShrink: 0
        } }), /* @__PURE__ */ React.createElement("span", { style: { flex: 1, fontSize: 12, opacity: 0.85 } }, (c == null ? void 0 : c.label) || k), /* @__PURE__ */ React.createElement("span", { className: "mono", style: { fontSize: 11.5, opacity: 0.72 } }, Math.round(pct), "%"), /* @__PURE__ */ React.createElement("span", { className: "mono", style: { fontSize: 11.5, fontWeight: 500, minWidth: 50, textAlign: "end" } }, fmtC(v)));
      })) : /* @__PURE__ */ React.createElement("div", { style: { marginTop: 8, fontSize: 11.5, opacity: 0.6 } }, window.isRTL ? "لم تُسجل أي مصروفات في هذا اليوم" : "No spending on this day"));
    })());
  })())), topTx && /* @__PURE__ */ React.createElement("div", { style: { padding: "14px 14px 0" } }, /* @__PURE__ */ React.createElement("div", { style: {
    padding: "14px 16px",
    borderRadius: 18,
    background: "var(--cream-2)",
    border: "0.5px solid var(--hairline)",
    display: "flex",
    alignItems: "center",
    gap: 12,
    flexDirection: "row"
  } }, /* @__PURE__ */ React.createElement("div", { style: {
    width: 40,
    height: 40,
    borderRadius: 12,
    flexShrink: 0,
    background: ((_b = cats.find((c) => c.key === topTx.cat)) == null ? void 0 : _b.color) || "var(--clay)",
    display: "grid",
    placeItems: "center",
    fontSize: 18
  } }, "💸"), /* @__PURE__ */ React.createElement("div", { style: { flex: 1, minWidth: 0 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: "var(--ink-mute)" } }, window.isRTL ? "العملية الأعلى إنفاقاً" : "Biggest expense"), /* @__PURE__ */ React.createElement("div", { style: {
    fontSize: 14,
    fontWeight: 500,
    marginTop: 1,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap"
  } }, topTx.title), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: "var(--ink-mute)" } }, topTx.when)), /* @__PURE__ */ React.createElement("div", { className: "mono", style: { fontSize: 17, fontWeight: 600, color: "var(--clay-deep)", flexShrink: 0 } }, fmtC(topTx.usd)))), catTotals.length > 0 && /* @__PURE__ */ React.createElement("div", { style: { padding: "22px 14px 0" } }, /* @__PURE__ */ React.createElement(SectionLabel, null, window.isRTL ? "توزيع المصروفات حسب الفئة" : "By category"), /* @__PURE__ */ React.createElement("div", { style: {
    background: "var(--cream-2)",
    borderRadius: 22,
    padding: "18px",
    margin: "0 8px",
    border: "0.5px solid var(--hairline)",
    display: "flex",
    alignItems: "center",
    gap: 16,
    flexDirection: "row"
  } }, /* @__PURE__ */ React.createElement(PieChart, { data: catTotals, size: 148 }), /* @__PURE__ */ React.createElement("div", { style: { flex: 1, display: "flex", flexDirection: "column", gap: 9 } }, catTotals.map((c) => /* @__PURE__ */ React.createElement("div", { key: c.key, style: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    flexDirection: "row"
  } }, /* @__PURE__ */ React.createElement("span", { style: { width: 10, height: 10, borderRadius: 3, background: c.color, flexShrink: 0 } }), /* @__PURE__ */ React.createElement("span", { style: { flex: 1, fontSize: 12.5, color: "var(--ink-soft)", textAlign: "start" } }, c.label), /* @__PURE__ */ React.createElement("span", { className: "mono", style: { fontSize: 12, fontWeight: 600, color: "var(--ink)" } }, totalUSD > 0 ? Math.round(c.value / totalUSD * 100) : 0, "%"))), /* @__PURE__ */ React.createElement("div", { style: {
    paddingTop: 8,
    borderTop: "0.5px solid var(--hairline)",
    display: "flex",
    justifyContent: "space-between",
    flexDirection: "row"
  } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 12, color: "var(--ink-mute)" } }, window.isRTL ? "المجموع الكلي" : "Total"), /* @__PURE__ */ React.createElement("span", { className: "mono", style: { fontSize: 13, fontWeight: 600 } }, fmtC(totalUSD)))))), contribs.length > 0 && /* @__PURE__ */ React.createElement("div", { style: { padding: "22px 14px 0" } }, /* @__PURE__ */ React.createElement(SectionLabel, null, window.isRTL ? "نسب وتحليلات الدفع" : "Who's paying"), /* @__PURE__ */ React.createElement("div", { style: {
    background: "var(--cream-2)",
    borderRadius: 22,
    padding: "14px 16px",
    margin: "0 8px",
    border: "0.5px solid var(--hairline)"
  } }, contribs.map((m, i) => /* @__PURE__ */ React.createElement("div", { key: m.id, style: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "10px 0",
    borderTop: i ? "0.5px solid var(--hairline)" : "none",
    flexDirection: "row"
  } }, /* @__PURE__ */ React.createElement(Avatar, { m, size: 32 }), /* @__PURE__ */ React.createElement("div", { style: { flex: 1, minWidth: 0 } }, /* @__PURE__ */ React.createElement("div", { style: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "baseline",
    flexDirection: "row"
  } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 13.5, fontWeight: 500 } }, m.name), /* @__PURE__ */ React.createElement("span", { className: "mono", style: { fontSize: 13, fontWeight: 500 } }, fmtC(m.paid))), /* @__PURE__ */ React.createElement("div", { style: { height: 5, marginTop: 5, borderRadius: 3, background: "var(--sand)", overflow: "hidden" } }, /* @__PURE__ */ React.createElement("div", { style: {
    width: `${m.pct}%`,
    height: "100%",
    background: `linear-gradient(90deg, oklch(0.62 0.13 ${m.hue}) 0%, oklch(0.48 0.13 ${m.hue}) 100%)`
  } })), /* @__PURE__ */ React.createElement("div", { style: {
    fontSize: 10,
    color: "var(--ink-mute)",
    marginTop: 3,
    display: "flex",
    justifyContent: "space-between",
    flexDirection: "row"
  } }, /* @__PURE__ */ React.createElement("span", null, m.pct, "% ", window.isRTL ? "من إجمالي المدفوعات" : "of total"))))))), allDays.length > 0 && /* @__PURE__ */ React.createElement("div", { style: { padding: "22px 14px 0" } }, /* @__PURE__ */ React.createElement(SectionLabel, null, window.isRTL ? "التفاصيل يوماً بيوم" : "Day by day"), /* @__PURE__ */ React.createElement("div", { style: {
    background: "var(--cream-2)",
    borderRadius: 22,
    margin: "0 8px",
    overflow: "hidden",
    border: "0.5px solid var(--hairline)"
  } }, allDays.slice().reverse().map((iso, idx) => {
    const val = dailyByISO[iso] || 0;
    const catMix = dailyByISOCats[iso] || {};
    const d = /* @__PURE__ */ new Date(iso + "T00:00:00");
    const dayNum = (trip == null ? void 0 : trip.startDate) ? Math.floor((d - /* @__PURE__ */ new Date(trip.startDate + "T00:00:00")) / 864e5) + 1 : null;
    const weekday = d.toLocaleDateString(window.isRTL ? "ar" : "en", { weekday: "short" });
    const date = d.toLocaleDateString(window.isRTL ? "ar" : "en", { month: "short", day: "numeric" });
    const isToday = iso === (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
    return /* @__PURE__ */ React.createElement("div", { key: iso, style: {
      padding: "11px 14px",
      borderTop: idx ? "0.5px solid var(--hairline)" : "none",
      opacity: val === 0 ? 0.55 : 1,
      display: "flex",
      alignItems: "center",
      gap: 12,
      flexDirection: "row"
    } }, /* @__PURE__ */ React.createElement("div", { style: { minWidth: 64 } }, /* @__PURE__ */ React.createElement("div", { style: {
      fontSize: 12.5,
      fontWeight: 500,
      color: isToday ? "var(--clay-deep)" : "var(--ink)"
    } }, dayNum ? window.isRTL ? `يوم ${dayNum}` : `Day ${dayNum}` : date), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10, color: "var(--ink-mute)", marginTop: 1 } }, weekday, " · ", date)), /* @__PURE__ */ React.createElement("div", { style: { flex: 1, display: "flex", flexDirection: "column", gap: 4 } }, val > 0 ? /* @__PURE__ */ React.createElement("div", { style: {
      height: 6,
      borderRadius: 3,
      overflow: "hidden",
      background: "var(--sand)",
      display: "flex",
      flexDirection: "row"
    } }, cats.map((c) => {
      const cv = catMix[c.key] || 0;
      if (cv === 0) return null;
      return /* @__PURE__ */ React.createElement("div", { key: c.key, style: {
        width: `${cv / val * 100}%`,
        height: "100%",
        background: c.color
      } });
    })) : /* @__PURE__ */ React.createElement("div", { style: {
      height: 6,
      borderRadius: 3,
      background: "var(--hairline)"
    } }), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 9.5, color: "var(--ink-mute)", fontFamily: "var(--mono)" } }, Object.keys(catMix).length === 0 ? window.isRTL ? "لا توجد مصروفات" : "no spend" : Object.entries(catMix).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([k]) => {
      var _a2;
      return ((_a2 = cats.find((c) => c.key === k)) == null ? void 0 : _a2.label) || k;
    }).join(" · "))), /* @__PURE__ */ React.createElement("div", { className: "mono", style: {
      fontSize: 13,
      fontWeight: 500,
      minWidth: 62,
      textAlign: "end",
      color: val === 0 ? "var(--ink-mute)" : "var(--ink)"
    } }, val === 0 ? "—" : fmtC(val)));
  }))), totalUSD > 0 && /* @__PURE__ */ React.createElement("div", { style: { padding: "22px 14px 0" } }, /* @__PURE__ */ React.createElement(SectionLabel, null, window.isRTL ? "وتيرة الإنفاق والتوقعات" : "Pace"), /* @__PURE__ */ React.createElement("div", { style: {
    margin: "0 8px",
    padding: "14px 16px",
    borderRadius: 18,
    background: "var(--cream-2)",
    border: "0.5px solid var(--hairline)",
    fontSize: 15,
    lineHeight: 1.55,
    color: "var(--ink-soft)"
  } }, window.isRTL ? ((_c = trip == null ? void 0 : trip.budget) == null ? void 0 : _c.plannedUSD) ? /* @__PURE__ */ React.createElement(React.Fragment, null, "أنفقت حتى الآن ", /* @__PURE__ */ React.createElement(AnaNum, { solid: true }, fmtC(totalUSD)), " من أصل ", /* @__PURE__ */ React.createElement(AnaNum, { solid: true, dim: true }, fmtC(trip.budget.plannedUSD)), "بمعدل ", /* @__PURE__ */ React.createElement(AnaNum, { solid: true }, fmtC(dailyAvg)), " يومياً. وبهذه الوتيرة، يُتوقع أن تنهي رحلتك بإجمالي إنفاق ", /* @__PURE__ */ React.createElement(AnaNum, { solid: true }, fmtC(dailyAvg * daysTotal)), ".") : /* @__PURE__ */ React.createElement(React.Fragment, null, "أنفقت حتى الآن ", /* @__PURE__ */ React.createElement(AnaNum, { solid: true }, fmtC(totalUSD)), " بمعدل ", /* @__PURE__ */ React.createElement(AnaNum, { solid: true }, fmtC(dailyAvg)), " يومياً. وبهذه الوتيرة، يُتوقع أن تنهي رحلتك بإجمالي إنفاق ", /* @__PURE__ */ React.createElement(AnaNum, { solid: true }, fmtC(dailyAvg * daysTotal)), ".") : ((_d = trip == null ? void 0 : trip.budget) == null ? void 0 : _d.plannedUSD) ? /* @__PURE__ */ React.createElement(React.Fragment, null, "Spent ", /* @__PURE__ */ React.createElement(AnaNum, { solid: true }, fmtC(totalUSD)), " of ", /* @__PURE__ */ React.createElement(AnaNum, { solid: true, dim: true }, fmtC(trip.budget.plannedUSD)), " planned, averaging ", /* @__PURE__ */ React.createElement(AnaNum, { solid: true }, fmtC(dailyAvg)), " a day. At this pace you'll end on ", /* @__PURE__ */ React.createElement(AnaNum, { solid: true }, fmtC(dailyAvg * daysTotal)), ".") : /* @__PURE__ */ React.createElement(React.Fragment, null, "Spent ", /* @__PURE__ */ React.createElement(AnaNum, { solid: true }, fmtC(totalUSD)), ", averaging ", /* @__PURE__ */ React.createElement(AnaNum, { solid: true }, fmtC(dailyAvg)), " a day. At this pace you'll end on ", /* @__PURE__ */ React.createElement(AnaNum, { solid: true }, fmtC(dailyAvg * daysTotal)), "."))));
}
function AnaNum({ children, solid, dim }) {
  const color = solid ? dim ? "var(--ink-mute)" : "var(--ink)" : dim ? "rgba(255,251,244,0.55)" : "var(--statement-fg)";
  return /* @__PURE__ */ React.createElement("span", { className: "mono", style: {
    fontWeight: dim ? 500 : 700,
    fontSize: "1.15em",
    color,
    letterSpacing: "-0.01em"
  } }, children);
}
window.ScreenAnalytics = ScreenAnalytics;
function ScreenDocs({ go, openSheet, openDoc, loading }) {
  const [view, setView] = React.useState("grid");
  const [filter, setFilter] = React.useState("all");
  const [sortBy, setSortBy] = React.useState("newest");
  const [showSearch, setShowSearch] = React.useState(false);
  const [search, setSearch] = React.useState("");
  if (loading) {
    return /* @__PURE__ */ React.createElement("div", { style: { background: "var(--cream)", minHeight: "100%" } }, /* @__PURE__ */ React.createElement(TripSkeleton, null));
  }
  const CAT_KEY_TO_T = {
    flights: "docFlights",
    lodging: "docLodging",
    visas: "docVisas",
    transport: "docTransport"
  };
  const localizedLabel = (key, fallback) => {
    const tKey = CAT_KEY_TO_T[key];
    return tKey ? t(tKey) : fallback || key;
  };
  const cats = (window.DOC_CATEGORIES || []).map((c) => ({
    ...c,
    label: localizedLabel(c.key, c.label)
  }));
  const docsByCat = window.DOCS_BY_CAT || {};
  const allDocs = cats.flatMap(
    (c) => (docsByCat[c.key] || []).map((d) => ({ ...d, category: c.key, categoryLabel: c.label, tint: d.tint || c.tint }))
  );
  const visible = allDocs.filter((d) => filter === "all" || d.category === filter).filter((d) => !search || (d.title || "").toLowerCase().includes(search.toLowerCase()) || (d.sub || "").toLowerCase().includes(search.toLowerCase())).sort((a, b) => {
    if (sortBy === "name") return (a.title || "").localeCompare(b.title || "");
    if (sortBy === "category") return (a.categoryLabel || "").localeCompare(b.categoryLabel || "");
    return 0;
  });
  const totalCount = allDocs.length;
  const filteredCount = visible.length;
  return /* @__PURE__ */ React.createElement("div", { "data-screen-label": "Vault", style: {
    background: "var(--cream)",
    minHeight: "100%",
    paddingBottom: 100
  } }, /* @__PURE__ */ React.createElement("div", { style: {
    position: "sticky",
    top: 0,
    zIndex: 10,
    padding: "max(54px, calc(env(safe-area-inset-top) + 14px)) 18px 12px",
    background: "linear-gradient(180deg, var(--cream) 90%, transparent)",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10
  } }, /* @__PURE__ */ React.createElement("button", { onClick: () => go("hub"), style: {
    width: 36,
    height: 36,
    borderRadius: 999,
    background: "var(--cream-2)",
    border: "0.5px solid var(--hairline)",
    display: "grid",
    placeItems: "center"
  } }, /* @__PURE__ */ React.createElement("span", { className: "icon-flip" }, /* @__PURE__ */ React.createElement(IconBack, { size: 17, stroke: "var(--ink)" }))), /* @__PURE__ */ React.createElement("div", { className: "serif", style: { fontSize: 22, color: "var(--ink)", flex: 1, textAlign: "center" } }, t("vault")), /* @__PURE__ */ React.createElement("button", { onClick: () => setShowSearch(!showSearch), style: {
    width: 36,
    height: 36,
    borderRadius: 999,
    background: showSearch ? "var(--ink)" : "var(--cream-2)",
    border: "0.5px solid var(--hairline)",
    display: "grid",
    placeItems: "center"
  } }, /* @__PURE__ */ React.createElement(IconSearch, { size: 15, stroke: showSearch ? "var(--cream)" : "var(--ink-soft)" }))), showSearch && /* @__PURE__ */ React.createElement("div", { style: { padding: "0 18px 10px" } }, /* @__PURE__ */ React.createElement(
    "input",
    {
      autoFocus: true,
      value: search,
      onChange: (e) => setSearch(e.target.value),
      placeholder: window.isRTL ? "ابحث في مستنداتك..." : "Search documents...",
      style: {
        width: "100%",
        padding: "11px 14px",
        borderRadius: 12,
        border: "1px solid var(--hairline-2)",
        background: "var(--cream-2)",
        color: "var(--ink)",
        fontSize: 14,
        outline: "none",
        textAlign: "start"
      }
    }
  )), /* @__PURE__ */ React.createElement("div", { style: {
    padding: "0 14px 12px",
    display: "flex",
    flexDirection: "column",
    gap: 10
  } }, /* @__PURE__ */ React.createElement("div", { className: "no-scrollbar", style: {
    display: "flex",
    gap: 6,
    overflowX: "auto",
    paddingInlineStart: 4,
    paddingInlineEnd: 4
  } }, /* @__PURE__ */ React.createElement(Chip, { active: filter === "all", onClick: () => setFilter("all") }, t("all"), " · ", totalCount), cats.map((c) => {
    const count = (docsByCat[c.key] || []).length;
    return /* @__PURE__ */ React.createElement(Chip, { key: c.key, active: filter === c.key, onClick: () => setFilter(c.key) }, c.label, " · ", count);
  })), /* @__PURE__ */ React.createElement("div", { style: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    paddingInlineStart: 4,
    paddingInlineEnd: 4
  } }, /* @__PURE__ */ React.createElement(SortMenu, { sortBy, onChange: setSortBy }), /* @__PURE__ */ React.createElement(ViewToggle, { view, onChange: setView }))), totalCount === 0 && /* @__PURE__ */ React.createElement(EmptyVault, { onAdd: () => openSheet == null ? void 0 : openSheet("addDoc") }), totalCount > 0 && filteredCount === 0 && (() => {
    var _a;
    const isCategoryFilter = filter !== "all" && !search;
    const catLabel = isCategoryFilter ? ((_a = cats.find((c) => c.key === filter)) == null ? void 0 : _a.label) || filter : null;
    return /* @__PURE__ */ React.createElement("div", { style: {
      padding: "32px 24px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      textAlign: "center",
      gap: 12
    } }, /* @__PURE__ */ React.createElement("div", { style: {
      width: 56,
      height: 56,
      borderRadius: 16,
      background: "var(--cream-2)",
      display: "grid",
      placeItems: "center",
      border: "0.5px solid var(--hairline)"
    } }, /* @__PURE__ */ React.createElement(IconDoc, { size: 24, stroke: "var(--ink-mute)" })), /* @__PURE__ */ React.createElement("div", { className: "serif", style: { fontSize: 17, color: "var(--ink)" } }, isCategoryFilter ? window.isRTL ? `لا توجد مستندات مسجلة في فئة ${catLabel}` : `No ${catLabel} yet` : window.isRTL ? "لم نجد أي نتائج تطابق بحثك" : "No matching documents"), /* @__PURE__ */ React.createElement("div", { style: {
      display: "flex",
      gap: 8,
      flexDirection: "row"
    } }, isCategoryFilter && /* @__PURE__ */ React.createElement("button", { onClick: () => openSheet == null ? void 0 : openSheet("addDoc"), style: {
      padding: "9px 16px",
      borderRadius: 999,
      fontSize: 12.5,
      fontWeight: 600,
      background: "var(--clay)",
      color: "#fff",
      border: "none",
      display: "inline-flex",
      alignItems: "center",
      gap: 6,
      flexDirection: "row",
      boxShadow: "0 4px 12px oklch(0.62 0.13 35 / 0.35)"
    } }, /* @__PURE__ */ React.createElement(IconPlus, { size: 12, stroke: "currentColor" }), window.isRTL ? `أضف مستنداً إلى ${catLabel}` : `Add ${catLabel}`), /* @__PURE__ */ React.createElement("button", { onClick: () => {
      setFilter("all");
      setSearch("");
    }, style: {
      padding: "9px 14px",
      borderRadius: 999,
      fontSize: 12.5,
      fontWeight: 500,
      background: "var(--cream-2)",
      border: "0.5px solid var(--hairline)",
      color: "var(--ink-soft)"
    } }, window.isRTL ? "كل المستندات" : "Show all")));
  })(), filteredCount > 0 && (view === "grid" ? /* @__PURE__ */ React.createElement("div", { style: {
    padding: "0 14px",
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: 12
  } }, visible.map((d) => /* @__PURE__ */ React.createElement(DocTileGrid, { key: d.id, doc: d, onOpen: () => openDoc == null ? void 0 : openDoc(d, cats.find((c) => c.key === d.category)) })), /* @__PURE__ */ React.createElement("button", { onClick: () => openSheet == null ? void 0 : openSheet("addDoc"), style: {
    aspectRatio: "0.78",
    borderRadius: 16,
    border: "1.5px dashed var(--hairline-2)",
    background: "transparent",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    color: "var(--ink-mute)"
  } }, /* @__PURE__ */ React.createElement("div", { style: {
    width: 36,
    height: 36,
    borderRadius: 10,
    background: "var(--cream-2)",
    display: "grid",
    placeItems: "center",
    border: "0.5px solid var(--hairline)"
  } }, /* @__PURE__ */ React.createElement(IconPlus, { size: 18, stroke: "var(--ink-soft)" })), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11.5, fontWeight: 500 } }, window.isRTL ? "إضافة مستند" : "Add"))) : /* @__PURE__ */ React.createElement("div", { style: {
    padding: "0 14px",
    display: "flex",
    flexDirection: "column",
    gap: 0,
    background: "var(--cream-2)",
    borderRadius: 18,
    margin: "0 14px",
    border: "0.5px solid var(--hairline)",
    overflow: "hidden"
  } }, visible.map((d, i) => /* @__PURE__ */ React.createElement(
    window.SwipeRow,
    {
      key: d.id,
      actions: [{ key: "delete", bg: "var(--clay)", icon: /* @__PURE__ */ React.createElement(window.IconTrash, { size: 18, stroke: "#fff" }) }],
      onAction: async (key) => {
        var _a, _b, _c, _d;
        if (key !== "delete") return;
        if (!confirm(window.isRTL ? `هل تريد حذف مستند "${d.title}"؟` : `Delete "${d.title}"?`)) return;
        try {
          await window.deleteDocument(d.id, (_a = window.TRIP) == null ? void 0 : _a.id, d.title);
          await window.loadDocuments((_b = window.TRIP) == null ? void 0 : _b.id);
          (_c = window.toast) == null ? void 0 : _c.call(window, window.isRTL ? "تم حذف المستند بنجاح" : "Deleted", "success");
        } catch (err) {
          (_d = window.toast) == null ? void 0 : _d.call(window, err.message || "Failed", "error");
        }
      }
    },
    /* @__PURE__ */ React.createElement(
      DocRowList,
      {
        doc: d,
        last: i === visible.length - 1,
        onOpen: () => openDoc == null ? void 0 : openDoc(d, cats.find((c) => c.key === d.category))
      }
    )
  )))), /* @__PURE__ */ React.createElement("button", { onClick: () => openSheet == null ? void 0 : openSheet("addDoc"), style: {
    position: "fixed",
    bottom: "calc(env(safe-area-inset-bottom) + 86px)",
    insetInlineEnd: 22,
    width: 54,
    height: 54,
    borderRadius: 999,
    background: "var(--clay)",
    color: "#fff",
    display: "grid",
    placeItems: "center",
    boxShadow: "0 12px 24px oklch(0.62 0.13 35 / 0.4)",
    zIndex: 30
  } }, /* @__PURE__ */ React.createElement(IconPlus, { size: 24, stroke: "#fff" })));
}
function ViewToggle({ view, onChange }) {
  return /* @__PURE__ */ React.createElement("div", { style: {
    display: "inline-flex",
    padding: 3,
    gap: 2,
    background: "var(--cream-2)",
    borderRadius: 12,
    border: "0.5px solid var(--hairline)"
  } }, [
    { v: "grid", icon: /* @__PURE__ */ React.createElement(GridIcon, null), l: window.isRTL ? "عرض كشبكة" : "Grid" },
    { v: "list", icon: /* @__PURE__ */ React.createElement(ListIcon, null), l: window.isRTL ? "عرض كقائمة" : "List" }
  ].map(({ v, icon, l }) => (
    // Was 32x28 — below iOS HIG thumb-zone floor. Now 36x32 for
    // breathing room and aria-label for screen readers.
    /* @__PURE__ */ React.createElement(
      "button",
      {
        key: v,
        onClick: () => onChange(v),
        "aria-label": l,
        style: {
          width: 36,
          height: 32,
          borderRadius: 9,
          background: view === v ? "var(--ink)" : "transparent",
          color: view === v ? "var(--cream)" : "var(--ink-soft)",
          display: "grid",
          placeItems: "center"
        }
      },
      icon
    )
  )));
}
function GridIcon() {
  return /* @__PURE__ */ React.createElement("svg", { width: "14", height: "14", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }, /* @__PURE__ */ React.createElement("rect", { x: "3", y: "3", width: "7", height: "7", rx: "1" }), /* @__PURE__ */ React.createElement("rect", { x: "14", y: "3", width: "7", height: "7", rx: "1" }), /* @__PURE__ */ React.createElement("rect", { x: "3", y: "14", width: "7", height: "7", rx: "1" }), /* @__PURE__ */ React.createElement("rect", { x: "14", y: "14", width: "7", height: "7", rx: "1" }));
}
function ListIcon() {
  return /* @__PURE__ */ React.createElement("svg", { width: "14", height: "14", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }, /* @__PURE__ */ React.createElement("line", { x1: "8", y1: "6", x2: "21", y2: "6" }), /* @__PURE__ */ React.createElement("line", { x1: "8", y1: "12", x2: "21", y2: "12" }), /* @__PURE__ */ React.createElement("line", { x1: "8", y1: "18", x2: "21", y2: "18" }), /* @__PURE__ */ React.createElement("circle", { cx: "4", cy: "6", r: "1.5" }), /* @__PURE__ */ React.createElement("circle", { cx: "4", cy: "12", r: "1.5" }), /* @__PURE__ */ React.createElement("circle", { cx: "4", cy: "18", r: "1.5" }));
}
function SortMenu({ sortBy, onChange }) {
  const [open, setOpen] = React.useState(false);
  const opts = [
    { k: "newest", l: window.isRTL ? "الأحدث تاريخاً" : "Newest" },
    { k: "name", l: window.isRTL ? "الترتيب الأبجدي" : "Name" },
    { k: "category", l: window.isRTL ? "حسب الفئة" : "Category" }
  ];
  const current = opts.find((o) => o.k === sortBy);
  return /* @__PURE__ */ React.createElement("div", { style: { position: "relative" } }, /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: () => setOpen(!open),
      "aria-label": window.isRTL ? `ترتيب حسب: ${current == null ? void 0 : current.l}` : `Sort: ${current == null ? void 0 : current.l}`,
      style: {
        padding: "6px 12px",
        borderRadius: 12,
        fontSize: 12,
        fontWeight: 500,
        background: "var(--cream-2)",
        border: "0.5px solid var(--hairline)",
        color: "var(--ink-soft)",
        display: "inline-flex",
        alignItems: "center",
        gap: 6
      }
    },
    /* @__PURE__ */ React.createElement("span", { style: { color: "var(--ink-mute)" } }, window.isRTL ? "ترتيب حسب" : "Sort", ":"),
    /* @__PURE__ */ React.createElement("span", { style: { color: "var(--ink)" } }, current == null ? void 0 : current.l),
    /* @__PURE__ */ React.createElement("span", { style: {
      display: "inline-grid",
      placeItems: "center",
      transform: open ? "rotate(180deg)" : "rotate(0deg)",
      transition: "transform 180ms"
    } }, /* @__PURE__ */ React.createElement("svg", { width: "9", height: "9", viewBox: "0 0 9 9", fill: "none", stroke: "currentColor", strokeWidth: "1.6" }, /* @__PURE__ */ React.createElement("path", { d: "M1.5 3 L4.5 6 L7.5 3", strokeLinecap: "round", strokeLinejoin: "round" })))
  ), open && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { onClick: () => setOpen(false), style: { position: "fixed", inset: 0, zIndex: 40 } }), /* @__PURE__ */ React.createElement("div", { style: {
    position: "absolute",
    top: "calc(100% + 6px)",
    insetInlineStart: 0,
    zIndex: 41,
    background: "var(--cream)",
    borderRadius: 12,
    padding: 4,
    minWidth: 140,
    boxShadow: "var(--shadow-lg)",
    border: "0.5px solid var(--hairline)"
  } }, opts.map((o) => /* @__PURE__ */ React.createElement("button", { key: o.k, onClick: () => {
    onChange(o.k);
    setOpen(false);
  }, style: {
    width: "100%",
    padding: "8px 10px",
    borderRadius: 8,
    textAlign: "start",
    background: o.k === sortBy ? "var(--sand)" : "transparent",
    fontSize: 12.5,
    color: "var(--ink)",
    display: "flex",
    alignItems: "center",
    gap: 8
  } }, o.k === sortBy && /* @__PURE__ */ React.createElement(IconCheck, { size: 11, stroke: "var(--ink)" }), /* @__PURE__ */ React.createElement("span", { style: { flex: 1 } }, o.l))))));
}
function docStatus(doc) {
  if (doc.filePath) return "synced";
  if (doc.link) return "link";
  return "pending";
}
function StatusDot({ status }) {
  const map = {
    synced: { color: "var(--moss)", label: window.isRTL ? "تم الحفظ" : "Synced" },
    link: { color: "var(--indigo)", label: window.isRTL ? "رابط ويب" : "Link" },
    pending: { color: "var(--ink-mute)", label: window.isRTL ? "بانتظار الرفع" : "No file" }
  };
  const s = map[status];
  return /* @__PURE__ */ React.createElement("div", { title: s.label, style: {
    display: "inline-flex",
    alignItems: "center",
    gap: 4
  } }, /* @__PURE__ */ React.createElement("span", { style: { width: 7, height: 7, borderRadius: 999, background: s.color, flexShrink: 0 } }), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 10.5, color: "var(--ink-mute)" } }, s.label));
}
function fmtDocCost(doc) {
  if (doc.costUSD == null) return null;
  if (doc.costCurrency && doc.costLocal != null) {
    return `${doc.costCurrency} ${Math.round(doc.costLocal).toLocaleString()}`;
  }
  return `$${Math.round(doc.costUSD).toLocaleString()}`;
}
function docOwnerName(doc) {
  var _a;
  if (!doc.ownerUserId) return null;
  const members = window.MEMBERS || [];
  if (members.length <= 1) return null;
  const m = members.find((x) => x.id === doc.ownerUserId);
  return ((_a = m == null ? void 0 : m.name) == null ? void 0 : _a.split(" ")[0]) || null;
}
function tintColor(tint) {
  return {
    indigo: "var(--indigo)",
    moss: "var(--moss)",
    clay: "var(--clay)",
    honey: "var(--honey)"
  }[tint] || "var(--clay)";
}
function DocTileGrid({ doc, onOpen }) {
  var _a;
  const status = docStatus(doc);
  const Icon = doc.kind === "pdf" ? IconPdf : IconImg;
  const tint = tintColor(doc.tint);
  return /* @__PURE__ */ React.createElement("button", { onClick: onOpen, style: {
    all: "unset",
    cursor: "pointer",
    display: "block",
    borderRadius: 16,
    overflow: "hidden",
    background: "var(--cream-2)",
    border: "0.5px solid var(--hairline)",
    boxShadow: "var(--shadow-sm)"
  } }, /* @__PURE__ */ React.createElement("div", { style: {
    aspectRatio: doc.coverUrl ? "1" : "1.3",
    background: doc.coverUrl ? "var(--cream-2)" : `linear-gradient(155deg, color-mix(in oklch, ${tint} 18%, var(--cream-2)) 0%, color-mix(in oklch, ${tint} 8%, var(--cream-2)) 100%)`,
    backgroundImage: doc.coverUrl ? `url(${doc.coverUrl})` : void 0,
    backgroundSize: "cover",
    backgroundPosition: "center",
    position: "relative",
    display: "grid",
    placeItems: "center",
    borderBottom: "0.5px solid var(--hairline)"
  } }, !doc.coverUrl && /* @__PURE__ */ React.createElement("div", { style: {
    width: 48,
    height: 48,
    borderRadius: 12,
    background: tint,
    display: "grid",
    placeItems: "center",
    boxShadow: "0 4px 12px rgba(0,0,0,0.18)"
  } }, /* @__PURE__ */ React.createElement(Icon, { size: 22, stroke: "#fff" })), /* @__PURE__ */ React.createElement("div", { style: {
    position: "absolute",
    top: 8,
    insetInlineEnd: 8,
    padding: "2px 6px",
    borderRadius: 6,
    background: "rgba(0,0,0,0.55)",
    color: "#fff",
    fontSize: 9,
    fontFamily: "var(--mono)",
    letterSpacing: "0.06em",
    fontWeight: 600
  } }, (doc.kind || "doc").toUpperCase())), /* @__PURE__ */ React.createElement("div", { style: { padding: "10px 12px 12px", minHeight: 72 } }, /* @__PURE__ */ React.createElement("div", { style: {
    fontSize: 12.5,
    fontWeight: 500,
    color: "var(--ink)",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap"
  } }, doc.title || "—"), /* @__PURE__ */ React.createElement("div", { style: {
    fontSize: 10.5,
    color: "var(--ink-mute)",
    marginTop: 3,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap"
  } }, ((_a = window.fmtDocSummary) == null ? void 0 : _a.call(window, doc)) || doc.categoryLabel), docOwnerName(doc) && /* @__PURE__ */ React.createElement("div", { style: {
    marginTop: 5,
    display: "inline-flex",
    alignItems: "center",
    gap: 4,
    padding: "2px 8px",
    borderRadius: 999,
    background: "var(--cream)",
    border: "0.5px solid var(--hairline-2)",
    fontSize: 9.5,
    fontWeight: 600,
    color: "var(--ink-soft)"
  } }, window.isRTL ? `لـ ${docOwnerName(doc)}` : `For ${docOwnerName(doc)}`), /* @__PURE__ */ React.createElement("div", { style: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 6,
    gap: 6
  } }, /* @__PURE__ */ React.createElement(StatusDot, { status }), fmtDocCost(doc) && /* @__PURE__ */ React.createElement("span", { className: "mono", style: {
    fontSize: 10,
    fontWeight: 600,
    color: doc.linkedExpenseId ? "var(--moss)" : "var(--ink-soft)",
    display: "inline-flex",
    alignItems: "center",
    gap: 3
  } }, doc.linkedExpenseId && /* @__PURE__ */ React.createElement(IconCheck, { size: 10, stroke: "currentColor" }), fmtDocCost(doc)))));
}
function DocRowList({ doc, last, onOpen }) {
  var _a;
  const status = docStatus(doc);
  const Icon = doc.kind === "pdf" ? IconPdf : IconImg;
  const tint = tintColor(doc.tint);
  return /* @__PURE__ */ React.createElement("button", { onClick: onOpen, style: {
    all: "unset",
    cursor: "pointer",
    boxSizing: "border-box",
    width: "100%",
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "12px 14px",
    // Solid bg so the swipe-action chip behind it stays hidden until swipe.
    background: "var(--cream-2)",
    borderBottom: last ? "none" : "0.5px solid var(--hairline)"
  } }, doc.coverUrl ? /* @__PURE__ */ React.createElement("div", { style: {
    width: 40,
    height: 40,
    borderRadius: 11,
    flexShrink: 0,
    backgroundImage: `url(${doc.coverUrl})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    boxShadow: "0 2px 6px rgba(0,0,0,0.12)"
  } }) : /* @__PURE__ */ React.createElement("div", { style: {
    width: 40,
    height: 40,
    borderRadius: 11,
    flexShrink: 0,
    background: tint,
    color: "#fff",
    display: "grid",
    placeItems: "center",
    boxShadow: "0 2px 6px rgba(0,0,0,0.12)"
  } }, /* @__PURE__ */ React.createElement(Icon, { size: 18, stroke: "#fff" })), /* @__PURE__ */ React.createElement("div", { style: { flex: 1, minWidth: 0, textAlign: "start" } }, /* @__PURE__ */ React.createElement("div", { style: {
    fontSize: 13.5,
    fontWeight: 500,
    color: "var(--ink)",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap"
  } }, doc.title || "—"), /* @__PURE__ */ React.createElement("div", { style: {
    fontSize: 11,
    color: "var(--ink-mute)",
    marginTop: 2,
    display: "flex",
    alignItems: "center",
    gap: 6,
    overflow: "hidden"
  } }, /* @__PURE__ */ React.createElement("span", { style: { overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" } }, ((_a = window.fmtDocSummary) == null ? void 0 : _a.call(window, doc)) || doc.categoryLabel), fmtDocCost(doc) && /* @__PURE__ */ React.createElement("span", { className: "mono", style: {
    fontSize: 10,
    fontWeight: 600,
    flexShrink: 0,
    color: doc.linkedExpenseId ? "var(--moss)" : "var(--ink-soft)",
    display: "inline-flex",
    alignItems: "center",
    gap: 3
  } }, "· ", doc.linkedExpenseId && /* @__PURE__ */ React.createElement(IconCheck, { size: 10, stroke: "currentColor" }), fmtDocCost(doc)), docOwnerName(doc) && /* @__PURE__ */ React.createElement("span", { style: { fontSize: 10, fontWeight: 600, color: "var(--ink-soft)", flexShrink: 0 } }, "· ", window.isRTL ? `لـ ${docOwnerName(doc)}` : `For ${docOwnerName(doc)}`))), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 3, flexShrink: 0 } }, /* @__PURE__ */ React.createElement(StatusDot, { status }), doc.size && doc.size !== "--" && /* @__PURE__ */ React.createElement("span", { className: "mono", style: { fontSize: 10, color: "var(--ink-mute)" } }, doc.size)), /* @__PURE__ */ React.createElement(IconChevron, { size: 14, stroke: "var(--ink-mute)" }));
}
function EmptyVault({ onAdd }) {
  return /* @__PURE__ */ React.createElement("div", { style: {
    padding: "60px 24px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
    gap: 14
  } }, /* @__PURE__ */ React.createElement("div", { style: {
    width: 72,
    height: 72,
    borderRadius: 20,
    background: "var(--cream-2)",
    border: "0.5px solid var(--hairline)",
    display: "grid",
    placeItems: "center",
    position: "relative"
  } }, /* @__PURE__ */ React.createElement(IconDoc, { size: 32, stroke: "var(--ink-mute)" })), /* @__PURE__ */ React.createElement("div", { className: "serif", style: { fontSize: 22, color: "var(--ink)" } }, window.isRTL ? "مستودع مستنداتك فارغ حالياً" : "Your vault is empty"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, color: "var(--ink-mute)", maxWidth: 250, lineHeight: 1.5 } }, window.isRTL ? "احفظ تذاكر السفر، التأشيرات، حجوزات الفندق وكل ما يخص رحلتك في مكان واحد آمن" : "Keep tickets, visas, hotel bookings — everything for your trip in one safe place."), /* @__PURE__ */ React.createElement("button", { onClick: onAdd, style: {
    marginTop: 6,
    padding: "12px 22px",
    borderRadius: 14,
    background: "var(--ink)",
    color: "var(--cream)",
    fontSize: 13.5,
    fontWeight: 600,
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    boxShadow: "var(--shadow-md)"
  } }, /* @__PURE__ */ React.createElement(IconUpload, { size: 14, stroke: "currentColor" }), window.isRTL ? "إضافة أول مستند للرحلة" : "Add your first document"));
}
window.ScreenDocs = ScreenDocs;
const editLabelStyle = {
  fontSize: 11.5,
  fontWeight: 600,
  color: "var(--ink-mute)",
  marginBottom: 6
};
function ScreenDocDetail({ doc: initialDoc, category, go, back, openSheet }) {
  var _a, _b, _c, _d, _e;
  const allDocs = Object.values(window.DOCS_BY_CAT || {}).flat();
  const doc = allDocs.find((d) => d.id === (initialDoc == null ? void 0 : initialDoc.id)) || initialDoc;
  if (!doc) return null;
  const schema = window.DOC_SCHEMAS[doc.category] || window.DOC_SCHEMAS.visas;
  const TINT_FILL = { indigo: "var(--indigo)", clay: "var(--clay)", moss: "var(--moss)", honey: "var(--honey)" };
  const tintFill = TINT_FILL[doc.tint] || "var(--clay)";
  const groupCard = {
    background: "var(--cream-2)",
    borderRadius: 16,
    border: "0.5px solid var(--hairline)",
    padding: 14,
    boxShadow: "var(--shadow-xs)"
  };
  const [editing, setEditing] = React.useState(false);
  const [title, setTitle] = React.useState(doc.title || "");
  const [details, setDetails] = React.useState(doc.details || {});
  const [cat, setCat] = React.useState(doc.category || (category == null ? void 0 : category.key) || "flights");
  const [cost, setCost] = React.useState(doc.costLocal != null ? String(doc.costLocal) : doc.costUSD != null ? String(doc.costUSD) : "");
  const [costCur, setCostCur] = React.useState(doc.costCurrency || ((_a = window.TRIP) == null ? void 0 : _a.localCurrency) || "USD");
  const [ownerUserId, setOwnerUserId] = React.useState(doc.ownerUserId || null);
  const [saving, setSaving] = React.useState(false);
  const members = window.MEMBERS || [];
  const isGroupTrip = members.length > 1;
  const ownerName = ownerUserId ? ((_c = (_b = members.find((m) => m.id === ownerUserId)) == null ? void 0 : _b.name) == null ? void 0 : _c.split(" ")[0]) || null : null;
  const [uploading, setUploading] = React.useState(false);
  const [uploadingSec, setUploadingSec] = React.useState(false);
  const [uploadingCov, setUploadingCov] = React.useState(false);
  const [coverToCrop, setCoverToCrop] = React.useState(null);
  const [linking, setLinking] = React.useState(false);
  const fileRef = React.useRef(null);
  const secondaryRef = React.useRef(null);
  const coverRef = React.useRef(null);
  React.useEffect(() => {
    var _a2;
    setTitle(doc.title || "");
    setDetails(doc.details || {});
    setCat(doc.category || (category == null ? void 0 : category.key) || "flights");
    setCost(doc.costLocal != null ? String(doc.costLocal) : doc.costUSD != null ? String(doc.costUSD) : "");
    setCostCur(doc.costCurrency || ((_a2 = window.TRIP) == null ? void 0 : _a2.localCurrency) || "USD");
    setOwnerUserId(doc.ownerUserId || null);
  }, [doc.id, doc.title, doc.category, JSON.stringify(doc.details), doc.costLocal, doc.costUSD, doc.costCurrency, doc.ownerUserId, category == null ? void 0 : category.key]);
  const replacePrimary = async (file) => {
    var _a2, _b2, _c2;
    if (!file || !((_a2 = window.TRIP) == null ? void 0 : _a2.id)) return;
    setUploading(true);
    try {
      await window.uploadDocumentFile(doc.id, window.TRIP.id, file);
      await window.loadDocuments(window.TRIP.id);
      (_b2 = window.toast) == null ? void 0 : _b2.call(window, window.isRTL ? "تم استبدال الملف المرفق بنجاح" : "File replaced", "success");
    } catch (err) {
      (_c2 = window.toast) == null ? void 0 : _c2.call(window, err.message || "Upload failed", "error");
    } finally {
      setUploading(false);
    }
  };
  const replaceSecondary = async (file) => {
    var _a2, _b2, _c2;
    if (!file || !((_a2 = window.TRIP) == null ? void 0 : _a2.id)) return;
    setUploadingSec(true);
    try {
      await window.uploadDocumentSecondaryFile(doc.id, window.TRIP.id, file);
      await window.loadDocuments(window.TRIP.id);
      (_b2 = window.toast) == null ? void 0 : _b2.call(window, window.isRTL ? "تم استبدال الملف المرفق بنجاح" : "File replaced", "success");
    } catch (err) {
      (_c2 = window.toast) == null ? void 0 : _c2.call(window, err.message || "Upload failed", "error");
    } finally {
      setUploadingSec(false);
    }
  };
  const replaceCover = async (file) => {
    var _a2, _b2;
    if (!file || !((_a2 = window.TRIP) == null ? void 0 : _a2.id)) return;
    setUploadingCov(true);
    try {
      await window.uploadDocCover(doc.id, window.TRIP.id, file);
      await window.loadDocuments(window.TRIP.id);
    } catch (err) {
      (_b2 = window.toast) == null ? void 0 : _b2.call(window, err.message || "Cover upload failed", "error");
    } finally {
      setUploadingCov(false);
    }
  };
  const removeCover = async () => {
    var _a2, _b2;
    if (!doc.coverPath) return;
    if (!confirm(window.isRTL ? "هل تريد إزالة صورة الغلاف؟" : "Remove cover photo?")) return;
    try {
      await window.deleteDocCover(doc.id, doc.coverPath);
      await window.loadDocuments((_a2 = window.TRIP) == null ? void 0 : _a2.id);
    } catch (err) {
      (_b2 = window.toast) == null ? void 0 : _b2.call(window, err.message || "Failed", "error");
    }
  };
  const removePrimary = async () => {
    var _a2, _b2;
    if (!doc.filePath) return;
    if (!confirm(window.isRTL ? "هل تريد إزالة هذا الملف المرفق؟" : "Remove file?")) return;
    try {
      await window.removeDocumentFile(doc.id, doc.filePath);
      await window.loadDocuments((_a2 = window.TRIP) == null ? void 0 : _a2.id);
    } catch (err) {
      (_b2 = window.toast) == null ? void 0 : _b2.call(window, err.message || "Failed", "error");
    }
  };
  const removeSecondary = async () => {
    var _a2, _b2;
    if (!doc.secondaryFilePath) return;
    if (!confirm(window.isRTL ? "هل تريد إزالة الملف الإضافي؟" : "Remove file?")) return;
    try {
      await window.removeDocumentSecondaryFile(doc.id, doc.secondaryFilePath);
      await window.loadDocuments((_a2 = window.TRIP) == null ? void 0 : _a2.id);
    } catch (err) {
      (_b2 = window.toast) == null ? void 0 : _b2.call(window, err.message || "Failed", "error");
    }
  };
  const saveEdits = async () => {
    var _a2, _b2, _c2, _d2, _e2, _f;
    if (!title.trim()) {
      (_a2 = window.toast) == null ? void 0 : _a2.call(window, window.isRTL ? "يرجى إدخال عنوان للمستند" : "Title is required", "error");
      return;
    }
    const rangeErr = (_b2 = window.validateDocRanges) == null ? void 0 : _b2.call(window, schema, details);
    if (rangeErr) {
      (_c2 = window.toast) == null ? void 0 : _c2.call(window, rangeErr, "error");
      return;
    }
    setSaving(true);
    try {
      const costNum = cost ? parseFloat(cost) : null;
      const costUSD = costNum != null ? window.toUSD(costNum, costCur) : null;
      await window.updateDocument(doc.id, {
        title,
        category: cat,
        details,
        costLocal: costNum,
        costCurrency: cost ? costCur : null,
        costUSD,
        ownerUserId,
        linkUrl: details.location_url || null,
        linkLabel: details.location_url ? window.isRTL ? "الرابط المرجعي" : "Location" : null
      });
      await window.loadDocuments((_d2 = window.TRIP) == null ? void 0 : _d2.id);
      setEditing(false);
      (_e2 = window.toast) == null ? void 0 : _e2.call(window, window.isRTL ? "تم حفظ جميع التعديلات بنجاح" : "Saved", "success");
    } catch (err) {
      (_f = window.toast) == null ? void 0 : _f.call(window, err.message || "Save failed", "error");
    } finally {
      setSaving(false);
    }
  };
  const DOC_TO_EXPENSE_CAT = { flights: "transit", lodging: "lodging", transport: "transit", visas: "misc" };
  const toggleExpense = async () => {
    var _a2, _b2, _c2;
    if (doc.linkedExpenseId) {
      setLinking(true);
      try {
        await window.unlinkDocExpense(doc.id, (_a2 = window.TRIP) == null ? void 0 : _a2.id);
        (_b2 = window.toast) == null ? void 0 : _b2.call(window, window.isRTL ? "تم استبعاد التكلفة من سجل المصروفات" : "Removed from expenses", "success");
      } catch (err) {
        (_c2 = window.toast) == null ? void 0 : _c2.call(window, err.message || "Failed", "error");
      } finally {
        setLinking(false);
      }
      return;
    }
    const prefix = doc.category === "flights" ? "✈ " : doc.category === "lodging" ? "🏨 " : doc.category === "transport" ? "🚆 " : "";
    openSheet == null ? void 0 : openSheet("addExpense", {
      title: (prefix + (doc.title || "")).trim(),
      cat: DOC_TO_EXPENSE_CAT[doc.category] || "misc",
      amountUSD: doc.costUSD != null ? Number(doc.costUSD) : void 0,
      // Carry the ORIGINAL amount + currency the user typed for the doc
      // (e.g. 2350 SAR) so the expense sheet opens on exactly that, instead
      // of silently converting it into the trip's local currency.
      amountLocal: doc.costLocal != null ? Number(doc.costLocal) : void 0,
      currency: doc.costCurrency || void 0,
      note: doc.subtitle || null,
      source: { doc: doc.id }
    });
  };
  const deleteDoc = async () => {
    var _a2, _b2, _c2, _d2;
    if (!confirm(window.isRTL ? "هل أنت متأكد من حذف هذا المستند نهائياً؟" : "Delete this document?")) return;
    try {
      if (doc.linkedExpenseId) {
        try {
          await window.unlinkDocExpense(doc.id, (_a2 = window.TRIP) == null ? void 0 : _a2.id);
        } catch (_) {
        }
      }
      await window.deleteDocument(doc.id, (_b2 = window.TRIP) == null ? void 0 : _b2.id, doc.title);
      await window.loadDocuments((_c2 = window.TRIP) == null ? void 0 : _c2.id);
      back();
    } catch (err) {
      (_d2 = window.toast) == null ? void 0 : _d2.call(window, err.message || "Delete failed", "error");
    }
  };
  const hasFile = !!doc.filePath;
  const hasSec = !!doc.secondaryFilePath;
  const hasCover = !!doc.coverUrl;
  const CAT_T = { flights: "docFlights", lodging: "docLodging", visas: "docVisas", transport: "docTransport" };
  const catLabel = CAT_T[doc.category] ? t(CAT_T[doc.category]) : (category == null ? void 0 : category.label) || doc.category;
  const summary = window.fmtDocSummary(doc);
  return /* @__PURE__ */ React.createElement("div", { "data-screen-label": `Vault · ${doc.title}`, style: {
    background: "var(--cream)",
    minHeight: "100%",
    paddingBottom: 140
  } }, /* @__PURE__ */ React.createElement("div", { style: {
    position: "relative",
    height: 240,
    overflow: "hidden",
    background: hasCover ? "var(--ink)" : tintFill
  } }, hasCover && /* @__PURE__ */ React.createElement("div", { style: {
    position: "absolute",
    inset: 0,
    backgroundImage: `url(${doc.coverUrl})`,
    backgroundSize: "cover",
    backgroundPosition: "center"
  } }), !hasCover && /* @__PURE__ */ React.createElement("div", { style: {
    position: "absolute",
    inset: 0,
    display: "grid",
    placeItems: "center",
    fontSize: 80,
    opacity: 0.4
  } }, schema.emoji), /* @__PURE__ */ React.createElement("div", { style: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
    background: "linear-gradient(to bottom, transparent, rgba(0,0,0,0.45))"
  } }), /* @__PURE__ */ React.createElement("div", { style: {
    position: "absolute",
    top: 0,
    insetInlineStart: 0,
    insetInlineEnd: 0,
    zIndex: 5,
    padding: "max(54px, calc(env(safe-area-inset-top) + 14px)) 18px 12px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row"
  } }, /* @__PURE__ */ React.createElement("button", { onClick: back, className: "glass", style: {
    width: 36,
    height: 36,
    borderRadius: 999,
    display: "grid",
    placeItems: "center",
    color: "#fff",
    background: "rgba(0,0,0,0.38)"
  } }, /* @__PURE__ */ React.createElement("span", { className: "icon-flip" }, /* @__PURE__ */ React.createElement(IconBack, { size: 17, stroke: "#fff" }))), /* @__PURE__ */ React.createElement("div", { className: "glass", style: {
    padding: "5px 12px",
    borderRadius: 999,
    color: "#fff",
    background: "rgba(0,0,0,0.38)",
    fontSize: 11,
    fontWeight: 500,
    letterSpacing: 0.04
  } }, catLabel), editing ? /* @__PURE__ */ React.createElement("button", { onClick: saveEdits, disabled: saving, className: "glass", style: {
    padding: "8px 14px",
    borderRadius: 999,
    color: "#fff",
    background: "var(--clay)",
    fontSize: 12.5,
    fontWeight: 600,
    display: "flex",
    alignItems: "center",
    gap: 6,
    flexDirection: "row"
  } }, saving ? /* @__PURE__ */ React.createElement("span", { style: { width: 10, height: 10, borderRadius: "50%", border: "2px solid rgba(255,255,255,0.4)", borderTopColor: "#fff", display: "inline-block", animation: "expspin 0.7s linear infinite" } }) : /* @__PURE__ */ React.createElement(IconCheck, { size: 13, stroke: "#fff" }), window.isRTL ? "حفظ التعديلات" : "Save") : /* @__PURE__ */ React.createElement("button", { onClick: () => setEditing(true), className: "glass", style: {
    width: 36,
    height: 36,
    borderRadius: 999,
    display: "grid",
    placeItems: "center",
    color: "#fff",
    background: "rgba(0,0,0,0.38)"
  } }, /* @__PURE__ */ React.createElement(IconEdit, { size: 16, stroke: "#fff" }))), editing && /* @__PURE__ */ React.createElement("div", { style: {
    position: "absolute",
    bottom: 12,
    insetInlineEnd: 14,
    zIndex: 6,
    display: "flex",
    gap: 6,
    flexDirection: "row"
  } }, /* @__PURE__ */ React.createElement(
    "input",
    {
      ref: coverRef,
      type: "file",
      accept: "image/*",
      style: { display: "none" },
      onChange: (e) => {
        var _a2;
        const f = (_a2 = e.target.files) == null ? void 0 : _a2[0];
        if (f) setCoverToCrop(f);
        e.target.value = "";
      }
    }
  ), /* @__PURE__ */ React.createElement("button", { onClick: () => {
    var _a2;
    return (_a2 = coverRef.current) == null ? void 0 : _a2.click();
  }, disabled: uploadingCov, className: "glass", style: {
    padding: "6px 12px",
    borderRadius: 999,
    color: "#fff",
    background: "rgba(0,0,0,0.55)",
    fontSize: 11.5,
    fontWeight: 500,
    display: "flex",
    alignItems: "center",
    gap: 6,
    flexDirection: "row"
  } }, /* @__PURE__ */ React.createElement(window.IconCamera, { size: 12, stroke: "#fff" }), uploadingCov ? "…" : hasCover ? window.isRTL ? "تغيير الصورة" : "Change" : window.isRTL ? "إضافة غلاف" : "Add cover"), hasCover && /* @__PURE__ */ React.createElement("button", { onClick: removeCover, className: "glass", style: {
    padding: "6px 10px",
    borderRadius: 999,
    color: "#fff",
    background: "rgba(0,0,0,0.55)",
    display: "grid",
    placeItems: "center"
  } }, /* @__PURE__ */ React.createElement(IconTrash, { size: 12, stroke: "#fff" })))), /* @__PURE__ */ React.createElement("div", { style: {
    margin: "-26px 14px 0",
    position: "relative",
    zIndex: 4,
    background: "var(--cream-2)",
    borderRadius: 22,
    padding: "16px 18px",
    boxShadow: "var(--shadow-md)",
    border: "0.5px solid var(--hairline)"
  } }, editing ? (
    // Edit input shares the read-mode .serif class (Geist semibold via
    // v63 tokens) instead of inline var(--serif) which mapped to the
    // Cormorant wordmark font. Same visual field, same font in both
    // modes -- "what I see is what I save."
    /* @__PURE__ */ React.createElement(
      "input",
      {
        value: title,
        onChange: (e) => setTitle(e.target.value),
        autoFocus: true,
        className: "serif",
        style: {
          width: "100%",
          boxSizing: "border-box",
          fontSize: 22,
          lineHeight: 1.2,
          color: "var(--ink)",
          border: 0,
          outline: "none",
          background: "transparent",
          borderBottom: "1.5px dashed var(--clay)",
          padding: "2px 0"
        }
      }
    )
  ) : /* @__PURE__ */ React.createElement("div", { className: "serif", style: { fontSize: 22, lineHeight: 1.2, color: "var(--ink)" } }, doc.title), !editing && summary && /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, color: "var(--ink-soft)", marginTop: 6 } }, summary), !editing && isGroupTrip && ownerName && /* @__PURE__ */ React.createElement("div", { style: {
    marginTop: 10,
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    padding: "5px 11px",
    borderRadius: 999,
    background: "var(--cream)",
    border: "0.5px solid var(--hairline-2)",
    fontSize: 12,
    fontWeight: 600,
    color: "var(--ink-soft)",
    flexDirection: "row"
  } }, /* @__PURE__ */ React.createElement(window.IconUsers, { size: 12, stroke: "var(--ink-mute)" }), window.isRTL ? `لـ ${ownerName}` : `For ${ownerName}`)), editing && /* @__PURE__ */ React.createElement("div", { style: { padding: "18px 14px 0" } }, /* @__PURE__ */ React.createElement(SectionLabel, null, window.isRTL ? "البيانات والتفاصيل" : "Details"), /* @__PURE__ */ React.createElement("div", { style: { padding: "0 8px", display: "flex", flexDirection: "column", gap: 12 } }, /* @__PURE__ */ React.createElement("div", { style: groupCard }, /* @__PURE__ */ React.createElement("div", { style: editLabelStyle }, window.isRTL ? "الفئة" : "Category"), /* @__PURE__ */ React.createElement("select", { value: cat, onChange: (e) => setCat(e.target.value), style: {
    ...window.docFieldStyle,
    fontSize: 16,
    padding: "11px 13px"
  } }, (window.DOC_CATEGORIES || []).map((c) => {
    const label = CAT_T[c.key] ? t(CAT_T[c.key]) : c.label;
    return /* @__PURE__ */ React.createElement("option", { key: c.key, value: c.key }, label);
  })), schema.fields.length > 0 && /* @__PURE__ */ React.createElement("div", { style: { marginTop: 12 } }, /* @__PURE__ */ React.createElement(window.DocFieldGrid, { fields: schema.fields, values: details, onChange: setDetails }))), isGroupTrip && /* @__PURE__ */ React.createElement("div", { style: groupCard }, /* @__PURE__ */ React.createElement("div", { style: editLabelStyle }, window.isRTL ? "لمن هذا المستند؟" : "Who's this for?"), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 7, flexWrap: "wrap", flexDirection: "row" } }, [{ id: null, name: window.isRTL ? "الجميع" : "Everyone" }, ...members].map((o) => {
    const active = ownerUserId === o.id;
    return /* @__PURE__ */ React.createElement("button", { key: o.id || "all", onClick: () => setOwnerUserId(o.id), style: {
      padding: "9px 14px",
      borderRadius: 999,
      fontSize: 13,
      fontWeight: 500,
      background: active ? "var(--ink)" : "var(--cream)",
      color: active ? "var(--cream)" : "var(--ink-soft)",
      border: "0.5px solid var(--hairline-2)",
      transition: "all 150ms"
    } }, o.id ? o.name.split(" ")[0] : o.name);
  }))), schema.showCost && /* @__PURE__ */ React.createElement("div", { style: groupCard }, /* @__PURE__ */ React.createElement("div", { style: editLabelStyle }, window.isRTL ? "تفاصيل التكلفة" : "Cost"), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 8, flexDirection: "row" } }, /* @__PURE__ */ React.createElement(
    window.NumberField,
    {
      value: cost,
      onChange: setCost,
      placeholder: "0",
      style: { ...window.docFieldStyle, fontSize: 16, padding: "11px 13px", flex: 1 }
    }
  ), /* @__PURE__ */ React.createElement("select", { value: costCur, onChange: (e) => setCostCur(e.target.value), style: {
    ...window.docFieldStyle,
    fontSize: 16,
    padding: "11px 13px",
    width: "auto",
    minWidth: 84,
    fontFamily: "var(--mono)"
  } }, [((_d = window.TRIP) == null ? void 0 : _d.localCurrency) || "USD", ((_e = window.TRIP) == null ? void 0 : _e.homeCurrency) || "USD", "USD", "SAR", "AED", "EUR"].filter((v, i, a) => v && a.indexOf(v) === i).map((c) => /* @__PURE__ */ React.createElement("option", { key: c, value: c }, c))))))), !editing && schema.fields.length > 0 && /* @__PURE__ */ React.createElement("div", { style: { padding: "18px 14px 0" } }, /* @__PURE__ */ React.createElement(SectionLabel, null, window.isRTL ? "البيانات والتفاصيل" : "Details"), /* @__PURE__ */ React.createElement("div", { style: {
    background: "var(--cream-2)",
    borderRadius: 18,
    margin: "0 8px",
    overflow: "hidden",
    border: "0.5px solid var(--hairline)"
  } }, schema.fields.map((f, i) => {
    const raw = (details || {})[f.key];
    if (!raw) return null;
    const v = f.type === "datetime" ? fmtDateTime(raw) : f.type === "date" ? fmtDateOnly(raw) : raw;
    const isLink = f.type === "url";
    return /* @__PURE__ */ React.createElement(
      DocInfoRow,
      {
        key: f.key,
        label: f.label(),
        value: v,
        href: isLink ? raw : void 0,
        last: false
      }
    );
  }).filter(Boolean).map(
    (node, i, arr) => i === arr.length - 1 ? React.cloneElement(node, { last: true }) : node
  ))), !editing && schema.showCost && doc.costUSD != null && /* @__PURE__ */ React.createElement("div", { style: { padding: "16px 14px 0" } }, /* @__PURE__ */ React.createElement(SectionLabel, null, window.isRTL ? "تفاصيل التكلفة" : "Cost"), /* @__PURE__ */ React.createElement("div", { style: {
    margin: "0 8px",
    padding: "14px 16px",
    background: "var(--cream-2)",
    borderRadius: 18,
    border: "0.5px solid var(--hairline)",
    display: "flex",
    alignItems: "center",
    gap: 12,
    flexDirection: "row"
  } }, /* @__PURE__ */ React.createElement("div", { style: { flex: 1 } }, /* @__PURE__ */ React.createElement("div", { className: "mono", style: { fontSize: 18, fontWeight: 600, color: "var(--ink)" } }, doc.costLocal != null && doc.costCurrency ? `${doc.costCurrency} ${doc.costLocal.toLocaleString()}` : `$${doc.costUSD.toLocaleString()}`), doc.linkedExpenseId ? /* @__PURE__ */ React.createElement("div", { style: {
    fontSize: 11,
    color: "var(--moss)",
    marginTop: 3,
    display: "flex",
    alignItems: "center",
    gap: 4,
    flexDirection: "row"
  } }, /* @__PURE__ */ React.createElement(IconCheck, { size: 11, stroke: "currentColor" }), window.isRTL ? "مُدرج في قائمة المصروفات" : "Logged in expenses") : /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: "var(--ink-mute)", marginTop: 3 } }, window.isRTL ? "غير مدرج في ميزانية الرحلة" : "Not in the trip budget")), /* @__PURE__ */ React.createElement("button", { onClick: toggleExpense, disabled: linking || doc.costUSD == null, style: {
    padding: "9px 14px",
    borderRadius: 12,
    background: doc.linkedExpenseId ? "var(--cream)" : "var(--ink)",
    color: doc.linkedExpenseId ? "var(--ink)" : "var(--cream)",
    border: doc.linkedExpenseId ? "0.5px solid var(--hairline)" : "none",
    fontSize: 12.5,
    fontWeight: 500,
    display: "flex",
    alignItems: "center",
    gap: 6,
    flexDirection: "row"
  } }, linking ? "…" : doc.linkedExpenseId ? window.isRTL ? "استبعاد من المصروفات" : "Remove" : window.isRTL ? "إدراج في المصروفات" : "Add to expenses"))), /* @__PURE__ */ React.createElement("div", { style: { padding: "18px 14px 0" } }, /* @__PURE__ */ React.createElement(SectionLabel, null, window.isRTL ? "الملفات المرفقة" : "Files"), /* @__PURE__ */ React.createElement("div", { style: {
    margin: "0 8px",
    display: "flex",
    flexDirection: "column",
    gap: 8
  } }, /* @__PURE__ */ React.createElement(
    FileRow,
    {
      label: schema.primaryFileLabel(),
      file: hasFile ? { name: window.isRTL ? "ملف مرفوع" : "Uploaded", size: doc.size, url: doc.link } : null,
      tint: tintFill,
      uploading,
      onPick: () => {
        var _a2;
        return (_a2 = fileRef.current) == null ? void 0 : _a2.click();
      },
      onRemove: removePrimary
    }
  ), /* @__PURE__ */ React.createElement(
    "input",
    {
      ref: fileRef,
      type: "file",
      accept: ".pdf,image/*",
      style: { display: "none" },
      onChange: (e) => {
        if (e.target.files[0]) replacePrimary(e.target.files[0]);
        e.target.value = "";
      }
    }
  ), schema.secondaryFile && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(
    FileRow,
    {
      label: schema.secondaryFile.label(),
      file: hasSec ? { name: window.isRTL ? "ملف مرفوع" : "Uploaded", size: null, url: doc.secondaryLink } : null,
      tint: tintFill,
      uploading: uploadingSec,
      onPick: () => {
        var _a2;
        return (_a2 = secondaryRef.current) == null ? void 0 : _a2.click();
      },
      onRemove: removeSecondary
    }
  ), /* @__PURE__ */ React.createElement(
    "input",
    {
      ref: secondaryRef,
      type: "file",
      accept: ".pdf,image/*",
      style: { display: "none" },
      onChange: (e) => {
        if (e.target.files[0]) replaceSecondary(e.target.files[0]);
        e.target.value = "";
      }
    }
  )))), editing && /* @__PURE__ */ React.createElement("div", { style: { padding: "20px 14px 0" } }, /* @__PURE__ */ React.createElement("button", { onClick: deleteDoc, style: {
    width: "100%",
    margin: "0 8px",
    boxSizing: "border-box",
    padding: "14px",
    borderRadius: 16,
    background: "transparent",
    color: "var(--clay-deep)",
    border: "0.5px solid var(--hairline)",
    fontSize: 13.5,
    fontWeight: 500,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    flexDirection: "row"
  } }, /* @__PURE__ */ React.createElement(IconTrash, { size: 14, stroke: "currentColor" }), window.isRTL ? "حذف المستند بالكامل" : "Delete document")), coverToCrop && /* @__PURE__ */ React.createElement(
    window.ImageCropper,
    {
      file: coverToCrop,
      onCancel: () => setCoverToCrop(null),
      onDone: (cropped) => {
        setCoverToCrop(null);
        replaceCover(cropped);
      }
    }
  ));
}
function DocInfoRow({ label, value, href, last }) {
  const content = href ? /* @__PURE__ */ React.createElement("a", { href, target: "_blank", rel: "noreferrer", style: {
    color: "var(--clay-deep)",
    fontSize: 13,
    fontWeight: 500,
    textDecoration: "none",
    display: "inline-flex",
    alignItems: "center",
    gap: 4,
    flexDirection: "row"
  } }, /* @__PURE__ */ React.createElement(IconLink, { size: 12, stroke: "currentColor" }), window.isRTL ? "الانتقال للرابط" : "Open") : /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, fontWeight: 500, color: "var(--ink)" } }, value);
  return /* @__PURE__ */ React.createElement("div", { style: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "12px 16px",
    flexDirection: "row",
    borderBottom: last ? "none" : "0.5px solid var(--hairline)"
  } }, /* @__PURE__ */ React.createElement("div", { style: {
    flex: "0 0 auto",
    minWidth: 110,
    fontSize: 12.5,
    fontWeight: 500,
    color: "var(--ink-mute)",
    textAlign: "start"
  } }, label), /* @__PURE__ */ React.createElement("div", { style: { flex: 1, textAlign: "end" } }, content));
}
function FileRow({ label, file, tint, uploading, onPick, onRemove }) {
  return /* @__PURE__ */ React.createElement("div", { style: {
    background: "var(--cream-2)",
    borderRadius: 16,
    padding: "12px 14px",
    border: "0.5px solid var(--hairline)",
    display: "flex",
    alignItems: "center",
    gap: 12,
    flexDirection: "row"
  } }, /* @__PURE__ */ React.createElement("div", { style: {
    width: 40,
    height: 40,
    borderRadius: 11,
    background: tint,
    color: "#fff",
    display: "grid",
    placeItems: "center",
    flexShrink: 0
  } }, /* @__PURE__ */ React.createElement(IconDoc, { size: 18, stroke: "#fff" })), /* @__PURE__ */ React.createElement("div", { style: { flex: 1, minWidth: 0 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12.5, color: "var(--ink-mute)" } }, label), /* @__PURE__ */ React.createElement("div", { style: {
    fontSize: 13,
    fontWeight: 500,
    color: "var(--ink)",
    marginTop: 2,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap"
  } }, file ? file.size ? `${file.name} · ${file.size}` : file.name : window.isRTL ? "لا يوجد ملف مرفق حتى الآن" : "No file yet")), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 6, flexDirection: "row", flexShrink: 0 } }, file && file.url && /* @__PURE__ */ React.createElement("a", { href: file.url, target: "_blank", rel: "noreferrer", style: {
    padding: "7px 10px",
    borderRadius: 10,
    background: "var(--ink)",
    color: "var(--cream)",
    fontSize: 11.5,
    fontWeight: 500,
    display: "inline-flex",
    alignItems: "center",
    gap: 4,
    flexDirection: "row",
    textDecoration: "none"
  } }, /* @__PURE__ */ React.createElement(IconDoc, { size: 11, stroke: "currentColor" }), window.isRTL ? "فتح الملف" : "Open"), /* @__PURE__ */ React.createElement("button", { onClick: onPick, disabled: uploading, style: {
    padding: "7px 10px",
    borderRadius: 10,
    background: "var(--cream)",
    color: "var(--ink-soft)",
    border: "0.5px solid var(--hairline)",
    fontSize: 11.5,
    fontWeight: 500
  } }, uploading ? "…" : file ? window.isRTL ? "استبدال الملف" : "Replace" : window.isRTL ? "رفع ملف جديد" : "Upload"), file && /* @__PURE__ */ React.createElement("button", { onClick: onRemove, "aria-label": window.isRTL ? "إزالة" : "Remove", style: {
    padding: "7px",
    borderRadius: 10,
    background: "transparent",
    color: "var(--clay-deep)",
    border: "0.5px solid var(--hairline)",
    display: "grid",
    placeItems: "center"
  } }, /* @__PURE__ */ React.createElement(window.IconClose, { size: 12, stroke: "currentColor" }))));
}
function fmtDateTime(iso) {
  const d = new Date(iso);
  if (isNaN(d)) return iso;
  return d.toLocaleString(window.isRTL ? "ar" : "en", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit"
  });
}
function fmtDateOnly(iso) {
  const d = /* @__PURE__ */ new Date(iso + (iso.length === 10 ? "T00:00:00" : ""));
  if (isNaN(d)) return iso;
  return d.toLocaleDateString(window.isRTL ? "ar" : "en", {
    month: "short",
    day: "numeric",
    year: "numeric"
  });
}
window.ScreenDocDetail = ScreenDocDetail;
function ScreenAddDoc({ back, onCreated }) {
  var _a, _b;
  const [cat, setCat] = React.useState("flights");
  const [title, setTitle] = React.useState("");
  const [details, setDetails] = React.useState({});
  const tripLocal = ((_a = window.TRIP) == null ? void 0 : _a.localCurrency) || "USD";
  const tripHome = ((_b = window.TRIP) == null ? void 0 : _b.homeCurrency) || "USD";
  const [cost, setCost] = React.useState("");
  const [costCur, setCostCur] = React.useState(tripLocal);
  const [logExpense, setLogExpense] = React.useState(false);
  const members = window.MEMBERS || [];
  const isGroupTrip = members.length > 1;
  const [ownerUserId, setOwnerUserId] = React.useState(null);
  const [file, setFile] = React.useState(null);
  const [secondary, setSecondary] = React.useState(null);
  const [coverFile, setCoverFile] = React.useState(null);
  const [coverPreview, setCoverPreview] = React.useState(null);
  const [coverToCrop, setCoverToCrop] = React.useState(null);
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState(null);
  const fileRef = React.useRef(null);
  const secondaryRef = React.useRef(null);
  const coverRef = React.useRef(null);
  React.useEffect(() => {
    if (!coverFile) {
      setCoverPreview(null);
      return;
    }
    const url = URL.createObjectURL(coverFile);
    setCoverPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [coverFile]);
  React.useEffect(() => {
    setDetails({});
    setSecondary(null);
  }, [cat]);
  const schema = window.DOC_SCHEMAS[cat] || window.DOC_SCHEMAS.visas;
  const CAT_TINT = { flights: "indigo", lodging: "clay", visas: "moss", transport: "honey" };
  const TINT_FILL = { indigo: "var(--indigo)", clay: "var(--clay)", moss: "var(--moss)", honey: "var(--honey)" };
  const tint = CAT_TINT[cat] || "clay";
  const groupCard = {
    background: "var(--cream-2)",
    borderRadius: 16,
    border: "0.5px solid var(--hairline)",
    padding: 14,
    boxShadow: "var(--shadow-xs)"
  };
  const handleSave = async () => {
    var _a2, _b2, _c;
    if (!title.trim()) {
      setError(window.isRTL ? "يرجى إدخال عنوان للمستند" : "Enter a title");
      return;
    }
    const rangeErr = (_a2 = window.validateDocRanges) == null ? void 0 : _a2.call(window, schema, details);
    if (rangeErr) {
      setError(rangeErr);
      return;
    }
    const tripId = (_b2 = window.TRIP) == null ? void 0 : _b2.id;
    const userId = window.currentUserId;
    if (!tripId || !userId) {
      setError("No active trip or session");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const costUSD = cost && schema.showCost ? window.toUSD(parseFloat(cost), costCur) : null;
      const doc = await window.addDocument(tripId, userId, {
        title: title.trim(),
        category: cat,
        kind: file && ((_c = file.type) == null ? void 0 : _c.startsWith("image/")) ? "img" : "pdf",
        tint,
        details,
        costUSD,
        costLocal: cost ? parseFloat(cost) : null,
        costCurrency: cost ? costCur : null,
        linkUrl: details.location_url || null,
        linkLabel: details.location_url ? window.isRTL ? "الرابط المرفق" : "Location" : null,
        ownerUserId
      });
      const tasks = [];
      if (file) tasks.push(window.uploadDocumentFile(doc.id, tripId, file));
      if (secondary) tasks.push(window.uploadDocumentSecondaryFile(doc.id, tripId, secondary));
      if (coverFile) tasks.push(window.uploadDocCover(doc.id, tripId, coverFile).catch((e) => {
        var _a3;
        return (_a3 = window.toast) == null ? void 0 : _a3.call(window, e.message || "Cover upload failed", "error");
      }));
      if (logExpense && costUSD) tasks.push(window.linkDocExpense(doc.id, tripId).catch((e) => {
        var _a3;
        return (_a3 = window.toast) == null ? void 0 : _a3.call(window, e.message || "Expense link failed", "error");
      }));
      if (tasks.length) await Promise.allSettled(tasks);
      await window.loadDocuments(tripId);
      onCreated == null ? void 0 : onCreated(doc.id);
    } catch (err) {
      setError(err.message);
      setSaving(false);
    }
  };
  return /* @__PURE__ */ React.createElement("div", { "data-screen-label": "Add Document", style: {
    background: "var(--cream)",
    minHeight: "100%",
    paddingBottom: 116
  } }, /* @__PURE__ */ React.createElement("div", { style: {
    position: "sticky",
    top: 0,
    zIndex: 20,
    padding: "max(54px, calc(env(safe-area-inset-top) + 14px)) 18px 14px",
    background: "linear-gradient(180deg, var(--cream) 88%, transparent)",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row"
  } }, /* @__PURE__ */ React.createElement("button", { onClick: back, style: {
    width: 36,
    height: 36,
    borderRadius: 999,
    background: "var(--cream-2)",
    border: "0.5px solid var(--hairline)",
    display: "grid",
    placeItems: "center"
  } }, /* @__PURE__ */ React.createElement("span", { className: "icon-flip" }, /* @__PURE__ */ React.createElement(IconBack, { size: 17, stroke: "var(--ink)" }))), /* @__PURE__ */ React.createElement("div", { className: "serif", style: { fontSize: 20, color: "var(--ink)" } }, window.isRTL ? "إضافة مستند جديد" : "New document"), /* @__PURE__ */ React.createElement("div", { style: { width: 36 } })), /* @__PURE__ */ React.createElement("div", { style: { padding: "0 16px", display: "flex", flexDirection: "column", gap: 18 } }, /* @__PURE__ */ React.createElement(DocStep, { title: window.isRTL ? "نوع المستند" : "What is it?" }, /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 } }, (window.DOC_CATEGORIES || []).map((c) => {
    var _a2;
    const active = cat === c.key;
    const color = TINT_FILL[CAT_TINT[c.key]] || "var(--clay)";
    const CAT_T = { flights: "docFlights", lodging: "docLodging", visas: "docVisas", transport: "docTransport" };
    const label = CAT_T[c.key] ? t(CAT_T[c.key]) : c.label;
    const emoji = ((_a2 = window.DOC_SCHEMAS[c.key]) == null ? void 0 : _a2.emoji) || "📄";
    return /* @__PURE__ */ React.createElement("button", { key: c.key, onClick: () => setCat(c.key), style: {
      padding: "13px 14px",
      borderRadius: 14,
      textAlign: "start",
      background: active ? color : "var(--cream-2)",
      color: active ? "#fff" : "var(--ink)",
      border: active ? "none" : "0.5px solid var(--hairline)",
      boxShadow: active ? "0 6px 16px -8px " + color : "var(--shadow-xs)",
      display: "flex",
      alignItems: "center",
      gap: 10,
      flexDirection: "row",
      transition: "all 160ms"
    } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 22 } }, emoji), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 14, fontWeight: 500 } }, label));
  }))), isGroupTrip && /* @__PURE__ */ React.createElement(
    DocStep,
    {
      title: window.isRTL ? "لمن هذا المستند؟" : "Who's this for?",
      hint: window.isRTL ? "بطاقة الصعود والتأشيرة تخص مسافراً واحداً — وحده يصله تذكير سمارت تراك. الحجوزات المشتركة اتركها للجميع." : "Boarding passes & visas belong to one traveler — only they get the Smart Track reminder. Leave shared bookings on Everyone."
    },
    /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 7, flexWrap: "wrap", flexDirection: "row" } }, [{ id: null, name: window.isRTL ? "الجميع" : "Everyone" }, ...members].map((o) => {
      const active = ownerUserId === o.id;
      return /* @__PURE__ */ React.createElement("button", { key: o.id || "all", onClick: () => setOwnerUserId(o.id), style: {
        padding: "9px 14px",
        borderRadius: 999,
        fontSize: 13,
        fontWeight: 500,
        background: active ? "var(--ink)" : "var(--cream-2)",
        color: active ? "var(--cream)" : "var(--ink-soft)",
        border: "0.5px solid var(--hairline)",
        transition: "all 150ms"
      } }, o.id ? o.name.split(" ")[0] : o.name);
    }))
  ), /* @__PURE__ */ React.createElement(DocStep, { title: window.isRTL ? "التفاصيل" : "Details" }, /* @__PURE__ */ React.createElement("div", { style: groupCard }, /* @__PURE__ */ React.createElement("label", { style: { fontSize: 11.5, fontWeight: 600, color: "var(--ink-mute)", display: "block", marginBottom: 6, textAlign: "start" } }, schema.titleLabel()), /* @__PURE__ */ React.createElement(
    "input",
    {
      value: title,
      onChange: (e) => setTitle(e.target.value),
      placeholder: schema.titlePlaceholder(),
      style: docFieldStyle
    }
  ), schema.fields.length > 0 && /* @__PURE__ */ React.createElement("div", { style: { marginTop: 12 } }, /* @__PURE__ */ React.createElement(DocFieldGrid, { fields: schema.fields, values: details, onChange: setDetails })))), /* @__PURE__ */ React.createElement(
    DocStep,
    {
      title: schema.primaryFileLabel(),
      optional: true,
      hint: window.isRTL ? "الصيغ المدعومة: PDF أو صور — بحد أقصى 25 ميغابايت" : "PDF or image · up to 25 MB"
    },
    /* @__PURE__ */ React.createElement(FilePicker, { file, setFile, pickerRef: fileRef, tint: TINT_FILL[tint] })
  ), schema.secondaryFile && /* @__PURE__ */ React.createElement(DocStep, { title: schema.secondaryFile.label(), optional: true }, /* @__PURE__ */ React.createElement(FilePicker, { file: secondary, setFile: setSecondary, pickerRef: secondaryRef, tint: TINT_FILL[tint] })), schema.showCost && /* @__PURE__ */ React.createElement(DocStep, { title: window.isRTL ? "التكلفة" : "Cost", optional: true }, /* @__PURE__ */ React.createElement("div", { style: groupCard }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 8, flexDirection: "row" } }, /* @__PURE__ */ React.createElement(
    NumberField,
    {
      value: cost,
      onChange: setCost,
      placeholder: "0",
      style: { ...docFieldStyle, flex: 1 }
    }
  ), /* @__PURE__ */ React.createElement("select", { value: costCur, onChange: (e) => setCostCur(e.target.value), style: {
    ...docFieldStyle,
    width: "auto",
    minWidth: 84,
    fontFamily: "var(--mono)"
  } }, [tripLocal, tripHome, "USD", "SAR", "AED", "EUR"].filter((v, i, a) => a.indexOf(v) === i).map((c) => /* @__PURE__ */ React.createElement("option", { key: c, value: c }, c)))), /* @__PURE__ */ React.createElement("label", { style: {
    marginTop: 10,
    padding: "12px 14px",
    borderRadius: 12,
    background: "var(--cream)",
    border: "0.5px solid var(--hairline-2)",
    display: "flex",
    alignItems: "center",
    gap: 10,
    flexDirection: "row",
    cursor: "pointer"
  } }, /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "checkbox",
      checked: logExpense,
      onChange: (e) => setLogExpense(e.target.checked),
      style: { width: 18, height: 18, accentColor: "var(--clay)" }
    }
  ), /* @__PURE__ */ React.createElement("div", { style: { flex: 1 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13.5, fontWeight: 500, color: "var(--ink)" } }, window.isRTL ? "إدراج تلقائي في ميزانية ومصروفات الرحلة" : "Add to expenses"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: "var(--ink-mute)", marginTop: 1 } }, window.isRTL ? "عند التفعيل، ستتم إضافة هذا المبلغ تلقائياً لعملياتك المالية" : "Auto-logged in your trip budget"))))), /* @__PURE__ */ React.createElement(
    DocStep,
    {
      title: window.isRTL ? "صورة الغلاف" : "Cover photo",
      optional: true,
      hint: window.isRTL ? "صورة صغيرة تظهر في القائمة بدل الأيقونة الافتراضية" : "A small image shown in the list instead of the default icon"
    },
    /* @__PURE__ */ React.createElement(
      "input",
      {
        ref: coverRef,
        type: "file",
        accept: "image/*",
        style: { display: "none" },
        onChange: (e) => {
          var _a2;
          const f = (_a2 = e.target.files) == null ? void 0 : _a2[0];
          if (f) setCoverToCrop(f);
          e.target.value = "";
        }
      }
    ),
    coverPreview ? /* @__PURE__ */ React.createElement("div", { style: {
      display: "flex",
      gap: 10,
      alignItems: "center",
      flexDirection: "row",
      padding: 10,
      borderRadius: 14,
      background: "var(--cream-2)",
      border: "0.5px solid var(--hairline)"
    } }, /* @__PURE__ */ React.createElement("div", { style: {
      width: 58,
      height: 58,
      borderRadius: 10,
      flexShrink: 0,
      backgroundImage: `url(${coverPreview})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      border: "0.5px solid var(--hairline)"
    } }), /* @__PURE__ */ React.createElement("div", { style: { flex: 1, fontSize: 12.5, color: "var(--ink)" } }, window.isRTL ? "تعيين صورة الغلاف" : "Cover photo"), /* @__PURE__ */ React.createElement("button", { onClick: () => {
      var _a2;
      return (_a2 = coverRef.current) == null ? void 0 : _a2.click();
    }, style: {
      padding: "7px 11px",
      borderRadius: 10,
      fontSize: 11.5,
      fontWeight: 500,
      background: "var(--cream)",
      border: "0.5px solid var(--hairline)",
      color: "var(--ink-soft)"
    } }, window.isRTL ? "تغيير الصورة" : "Replace"), /* @__PURE__ */ React.createElement("button", { onClick: () => setCoverFile(null), style: {
      padding: "7px 9px",
      borderRadius: 10,
      background: "transparent",
      color: "var(--clay-deep)",
      border: "0.5px solid var(--hairline)"
    } }, /* @__PURE__ */ React.createElement(window.IconTrash, { size: 13, stroke: "currentColor" }))) : /* @__PURE__ */ React.createElement("button", { onClick: () => {
      var _a2;
      return (_a2 = coverRef.current) == null ? void 0 : _a2.click();
    }, style: {
      width: "100%",
      padding: "14px",
      borderRadius: 14,
      background: "var(--cream-2)",
      border: "1px dashed var(--hairline-2)",
      color: "var(--ink-soft)",
      fontSize: 13,
      fontWeight: 500,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      flexDirection: "row"
    } }, /* @__PURE__ */ React.createElement(window.IconCamera, { size: 16, stroke: "currentColor" }), window.isRTL ? "إدراج صورة من المعرض" : "Add a photo")
  ), error && /* @__PURE__ */ React.createElement("div", { style: {
    padding: "10px 14px",
    borderRadius: 12,
    background: "oklch(0.62 0.13 35 / 0.10)",
    border: "0.5px solid oklch(0.62 0.13 35 / 0.3)",
    fontSize: 12.5,
    color: "var(--clay-deep)"
  } }, error)), coverToCrop && /* @__PURE__ */ React.createElement(
    window.ImageCropper,
    {
      file: coverToCrop,
      onCancel: () => setCoverToCrop(null),
      onDone: (cropped) => {
        setCoverToCrop(null);
        setCoverFile(cropped);
      }
    }
  ), /* @__PURE__ */ React.createElement("div", { style: {
    position: "fixed",
    bottom: 0,
    insetInlineStart: 0,
    insetInlineEnd: 0,
    zIndex: 49,
    display: "flex",
    gap: 10,
    flexDirection: "row",
    padding: "12px 16px calc(12px + env(safe-area-inset-bottom))",
    background: "var(--cream)",
    backdropFilter: "blur(20px) saturate(180%)",
    WebkitBackdropFilter: "blur(20px) saturate(180%)",
    borderTop: "0.5px solid var(--hairline)"
  } }, /* @__PURE__ */ React.createElement("button", { onClick: back, disabled: saving, style: {
    padding: "16px 20px",
    borderRadius: 16,
    background: "var(--cream-2)",
    border: "0.5px solid var(--hairline-2)",
    color: "var(--ink-soft)",
    fontSize: 14,
    fontWeight: 500
  } }, window.isRTL ? "إلغاء" : "Cancel"), /* @__PURE__ */ React.createElement("button", { onClick: handleSave, disabled: saving, style: {
    flex: 1,
    padding: "16px",
    borderRadius: 16,
    background: saving ? "var(--ink-soft)" : "var(--clay)",
    color: "#fff",
    fontSize: 15,
    fontWeight: 600,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    flexDirection: "row",
    boxShadow: saving ? "none" : "0 8px 20px oklch(0.62 0.13 35 / 0.4)"
  } }, saving ? /* @__PURE__ */ React.createElement("span", { style: {
    width: 14,
    height: 14,
    borderRadius: "50%",
    border: "2px solid rgba(255,255,255,0.4)",
    borderTopColor: "#fff",
    display: "inline-block",
    animation: "expspin 0.7s linear infinite"
  } }) : /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(IconCheck, { size: 14, stroke: "currentColor" }), window.isRTL ? "حفظ ومتابعة" : "Save document"))));
}
const docFieldStyle = {
  width: "100%",
  boxSizing: "border-box",
  padding: "13px 14px",
  borderRadius: 12,
  border: "0.5px solid var(--hairline-2)",
  background: "var(--cream)",
  color: "var(--ink)",
  fontSize: 16,
  outline: "none",
  fontFamily: "var(--sans)",
  textAlign: "start"
};
function DocStep({ title, hint, optional, children }) {
  return /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: {
    display: "flex",
    alignItems: "baseline",
    gap: 7,
    margin: "2px 4px 9px",
    flexDirection: "row"
  } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12.5, fontWeight: 600, color: "var(--ink-soft)" } }, title), optional && /* @__PURE__ */ React.createElement("span", { style: {
    fontSize: 11,
    color: "var(--ink-mute)",
    fontWeight: 400
  } }, "· ", window.isRTL ? "اختياري" : "optional")), hint && /* @__PURE__ */ React.createElement("div", { style: {
    fontSize: 11.5,
    color: "var(--ink-mute)",
    margin: "-4px 4px 9px",
    lineHeight: 1.4
  } }, hint), children);
}
function NumberField({ value, onChange, placeholder, decimal = true, style, id, ...rest }) {
  const sanitize = (s) => {
    if (!decimal) return String(s).replace(/\D/g, "");
    s = String(s).replace(/[^\d.]/g, "");
    const dot = s.indexOf(".");
    if (dot !== -1) s = s.slice(0, dot + 1) + s.slice(dot + 1).replace(/\./g, "");
    return s;
  };
  return /* @__PURE__ */ React.createElement(
    "input",
    {
      id,
      type: "text",
      inputMode: decimal ? "decimal" : "numeric",
      autoComplete: "off",
      autoCorrect: "off",
      spellCheck: false,
      value,
      onChange: (e) => onChange(sanitize(e.target.value)),
      placeholder,
      style,
      ...rest
    }
  );
}
function DateTimeRange({ start, end, values, onChange }) {
  const isDate = start.type === "date";
  const inputType = isDate ? "date" : "datetime-local";
  const toIn = (x) => !x ? "" : isDate ? x : toLocalDateTimeInput(x);
  const fromIn = (x) => isDate ? x : fromLocalDateTimeInput(x);
  const startVal = values[start.key] || "";
  const endVal = values[end.key] || "";
  const minEnd = startVal ? toIn(startVal) : void 0;
  const cellLabel = { fontSize: 11.5, fontWeight: 600, color: "var(--ink-mute)", marginBottom: 6, display: "block" };
  const inputStyle = { ...docFieldStyle, fontSize: 16, padding: "11px 13px" };
  return /* @__PURE__ */ React.createElement("div", { style: {
    padding: 12,
    borderRadius: 14,
    background: "var(--cream-2)",
    border: "0.5px solid var(--hairline)",
    display: "flex",
    flexDirection: "column",
    gap: 8
  } }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { style: cellLabel }, start.label()), /* @__PURE__ */ React.createElement(
    "input",
    {
      type: inputType,
      value: toIn(startVal),
      onChange: (e) => onChange({ ...values, [start.key]: fromIn(e.target.value) }),
      style: inputStyle
    }
  )), /* @__PURE__ */ React.createElement("div", { style: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "0 2px",
    color: "var(--ink-mute)",
    fontSize: 11
  } }, /* @__PURE__ */ React.createElement("span", { style: { flex: 1, height: "0.5px", background: "var(--hairline-2)" } }), /* @__PURE__ */ React.createElement("span", { className: "icon-flip", style: { transform: "rotate(90deg)" } }, /* @__PURE__ */ React.createElement(window.IconChevron, { size: 12, stroke: "currentColor" })), /* @__PURE__ */ React.createElement("span", { style: { flex: 1, height: "0.5px", background: "var(--hairline-2)" } })), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { style: cellLabel }, end.label()), /* @__PURE__ */ React.createElement(
    "input",
    {
      type: inputType,
      value: toIn(endVal),
      min: minEnd,
      onChange: (e) => onChange({ ...values, [end.key]: fromIn(e.target.value) }),
      style: inputStyle
    }
  )));
}
function rangeMin(field, startVal) {
  if (!startVal) return void 0;
  return field.type === "datetime" ? toLocalDateTimeInput(startVal) : startVal;
}
function DocFieldGrid({ fields, values, onChange }) {
  const set = (key, val) => onChange({ ...values, [key]: val });
  const blocks = [];
  for (let i = 0; i < fields.length; i++) {
    const f = fields[i];
    const prev = blocks[blocks.length - 1];
    if (f.rangeStart && prev && prev.kind === "single" && prev.field.key === f.rangeStart) {
      blocks[blocks.length - 1] = { kind: "range", start: prev.field, end: f };
      continue;
    }
    if (f.col === 2 && prev && prev.kind === "single") {
      blocks[blocks.length - 1] = { kind: "pair", a: prev.field, b: f };
      continue;
    }
    blocks.push({ kind: "single", field: f });
  }
  return /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 10 } }, blocks.map((b, i) => {
    if (b.kind === "range") {
      return /* @__PURE__ */ React.createElement(DateTimeRange, { key: i, start: b.start, end: b.end, values, onChange });
    }
    if (b.kind === "pair") {
      return /* @__PURE__ */ React.createElement("div", { key: i, style: { display: "grid", gap: 8, gridTemplateColumns: "2fr 1fr" } }, /* @__PURE__ */ React.createElement(DocField, { field: b.a, value: values[b.a.key] || "", onChange: (v) => set(b.a.key, v) }), /* @__PURE__ */ React.createElement(DocField, { field: b.b, value: values[b.b.key] || "", onChange: (v) => set(b.b.key, v) }));
    }
    const f = b.field;
    return /* @__PURE__ */ React.createElement(
      DocField,
      {
        key: i,
        field: f,
        value: values[f.key] || "",
        min: f.rangeStart ? rangeMin(f, values[f.rangeStart]) : void 0,
        onChange: (v) => set(f.key, v)
      }
    );
  }));
}
function DocField({ field, value, onChange, min }) {
  const inputType = field.type === "date" ? "date" : field.type === "datetime" ? "datetime-local" : field.type === "url" ? "url" : "text";
  const v = field.type === "datetime" && value ? toLocalDateTimeInput(value) : value;
  const labelEl = /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, fontWeight: 600, color: "var(--ink)", marginBottom: 6 } }, field.label());
  if (field.type === "number") {
    return /* @__PURE__ */ React.createElement("div", null, labelEl, /* @__PURE__ */ React.createElement(
      NumberField,
      {
        value,
        onChange,
        placeholder: field.placeholder ? field.placeholder() : "",
        decimal: field.integer !== true,
        style: { ...docFieldStyle, fontSize: 16, padding: "11px 13px" }
      }
    ));
  }
  return /* @__PURE__ */ React.createElement("div", null, labelEl, /* @__PURE__ */ React.createElement(
    "input",
    {
      type: inputType,
      value: v,
      min,
      onChange: (e) => onChange(field.type === "datetime" ? fromLocalDateTimeInput(e.target.value) : e.target.value),
      placeholder: field.placeholder ? field.placeholder() : "",
      style: { ...docFieldStyle, fontSize: 16, padding: "11px 13px" }
    }
  ));
}
function toLocalDateTimeInput(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d)) return "";
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
function fromLocalDateTimeInput(local) {
  if (!local) return "";
  const d = new Date(local);
  return isNaN(d) ? "" : d.toISOString();
}
function FilePicker({ file, setFile, pickerRef, tint }) {
  var _a;
  const [drag, setDrag] = React.useState(false);
  return /* @__PURE__ */ React.createElement(
    "div",
    {
      onClick: () => {
        var _a2;
        return (_a2 = pickerRef.current) == null ? void 0 : _a2.click();
      },
      onDragEnter: (e) => {
        e.preventDefault();
        setDrag(true);
      },
      onDragOver: (e) => e.preventDefault(),
      onDragLeave: () => setDrag(false),
      onDrop: (e) => {
        e.preventDefault();
        setDrag(false);
        const f = e.dataTransfer.files[0];
        if (f) setFile(f);
      },
      style: {
        padding: file ? "12px" : "20px",
        borderRadius: 16,
        background: drag ? "oklch(0.62 0.13 35 / 0.10)" : "var(--cream-2)",
        border: drag ? "1.5px dashed var(--clay)" : file ? "0.5px solid var(--hairline)" : "1.5px dashed var(--sand-deep)",
        cursor: "pointer",
        transition: "all 180ms"
      }
    },
    /* @__PURE__ */ React.createElement(
      "input",
      {
        ref: pickerRef,
        type: "file",
        accept: ".pdf,.jpg,.jpeg,.png,.webp",
        style: { display: "none" },
        onChange: (e) => {
          const f = e.target.files[0];
          if (f) setFile(f);
        }
      }
    ),
    file ? /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 12, flexDirection: "row" } }, /* @__PURE__ */ React.createElement("div", { style: {
      width: 44,
      height: 44,
      borderRadius: 12,
      background: tint,
      color: "#fff",
      display: "grid",
      placeItems: "center",
      flexShrink: 0
    } }, ((_a = file.type) == null ? void 0 : _a.startsWith("image/")) ? /* @__PURE__ */ React.createElement(IconImg, { size: 20, stroke: "#fff" }) : /* @__PURE__ */ React.createElement(IconPdf, { size: 20, stroke: "#fff" })), /* @__PURE__ */ React.createElement("div", { style: { flex: 1, minWidth: 0 } }, /* @__PURE__ */ React.createElement("div", { style: {
      fontSize: 13.5,
      fontWeight: 500,
      color: "var(--ink)",
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap"
    } }, file.name), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11.5, color: "var(--ink-mute)", marginTop: 2 } }, (file.size / 1024 / 1024).toFixed(2), " MB · ", window.isRTL ? "اضغط هنا لاستبدال الملف المرفق" : "tap to replace")), /* @__PURE__ */ React.createElement("button", { onClick: (e) => {
      e.stopPropagation();
      setFile(null);
    }, style: {
      padding: 8,
      borderRadius: 8,
      background: "var(--cream)",
      border: "0.5px solid var(--hairline)"
    } }, /* @__PURE__ */ React.createElement(IconTrash, { size: 14, stroke: "var(--clay-deep)" }))) : /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 12, justifyContent: "center", flexDirection: "row" } }, /* @__PURE__ */ React.createElement("div", { style: {
      width: 44,
      height: 44,
      borderRadius: 12,
      background: "var(--ink)",
      color: "var(--cream)",
      display: "grid",
      placeItems: "center"
    } }, /* @__PURE__ */ React.createElement(IconUpload, { size: 20 })), /* @__PURE__ */ React.createElement("div", { style: { textAlign: "start" } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 14, fontWeight: 500, color: "var(--ink)" } }, window.isRTL ? "اختر ملفاً للرفع" : "Pick a file"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11.5, color: "var(--ink-mute)", marginTop: 2 } }, window.isRTL ? "الصيغ المدعومة: PDF أو صور" : "PDF or image")))
  );
}
window.ScreenAddDoc = ScreenAddDoc;
window.DocStep = DocStep;
window.DocFieldGrid = DocFieldGrid;
window.DocField = DocField;
window.NumberField = NumberField;
window.DateTimeRange = DateTimeRange;
window.FilePicker = FilePicker;
window.toLocalDateTimeInput = toLocalDateTimeInput;
window.fromLocalDateTimeInput = fromLocalDateTimeInput;
window.docFieldStyle = docFieldStyle;
function ScreenSettleUp({ back }) {
  var _a, _b;
  const trip = window.TRIP;
  const members = window.MEMBERS || [];
  const expenses = window.EXPENSES || [];
  const settlements = window.SETTLEMENTS || [];
  const [tick, setTick] = React.useState(0);
  const [recording, setRecording] = React.useState(null);
  if (!trip) return null;
  const memberIds = members.map((m) => m.id);
  const balances = ((_a = window.computeAllBalances) == null ? void 0 : _a.call(window, memberIds, expenses, settlements)) || {};
  const transfers = ((_b = window.computeSettlements) == null ? void 0 : _b.call(window, balances)) || [];
  const fmt = (usd) => window.fmtMoney(usd, { in: "home" });
  const findMember = (id) => members.find((m) => m.id === id) || { id, name: id === window.currentUserId ? window.isRTL ? "أنت" : "You" : "—", hue: 200, initials: "?" };
  const handleMarkPaid = (transfer) => {
    var _a2;
    const fromM = findMember(transfer.from);
    const toM = findMember(transfer.to);
    const amount = fmt(transfer.amount);
    (_a2 = window.actionSheet) == null ? void 0 : _a2.call(window, {
      title: t("settleConfirmTitle"),
      message: t("settleConfirmMsg").replace("{from}", fromM.name.split(" ")[0]).replace("{to}", toM.name.split(" ")[0]).replace("{amount}", amount),
      actions: [{
        label: t("settleConfirmYes"),
        destructive: false,
        onPress: async () => {
          var _a3, _b2;
          setRecording(transfer.from + ">" + transfer.to);
          try {
            await window.recordSettlement(trip.id, transfer.from, transfer.to, transfer.amount);
            (_a3 = window.toast) == null ? void 0 : _a3.call(window, window.isRTL ? "تمت تسوية الفاتورة بنجاح" : "Invoice settled.", "success");
            setTick((n) => n + 1);
          } catch (err) {
            (_b2 = window.toast) == null ? void 0 : _b2.call(window, err.message || "Could not record", "error");
          } finally {
            setRecording(null);
          }
        }
      }]
    });
  };
  const handleShare = (transfer) => {
    const toM = findMember(transfer.to);
    const amount = fmt(transfer.amount);
    const msg = t("settleWhatsappCopy").replace("{to}", toM.name.split(" ")[0]).replace("{amount}", amount);
    const url = `https://wa.me/?text=${encodeURIComponent(msg)}`;
    window.open(url, "_blank");
  };
  return /* @__PURE__ */ React.createElement("div", { "data-screen-label": "Settle Up", style: {
    background: "var(--cream)",
    minHeight: "100%",
    paddingBottom: 100
  } }, /* @__PURE__ */ React.createElement(
    LargeTitleHeader,
    {
      title: t("settleUp"),
      subtitle: transfers.length > 0 ? `${trip.title} · ${window.isRTL ? `تشمل ${window.arPlural(transfers.length, { one: "فاتورة واحدة", two: "فاتورتين", few: `${transfers.length} فواتير`, many: `${transfers.length} فاتورة`, other: `${transfers.length} فاتورة` })} غير مُسوّاة` : `${transfers.length} ${transfers.length === 1 ? "invoice" : "invoices"}`}` : trip.title,
      onBack: back
    }
  ), transfers.length === 0 ? /* @__PURE__ */ React.createElement("div", { style: {
    padding: "60px 24px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
    gap: 12
  } }, /* @__PURE__ */ React.createElement("div", { style: {
    width: 80,
    height: 80,
    borderRadius: 24,
    background: "linear-gradient(135deg, var(--moss) 0%, oklch(0.40 0.08 155) 100%)",
    display: "grid",
    placeItems: "center",
    boxShadow: "0 14px 32px oklch(0.50 0.08 155 / 0.4)"
  } }, /* @__PURE__ */ React.createElement(IconCheck, { size: 40, stroke: "#fff" })), /* @__PURE__ */ React.createElement("div", { className: "serif-italic", style: { fontSize: 28, color: "var(--ink)", lineHeight: 1.1 } }, t("settleAllSettled")), expenses.length === 0 && /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12.5, color: "var(--ink-mute)", maxWidth: 240 } }, t("settleNoActivity"))) : /* @__PURE__ */ React.createElement("div", { style: { padding: "4px 14px 0" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 10 } }, transfers.map((tr, i) => {
    const fromM = findMember(tr.from);
    const toM = findMember(tr.to);
    const isMe = tr.from === window.currentUserId || tr.to === window.currentUserId;
    const recordingThis = recording === tr.from + ">" + tr.to;
    return /* @__PURE__ */ React.createElement("div", { key: i, style: {
      background: isMe ? "var(--cream-2)" : "var(--cream-2)",
      borderRadius: 18,
      padding: "14px 16px",
      border: isMe ? "0.5px solid var(--clay)" : "0.5px solid var(--hairline)",
      display: "flex",
      flexDirection: "column",
      gap: 12
    } }, /* @__PURE__ */ React.createElement("div", { style: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      flexDirection: "row"
    } }, /* @__PURE__ */ React.createElement(Avatar, { m: fromM, size: 36 }), /* @__PURE__ */ React.createElement("div", { style: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      flex: 1,
      gap: 2
    } }, /* @__PURE__ */ React.createElement("span", { className: "icon-flip", style: { color: "var(--clay)" } }, /* @__PURE__ */ React.createElement(IconChevron, { size: 20, stroke: "currentColor" })), /* @__PURE__ */ React.createElement("span", { className: "mono", style: {
      fontSize: 16,
      fontWeight: 700,
      color: "var(--ink)",
      fontVariantNumeric: "tabular-nums"
    } }, fmt(tr.amount))), /* @__PURE__ */ React.createElement(Avatar, { m: toM, size: 36 })), /* @__PURE__ */ React.createElement("div", { style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      fontSize: 11.5,
      color: "var(--ink-mute)"
    } }, /* @__PURE__ */ React.createElement("span", { style: { overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" } }, fromM.name.split(" ")[0], " ", window.isRTL ? "←" : "→", " ", toM.name.split(" ")[0])), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 8 } }, /* @__PURE__ */ React.createElement("button", { onClick: () => handleShare(tr), style: {
      flex: 1,
      padding: "10px",
      borderRadius: 12,
      background: "var(--cream)",
      border: "0.5px solid var(--hairline-2)",
      color: "var(--ink-soft)",
      fontSize: 12.5,
      fontWeight: 500,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 5
    } }, /* @__PURE__ */ React.createElement(IconShare, { size: 13, stroke: "currentColor" }), " ", t("settleShare")), /* @__PURE__ */ React.createElement(
      "button",
      {
        onClick: () => handleMarkPaid(tr),
        disabled: recordingThis,
        style: {
          flex: 1.2,
          padding: "10px",
          borderRadius: 12,
          background: recordingThis ? "var(--ink-mute)" : "var(--ink)",
          color: "var(--cream)",
          fontSize: 12.5,
          fontWeight: 600,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 5
        }
      },
      /* @__PURE__ */ React.createElement(IconCheck, { size: 13, stroke: "currentColor" }),
      recordingThis ? "…" : t("settleMarkPaid")
    )));
  }))), settlements.length > 0 && /* @__PURE__ */ React.createElement("div", { style: { padding: "24px 14px 0" } }, /* @__PURE__ */ React.createElement(SectionLabel, null, t("settleHistoryTitle")), /* @__PURE__ */ React.createElement("div", { style: {
    background: "var(--cream-2)",
    borderRadius: 22,
    overflow: "hidden",
    border: "0.5px solid var(--hairline)",
    margin: "0 8px"
  } }, settlements.map((s, i) => {
    const fromM = findMember(s.from_user);
    const toM = findMember(s.to_user);
    const canDelete = s.created_by === window.currentUserId;
    return /* @__PURE__ */ React.createElement(
      SwipeRow,
      {
        key: s.id,
        actions: canDelete ? [
          { key: "delete", bg: "var(--clay)", icon: /* @__PURE__ */ React.createElement(IconTrash, { size: 18, stroke: "#fff" }) }
        ] : [],
        onAction: async (key) => {
          var _a2, _b2;
          if (key !== "delete") return;
          if (!confirm(window.isRTL ? "هل تريد التراجع عن تسوية هذه الفاتورة؟" : "Undo this settled invoice?")) return;
          try {
            await window.deleteSettlement(s.id, trip == null ? void 0 : trip.id);
            (_a2 = window.toast) == null ? void 0 : _a2.call(window, window.isRTL ? "تم التراجع عن التسوية بنجاح" : "Settlement undone", "success");
          } catch (err) {
            (_b2 = window.toast) == null ? void 0 : _b2.call(window, err.message || "Failed", "error");
          }
        }
      },
      /* @__PURE__ */ React.createElement("div", { style: {
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "12px 16px",
        background: "var(--cream-2)",
        borderTop: i > 0 ? "0.5px solid var(--hairline)" : "none",
        flexDirection: "row"
      } }, /* @__PURE__ */ React.createElement(Avatar, { m: fromM, size: 26 }), /* @__PURE__ */ React.createElement("span", { className: "icon-flip", style: { color: "var(--ink-mute)" } }, /* @__PURE__ */ React.createElement(IconChevron, { size: 14, stroke: "currentColor" })), /* @__PURE__ */ React.createElement(Avatar, { m: toM, size: 26 }), /* @__PURE__ */ React.createElement("div", { style: { flex: 1, fontSize: 12.5, color: "var(--ink-soft)" } }, fromM.name.split(" ")[0], " ", window.isRTL ? "←" : "→", " ", toM.name.split(" ")[0]), /* @__PURE__ */ React.createElement("span", { className: "mono", style: {
        fontSize: 13,
        fontWeight: 600,
        color: "var(--ink)",
        fontVariantNumeric: "tabular-nums"
      } }, fmt(parseFloat(s.amount_usd) || 0)))
    );
  }))));
}
window.ScreenSettleUp = ScreenSettleUp;
function ScreenPlan({ go, openSheet, loading }) {
  var _a;
  const trip = window.TRIP;
  const items = window.ITINERARY || [];
  const [editingItem, setEditingItem] = React.useState(null);
  const [addingForDay, setAddingForDay] = React.useState(null);
  const dataReady = trip && ((_a = window.isTripDataReady) == null ? void 0 : _a.call(window, trip.id));
  if (loading || !trip || !dataReady) {
    return /* @__PURE__ */ React.createElement("div", { style: { background: "var(--cream)", minHeight: "100%", paddingBottom: 100 } }, /* @__PURE__ */ React.createElement(Header, { title: t("planNav") || "Plan", onBack: () => go("hub") }), !trip && !loading ? /* @__PURE__ */ React.createElement("div", { style: { padding: "48px 32px", textAlign: "center", color: "var(--ink-mute)" } }, /* @__PURE__ */ React.createElement("div", { className: "serif", style: { fontSize: 18 } }, window.isRTL ? "يرجى تحديد وفتح رحلة أولاً" : "Open a trip first")) : /* @__PURE__ */ React.createElement(TripSkeleton, null));
  }
  const start = trip.startDate ? /* @__PURE__ */ new Date(trip.startDate + "T00:00:00") : null;
  const end = trip.endDate ? /* @__PURE__ */ new Date(trip.endDate + "T00:00:00") : start;
  const days = [];
  if (start && end) {
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      days.push(new Date(d));
    }
  }
  const isoDay = (d) => d.toISOString().slice(0, 10);
  const itemsByDay = {};
  items.forEach((it) => {
    (itemsByDay[it.dayDate] = itemsByDay[it.dayDate] || []).push(it);
  });
  return /* @__PURE__ */ React.createElement("div", { style: { background: "var(--cream)", minHeight: "100%", paddingBottom: 100 }, className: "no-scrollbar" }, /* @__PURE__ */ React.createElement(
    LargeTitleHeader,
    {
      title: t("planNav") || "Plan",
      subtitle: trip.title,
      onBack: () => go("hub")
    }
  ), /* @__PURE__ */ React.createElement("div", { style: { padding: "8px 14px 24px" } }, days.length === 0 ? /* @__PURE__ */ React.createElement("div", { style: {
    padding: "48px 24px",
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 12,
    background: "var(--cream-2)",
    borderRadius: 22,
    border: "0.5px solid var(--hairline)",
    margin: "14px 8px"
  } }, /* @__PURE__ */ React.createElement("div", { style: {
    width: 56,
    height: 56,
    borderRadius: 16,
    background: "var(--cream)",
    display: "grid",
    placeItems: "center",
    border: "0.5px solid var(--hairline)"
  } }, /* @__PURE__ */ React.createElement(window.IconCompass, { size: 24, stroke: "var(--ink-mute)" })), /* @__PURE__ */ React.createElement("div", { className: "serif", style: { fontSize: 18, color: "var(--ink)" } }, window.isRTL ? "لم تُحدد تواريخ لهذه الرحلة بعد" : "Pick your trip dates first"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12.5, color: "var(--ink-mute)", maxWidth: 260, lineHeight: 1.5 } }, window.isRTL ? "أضف تواريخ البداية والنهاية في إعدادات الرحلة لترى الأيام هنا." : "Add start & end dates in trip settings, then plan each day here."), /* @__PURE__ */ React.createElement("button", { onClick: () => go == null ? void 0 : go("settings"), style: {
    marginTop: 4,
    padding: "10px 18px",
    borderRadius: 14,
    background: "var(--ink)",
    color: "var(--cream)",
    fontSize: 13,
    fontWeight: 600,
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    flexDirection: "row"
  } }, /* @__PURE__ */ React.createElement(window.IconGear, { size: 13, stroke: "currentColor" }), window.isRTL ? "الانتقال إلى إعدادات الرحلة" : "Open trip settings")) : days.map((d, idx) => {
    const iso = isoDay(d);
    const dayItems = (itemsByDay[iso] || []).slice().sort((a, b) => {
      if (a.startTime && !b.startTime) return -1;
      if (!a.startTime && b.startTime) return 1;
      if (a.startTime && b.startTime) return a.startTime.localeCompare(b.startTime);
      return (a.sortOrder || 0) - (b.sortOrder || 0);
    });
    return /* @__PURE__ */ React.createElement(
      PlanDay,
      {
        key: iso,
        date: d,
        dayNumber: idx + 1,
        items: dayItems,
        onAdd: () => setAddingForDay(iso),
        onTapItem: (it) => setEditingItem(it),
        openSheet
      }
    );
  })), /* @__PURE__ */ React.createElement(
    Sheet,
    {
      open: !!addingForDay,
      onClose: () => setAddingForDay(null),
      title: t("planAddTitle") || "Add activity",
      height: 0.78
    },
    addingForDay && /* @__PURE__ */ React.createElement(
      AddPlanItemSheet,
      {
        dayDate: addingForDay,
        onDone: () => setAddingForDay(null)
      }
    )
  ), /* @__PURE__ */ React.createElement(
    Sheet,
    {
      open: !!editingItem,
      onClose: () => setEditingItem(null),
      title: t("planEditTitle") || "Edit activity",
      height: 0.78
    },
    editingItem && /* @__PURE__ */ React.createElement(
      AddPlanItemSheet,
      {
        existing: editingItem,
        dayDate: editingItem.dayDate,
        onDone: () => setEditingItem(null)
      }
    )
  ));
}
const PLAN_CAT_META = {
  food: { emoji: "🍜", label_en: "Food", label_ar: "مطاعم ومقاهي", color: "var(--clay)" },
  sight: { emoji: "🎌", label_en: "Sight", label_ar: "معالم سياحية", color: "var(--moss)" },
  transport: { emoji: "🚅", label_en: "Transit", label_ar: "تنقل ومواصلات", color: "var(--indigo)" },
  lodging: { emoji: "🏨", label_en: "Lodging", label_ar: "سكن وإقامة", color: "var(--honey)" },
  misc: { emoji: "📌", label_en: "Misc", label_ar: "أنشطة أخرى", color: "var(--ink-soft)" }
};
function fmtDayLabel(d, dayNumber) {
  const weekday = d.toLocaleDateString(window.isRTL ? "ar" : "en", { weekday: "short" });
  const datePart = d.toLocaleDateString(window.isRTL ? "ar" : "en", { month: "short", day: "numeric" });
  return { weekday, datePart, dayNumber };
}
function fmtTime(hms) {
  if (!hms) return "";
  const [h, m] = hms.split(":");
  const d = /* @__PURE__ */ new Date();
  d.setHours(parseInt(h, 10), parseInt(m, 10));
  return d.toLocaleTimeString(window.isRTL ? "ar" : "en", { hour: "numeric", minute: "2-digit" });
}
function PlanDay({ date, dayNumber, items, onAdd, onTapItem, openSheet }) {
  const { weekday, datePart } = fmtDayLabel(date, dayNumber);
  return /* @__PURE__ */ React.createElement("div", { style: { marginTop: 18 } }, /* @__PURE__ */ React.createElement("div", { style: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 12px 8px",
    flexDirection: "row"
  } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "baseline", gap: 8, flexDirection: "row" } }, /* @__PURE__ */ React.createElement("span", { className: "serif", style: { fontSize: 20, color: "var(--ink)" } }, window.isRTL ? `اليوم ${dayNumber}` : `Day ${dayNumber}`), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 12, color: "var(--ink-mute)" } }, "· ", weekday, " ", datePart)), /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: onAdd,
      "aria-label": window.isRTL ? "إضافة نشاط" : "Add activity",
      style: {
        padding: "7px 12px",
        borderRadius: 999,
        background: "var(--ink)",
        color: "var(--cream)",
        fontSize: 12,
        fontWeight: 500,
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        flexDirection: "row"
      }
    },
    /* @__PURE__ */ React.createElement(window.IconPlus, { size: 12, stroke: "currentColor" }),
    t("planAddBtn") || "Add"
  )), /* @__PURE__ */ React.createElement("div", { style: {
    background: "var(--cream-2)",
    borderRadius: 22,
    border: "0.5px solid var(--hairline)",
    margin: "0 8px",
    overflow: "hidden"
  } }, items.length === 0 ? (
    // Was prefixed with a 📝 Unicode dingbat that rendered
    // inconsistently across platforms. Now a clean text-only
    // empty row with a hairline + IconPlus chip — matches the
    // SVG icon vocabulary the rest of the app uses.
    /* @__PURE__ */ React.createElement("button", { onClick: onAdd, style: {
      width: "100%",
      padding: "20px 18px",
      background: "transparent",
      color: "var(--ink-mute)",
      fontSize: 12.5,
      textAlign: "start",
      display: "flex",
      alignItems: "center",
      gap: 10,
      flexDirection: "row"
    } }, /* @__PURE__ */ React.createElement("span", { style: {
      width: 28,
      height: 28,
      borderRadius: 8,
      flexShrink: 0,
      background: "var(--cream)",
      border: "0.5px solid var(--hairline)",
      display: "grid",
      placeItems: "center",
      color: "var(--ink-mute)"
    } }, /* @__PURE__ */ React.createElement(window.IconPlus, { size: 13, stroke: "currentColor" })), /* @__PURE__ */ React.createElement("span", null, t("planEmptyDay") || "Nothing planned yet — tap to add"))
  ) : items.map((it, i) => /* @__PURE__ */ React.createElement(
    window.SwipeRow,
    {
      key: it.id,
      actions: [{ key: "delete", bg: "var(--clay)", icon: /* @__PURE__ */ React.createElement(window.IconTrash, { size: 18, stroke: "#fff" }) }],
      onAction: async (key) => {
        var _a, _b, _c, _d;
        if (key !== "delete") return;
        if (!confirm(window.isRTL ? `هل تريد حذف "${it.title}"؟` : `Delete "${it.title}"?`)) return;
        try {
          await window.deleteItineraryItem(it.id, (_a = window.TRIP) == null ? void 0 : _a.id);
          await window.loadItinerary((_b = window.TRIP) == null ? void 0 : _b.id);
          (_c = window.toast) == null ? void 0 : _c.call(window, window.isRTL ? "تم حذف النشاط" : "Deleted", "success");
        } catch (err) {
          (_d = window.toast) == null ? void 0 : _d.call(window, err.message || "Failed", "error");
        }
      }
    },
    /* @__PURE__ */ React.createElement("div", { style: { background: "var(--cream-2)" } }, /* @__PURE__ */ React.createElement(
      PlanRow,
      {
        item: it,
        isLast: i === items.length - 1,
        onTap: () => onTapItem(it),
        openSheet
      }
    ))
  ))));
}
const PLAN_TO_EXPENSE_CAT = {
  food: "food",
  sight: "culture",
  transport: "transit",
  lodging: "lodging",
  misc: "misc"
};
function PlanRow({ item, isLast, onTap, openSheet }) {
  const meta = PLAN_CAT_META[item.category] || PLAN_CAT_META.misc;
  const openMaps = (e) => {
    e.stopPropagation();
    if (!item.location) return;
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.location)}`, "_blank");
  };
  const logExpense = (e) => {
    e.stopPropagation();
    openSheet == null ? void 0 : openSheet("addExpense", {
      title: item.title,
      cat: PLAN_TO_EXPENSE_CAT[item.category] || "misc",
      // Link the resulting expense back to this activity.
      source: { plan: item.id }
    });
  };
  const isLogged = !!item.linkedExpenseId;
  return /* @__PURE__ */ React.createElement("div", { onClick: onTap, style: {
    padding: "12px 14px",
    cursor: "pointer",
    display: "flex",
    alignItems: "flex-start",
    gap: 12,
    flexDirection: "row",
    borderBottom: isLast ? "none" : "0.5px solid var(--hairline)"
  } }, /* @__PURE__ */ React.createElement("div", { style: {
    minWidth: 52,
    paddingTop: 2,
    fontFamily: "var(--mono)",
    fontSize: 11,
    color: "var(--ink-mute)",
    letterSpacing: "0.04em"
  } }, item.startTime ? fmtTime(item.startTime) : "—"), /* @__PURE__ */ React.createElement("div", { style: { flex: 1, minWidth: 0 } }, /* @__PURE__ */ React.createElement("div", { style: {
    fontSize: 14,
    fontWeight: 500,
    color: "var(--ink)",
    display: "flex",
    alignItems: "center",
    gap: 6,
    flexDirection: "row"
  } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 14 } }, meta.emoji), /* @__PURE__ */ React.createElement("span", null, item.title)), /* @__PURE__ */ React.createElement("div", { style: {
    marginTop: 4,
    display: "flex",
    alignItems: "center",
    gap: 10,
    flexDirection: "row",
    flexWrap: "wrap"
  } }, item.location && /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: openMaps,
      "aria-label": window.isRTL ? `الموقع: ${item.location}` : `Location: ${item.location}`,
      style: {
        padding: "6px 10px",
        borderRadius: 999,
        background: "var(--cream)",
        border: "0.5px solid var(--hairline)",
        color: "var(--ink-soft)",
        fontSize: 11.5,
        fontWeight: 500,
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        flexDirection: "row",
        textAlign: "start"
      }
    },
    /* @__PURE__ */ React.createElement(window.IconPin, { size: 11, stroke: "currentColor" }),
    /* @__PURE__ */ React.createElement("span", { style: {
      maxWidth: 140,
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap"
    } }, item.location)
  ), isLogged ? /* @__PURE__ */ React.createElement(
    "span",
    {
      "aria-label": window.isRTL ? "مُسجّل في الميزانية" : "Logged in budget",
      style: {
        padding: "6px 10px",
        borderRadius: 999,
        background: "oklch(0.50 0.08 155 / 0.14)",
        color: "var(--moss)",
        border: "0.5px solid oklch(0.50 0.08 155 / 0.30)",
        fontSize: 11.5,
        fontWeight: 600,
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        flexDirection: "row"
      }
    },
    /* @__PURE__ */ React.createElement(window.IconCheck, { size: 11, stroke: "currentColor" }),
    window.isRTL ? "مُسجّل" : "Logged"
  ) : /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: logExpense,
      "aria-label": window.isRTL ? "سجل مصروف لهذا النشاط" : "Log expense for this activity",
      style: {
        padding: "6px 10px",
        borderRadius: 999,
        background: "var(--cream)",
        color: "var(--ink-soft)",
        border: "0.5px solid var(--hairline)",
        fontSize: 11.5,
        fontWeight: 500,
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        flexDirection: "row"
      }
    },
    /* @__PURE__ */ React.createElement(window.IconWallet, { size: 11, stroke: "currentColor" }),
    t("planLogExpense") || "Log expense"
  ))));
}
function AddPlanItemSheet({ dayDate, existing, onDone }) {
  const trip = window.TRIP;
  const isEdit = !!existing;
  const [title, setTitle] = React.useState((existing == null ? void 0 : existing.title) || "");
  const [category, setCategory] = React.useState((existing == null ? void 0 : existing.category) || "sight");
  const [time, setTime] = React.useState((existing == null ? void 0 : existing.startTime) ? existing.startTime.slice(0, 5) : "");
  const [location2, setLocation] = React.useState((existing == null ? void 0 : existing.location) || "");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const handleSave = async () => {
    if (!title.trim()) {
      setError(t("planTitleReq") || "Enter a title");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const payload = {
        dayDate,
        startTime: time || null,
        title,
        category,
        location: location2
      };
      if (isEdit) {
        await window.updateItineraryItem(existing.id, trip == null ? void 0 : trip.id, payload);
      } else {
        await window.addItineraryItem(trip == null ? void 0 : trip.id, payload);
      }
      await window.loadItinerary(trip == null ? void 0 : trip.id);
      onDone();
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };
  const handleDelete = async () => {
    if (!confirm(window.isRTL ? "هل تريد حذف هذا النشاط من الخطة؟" : "Delete this activity?")) return;
    setLoading(true);
    try {
      await window.deleteItineraryItem(existing.id, trip == null ? void 0 : trip.id);
      await window.loadItinerary(trip == null ? void 0 : trip.id);
      onDone();
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };
  const fieldStyle = {
    width: "100%",
    padding: "13px 14px",
    borderRadius: 14,
    border: "0.5px solid var(--hairline)",
    background: "var(--cream)",
    color: "var(--ink)",
    fontSize: 14,
    fontFamily: "var(--sans)",
    outline: "none",
    textAlign: "start"
  };
  const labelStyle = {
    fontSize: 12,
    fontWeight: 600,
    color: "var(--ink)",
    marginBottom: 6
  };
  return /* @__PURE__ */ React.createElement("div", { style: { padding: "4px 22px 28px" } }, /* @__PURE__ */ React.createElement("div", { style: { marginBottom: 10 } }, /* @__PURE__ */ React.createElement("div", { style: labelStyle }, t("planFieldTitle") || "Activity"), /* @__PURE__ */ React.createElement(
    "input",
    {
      value: title,
      onChange: (e) => setTitle(e.target.value),
      placeholder: window.isRTL ? "مثلاً: زيارة المتاحف والحدائق" : "e.g. Visit museum",
      style: fieldStyle
    }
  )), /* @__PURE__ */ React.createElement("div", { style: { marginBottom: 10 } }, /* @__PURE__ */ React.createElement("div", { style: labelStyle }, t("planFieldCategory") || "Category"), /* @__PURE__ */ React.createElement("div", { className: "no-scrollbar", style: { display: "flex", gap: 7, overflowX: "auto", flexDirection: "row" } }, Object.entries(PLAN_CAT_META).map(([k, meta]) => {
    const active = category === k;
    return /* @__PURE__ */ React.createElement("button", { key: k, onClick: () => setCategory(k), style: {
      flexShrink: 0,
      padding: "9px 13px",
      borderRadius: 14,
      background: active ? meta.color : "var(--cream-2)",
      color: active ? "#fff" : "var(--ink-soft)",
      border: active ? "none" : "0.5px solid var(--hairline)",
      fontSize: 13,
      fontWeight: 500,
      display: "flex",
      alignItems: "center",
      gap: 6,
      flexDirection: "row"
    } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 15 } }, meta.emoji), /* @__PURE__ */ React.createElement("span", null, window.isRTL ? meta.label_ar : meta.label_en));
  }))), /* @__PURE__ */ React.createElement("div", { style: { marginBottom: 10 } }, /* @__PURE__ */ React.createElement("div", { style: labelStyle }, t("planFieldTime") || "Time (optional)"), /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "time",
      value: time,
      onChange: (e) => setTime(e.target.value),
      style: fieldStyle
    }
  )), /* @__PURE__ */ React.createElement("div", { style: { marginBottom: 14 } }, /* @__PURE__ */ React.createElement("div", { style: labelStyle }, t("planFieldLocation") || "Location (optional)"), /* @__PURE__ */ React.createElement(
    "input",
    {
      value: location2,
      onChange: (e) => setLocation(e.target.value),
      placeholder: window.isRTL ? "ابحث عن العنوان أو اسم المكان" : "Address or place name",
      style: fieldStyle
    }
  )), error && /* @__PURE__ */ React.createElement("div", { style: {
    marginBottom: 10,
    padding: "10px 14px",
    borderRadius: 12,
    background: "oklch(0.62 0.13 35 / 0.10)",
    border: "0.5px solid oklch(0.62 0.13 35 / 0.3)",
    fontSize: 12.5,
    color: "var(--clay-deep)"
  } }, error), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 10, flexDirection: "row" } }, isEdit && /* @__PURE__ */ React.createElement("button", { onClick: handleDelete, disabled: loading, style: {
    padding: "16px 18px",
    borderRadius: 18,
    background: "var(--cream-2)",
    color: "var(--clay-deep)",
    border: "0.5px solid var(--hairline-2)",
    fontSize: 14,
    fontWeight: 600,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 6
  } }, /* @__PURE__ */ React.createElement(window.IconTrash, { size: 14, stroke: "currentColor" }), window.isRTL ? "حذف النشاط" : "Delete"), /* @__PURE__ */ React.createElement("button", { onClick: handleSave, disabled: loading, style: {
    flex: 1,
    padding: "16px",
    borderRadius: 18,
    background: loading ? "var(--ink-soft)" : "var(--clay)",
    color: "#fff",
    fontSize: 14,
    fontWeight: 600,
    boxShadow: loading ? "none" : "0 8px 20px oklch(0.62 0.13 35 / 0.4)"
  } }, loading ? window.isRTL ? "جارٍ الحفظ الآن…" : "Saving…" : isEdit ? window.isRTL ? "حفظ التعديلات" : "Save changes" : window.isRTL ? "إضافة إلى الخطة" : "Add to plan")));
}
window.ScreenPlan = ScreenPlan;
function ScreenTripSearch({ back, openSheet, openDoc, go }) {
  const [q, setQ] = React.useState("");
  const inputRef = React.useRef(null);
  React.useEffect(() => {
    const t2 = setTimeout(() => {
      var _a;
      return (_a = inputRef.current) == null ? void 0 : _a.focus();
    }, 50);
    return () => clearTimeout(t2);
  }, []);
  const lower = q.trim().toLowerCase();
  const hasQ = lower.length > 0;
  const match = (s) => s && String(s).toLowerCase().includes(lower);
  const expenses = !hasQ ? [] : (window.EXPENSES || []).filter((e) => match(e.title) || match(e.note) || match(e.cat));
  const allDocs = Object.values(window.DOCS_BY_CAT || {}).flat();
  const docs = !hasQ ? [] : allDocs.filter((d) => {
    if (match(d.title) || match(d.sub) || match(d.categoryLabel)) return true;
    const det = d.details || {};
    return Object.values(det).some((v) => match(v));
  });
  const planItems = !hasQ ? [] : (window.ITINERARY || []).filter((it) => match(it.title) || match(it.location));
  const total = expenses.length + docs.length + planItems.length;
  const cats = window.DOC_CATEGORIES || [];
  const eCats = window.CATEGORIES || [];
  const onPickExpense = (e) => {
    back();
    setTimeout(() => openSheet == null ? void 0 : openSheet("editExpense", e), 50);
  };
  const onPickDoc = (d) => {
    back();
    setTimeout(() => openDoc == null ? void 0 : openDoc(d, cats.find((c) => c.key === d.category)), 50);
  };
  const onPickPlan = () => {
    back();
    setTimeout(() => go == null ? void 0 : go("plan"), 50);
  };
  return /* @__PURE__ */ React.createElement("div", { "data-screen-label": "Trip Search", style: {
    background: "var(--cream)",
    minHeight: "100%",
    paddingBottom: 60
  } }, /* @__PURE__ */ React.createElement("div", { style: {
    position: "sticky",
    top: 0,
    zIndex: 20,
    padding: "max(54px, calc(env(safe-area-inset-top) + 12px)) 14px 12px",
    background: "var(--cream)",
    borderBottom: "0.5px solid var(--hairline)"
  } }, /* @__PURE__ */ React.createElement("div", { style: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    flexDirection: "row",
    padding: "8px 12px",
    borderRadius: 14,
    background: "var(--cream-2)",
    border: "0.5px solid var(--hairline)"
  } }, /* @__PURE__ */ React.createElement(window.IconSearch, { size: 16, stroke: "var(--ink-mute)" }), /* @__PURE__ */ React.createElement(
    "input",
    {
      ref: inputRef,
      value: q,
      onChange: (e) => setQ(e.target.value),
      placeholder: window.isRTL ? "ابحث عن مصروفات، مستندات، تفاصيل في الخطة…" : "Search expenses, docs, plan…",
      style: {
        flex: 1,
        border: 0,
        outline: "none",
        background: "transparent",
        fontSize: 15,
        fontFamily: "var(--sans)",
        color: "var(--ink)",
        textAlign: "start"
      }
    }
  ), q && /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: () => {
        var _a;
        setQ("");
        (_a = inputRef.current) == null ? void 0 : _a.focus();
      },
      "aria-label": "Clear",
      style: {
        width: 22,
        height: 22,
        borderRadius: 999,
        background: "var(--ink-mute)",
        color: "var(--cream)",
        display: "grid",
        placeItems: "center",
        fontSize: 14,
        lineHeight: 1
      }
    },
    "×"
  ), /* @__PURE__ */ React.createElement("button", { onClick: back, style: {
    padding: "4px 10px",
    borderRadius: 999,
    fontSize: 13,
    fontWeight: 500,
    background: "transparent",
    color: "var(--ink-soft)"
  } }, window.isRTL ? "إلغاء البحث" : "Cancel")), hasQ && // Was uppercase mono 0.06em tracked. Now sentence-case sans
  // ink-mute -- reads as the natural "3 results" sub-label, not
  // a barcode under the search input.
  /* @__PURE__ */ React.createElement("div", { style: {
    marginTop: 8,
    padding: "0 4px",
    fontSize: 12,
    color: "var(--ink-mute)"
  } }, total === 0 ? window.isRTL ? "لم نجد أي نتائج تطابق كلمة البحث" : "No results" : window.isRTL ? `وجدنا ${window.arPlural(total, { one: "نتيجة واحدة", two: "نتيجتين", few: `${total} نتائج`, many: `${total} نتيجة`, other: `${total} نتيجة` })}` : `${total} result${total === 1 ? "" : "s"}`)), /* @__PURE__ */ React.createElement("div", { style: { padding: "14px 14px 100px" } }, !hasQ && /* @__PURE__ */ React.createElement("div", { style: {
    padding: "60px 24px",
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 10
  } }, /* @__PURE__ */ React.createElement("div", { style: {
    width: 56,
    height: 56,
    borderRadius: 16,
    background: "var(--cream-2)",
    display: "grid",
    placeItems: "center",
    border: "0.5px solid var(--hairline)"
  } }, /* @__PURE__ */ React.createElement(window.IconSearch, { size: 24, stroke: "var(--ink-mute)" })), /* @__PURE__ */ React.createElement("div", { className: "serif", style: { fontSize: 18, color: "var(--ink)" } }, window.isRTL ? "ابحث في تفاصيل ومحتوى الرحلة" : "Search this trip"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12.5, color: "var(--ink-mute)", maxWidth: 280, lineHeight: 1.5 } }, window.isRTL ? "تتبع وابحث في كل مكان: قائمة مصروفاتك، ححوزاتك ومستنداتك (تذاكر وفنادق وتأشيرات)، وجداول أنشطة الأيام — كل شيء متاح هنا فوراً." : "Expenses, docs (tickets, hotels, visas), plan items — all in one place.")), expenses.length > 0 && /* @__PURE__ */ React.createElement(
    ResultSection,
    {
      title: window.isRTL ? "مصروفات الرحلة" : "Expenses",
      count: expenses.length
    },
    expenses.slice(0, 30).map((e) => {
      var _a, _b;
      const c = eCats.find((x) => x.key === e.cat);
      const m = (window.MEMBERS || []).find((x) => x.id === e.who);
      return /* @__PURE__ */ React.createElement(
        ResultRow,
        {
          key: e.id,
          icon: /* @__PURE__ */ React.createElement("div", { style: {
            width: 36,
            height: 36,
            borderRadius: 10,
            flexShrink: 0,
            background: (c == null ? void 0 : c.color) || "var(--ink-mute)",
            display: "grid",
            placeItems: "center",
            fontSize: 16
          } }, ((_b = (_a = window.CAT_META) == null ? void 0 : _a[e.cat]) == null ? void 0 : _b.emoji) || "💸"),
          title: e.title,
          detail: `${(c == null ? void 0 : c.label) || e.cat}${m ? " · " + m.name.split(" ")[0] : ""}${e.when ? " · " + e.when : ""}`,
          trailing: /* @__PURE__ */ React.createElement("div", { className: "mono", style: {
            fontSize: 13,
            fontWeight: 600,
            color: "var(--ink)"
          } }, window.fmtMoney(e.usd, { in: "home" })),
          onClick: () => onPickExpense(e)
        }
      );
    })
  ), docs.length > 0 && /* @__PURE__ */ React.createElement(
    ResultSection,
    {
      title: window.isRTL ? "مستندات وحجوزات" : "Documents",
      count: docs.length
    },
    docs.slice(0, 30).map((d) => {
      var _a;
      const cat = cats.find((c) => c.key === d.category);
      const tintFill = { indigo: "var(--indigo)", clay: "var(--clay)", moss: "var(--moss)", honey: "var(--honey)" }[d.tint] || "var(--clay)";
      return /* @__PURE__ */ React.createElement(
        ResultRow,
        {
          key: d.id,
          icon: d.coverUrl ? /* @__PURE__ */ React.createElement("div", { style: {
            width: 36,
            height: 36,
            borderRadius: 10,
            flexShrink: 0,
            backgroundImage: `url(${d.coverUrl})`,
            backgroundSize: "cover",
            backgroundPosition: "center"
          } }) : /* @__PURE__ */ React.createElement("div", { style: {
            width: 36,
            height: 36,
            borderRadius: 10,
            flexShrink: 0,
            background: tintFill,
            color: "#fff",
            display: "grid",
            placeItems: "center"
          } }, /* @__PURE__ */ React.createElement(window.IconDoc, { size: 16, stroke: "#fff" })),
          title: d.title,
          detail: `${(cat == null ? void 0 : cat.label) || d.category}${((_a = window.fmtDocSummary) == null ? void 0 : _a.call(window, d)) ? " · " + window.fmtDocSummary(d) : ""}`,
          onClick: () => onPickDoc(d)
        }
      );
    })
  ), planItems.length > 0 && /* @__PURE__ */ React.createElement(
    ResultSection,
    {
      title: window.isRTL ? "أنشطة الخطة" : "Plan",
      count: planItems.length
    },
    planItems.slice(0, 30).map((it) => {
      const PLAN_EMOJI = { food: "🍜", sight: "🎌", transport: "🚅", lodging: "🏨", misc: "📌" };
      const d = it.dayDate ? /* @__PURE__ */ new Date(it.dayDate + "T00:00:00") : null;
      const dayLabel = d ? d.toLocaleDateString(
        window.isRTL ? "ar" : "en",
        { weekday: "short", month: "short", day: "numeric" }
      ) : "";
      const time = it.startTime ? it.startTime.slice(0, 5) : "";
      return /* @__PURE__ */ React.createElement(
        ResultRow,
        {
          key: it.id,
          icon: /* @__PURE__ */ React.createElement("div", { style: {
            width: 36,
            height: 36,
            borderRadius: 10,
            flexShrink: 0,
            background: "var(--cream-2)",
            border: "0.5px solid var(--hairline)",
            display: "grid",
            placeItems: "center",
            fontSize: 18
          } }, PLAN_EMOJI[it.category] || "📌"),
          title: it.title,
          detail: [dayLabel, time, it.location].filter(Boolean).join(" · "),
          onClick: onPickPlan
        }
      );
    })
  ), hasQ && total === 0 && /* @__PURE__ */ React.createElement("div", { style: {
    padding: "40px 24px",
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 10
  } }, /* @__PURE__ */ React.createElement("div", { style: {
    width: 48,
    height: 48,
    borderRadius: 14,
    background: "var(--cream-2)",
    display: "grid",
    placeItems: "center",
    border: "0.5px solid var(--hairline)"
  } }, /* @__PURE__ */ React.createElement(window.IconSearch, { size: 20, stroke: "var(--ink-mute)" })), /* @__PURE__ */ React.createElement("div", { className: "serif", style: { fontSize: 16, color: "var(--ink)" } }, window.isRTL ? `لم نجد نتائج لـ "${q}"` : `No results for "${q}"`), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, color: "var(--ink-mute)" } }, window.isRTL ? "جرّب كلمة بحث أخرى" : "Try a different keyword"))));
}
function ResultSection({ title, count, children }) {
  return /* @__PURE__ */ React.createElement("div", { style: { marginBottom: 18 } }, /* @__PURE__ */ React.createElement("div", { style: {
    display: "flex",
    alignItems: "baseline",
    justifyContent: "space-between",
    flexDirection: "row",
    padding: "0 4px",
    marginBottom: 8
  } }, /* @__PURE__ */ React.createElement("div", { style: {
    fontSize: 13,
    fontWeight: 600,
    color: "var(--ink)",
    letterSpacing: "-0.01em"
  } }, title), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11.5, color: "var(--ink-mute)" } }, count)), /* @__PURE__ */ React.createElement("div", { style: {
    background: "var(--cream-2)",
    borderRadius: 18,
    overflow: "hidden",
    border: "0.5px solid var(--hairline)"
  } }, children));
}
function ResultRow({ icon, title, detail, trailing, onClick }) {
  return /* @__PURE__ */ React.createElement("button", { onClick, style: {
    all: "unset",
    cursor: "pointer",
    width: "100%",
    boxSizing: "border-box",
    padding: "11px 14px",
    display: "flex",
    alignItems: "center",
    gap: 12,
    flexDirection: "row",
    borderBottom: "0.5px solid var(--hairline)"
  } }, icon, /* @__PURE__ */ React.createElement("div", { style: { flex: 1, minWidth: 0, textAlign: "start" } }, /* @__PURE__ */ React.createElement("div", { style: {
    fontSize: 13.5,
    fontWeight: 500,
    color: "var(--ink)",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap"
  } }, title), detail && /* @__PURE__ */ React.createElement("div", { style: {
    fontSize: 11,
    color: "var(--ink-mute)",
    marginTop: 2,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap"
  } }, detail)), trailing);
}
window.ScreenTripSearch = ScreenTripSearch;
const DOC_SCHEMAS = {
  flights: {
    emoji: "✈️",
    titleLabel: () => window.isRTL ? "مسار خط الطيران" : "Flight",
    titlePlaceholder: () => window.isRTL ? "مثال: الخطوط السعودية SV777 · طوكيو - الرياض" : "e.g. Saudia SV777 · Tokyo → Riyadh",
    fields: [
      { key: "airline", type: "text", label: () => window.isRTL ? "خطوط / ناقل الطيران" : "Airline", placeholder: () => "Saudia · Emirates · JAL" },
      { key: "dep_airport", type: "text", label: () => window.isRTL ? "مطار المغادرة" : "From airport", placeholder: () => window.isRTL ? "اكتب رمز المطار (مثل HND)" : "HND" },
      { key: "dep_terminal", type: "text", label: () => window.isRTL ? "الصالة" : "Terminal", placeholder: () => "3", col: 2 },
      { key: "dep_at", type: "datetime", label: () => window.isRTL ? "موعد الإقلاع" : "Departure" },
      { key: "arr_airport", type: "text", label: () => window.isRTL ? "مطار الوصول" : "To airport", placeholder: () => window.isRTL ? "اكتب رمز مطار الهبوط (مثل RUH)" : "RUH" },
      { key: "arr_terminal", type: "text", label: () => window.isRTL ? "الصالة" : "Terminal", placeholder: () => "1", col: 2 },
      { key: "arr_at", type: "datetime", rangeStart: "dep_at", label: () => window.isRTL ? "موعد الهبوط" : "Arrival" },
      { key: "location_url", type: "url", label: () => window.isRTL ? "رابط المطار" : "Airport map link", placeholder: () => "https://maps.google.com/..." }
    ],
    primaryFileLabel: () => window.isRTL ? "التذكرة الإلكترونية الرسمية (PDF)" : "E-ticket",
    secondaryFile: {
      key: "boarding_pass",
      label: () => window.isRTL ? "بطاقة الصعود" : "Boarding pass"
    },
    showCost: true
  },
  lodging: {
    emoji: "🏨",
    titleLabel: () => window.isRTL ? "اسم المنشأة / الفندق" : "Hotel / Stay",
    titlePlaceholder: () => window.isRTL ? "مثال: فندق نيكو طوكيو" : "e.g. Park Hyatt Tokyo",
    fields: [
      { key: "check_in_at", type: "datetime", label: () => window.isRTL ? "موعد تسجيل الدخول (Check-in)" : "Check-in" },
      { key: "check_out_at", type: "datetime", rangeStart: "check_in_at", label: () => window.isRTL ? "موعد مغادرة السكن (Check-out)" : "Check-out" },
      { key: "address", type: "text", label: () => window.isRTL ? "العنوان" : "Address", placeholder: () => "Street, city" },
      { key: "location_url", type: "url", label: () => window.isRTL ? "رابط الموقع" : "Location link", placeholder: () => "https://maps.google.com/..." }
    ],
    primaryFileLabel: () => window.isRTL ? "مرجع الحجز" : "Reservation",
    showCost: true
  },
  transport: {
    emoji: "🚆",
    titleLabel: () => window.isRTL ? "مسمى شركة / خدمة التنقل" : "Vendor / Service",
    titlePlaceholder: () => window.isRTL ? "مثال: Hertz · إيجار سيارة عائلية" : "e.g. Hertz · Car rental",
    fields: [
      { key: "vendor", type: "text", label: () => window.isRTL ? "المزود" : "Vendor", placeholder: () => "Hertz · Avis · JR" },
      { key: "pickup_at", type: "datetime", label: () => window.isRTL ? "الاستلام" : "Pick-up" },
      { key: "dropoff_at", type: "datetime", rangeStart: "pickup_at", label: () => window.isRTL ? "التسليم" : "Drop-off" },
      { key: "location_url", type: "url", label: () => window.isRTL ? "رابط الموقع" : "Location link", placeholder: () => "https://maps.google.com/..." }
    ],
    primaryFileLabel: () => window.isRTL ? "مرجع الإيجار" : "Rental reference",
    showCost: true
  },
  visas: {
    emoji: "📘",
    titleLabel: () => window.isRTL ? "مسمى التأشيرة والوثيقة" : "Title",
    titlePlaceholder: () => window.isRTL ? "مثال: تأشيرة اليابان السياحية" : "e.g. Japan eVisa",
    fields: [
      { key: "visa_type", type: "text", label: () => window.isRTL ? "نوع التأشيرة" : "Visa type", placeholder: () => "Tourist · Business" },
      { key: "issued_on", type: "date", label: () => window.isRTL ? "تاريخ الإصدار" : "Issued" },
      { key: "expires_on", type: "date", rangeStart: "issued_on", label: () => window.isRTL ? "تاريخ الانتهاء" : "Expires" }
    ],
    primaryFileLabel: () => window.isRTL ? "وثيقة التأشيرة" : "Visa document",
    showCost: false
  }
};
function fmtDocSummary(doc) {
  const s = DOC_SCHEMAS[doc.category] || DOC_SCHEMAS.visas;
  const d = doc.details || {};
  const fmtDT = (iso) => {
    if (!iso) return null;
    const dt = new Date(iso);
    if (isNaN(dt)) return null;
    return dt.toLocaleString(window.isRTL ? "ar" : "en", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit"
    });
  };
  const fmtD = (iso) => {
    if (!iso) return null;
    const dt = /* @__PURE__ */ new Date(iso + (iso.length === 10 ? "T00:00:00" : ""));
    if (isNaN(dt)) return null;
    return dt.toLocaleDateString(window.isRTL ? "ar" : "en", {
      month: "short",
      day: "numeric",
      year: "numeric"
    });
  };
  if (doc.category === "flights") {
    const route = d.dep_airport && d.arr_airport ? `${d.dep_airport} → ${d.arr_airport}` : null;
    const when = fmtDT(d.dep_at);
    return [route, when].filter(Boolean).join(" · ") || doc.sub || null;
  }
  if (doc.category === "lodging") {
    const checkIn = fmtDT(d.check_in_at);
    const checkOut = fmtDT(d.check_out_at);
    if (checkIn && checkOut) return `${checkIn} → ${checkOut}`;
    return checkIn || doc.sub || null;
  }
  if (doc.category === "transport") {
    const pickup = fmtDT(d.pickup_at);
    const vendor = d.vendor;
    return [vendor, pickup].filter(Boolean).join(" · ") || doc.sub || null;
  }
  if (doc.category === "visas") {
    const exp = fmtD(d.expires_on);
    const type = d.visa_type;
    return [type, exp && `${window.isRTL ? "ينتهي" : "exp."} ${exp}`].filter(Boolean).join(" · ") || doc.sub || null;
  }
  return doc.sub || null;
}
function computeUpcomingEvents(opts = {}) {
  const now = opts.now || /* @__PURE__ */ new Date();
  const cutoff = new Date(now.getTime() + 24 * 3600 * 1e3);
  const grace = new Date(now.getTime() - 2 * 3600 * 1e3);
  const events = [];
  const docs = Object.values(window.DOCS_BY_CAT || {}).flat();
  docs.forEach((doc) => {
    if (doc.ownerUserId && doc.ownerUserId !== window.currentUserId) return;
    const d = doc.details || {};
    if (doc.category === "flights" && d.dep_at) {
      const startAt = new Date(d.dep_at);
      const endAt = d.arr_at ? new Date(d.arr_at) : null;
      if (!isNaN(startAt) && startAt >= grace && startAt <= cutoff) {
        events.push({
          id: `doc-${doc.id}`,
          type: "flight",
          emoji: "✈️",
          title: doc.title || (d.airline || "Flight"),
          detail: [d.dep_airport, d.arr_airport].filter(Boolean).join(" → ") || null,
          subtle: [d.airline, d.dep_terminal && `T${d.dep_terminal}`].filter(Boolean).join(" · ") || null,
          startAt,
          endAt,
          docCategory: "flights",
          doc,
          locationUrl: d.location_url || null,
          primaryFileUrl: doc.filePath ? doc.link : null,
          primaryFileLabel: window.isRTL ? "التذكرة" : "E-ticket",
          secondaryFileUrl: doc.secondaryLink,
          secondaryFileLabel: window.isRTL ? "بطاقة الصعود" : "Boarding pass"
        });
      }
    }
    if (doc.category === "lodging" && d.check_in_at) {
      const startAt = new Date(d.check_in_at);
      const endAt = d.check_out_at ? new Date(d.check_out_at) : null;
      if (!isNaN(startAt) && startAt >= grace && startAt <= cutoff) {
        events.push({
          id: `doc-${doc.id}`,
          type: "lodging",
          emoji: "🏨",
          title: doc.title || "Hotel",
          detail: window.isRTL ? "تسجيل الدخول" : "Check-in",
          subtle: d.address || null,
          startAt,
          endAt,
          docCategory: "lodging",
          doc,
          locationUrl: d.location_url || null,
          primaryFileUrl: doc.filePath ? doc.link : null,
          primaryFileLabel: window.isRTL ? "الحجز" : "Reservation"
        });
      }
      if (endAt && !isNaN(endAt) && endAt >= grace && endAt <= cutoff) {
        events.push({
          id: `doc-${doc.id}-out`,
          type: "lodging-out",
          emoji: "🏨",
          title: doc.title || "Hotel",
          detail: window.isRTL ? "تسجيل الخروج" : "Check-out",
          subtle: d.address || null,
          startAt: endAt,
          endAt: null,
          docCategory: "lodging",
          doc,
          locationUrl: d.location_url || null,
          primaryFileUrl: doc.filePath ? doc.link : null,
          primaryFileLabel: window.isRTL ? "الحجز" : "Reservation"
        });
      }
    }
    if (doc.category === "transport" && d.pickup_at) {
      const startAt = new Date(d.pickup_at);
      const endAt = d.dropoff_at ? new Date(d.dropoff_at) : null;
      if (!isNaN(startAt) && startAt >= grace && startAt <= cutoff) {
        events.push({
          id: `doc-${doc.id}`,
          type: "transport",
          emoji: "🚆",
          title: doc.title || d.vendor || "Rental",
          detail: window.isRTL ? "الاستلام" : "Pick-up",
          subtle: d.vendor || null,
          startAt,
          endAt,
          docCategory: "transport",
          doc,
          locationUrl: d.location_url || null,
          primaryFileUrl: doc.filePath ? doc.link : null,
          primaryFileLabel: window.isRTL ? "مرجع الإيجار" : "Rental ref"
        });
      }
    }
  });
  (window.ITINERARY || []).forEach((it) => {
    if (!it.dayDate) return;
    const dayPart = it.dayDate;
    const timePart = it.startTime || "12:00:00";
    const startAt = /* @__PURE__ */ new Date(`${dayPart}T${timePart.length === 5 ? timePart + ":00" : timePart}`);
    if (isNaN(startAt) || startAt < grace || startAt > cutoff) return;
    const PLAN_EMOJI = { food: "🍜", sight: "🎌", transport: "🚅", lodging: "🏨", misc: "📌" };
    events.push({
      id: `plan-${it.id}`,
      type: "plan",
      emoji: PLAN_EMOJI[it.category] || "📌",
      title: it.title,
      detail: null,
      subtle: it.location || null,
      startAt,
      endAt: null,
      doc: null,
      locationUrl: it.location ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(it.location)}` : null
    });
  });
  events.sort((a, b) => a.startAt - b.startAt);
  return events;
}
function relativeWhenLabel(startAt, now = /* @__PURE__ */ new Date()) {
  const diffMs = startAt - now;
  const diffMin = Math.round(diffMs / 6e4);
  if (diffMin <= 0 && diffMin > -240) return window.isRTL ? "الآن" : "Now";
  if (diffMin > 0 && diffMin < 60) return window.isRTL ? `بعد ${diffMin} د` : `in ${diffMin}m`;
  if (diffMin >= 60 && diffMin < 360) {
    const h = Math.floor(diffMin / 60);
    const m = diffMin % 60;
    return window.isRTL ? `بعد ${h} س ${m ? m + " د" : ""}` : `in ${h}h${m ? ` ${m}m` : ""}`;
  }
  const isSameDay = startAt.toDateString() === now.toDateString();
  const tomorrow = new Date(now.getTime() + 864e5);
  const isTomorrow = startAt.toDateString() === tomorrow.toDateString();
  const time = startAt.toLocaleTimeString(
    window.isRTL ? "ar" : "en",
    { hour: "numeric", minute: "2-digit" }
  );
  if (isSameDay) return window.isRTL ? `اليوم · ${time}` : `Today · ${time}`;
  if (isTomorrow) return window.isRTL ? `غداً · ${time}` : `Tomorrow · ${time}`;
  const dayLabel = startAt.toLocaleDateString(
    window.isRTL ? "ar" : "en",
    { weekday: "short", month: "short", day: "numeric" }
  );
  return `${dayLabel} · ${time}`;
}
window.validateDocRanges = (schema, details) => {
  const fields = schema && schema.fields || [];
  for (const f of fields) {
    if (!f.rangeStart) continue;
    const startVal = details ? details[f.rangeStart] : null;
    const endVal = details ? details[f.key] : null;
    if (startVal && endVal && new Date(endVal) < new Date(startVal)) {
      const sf = fields.find((x) => x.key === f.rangeStart);
      const startLabel = sf ? sf.label() : "";
      return window.isRTL ? `«${f.label()}» لا يمكن أن يكون قبل «${startLabel}»` : `“${f.label()}” can’t be before “${startLabel}”`;
    }
  }
  return null;
};
window.DOC_SCHEMAS = DOC_SCHEMAS;
window.fmtDocSummary = fmtDocSummary;
window.computeUpcomingEvents = computeUpcomingEvents;
window.relativeWhenLabel = relativeWhenLabel;
const paramLabelStyle = {
  fontSize: 12,
  fontWeight: 600,
  color: "var(--ink)",
  marginBottom: 2
};
function ScreenSettings({ go, openSheet }) {
  const trip = window.TRIP;
  const [members, setMembers] = React.useState(window.MEMBERS || []);
  const [coverUrl, setCoverUrl] = React.useState((trip == null ? void 0 : trip.coverUrl) || (trip == null ? void 0 : trip.coverImageUrl) || null);
  const [uploading, setUploading] = React.useState(false);
  const coverInputRef = React.useRef(null);
  const counts = members.reduce((acc, m) => {
    acc[m.role] = (acc[m.role] || 0) + 1;
    return acc;
  }, {});
  const handleCoverUpload = async (file) => {
    var _a, _b, _c;
    if (!file || !(trip == null ? void 0 : trip.id)) return;
    setUploading(true);
    try {
      const url = await window.uploadTripCover(trip.id, file);
      setCoverUrl(url);
      await ((_a = window.loadTripDetail) == null ? void 0 : _a.call(window, trip.id));
      (_b = window.notifyDataChange) == null ? void 0 : _b.call(window);
    } catch (err) {
      (_c = window.toast) == null ? void 0 : _c.call(window, err.message || "Action failed", "error");
    } finally {
      setUploading(false);
    }
  };
  if (!trip) {
    return /* @__PURE__ */ React.createElement("div", { style: { background: "var(--cream)", minHeight: "100%", paddingBottom: 100 } }, /* @__PURE__ */ React.createElement(Header, { title: t("settings"), onBack: () => go("hub") }), /* @__PURE__ */ React.createElement("div", { style: { padding: "48px 32px", textAlign: "center", color: "var(--ink-mute)" } }, /* @__PURE__ */ React.createElement("div", { className: "serif", style: { fontSize: 18 } }, window.isRTL ? "يرجى تحديد وفتح رحلة أولاً" : "Open a trip first")));
  }
  return /* @__PURE__ */ React.createElement("div", { "data-screen-label": "05 Trip Settings", style: { background: "var(--cream)", minHeight: "100%", paddingBottom: 100 } }, /* @__PURE__ */ React.createElement(Header, { title: t("settings"), onBack: () => go("hub") }), /* @__PURE__ */ React.createElement("div", { style: { padding: "0 14px" } }, /* @__PURE__ */ React.createElement(
    "input",
    {
      ref: coverInputRef,
      type: "file",
      accept: "image/*",
      style: { display: "none" },
      onChange: (e) => e.target.files[0] && handleCoverUpload(e.target.files[0])
    }
  ), /* @__PURE__ */ React.createElement("div", { style: {
    borderRadius: 26,
    overflow: "hidden",
    position: "relative",
    boxShadow: "var(--shadow-card)",
    height: 170
  } }, coverUrl ? /* @__PURE__ */ React.createElement("div", { style: {
    position: "absolute",
    inset: 0,
    backgroundImage: `url(${coverUrl})`,
    backgroundSize: "cover",
    backgroundPosition: "center"
  } }) : /* @__PURE__ */ React.createElement(KyotoHero, null), /* @__PURE__ */ React.createElement("div", { style: { position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 60%)" } }), /* @__PURE__ */ React.createElement("div", { style: { position: "absolute", inset: 0, padding: 20, display: "flex", flexDirection: "column", justifyContent: "flex-end", color: "#fff" } }, /* @__PURE__ */ React.createElement("div", { className: "serif", style: { fontSize: 30, lineHeight: 1.05 } }, trip.title || "Trip"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, opacity: 0.85, marginTop: 2 } }, trip.dates || "")), /* @__PURE__ */ React.createElement("button", { onClick: () => {
    var _a;
    return (_a = coverInputRef.current) == null ? void 0 : _a.click();
  }, className: "glass", style: {
    position: "absolute",
    top: 14,
    insetInlineEnd: 14,
    padding: "6px 12px",
    borderRadius: 999,
    fontSize: 11,
    fontWeight: 500,
    color: "#fff",
    background: uploading ? "rgba(0,0,0,0.5)" : "rgba(255,255,255,0.18)",
    display: "flex",
    alignItems: "center",
    gap: 5
  } }, uploading ? /* @__PURE__ */ React.createElement("span", { style: { width: 12, height: 12, borderRadius: "50%", border: "1.5px solid rgba(255,255,255,0.4)", borderTopColor: "#fff", display: "inline-block", animation: "expspin 0.7s linear infinite" } }) : /* @__PURE__ */ React.createElement(IconUpload, { size: 12, stroke: "#fff" }), uploading ? window.isRTL ? "جاري رفع الصورة الآن..." : "Uploading..." : t("editCover")))), /* @__PURE__ */ React.createElement("div", { style: { padding: "24px 14px 0" } }, /* @__PURE__ */ React.createElement(SectionLabel, { action: t("invite"), onAction: () => openSheet("share") }, t("crewSection"), " · ", members.length), /* @__PURE__ */ React.createElement("div", { style: { padding: "0 8px" } }, /* @__PURE__ */ React.createElement("div", { style: {
    background: "var(--cream-2)",
    borderRadius: 16,
    border: "0.5px solid var(--hairline)",
    padding: "14px 16px",
    display: "flex",
    alignItems: "center",
    gap: 14,
    flexDirection: "row"
  } }, /* @__PURE__ */ React.createElement(AvatarStack, { members, size: 36 }), /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: () => openSheet("share"),
      "aria-label": t("invite"),
      style: {
        width: 36,
        height: 36,
        borderRadius: "50%",
        background: "var(--ink)",
        color: "var(--cream)",
        marginInlineStart: -14,
        zIndex: 5,
        display: "grid",
        placeItems: "center",
        boxShadow: "0 0 0 2px var(--cream-2), 0 4px 8px rgba(34,28,22,0.18)",
        flexShrink: 0
      }
    },
    /* @__PURE__ */ React.createElement(IconPlus, { size: 18, stroke: "currentColor" })
  ), /* @__PURE__ */ React.createElement("div", { style: { flex: 1, minWidth: 0, fontSize: 13.5, color: "var(--ink)" } }, /* @__PURE__ */ React.createElement("div", { style: { fontWeight: 600 } }, members.length, " ", t("travelers")), /* @__PURE__ */ React.createElement("div", { style: {
    fontSize: 12,
    color: "var(--ink-mute)",
    marginTop: 2
  } }, [
    counts.Admin > 0 && (window.isRTL ? window.arPlural(counts.Admin, { one: "مشرف واحد", two: "مشرفان", few: `${counts.Admin} مشرفين`, many: `${counts.Admin} مشرفاً`, other: `${counts.Admin} مشرف` }) : `${counts.Admin} ${counts.Admin === 1 ? t("admin") : "admins"}`),
    counts.Editor > 0 && (window.isRTL ? window.arPlural(counts.Editor, { one: "محرر واحد", two: "محرران", few: `${counts.Editor} محررين`, many: `${counts.Editor} محرراً`, other: `${counts.Editor} محرر` }) : `${counts.Editor} ${counts.Editor === 1 ? t("editor") : "editors"}`),
    counts.Viewer > 0 && (window.isRTL ? window.arPlural(counts.Viewer, { one: "قارئ واحد", two: "قارئان", few: `${counts.Viewer} قراء ومستكشفون`, many: `${counts.Viewer} قارئاً`, other: `${counts.Viewer} قارئ` }) : `${counts.Viewer} ${counts.Viewer === 1 ? t("viewer") : "viewers"}`)
  ].filter(Boolean).join(" · "))))), /* @__PURE__ */ React.createElement("div", { style: { marginTop: 10, padding: "0 8px", display: "flex", flexDirection: "column", gap: 7 } }, members.map((m) => /* @__PURE__ */ React.createElement(
    SwipeRow,
    {
      key: m.id,
      actions: [
        { key: "remove", bg: "var(--clay)", icon: /* @__PURE__ */ React.createElement(IconTrash, { size: 18, stroke: "#fff" }) }
      ],
      onAction: async (key) => {
        var _a, _b;
        if (key !== "remove" || m.id === window.currentUserId) return;
        if (!confirm(window.isRTL ? `هل تريد إزالة ${m.name} واستبعاده من هذه الرحلة؟` : `Remove ${m.name} from the trip?`)) return;
        try {
          await window.removeMember(trip.id, m.id);
          setMembers(members.filter((x) => x.id !== m.id));
          (_a = window.toast) == null ? void 0 : _a.call(window, window.isRTL ? "تم استبعاد العضو بنجاح" : "Removed", "success");
        } catch (err) {
          (_b = window.toast) == null ? void 0 : _b.call(window, err.message || "Action failed", "error");
        }
      }
    },
    /* @__PURE__ */ React.createElement("div", { style: {
      background: "var(--cream-2)",
      borderRadius: 16,
      padding: "10px 12px",
      display: "flex",
      alignItems: "center",
      gap: 11,
      flexDirection: "row",
      border: "0.5px solid var(--hairline)"
    } }, /* @__PURE__ */ React.createElement(Avatar, { m, size: 36 }), /* @__PURE__ */ React.createElement("div", { style: { flex: 1, minWidth: 0 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13.5, fontWeight: 500, color: "var(--ink)" } }, m.name), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10.5, color: "var(--ink-mute)" } }, m.id === window.currentUserId ? window.isRTL ? "أنت · مالك السجل" : "you · owner" : window.isRTL ? "صديق في الرحلة" : "trip member")), /* @__PURE__ */ React.createElement(RoleSelect, { role: m.role, onChange: async (r) => {
      setMembers(members.map((x) => x.id === m.id ? { ...x, role: r } : x));
      try {
        await window.updateMemberRole(trip.id, m.id, r);
      } catch (err) {
        console.error(err);
      }
    } }))
  ))), /* @__PURE__ */ React.createElement("details", { style: { marginTop: 12, padding: "0 8px" } }, /* @__PURE__ */ React.createElement("summary", { style: {
    cursor: "pointer",
    listStyle: "none",
    padding: "12px 14px",
    borderRadius: 14,
    background: "var(--cream-2)",
    border: "0.5px solid var(--hairline)",
    display: "flex",
    alignItems: "center",
    gap: 8,
    flexDirection: "row",
    fontSize: 12.5,
    color: "var(--ink-soft)",
    fontWeight: 500
  } }, /* @__PURE__ */ React.createElement(IconChevron, { size: 13, stroke: "var(--ink-mute)" }), t("viewPermissions")), /* @__PURE__ */ React.createElement("div", { style: {
    background: "var(--cream-2)",
    borderRadius: 16,
    marginTop: 6,
    padding: "6px 14px",
    border: "0.5px solid var(--hairline)"
  } }, [
    { perm: window.isRTL ? "استعراض وتصفح تفاصيل الرحلة ومستنداتها" : "View trip & docs", a: true, e: true, v: true },
    { perm: window.isRTL ? "إضافة بنود مصروفات أو مستندات جديدة" : "Add expenses & docs", a: true, e: true, v: false },
    { perm: window.isRTL ? "إرسال روابط دعوة لأصدقاء جدد" : "Invite members", a: true, e: false, v: false },
    { perm: window.isRTL ? "تعديل المعطيات والإعدادات العامة للرحلة" : "Edit trip settings", a: true, e: false, v: false },
    { perm: window.isRTL ? "أرشفة الرحلة أو حذف سجلها بالكامل" : "Archive or delete", a: true, e: false, v: false }
  ].map((row, i) => /* @__PURE__ */ React.createElement("div", { key: row.perm, style: {
    display: "grid",
    gridTemplateColumns: "1fr 30px 30px 30px",
    padding: "9px 0",
    alignItems: "center",
    borderTop: i ? "0.5px solid var(--hairline)" : "none"
  } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, color: "var(--ink-soft)" } }, row.perm), ["a", "e", "v"].map((k) => /* @__PURE__ */ React.createElement("div", { key: k, style: { display: "grid", placeItems: "center" } }, row[k] ? /* @__PURE__ */ React.createElement("div", { style: {
    width: 16,
    height: 16,
    borderRadius: 5,
    background: "var(--ink)",
    display: "grid",
    placeItems: "center"
  } }, /* @__PURE__ */ React.createElement(IconCheck, { size: 10, stroke: "#fff" })) : /* @__PURE__ */ React.createElement("div", { style: {
    width: 16,
    height: 16,
    borderRadius: 5,
    border: "1.5px dashed var(--hairline-2)"
  } }))))), /* @__PURE__ */ React.createElement("div", { style: {
    display: "grid",
    gridTemplateColumns: "1fr 30px 30px 30px",
    padding: "8px 0 4px",
    borderTop: "0.5px solid var(--hairline)",
    fontSize: 10.5,
    color: "var(--ink-mute)",
    fontWeight: 500
  } }, /* @__PURE__ */ React.createElement("div", null), /* @__PURE__ */ React.createElement("div", { style: { textAlign: "center" } }, window.isRTL ? "مدير" : "Adm"), /* @__PURE__ */ React.createElement("div", { style: { textAlign: "center" } }, window.isRTL ? "محرر" : "Edit"), /* @__PURE__ */ React.createElement("div", { style: { textAlign: "center" } }, window.isRTL ? "مشاهد" : "View")))), /* @__PURE__ */ React.createElement(InvitesList, { tripId: trip.id })), /* @__PURE__ */ React.createElement("div", { style: { padding: "24px 14px 0" } }, /* @__PURE__ */ React.createElement(SectionLabel, null, t("tripParameters")), /* @__PURE__ */ React.createElement(EditableTripParams, { trip })), /* @__PURE__ */ React.createElement(LifecycleActions, null), /* @__PURE__ */ React.createElement("div", { style: { textAlign: "center", padding: "32px 0 20px", color: "var(--ink-mute)" } }, /* @__PURE__ */ React.createElement("div", { className: "serif-italic", style: { fontSize: 18 } }, "voyage"), /* @__PURE__ */ React.createElement("div", { className: "mono", style: { fontSize: 10.5, marginTop: 6 } }, window.isRTL ? "معرف الرحلة" : "Trip ID", " · ", (trip.id || "—").slice(-8))));
}
function InvitesList({ tripId }) {
  const [invites, setInvites] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [copied, setCopied] = React.useState(null);
  const refresh = React.useCallback(async () => {
    setLoading(true);
    try {
      setInvites(await window.loadTripInvites(tripId));
    } finally {
      setLoading(false);
    }
  }, [tripId]);
  React.useEffect(() => {
    refresh();
  }, [refresh]);
  const handleCopy = async (token) => {
    const link = window.inviteLink(token);
    try {
      await navigator.clipboard.writeText(link);
    } catch (_) {
    }
    setCopied(token);
    setTimeout(() => setCopied(null), 1500);
  };
  const handleRevoke = async (token) => {
    var _a, _b;
    if (!confirm(window.isRTL ? "هل تريد إلغاء صلاحية هذا الرابط نهائياً؟" : "Revoke this invite link?")) return;
    try {
      await window.revokeInvite(token);
      await refresh();
      (_a = window.toast) == null ? void 0 : _a.call(window, t("inviteRevoked") || "Invite revoked", "success");
    } catch (err) {
      (_b = window.toast) == null ? void 0 : _b.call(window, err.message || "Failed", "error");
    }
  };
  const active = invites.filter((i) => !i.revoked_at && (!i.expires_at || new Date(i.expires_at) > /* @__PURE__ */ new Date()));
  const inactive = invites.filter((i) => !active.includes(i));
  if (loading) return null;
  if (invites.length === 0) return null;
  return /* @__PURE__ */ React.createElement("div", { style: { marginTop: 18, padding: "0 8px" } }, /* @__PURE__ */ React.createElement("div", { style: {
    fontSize: 12,
    fontWeight: 600,
    color: "var(--ink-soft)",
    margin: "0 6px 8px"
  } }, t("activeInvites") || "Active invites"), /* @__PURE__ */ React.createElement("div", { style: {
    background: "var(--cream-2)",
    borderRadius: 16,
    border: "0.5px solid var(--hairline)",
    overflow: "hidden"
  } }, active.map((inv, i) => {
    const exp = inv.expires_at ? new Date(inv.expires_at) : null;
    const days = exp ? Math.max(0, Math.round((exp - /* @__PURE__ */ new Date()) / 864e5)) : null;
    return /* @__PURE__ */ React.createElement("div", { key: inv.token, style: {
      padding: "12px 14px",
      display: "flex",
      alignItems: "center",
      gap: 10,
      flexDirection: "row",
      borderTop: i ? "0.5px solid var(--hairline)" : "none"
    } }, /* @__PURE__ */ React.createElement(RoleBadge, { role: inv.role }), /* @__PURE__ */ React.createElement("div", { style: { flex: 1, minWidth: 0 } }, /* @__PURE__ */ React.createElement("div", { className: "mono", style: {
      fontSize: 11.5,
      color: "var(--ink-soft)",
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap"
    } }, inv.token), days !== null && /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10.5, color: "var(--ink-mute)", marginTop: 2 } }, window.isRTL ? `تنتهي صلاحية الرابط خلال ${window.arPlural(days, { one: "يوم واحد", two: "يومين", few: `${days} أيام`, many: `${days} يوماً`, other: `${days} يوماً` })}` : `expires in ${days}d`)), /* @__PURE__ */ React.createElement("button", { onClick: () => handleCopy(inv.token), style: {
      padding: "6px 10px",
      borderRadius: 999,
      fontSize: 11,
      fontWeight: 500,
      background: copied === inv.token ? "var(--moss)" : "var(--ink)",
      color: "var(--cream)"
    } }, copied === inv.token ? "✓" : t("copy")), /* @__PURE__ */ React.createElement("button", { onClick: () => handleRevoke(inv.token), style: {
      padding: "6px 8px",
      borderRadius: 999,
      background: "transparent",
      color: "var(--clay-deep)",
      border: "0.5px solid var(--hairline)"
    } }, /* @__PURE__ */ React.createElement(IconTrash, { size: 12, stroke: "currentColor" })));
  }), active.length === 0 && /* @__PURE__ */ React.createElement("div", { style: {
    padding: "14px",
    fontSize: 12,
    color: "var(--ink-mute)",
    textAlign: "center"
  } }, window.isRTL ? "لا توجد روابط دعوة نشطة حالياً" : "No active invites")), inactive.length > 0 && /* @__PURE__ */ React.createElement("div", { style: {
    marginTop: 8,
    padding: "0 6px",
    fontSize: 10.5,
    color: "var(--ink-mute)"
  } }, window.isRTL ? `${window.arPlural(inactive.length, { one: "رابط واحد", two: "رابطان", few: `${inactive.length} روابط`, many: `${inactive.length} رابطاً`, other: `${inactive.length} رابط` })} منتهية الصلاحية أو الملغاة` : `${inactive.length} expired or revoked`));
}
function ParamGroup({ items }) {
  return /* @__PURE__ */ React.createElement("div", { style: {
    background: "var(--cream-2)",
    borderRadius: 22,
    margin: "0 8px",
    overflow: "hidden",
    border: "0.5px solid var(--hairline)"
  } }, items.map((it, i) => /* @__PURE__ */ React.createElement("div", { key: i, style: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    flexDirection: "row",
    padding: "13px 16px",
    borderTop: i ? "0.5px solid var(--hairline)" : "none"
  } }, /* @__PURE__ */ React.createElement("div", { style: {
    width: 30,
    height: 30,
    borderRadius: 9,
    display: "grid",
    placeItems: "center",
    background: "var(--cream)",
    border: "0.5px solid var(--hairline)"
  } }, it.icon), /* @__PURE__ */ React.createElement("div", { style: { flex: 1, fontSize: 13.5, color: "var(--ink)", textAlign: "start" } }, it.label), it.toggle ? /* @__PURE__ */ React.createElement(Toggle, { on: it.on }) : /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 6, flexDirection: "row" } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 12.5, color: it.accent ? "var(--clay-deep)" : "var(--ink-mute)", fontWeight: it.accent ? 500 : 400 } }, it.value), /* @__PURE__ */ React.createElement(IconChevron, { size: 13, stroke: "var(--ink-mute)" })))));
}
function Toggle({ on: initOn }) {
  const [on, setOn] = React.useState(initOn);
  return /* @__PURE__ */ React.createElement("button", { onClick: () => setOn(!on), style: {
    width: 40,
    height: 24,
    borderRadius: 999,
    background: on ? "var(--ink)" : "var(--sand-deep)",
    padding: 2,
    transition: "background 200ms",
    position: "relative"
  } }, /* @__PURE__ */ React.createElement("div", { style: {
    width: 20,
    height: 20,
    borderRadius: "50%",
    background: "#fff",
    boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
    transform: on ? `translateX(${window.isRTL ? -16 : 16}px)` : "translateX(0)",
    transition: "transform 220ms cubic-bezier(.2,.8,.2,1)"
  } }));
}
function ActionRow({ icon, label, sub, labelColor, last, onClick }) {
  return /* @__PURE__ */ React.createElement("button", { onClick, style: {
    width: "100%",
    textAlign: "start",
    display: "flex",
    alignItems: "center",
    gap: 12,
    flexDirection: "row",
    padding: "14px 16px",
    borderTop: !last ? "0.5px solid var(--hairline)" : "none"
  } }, /* @__PURE__ */ React.createElement("div", { style: {
    width: 32,
    height: 32,
    borderRadius: 10,
    display: "grid",
    placeItems: "center",
    background: "var(--cream)",
    border: "0.5px solid var(--hairline)"
  } }, icon), /* @__PURE__ */ React.createElement("div", { style: { flex: 1 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13.5, color: labelColor || "var(--ink)", fontWeight: 500 } }, label), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: "var(--ink-mute)", marginTop: 1 } }, sub)), /* @__PURE__ */ React.createElement(IconChevron, { size: 14, stroke: "var(--ink-mute)" }));
}
function RoleSelect({ role, onChange }) {
  const [open, setOpen] = React.useState(false);
  return /* @__PURE__ */ React.createElement("div", { style: { position: "relative" } }, /* @__PURE__ */ React.createElement("button", { onClick: () => setOpen(!open) }, /* @__PURE__ */ React.createElement(RoleBadge, { role })), open && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { onClick: () => setOpen(false), style: { position: "fixed", inset: 0, zIndex: 30 } }), /* @__PURE__ */ React.createElement("div", { style: {
    position: "absolute",
    top: "calc(100% + 6px)",
    insetInlineEnd: 0,
    zIndex: 40,
    background: "var(--cream)",
    borderRadius: 14,
    padding: 6,
    boxShadow: "var(--shadow-lg)",
    border: "0.5px solid var(--hairline)",
    display: "flex",
    flexDirection: "column",
    gap: 2,
    minWidth: 130
  } }, ["Admin", "Editor", "Viewer"].map((r) => /* @__PURE__ */ React.createElement("button", { key: r, onClick: () => {
    onChange(r);
    setOpen(false);
  }, style: {
    padding: "6px 8px",
    borderRadius: 8,
    textAlign: "start",
    background: r === role ? "var(--sand)" : "transparent",
    display: "flex",
    alignItems: "center",
    gap: 8,
    fontSize: 12.5,
    flexDirection: "row"
  } }, /* @__PURE__ */ React.createElement(RoleBadge, { role: r }))))));
}
function LifecycleActions() {
  var _a;
  const [archived, setArchived] = React.useState(((_a = window.TRIP) == null ? void 0 : _a.status) === "past");
  const doDelete = async () => {
    var _a2, _b, _c, _d;
    const tripId = (_a2 = window.TRIP) == null ? void 0 : _a2.id;
    if (!tripId) return;
    try {
      await window.sb.from("trips").delete().eq("id", tripId);
      window.TRIP = null;
      if (window.currentUserId) {
        try {
          await window.loadTrips(window.currentUserId);
        } catch (_) {
        }
      }
      if (typeof window.navigateRoute === "function") {
        window.navigateRoute({ scope: "app", name: "trips" });
        (_b = window.notifyDataChange) == null ? void 0 : _b.call(window);
      } else {
        try {
          sessionStorage.setItem("voyage:route", JSON.stringify({ scope: "app", name: "trips" }));
        } catch (_) {
        }
        window.location.reload();
      }
      (_c = window.toast) == null ? void 0 : _c.call(window, window.isRTL ? "تم حذف الرحلة وسجلها بالكامل" : "Trip deleted", "success");
    } catch (err) {
      (_d = window.toast) == null ? void 0 : _d.call(window, err.message || "Could not delete", "error");
    }
  };
  const promptDelete = () => {
    window.actionSheet({
      title: t("deleteTrip"),
      message: t("areYouSure"),
      actions: [
        { label: t("delete"), destructive: true, onPress: doDelete }
      ]
    });
  };
  return /* @__PURE__ */ React.createElement("div", { style: { padding: "20px 14px 0" } }, /* @__PURE__ */ React.createElement(SectionLabel, null, t("tripLifecycle")), /* @__PURE__ */ React.createElement("div", { style: {
    background: "var(--cream-2)",
    borderRadius: 22,
    margin: "0 8px",
    overflow: "hidden",
    border: "0.5px solid var(--hairline)"
  } }, /* @__PURE__ */ React.createElement(
    ActionRow,
    {
      icon: /* @__PURE__ */ React.createElement(IconArchive, { size: 17, stroke: archived ? "var(--moss)" : "var(--ink)" }),
      label: archived ? t("archived") : t("archiveTrip"),
      labelColor: archived ? "var(--moss)" : void 0,
      sub: archived ? t("archivedSub") : t("archiveSub"),
      onClick: () => setArchived(!archived)
    }
  ), /* @__PURE__ */ React.createElement(
    ActionRow,
    {
      icon: /* @__PURE__ */ React.createElement(IconTrash, { size: 17, stroke: "var(--clay-deep)" }),
      label: t("deleteTrip"),
      labelColor: "var(--clay-deep)",
      sub: t("deleteSub"),
      last: true,
      onClick: promptDelete
    }
  )));
}
function EditableTripParams({ trip: tripProp }) {
  var _a, _b, _c;
  const [tick, setTick] = React.useState(0);
  const trip = window.TRIP || tripProp;
  const [editing, setEditing] = React.useState(null);
  const [saving, setSaving] = React.useState(false);
  const [err, setErr] = React.useState(null);
  const [title, setTitle] = React.useState(trip.title || "");
  const [subtitle, setSubtitle] = React.useState(trip.subtitle || "");
  const [start, setStart] = React.useState(trip.startDate || "");
  const [end, setEnd] = React.useState(trip.endDate || "");
  const [budgetCur, setBudgetCur] = React.useState(trip.homeCurrency || "USD");
  const [budgetAmt, setBudgetAmt] = React.useState(() => {
    var _a2;
    const usd = ((_a2 = trip.budget) == null ? void 0 : _a2.plannedUSD) || 0;
    const rate = window.fxRate(trip.homeCurrency || "USD");
    return usd > 0 ? Math.round(usd * rate) : "";
  });
  const [homeCur, setHomeCur] = React.useState(trip.homeCurrency || "USD");
  const [localCur, setLocalCur] = React.useState(trip.localCurrency || "USD");
  const [fx, setFx] = React.useState(trip.fx || window.FX_RATES[trip.homeCurrency || "USD"] || 1);
  const [cover, setCover] = React.useState(trip.cover || "kyoto");
  const [countries, setCountries] = React.useState((trip.countries || []).join(", "));
  React.useEffect(() => {
    var _a2;
    setTitle(trip.title || "");
    setSubtitle(trip.subtitle || "");
    setStart(trip.startDate || "");
    setEnd(trip.endDate || "");
    const home = trip.homeCurrency || "USD";
    const rate = window.fxRate(home);
    setBudgetCur(home);
    setBudgetAmt(((_a2 = trip.budget) == null ? void 0 : _a2.plannedUSD) > 0 ? Math.round(trip.budget.plannedUSD * rate) : "");
    setHomeCur(home);
    setLocalCur(trip.localCurrency || "USD");
    setFx(trip.fx || window.FX_RATES[home] || 1);
    setCover(trip.cover || "kyoto");
    setCountries((trip.countries || []).join(", "));
  }, [
    trip.id,
    trip.title,
    trip.subtitle,
    trip.startDate,
    trip.endDate,
    (_a = trip.budget) == null ? void 0 : _a.plannedUSD,
    trip.homeCurrency,
    trip.localCurrency,
    trip.fx,
    trip.cover,
    (_b = trip.countries) == null ? void 0 : _b.length
  ]);
  const CURRENCIES = ["USD", "SAR", "EUR", "GBP", "JPY", "AED", "EGP", "MAD", "TRY", "INR", "CHF"];
  const COVERS = ["kyoto", "lisbon", "oaxaca", "lofoten", "patagon"];
  const save = async (fields) => {
    var _a2, _b2, _c2;
    setSaving(true);
    setErr(null);
    try {
      const { error } = await window.sb.from("trips").update(fields).eq("id", trip.id);
      if (error) throw error;
      await window.loadTripDetail(trip.id);
      (_a2 = window.notifyDataChange) == null ? void 0 : _a2.call(window);
      setEditing(null);
      setTick((n) => n + 1);
      (_b2 = window.toast) == null ? void 0 : _b2.call(window, window.isRTL ? "تم حفظ التعديلات بنجاح" : "Saved", "success");
    } catch (e) {
      setErr(e.message);
      (_c2 = window.toast) == null ? void 0 : _c2.call(window, e.message || "Save failed", "error");
    } finally {
      setSaving(false);
    }
  };
  const rowStyle = {
    display: "flex",
    alignItems: "center",
    gap: 12,
    flexDirection: "row",
    padding: "13px 16px",
    width: "100%",
    textAlign: "start"
  };
  const iconBox = {
    width: 30,
    height: 30,
    borderRadius: 9,
    display: "grid",
    placeItems: "center",
    background: "var(--cream)",
    border: "0.5px solid var(--hairline)"
  };
  const inputStyle = {
    width: "100%",
    padding: "10px 12px",
    borderRadius: 10,
    border: "0.5px solid var(--hairline-2)",
    background: "var(--cream)",
    color: "var(--ink)",
    fontSize: 13,
    outline: "none",
    textAlign: "start"
  };
  return /* @__PURE__ */ React.createElement("div", { style: {
    background: "var(--cream-2)",
    borderRadius: 22,
    margin: "0 8px",
    border: "0.5px solid var(--hairline)",
    overflow: "hidden"
  } }, /* @__PURE__ */ React.createElement(
    EditRow,
    {
      editing,
      setEditing,
      icon: /* @__PURE__ */ React.createElement(IconCompass, { size: 16, stroke: "var(--ink)" }),
      label: t("destination"),
      value: trip.subtitle || trip.title || "—",
      fieldKey: "title"
    },
    /* @__PURE__ */ React.createElement("input", { value: title, onChange: (e) => setTitle(e.target.value), placeholder: window.isRTL ? "اكتب اسماً مميزاً للرحلة" : "Trip title", style: inputStyle }),
    /* @__PURE__ */ React.createElement("input", { value: subtitle, onChange: (e) => setSubtitle(e.target.value), placeholder: window.isRTL ? "اكتب وصفاً مختصراً للرحلة" : "Subtitle", style: inputStyle }),
    /* @__PURE__ */ React.createElement(SaveCancelBar, { saving, onSave: () => save({ title: title.trim(), subtitle: subtitle.trim() || null }), onCancel: () => setEditing(null) })
  ), /* @__PURE__ */ React.createElement(
    EditRow,
    {
      editing,
      setEditing,
      icon: /* @__PURE__ */ React.createElement(IconPin, { size: 16, stroke: "var(--ink)" }),
      label: window.isRTL ? "الدول المشمولة" : "Countries",
      value: (trip.countries || []).length > 0 ? trip.countries.join(" · ") : window.isRTL ? "لم تُحدد دول بعد" : "Not set",
      fieldKey: "countries"
    },
    /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: "var(--ink-mute)", fontFamily: "var(--mono)", letterSpacing: "0.08em" } }, window.isRTL ? "افصل بفاصلة — مثال: سويسرا, البرتغال, اسكتلندا" : "Comma-separated — e.g. Switzerland, Portugal, Scotland"),
    /* @__PURE__ */ React.createElement(
      "input",
      {
        value: countries,
        onChange: (e) => setCountries(e.target.value),
        placeholder: window.isRTL ? "الدول التي زرتها" : "Countries you visited",
        style: inputStyle
      }
    ),
    countries.trim() && /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexWrap: "wrap", gap: 6, marginTop: 4 } }, countries.split(",").map((c) => c.trim()).filter(Boolean).map((c, i) => /* @__PURE__ */ React.createElement("span", { key: i, style: {
      padding: "4px 9px",
      borderRadius: 999,
      fontSize: 11,
      fontWeight: 500,
      background: "var(--sand)",
      color: "var(--ink-soft)"
    } }, c))),
    /* @__PURE__ */ React.createElement(SaveCancelBar, { saving, onSave: () => {
      var _a2, _b2;
      const list = countries.split(",").map((s) => s.trim()).filter(Boolean);
      return save({ countries: list, country_code: ((_b2 = (_a2 = list[0]) == null ? void 0 : _a2.slice(0, 2)) == null ? void 0 : _b2.toUpperCase()) || null });
    }, onCancel: () => setEditing(null) })
  ), /* @__PURE__ */ React.createElement(
    EditRow,
    {
      editing,
      setEditing,
      icon: /* @__PURE__ */ React.createElement(IconClock, { size: 16, stroke: "var(--ink)" }),
      label: t("dates"),
      value: trip.dates || "—",
      fieldKey: "dates"
    },
    /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 } }, /* @__PURE__ */ React.createElement("input", { type: "date", value: start, onChange: (e) => setStart(e.target.value), style: inputStyle }), /* @__PURE__ */ React.createElement("input", { type: "date", value: end, onChange: (e) => setEnd(e.target.value), style: inputStyle })),
    /* @__PURE__ */ React.createElement(SaveCancelBar, { saving, onSave: () => save({ start_date: start, end_date: end }), onCancel: () => setEditing(null) })
  ), /* @__PURE__ */ React.createElement(
    EditRow,
    {
      editing,
      setEditing,
      icon: /* @__PURE__ */ React.createElement(IconWallet, { size: 16, stroke: "var(--ink)" }),
      label: t("budgetCap"),
      value: ((_c = trip.budget) == null ? void 0 : _c.plannedUSD) ? window.fmtMoney(trip.budget.plannedUSD, { in: "home" }) : "—",
      fieldKey: "budget"
    },
    /* @__PURE__ */ React.createElement("div", { style: paramLabelStyle }, window.isRTL ? "عملة الحساب" : "Currency"),
    /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexWrap: "wrap", gap: 6 } }, CURRENCIES.map((c) => /* @__PURE__ */ React.createElement("button", { key: c, onClick: () => {
      const n = parseFloat(budgetAmt) || 0;
      if (n > 0) {
        const usd = n / window.fxRate(budgetCur);
        const newAmt = Math.round(usd * window.fxRate(c) * 100) / 100;
        setBudgetAmt(newAmt);
      }
      setBudgetCur(c);
    }, style: {
      padding: "6px 10px",
      borderRadius: 8,
      fontSize: 11.5,
      fontWeight: 500,
      background: budgetCur === c ? "var(--ink)" : "var(--cream)",
      color: budgetCur === c ? "var(--cream)" : "var(--ink-soft)",
      border: "0.5px solid var(--hairline)"
    } }, c))),
    /* @__PURE__ */ React.createElement("div", { style: { ...paramLabelStyle, marginTop: 6 } }, window.isRTL ? `المبلغ الإجمالي (${budgetCur})` : `Amount (${budgetCur})`),
    /* @__PURE__ */ React.createElement(
      "input",
      {
        type: "number",
        inputMode: "decimal",
        value: budgetAmt,
        onChange: (e) => setBudgetAmt(e.target.value),
        placeholder: "0",
        style: inputStyle
      }
    ),
    parseFloat(budgetAmt) > 0 && /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: "var(--ink-mute)", display: "flex", flexWrap: "wrap", gap: 8 } }, budgetCur !== "USD" && /* @__PURE__ */ React.createElement("span", null, "= ", window.fmtMoney(window.toUSD(budgetAmt, budgetCur), { in: "USD" })), budgetCur !== homeCur && /* @__PURE__ */ React.createElement("span", null, "≈ ", window.fmtMoney(window.toUSD(budgetAmt, budgetCur), { in: "home" })), budgetCur !== localCur && localCur !== homeCur && /* @__PURE__ */ React.createElement("span", null, "≈ ", window.fmtMoney(window.toUSD(budgetAmt, budgetCur), { in: "local" }))),
    /* @__PURE__ */ React.createElement(SaveCancelBar, { saving, onSave: () => save({
      budget_planned_usd: budgetAmt ? window.toUSD(budgetAmt, budgetCur) : null
    }), onCancel: () => setEditing(null) })
  ), /* @__PURE__ */ React.createElement(
    EditRow,
    {
      editing,
      setEditing,
      icon: /* @__PURE__ */ React.createElement(IconSwap, { size: 16, stroke: "var(--ink)" }),
      label: window.isRTL ? "عملة الوجهة" : "Destination currency",
      value: `${trip.localCurrency || homeCur}${trip.localCurrency && trip.localCurrency !== homeCur ? "  ·  " + (1 / (window.FX_RATES[trip.localCurrency] || 1) * (window.FX_RATES[homeCur] || 1)).toFixed(2) + " " + homeCur : ""}`,
      fieldKey: "currency"
    },
    /* @__PURE__ */ React.createElement("div", { style: paramLabelStyle }, window.isRTL ? "العملة المحلية لوجهة السفر" : "Local currency at your destination"),
    /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexWrap: "wrap", gap: 6 } }, CURRENCIES.map((c) => /* @__PURE__ */ React.createElement("button", { key: c, onClick: () => setLocalCur(c), style: {
      padding: "6px 10px",
      borderRadius: 8,
      fontSize: 11.5,
      fontWeight: 500,
      background: localCur === c ? "var(--ink)" : "var(--cream)",
      color: localCur === c ? "var(--cream)" : "var(--ink-soft)",
      border: "0.5px solid var(--hairline)"
    } }, c))),
    /* @__PURE__ */ React.createElement("div", { style: {
      marginTop: 10,
      padding: "10px 12px",
      borderRadius: 10,
      background: "var(--cream)",
      border: "0.5px solid var(--hairline-2)",
      fontSize: 12,
      color: "var(--ink-soft)",
      fontFamily: "var(--mono)"
    } }, localCur === homeCur ? window.isRTL ? "نفس عملتك الرئيسية" : "Same as your home currency" : `1 ${localCur} ≈ ${(window.FX_RATES[homeCur] / (window.FX_RATES[localCur] || 1)).toFixed(3)} ${homeCur}`),
    /* @__PURE__ */ React.createElement("div", { style: {
      marginTop: 8,
      fontSize: 10.5,
      color: "var(--ink-mute)",
      fontFamily: "var(--mono)",
      letterSpacing: "0.04em"
    } }, "ⓘ ", window.isRTL ? `أسعار الصرف تُحدّث تلقائياً (آخر تحديث ${window.FX_RATES_UPDATED}). عملتك الرئيسية ${homeCur} تُغيّر من إعدادات الحساب.` : `Rates update automatically (last ${window.FX_RATES_UPDATED}). Your home currency ${homeCur} is set in Account settings.`),
    /* @__PURE__ */ React.createElement(SaveCancelBar, { saving, onSave: () => save({ local_currency: localCur, fx_rate: window.FX_RATES[homeCur] || 1 }), onCancel: () => setEditing(null) })
  ), /* @__PURE__ */ React.createElement(
    EditRow,
    {
      editing,
      setEditing,
      icon: /* @__PURE__ */ React.createElement(IconSun, { size: 16, stroke: "var(--ink)" }),
      label: t("coverStyle"),
      value: trip.cover || "kyoto",
      fieldKey: "cover",
      last: true
    },
    /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexWrap: "wrap", gap: 6 } }, COVERS.map((c) => /* @__PURE__ */ React.createElement("button", { key: c, onClick: () => setCover(c), style: {
      padding: "6px 12px",
      borderRadius: 8,
      fontSize: 12,
      fontWeight: 500,
      background: cover === c ? "var(--ink)" : "var(--cream)",
      color: cover === c ? "var(--cream)" : "var(--ink-soft)",
      border: "0.5px solid var(--hairline)"
    } }, c))),
    /* @__PURE__ */ React.createElement(SaveCancelBar, { saving, onSave: () => save({ cover_style: cover }), onCancel: () => setEditing(null) })
  ), err && /* @__PURE__ */ React.createElement("div", { style: { padding: "10px 14px", background: "oklch(0.62 0.13 35 / 0.10)", fontSize: 12, color: "var(--clay-deep)" } }, err));
}
function SaveCancelBar({ saving, onSave, onCancel }) {
  return /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 8, marginTop: 4, flexDirection: "row" } }, /* @__PURE__ */ React.createElement("button", { disabled: saving, onClick: onSave, style: {
    flex: 1,
    padding: "10px",
    borderRadius: 10,
    fontSize: 12.5,
    fontWeight: 600,
    background: saving ? "var(--ink-mute)" : "var(--ink)",
    color: "var(--cream)"
  } }, saving ? "…" : window.isRTL ? "حفظ التغييرات" : "Save"), /* @__PURE__ */ React.createElement("button", { disabled: saving, onClick: onCancel, style: {
    padding: "10px 16px",
    borderRadius: 10,
    fontSize: 12.5,
    background: "var(--cream)",
    border: "0.5px solid var(--hairline-2)",
    color: "var(--ink-soft)"
  } }, window.isRTL ? "إلغاء" : "Cancel"));
}
function EditRow({ editing, setEditing, icon, label, value, fieldKey, children, last }) {
  const isOpen = editing === fieldKey;
  const rowStyle = {
    display: "flex",
    alignItems: "center",
    gap: 12,
    flexDirection: "row",
    padding: "13px 16px",
    width: "100%",
    textAlign: "start"
  };
  const iconBox = {
    width: 30,
    height: 30,
    borderRadius: 9,
    display: "grid",
    placeItems: "center",
    background: "var(--cream)",
    border: "0.5px solid var(--hairline)"
  };
  return /* @__PURE__ */ React.createElement("div", { style: { borderTop: fieldKey !== "title" ? "0.5px solid var(--hairline)" : "none" } }, /* @__PURE__ */ React.createElement("button", { onClick: () => setEditing(isOpen ? null : fieldKey), style: rowStyle }, /* @__PURE__ */ React.createElement("div", { style: iconBox }, icon), /* @__PURE__ */ React.createElement("div", { style: { flex: 1, fontSize: 13.5, color: "var(--ink)" } }, label), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 6, flexDirection: "row" } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 12.5, color: "var(--ink-mute)" } }, value), /* @__PURE__ */ React.createElement("span", { style: { transform: isOpen ? "rotate(90deg)" : "none", transition: "transform 200ms", display: "inline-block" } }, /* @__PURE__ */ React.createElement(IconChevron, { size: 13, stroke: "var(--ink-mute)" })))), isOpen && /* @__PURE__ */ React.createElement("div", { style: { padding: "0 16px 14px", display: "flex", flexDirection: "column", gap: 8 } }, children));
}
Object.assign(window, { ScreenSettings, ParamGroup, ActionRow, Toggle, RoleSelect, EditableTripParams, EditRow, InvitesList });
function useIsMobile() {
  const compute = () => window.matchMedia("(pointer: coarse)").matches || window.matchMedia("(max-width: 500px)").matches;
  const [isMobile, setIsMobile] = React.useState(compute);
  React.useEffect(() => {
    const mqW = window.matchMedia("(max-width: 500px)");
    const mqP = window.matchMedia("(pointer: coarse)");
    const handler = () => setIsMobile(compute());
    mqW.addEventListener("change", handler);
    mqP.addEventListener("change", handler);
    return () => {
      mqW.removeEventListener("change", handler);
      mqP.removeEventListener("change", handler);
    };
  }, []);
  return isMobile;
}
const TWEAK_DEFAULTS = (
  /*EDITMODE-BEGIN*/
  {
    "palette": "sunset",
    "density": "comfortable",
    "showStatBadge": true,
    "startScreen": "trips",
    "dark": false,
    "lang": "en"
  }
);
const PALETTES = {
  sunset: { cream: "oklch(0.965 0.012 80)", cream2: "oklch(0.945 0.016 78)", clay: "oklch(0.62 0.13 35)" },
  forest: { cream: "oklch(0.96 0.012 130)", cream2: "oklch(0.94 0.016 130)", clay: "oklch(0.50 0.10 155)" },
  ocean: { cream: "oklch(0.96 0.012 230)", cream2: "oklch(0.94 0.014 220)", clay: "oklch(0.50 0.10 230)" },
  ink: { cream: "oklch(0.96 0.008 280)", cream2: "oklch(0.93 0.012 280)", clay: "oklch(0.42 0.10 285)" }
};
function App() {
  const isMobile = useIsMobile();
  const [tw, setTweak] = window.useTweaks(TWEAK_DEFAULTS);
  React.useEffect(() => {
    var _a;
    (_a = window.__hideSplash) == null ? void 0 : _a.call(window);
  }, []);
  window.LANG = tw.lang;
  window.isRTL = tw.lang === "ar";
  const [session, setSession] = React.useState(void 0);
  const [dataVersion, setDataVersion] = React.useState(0);
  React.useEffect(() => {
    let scheduled = false;
    window.notifyDataChange = () => {
      if (scheduled) return;
      scheduled = true;
      requestAnimationFrame(() => {
        scheduled = false;
        setDataVersion((v) => v + 1);
      });
    };
    return () => {
      window.notifyDataChange = null;
    };
  }, []);
  React.useEffect(() => {
    window.navigateRoute = (r) => setRoute(r);
    return () => {
      window.navigateRoute = null;
    };
  }, []);
  const [tripLoading, setTripLoading] = React.useState(false);
  const rtUnsubRef = React.useRef(null);
  const activeTripRef = React.useRef(null);
  const initialLoadDoneRef = React.useRef(false);
  const hydratedForRef = React.useRef(null);
  const loadTripData = React.useCallback(async (tripId) => {
    var _a, _b, _c;
    if (!tripId) return;
    activeTripRef.current = tripId;
    const seeded = (_a = window.seedTripFromList) == null ? void 0 : _a.call(window, tripId);
    setTripLoading(!seeded);
    if (seeded) setDataVersion((v) => v + 1);
    (_b = window.cacheHydrateTrip) == null ? void 0 : _b.call(window, tripId).then((filled) => {
      if (filled) {
        setTripLoading(false);
        setDataVersion((v) => v + 1);
      }
    });
    const results = await Promise.allSettled([
      window.loadTripDetail(tripId),
      window.loadExpenses(tripId),
      window.loadMembers(tripId),
      window.loadDocuments(tripId),
      window.loadAuditLog(tripId),
      window.loadSettlements(tripId),
      window.loadItinerary(tripId)
    ]);
    results.forEach((r, i) => {
      if (r.status === "rejected") {
        const names = ["loadTripDetail", "loadExpenses", "loadMembers", "loadDocuments", "loadAuditLog"];
        console.error(`${names[i]} failed for ${tripId}:`, r.reason);
      }
    });
    setTripLoading(false);
    setDataVersion((v) => v + 1);
    (_c = window.cachePersistTrip) == null ? void 0 : _c.call(window, tripId);
    if (rtUnsubRef.current) {
      rtUnsubRef.current();
      rtUnsubRef.current = null;
    }
    rtUnsubRef.current = window.subscribeToTrip(tripId, () => {
      setDataVersion((v) => v + 1);
    });
  }, []);
  React.useEffect(() => {
    window.loadTripData = (tripId) => loadTripData(tripId);
    return () => {
      window.loadTripData = null;
    };
  }, [loadTripData]);
  React.useEffect(() => {
    if (!window.sb) {
      console.warn("Supabase SDK not loaded — falling back to auth screen");
      setSession(null);
      return;
    }
    (async () => {
      var _a;
      const hash = window.location.hash || "";
      if (hash.includes("token_hash=") && hash.includes("type=recovery")) {
        const params = new URLSearchParams(hash.replace(/^#/, "").replace(/^reset&/, ""));
        const token_hash = params.get("token_hash");
        if (token_hash) {
          window._authRecoveryActive = true;
          try {
            const { error } = await window.sb.auth.verifyOtp({ type: "recovery", token_hash });
            if (error) throw error;
            window.location.hash = "";
          } catch (err) {
            console.error("Recovery verifyOtp failed", err);
            (_a = window.toast) == null ? void 0 : _a.call(window, err.message || "Recovery link invalid or expired", "error");
            window._authRecoveryActive = false;
          }
        }
      }
    })();
    const hydrateForUser = async (userId) => {
      var _a, _b, _c, _d, _e;
      if (hydratedForRef.current === userId) return;
      hydratedForRef.current = userId;
      window.currentUserId = userId;
      if (!initialLoadDoneRef.current) {
        window.clearAllMockData();
        initialLoadDoneRef.current = true;
      }
      try {
        const prefs = await ((_a = window.cacheGet) == null ? void 0 : _a.call(window, "prefs"));
        if (prefs && prefs.currency && !window.USER_DEFAULT_CURRENCY) {
          window.USER_DEFAULT_CURRENCY = prefs.currency;
        }
        const filled = await ((_b = window.cacheHydrateTrips) == null ? void 0 : _b.call(window));
        if (filled) setDataVersion((v) => v + 1);
      } catch (_) {
      }
      try {
        await ((_c = window.loadUserPreferences) == null ? void 0 : _c.call(window, userId));
        await window.loadTrips(userId);
        await ((_d = window.loadUserPreferences) == null ? void 0 : _d.call(window, userId));
        if (activeTripRef.current) {
          await loadTripData(activeTripRef.current);
        }
        setDataVersion((v) => v + 1);
        (_e = window.replayOutbox) == null ? void 0 : _e.call(window);
      } catch (err) {
        console.error("hydrate failed", err);
      }
    };
    window.sb.auth.getSession().then(({ data: { session: s }, error }) => {
      if (error) console.error("getSession error", error);
      if (s) hydrateForUser(s.user.id);
      setSession(s || null);
    }).catch((err) => {
      console.error("getSession threw", err);
      setSession(null);
    });
    const { data: { subscription } } = window.sb.auth.onAuthStateChange((event, s) => {
      var _a;
      if (event === "SIGNED_IN") {
        if (s && s.user.id !== window.currentUserId) {
          initialLoadDoneRef.current = false;
          activeTripRef.current = null;
          hydratedForRef.current = null;
        }
        if (s) hydrateForUser(s.user.id);
        setSession(s);
      } else if (event === "SIGNED_OUT") {
        window.currentUserId = null;
        activeTripRef.current = null;
        initialLoadDoneRef.current = false;
        hydratedForRef.current = null;
        if (rtUnsubRef.current) {
          rtUnsubRef.current();
          rtUnsubRef.current = null;
        }
        window.clearAllMockData();
        (_a = window.cacheClearAll) == null ? void 0 : _a.call(window);
        setSession(null);
        setDataVersion((v) => v + 1);
      } else if (event === "PASSWORD_RECOVERY") {
        window._authRecoveryActive = true;
        setSession((prev) => s || prev);
        setRoute({ scope: "auth", name: "reset" });
      } else {
        setSession((prev) => s || prev);
      }
    });
    const timer = setTimeout(() => setSession((prev) => prev === void 0 ? null : prev), 5e3);
    return () => {
      subscription.unsubscribe();
      clearTimeout(timer);
      if (rtUnsubRef.current) {
        rtUnsubRef.current();
        rtUnsubRef.current = null;
      }
    };
  }, [loadTripData]);
  const [route, setRoute] = React.useState(() => {
    try {
      const saved = sessionStorage.getItem("voyage:route");
      if (saved) return JSON.parse(saved);
    } catch (_) {
    }
    return { scope: "auth", name: "signin" };
  });
  React.useEffect(() => {
    try {
      sessionStorage.setItem("voyage:route", JSON.stringify(route));
    } catch (_) {
    }
  }, [route]);
  const scrollerRef = React.useRef(null);
  React.useEffect(() => {
    if (scrollerRef.current) scrollerRef.current.scrollTop = 0;
  }, [route.scope, route.name, route.tripId]);
  React.useEffect(() => {
    if (session && !window._authRecoveryActive) {
      const onboarded = (() => {
        try {
          return localStorage.getItem("voyage:onboarded") === "1";
        } catch (_) {
          return false;
        }
      })();
      setRoute((r) => {
        if (r.scope !== "auth") return r;
        return onboarded ? { scope: "app", name: "trips" } : { scope: "app", name: "onboarding" };
      });
    } else if (session === null) {
      setRoute({ scope: "auth", name: "signin" });
    }
  }, [session]);
  const [joining, setJoining] = React.useState(false);
  React.useEffect(() => {
    try {
      const u = new URL(window.location.href);
      const token = u.searchParams.get("join");
      if (token) {
        sessionStorage.setItem("voyage:pendingInvite", token);
        u.searchParams.delete("join");
        window.history.replaceState({}, "", u.toString());
      }
    } catch (_) {
    }
  }, []);
  React.useEffect(() => {
    if (!session) return;
    const token = sessionStorage.getItem("voyage:pendingInvite");
    if (!token) return;
    sessionStorage.removeItem("voyage:pendingInvite");
    setJoining(true);
    (async () => {
      var _a, _b;
      try {
        const res = await window.redeemInvite(token);
        if (res == null ? void 0 : res.tripId) {
          try {
            localStorage.setItem("voyage:onboarded", "1");
          } catch (_) {
          }
          await window.loadTrips(window.currentUserId);
          setRoute({ scope: "trip", name: "hub", tripId: res.tripId });
          loadTripData(res.tripId);
          (_a = window.toast) == null ? void 0 : _a.call(window, t("joinSuccess") || "Joined trip", "success");
        }
      } catch (err) {
        (_b = window.toast) == null ? void 0 : _b.call(window, err.message || "Could not join trip", "error");
      } finally {
        setJoining(false);
      }
    })();
  }, [session, loadTripData]);
  const [sheet, setSheet] = React.useState(null);
  const [docView, setDocView] = React.useState(null);
  const [editingExpense, setEditingExpense] = React.useState(null);
  const [prefillExpense, setPrefillExpense] = React.useState(null);
  const [showAddDoc, setShowAddDoc] = React.useState(false);
  const [showSettleUp, setShowSettleUp] = React.useState(false);
  const [showSearch, setShowSearch] = React.useState(false);
  const [imageOverlay, setImageOverlay] = React.useState(null);
  React.useEffect(() => {
    window.openImageOverlay = (src) => setImageOverlay(src);
  }, []);
  React.useEffect(() => {
    const p = PALETTES[tw.palette] || PALETTES.sunset;
    const r = document.documentElement.style;
    if (tw.dark) {
      r.removeProperty("--cream");
      r.removeProperty("--cream-2");
      r.removeProperty("--clay");
    } else {
      r.setProperty("--cream", p.cream);
      r.setProperty("--cream-2", p.cream2);
      r.setProperty("--clay", p.clay);
    }
  }, [tw.palette, tw.dark]);
  React.useEffect(() => {
    document.documentElement.setAttribute("data-theme", tw.dark ? "dark" : "light");
  }, [tw.dark]);
  React.useEffect(() => {
    document.documentElement.setAttribute("dir", tw.lang === "ar" ? "rtl" : "ltr");
    document.documentElement.setAttribute("lang", tw.lang);
  }, [tw.lang]);
  const go = (name) => {
    if (name === "signin" || name === "signup") setRoute({ scope: "auth", name });
    else if (name === "trips" || name === "insights" || name === "appSettings") setRoute({ scope: "app", name });
    else {
      const tid = route.tripId || activeTripRef.current;
      if (!tid) {
        setRoute({ scope: "app", name: "trips" });
        return;
      }
      setRoute({ scope: "trip", name, tripId: tid });
    }
  };
  const goTrip = (tripId) => {
    setRoute({ scope: "trip", name: "hub", tripId });
    loadTripData(tripId);
  };
  React.useEffect(() => {
    if (route.scope !== "trip" || !route.tripId) return;
    if (!window.TRIP || window.TRIP.id !== route.tripId) {
      loadTripData(route.tripId);
    }
  }, [route.scope, route.tripId, loadTripData]);
  React.useEffect(() => {
    if (route.scope === "app") {
      activeTripRef.current = null;
    }
  }, [route.scope]);
  const openSheet = (s, payload) => {
    if (s === "editExpense" && payload) setEditingExpense(payload);
    if (s === "addExpense" && payload) setPrefillExpense(payload);
    if (s === "addDoc") {
      setShowAddDoc(true);
      return;
    }
    if (s === "settleUp") {
      setShowSettleUp(true);
      return;
    }
    if (s === "search") {
      setShowSearch(true);
      return;
    }
    setSheet(s);
  };
  const openDoc = (doc, category) => setDocView({ doc, category, prevRoute: route });
  let screenNode;
  if (route.scope === "auth") {
    const authMode = ["signup", "forgot", "reset"].includes(route.name) ? route.name : "signin";
    screenNode = /* @__PURE__ */ React.createElement(window.ScreenAuth, { mode: authMode, go });
  } else if (route.scope === "app") {
    if (route.name === "onboarding") {
      screenNode = /* @__PURE__ */ React.createElement(
        window.ScreenOnboarding,
        {
          onComplete: (alsoCreateTrip) => {
            setRoute({ scope: "app", name: "trips" });
            if (alsoCreateTrip) setSheet("addTrip");
          }
        }
      );
    } else if (route.name === "insights") screenNode = /* @__PURE__ */ React.createElement(window.ScreenInsights, { go, goTrip });
    else if (route.name === "appSettings") screenNode = /* @__PURE__ */ React.createElement(window.ScreenAppSettings, { go, onSignOut: async () => {
      await window.sbSignOut();
    }, dark: tw.dark, lang: tw.lang, onDarkToggle: (v) => setTweak("dark", v), onLangChange: (v) => setTweak("lang", v) });
    else screenNode = /* @__PURE__ */ React.createElement(window.ScreenTrips, { go, goTrip });
  } else {
    const Screen = {
      hub: window.ScreenHub,
      plan: window.ScreenPlan,
      budget: window.ScreenBudget,
      docs: window.ScreenDocs,
      analytics: window.ScreenAnalytics,
      settings: window.ScreenSettings
    }[route.name] || window.ScreenHub;
    screenNode = /* @__PURE__ */ React.createElement(Screen, { go, goTrip, openSheet, openDoc, loading: tripLoading });
  }
  if (session === void 0) {
    const loadingInner = /* @__PURE__ */ React.createElement("div", { style: {
      height: "100%",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: 16,
      background: "var(--cream)"
    } }, /* @__PURE__ */ React.createElement("div", { className: "serif-italic", style: { fontSize: 28, color: "var(--ink)" } }, "voyage"), /* @__PURE__ */ React.createElement("div", { style: {
      width: 24,
      height: 24,
      borderRadius: "50%",
      border: "2.5px solid var(--hairline-2)",
      borderTopColor: "var(--clay)",
      animation: "appspin 0.8s linear infinite"
    } }), /* @__PURE__ */ React.createElement("style", null, `@keyframes appspin { to { transform: rotate(360deg) } }`));
    return isMobile ? /* @__PURE__ */ React.createElement("div", { style: { position: "fixed", top: 0, left: 0, right: 0, height: "var(--app-height, 100dvh)" } }, loadingInner) : /* @__PURE__ */ React.createElement("div", { className: "device-stage" }, /* @__PURE__ */ React.createElement(IOSDevice, { width: 402, height: 874 }, loadingInner));
  }
  const appShell = /* @__PURE__ */ React.createElement("div", { style: { position: "relative", height: "100%", overflow: "hidden" } }, /* @__PURE__ */ React.createElement(
    "div",
    {
      style: {
        position: "absolute",
        inset: 0,
        overflowY: "auto",
        overflowX: "hidden",
        WebkitOverflowScrolling: "touch",
        // iOS momentum scroll
        overscrollBehavior: "contain"
        // don't bounce parent
      },
      ref: scrollerRef,
      className: "no-scrollbar screen-enter",
      key: route.scope + ":" + route.name + ":" + (route.tripId || "")
    },
    screenNode
  ), docView && /* @__PURE__ */ React.createElement("div", { style: {
    position: "absolute",
    inset: 0,
    zIndex: 80,
    overflow: "auto",
    animation: "slideUpFull 280ms cubic-bezier(.2,.8,.2,1)"
  }, className: "no-scrollbar" }, /* @__PURE__ */ React.createElement(
    window.ScreenDocDetail,
    {
      doc: docView.doc,
      category: docView.category,
      back: () => setDocView(null),
      go,
      openSheet
    }
  ), /* @__PURE__ */ React.createElement("style", null, `@keyframes slideUpFull { from { transform: translateY(100%) } to { transform: translateY(0) } }`)), route.scope === "app" && route.name !== "onboarding" && /* @__PURE__ */ React.createElement(AppNav, { active: route.name, onChange: go, onAdd: () => openSheet("addTrip") }), route.scope === "trip" && /* @__PURE__ */ React.createElement(TripNav, { active: route.name, onChange: go }), /* @__PURE__ */ React.createElement(Sheet, { open: sheet === "addTrip", onClose: () => setSheet(null), title: window.isRTL ? "التخطيط لرحلة جديدة" : "New trip", height: 0.88 }, /* @__PURE__ */ React.createElement(AddTripSheet, { onDone: () => setSheet(null), onCreated: (tripId) => {
    setSheet(null);
    window.loadTrips(window.currentUserId).then(() => setDataVersion((v) => v + 1));
    goTrip(tripId);
  } })), /* @__PURE__ */ React.createElement(Sheet, { open: sheet === "share", onClose: () => setSheet(null), title: t("inviteTheCrew"), height: 0.62 }, /* @__PURE__ */ React.createElement(ShareSheet, null)), /* @__PURE__ */ React.createElement(Sheet, { open: sheet === "addExpense", onClose: () => {
    setSheet(null);
    setPrefillExpense(null);
  }, title: t("addExpenseTitle"), height: 0.78 }, /* @__PURE__ */ React.createElement(AddExpenseSheet, { prefill: prefillExpense, onDone: () => {
    setSheet(null);
    setPrefillExpense(null);
  } })), /* @__PURE__ */ React.createElement(
    Sheet,
    {
      open: sheet === "editExpense",
      onClose: () => {
        setSheet(null);
        setEditingExpense(null);
      },
      title: window.isRTL ? "تعديل بيانات المصروف" : "Edit expense",
      height: 0.82
    },
    /* @__PURE__ */ React.createElement(AddExpenseSheet, { existing: editingExpense, onDone: () => {
      setSheet(null);
      setEditingExpense(null);
    } })
  ), showAddDoc && /* @__PURE__ */ React.createElement("div", { style: {
    position: "absolute",
    inset: 0,
    zIndex: 85,
    overflow: "auto",
    animation: "slideUpFull 280ms cubic-bezier(.2,.8,.2,1)"
  }, className: "no-scrollbar" }, /* @__PURE__ */ React.createElement(
    window.ScreenAddDoc,
    {
      back: () => setShowAddDoc(false),
      onCreated: () => setShowAddDoc(false)
    }
  )), showSettleUp && /* @__PURE__ */ React.createElement("div", { style: {
    position: "absolute",
    inset: 0,
    zIndex: 85,
    overflow: "auto",
    animation: "slideUpFull 280ms cubic-bezier(.2,.8,.2,1)"
  }, className: "no-scrollbar" }, /* @__PURE__ */ React.createElement(window.ScreenSettleUp, { back: () => setShowSettleUp(false) })), showSearch && /* @__PURE__ */ React.createElement("div", { style: {
    position: "absolute",
    inset: 0,
    zIndex: 86,
    overflowY: "auto",
    overflowX: "hidden",
    animation: "slideUpFull 240ms cubic-bezier(.2,.8,.2,1)"
  }, className: "no-scrollbar" }, /* @__PURE__ */ React.createElement(
    window.ScreenTripSearch,
    {
      back: () => setShowSearch(false),
      openSheet,
      openDoc,
      go
    }
  )), joining && /* @__PURE__ */ React.createElement("div", { style: {
    position: "absolute",
    inset: 0,
    zIndex: 250,
    background: "var(--cream)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 14
  } }, /* @__PURE__ */ React.createElement("div", { style: {
    width: 36,
    height: 36,
    borderRadius: "50%",
    border: "3px solid var(--hairline)",
    borderTopColor: "var(--clay)",
    animation: "expspin 0.7s linear infinite"
  } }), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13.5, color: "var(--ink-soft)" } }, t("joinJoining") || "Joining trip…")), imageOverlay && /* @__PURE__ */ React.createElement(
    "div",
    {
      onClick: () => setImageOverlay(null),
      style: {
        position: "absolute",
        inset: 0,
        zIndex: 200,
        background: "rgba(0,0,0,0.92)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        animation: "fadeIn 180ms ease"
      }
    },
    /* @__PURE__ */ React.createElement(
      "img",
      {
        src: imageOverlay,
        alt: "receipt",
        style: { maxWidth: "94%", maxHeight: "92%", objectFit: "contain", borderRadius: 8 }
      }
    ),
    /* @__PURE__ */ React.createElement("button", { onClick: (e) => {
      e.stopPropagation();
      setImageOverlay(null);
    }, style: {
      position: "absolute",
      top: 14,
      insetInlineEnd: 14,
      width: 36,
      height: 36,
      borderRadius: 999,
      background: "rgba(255,255,255,0.18)",
      color: "#fff",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      border: "none"
    } }, /* @__PURE__ */ React.createElement(window.IconClose, { size: 16, stroke: "currentColor" }))
  ));
  if (isMobile) {
    return /* @__PURE__ */ React.createElement("div", { style: {
      // Height from the JS-measured --app-height (not inset:0 bottom)
      // so the shell covers the full screen on iOS PWA cold launch —
      // no cream sliver until an orientation change.
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      height: "var(--app-height, 100dvh)",
      overflow: "hidden",
      background: "var(--cream)",
      fontFamily: "var(--sans)",
      WebkitFontSmoothing: "antialiased"
      // Inherit theme + dir so all children flip together
    }, "data-theme": tw.dark ? "dark" : "light", dir: tw.lang === "ar" ? "rtl" : "ltr", lang: tw.lang }, appShell, /* @__PURE__ */ React.createElement(ToastHost, null), /* @__PURE__ */ React.createElement(OfflineBanner, null), /* @__PURE__ */ React.createElement(ActionSheetHost, null));
  }
  return /* @__PURE__ */ React.createElement("div", { className: "device-stage" }, /* @__PURE__ */ React.createElement(IOSDevice, { width: 402, height: 874 }, appShell), /* @__PURE__ */ React.createElement(ToastHost, null), /* @__PURE__ */ React.createElement(OfflineBanner, null), /* @__PURE__ */ React.createElement(ActionSheetHost, null), /* @__PURE__ */ React.createElement(TweaksPanel, null, /* @__PURE__ */ React.createElement(TweakSection, { label: "Theme" }, /* @__PURE__ */ React.createElement(
    TweakSelect,
    {
      label: "Palette",
      value: tw.palette,
      options: ["sunset", "forest", "ocean", "ink"],
      onChange: (v) => setTweak("palette", v)
    }
  ), /* @__PURE__ */ React.createElement(
    TweakToggle,
    {
      label: "Dark mode",
      value: tw.dark,
      onChange: (v) => setTweak("dark", v)
    }
  )), /* @__PURE__ */ React.createElement(TweakSection, { label: "Language" }, /* @__PURE__ */ React.createElement(
    TweakRadio,
    {
      label: "Lang",
      value: tw.lang,
      options: ["en", "ar"],
      onChange: (v) => setTweak("lang", v)
    }
  )), /* @__PURE__ */ React.createElement(TweakSection, { label: "Layout" }, /* @__PURE__ */ React.createElement(
    TweakRadio,
    {
      label: "Density",
      value: tw.density,
      options: ["compact", "comfortable"],
      onChange: (v) => setTweak("density", v)
    }
  ), /* @__PURE__ */ React.createElement(
    TweakToggle,
    {
      label: "Floating stat badge",
      value: tw.showStatBadge,
      onChange: (v) => setTweak("showStatBadge", v)
    }
  )), /* @__PURE__ */ React.createElement(TweakSection, { label: "Jump · Auth" }, /* @__PURE__ */ React.createElement("div", { style: navGrid }, [["signin", "Sign in"], ["signup", "Sign up"]].map(([k, l]) => /* @__PURE__ */ React.createElement(
    "button",
    {
      key: k,
      onClick: () => setRoute({ scope: "auth", name: k }),
      style: navBtn(route.scope === "auth" && route.name === k)
    },
    l
  )))), /* @__PURE__ */ React.createElement(TweakSection, { label: "Jump · App" }, /* @__PURE__ */ React.createElement("div", { style: navGrid }, [["trips", "Trips"], ["insights", "Insights"], ["appSettings", "Settings"]].map(([k, l]) => /* @__PURE__ */ React.createElement(
    "button",
    {
      key: k,
      onClick: () => setRoute({ scope: "app", name: k }),
      style: navBtn(route.scope === "app" && route.name === k)
    },
    l
  )))), /* @__PURE__ */ React.createElement(TweakSection, { label: "Jump · Trip Hub" }, /* @__PURE__ */ React.createElement("div", { style: navGrid }, [["hub", "Hub"], ["budget", "Budget"], ["analytics", "Stats"], ["docs", "Vault"], ["settings", "Settings"]].map(([k, l]) => /* @__PURE__ */ React.createElement(
    "button",
    {
      key: k,
      onClick: () => setRoute({ scope: "trip", name: k, tripId: "kyoto-26" }),
      style: navBtn(route.scope === "trip" && route.name === k)
    },
    l
  )))), /* @__PURE__ */ React.createElement(TweakSection, { label: "Doc detail" }, /* @__PURE__ */ React.createElement("button", { onClick: () => {
    const d = window.DOCS_BY_CAT.flights[0];
    const c = window.DOC_CATEGORIES.find((x) => x.key === "flights");
    setDocView({ doc: d, category: c, prevRoute: route });
  }, style: navBtn(false) }, "Preview a flight doc"))));
}
const navGrid = { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 };
const navBtn = (active) => ({
  padding: "8px",
  borderRadius: 8,
  background: active ? "#222" : "#f5f5f5",
  color: active ? "#fff" : "#222",
  fontSize: 12,
  fontWeight: 500
});
function scrollActiveToTop() {
  var _a;
  const scroller = document.querySelector('[class="no-scrollbar"]:not(.ptr-indicator)') || document.querySelector(".no-scrollbar");
  if (!scroller) return;
  (_a = scroller.scrollTo) == null ? void 0 : _a.call(scroller, { top: 0, behavior: "smooth" });
}
function PlaneMark({ size = 15 }) {
  return /* @__PURE__ */ React.createElement(
    "svg",
    {
      width: size,
      height: size,
      viewBox: "0 0 24 24",
      "aria-hidden": "true",
      style: { display: "block", transform: window.isRTL ? "scaleX(-1)" : "none" }
    },
    /* @__PURE__ */ React.createElement("path", { d: "M2 21l21-9L2 3v7l15 2-15 2z", fill: "var(--clay)" })
  );
}
function slotHalf(N) {
  return `${0.5 / N * 100}%`;
}
function RouteNav({ tabs, active, onChange, onAdd }) {
  const N = tabs.length;
  const activeIndex = Math.max(0, tabs.findIndex((tb) => tb.k === active));
  const pos = window.isRTL ? N - 1 - activeIndex : activeIndex;
  const reduce = typeof window !== "undefined" && window.matchMedia ? window.matchMedia("(prefers-reduced-motion: reduce)").matches : false;
  const glide = reduce ? "none" : "transform 260ms cubic-bezier(.2,.8,.2,1)";
  const slot = `${100 / N}%`;
  return /* @__PURE__ */ React.createElement("div", { style: navShell }, /* @__PURE__ */ React.createElement("div", { style: tabsWrap }, /* @__PURE__ */ React.createElement("div", { style: {
    position: "absolute",
    top: 7,
    left: slotHalf(N),
    right: slotHalf(N),
    borderTop: "1.5px dotted var(--hairline-2)",
    pointerEvents: "none"
  } }), tabs.map((_, i) => /* @__PURE__ */ React.createElement("span", { key: "stop" + i, style: {
    position: "absolute",
    top: 4.5,
    left: `${(i + 0.5) / N * 100}%`,
    transform: "translateX(-50%)",
    width: 5,
    height: 5,
    borderRadius: 999,
    background: "var(--cream-2)",
    border: "1.5px solid var(--hairline-2)",
    pointerEvents: "none"
  } })), /* @__PURE__ */ React.createElement("div", { style: {
    position: "absolute",
    top: 0,
    left: 0,
    width: slot,
    height: 15,
    display: "grid",
    placeItems: "center",
    zIndex: 2,
    pointerEvents: "none",
    transform: `translateX(${pos * 100}%)`,
    transition: glide,
    filter: "drop-shadow(0 2px 3px oklch(0.62 0.13 35 / 0.4))"
  } }, /* @__PURE__ */ React.createElement(PlaneMark, null)), tabs.map((tab) => {
    const isActive = active === tab.k;
    return /* @__PURE__ */ React.createElement(
      "button",
      {
        key: tab.k,
        "aria-label": tab.l,
        "aria-current": isActive ? "page" : void 0,
        onClick: () => isActive ? scrollActiveToTop() : onChange(tab.k),
        style: tabBtn(isActive)
      },
      /* @__PURE__ */ React.createElement("span", { style: {
        display: "grid",
        placeItems: "center",
        transform: isActive ? "scale(1.06)" : "scale(1)",
        transition: "transform 200ms cubic-bezier(.2,.8,.2,1)"
      } }, /* @__PURE__ */ React.createElement(tab.i, { size: 21, stroke: "currentColor" })),
      /* @__PURE__ */ React.createElement("span", { style: navLabel(isActive) }, tab.l)
    );
  })), onAdd && /* @__PURE__ */ React.createElement("button", { onClick: onAdd, style: navAdd, "aria-label": window.isRTL ? "إضافة" : "Add" }, /* @__PURE__ */ React.createElement(IconPlus, { size: 22, stroke: "#fff" })));
}
function AppNav({ active, onChange, onAdd }) {
  const tabs = [
    { k: "trips", l: t("myTrips"), i: IconCompass },
    { k: "insights", l: t("insightsNav"), i: IconSparkle },
    { k: "appSettings", l: t("accountNav"), i: IconGear }
  ];
  return /* @__PURE__ */ React.createElement(RouteNav, { tabs, active, onChange, onAdd });
}
function TripNav({ active, onChange }) {
  const tabs = [
    { k: "hub", l: t("hub"), i: IconHome },
    { k: "plan", l: t("planNav"), i: IconCompass },
    { k: "budget", l: t("budgetNav"), i: IconWallet },
    { k: "docs", l: t("vaultNav"), i: IconDoc },
    { k: "settings", l: t("settings"), i: IconGear }
  ];
  return /* @__PURE__ */ React.createElement(RouteNav, { tabs, active, onChange });
}
const navShell = {
  position: "absolute",
  bottom: 0,
  left: 0,
  right: 0,
  zIndex: 50,
  padding: "6px 12px calc(8px + env(safe-area-inset-bottom))",
  background: "var(--cream-2)",
  backdropFilter: "blur(28px) saturate(180%)",
  WebkitBackdropFilter: "blur(28px) saturate(180%)",
  borderTop: "0.5px solid var(--hairline)",
  boxShadow: "0 -2px 12px rgba(0,0,0,0.06)",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 8
};
const tabsWrap = {
  position: "relative",
  flex: 1,
  display: "flex",
  alignItems: "flex-end",
  gap: 0,
  paddingTop: 15
};
const tabBtn = (active) => ({
  flex: 1,
  minWidth: 0,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: 3,
  padding: "2px 4px",
  background: "transparent",
  color: active ? "var(--clay-deep)" : "var(--ink-mute)",
  transition: "color 220ms"
});
const navLabel = (active) => ({
  fontSize: window.isRTL ? 9.5 : 10.5,
  fontWeight: active ? 600 : 500,
  letterSpacing: "-0.005em",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  maxWidth: 64
});
const navAdd = {
  width: 44,
  height: 44,
  borderRadius: 999,
  background: "var(--clay)",
  display: "grid",
  placeItems: "center",
  boxShadow: "0 4px 12px oklch(0.62 0.13 35 / 0.6)",
  flexShrink: 0,
  alignSelf: "center"
};
function ShareSheet() {
  var _a, _b;
  const [copied, setCopied] = React.useState(false);
  const [inviteRole, setInviteRole] = React.useState("Editor");
  const [token, setToken] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const tripId = (_a = window.TRIP) == null ? void 0 : _a.id;
  const tripTitle = ((_b = window.TRIP) == null ? void 0 : _b.title) || "";
  React.useEffect(() => {
    if (!tripId) return;
    let cancelled = false;
    setLoading(true);
    setError(null);
    setToken(null);
    window.getOrCreateInvite(tripId, inviteRole).then((tok) => {
      if (!cancelled) setToken(tok);
    }).catch((err) => {
      if (!cancelled) setError(err.message || "Could not create invite");
    }).finally(() => {
      if (!cancelled) setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [tripId, inviteRole]);
  const link = token ? window.inviteLink(token) : "";
  const shareMsg = window.isRTL ? `انضم إلى رحلتنا "${tripTitle}" على Voyage:
${link}` : `Join our trip "${tripTitle}" on Voyage:
${link}`;
  const handleCopy = async () => {
    if (!link) return;
    try {
      await navigator.clipboard.writeText(link);
    } catch (_) {
      const el = document.createElement("textarea");
      el.value = link;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2e3);
  };
  const handleNativeShare = async () => {
    if (!link) return;
    if (navigator.share) {
      try {
        await navigator.share({ title: tripTitle, text: shareMsg, url: link });
      } catch (_) {
      }
    } else {
      handleCopy();
    }
  };
  const handleWhatsApp = () => {
    if (!link) return;
    window.open(`https://wa.me/?text=${encodeURIComponent(shareMsg)}`, "_blank");
  };
  return /* @__PURE__ */ React.createElement("div", { style: { padding: "8px 22px 22px" } }, /* @__PURE__ */ React.createElement("div", { style: {
    background: "var(--cream-2)",
    borderRadius: 22,
    padding: "22px 18px",
    border: "0.5px solid var(--hairline)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 6
  } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 30 } }, "✈️"), /* @__PURE__ */ React.createElement("div", { className: "serif", style: { fontSize: 20, lineHeight: 1.1, textAlign: "center" } }, t("inviteHeadline"), " ", tripTitle), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, color: "var(--ink-mute)", textAlign: "center", maxWidth: 280 } }, t("inviteSubline"))), /* @__PURE__ */ React.createElement("div", { style: { marginTop: 14 } }, /* @__PURE__ */ React.createElement("div", { style: {
    fontFamily: "var(--mono)",
    fontSize: 10,
    letterSpacing: "0.14em",
    color: "var(--ink-mute)",
    textTransform: "uppercase",
    marginBottom: 8,
    padding: "0 4px"
  } }, t("inviteWithRole")), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 8, flexDirection: "row" } }, ["Admin", "Editor", "Viewer"].map((r) => /* @__PURE__ */ React.createElement("button", { key: r, onClick: () => setInviteRole(r), style: {
    flex: 1,
    padding: "12px",
    borderRadius: 16,
    background: inviteRole === r ? "var(--ink)" : "var(--cream-2)",
    border: inviteRole === r ? "none" : "0.5px solid var(--hairline)",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    gap: 6,
    transition: "all 180ms"
  } }, /* @__PURE__ */ React.createElement(RoleBadge, { role: r }), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10.5, color: inviteRole === r ? "var(--cream)" : "var(--ink-mute)", textAlign: "start" } }, r === "Admin" ? t("fullControl") : r === "Editor" ? t("addExpenses") : t("readOnly")))))), /* @__PURE__ */ React.createElement("div", { style: {
    marginTop: 14,
    padding: "12px 14px",
    background: "var(--cream-2)",
    borderRadius: 16,
    border: "0.5px solid var(--hairline)",
    display: "flex",
    alignItems: "center",
    gap: 10,
    flexDirection: "row"
  } }, /* @__PURE__ */ React.createElement(IconLink, { size: 16, stroke: "var(--ink-mute)" }), /* @__PURE__ */ React.createElement("div", { className: "mono", style: {
    flex: 1,
    fontSize: 12.5,
    color: "var(--ink-soft)",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap"
  } }, loading ? t("inviteLoading") || "…" : error ? "—" : link), /* @__PURE__ */ React.createElement("button", { onClick: handleCopy, disabled: !link, style: {
    padding: "6px 12px",
    borderRadius: 999,
    background: copied ? "var(--moss)" : "var(--ink)",
    color: "var(--cream)",
    fontSize: 11,
    fontWeight: 500,
    transition: "background 200ms",
    flexShrink: 0,
    opacity: link ? 1 : 0.4
  } }, copied ? "✓" : t("copy"))), error && /* @__PURE__ */ React.createElement("div", { style: {
    marginTop: 10,
    padding: "10px 14px",
    borderRadius: 12,
    background: "oklch(0.62 0.13 35 / 0.10)",
    border: "0.5px solid oklch(0.62 0.13 35 / 0.3)",
    fontSize: 12.5,
    color: "var(--clay-deep)"
  } }, error), /* @__PURE__ */ React.createElement("div", { style: { marginTop: 12, display: "flex", gap: 8, flexDirection: "row" } }, /* @__PURE__ */ React.createElement("button", { onClick: handleNativeShare, disabled: !link, style: {
    flex: 1,
    padding: "14px",
    borderRadius: 16,
    background: "var(--clay)",
    color: "#fff",
    fontSize: 13,
    fontWeight: 600,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    flexDirection: "row",
    opacity: link ? 1 : 0.5,
    boxShadow: "0 6px 16px oklch(0.62 0.13 35 / 0.35)"
  } }, /* @__PURE__ */ React.createElement(IconShare, { size: 14, stroke: "currentColor" }), t("inviteShareBtn")), /* @__PURE__ */ React.createElement("button", { onClick: handleWhatsApp, disabled: !link, style: {
    flex: 1,
    padding: "14px",
    borderRadius: 16,
    background: "var(--cream-2)",
    color: "var(--ink)",
    border: "0.5px solid var(--hairline)",
    fontSize: 13,
    fontWeight: 600,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    flexDirection: "row",
    opacity: link ? 1 : 0.5
  } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 16 } }, "💬"), "WhatsApp")), /* @__PURE__ */ React.createElement("div", { style: { marginTop: 12, fontSize: 11, color: "var(--ink-mute)", textAlign: "center", padding: "0 8px" } }, t("inviteExpiryHint")));
}
const CAT_META = {
  lodging: { emoji: "🏨", label_en: "Lodging", label_ar: "الإقامة" },
  food: { emoji: "🍜", label_en: "Food", label_ar: "الطعام" },
  transit: { emoji: "🚅", label_en: "Transit", label_ar: "المواصلات" },
  culture: { emoji: "🎌", label_en: "Culture", label_ar: "الثقافة" },
  misc: { emoji: "📎", label_en: "Misc", label_ar: "متنوع" }
};
window.CAT_META = CAT_META;
function AddExpenseSheet({ onDone, onAdded, existing, prefill }) {
  var _a;
  const trip = window.TRIP;
  const members = window.MEMBERS || [];
  const cats = window.CATEGORIES || [];
  const isEdit = !!existing;
  const home = (trip == null ? void 0 : trip.homeCurrency) || "USD";
  const local = (trip == null ? void 0 : trip.localCurrency) || home;
  const sameHomeLocal = home === local;
  const [title, setTitle] = React.useState((existing == null ? void 0 : existing.title) || (prefill == null ? void 0 : prefill.title) || "");
  const [cat, setCat] = React.useState((existing == null ? void 0 : existing.cat) || (prefill == null ? void 0 : prefill.cat) || "food");
  const prefillCur = !existing && (prefill == null ? void 0 : prefill.currency) && (prefill.currency === home || prefill.currency === local) ? prefill.currency : null;
  const [inputCur, setInputCur] = React.useState(existing ? home : prefillCur || (local !== home ? local : home));
  const [amt, setAmt] = React.useState(() => {
    if (existing) {
      const rate = window.fxRate(home);
      return Math.round((existing.usd || 0) * rate * 100) / 100;
    }
    if (prefillCur && (prefill == null ? void 0 : prefill.amountLocal) != null) {
      return prefill.amountLocal;
    }
    if ((prefill == null ? void 0 : prefill.amountUSD) != null) {
      const initialCur = local !== home ? local : home;
      return Math.round(prefill.amountUSD * window.fxRate(initialCur) * 100) / 100;
    }
    return "";
  });
  const [paidBy, setPaidBy] = React.useState((existing == null ? void 0 : existing.who) || window.currentUserId || ((_a = members[0]) == null ? void 0 : _a.id) || "");
  const [note, setNote] = React.useState((existing == null ? void 0 : existing.note) || "");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const isShared = members.length > 1;
  const initialSplit = (() => {
    if (existing) {
      const list = existing.splitWith || [];
      if (list.length === 0) return { mode: "me", set: [] };
      const otherMemberIds = members.map((m) => m.id).filter((id) => id !== existing.who);
      const isAll = list.length === otherMemberIds.length && otherMemberIds.every((id) => list.includes(id));
      return isAll ? { mode: "everyone", set: list } : { mode: "custom", set: list };
    }
    return { mode: isShared ? "everyone" : "me", set: [] };
  })();
  const [splitMode, setSplitMode] = React.useState(initialSplit.mode);
  const [customSet, setCustomSet] = React.useState(initialSplit.set);
  const [receiptFile, setReceiptFile] = React.useState(null);
  const [receiptUrl, setReceiptUrl] = React.useState((existing == null ? void 0 : existing.receiptUrl) || null);
  const [receiptPath, setReceiptPath] = React.useState((existing == null ? void 0 : existing.receiptPath) || null);
  const [previewSrc, setPreviewSrc] = React.useState(null);
  const receiptInputRef = React.useRef(null);
  React.useEffect(() => {
    if (!receiptFile) {
      setPreviewSrc(null);
      return;
    }
    const url = URL.createObjectURL(receiptFile);
    setPreviewSrc(url);
    return () => URL.revokeObjectURL(url);
  }, [receiptFile]);
  const amtNum = parseFloat(amt) || 0;
  const computeSplitWith = () => {
    if (splitMode === "me") return [];
    if (splitMode === "everyone") return members.map((m) => m.id).filter((id) => id !== paidBy);
    return customSet.filter((id) => id !== paidBy);
  };
  const splitWithIds = computeSplitWith();
  const totalSharers = splitWithIds.length + 1;
  const sharePerPerson = totalSharers > 1 ? amtNum / totalSharers : null;
  const amtUSD = window.toUSD(amtNum, inputCur);
  const otherCur = inputCur === home ? local : home;
  const otherVal = amtUSD * window.fxRate(otherCur);
  const amtLocalForDB = local !== "USD" ? amtUSD * window.fxRate(local) : null;
  const handleSave = async () => {
    var _a2, _b, _c, _d, _e;
    if (!title.trim() || amtNum <= 0) {
      setError(t("fillRequired") || "Enter a title and amount");
      return;
    }
    const tripId = (trip == null ? void 0 : trip.id) || "demo";
    const createdByFast = paidBy || window.currentUserId;
    if (!isEdit && !receiptFile && !(prefill && prefill.source)) {
      const tempId = "temp-" + Date.now();
      const nowISO = (/* @__PURE__ */ new Date()).toISOString();
      const payload = {
        title: title.trim(),
        category: cat,
        amountUSD: amtUSD,
        amountLocal: amtLocalForDB,
        localCurrency: local,
        note: note.trim() || null,
        splitWith: splitWithIds
      };
      const optimistic = {
        id: tempId,
        who: createdByFast,
        cat,
        title: payload.title,
        jpy: local === "JPY" ? parseFloat(amtLocalForDB) || 0 : 0,
        usd: amtUSD,
        when: window.fmtDate(nowISO),
        createdAt: nowISO,
        note: payload.note || "",
        splitWith: splitWithIds,
        receiptPath: null,
        receiptUrl: null
      };
      window.EXPENSES = [optimistic, ...window.EXPENSES || []];
      (_a2 = window.recomputeExpenseDerived) == null ? void 0 : _a2.call(window, tripId);
      window.LIFETIME_STATS = null;
      (_b = window.notifyDataChange) == null ? void 0 : _b.call(window);
      onAdded == null ? void 0 : onAdded();
      onDone();
      (async () => {
        var _a3, _b2, _c2, _d2, _e2, _f, _g, _h, _i;
        try {
          await window.addExpense(tripId, createdByFast, payload);
          await window.loadExpenses(tripId);
          (_a3 = window.cachePersistTrip) == null ? void 0 : _a3.call(window, tripId);
          (_b2 = window.notifyDataChange) == null ? void 0 : _b2.call(window);
        } catch (err) {
          if (!navigator.onLine) {
            await ((_c2 = window.outboxEnqueue) == null ? void 0 : _c2.call(window, { type: "expense", tripId, createdBy: createdByFast, payload }));
            (_d2 = window.cachePersistTrip) == null ? void 0 : _d2.call(window, tripId);
            (_e2 = window.notifyDataChange) == null ? void 0 : _e2.call(window);
            (_f = window.toast) == null ? void 0 : _f.call(window, window.isRTL ? "حُفظ — سيُزامن عند عودة الاتصال" : "Saved — will sync when you reconnect", "success");
          } else {
            window.EXPENSES = (window.EXPENSES || []).filter((e) => e.id !== tempId);
            (_g = window.recomputeExpenseDerived) == null ? void 0 : _g.call(window, tripId);
            (_h = window.notifyDataChange) == null ? void 0 : _h.call(window);
            (_i = window.toast) == null ? void 0 : _i.call(window, err.message || "Failed to save expense", "error");
          }
        }
      })();
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const createdBy = paidBy || window.currentUserId;
      const payload = {
        title: title.trim(),
        category: cat,
        amountUSD: amtUSD,
        amountLocal: amtLocalForDB,
        localCurrency: local,
        note: note.trim() || null,
        splitWith: splitWithIds
      };
      let expenseId;
      if (isEdit) {
        await window.updateExpense(existing.id, (trip == null ? void 0 : trip.id) || "demo", payload);
        expenseId = existing.id;
      } else {
        const inserted = await window.addExpense((trip == null ? void 0 : trip.id) || "demo", createdBy, payload);
        expenseId = inserted == null ? void 0 : inserted.id;
      }
      if (receiptFile && expenseId) {
        try {
          await window.uploadReceipt(expenseId, trip == null ? void 0 : trip.id, receiptFile);
        } catch (e) {
          (_c = window.toast) == null ? void 0 : _c.call(window, e.message || "Receipt upload failed", "error");
        }
      } else if (isEdit && !receiptFile && !receiptUrl && (existing == null ? void 0 : existing.receiptPath)) {
        try {
          await window.deleteReceipt(existing.id, existing.receiptPath);
        } catch (_) {
        }
      }
      await window.loadExpenses((trip == null ? void 0 : trip.id) || "demo");
      if (!isEdit && expenseId && (prefill == null ? void 0 : prefill.source)) {
        try {
          if (prefill.source.doc) {
            await window.attachExpenseToDoc(prefill.source.doc, expenseId, trip == null ? void 0 : trip.id);
          } else if (prefill.source.plan) {
            await window.attachExpenseToItineraryItem(prefill.source.plan, expenseId, trip == null ? void 0 : trip.id);
          }
        } catch (e) {
          console.warn("link expense to source failed", e);
        }
        (_d = window.notifyDataChange) == null ? void 0 : _d.call(window);
      }
      onAdded == null ? void 0 : onAdded();
      onDone();
    } catch (err) {
      setError(err.message);
      (_e = window.toast) == null ? void 0 : _e.call(window, err.message || "Failed to save expense", "error");
      setLoading(false);
    }
  };
  const fieldStyle = {
    width: "100%",
    padding: "13px 14px",
    borderRadius: 14,
    border: "0.5px solid var(--hairline)",
    background: "var(--cream)",
    color: "var(--ink)",
    fontSize: 14,
    fontFamily: "var(--sans)",
    outline: "none",
    textAlign: "start"
  };
  return /* @__PURE__ */ React.createElement("div", { style: { padding: "4px 22px 28px" } }, /* @__PURE__ */ React.createElement("div", { style: {
    background: "var(--statement)",
    borderRadius: 22,
    padding: "18px 20px",
    color: "var(--statement-fg)",
    marginBottom: 14,
    position: "relative",
    overflow: "hidden"
  } }, /* @__PURE__ */ React.createElement("div", { style: {
    position: "absolute",
    inset: 0,
    background: "radial-gradient(60% 50% at 90% 0%, oklch(0.42 0.10 35 / 0.5) 0%, transparent 60%)",
    pointerEvents: "none"
  } }), /* @__PURE__ */ React.createElement("div", { style: {
    position: "relative",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    flexDirection: "row"
  } }, /* @__PURE__ */ React.createElement("div", { style: { fontFamily: "var(--mono)", fontSize: 10, letterSpacing: "0.14em", opacity: 0.72 } }, window.isRTL ? `قيمة المبلغ (${inputCur})` : `${inputCur} AMOUNT`), !sameHomeLocal && /* @__PURE__ */ React.createElement("button", { onClick: () => setInputCur(inputCur === home ? local : home), style: {
    padding: "4px 10px",
    borderRadius: 999,
    fontSize: 11,
    fontWeight: 500,
    background: "rgba(255,255,255,0.12)",
    color: "var(--statement-fg)",
    border: "0.5px solid rgba(255,255,255,0.15)",
    display: "inline-flex",
    alignItems: "center",
    gap: 4
  } }, /* @__PURE__ */ React.createElement(IconSwap, { size: 11, stroke: "currentColor" }), " ", otherCur)), /* @__PURE__ */ React.createElement(
    window.NumberField,
    {
      value: amt,
      onChange: setAmt,
      placeholder: "0",
      style: {
        background: "transparent",
        border: "none",
        outline: "none",
        fontFamily: "var(--serif)",
        fontSize: 52,
        lineHeight: 1,
        color: "var(--statement-fg)",
        width: "100%",
        textAlign: "start"
      }
    }
  ), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, opacity: 0.72, marginTop: 4 } }, !sameHomeLocal && amtNum > 0 ? `≈ ${window.CUR_SYM[otherCur] || otherCur + " "}${otherVal.toLocaleString("en", { maximumFractionDigits: window.CUR_WHOLE.has(otherCur) ? 0 : 2 })}` : "")), /* @__PURE__ */ React.createElement("div", { style: { marginBottom: 10 } }, /* @__PURE__ */ React.createElement("div", { style: { fontFamily: "var(--mono)", fontSize: 10, letterSpacing: "0.12em", color: "var(--ink-mute)", marginBottom: 6, textTransform: "uppercase" } }, window.isRTL ? "المسمى / المكان" : "Vendor / Description"), /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "text",
      value: title,
      onChange: (e) => setTitle(e.target.value),
      placeholder: window.isRTL ? "مثلاً: مطعم، فندق، وسيلة نقل..." : "Restaurant, hotel, transport...",
      style: fieldStyle
    }
  )), /* @__PURE__ */ React.createElement("div", { style: { marginBottom: 10 } }, /* @__PURE__ */ React.createElement("div", { style: { fontFamily: "var(--mono)", fontSize: 10, letterSpacing: "0.12em", color: "var(--ink-mute)", marginBottom: 6, textTransform: "uppercase" } }, window.isRTL ? "فئة المصروف" : "Category"), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 7, overflowX: "auto", flexDirection: "row" }, className: "no-scrollbar" }, cats.map((c) => {
    const meta = CAT_META[c.key] || {};
    const active = cat === c.key;
    return /* @__PURE__ */ React.createElement("button", { key: c.key, onClick: () => setCat(c.key), style: {
      flexShrink: 0,
      padding: "9px 13px",
      borderRadius: 14,
      background: active ? c.color : "var(--cream-2)",
      color: active ? "#fff" : "var(--ink-soft)",
      border: active ? "none" : "0.5px solid var(--hairline)",
      fontSize: 13,
      fontWeight: 500,
      display: "flex",
      alignItems: "center",
      gap: 6,
      flexDirection: "row",
      transition: "all 160ms"
    } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 16 } }, meta.emoji), /* @__PURE__ */ React.createElement("span", null, window.isRTL ? meta.label_ar || c.label : c.label));
  }))), members.length > 0 && /* @__PURE__ */ React.createElement("div", { style: { marginBottom: 10 } }, /* @__PURE__ */ React.createElement("div", { style: { fontFamily: "var(--mono)", fontSize: 10, letterSpacing: "0.12em", color: "var(--ink-mute)", marginBottom: 6, textTransform: "uppercase" } }, window.isRTL ? "جرى الدفع بواسطة" : "Paid by"), /* @__PURE__ */ React.createElement("div", { className: "no-scrollbar", style: { display: "flex", gap: 7, overflowX: "auto", flexDirection: "row", paddingBottom: 2 } }, members.map((m) => {
    const active = paidBy === m.id;
    return /* @__PURE__ */ React.createElement("button", { key: m.id, onClick: () => setPaidBy(m.id), style: {
      flexShrink: 0,
      minWidth: 70,
      padding: "10px 8px",
      borderRadius: 14,
      background: active ? "var(--statement)" : "var(--cream-2)",
      border: active ? "none" : "0.5px solid var(--hairline)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 5,
      transition: "all 160ms"
    } }, /* @__PURE__ */ React.createElement(Avatar, { m, size: 28 }), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 10.5, fontWeight: 500, color: active ? "var(--statement-fg)" : "var(--ink-soft)", maxWidth: 60, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" } }, m.name.split(" ")[0]));
  }))), isShared && /* @__PURE__ */ React.createElement("div", { style: { marginBottom: 10 } }, /* @__PURE__ */ React.createElement("div", { style: { fontFamily: "var(--mono)", fontSize: 10, letterSpacing: "0.12em", color: "var(--ink-mute)", marginBottom: 6, textTransform: "uppercase" } }, t("splitWithLabel")), /* @__PURE__ */ React.createElement("div", { style: {
    display: "inline-flex",
    padding: 3,
    background: "var(--cream-2)",
    borderRadius: 12,
    border: "0.5px solid var(--hairline)",
    width: "100%"
  } }, [
    { k: "everyone", l: t("splitEveryone") },
    { k: "me", l: t("splitJustMe") },
    { k: "custom", l: t("splitCustom") }
  ].map((s) => /* @__PURE__ */ React.createElement("button", { key: s.k, onClick: () => setSplitMode(s.k), style: {
    flex: 1,
    padding: "8px",
    borderRadius: 9,
    fontSize: 12,
    fontWeight: 500,
    background: splitMode === s.k ? "var(--ink)" : "transparent",
    color: splitMode === s.k ? "var(--cream)" : "var(--ink-soft)",
    transition: "all 180ms"
  } }, s.l))), splitMode === "custom" && /* @__PURE__ */ React.createElement("div", { className: "no-scrollbar", style: {
    display: "flex",
    gap: 6,
    overflowX: "auto",
    flexDirection: "row",
    marginTop: 8,
    paddingBottom: 2
  } }, members.filter((m) => m.id !== paidBy).map((m) => {
    const on = customSet.includes(m.id);
    return /* @__PURE__ */ React.createElement("button", { key: m.id, onClick: () => {
      setCustomSet((prev) => on ? prev.filter((x) => x !== m.id) : [...prev, m.id]);
    }, style: {
      flexShrink: 0,
      display: "flex",
      alignItems: "center",
      gap: 6,
      padding: "6px 10px 6px 6px",
      borderRadius: 999,
      background: on ? "var(--statement)" : "var(--cream-2)",
      color: on ? "var(--statement-fg)" : "var(--ink-soft)",
      border: on ? "none" : "0.5px solid var(--hairline)",
      transition: "all 160ms"
    } }, /* @__PURE__ */ React.createElement(Avatar, { m, size: 22 }), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 12, fontWeight: 500 } }, m.name.split(" ")[0]), on && /* @__PURE__ */ React.createElement(IconCheck, { size: 11, stroke: "currentColor" }));
  })), totalSharers > 1 && amtNum > 0 && /* @__PURE__ */ React.createElement("div", { style: {
    marginTop: 8,
    padding: "8px 12px",
    borderRadius: 10,
    background: "var(--cream-2)",
    border: "0.5px solid var(--hairline)",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
    flexDirection: "row",
    fontSize: 11.5
  } }, /* @__PURE__ */ React.createElement("span", { style: { color: "var(--ink-mute)", fontFamily: "var(--mono)", letterSpacing: "0.06em" } }, t("splitWithCount").replace("{n}", totalSharers)), /* @__PURE__ */ React.createElement("span", { style: { color: "var(--ink)", fontWeight: 600 } }, t("splitYourShare"), ": ", window.fmtMoney(window.toUSD(sharePerPerson, inputCur), { in: inputCur }))), splitMode === "me" && /* @__PURE__ */ React.createElement("div", { style: {
    marginTop: 8,
    fontSize: 11.5,
    color: "var(--ink-mute)",
    fontStyle: "italic",
    paddingInlineStart: 4
  } }, "ⓘ ", t("splitCovered"))), /* @__PURE__ */ React.createElement("div", { style: { marginBottom: 14 } }, /* @__PURE__ */ React.createElement("div", { style: { fontFamily: "var(--mono)", fontSize: 10, letterSpacing: "0.12em", color: "var(--ink-mute)", marginBottom: 6, textTransform: "uppercase" } }, window.isRTL ? "ملاحظة إضافية (اختياري)" : "Note (optional)"), /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "text",
      value: note,
      onChange: (e) => setNote(e.target.value),
      placeholder: window.isRTL ? "اكتب أي تفاصيل إضافية..." : "Extra details...",
      style: fieldStyle
    }
  )), /* @__PURE__ */ React.createElement("div", { style: { marginBottom: 14 } }, /* @__PURE__ */ React.createElement("div", { style: { fontFamily: "var(--mono)", fontSize: 10, letterSpacing: "0.12em", color: "var(--ink-mute)", marginBottom: 6, textTransform: "uppercase" } }, t("receiptLabel")), /* @__PURE__ */ React.createElement(
    "input",
    {
      ref: receiptInputRef,
      type: "file",
      accept: "image/*",
      capture: "environment",
      style: { display: "none" },
      onChange: (e) => {
        const f = e.target.files && e.target.files[0];
        if (f) setReceiptFile(f);
        e.target.value = "";
      }
    }
  ), previewSrc || receiptUrl ? /* @__PURE__ */ React.createElement("div", { style: {
    display: "flex",
    gap: 10,
    alignItems: "center",
    padding: 10,
    borderRadius: 14,
    background: "var(--cream-2)",
    border: "0.5px solid var(--hairline)",
    flexDirection: "row"
  } }, /* @__PURE__ */ React.createElement(
    "img",
    {
      src: previewSrc || receiptUrl,
      alt: "receipt",
      onClick: () => {
        var _a2;
        return (_a2 = window.openImageOverlay) == null ? void 0 : _a2.call(window, previewSrc || receiptUrl);
      },
      style: {
        width: 58,
        height: 58,
        objectFit: "cover",
        borderRadius: 10,
        border: "0.5px solid var(--hairline)",
        cursor: "zoom-in",
        flexShrink: 0
      }
    }
  ), /* @__PURE__ */ React.createElement("div", { style: { flex: 1, minWidth: 0 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12.5, fontWeight: 500, color: "var(--ink)" } }, receiptFile ? receiptFile.name : window.isRTL ? "الإيصال المرفق حالياً" : "Current receipt"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: "var(--ink-mute)", marginTop: 2 } }, t("receiptHint"))), /* @__PURE__ */ React.createElement("button", { onClick: () => {
    var _a2;
    return (_a2 = receiptInputRef.current) == null ? void 0 : _a2.click();
  }, style: {
    padding: "7px 11px",
    borderRadius: 10,
    fontSize: 11.5,
    fontWeight: 500,
    background: "var(--cream)",
    border: "0.5px solid var(--hairline)",
    color: "var(--ink-soft)"
  } }, t("receiptReplace")), /* @__PURE__ */ React.createElement("button", { onClick: () => {
    setReceiptFile(null);
    setReceiptUrl(null);
    setReceiptPath(null);
  }, style: {
    padding: "7px 9px",
    borderRadius: 10,
    background: "transparent",
    color: "var(--clay-deep)",
    border: "0.5px solid var(--hairline)"
  } }, /* @__PURE__ */ React.createElement(IconTrash, { size: 13, stroke: "currentColor" }))) : /* @__PURE__ */ React.createElement("button", { onClick: () => {
    var _a2;
    return (_a2 = receiptInputRef.current) == null ? void 0 : _a2.click();
  }, style: {
    width: "100%",
    padding: "14px",
    borderRadius: 14,
    background: "var(--cream-2)",
    border: "1px dashed var(--hairline-2)",
    color: "var(--ink-soft)",
    fontSize: 13,
    fontWeight: 500,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    flexDirection: "row"
  } }, /* @__PURE__ */ React.createElement(IconCamera, { size: 16, stroke: "currentColor" }), /* @__PURE__ */ React.createElement("span", null, t("receiptAdd")))), error && /* @__PURE__ */ React.createElement("div", { style: {
    marginBottom: 10,
    padding: "10px 14px",
    borderRadius: 12,
    background: "oklch(0.62 0.13 35 / 0.10)",
    border: "0.5px solid oklch(0.62 0.13 35 / 0.3)",
    fontSize: 12.5,
    color: "var(--clay-deep)"
  } }, error), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 10, flexDirection: "row" } }, isEdit && /* @__PURE__ */ React.createElement("button", { onClick: async () => {
    if (!confirm(window.isRTL ? "هل تريد حذف هذا المصروف؟" : "Delete this expense?")) return;
    setLoading(true);
    try {
      await window.deleteExpense(existing.id, trip == null ? void 0 : trip.id);
      await window.loadExpenses(trip == null ? void 0 : trip.id);
      onAdded == null ? void 0 : onAdded();
      onDone();
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }, disabled: loading, style: {
    padding: "16px 18px",
    borderRadius: 18,
    background: "var(--cream-2)",
    color: "var(--clay-deep)",
    border: "0.5px solid var(--hairline-2)",
    fontSize: 14,
    fontWeight: 600,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 6
  } }, /* @__PURE__ */ React.createElement(IconTrash, { size: 14, stroke: "currentColor" }), " ", window.isRTL ? "حذف المصروف" : "Delete"), /* @__PURE__ */ React.createElement("button", { onClick: handleSave, disabled: loading, style: {
    flex: 1,
    padding: "16px",
    borderRadius: 18,
    background: loading ? "var(--ink-soft)" : "var(--clay)",
    color: "#fff",
    fontSize: 14,
    fontWeight: 600,
    letterSpacing: "-0.005em",
    boxShadow: loading ? "none" : "0 8px 20px oklch(0.62 0.13 35 / 0.4)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    flexDirection: "row"
  } }, loading ? /* @__PURE__ */ React.createElement("span", { style: {
    width: 16,
    height: 16,
    borderRadius: "50%",
    border: "2px solid rgba(255,255,255,0.4)",
    borderTopColor: "#fff",
    display: "inline-block",
    animation: "expspin 0.7s linear infinite"
  } }) : isEdit ? window.isRTL ? "حفظ التغييرات الحالية" : "Save changes" : window.isRTL ? `تأكيد وإضافة المصروف — ${(trip == null ? void 0 : trip.title) || ""}` : `Add to ${(trip == null ? void 0 : trip.title) || "trip"}`)), /* @__PURE__ */ React.createElement("style", null, `@keyframes expspin { to { transform: rotate(360deg) } }`));
}
function AddDocSheet({ onDone }) {
  var _a;
  const [cat, setCat] = React.useState("flights");
  const [title, setTitle] = React.useState("");
  const [link, setLink] = React.useState("");
  const [drag, setDrag] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const fileRef = React.useRef(null);
  const tints = { flights: "indigo", lodging: "clay", visas: "moss", transport: "honey" };
  const tintFills = { indigo: "var(--indigo)", moss: "var(--moss)", clay: "var(--clay)", honey: "var(--honey)" };
  const handleSave = async () => {
    var _a2;
    if (!title.trim()) {
      setError(window.isRTL ? "يرجى إدخال عنوان للمستند" : "Enter a title");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const tripId = (_a2 = window.TRIP) == null ? void 0 : _a2.id;
      const userId = window.currentUserId;
      if (!tripId || !userId) throw new Error("No active trip or session");
      await window.addDocument(tripId, userId, {
        title: title.trim(),
        category: cat,
        kind: "pdf",
        tint: tints[cat] || "clay",
        linkUrl: link.trim() || null,
        linkLabel: link.trim() ? "Link" : null
      });
      await window.loadDocuments(tripId);
      onDone();
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };
  return /* @__PURE__ */ React.createElement("div", { style: { padding: "8px 22px 22px" } }, /* @__PURE__ */ React.createElement("div", { style: { marginBottom: 12 } }, /* @__PURE__ */ React.createElement("div", { style: { fontFamily: "var(--mono)", fontSize: 10, letterSpacing: "0.12em", color: "var(--ink-mute)", marginBottom: 6, textTransform: "uppercase" } }, window.isRTL ? "عنوان ومسمى المستند" : "Title"), /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "text",
      value: title,
      onChange: (e) => setTitle(e.target.value),
      placeholder: window.isRTL ? "اكتب عنواناً مميزاً للمستند..." : "Document name...",
      style: { width: "100%", padding: "12px 14px", borderRadius: 14, border: "0.5px solid var(--hairline)", background: "var(--cream)", color: "var(--ink)", fontSize: 14, outline: "none", textAlign: "start" }
    }
  )), /* @__PURE__ */ React.createElement(
    "div",
    {
      onClick: () => {
        var _a2;
        return (_a2 = fileRef.current) == null ? void 0 : _a2.click();
      },
      onDragEnter: (e) => {
        e.preventDefault();
        setDrag(true);
      },
      onDragOver: (e) => e.preventDefault(),
      onDragLeave: () => setDrag(false),
      onDrop: (e) => {
        e.preventDefault();
        setDrag(false);
      },
      style: {
        padding: "18px",
        borderRadius: 18,
        textAlign: "center",
        background: drag ? "oklch(0.62 0.13 35 / 0.10)" : "var(--cream-2)",
        border: drag ? "1.5px dashed var(--clay)" : "1.5px dashed var(--sand-deep)",
        cursor: "pointer",
        transition: "all 200ms"
      }
    },
    /* @__PURE__ */ React.createElement(
      "input",
      {
        ref: fileRef,
        type: "file",
        accept: ".pdf,.jpg,.jpeg,.png",
        style: { display: "none" },
        onChange: (e) => {
          if (e.target.files[0] && !title) setTitle(e.target.files[0].name.replace(/\.[^.]+$/, ""));
        }
      }
    ),
    /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 12, justifyContent: "center" } }, /* @__PURE__ */ React.createElement("div", { style: { width: 42, height: 42, borderRadius: 12, background: "var(--ink)", color: "var(--cream)", display: "grid", placeItems: "center" } }, /* @__PURE__ */ React.createElement(IconUpload, { size: 18 })), /* @__PURE__ */ React.createElement("div", { style: { textAlign: "start" } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 14, fontWeight: 500, color: "var(--ink)" } }, drag ? t("dropHere") : t("uploadHint")), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11.5, color: "var(--ink-mute)", marginTop: 2 } }, t("pdfJpgPng"))))
  ), /* @__PURE__ */ React.createElement("div", { style: { margin: "12px 0" } }, /* @__PURE__ */ React.createElement("div", { style: { fontFamily: "var(--mono)", fontSize: 10, letterSpacing: "0.12em", color: "var(--ink-mute)", marginBottom: 6, textTransform: "uppercase" } }, window.isRTL ? "الرابط المرفق (اختياري)" : "Link (optional)"), /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "url",
      value: link,
      onChange: (e) => setLink(e.target.value),
      placeholder: "https://maps.google.com/...",
      style: { width: "100%", padding: "12px 14px", borderRadius: 14, border: "0.5px solid var(--hairline)", background: "var(--cream)", color: "var(--ink)", fontSize: 13, fontFamily: "var(--mono)", outline: "none", textAlign: "start" }
    }
  )), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 6, overflowX: "auto", marginBottom: 14, flexDirection: "row" }, className: "no-scrollbar" }, (window.DOC_CATEGORIES || []).map((c) => /* @__PURE__ */ React.createElement("button", { key: c.key, onClick: () => setCat(c.key), style: {
    padding: "9px 13px",
    borderRadius: 14,
    flexShrink: 0,
    background: cat === c.key ? tintFills[c.tint] || "var(--ink)" : "var(--cream-2)",
    color: cat === c.key ? "#fff" : "var(--ink-soft)",
    border: "0.5px solid var(--hairline)",
    fontSize: 12.5,
    fontWeight: 500
  } }, c.label))), error && /* @__PURE__ */ React.createElement("div", { style: { marginBottom: 10, padding: "8px 12px", borderRadius: 10, background: "oklch(0.62 0.13 35 / 0.10)", fontSize: 12.5, color: "var(--clay-deep)" } }, error), /* @__PURE__ */ React.createElement("button", { onClick: handleSave, disabled: loading, style: {
    width: "100%",
    padding: "15px",
    borderRadius: 16,
    background: loading ? "var(--ink-soft)" : "var(--ink)",
    color: "var(--cream)",
    fontSize: 13.5,
    fontWeight: 600
  } }, loading ? "..." : `${window.isRTL ? "إضافة مباشرة إلى" : "Add to"} ${((_a = (window.DOC_CATEGORIES || []).find((c) => c.key === cat)) == null ? void 0 : _a.label) || cat}`));
}
const TRIP_COVERS = [
  { key: "kyoto", en: "Kyoto", ar: "كيوتو" },
  { key: "lisbon", en: "Lisbon", ar: "لشبونة" },
  { key: "oaxaca", en: "Oaxaca", ar: "واهاكا" },
  { key: "lofoten", en: "Lofoten", ar: "لوفوتن" },
  { key: "patagon", en: "Patagonia", ar: "باتاغونيا" }
];
function AddTripSheet({ onDone, onCreated }) {
  const today = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
  const nextWeek = new Date(Date.now() + 7 * 864e5).toISOString().slice(0, 10);
  const [title, setTitle] = React.useState("");
  const [subtitle, setSubtitle] = React.useState("");
  const [startDate, setStart] = React.useState(today);
  const [endDate, setEnd] = React.useState(nextWeek);
  const [budget, setBudget] = React.useState("");
  const [currency, setCurrency] = React.useState("USD");
  const [cover, setCover] = React.useState("kyoto");
  const [customUrl, setCustomUrl] = React.useState(null);
  const [customFile, setCustomFile] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const fileRef = React.useRef(null);
  React.useEffect(() => () => {
    if (customUrl) URL.revokeObjectURL(customUrl);
  }, [customUrl]);
  const homeCur = window.USER_DEFAULT_CURRENCY || "SAR";
  const CURRENCIES = ["USD", "EUR", "GBP", "JPY", "AED", "SAR", "EGP", "MAD", "TRY", "INR"];
  const STATUS = startDate > today ? "upcoming" : endDate < today ? "past" : "active";
  const customActive = !!customUrl;
  const MS = 864e5;
  const nights = startDate && endDate ? Math.max(0, Math.round((new Date(endDate) - new Date(startDate)) / MS)) : 0;
  const nightsLabel = window.isRTL ? window.arPlural(nights, {
    zero: "ليلة واحدة",
    one: "ليلة واحدة",
    two: "ليلتان",
    few: `${nights} ليالٍ`,
    many: `${nights} ليلة`,
    other: `${nights} ليلة`
  }) : `${nights} ${nights === 1 ? "night" : "nights"}`;
  const statusMeta = {
    active: { color: "var(--moss)", label: window.isRTL ? "نشطة الآن" : "Active now" },
    upcoming: { color: "var(--honey)", label: window.isRTL ? "قادمة" : "Upcoming" },
    past: { color: "var(--ink-mute)", label: window.isRTL ? "سابقة" : "Past" }
  }[STATUS];
  const groupCard = {
    background: "var(--cream-2)",
    borderRadius: 16,
    border: "0.5px solid var(--hairline)",
    overflow: "hidden"
  };
  const fieldRow = { padding: "12px 16px", display: "flex", flexDirection: "column", gap: 4 };
  const rowLabel = { fontSize: 11.5, fontWeight: 600, color: "var(--ink-mute)", textAlign: "start" };
  const rowInput = {
    width: "100%",
    border: "none",
    background: "transparent",
    color: "var(--ink)",
    fontSize: 16,
    outline: "none",
    textAlign: "start",
    padding: 0
  };
  const divider = { height: 1, background: "var(--hairline)", marginInline: 16 };
  const sectionLabel = {
    fontSize: 11.5,
    fontWeight: 600,
    color: "var(--ink-mute)",
    margin: "2px 4px 9px",
    display: "block",
    textAlign: "start"
  };
  const pickFromAlbum = () => {
    var _a;
    return (_a = fileRef.current) == null ? void 0 : _a.click();
  };
  const onFilePicked = (e) => {
    var _a;
    const f = (_a = e.target.files) == null ? void 0 : _a[0];
    if (!f) return;
    setCustomFile(f);
    setCustomUrl(URL.createObjectURL(f));
    e.target.value = "";
  };
  const pickPreset = (key) => {
    setCover(key);
    setCustomFile(null);
    setCustomUrl(null);
  };
  const handleSave = async () => {
    if (!title.trim()) {
      setError(window.isRTL ? "يرجى إدخال مسمى للرحلة" : "Enter a trip name");
      return;
    }
    if (!startDate || !endDate) {
      setError(window.isRTL ? "يرجى تحديد تواريخ بداية ونهاية الرحلة" : "Enter dates");
      return;
    }
    if (endDate < startDate) {
      setError(window.isRTL ? "تاريخ النهاية يجب أن يكون بعد تاريخ البداية" : "End date must be after start");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const trip = await window.createTrip({
        title: title.trim(),
        subtitle: subtitle.trim() || null,
        startDate,
        endDate,
        localCurrency: currency !== "USD" ? currency : "USD",
        // Budget typed in home currency -> stored as USD. Home currency +
        // fx are set automatically by createTrip from the account preference.
        budgetUSD: budget ? window.toUSD(budget, homeCur) : null,
        coverStyle: cover,
        // preset fallback even if a custom photo is set
        status: STATUS
      });
      if (customFile) {
        try {
          await window.uploadTripCover(trip.id, customFile);
        } catch (e) {
          console.warn("cover upload failed", e);
        }
      }
      onCreated(trip.id);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };
  const coverTile = (selected) => ({
    position: "relative",
    width: 88,
    height: 58,
    borderRadius: 14,
    overflow: "hidden",
    flexShrink: 0,
    boxShadow: selected ? "0 0 0 2.5px var(--clay), 0 8px 18px -8px rgba(0,0,0,0.4)" : "var(--shadow-xs)",
    transform: selected ? "translateY(-2px)" : "none",
    transition: "box-shadow 180ms cubic-bezier(.2,.8,.2,1), transform 180ms cubic-bezier(.2,.8,.2,1)"
  });
  return /* @__PURE__ */ React.createElement("div", { style: { padding: "4px 20px 0", display: "flex", flexDirection: "column", gap: 16 } }, /* @__PURE__ */ React.createElement("div", { style: {
    position: "relative",
    width: "100%",
    aspectRatio: "1.6 / 1",
    borderRadius: 24,
    overflow: "hidden",
    boxShadow: "var(--shadow-card)",
    border: "0.5px solid var(--hairline)"
  } }, customActive ? /* @__PURE__ */ React.createElement(window.CoverArt, { imageUrl: customUrl }) : /* @__PURE__ */ React.createElement(window.CoverArt, { kind: cover }), /* @__PURE__ */ React.createElement("div", { style: {
    position: "absolute",
    top: 16,
    insetInlineEnd: 16,
    padding: "6px 12px",
    borderRadius: 999,
    background: "rgba(255,255,255,0.18)",
    backdropFilter: "blur(10px)",
    fontFamily: "var(--mono)",
    fontSize: 12,
    fontWeight: 500,
    color: "rgba(255,255,255,0.96)",
    letterSpacing: "0.02em"
  } }, window.fmtDateRange(startDate, endDate)), /* @__PURE__ */ React.createElement("div", { style: {
    position: "absolute",
    top: 16,
    insetInlineStart: 16,
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    padding: "6px 11px",
    borderRadius: 999,
    background: "rgba(20,15,10,0.34)",
    backdropFilter: "blur(10px)",
    fontSize: 11.5,
    fontWeight: 600,
    color: "#fff",
    flexDirection: "row"
  } }, /* @__PURE__ */ React.createElement("span", { style: { width: 7, height: 7, borderRadius: 999, background: statusMeta.color } }), statusMeta.label), /* @__PURE__ */ React.createElement("div", { style: {
    position: "absolute",
    insetInline: 20,
    bottom: 18,
    textAlign: "start"
  } }, /* @__PURE__ */ React.createElement("div", { className: "serif-italic", style: {
    fontSize: 34,
    lineHeight: 1.05,
    color: "#fff",
    letterSpacing: "-0.01em",
    textShadow: "0 2px 18px rgba(0,0,0,0.35)",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    opacity: title.trim() ? 1 : 0.6
  } }, title.trim() || (window.isRTL ? "اسم رحلتك" : "Your trip")), /* @__PURE__ */ React.createElement("div", { style: {
    marginTop: 5,
    display: "flex",
    alignItems: "center",
    gap: 8,
    fontSize: 12.5,
    color: "rgba(255,255,255,0.9)",
    flexDirection: "row"
  } }, subtitle.trim() && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("span", { style: { overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 180 } }, subtitle.trim()), /* @__PURE__ */ React.createElement("span", { style: { opacity: 0.5 } }, "·")), /* @__PURE__ */ React.createElement("span", { style: { fontFamily: "var(--mono)", flexShrink: 0 } }, nightsLabel)))), /* @__PURE__ */ React.createElement("div", { style: groupCard }, /* @__PURE__ */ React.createElement("div", { style: fieldRow }, /* @__PURE__ */ React.createElement("label", { htmlFor: "at-name", style: rowLabel }, window.isRTL ? "اسم الرحلة" : "Trip name"), /* @__PURE__ */ React.createElement(
    "input",
    {
      id: "at-name",
      value: title,
      onChange: (e) => setTitle(e.target.value),
      placeholder: window.isRTL ? "مثلاً: طوكيو · الربيع" : "e.g. Tokyo · Spring",
      style: rowInput
    }
  )), /* @__PURE__ */ React.createElement("div", { style: divider }), /* @__PURE__ */ React.createElement("div", { style: fieldRow }, /* @__PURE__ */ React.createElement("label", { htmlFor: "at-sub", style: rowLabel }, window.isRTL ? "وصف مختصر (اختياري)" : "Description (optional)"), /* @__PURE__ */ React.createElement(
    "input",
    {
      id: "at-sub",
      value: subtitle,
      onChange: (e) => setSubtitle(e.target.value),
      placeholder: window.isRTL ? "مثلاً: رحلة شهر العسل" : "e.g. Honeymoon trip",
      style: rowInput
    }
  )), /* @__PURE__ */ React.createElement("div", { style: divider }), /* @__PURE__ */ React.createElement("div", { style: { ...fieldRow, flexDirection: "row", gap: 0, alignItems: "stretch" } }, /* @__PURE__ */ React.createElement("div", { style: { flex: 1, display: "flex", flexDirection: "column", gap: 4 } }, /* @__PURE__ */ React.createElement("label", { htmlFor: "at-start", style: rowLabel }, window.isRTL ? "البداية" : "Start"), /* @__PURE__ */ React.createElement("input", { id: "at-start", type: "date", value: startDate, onChange: (e) => setStart(e.target.value), style: rowInput })), /* @__PURE__ */ React.createElement("div", { style: { width: 1, background: "var(--hairline)", marginInline: 14 } }), /* @__PURE__ */ React.createElement("div", { style: { flex: 1, display: "flex", flexDirection: "column", gap: 4 } }, /* @__PURE__ */ React.createElement("label", { htmlFor: "at-end", style: rowLabel }, window.isRTL ? "النهاية" : "End"), /* @__PURE__ */ React.createElement("input", { id: "at-end", type: "date", value: endDate, min: startDate, onChange: (e) => setEnd(e.target.value), style: rowInput })))), /* @__PURE__ */ React.createElement("div", { style: groupCard }, /* @__PURE__ */ React.createElement("div", { style: { ...fieldRow, flexDirection: "row", alignItems: "center", gap: 12 } }, /* @__PURE__ */ React.createElement("div", { style: { flex: 1, display: "flex", flexDirection: "column", gap: 4 } }, /* @__PURE__ */ React.createElement("label", { htmlFor: "at-budget", style: rowLabel }, window.isRTL ? "الميزانية (اختياري)" : "Budget (optional)"), /* @__PURE__ */ React.createElement(
    window.NumberField,
    {
      id: "at-budget",
      value: budget,
      onChange: setBudget,
      placeholder: window.isRTL ? "مثلاً: 10000" : "e.g. 10,000",
      style: rowInput
    }
  )), /* @__PURE__ */ React.createElement("span", { style: {
    fontFamily: "var(--mono)",
    fontSize: 14,
    fontWeight: 600,
    color: "var(--ink-mute)",
    flexShrink: 0
  } }, homeCur)), /* @__PURE__ */ React.createElement("div", { style: divider }), /* @__PURE__ */ React.createElement("div", { style: fieldRow }, /* @__PURE__ */ React.createElement("label", { style: rowLabel }, window.isRTL ? "عملة الوجهة" : "Destination currency"), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 7, flexWrap: "wrap", flexDirection: "row", marginTop: 8 } }, CURRENCIES.map((c) => /* @__PURE__ */ React.createElement("button", { key: c, onClick: () => setCurrency(c), style: {
    padding: "9px 13px",
    borderRadius: 10,
    fontSize: 13,
    fontWeight: 500,
    background: currency === c ? "var(--ink)" : "var(--cream)",
    color: currency === c ? "var(--cream)" : "var(--ink-soft)",
    border: "0.5px solid var(--hairline)",
    transition: "all 150ms"
  } }, c))))), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { style: sectionLabel }, window.isRTL ? "غلاف الرحلة" : "Trip cover"), /* @__PURE__ */ React.createElement("input", { ref: fileRef, type: "file", accept: "image/*", onChange: onFilePicked, style: { display: "none" } }), /* @__PURE__ */ React.createElement("div", { style: {
    display: "flex",
    gap: 10,
    overflowX: "auto",
    margin: "0 -20px",
    padding: "2px 20px 8px",
    flexDirection: "row"
  }, className: "no-scrollbar" }, /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: pickFromAlbum,
      "aria-label": window.isRTL ? "رفع صورة من الألبوم" : "Upload from album",
      style: coverTile(customActive)
    },
    customActive ? /* @__PURE__ */ React.createElement(window.CoverArt, { imageUrl: customUrl }) : /* @__PURE__ */ React.createElement("div", { style: {
      position: "absolute",
      inset: 0,
      display: "grid",
      placeItems: "center",
      background: "var(--cream-2)",
      border: "1.5px dashed var(--hairline-2)",
      borderRadius: 14
    } }, /* @__PURE__ */ React.createElement(
      "svg",
      {
        width: "24",
        height: "24",
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "var(--ink-soft)",
        strokeWidth: "1.6",
        strokeLinecap: "round",
        strokeLinejoin: "round"
      },
      /* @__PURE__ */ React.createElement("rect", { x: "3", y: "3", width: "18", height: "18", rx: "3" }),
      /* @__PURE__ */ React.createElement("circle", { cx: "8.5", cy: "8.5", r: "1.6" }),
      /* @__PURE__ */ React.createElement("path", { d: "M21 15l-5-5L5 21" })
    ))
  ), TRIP_COVERS.map((c) => {
    const selected = !customActive && cover === c.key;
    return /* @__PURE__ */ React.createElement(
      "button",
      {
        key: c.key,
        onClick: () => pickPreset(c.key),
        "aria-pressed": selected,
        "aria-label": window.isRTL ? `غلاف ${c.ar}` : `${c.en} cover`,
        style: coverTile(selected)
      },
      /* @__PURE__ */ React.createElement(window.CoverArt, { kind: c.key })
    );
  }))), error && /* @__PURE__ */ React.createElement("div", { style: {
    padding: "10px 14px",
    borderRadius: 12,
    background: "oklch(0.62 0.13 35 / 0.10)",
    border: "0.5px solid oklch(0.62 0.13 35 / 0.3)",
    fontSize: 12.5,
    color: "var(--clay-deep)"
  } }, error), /* @__PURE__ */ React.createElement("div", { style: {
    position: "sticky",
    bottom: 0,
    zIndex: 2,
    margin: "4px -20px 0",
    padding: "12px 20px 16px",
    background: "var(--cream)",
    borderTop: "0.5px solid var(--hairline)"
  } }, /* @__PURE__ */ React.createElement("button", { onClick: handleSave, disabled: loading, style: {
    width: "100%",
    padding: "16px",
    borderRadius: 18,
    background: loading ? "var(--ink-soft)" : "var(--clay)",
    color: "#fff",
    fontSize: 15,
    fontWeight: 600,
    boxShadow: loading ? "none" : "0 8px 20px oklch(0.62 0.13 35 / 0.4)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8
  } }, loading ? /* @__PURE__ */ React.createElement("span", { style: {
    width: 16,
    height: 16,
    borderRadius: "50%",
    border: "2px solid rgba(255,255,255,0.4)",
    borderTopColor: "#fff",
    display: "inline-block",
    animation: "expspin 0.7s linear infinite"
  } }) : window.isRTL ? "إنشاء الرحلة" : "Create trip")));
}
ReactDOM.createRoot(document.getElementById("root")).render(
  /* @__PURE__ */ React.createElement(ErrorBoundary, null, /* @__PURE__ */ React.createElement(App, null))
);
