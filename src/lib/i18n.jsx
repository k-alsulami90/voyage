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

    // Settle up — keep the language about INVOICES and SETTLING, not
    // transfers or transactions. "Invoice" reads concretely in both
    // English and Arabic and avoids the bookkeeping connotation of
    // "transaction." Each line in Settle Up is one outstanding
    // invoice between two people; marking it paid clears it.
    settleUp:'Settle up',
    settleAllSettled:'No invoices to settle.',
    settleTransactions:'Open invoices',
    settleSummary:'{n} {n,plural,one{invoice}other{invoices}} to settle',
    settleMarkPaid:'Mark as settled',
    settleShare:'Share',
    settleHistory:'Settled',
    settleNoActivity:'No expenses yet — add some to start tracking.',
    settleConfirmTitle:'Mark invoice as settled?',
    settleConfirmMsg:'{from} paid {to} {amount}. The invoice will move to Settled.',
    settleConfirmYes:'Yes, settled',
    settleWhatsappCopy:'Hey {to}, I owe you {amount} from our trip — settling via Voyage.',
    settleHistoryTitle:'Past settlements',
    settleInvoiceSettled:'Invoice settled.',

    // Splits & shared trips
    splitWithLabel:'Split with',
    splitEveryone:'Everyone',
    splitJustMe:'Just me',
    splitCustom:'Choose people',
    splitWithCount:'split {n} ways',
    splitYourShare:'your share',
    splitCovered:"I'm covering this",
    // Direction-aware balance phrasing -- "{name} owes you" reads
    // clearer than the previous abstract "You're owed". The {amount}
    // placeholder is inserted by the caller for both variants. When
    // there's more than one counterparty the caller uses balanceFromN /
    // balanceToN forms instead.
    balanceOwedFrom:'{name} owes you {amount}',
    balanceOweTo:'You owe {name} {amount}',
    balanceOwedFromN:'{n} people owe you {amount}',
    balanceOweToN:'You owe {n} people {amount}',
    balanceSettled:'All settled',
    balanceTapToSettle:'Tap to settle',

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
    // ── Auth ──
    signIn:'تسجيل الدخول', signUp:'حساب جديد', email:'البريد الإلكتروني',
    password:'كلمة المرور', fullName:'الاسم الكامل', continue:'متابعة',
    createLedger:'إنشاء السجل', forgotPassword:'نسيتها؟', orContinueWith:'أو تابع بـ',
    alreadyHaveAccount:'لديك حساب بالفعل؟', newToVoyage:'جديد في Voyage؟',
    createOne:'أنشئ حسابك الآن', signinLink:'تسجيل الدخول',
    agreeTerms:'بالتسجيل، أنت توافق على شروط الخدمة وسياسة خصوصية Voyage. رحلاتك ستبقى خاصة افتراضياً.',
    welcomeBack:'أهلاً بك\nمن جديد.', startLedger:'ابدأ\nتدوين رحلاتك.',
    tagline:'لعشاق الترحال والاستكشاف',
    apple:'آبل', google:'جوجل', passkey:'مفتاح',
    // ── Trips home ──
    yourTravels:'رحلاتي', all:'الكل', private:'خاصة', shared:'مشتركة',
    currentlyTraveling:'في رحلة الآن', upcoming:'الرحلات القادمة', pastTrips:'الرحلات السابقة',
    seeAll:'عرض الكل', lifetimeAllTrips:'سجل الإنفاق الكلي',
    countries:'دولة', continents:'قارات', travelDays:'يوم سفر',
    trips:'رحلات', lifetime:'المجموع', longest:'الأطول', logged:'مسجلة', spent:'أُنفق',
    crewPrivacy:'الطاقم يعيش داخل كل رحلة',
    crewPrivacySub:'الضيوف يرون فقط ما شاركته معهم.',
    sharedBudget:'الميزانية المشتركة للرحلة', leftOnPace:'المتبقي حسب وتيرة الصرف',
    upNext:'الحدث القادم', quickActions:'إجراءات سريعة',
    add:'إضافة مصروف', upload:'رفع', invite:'دعوة عضو جديد', plan:'تخطيط',
    recentActivity:'أحدث العمليات', splitting:'مشاركة', daysLeft:'أيام متبقية',
    budget:'الميزانية', totalSpent:'إجمالي الإنفاق', ofPlanned:'من',
    expenses:'قائمة المصروفات', auditLog:'سجل التعديلات والمراجعة',
    lodging:'السكن والإقامة', food:'المطاعم والمقاهي', transit:'المواصلات والتنقل', culture:'الأنشطة والثقافة', misc:'مصروفات متنوعة',
    // Document categories
    docFlights:'تذاكر الطيران', docLodging:'ححوزات السكن', docVisas:'التأشيرات', docTransport:'وسائل النقل والمسارات',
    // Dynamic trip card states
    daysAway:'بعد {n} أيام',    dayAway:'غداً',
    startingToday:'تبدأ اليوم',
    inProgress:'جارية الآن',          dayOfTotal:'اليوم {n} من {total}',
    completed:'مكتملة',          lastedDays:'استغرقت {n} أيام',
    spentTotal:'إجمالي الإنفاق', budgetOf:'من أصل {b}',
    today:'اليوم',

    // ── Onboarding ──
    obStep:'الخطوة {a} من {b}',
    obSkip:'تخطٍ',
    obContinue:'متابعة',
    obBack:'رجوع',
    obGetStarted:'لنبدأ',
    obWelcomeTitle:'مرحباً بك في\nVoyage',
    obWelcomeSub:'وجهتك الواحدة للتخطيط لرحلاتك، تتبع مصروفاتك، ومشاركة تفاصيل السفر مع أصدقائك.',
    obFeature1Title:'دعم كامل لجميع العملات والدول',
    obFeature1Sub:'ترحال سلس بين مختلف الدول بالعملة المحلية لكل وجهة.',
    obFeature2Title:'مشاركة ذكية مع أصدقائك في السفر',
    obFeature2Sub:'تحكم كامل بالخصوصية: يرى ضيوفك فقط الرحلات التي تدعوهم إليها.',
    obFeature3Title:'إحصائيات وتحليلات شاملة',
    obFeature3Sub:'تتبع كل مصروفاتك ووزّع الميزانية بوضوح في لوحة تحكم واحدة.',
    obBasicsTitle:'لنتعرف عليك أكثر',
    obBasicsSub:'نستخدم هذه التفاصيل لتهيئة إعدادات التطبيق بما يناسبك.',
    obNameLabel:'الاسم الأول',
    obNamePlaceholder:'مثلاً: كريم',
    obHomeLabel:'مدينتك الحالية',
    obHomePlaceholder:'مكة، الرياض، دبي…',
    obCurrencyLabel:'العملة الافتراضية',
    obDoneTitle:'كل شيء جاهز!',
    obDoneSub:'يمكنك الآن إنشاء رحلتك الأولى أو البدء باستكشاف التطبيق.',
    obCreateTrip:'إنشاء أول رحلة',
    obExplore:'استكشاف التطبيق',

    // ── Receipts ──
    receiptLabel:'إيصال وفاتورة الدفع',
    receiptAdd:'إرفاق إيصال الدفع',
    receiptReplace:'استبدال',
    receiptRemove:'حذف',
    receiptUploading:'جاري الرفع…',
    receiptHint:'اختياري · صورة من الكاميرا أو المعرض',
    receiptOpenFull:'فتح بالحجم الكامل',

    // ── Settle up ──
    settleUp:'تسوية العبء المالي والحسابات',
    settleAllSettled:'رائع! جميع الحسابات والفواتير مُسوّاة بالكامل.',
    settleTransactions:'فواتير مفتوحة',
    settleSummary:'{n} {n,plural,one{فاتورة}other{فواتير}} للتسوية',
    settleMarkPaid:'تأكيد السداد والتسوية',
    settleShare:'مشاركة التفاصيل',
    settleHistory:'مُسوّاة',
    settleNoActivity:'لا توجد مصاريف مشتركة مسجلة لهذه الرحلة حتى الآن للبدء في تسويتها.',
    settleConfirmTitle:'هل تود تأكيد تسوية هذه الفاتورة؟',
    settleConfirmMsg:'قام {from} بسداد مبلغ {amount} إلى {to}. سيتم نقل هذه العملية مباشرة إلى قائمة المعاملات المُسوّاة والمكتملة.',
    settleConfirmYes:'نعم، تمت التسوية والسداد',
    settleWhatsappCopy:'مرحباً {to}، لقد قمت بتسوية وسداد مبلغ {amount} المترتب عليّ من رحلتنا الأخيرة — دُوّنت التسوية عبر تطبيق Voyage.',
    settleHistoryTitle:'سجل التسويات المكتملة',

    // ── Splits & shared trips ──
    splitWithLabel:'آلية تقسيم التكلفة',
    splitEveryone:'تقسيم بالتساوي على الجميع',
    splitJustMe:'أتحمل التكلفة بمفردي فقط',
    splitCustom:'تقسيم على أشخاص محددين',
    splitWithCount:'مقسوم بالتساوي بين {n} أشخاص',
    splitYourShare:'حصتك الصافية من التكلفة',
    splitCovered:'تكفلت بسدادها بالكامل',
    // Direction-aware balance phrasing
    balanceOwedFrom:'يترتب على {name} لك مبلغ {amount}',
    balanceOweTo:'أنت مدين لـ {name} بمبلغ {amount}',
    balanceOwedFromN:'يترتب لك بذمة {n} {n,plural,one{شخص}other{أشخاص}} إجمالي {amount}',
    balanceOweToN:'أنت مدين لـ {n} {n,plural,one{شخص}other{أشخاص}} بإجمالي {amount}',
    balanceSettled:'كل الحسابات متسوية',
    balanceTapToSettle:'اضغط لتسوية الحسابات',

    // ── Insights dashboard ──
    insightsTitle:'الإحصائيات الشاملة',
    insightsSub:'نظرة عامة وتحليلات مفصلة لكل رحلاتك ومصروفاتك',
    kpiTotalTrips:'إجمالي الرحلات',  kpiCountries:'الدول والوجهات',
    kpiTravelDays:'أيام السفر الكلية',      kpiLifetimeSpent:'إجمالي الإنفاق العام',
    sectionByYear:'تفصيل السنوات',
    sectionByCategory:'تحليل المصروفات',
    sectionTopTrips:'الرحلات الأعلى إنفاقاً',
    sectionTripStatus:'حالة الرحلات الحالية',
    sectionMembers:'الأصدقاء الرئيسيون',
    sectionPace:'متوسط وتيرة الإنفاق',
    statAvgTrip:'متوسط تكلفة الرحلة',      statLongestTrip:'الرحلة الأطول',
    statDailyAvg:'المعدل اليومي العام',     statTopTransaction:'أكبر مصروف فردي',
    statMostExpensive:'الوجهة الأغلى تكلفة',
    statTotalExpenses:'المصروفات المسجلة',
    statCurrencies:'العملات المستخدمة',
    yearTrips:'{n} رحلة',           yearDays:'{n} يوماً',
    statusCurrent:'جارية الآن',           statusUpcoming:'قادمة',
    statusPast:'سابقة',
    noInsightsYet:'لا توجد بيانات كافية حالياً',
    noInsightsSub:'ابدأ بإضافة رحلات ومصروفات جديدة لتظهر لك الإحصاءات العامة هنا',
    added:'أضاف', edited:'عدّل', uploaded:'رفع', invited:'دعا',
    ofTotal:'٪ من الإجمالي العام', used:'مستخدم',
    // ── Vault ──
    vault:'مستودع المستندات', piles:'المجلدات', recentlyShared:'مشاركة مؤخراً',
    addDocument:'إضافة مستند', uploadHint:'اسحب تذكرة أو تأشيرة',
    autoSort:'سيتم ترتيبه تلقائياً', browse:'استعراض',
    details:'التفاصيل', link:'الرابط', photos:'الصور', activity:'النشاط',
    edit:'تعديل', share:'مشاركة', uploadBtn:'رفع',
    addLink:'إضافة رابط', linkHint:'خرائط، تأكيد الحجز، موقع إلكتروني…',
    linkPlaceholder:'https://maps.google.com/...', save:'حفظ', open:'فتح',
    addPhoto:'إضافة صورة', sizeLbl:'الحجم', pagesLbl:'الصفحات', syncedLbl:'تزامن',
    // ── Trip Settings ──
    settings:'إعدادات الرحلة', crewSection:'الأصدقاء والمسافرون معي', travelers:'مسافرون معي',
    viewPermissions:'استعراض وفهم صلاحيات الأدوار', tripParameters:'معطيات ومحددات الرحلة',
    notifications:'الإشعارات', tripLifecycle:'إدارة حالة وسجل الرحلة',
    archiveTrip:'أرشفة الرحلة الحالية', archiveSub:'إخفاء الرحلة من القائمة النشطة مع الاحتفاظ بكافة بياناتها',
    exportPDF:'تصدير PDF', exportSub:'الإيصالات، السجل، الملخص',
    deleteTrip:'حذف سجل الرحلة نهائياً', deleteSub:'إجراء دائم يترتب عليه مسح كافة المصروفات والمستندات ولا يمكن التراجع عنه',
    archived:'تمت أرشفتها بنجاح', archivedSub:'الرحلة مخفية الآن وموجودة في الأرشيف', pdfReady:'PDF جاهز',
    areYouSure:'متأكد؟ لا يمكن التراجع.', cancel:'إلغاء', delete:'نعم، احذف الرحلة',
    destination:'وجهة السفر الرئيسية', dates:'فترة وتواريخ السفر', budgetCap:'سقف الميزانية الكلية',
    currencies:'قائمة العملات المفعلة', coverStyle:'نمط وتصميم الغلاف',
    newExpenses:'مصروفات جديدة', memberJoins:'انضمام أعضاء', docUploads:'رفع مستندات',
    hub:'الرئيسية', planNav:'خطة الأيام', budgetNav:'الميزانية', vaultNav:'المستندات', statsNav:'الإحصائيات',
    planAddTitle:'إضافة نشاط جديد', planEditTitle:'تعديل النشاط', planAddBtn:'إضافة نشاط',
    planEmptyDay:'جدول هذا اليوم فارغ — اضغط لإضافة الأنشطة',
    planFieldTitle:'عنوان النشاط', planFieldCategory:'فئة النشاط',
    planFieldTime:'الوقت (اختياري)', planFieldLocation:'المكان أو العنوان (اختياري)',
    planTitleReq:'يرجى إدخال عنوان النشاط', planLogExpense:'تسجيل كمصروف',
    exitTrip:'خروج', myTrips:'رحلاتي', insightsNav:'إحصائيات', accountNav:'الحساب',
    since2020:'منذ 2020', travelDaysByYear:'أيام السفر · بالسنة',
    daysByContinent:'الأيام بالقارة', whereMoneyGoes:'أين يذهب المال',
    topCategoryLifetime:'أعلى فئة · مدى الحياة', acrossAllTrips:'عبر كل الرحلات',
    // ── App Settings ──
    proTraveler:'مسافر محترف', preferences:'التفضيلات العامة للتطبيق',
    defaultCurrency:'العملة الافتراضية للحساب', homeBase:'مدينتك الرئيسية المقيم بها',
    appearance:'مظهر التطبيق (داكن/فاتح)', units:'الوحدات', privacy:'معايير وسياسة الخصوصية',
    tripScopedCollab:'تعاون آمن ومحدود بالرحلة',
    tripScopedSub:'الأصدقاء والضيوف الذين تدعوهم لرحلة معينة لن يتمكنوا أبداً من رؤية بقية رحلاتك أو تفاصيل بياناتك الشخصية الأخرى.',
    dataExport:'تصدير البيانات', connectedAccounts:'الحسابات المرتبطة',
    archivedTrips:'الرحلات المؤرشفة', account:'إدارة الحساب والبيانات',
    referFriend:'دعوة صديق', referSub:'كلاكما يحصل على 30 يوماً مجاناً',
    signOut:'تسجيل الخروج', deleteAccount:'إغلاق وحذف الحساب نهائياً',
    deleteAccountSub:'يحذف كل الرحلات والتاريخ',
    scanToJoin:'امسح للانضمام إلى', guestsSeeOnly:'الضيوف يرون هذه الرحلة فقط · تنتهي خلال 7 أيام',
    copy:'نسخ الرابط', inviteWithRole:'دعوة بصلاحية · نطاق: هذه الرحلة فقط',
    fullControl:'تحكم كامل', addExpenses:'إضافة مصروفات', readOnly:'قراءة فقط',
    inviteTheCrew:'دعوة الطاقم',
    inviteHeadline:'دعوة إلى', inviteSubline:'أي شخص لديه الرابط يمكنه الانضمام إلى الرحلة بالصلاحية التي تختارها.',
    inviteShareBtn:'مشاركة الرابط', inviteLoading:'جارٍ إنشاء الرابط…',
    inviteExpiryHint:'ينتهي الرابط خلال 30 يوماً. يمكنك إلغاؤه في أي وقت.',
    joinJoining:'جارٍ الانضمام للرحلة…', joinSuccess:'انضممت إلى الرحلة',
    activeInvites:'روابط الدعوة النشطة', inviteRevoked:'تم إلغاء رابط الدعوة بنجاح',
    addExpenseTitle:'إضافة مصروف', amountJPY:'المبلغ · ين',
    category:'الفئة', splitBetween:'توزيع بين', people:'أشخاص', each:'لكل',
    addToKyoto:'إضافة إلى رحلة كيوتو',
    addDocTitle:'إضافة مستند', pile:'المجلد',
    pdfJpgPng:'PDF، JPG، PNG · حتى 25 ميغابايت', dropHere:'أفلت هنا',
    dayLbl:'اليوم', ofLbl:'من', heySunday:'مرحباً · الأحد',
    uploadedBy:'رُفع بواسطة', admin:'مشرف', editor:'محرر', viewer:'قارئ',
    onPace:'في المسار', editCover:'تعديل غلاف الرحلة', tripScopedNote:'محدود بالرحلة',
    daily:'يومي', planned:'مخطط',
  },
};

