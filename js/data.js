// MindBridge Database & Initial Mock Data
const MindBridgeData = {
  // Verified Mentors
  mentors: [
    {
      id: "m1",
      name: "Dr. Rəşad Əliyev",
      title: "Süni İntellekt və Python Mütəxəssisi",
      badge: "Yoxlanmış Baş Pedaqoq",
      verified: true,
      backgroundCheck: "Tam təsdiqlənmiş (Pedaqoji və Kriminal arayış təmiz)",
      rating: 4.98,
      reviewsCount: 142,
      experience: "12 il təcrübə (BDU & Stanford AI sertifikatlı)",
      specialty: "Süni İntellekt, Python, Data Science",
      ageRange: "14-17 və 18+ üçün qruplar",
      avatar: "👨‍🏫",
      bio: "Rəqəmsal biliklərin gənclərə interaktiv və praktiki layihələrlə ötürülməsi üzrə 12 illik beynəlxalq təcrübəyə malikdir.",
      studentsCount: 860,
      activeCohorts: 3
    },
    {
      id: "m2",
      name: "Leyla Qasımova",
      title: "Fullstack Veb Proqramlaşdırma üzrə Ekspert",
      badge: "Yoxlanmış Ekspert",
      verified: true,
      backgroundCheck: "Tam təsdiqlənmiş (Google Developer Expert alumni)",
      rating: 4.95,
      reviewsCount: 98,
      experience: "8 il təcrübə (Keçmiş EPAM mühəndisi)",
      specialty: "JavaScript, React, Node.js, Veb Dizayn",
      ageRange: "15-20 və 21+ qrupları",
      avatar: "👩‍💻",
      bio: "Praktik veb tətbiqlər, interaktiv istifadəçi interfeysləri və komanda layihələrinin rəhbəri.",
      studentsCount: 620,
      activeCohorts: 2
    },
    {
      id: "m3",
      name: "Cavid Məmmədov",
      title: "İngilis Dili və IELTS Baş Təlimçisi",
      badge: "Cambridge CELTA Yoxlanmış",
      verified: true,
      backgroundCheck: "Tam təsdiqlənmiş (Cambridge Sertifikatlı Təlimçi)",
      rating: 4.96,
      reviewsCount: 210,
      experience: "10 il beynəlxalq təlimçilik",
      specialty: "IELTS Speaking, Qrup Debatları, Akademik Yazı",
      ageRange: "Bütün yaş qrupları (12-16 və 17+)",
      avatar: "👨‍💼",
      bio: "Tələbələrin qrup şəraitində ingilis dilində sərbəst, kompleksiz və təbii danışmasını təmin edən interaktiv metodika müəllifidir.",
      studentsCount: 1250,
      activeCohorts: 4
    },
    {
      id: "m4",
      name: "Nərgiz Həsənova",
      title: "Uşaq və Yeniyetmələr üçün STEM & Scratch Mütəxəssisi",
      badge: "Uşaq Pedaqogikası üzrə Yoxlanmış",
      verified: true,
      backgroundCheck: "Tam təsdiqlənmiş (Uşaq təhlükəsizliyi və psixologiyası təsdiqli)",
      rating: 4.99,
      reviewsCount: 185,
      experience: "7 il pedaqoji təcrübə",
      specialty: "Scratch, Robototexnika, Məntiqi Kodlama",
      ageRange: "8-14 yaş (18 yaş altı xüsusi təhlükəsiz qruplar)",
      avatar: "👩‍🏫",
      bio: "Yeniyetmələrdə alqoritmik təfəkkürü oyunlar və vizual animasiyalar vasitəsilə inkişaf etdirən akkreditə olunmuş mentor.",
      studentsCount: 940,
      activeCohorts: 3
    },
    {
      id: "m5",
      name: "Tural Kərimli",
      title: "Riyaziyyat, Məntiq və Data Analitikası",
      badge: "Olimpiada Təlimçisi Yoxlanmış",
      verified: true,
      backgroundCheck: "Tam təsdiqlənmiş",
      rating: 4.92,
      reviewsCount: 77,
      experience: "9 il təcrübə",
      specialty: "Tətbiqi Riyaziyyat, Alqoritmlər, Məntiq",
      ageRange: "14-18 və 18+ yaş",
      avatar: "👨‍🔬",
      bio: "Mürəkkəb riyazi və məntiqi məsələləri sadə komanda tapşırıqları ilə əyləncəli şəkildə öyrədir.",
      studentsCount: 430,
      activeCohorts: 2
    },
    {
      id: "m6",
      name: "Aynur Məhərrəmova",
      title: "Azərbaycan Dili & Ədəbiyyat üzrə Baş DİM Eksperti",
      badge: "DİM Proqramı üzrə Yoxlanmış",
      verified: true,
      backgroundCheck: "Tam təsdiqlənmiş (Dövlət İmtahan Mərkəzi proqramı akkreditasiyalı)",
      rating: 4.99,
      reviewsCount: 312,
      experience: "16 il abituriyent hazırlığı təcrübəsi",
      specialty: "11 və 9-cu sinif Buraxılış İmtahanı, Mətn təhlili, Qrammatika",
      ageRange: "14-17 yaş (Abituriyentlər)",
      avatar: "👩‍🏫",
      bio: "Yüzlərlə abituriyenti 280+ və 600+ balla ölkənin və xaricinin ən qabaqcıl universitetlərinə hazırlayan təcrübəli pedaqoq.",
      studentsCount: 1680,
      activeCohorts: 5
    },
    {
      id: "m7",
      name: "Namiq Əhmədov",
      title: "DİM Buraxılış & Blok Riyaziyyatı üzrə Mütəxəssis",
      badge: "Yoxlanmış Baş Riyaziyyatçı",
      verified: true,
      backgroundCheck: "Tam təsdiqlənmiş (BDU Tətbiqi Riyaziyyat magistri)",
      rating: 4.97,
      reviewsCount: 245,
      experience: "14 il abituriyent hazırlığı",
      specialty: "Buraxılış Riyaziyyatı, Situasiya məsələləri, Həndəsə və Triqonometriya",
      ageRange: "14-18 yaş (Abituriyentlər)",
      avatar: "👨‍🏫",
      bio: "Riyaziyyatdan açıq və qapalı tipli qəbul suallarının sürətli və məntiqli həll texnikalarını kiçik canlı qruplarda mənimsədir.",
      studentsCount: 1350,
      activeCohorts: 4
    },
    {
      id: "m_sarah",
      name: "Sarah Johnson",
      title: "AI Expert & Data Scientist",
      badge: "Top Mentor",
      verified: true,
      backgroundCheck: "Tam təsdiqlənmiş (MIT & Stanford AI)",
      rating: 5.0,
      reviewsCount: 380,
      experience: "10 il sənaye təcrübəsi",
      specialty: "Süni İntellekt, Machine Learning, Deep Learning",
      ageRange: "15-18 və 18+ qruplar",
      avatar: "assets/mentors/mentor-sarah.jpg",
      photo: "assets/mentors/mentor-sarah.jpg",
      bio: "Süni intellekt və böyük verilənlər bazası üzrə qlobal tədqiqatçı və pedaqoq.",
      studentsCount: 1420,
      activeCohorts: 4
    },
    {
      id: "m_michael",
      name: "Michael Brown",
      title: "Cybersecurity Specialist",
      badge: "Yoxlanmış Ekspert",
      verified: true,
      backgroundCheck: "Tam təsdiqlənmiş (CISSP & CEH)",
      rating: 5.0,
      reviewsCount: 295,
      experience: "11 il kibertəhlükəsizlik",
      specialty: "Kiber Mühafizə, Şəbəkə Təhlükəsizliyi, Etik Hakinq",
      ageRange: "16-18 və 18+ qruplar",
      avatar: "assets/mentors/mentor-michael.jpg",
      photo: "assets/mentors/mentor-michael.jpg",
      bio: "Müasir rəqəmsal təhdidlərdən qorunma və sistem təhlükəsizliyi üzrə praktiki rəhbər.",
      studentsCount: 980,
      activeCohorts: 3
    },
    {
      id: "m_rachel",
      name: "Rachel Adams",
      title: "Financial Analyst",
      badge: "CFA Sertifikatlı",
      verified: true,
      backgroundCheck: "Tam təsdiqlənmiş (Wall St. Alumni)",
      rating: 5.0,
      reviewsCount: 310,
      experience: "9 il maliyyə və investisiya",
      specialty: "Maliyyə Modelləşdirməsi, İnvestisiyalar, Kripto & Fond Bazarı",
      ageRange: "16-18 və 18+ qruplar",
      avatar: "assets/mentors/mentor-rachel.jpg",
      photo: "assets/mentors/mentor-rachel.jpg",
      bio: "Maliyyə savadlılığı və beynəlxalq investisiya alətlərinin canlı tətbiqi.",
      studentsCount: 1100,
      activeCohorts: 3
    },
    {
      id: "m_maria",
      name: "Maria Lopez",
      title: "UX/UI Mentor",
      badge: "Dizayn Lideri",
      verified: true,
      backgroundCheck: "Tam təsdiqlənmiş (Design Systems Lead)",
      rating: 5.0,
      reviewsCount: 420,
      experience: "8 il rəqəmsal məhsul dizaynı",
      specialty: "Figma Prototyping, UI/UX Dizayn, İstifadəçi Tədqiqatı",
      ageRange: "14-18 və 18+ qruplar",
      avatar: "assets/mentors/mentor-maria.jpg",
      photo: "assets/mentors/mentor-maria.jpg",
      bio: "Dünya səviyyəli istifadəçi təcrübəsi və Figma prototipləmə sirlərini öyrədir.",
      studentsCount: 1650,
      activeCohorts: 5
    }
  ],

  // MindBridge Authentic Live Cohort Programs
  courses: [
    {
      id: "c1",
      title: "Süni İntellekt və Python: Təməldən Neyron Şəbəkələrə",
      category: "Texnologiya & AI",
      categoryKey: "ai",
      cohortSize: "4 Nəfərlik Qrup",
      ageRange: "14-17 və 18+",
      lessonsCount: 12,
      price: 140,
      originalPrice: 280,
      discountBadge: "50% Qrup Bursu",
      specialBadge: "Alovlu Qrup • 1 yer qalıb",
      badgeType: "hot",
      rating: 4.98,
      reviewsCount: "142",
      image: "assets/courses/course-1.jpg",
      instructor: "Dr. Rəşad Əliyev",
      instructorBadge: "Stanford AI Sertifikatlı",
      schedule: "Hər Çərşənbə və Şənbə, 18:00",
      primaryButton: true,
      subjectId: "ai-python"
    },
    {
      id: "c2",
      title: "Fullstack Veb: Sıfırdan Real Portfel və React Tətbiqləri",
      category: "Veb Proqramlaşdırma",
      categoryKey: "web",
      cohortSize: "5 Nəfərlik Qrup",
      ageRange: "15-20 və 18+",
      lessonsCount: 16,
      price: 120,
      originalPrice: 240,
      discountBadge: "50% Qrup Bursu",
      specialBadge: "Ən Populyar",
      badgeType: "popular",
      rating: 4.95,
      reviewsCount: "98",
      image: "assets/courses/course-5.jpg",
      instructor: "Leyla Qasımova",
      instructorBadge: "Keçmiş EPAM Mühəndisi",
      schedule: "Hər Bazar ertəsi və Cümə axşamı, 19:00",
      primaryButton: false,
      subjectId: "web-dev"
    },
    {
      id: "c3",
      title: "İngilis Dili: Canlı Qrup Debatları və Qorxusuz Danışıq",
      category: "Xarici Dillər",
      categoryKey: "languages",
      cohortSize: "4 Nəfərlik Qrup",
      ageRange: "Bütün yaşlar",
      lessonsCount: 12,
      price: 100,
      originalPrice: 200,
      discountBadge: "50% Qrup Bursu",
      specialBadge: "Danışıq Zəmanətli",
      badgeType: "speaking",
      rating: 4.96,
      reviewsCount: "210",
      image: "assets/courses/course-2.jpg",
      instructor: "Cavid Məmmədov",
      instructorBadge: "Cambridge CELTA Baş Təlimçi",
      schedule: "Hər Çərşənbə və Şənbə, 17:30",
      primaryButton: false,
      subjectId: "ielts-speaking"
    },
    {
      id: "c4",
      title: "Gənc Kodçular üçün Scratch, Məntiq və Robototexnika",
      category: "Gənc STEM",
      categoryKey: "kids",
      cohortSize: "4 Nəfərlik Qrup",
      ageRange: "8-14 yaş (<18 Qoruma)",
      lessonsCount: 10,
      price: 90,
      originalPrice: 180,
      discountBadge: "50% Qrup Bursu",
      specialBadge: "Valideyn Qorumalı",
      badgeType: "kids",
      rating: 4.99,
      reviewsCount: "185",
      image: "assets/courses/course-3.jpg",
      instructor: "Nərgiz Həsənova",
      instructorBadge: "Uşaq Pedaqogikası Akkreditə",
      schedule: "Hər Şənbə və Bazar, 11:00",
      primaryButton: false,
      subjectId: "kids-scratch"
    },
    {
      id: "c5",
      title: "Tətbiqi Riyaziyyat, Analitik Məntiq və Problem Həlli",
      category: "Dəqiq Elmlər",
      categoryKey: "math",
      cohortSize: "4 Nəfərlik Qrup",
      ageRange: "13-17 və 18+",
      lessonsCount: 14,
      price: 110,
      originalPrice: 220,
      discountBadge: "50% Qrup Bursu",
      specialBadge: "Olimpiada Metodu",
      badgeType: "math",
      rating: 4.92,
      reviewsCount: "77",
      image: "assets/courses/course-4.jpg",
      instructor: "Tural Kərimli",
      instructorBadge: "Olimpiada Təlimçisi",
      schedule: "Hər Həftəsonu, 14:00",
      primaryButton: false,
      subjectId: "math-logic"
    },
    {
      id: "c6",
      title: "DİM 11-ci Sinif Buraxılış Qızıl Kohortu (270+ Bal Hədəfli)",
      category: "DİM Abituriyent",
      categoryKey: "dim",
      cohortSize: "4 Nəfərlik Qrup",
      ageRange: "16-17 yaş (Abituriyent)",
      lessonsCount: 24,
      price: 130,
      originalPrice: 260,
      discountBadge: "50% Qrup Bursu",
      specialBadge: "270+ Bal Hədəfli",
      badgeType: "dim",
      rating: 4.99,
      reviewsCount: "312",
      image: "assets/courses/course-6.jpg",
      instructor: "Aynur Məhərrəmova",
      instructorBadge: "16 il DİM Baş Eksperti",
      schedule: "Hər Çərşənbə və Şənbə, 16:30",
      primaryButton: false,
      subjectId: "dim-buraxilis-11"
    }
  ],

  // Subjects available for matchmaking
  subjects: [
    {
      id: "ai-python",
      title: "Süni İntellekt və Python",
      category: "Texnologiya & AI",
      icon: "🤖",
      suitableAges: "13-17 və 18+",
      defaultMentor: "m1",
      description: "Python əsasları, neyron şəbəkələr və ChatGPT tipli AI modellərinin iş prinsipi canlı qrup dərslərində."
    },
    {
      id: "web-dev",
      title: "Fullstack Veb və Tətbiq Hazırlanması",
      category: "Texnologiya & Proqramlaşdırma",
      icon: "🌐",
      suitableAges: "14-18 və 18+",
      defaultMentor: "m2",
      description: "HTML, CSS, JavaScript və müasir çərçivələrlə real layihələr hazırlayaraq portfel yaradın."
    },
    {
      id: "ielts-speaking",
      title: "İngilis Dili və Canlı Qrup Debatları",
      category: "Xarici Dillər",
      icon: "🗣️",
      suitableAges: "Bütün yaşlar (8-14, 15-18, 18+)",
      defaultMentor: "m3",
      description: "Canlı kiçik qruplarda fasiləsiz ingilis dili danışıq təcrübəsi, tələffüz və müzakirələr."
    },
    {
      id: "kids-scratch",
      title: "Gənc İxtiraçılar üçün Scratch & Kodlama",
      category: "Uşaqlar üçün STEM",
      icon: "🎮",
      suitableAges: "8-14 yaş (Valideyn qoruması ilə)",
      defaultMentor: "m4",
      description: "Oyunlar, animasiyalar və məntiq quraşdırmaqla proqramlaşdırmanın əsaslarını dərk edin."
    },
    {
      id: "math-logic",
      title: "Tətbiqi Məntiq və Riyazi Düşüncə",
      category: "Dəqiq Elmlər",
      icon: "📐",
      suitableAges: "12-16 və 17+",
      defaultMentor: "m5",
      description: "Praktiki həyat nümunələri ilə riyazi düşüncə və analitik problem həlli vərdişləri."
    },
    {
      id: "dim-buraxilis-11",
      title: "DİM Buraxılış İmtahanı (11-ci Sinif)",
      category: "Abituriyent & Qəbul İmtahanları",
      icon: "🎯",
      suitableAges: "15-18 yaş",
      defaultMentor: "m6",
      description: "Ana dili (mətn təhlili), Riyaziyyat və İngilis dili fənləri üzrə DİM standartlı 260+ bal hədəfli canlı 4 nəfərlik intensiv hazırlıq."
    },
    {
      id: "dim-buraxilis-9",
      title: "DİM 9-cu Sinif Buraxılış İmtahanı",
      category: "Abituriyent & Qəbul İmtahanları",
      icon: "📚",
      suitableAges: "14-16 yaş",
      defaultMentor: "m6",
      description: "Kolleclərə qəbul və tam orta təhsil bazası üzrə zəmanətli sınaq və mövzu dərsləri."
    },
    {
      id: "dim-blok-1",
      title: "I Qrup Blok İmtahanı (Riyaziyyat & Fizika / İnformatika)",
      category: "Abituriyent & Qəbul İmtahanları",
      icon: "📐",
      suitableAges: "16-18 yaş",
      defaultMentor: "m7",
      description: "Mühəndislik və İT ixtisasları üçün dərin riyazi və texniki qəbul məsələləri."
    },
    {
      id: "dim-blok-3",
      title: "III Qrup Blok İmtahanı (Tarix, Ədəbiyyat, Ana Dili)",
      category: "Abituriyent & Qəbul İmtahanları",
      icon: "📜",
      suitableAges: "16-18 yaş",
      defaultMentor: "m6",
      description: "Hüquq, beynəlxalq münasibətlər və filologiya üzrə DİM qəbul proqramı."
    }
  ],

  // Active Cohorts (Groups)
  cohorts: [
    {
      id: "cohort-dim-11",
      name: "DİM 11 Buraxılış Qızıl Kohortu [270+ Bal Hədəfli]",
      subjectId: "dim-buraxilis-11",
      mentorId: "m6",
      ageRange: "16-17 yaş",
      isMinor: true,
      maxSeats: 4,
      enrolledStudents: [
        { name: "Cəmil Əhmədov", age: 16, avatar: "👦", progress: 92 },
        { name: "Nəzrin Məmmədova", age: 16, avatar: "👧", progress: 95 },
        { name: "Tunar Həsənli", age: 17, avatar: "👦", progress: 88 }
      ],
      schedule: "Hər Çərşənbə və Şənbə, 17:30 - 19:00",
      lessonCount: 24,
      currentLesson: 14,
      status: "DİM Sınaq və Mətn Təhlili Mərhələsi",
      safetyStatus: "Valideyn İmtahan Nəzarəti Aktivdir"
    },
    {
      id: "cohort-ai-teen",
      name: "AI Qığılcımı (Yeniyetmələr Qrupu)",
      subjectId: "ai-python",
      mentorId: "m1",
      ageRange: "14-17 yaş",
      isMinor: true,
      maxSeats: 5,
      enrolledStudents: [
        { name: "Ayan Məmmədli", age: 15, avatar: "👧", progress: 85 },
        { name: "Orxan Quliyev", age: 16, avatar: "👦", progress: 90 },
        { name: "Fidan Əlizadə", age: 15, avatar: "👧", progress: 78 },
        { name: "Murad Səfərov", age: 14, avatar: "👦", progress: 92 }
      ],
      schedule: "Hər Çərşənbə axşamı və Cümə, 18:00 - 19:15",
      lessonCount: 12,
      currentLesson: 8,
      status: "Canlı dərslər davam edir",
      safetyStatus: "Yüksək Təhlükəsizlik və Valideyn Nəzarəti Aktivdir"
    },
    {
      id: "cohort-web-adult",
      name: "React & Next.js İntensiv Qrupu",
      subjectId: "web-dev",
      mentorId: "m2",
      ageRange: "18+ yaş",
      isMinor: false,
      maxSeats: 6,
      enrolledStudents: [
        { name: "Kamran Nəcəfov", age: 24, avatar: "👨", progress: 92 },
        { name: "Nigar Vəliyeva", age: 22, avatar: "👩", progress: 88 },
        { name: "Elvin Babayev", age: 27, avatar: "👨", progress: 84 },
        { name: "Sevinc Qasımzadə", age: 20, avatar: "👩", progress: 95 }
      ],
      schedule: "Hər Bazar ertəsi və Cümə axşamı, 20:00 - 21:30",
      lessonCount: 16,
      currentLesson: 11,
      status: "Praktik layihə mərhələsində",
      safetyStatus: "Standart Böyük Təhlükəsizlik Protokolu"
    },
    {
      id: "cohort-ielts-adv",
      name: "IELTS 7.5+ Danışıq & Qrup Debatı",
      subjectId: "ielts-speaking",
      mentorId: "m3",
      ageRange: "16+ yaş",
      isMinor: false,
      maxSeats: 5,
      enrolledStudents: [
        { name: "Rauf Həsənli", age: 19, avatar: "👨", progress: 94 },
        { name: "Aydan Əhmədova", age: 17, avatar: "👧", progress: 90 },
        { name: "Nicat Tağıyev", age: 21, avatar: "👨", progress: 89 },
        { name: "Günay İsmayılova", age: 18, avatar: "👩", progress: 92 }
      ],
      schedule: "Hər Şənbə və Bazar, 16:00 - 17:30",
      lessonCount: 10,
      currentLesson: 7,
      status: "Debat mərhələsi",
      safetyStatus: "Aktiv moderator nəzarətində"
    }
  ],

  // Assessments Database: Quizzes, Practical Tasks, Final Exams
  assessments: {
    "ai-python": {
      quiz: [
        {
          question: "Python-da maşın öyrənməsi üçün ən çox istifadə olunan daxili massiv/riyaziyyat kitabxanası hansıdır?",
          options: ["NumPy", "Tkinter", "Turtle", "Flask"],
          correct: 0,
          explanation: "NumPy yüksək performanslı çoxölçülü massivlər və riyazi hesablamalar üçün təməl kitabxanadır."
        },
        {
          question: "Süni İntellektdə 'Supervised Learning' (Nəzarətli Öyrənmə) nəyi ifadə edir?",
          options: [
            "Modelin heç bir etiket və cavab olmadan öz-özünə qruplaşdırma aparması",
            "Modelin etiketlənmiş daxiledici və doğru çıxış məlumatları əsasında öyrədilməsi",
            "Müəllimin dərs zamanı kompüterin arxasında oturub ekrana baxması",
            "Yalnız internet bağlantısı ilə işləyən alqoritm növü"
          ],
          correct: 1,
          explanation: "Nəzarətli öyrənmədə verilənlər dəsti 'giriş -> doğru cavab' (etiket) cütlükləri ilə təchiz olunur."
        },
        {
          question: "MindBridge AI Matchmaker alqoritmi qrupları formalaşdırarkən hansı əsas amilləri nəzərə alır?",
          options: [
            "Tələbənin saç rəngi və telefon markası",
            "Bilik səviyyəsi, yaş aralığı, öyrənmə sürəti və uyğun qrafik",
            "Yalnız qeydiyyatdan keçmə saatı",
            "Təsadüfi püşkatma"
          ],
          correct: 1,
          explanation: "AI Matchmaker hər tələbənin fərdi bilik dərəcəsi, maraqları və yaş uyğunluğunu analiz edərək optimal kohort yaradır."
        },
        {
          question: "18 yaşdan kiçik şagirdlərin dərs qruplarında hansı qoruma mexanizmi məcburidir?",
          options: [
            "Heç bir qoruma tələb olunmur",
            "Valideyn razılığı, AI söhbət monitorinqi və xüsusi valideyn paneli",
            "Kameranın hər zaman bağlı qalması",
            "Yalnız gecə saatlarında dərslərin keçirilməsi"
          ],
          correct: 1,
          explanation: "18 yaşdan aşağılar üçün MindBridge valideyn təsdiqi və AI təhlükəsizlik filtrini məcburi tətbiq edir."
        }
      ],
      practicalTask: {
        title: "Praktik Tapşırıq: Sadə AI Qərar Mexanizmi və Qrup Bölüşdürücüsü",
        description: "Aşağıdakı mühitdə tələbənin yaşına və marağına əsasən uyğun dərsi və qrupu təyin edən Python/JavaScript funksiyası yazın və ya tamamlayın.",
        initialCode: `// MindBridge Tələbə Qruplaşdırıcı Alqoritmi
function assignCohort(student) {
  // student: { name: string, age: number, interest: string, level: string }
  
  if (student.age < 18) {
    // 18 yaş altı qoruma rejimi: Valideyn paneli ilə əlaqələndir
    return {
      status: "Uşaq Qoruma Rejimi Aktiv",
      cohort: student.interest + " (Yeniyetmə Kohortu)",
      parentConsentRequired: true,
      verifiedMentorAssigned: true
    };
  } else {
    // 18+ Qrup
    return {
      status: "Standart Rejim",
      cohort: student.interest + " (Böyüklər Kohortu)",
      parentConsentRequired: false,
      verifiedMentorAssigned: true
    };
  }
}

// Test edin:
console.log(assignCohort({ name: "Cəmil", age: 16, interest: "AI", level: "Başlanğıc" }));`,
        expectedKeywords: ["parentConsentRequired", "cohort", "verifiedMentorAssigned"]
      },
      finalExam: [
        {
          question: "Model overfitting (həddindən artıq uyğunlaşma) etdikdə hansı vəziyyət yaranır?",
          options: [
            "Model təlim məlumatlarını əla əzbərləyir, lakin yeni test məlumatlarında səhvlər edir",
            "Model həm təlim, həm də test verilənlərində çox zəif nəticə göstərir",
            "Kompüterin yaddaşı dərhal tükənir və sönür",
            "Model insan şüuruna sahib olur"
          ],
          correct: 0
        },
        {
          question: "Bir qrup dərsinin effektiv olmasında canlı ekspertin və kiçik kohortun (4-6 nəfər) əsas üstünlüyü nədir?",
          options: [
            "Hər bir tələbəyə fərdi diqqət ayrılması, canlı rəy və komanda ruhunun yaranması",
            "Dərsin daha gec başlaması",
            "Heç bir ev tapşırığının verilməməsi",
            "Müəllimin yalnız video göstərib danışmaması"
          ],
          correct: 0
        },
        {
          question: "MindBridge platformasında sertifikat əldə etmək üçün tələbədən nə tələb olunur?",
          options: [
            "Yalnız qeydiyyatdan keçmək",
            "Quizlər, praktik tapşırıq və yekun imtahanı uğurla (min. 70%) tamamlamaq",
            "Müəllimə rüşvət vermək",
            "Dərslərdə yalnız kameranı bağlayıb qulaq asmaq"
          ],
          correct: 1
        },
        {
          question: "Uşaqların canlı dərslərdə şəxsi məlumatlarını (ev ünvanı, telefon nömrəsi) paylaşmasının qarşısını nə alır?",
          options: [
            "MindBridge AI Content Safety Filter və moderator xəbərdarlıq sistemi",
            "İnternet provayderi",
            "Brauzerin tarixi",
            "Kompüterin ekran parlaqlığı"
          ],
          correct: 0
        }
      ]
    },

    "dim-buraxilis-11": {
      quiz: [
        {
          question: "Azərbaycan dili: Mətndəki kontekstə əsasən 'təxirəsalınmaz tədbirlər' ifadəsinin ən yaxın sinonimi hansıdır?",
          options: [
            "Təcili və gecikdirilməsi yolverilməz addımlar",
            "Planlaşdırılmış növbəti tədbirlər",
            "Mübahisəli və qeyri-müəyyən qərarlar",
            "Gələcəkdə icrası nəzərdə tutulan işlər"
          ],
          correct: 0,
          explanation: "DİM mətn testlərində 'təxirəsalınmaz' sözü birbaşa 'təcili, təxirə salınması mümkün olmayan' mənasında işlənir."
        },
        {
          question: "Riyaziyyat: Düzbucaqlı üçbucağın katetləri 6 sm və 8 sm-dir. Bu üçbucağın daxilinə çəkilmiş çevrənin radiusunu (r) tapın.",
          options: ["2 sm", "3 sm", "4 sm", "5 sm"],
          correct: 0,
          explanation: "Pifaqor teoremi ilə hipotenuz c = √(6² + 8²) = 10 sm. Daxilə çəkilmiş çevrənin radiusu: r = (a + b - c) / 2 = (6 + 8 - 10) / 2 = 2 sm."
        },
        {
          question: "İngilis dili: Choose the correct Passive Voice: 'The examination board announced the official results yesterday.'",
          options: [
            "The official results were announced by the examination board yesterday.",
            "The official results have been announced yesterday.",
            "The examination board was announced by results.",
            "The official results had announced yesterday."
          ],
          correct: 0,
          explanation: "Keçmiş sadə zamanda (Past Simple) məchul növ 'was/were + V3' düyməsi ilə düzəlir: 'were announced'."
        },
        {
          question: "DİM Qaydası: 11-ci sinif Buraxılış imtahanında hər 3 fənn (Ana dili, Riyaziyyat, Xarici dil) üzrə maksimum toplanıla biləcək cəmi bal nə qədərdir?",
          options: ["300 bal (hər fəndən 100 bal)", "200 bal", "700 bal", "100 bal"],
          correct: 0,
          explanation: "Dövlət İmtahan Mərkəzinin qaydalarına əsasən Buraxılış imtahanında 3 fənnin hər biri 100 bal, ümumi maksimum nəticə isə 300 bal təşkil edir."
        }
      ],
      practicalTask: {
        title: "DİM Praktik Tapşırıq: Açıq Tipli Riyazi Həll və Esse Strukturu",
        description: "Aşağıdakı riyazi situasiya məsələsinin ardıcıl həll addımlarını və ya arqumentativ esse tezisini tərtib edin:",
        initialCode: `// DİM Buraxılış Riyaziyyat & Situasiya Modeli
// Məsələ: Qutuda 12 ağ və 8 qara kürəcik var. 
// Təsadüfən çıxarılan 2 kürəciyin hər ikisinin ağ olması ehtimalını tapın.

function solveProbability(whiteCount, blackCount) {
  const total = whiteCount + blackCount; // 20
  
  // Kombinezon və ya ardıcıl ehtimal: P = (12/20) * (11/19)
  const p1 = whiteCount / total;
  const p2 = (whiteCount - 1) / (total - 1);
  const result = p1 * p2;
  
  return {
    umumiSuret: 12 * 11, // 132
    umumiMexrec: 20 * 19, // 380
    ixtisarNeticasi: "33 / 95",
    onluqKesr: result.toFixed(4),
    dimBalQiymeti: "2 / 2 Tam Bal (Açıq tipli sual meylinə uyğun)"
  };
}

console.log(solveProbability(12, 8));`,
        expectedKeywords: ["solveProbability", "dimBalQiymeti", "33 / 95"]
      },
      finalExam: [
        {
          question: "Mürəkkəb cümlənin hansı növündə tərəflər yalnız intonasiya ilə əlaqələnir?",
          options: [
            "Tabesiz mürəkkəb cümlə (bağlayıcısız)",
            "Tabeli mürəkkəb cümlə",
            "Vasitəsiz nitqli cümlə",
            "Yalnız sual cümləsi"
          ],
          correct: 0
        },
        {
          question: "Riyaziyyat: 2^(x+1) + 2^x = 24 tənliyini həll edin.",
          options: ["x = 3", "x = 4", "x = 2", "x = 5"],
          correct: 0
        },
        {
          question: "İngilis dili: If you ... hard, you will achieve 270+ score in the final graduation exam.",
          options: ["study", "will study", "studied", "had studied"],
          correct: 0
        },
        {
          question: "Abituriyentin DİM sınaqlarında balının stabil artmasında 4 nəfərlik canlı kohort dərsinin əsas rolu nədir?",
          options: [
            "Səhvlərin dərhal yoxlanması, vaxt idarəçiliyi və yoxlanmış ekspertlə fərdi sual-cavab",
            "Yalnız evdə təkbaşına test əzbərləmək",
            "İmtahana 1 gün qalmış oxumaq",
            "Heç bir sınaq yazmamaq"
          ],
          correct: 0
        }
      ]
    }
  },

  // Sample Parent Dashboard data for under-18 demo
  parentControl: {
    studentName: "Orxan Quliyev",
    studentAge: 16,
    parentName: "Sevda Quliyeva (Ana)",
    parentEmail: "sevda.quliyeva@example.com",
    parentPhone: "+994 50 234 56 78",
    consentSigned: true,
    consentDate: "2026-09-15",
    dailyScreenLimitMinutes: 120,
    usedMinutesToday: 45,
    attendanceRate: 98,
    activeCourse: "DİM Buraxılış İmtahanı (11-ci Sinif) & AI",
    verifiedMentor: "Aynur Məhərrəmova (DİM Eksperti)",
    targetDimScore: 275,
    currentDimScore: 254,
    dimTrials: [
      { title: "DİM Sınaq #1 (Diaqnostik)", score: "192 / 300", date: "15 Sentyabr", status: "Baza səviyyə" },
      { title: "DİM Sınaq #2 (Mövzu Sınağı)", score: "228 / 300", date: "28 Sentyabr", status: "+36 bal artım" },
      { title: "DİM Sınaq #3 (Ümumi Buraxılış)", score: "254 / 300", date: "5 Oktyabr", status: "+26 bal artım (Hədəfə yaxın)" }
    ],
    safetyLogs: [
      {
        time: "Bugün, 18:05",
        type: "info",
        message: "Dərsə qoşulma qeydə alındı. Yoxlanmış DİM eksperti Aynur Məhərrəmova dərsi aparır."
      },
      {
        time: "Bugün, 18:24",
        type: "success",
        message: "AI Çat Təhlükəsizlik Monitoru: Bütün mesajlar filtrləndi, heç bir kənar əlaqə və ya arzuolunmaz söz aşkar edilmədi."
      },
      {
        time: "Bugün, 18:40",
        type: "success",
        message: "İnteraktiv lövhədə DİM mətn təhlili tapşırığı birgə icra olundu. Şagirdin fəallıq balı: 95%."
      },
      {
        time: "Dünən, 19:10",
        type: "shield",
        message: "Şəxsi məlumat qoruyucusu: Çatda telefon/ünvan mübadiləsi bloklandı və bildiriş göndərildi."
      }
    ],
    homeworkReports: [
      { task: "DİM 11 Buraxılış Mətn Təhlili", score: "98 / 100", mentorFeedback: "Mətnin ideya və üslubi xüsusiyyətlərini qüsursuz izah etdi." },
      { task: "Situasiya Riyaziyyat Məsələləri", score: "94 / 100", mentorFeedback: "Həll addımları tam DİM meyarlarına uyğundur." }
    ]
  }
};
