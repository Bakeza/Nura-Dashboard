
import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'ar';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
}

// Translation dictionary with improved Arabic translations
const translations: Record<Language, Record<string, string>> = {
  en: {
    // Dashboard and Navigation
    dashboard: 'Dashboard',
    overview: 'Overview of cognitive assessment data and patient metrics',
    patients: 'Patients',
    analysis: 'Analysis',
    sessions: 'Sessions',
    reports: 'Reports',
    recentActivity: 'Recent Patients',
    upcomingSessions: 'Upcoming Sessions',
    patientProgress: 'Patient Progress',
    viewAll: 'View all patients',
    todaysSessions: 'Today\'s Sessions',
    noSessions: 'No sessions scheduled for today',
    
    // Common UI elements
    darkMode: 'Dark Mode',
    connected: 'Connected',
    search: 'Search patients, sessions...',
    settings: 'Settings',
    profile: 'Profile',
    preferences: 'Preferences',
    notifications: 'Notifications',
    account: 'My Account',
    accountSettings: 'Account Settings',
    support: 'Support',
    logout: 'Log out',
    logoutSuccess: 'You have been logged out successfully',
    
    // Report translations
    clinicalReport: 'Clinical Assessment Report',
    downloadPdf: 'Download PDF Report',
    executiveSummary: 'Executive Summary',
    recommendations: 'Recommendations',
    metricsOverTime: 'Individual Metrics Over Time',
    performanceComparison: 'Before vs. After Performance Comparison',
    comparativeAnalysis: 'Comparative Analysis',
    firstSession: 'First Session',
    latestSession: 'Latest Session',
    change: '% Change',
    attention: 'Attention',
    memory: 'Memory',
    processingSpeed: 'Processing Speed',
    executiveFunction: 'Executive Function',
    overall: 'Overall',
    date: 'Date',
    day: 'Day',
    
    attentionExplanation: 'Measures the ability to focus on specific stimuli while filtering out distractions',
    memoryExplanation: 'Evaluates the capacity to store, retain, and recall information',
    processingSpeedExplanation: 'Assesses how quickly cognitive tasks can be performed',
    executiveFunctionExplanation: 'Measures higher-level cognitive skills including planning, problem-solving, and cognitive flexibility',
    overallExplanation: 'Combined assessment of all cognitive domains',
    responseTimeExplanation: 'Average time taken to respond to stimuli, measured in seconds',
    impulsivityExplanation: 'Number of commission errors due to responding without adequate processing',
    inattentionExplanation: 'Number of omission errors due to failure to respond to target stimuli',
    crossGameExplanation: 'Performance comparison across different cognitive exercises',
    
    // Patient management translations
    managePatientProfiles: 'Manage patient profiles and assessment data',
    addPatient: 'Add Patient',
    searchPatientsByName: 'Search patients by name...',
    patientName: 'Patient Name',
    age: 'Age',
    adhdSubtype: 'ADHD Subtype',
    lastSession: 'Last Session',
    percentile: 'Percentile',
    actions: 'Actions',
    viewAnalysis: 'View analysis',
    viewReports: 'View reports',
    filters: 'Filters',
    resetFilters: 'Reset filters',
    adhdSubtypes: 'ADHD Subtypes',
    ageRange: 'Age Range',
    years: 'years',
    inattentive: 'Inattentive',
    hyperactive: 'Hyperactive-Impulsive',
    combined: 'Combined',
    retry: 'Retry',
    retrying: 'Retrying',

    // Session related
    sessionDetails: 'Session Details',
    duration: 'Duration',
    completionRate: 'Completion Rate',
    startSession: 'Start Session',
    endSession: 'End Session',
    reschedule: 'Reschedule',
    cancel: 'Cancel',
    minutes: 'minutes',
    
    // Status and metrics
    completed: 'Completed',
    inProgress: 'In Progress',
    notStarted: 'Not Started',
    cancelled: 'Cancelled',
    high: 'High',
    medium: 'Medium',
    low: 'Low',
    excellent: 'Excellent',
    good: 'Good',
    average: 'Average',
    needsImprovement: 'Needs Improvement',
    
    // Common actions
    save: 'Save',
    edit: 'Edit',
    delete: 'Delete',
    view: 'View',
    confirm: 'Confirm',
    back: 'Back',
    next: 'Next',
    submit: 'Submit',

    // Landing page
    "Welcome to Nura": "Welcome to Nura",
    "A 2D pixel art farming RPG designed to support children with attention challenges": "A 2D pixel art farming RPG designed to support children with attention challenges",
    "Engaging Mini-Games": "Engaging Mini-Games",
    "Three adaptive games targeting focus and memory skills": "Three adaptive games targeting focus and memory skills",
    "Farm & Explore": "Farm & Explore",
    "Complete tasks and interact with NPCs in a vibrant world": "Complete tasks and interact with NPCs in a vibrant world",
    "Track Progress": "Track Progress",
    "Detailed reports to monitor attention improvements": "Detailed reports to monitor attention improvements",
    "View Dashboard": "View Dashboard",
    "Manage Players": "Manage Players",
    "Developed by Ayah Al Tamimi, Bakeza Diazada, and Daniella Anastas": "Developed by Ayah Al Tamimi, Bakeza Diazada, and Daniella Anastas",

    // Not found page
    "Oops! Page not found": "Oops! Page not found",
    "Return to Home": "Return to Home",

    // Analysis page
    "Back to Dashboard": "Back to Dashboard",
    "Detailed cognitive domain assessment and trends": "Detailed cognitive domain assessment and trends",
    "Select a patient": "Select a patient",
    "Loading patient data...": "Loading patient data...",
    
    // Patient detail page
    "Back to Patients": "Back to Patients",
    "Error Loading Patient Data": "Error Loading Patient Data",
    "Failed to fetch patient data": "Failed to fetch patient data",
    "Return to Patients List": "Return to Patients List", 
    "Patient Not Found": "Patient Not Found",
    "The requested patient could not be found or has been removed.": "The requested patient could not be found or has been removed.",

    // Domain chart
    "Cognitive Domain Trends": "Cognitive Domain Trends",
    "Performance trends across different cognitive domains over time": "Performance trends across different cognitive domains over time",

    // Additional dashboard translations
    "Total number of patients under your care": "Total number of patients under your care",
    "Average cognitive performance across all patients relative to their age group": "Average cognitive performance across all patients relative to their age group",
    "Total number of assessment sessions conducted": "Total number of assessment sessions conducted", 
    "Error Loading Data": "Error Loading Data",
    "Failed to load patient data. Using sample data instead.": "Failed to load patient data. Using sample data instead.",
    "No patients found.": "No patients found.",
    "Progress": "Progress",
    "Last 30d": "Last 30 days",
    "Cognitive Score": "Cognitive Score",
    "from last month": "from last month",
    "Not Specified": "Not Specified"
  },
  ar: {
    // Dashboard and Navigation
    dashboard: 'لوحة المعلومات',
    overview: 'نظرة عامة على بيانات التقييم المعرفي ومقاييس المرضى',
    patients: 'المرضى',
    analysis: 'التحليل',
    sessions: 'الجلسات',
    reports: 'التقارير',
    recentActivity: 'المرضى الأخيرون',
    upcomingSessions: 'الجلسات القادمة',
    patientProgress: 'تقدم المريض',
    viewAll: 'عرض جميع المرضى',
    todaysSessions: 'جلسات اليوم',
    noSessions: 'لا توجد جلسات مجدولة لليوم',
    
    // Common UI elements
    darkMode: 'الوضع المظلم',
    connected: 'متصل',
    search: 'بحث عن المرضى، الجلسات...',
    settings: 'الإعدادات',
    profile: 'الملف الشخصي',
    preferences: 'التفضيلات',
    notifications: 'الإشعارات',
    account: 'حسابي',
    accountSettings: 'إعدادات الحساب',
    support: 'الدعم الفني',
    logout: 'تسجيل الخروج',
    logoutSuccess: 'تم تسجيل الخروج بنجاح',
    
    // Report translations
    clinicalReport: 'تقرير التقييم السريري',
    downloadPdf: 'تحميل التقرير بصيغة PDF',
    executiveSummary: 'الملخص التنفيذي',
    recommendations: 'التوصيات',
    metricsOverTime: 'المقاييس الفردية على مدار الوقت',
    performanceComparison: 'مقارنة الأداء قبل وبعد',
    comparativeAnalysis: 'التحليل المقارن',
    firstSession: 'الجلسة الأولى',
    latestSession: 'الجلسة الأخيرة',
    change: 'نسبة التغيير %',
    attention: 'الانتباه',
    memory: 'الذاكرة',
    processingSpeed: 'سرعة المعالجة',
    executiveFunction: 'الوظائف التنفيذية',
    overall: 'التقييم العام',
    date: 'التاريخ',
    day: 'اليوم',
    
    attentionExplanation: 'يقيس القدرة على التركيز على المثيرات المحددة مع تصفية المشتتات',
    memoryExplanation: 'تقييم القدرة على تخزين واسترجاع المعلومات والاحتفاظ بها',
    processingSpeedExplanation: 'تقييم مدى سرعة إنجاز المهام المعرفية',
    executiveFunctionExplanation: 'يقيس المهارات المعرفية العليا بما في ذلك التخطيط وحل المشكلات والمرونة الإدراكية',
    overallExplanation: 'التقييم الشامل لجميع المجالات المعرفية',
    responseTimeExplanation: 'متوسط الوقت المستغرق للاستجابة للمثيرات، مقاس بالثواني',
    impulsivityExplanation: 'عدد أخطاء الاستجابة الناتجة عن الرد دون معالجة كافية',
    inattentionExplanation: 'عدد أخطاء الإغفال بسبب الفشل في الاستجابة للمثيرات المستهدفة',
    crossGameExplanation: 'مقارنة الأداء عبر التمارين المعرفية المختلفة',
    
    // Patient management translations
    managePatientProfiles: 'إدارة ملفات المرضى وبيانات التقييم',
    addPatient: 'إضافة مريض',
    searchPatientsByName: 'البحث عن المرضى بالاسم...',
    patientName: 'اسم المريض',
    age: 'العمر',
    adhdSubtype: 'نوع اضطراب فرط الحركة ونقص الانتباه',
    lastSession: 'آخر جلسة',
    percentile: 'النسبة المئوية',
    actions: 'الإجراءات',
    viewAnalysis: 'عرض التحليل',
    viewReports: 'عرض التقارير',
    filters: 'الفلاتر',
    resetFilters: 'إعادة تعيين الفلاتر',
    adhdSubtypes: 'أنواع اضطراب فرط الحركة ونقص الانتباه',
    ageRange: 'الفئة العمرية',
    years: 'سنوات',
    inattentive: 'نقص الانتباه',
    hyperactive: 'فرط الحركة والاندفاع',
    combined: 'مشترك',
    retry: 'إعادة المحاولة',
    retrying: 'جاري إعادة المحاولة',

    // Session related
    sessionDetails: 'تفاصيل الجلسة',
    duration: 'المدة',
    completionRate: 'معدل الإكمال',
    startSession: 'بدء الجلسة',
    endSession: 'إنهاء الجلسة',
    reschedule: 'إعادة جدولة',
    cancel: 'إلغاء',
    minutes: 'دقائق',
    
    // Status and metrics
    completed: 'مكتمل',
    inProgress: 'قيد التنفيذ',
    notStarted: 'لم يبدأ',
    cancelled: 'ملغى',
    high: 'مرتفع',
    medium: 'متوسط',
    low: 'منخفض',
    excellent: 'ممتاز',
    good: 'جيد',
    average: 'متوسط',
    needsImprovement: 'يحتاج إلى تحسين',
    
    // Common actions
    save: 'حفظ',
    edit: 'تعديل',
    delete: 'حذف',
    view: 'عرض',
    confirm: 'تأكيد',
    back: 'رجوع',
    next: 'التالي',
    submit: 'إرسال',

    // Landing page
    "Welcome to Nura": "مرحباً بك في نورا",
    "A 2D pixel art farming RPG designed to support children with attention challenges": "لعبة مزرعة ثنائية الأبعاد مصممة لدعم الأطفال الذين يعانون من تحديات الانتباه",
    "Engaging Mini-Games": "ألعاب مصغرة جذابة",
    "Three adaptive games targeting focus and memory skills": "ثلاثة ألعاب تكيفية تستهدف مهارات التركيز والذاكرة",
    "Farm & Explore": "الزراعة والاستكشاف",
    "Complete tasks and interact with NPCs in a vibrant world": "أكمل المهام وتفاعل مع الشخصيات في عالم نابض بالحياة",
    "Track Progress": "تتبع التقدم",
    "Detailed reports to monitor attention improvements": "تقارير مفصلة لمراقبة تحسينات الانتباه",
    "View Dashboard": "عرض لوحة المعلومات",
    "Manage Players": "إدارة اللاعبين",
    "Developed by Ayah Al Tamimi, Bakeza Diazada, and Daniella Anastas": "تم تطويره بواسطة آية التميمي، باكيزا ديازادا، ودانيلا أنستاس",

    // Not found page
    "Oops! Page not found": "عذراً! الصفحة غير موجودة",
    "Return to Home": "العودة إلى الصفحة الرئيسية",

    // Analysis page
    "Back to Dashboard": "العودة إلى لوحة المعلومات",
    "Detailed cognitive domain assessment and trends": "تقييم مفصل للمجالات المعرفية والاتجاهات",
    "Select a patient": "اختر مريضاً",
    "Loading patient data...": "جاري تحميل بيانات المريض...",
    
    // Patient detail page
    "Back to Patients": "العودة إلى المرضى",
    "Error Loading Patient Data": "خطأ في تحميل بيانات المريض",
    "Failed to fetch patient data": "فشل في جلب بيانات المريض",
    "Return to Patients List": "العودة إلى قائمة المرضى", 
    "Patient Not Found": "المريض غير موجود",
    "The requested patient could not be found or has been removed.": "تعذر العثور على المريض المطلوب أو تمت إزالته.",

    // Domain chart
    "Cognitive Domain Trends": "اتجاهات المجال المعرفي",
    "Performance trends across different cognitive domains over time": "اتجاهات الأداء عبر مجالات معرفية مختلفة بمرور الوقت",

    // Additional dashboard translations
    "Total number of patients under your care": "العدد الإجمالي للمرضى تحت رعايتك",
    "Average cognitive performance across all patients relative to their age group": "متوسط الأداء المعرفي عبر جميع المرضى بالنسبة لفئتهم العمرية",
    "Total number of assessment sessions conducted": "العدد الإجمالي لجلسات التقييم التي تم إجراؤها",
    "Error Loading Data": "خطأ في تحميل البيانات",
    "Failed to load patient data. Using sample data instead.": "فشل في تحميل بيانات المريض. استخدام بيانات العينة بدلاً من ذلك.",
    "No patients found.": "لم يتم العثور على مرضى.",
    "Progress": "التقدم",
    "Last 30d": "آخر 30 يوم",
    "Cognitive Score": "الدرجة المعرفية",
    "from last month": "من الشهر الماضي",
    "Not Specified": "غير محدد"
  }
};

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  t: (key: string) => key,
});

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  useEffect(() => {
    // Set document direction based on language
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
    
    // Add special class for RTL layout
    if (language === 'ar') {
      document.body.classList.add('rtl');
    } else {
      document.body.classList.remove('rtl');
    }
    
    // Store language preference
    localStorage.setItem('language', language);
  }, [language]);
  
  // Load preferred language on initial render
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'ar')) {
      setLanguage(savedLanguage);
    }
  }, []);

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