window.LANG = 'en';
window.isRTL = false;

// ── Arabic pluralization helper ─────────────────────────────
// Arabic has six count categories, far richer than English's two. Using
// `${n} يوم` for every count reads broken to a native speaker. This
// helper takes a count and a forms object with up to six branches and
// returns the grammatically-correct phrase per the rules below.
//
// Forms object: { zero, one, two, few, many, other }
//   zero  → n = 0          → "no days" (avoid showing the digit 0)
//   one   → n = 1          → "يوم واحد" / singular absolute form
//   two   → n = 2          → "يومان" / dual; never show the digit 2
//   few   → 3 ≤ n ≤ 10     → "3 أيام" / paucal plural; noun in genitive plural
//   many  → 11 ≤ n ≤ 99    → "11 يوماً" / noun singular accusative w/ tanween
//   other → n ≥ 100        → "100 يوم" / singular genitive (also fallback)
//
// All branches except `other` are optional; missing branches fall back
// to `other`. Pass null to skip the helper entirely.
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
// Effective rate USD → code. Always the live table now — there is no
// per-trip manual override anymore (rates update automatically, and a
// hand-entered rate would just drift stale).
window.fxRate = function(code) {
  if (!code || code === 'USD') return 1;
  return window.FX_RATES[code] || 1;
};

