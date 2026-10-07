export const initialSeedData = {
  settings: {
    instituteName: "Pacific Marine Academy",
    tagline: "Eccellenza Marittima • Merchant Navy Entrance Coaching Institute",
    phonePrimary: "+91 98765 43210",
    phoneSecondary: "+91 98765 43211",
    whatsapp: "+91 98765 43210",
    email: "admissions@pacificmarine.edu.in",
    address: "Naval Harbour Road, Sector 15, Vashi, Navi Mumbai, Maharashtra 400703",
    mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3770.7876800722374!2d73.00030587588383!3d19.073083352061266!2m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c13400000001%3A0x6333333333333333!2sNavi%20Mumbai!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin",
    socialLinks: {
      facebook: "https://facebook.com/pacificmarineacademy",
      instagram: "https://instagram.com/pacificmarineacademy",
      youtube: "https://youtube.com/c/pacificmarineacademy",
      linkedin: "https://linkedin.com/company/pacificmarineacademy"
    },
    heroHeading: "Steer Your Future Towards High Seas Glory",
    heroSubheading: "India's premier Merchant Navy entrance coaching institute. Comprehensive preparation for IMU-CET, DNS, G.P. Rating, Deck & Engine Cadet sponsorships with 98.4% selection rate.",
    stats: {
      studentsTrained: 5400,
      selections: 5120,
      yearsExperience: 16,
      partnerSponsors: 34
    }
  },
  banners: {
    admissionOpen: true,
    bannerText: "⚓ Admissions Open for 2026-27 Merchant Navy Batches! Limited Seats Available • Free Counselling Available",
    secondaryNotice: "IMU-CET Special Crash Course Batch Starting 15th Of Next Month. Register Now!"
  },
  courses: [
    {
      id: "course-1",
      title: "IMU-CET Ranker Prep Course",
      category: "Entrance Exam",
      duration: "6 Months",
      mode: "Offline & Online Hybrid",
      fee: "₹48,000",
      featured: true,
      description: "Complete preparation for Indian Maritime University Common Entrance Test (IMU-CET). Covers Mathematics, Physics, Chemistry, English, and General Aptitude with weekly Mock Tests.",
      eligibility: "10+2 with PCM (min 60%) and English (min 50%)",
      targetExam: "IMU-CET Aug / Dec Cycles",
      badge: "Best Seller",
      syllabus: [
        "Physics: Mechanics, Thermodynamics, Waves & Electromagnetism",
        "Mathematics: Calculus, Algebra, Vectors & Coordinate Geometry",
        "Chemistry: Physical, Organic & Inorganic Chemistry",
        "English Communication & Nautical Vocabulary",
        "General Knowledge, Maritime Awareness & Logical Reasoning",
        "15 Full-length Computer Based Mock Exams (CBT Pattern)"
      ]
    },
    {
      id: "course-2",
      title: "DNS & Sponsorship Exam Coaching",
      category: "Deck Cadets",
      duration: "4 Months",
      mode: "Regular Classroom / Residential",
      fee: "₹55,000",
      featured: true,
      description: "Dedicated coaching for Shipping Company Sponsorship tests (Anglo-Eastern, Synergy, Fleet Management, Great Eastern, MSC, Executive Ship Management).",
      eligibility: "10+2 PCM Passed / Appearing (Max age 21 years)",
      targetExam: "Company Sponsorship Exams & Interviews",
      badge: "100% Sponsorship Guidance",
      syllabus: [
        "Company-specific Psychometric Test Preparation",
        "Technical Deck Knowledge & Aptitude",
        "Personal Interview Training with Retired Master Mariners",
        "DG Shipping Medical Guidance & Sight Standard Checks",
        "Group Discussion & Maritime Technical Viva"
      ]
    },
    {
      id: "course-3",
      title: "G.P. Rating Entrance & Foundation",
      category: "Pre-Sea Training",
      duration: "3 Months",
      mode: "Offline",
      fee: "₹35,000",
      featured: false,
      description: "Foundation preparation for General Purpose Rating (G.P. Rating) pre-sea training entry in top D.G. Shipping approved academies.",
      eligibility: "10th Pass with 40% aggregate and 40% in English",
      targetExam: "GP Rating Entrance & Medical Standard Prep",
      badge: "Job Oriented",
      syllabus: [
        "Basic Navigation & Seamanship Fundamentals",
        "Marine Engine Room Workshop Basics",
        "English Oral & Written Communication",
        "Physical Fitness & Swimming Guidance"
      ]
    },
    {
      id: "course-4",
      title: "Engine Cadet (B.Tech Marine Engineering Prep)",
      category: "Engine Cadets",
      duration: "6 Months",
      mode: "Offline / Online",
      fee: "₹50,000",
      featured: false,
      description: "Specialized coaching for marine engineering entrance examinations, thermodynamics, mechanical engineering basics, and sponsorship interview rounds.",
      eligibility: "10+2 PCM (min 60%) or Diploma in Mech/Elec Engg",
      targetExam: "IMU-CET Marine Engg Entrance & Company Sponsorships",
      badge: "High Demand",
      syllabus: [
        "Applied Mechanics & Fluid Dynamics",
        "Marine Diesel Engines & Auxiliary Machinery Basics",
        "Physics & Mathematics Deep Dive",
        "Sponsorship Interview Viva Preparation"
      ]
    },
    {
      id: "course-5",
      title: "IMU-CET Super Fast Crash Course",
      category: "Crash Course",
      duration: "45 Days",
      mode: "Intensive Classroom",
      fee: "₹28,000",
      featured: true,
      description: "High-intensity revision batch designed for students taking the upcoming IMU-CET exam. Includes daily 6 hours of classes, 5000+ MCQs, and topic tests.",
      eligibility: "10+2 PCM Passed/Appearing",
      targetExam: "Immediate Upcoming IMU-CET",
      badge: "Fast Track",
      syllabus: [
        "Rapid revision of 11th & 12th PCM topics",
        "Shortcut methods & formula handbooks",
        "Daily practice papers (DPP) & speed tests",
        "Complete English & Aptitude practice"
      ]
    }
  ],
  toppers: [
    {
      id: "top-1",
      name: "Rohan V. Sharma",
      rank: "AIR 04",
      score: "192 / 200",
      selection: "Anglo-Eastern Sponsorship & IMU Navi Mumbai",
      batch: "2025 Batch",
      year: "2025",
      photo: "RS",
      color: "bg-terracotta",
      quote: "Pacific Marine Academy gave me the exact Blueprint to crack Anglo-Eastern sponsorship on my first attempt!"
    },
    {
      id: "top-2",
      name: "Aditya K. Deshmukh",
      rank: "AIR 11",
      score: "188 / 200",
      selection: "Synergy Marine DNS Sponsorship",
      batch: "2025 Batch",
      year: "2025",
      photo: "AD",
      color: "bg-sea-blue",
      quote: "The mock interview sessions with Master Mariners made real sponsorship interviews feel so easy."
    },
    {
      id: "top-3",
      name: "Preeti R. Nair",
      rank: "AIR 19",
      score: "184 / 200",
      selection: "Fleet Management Sponsorship & IMU Chennai",
      batch: "2025 Batch",
      year: "2025",
      photo: "PN",
      color: "bg-seagreen",
      quote: "Outstanding faculty, rigorous test series, and constant motivation from Captain Instructors!"
    },
    {
      id: "top-4",
      name: "Vikramjit Singh",
      rank: "AIR 27",
      score: "181 / 200",
      selection: "Great Eastern Shipping DNS",
      batch: "2024 Batch",
      year: "2024",
      photo: "VS",
      color: "bg-gold",
      quote: "The best Merchant Navy coaching in India hands down. Clear concepts and great hostel environment."
    },
    {
      id: "top-5",
      name: "Siddharth Verma",
      rank: "AIR 35",
      score: "178 / 200",
      selection: "MSC Crewing Sponsorship",
      batch: "2024 Batch",
      year: "2024",
      photo: "SV",
      color: "bg-navy-light",
      quote: "Studying here turned my dream of sailing the world into reality. Grateful to the entire PMA team!"
    }
  ],
  results: [
    { id: "res-101", rollNo: "PMA2025001", name: "Rohan V. Sharma", exam: "IMU-CET 2025", score: "192/200", rank: "AIR 04", status: "Selected (Anglo-Eastern)", year: "2025" },
    { id: "res-102", rollNo: "PMA2025002", name: "Aditya K. Deshmukh", exam: "IMU-CET 2025", score: "188/200", rank: "AIR 11", status: "Selected (Synergy Marine)", year: "2025" },
    { id: "res-103", rollNo: "PMA2025003", name: "Preeti R. Nair", exam: "IMU-CET 2025", score: "184/200", rank: "AIR 19", status: "Selected (Fleet Management)", year: "2025" },
    { id: "res-104", rollNo: "PMA2025004", name: "Karan Johar", exam: "IMU-CET 2025", score: "176/200", rank: "AIR 42", status: "Selected (Executive Ship)", year: "2025" },
    { id: "res-105", rollNo: "PMA2025005", name: "Ananya Roy", exam: "IMU-CET 2025", score: "172/200", rank: "AIR 58", status: "Selected (Seven Islands)", year: "2025" },
    { id: "res-106", rollNo: "PMA2024012", name: "Vikramjit Singh", exam: "IMU-CET 2024", score: "181/200", rank: "AIR 27", status: "Selected (Great Eastern)", year: "2024" },
    { id: "res-107", rollNo: "PMA2024018", name: "Siddharth Verma", exam: "IMU-CET 2024", score: "178/200", rank: "AIR 35", status: "Selected (MSC Shipping)", year: "2024" },
    { id: "res-108", rollNo: "PMA2024025", name: "Harpreet Kaur", exam: "IMU-CET 2024", score: "170/200", rank: "AIR 64", status: "Selected (TORM Shipping)", year: "2024" },
    { id: "res-109", rollNo: "PMA2023009", name: "Manish Kumar", exam: "IMU-CET 2023", score: "185/200", rank: "AIR 15", status: "Selected (Anglo-Eastern)", year: "2023" },
    { id: "res-110", rollNo: "PMA2023021", name: "Rahul S. Patil", exam: "IMU-CET 2023", score: "179/200", rank: "AIR 31", status: "Selected (Bernhard Schulte)", year: "2023" }
  ],
  faculty: [
    {
      id: "fac-1",
      name: "Capt. Rajeshwar S. Salunkhe",
      role: "Director & Principal Instructor",
      qualification: "Master Mariner (FG), 22 Years at Sea",
      specialization: "Ship Navigation, Seamanship & Sponsorship Interviews",
      image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=800&q=80",
      experience: "14+ Years Teaching"
    },
    {
      id: "fac-2",
      name: "Chief Engr. Arvind Mehta",
      role: "Head of Marine Engineering",
      qualification: "Class 1 Marine Engineer (MEO Class 1)",
      specialization: "Marine Heat Engines, Auxiliaries & Mechanical Viva",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
      experience: "18 Years Sea + 10 Years Teaching"
    },
    {
      id: "fac-3",
      name: "Prof. Sunita R. Rao",
      role: "Senior Physics & Aptitude Mentor",
      qualification: "M.Sc. Physics (IIT Bombay)",
      specialization: "IMU-CET Physics, Kinematics & CBT Mock Analysis",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80",
      experience: "12 Years Teaching"
    },
    {
      id: "fac-4",
      name: "Prof. Devendra Joshi",
      role: "Mathematics & Reasoning Specialist",
      qualification: "M.Sc. Mathematics (Gold Medalist)",
      specialization: "Calculus, Vectors, Probability & Speed Math Tricks",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80",
      experience: "11 Years Teaching"
    }
  ],
  studyMaterials: [
    {
      id: "sm-1",
      title: "IMU-CET Mathematics Formula & Shortcut Handbook 2026",
      category: "Notes",
      type: "PDF Document",
      size: "4.8 MB",
      downloadUrl: "#download-formula-book",
      previewText: "Comprehensive formula sheet covering Calculus, 3D Geometry, Algebra, and Probability with solved shortcut tricks for IMU-CET.",
      downloadsCount: 1420
    },
    {
      id: "sm-2",
      title: "IMU-CET 10 Previous Years Solved Question Papers (2015-2025)",
      category: "Previous Papers",
      type: "PDF Document",
      size: "12.4 MB",
      downloadUrl: "#download-past-papers",
      previewText: "Authentic past entrance exam paper questions with step-by-step solutions and answer keys.",
      downloadsCount: 3250
    },
    {
      id: "sm-3",
      title: "Shipping Sponsorship Technical Interview Viva Questions & Answers",
      category: "Notes",
      type: "PDF Document",
      size: "3.2 MB",
      downloadUrl: "#download-interview-guide",
      previewText: "Top 150 nautical and engineering viva questions asked by Anglo-Eastern, Synergy, Fleet, and ESM selection boards.",
      downloadsCount: 2890
    },
    {
      id: "sm-4",
      title: "Complete Merchant Navy General Aptitude & English Practice Workbook",
      category: "Practice Sets",
      type: "PDF Document",
      size: "6.1 MB",
      downloadUrl: "#download-aptitude-set",
      previewText: "Over 800+ solved practice MCQs covering maritime terminology, grammar, comprehension, and spatial reasoning.",
      downloadsCount: 1980
    },
    {
      id: "sm-5",
      title: "Physics Mechanics & Electromagnetism Concept Lecture Series",
      category: "Videos",
      type: "Video Lecture",
      size: "YouTube Embed",
      downloadUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      previewText: "Full video lecture on Newton's laws of motion applied to naval vessels and fluid mechanics for IMU-CET.",
      downloadsCount: 4500
    }
  ],
  availableForms: [
    {
      id: "form-1",
      title: "Pacific Marine Academy Official Admission Application Form (2026-27)",
      category: "Admission",
      fileType: "PDF",
      fileSize: "1.2 MB",
      updateDate: "Jan 2026",
      description: "Printable offline application form for classroom batch registration."
    },
    {
      id: "form-2",
      title: "DG Shipping Standard Medical Examination Format (Annexure IV)",
      category: "Medical",
      fileType: "PDF",
      fileSize: "850 KB",
      updateDate: "Dec 2025",
      description: "Official medical fitness certificate template to be certified by a DG Shipping approved doctor."
    },
    {
      id: "form-3",
      title: "Merit-Cum-Means Scholarship & Fee Concession Request Form",
      category: "Scholarship",
      fileType: "PDF",
      fileSize: "620 KB",
      updateDate: "Jan 2026",
      description: "Form to apply for cadet scholarships based on 10+2 marks and family financial aid criteria."
    },
    {
      id: "form-4",
      title: "Cadet Hostel Accommodation Rules & Security Undertaking Form",
      category: "Hostel",
      fileType: "PDF",
      fileSize: "940 KB",
      updateDate: "Jan 2026",
      description: "Hostel rules, mess timings, and parent consent declaration form for residential cadets."
    }
  ],
  gallery: [
    {
      id: "gal-1",
      title: "Navigational Simulator Training Room",
      category: "Simulator",
      image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80",
      caption: "Cadets practicing RADAR & ECDIS bridge simulation under guidance of Master Mariners."
    },
    {
      id: "gal-2",
      title: "Interactive Smart Classroom",
      category: "Classroom",
      image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1200&q=80",
      caption: "Daily interactive problem solving and CBT practice session."
    },
    {
      id: "gal-3",
      title: "Annual Passing Out Ceremony & Topper Awards",
      category: "Events",
      image: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=1200&q=80",
      caption: "Felicitation of All-India Rank holders by Chief Guest Captains."
    },
    {
      id: "gal-4",
      title: "Port Trust & Container Ship Industrial Visit",
      category: "Ship Visits",
      image: "https://images.unsplash.com/photo-1516214104703-d870798883c5?auto=format&fit=crop&w=1200&q=80",
      caption: "Cadets getting firsthand exposure to vessel mooring and deck operations at JNPT Port."
    },
    {
      id: "gal-5",
      title: "Marine Engine Workshop & Auxiliaries Lab",
      category: "Campus",
      image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80",
      caption: "Hands-on overhaul of marine pumps, diesel generators, and valve assemblies."
    },
    {
      id: "gal-6",
      title: "Maritime Parade & Physical Fitness Training",
      category: "Events",
      image: "https://images.unsplash.com/photo-1517649763962-0c623266010b?auto=format&fit=crop&w=1200&q=80",
      caption: "Morning discipline drill and stamina conditioning for DG Shipping physical tests."
    }
  ],
  testimonials: [
    {
      id: "test-1",
      name: "Captain Sameer V. Kulkarni",
      role: "Parent of Cadet Rohan Kulkarni (AIR 04)",
      text: "As a Master Mariner myself, I was very particular about where to send my son for coaching. Pacific Marine Academy has the most disciplined environment, unmatched faculty, and genuine guidance.",
      rating: 5,
      location: "Pune, Maharashtra"
    },
    {
      id: "test-2",
      name: "Karan B. Thakur",
      role: "DNS Cadet at Anglo-Eastern",
      text: "The mock interviews conducted by Capt. Salunkhe were identical to the real Anglo-Eastern panel. I passed with top marks and secured my sponsorship easily.",
      rating: 5,
      location: "Jaipur, Rajasthan"
    },
    {
      id: "test-3",
      name: "Neha & Rajesh Sharma",
      role: "Parents of Cadet Ananya Sharma",
      text: "Safe hostel facility, excelente food, and 24/7 library access. The academy kept us updated every week on Ananya's test scores.",
      rating: 5,
      location: "Chandigarh"
    }
  ],
  faqs: [
    {
      id: "faq-1",
      question: "What is IMU-CET and why is it mandatory for Merchant Navy?",
      answer: "IMU-CET (Indian Maritime University Common Entrance Test) is the national entrance examination required for admission into B.Sc. Nautical Science, Diploma in Nautical Science (DNS), and B.Tech Marine Engineering across all DG Shipping approved institutes in India."
    },
    {
      id: "faq-2",
      question: "What is the age limit and educational qualification required?",
      answer: "For DNS & B.Sc Nautical Science: Candidate must have passed 10+2 with Physics, Chemistry, and Mathematics (PCM) with a minimum of 60% aggregate and at least 50% in English (10th or 12th). Age should be between 17 to 25 years on the day of course commencement."
    },
    {
      id: "faq-3",
      question: "What is Shipping Company Sponsorship and how does PMA help?",
      answer: "Sponsorship means a reputed shipping company (like Anglo-Eastern, Synergy, Fleet, MSC) selects you BEFORE your pre-sea training and guarantees your 18-month sea time onboard their ships. PMA provides specialized coaching for company sponsorship written tests, psychometrics, and mock viva panels."
    },
    {
      id: "faq-4",
      question: "Are hostel facilities available for outstation students?",
      answer: "Yes! PMA provides separate, fully-furnished residential hostel facilities for male and female cadets with nutritious mess food, Wi-Fi, study rooms, and 24/7 security near the academy campus."
    },
    {
      id: "faq-5",
      question: "Is eye vision standard strict for Merchant Navy?",
      answer: "Yes. For Deck Cadets (Nautical Science), 6/6 vision in both eyes without color blindness is mandatory. For Engine Cadets, up to 6/12 with glasses may be permitted as per DG Shipping rules. We assist students with pre-medical evaluation."
    }
  ],
  admissions: [
    {
      id: "ADM-2026-1001",
      fullName: "Harshvardhan R. Patil",
      email: "harsh.patil@example.com",
      phone: "+91 98234 56789",
      dob: "2006-08-14",
      gender: "Male",
      fatherName: "Rajendra Patil",
      city: "Kolhapur",
      state: "Maharashtra",
      qualification: "12th PCM Passed",
      pcmPercentage: "84.5%",
      englishPercentage: "78.0%",
      courseId: "course-1",
      courseName: "IMU-CET Ranker Prep Course",
      batchPreference: "Morning Regular Batch",
      hostelRequired: "Yes",
      documentProof: "data:image/svg+xml;utf8,<svg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'><rect width='100' height='100' fill='%230B2545'/><text x='50' y='55' fill='white' text-anchor='middle' font-size='12'>DOC OK</text></svg>",
      status: "Approved",
      submittedAt: "2026-02-10T10:30:00Z"
    },
    {
      id: "ADM-2026-1002",
      fullName: "Sanjana M. Hegde",
      email: "sanjana.h@example.com",
      phone: "+91 97123 45678",
      dob: "2007-01-22",
      gender: "Female",
      fatherName: "Manjunath Hegde",
      city: "Mangalore",
      state: "Karnataka",
      qualification: "12th PCM Appearing",
      pcmPercentage: "79.0%",
      englishPercentage: "88.0%",
      courseId: "course-2",
      courseName: "DNS & Sponsorship Exam Coaching",
      batchPreference: "Weekend Special",
      hostelRequired: "No",
      documentProof: "",
      status: "Pending",
      submittedAt: "2026-02-14T14:20:00Z"
    }
  ],
  enquiries: [
    {
      id: "enq-1",
      name: "Amit S. Shinde",
      email: "amit.shinde@example.com",
      phone: "+91 98900 11223",
      course: "IMU-CET Ranker Prep Course",
      message: "Please inform me about the upcoming hostel seat availability and scholarship options.",
      status: "Unread",
      date: "2026-02-18"
    },
    {
      id: "enq-2",
      name: "Pooja Verma",
      email: "pooja.v@example.com",
      phone: "+91 97654 32109",
      course: "DNS & Sponsorship Exam Coaching",
      message: "Can female candidates apply for Deck Cadet sponsorship? Need career guidance call.",
      status: "Contacted",
      date: "2026-02-16"
    }
  ],
  leads: [
    {
      id: "lead-1",
      name: "Rahul Verma",
      phone: "+91 98111 22334",
      email: "rahul.v@example.com",
      materialTitle: "IMU-CET Mathematics Formula & Shortcut Handbook 2026",
      downloadedAt: "2026-02-19T09:15:00Z"
    },
    {
      id: "lead-2",
      name: "Deepak Chawla",
      phone: "+91 99222 33445",
      email: "deepak.c@example.com",
      materialTitle: "IMU-CET 10 Previous Years Solved Question Papers",
      downloadedAt: "2026-02-19T11:45:00Z"
    }
  ]
};