// ── Auto-updating FX ────────────────────────────────────────
// Refresh the rate table from a free, no-key endpoint. Strategy:
//   1. Seed from localStorage cache instantly (offline-safe).
//   2. Fetch live in the background; merge only the codes we know.
//   3. Cache the result + date. Any failure leaves the built-in
//      table untouched, so the app always has usable rates.
// The service worker is configured to bypass this host (network-only)
// so we never serve a stale cached exchange rate.
window.refreshFxRates = async function() {
  try {
    const cached = JSON.parse(localStorage.getItem('voyage_fx') || 'null');
    if (cached && cached.rates) {
      Object.assign(window.FX_RATES, cached.rates);
      if (cached.updated) window.FX_RATES_UPDATED = cached.updated;
    }
  } catch (_) { /* ignore bad cache */ }

  try {
    const res = await fetch('https://open.er-api.com/v6/latest/USD', { cache: 'no-store' });
    if (!res.ok) return;
    const json = await res.json();
    if (!json || !json.rates) return;
    const next = {};
    Object.keys(window.FX_RATES).forEach((c) => {
      if (typeof json.rates[c] === 'number' && json.rates[c] > 0) next[c] = json.rates[c];
    });
    if (Object.keys(next).length === 0) return;
    Object.assign(window.FX_RATES, next);
    const updated = (json.time_last_update_utc
      ? new Date(json.time_last_update_utc)
      : new Date()).toISOString().slice(0, 10);
    window.FX_RATES_UPDATED = updated;
    localStorage.setItem('voyage_fx', JSON.stringify({ rates: next, updated }));
    window.notifyDataChange?.();   // re-render any visible money with fresh rates
  } catch (_) { /* offline or blocked — built-in table stays in effect */ }
};
// Kick off once at load; fire-and-forget so it never blocks first paint.
window.refreshFxRates();

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
