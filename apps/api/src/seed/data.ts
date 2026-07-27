export interface SeedSpecialty {
  name: string;
  icon: string;
  shortDescription: string;
  description: string;
  treatments: string[];
  displayOrder: number;
}

export interface SeedCenter {
  name: string;
  city: string;
  address: string;
  shortDescription: string;
  description: string;
  phone?: string;
  email?: string;
  website?: string;
  photoUrl?: string;
  displayOrder: number;
}

export interface SeedPackage {
  name: string;
  durationDays: number;
  shortDescription: string;
  description: string;
  hotel: {
    name: string;
    stars?: number;
    roomType?: string;
    nights?: number;
    description?: string;
  };
  tours: { title: string; description: string }[];
  inclusions: string[];
  priceFrom?: number;
  currency?: string;
  photoUrl?: string;
  displayOrder: number;
}

export interface SeedDoctor {
  firstName: string;
  lastName: string;
  specialtySlug: string;
  /** Slugs of the medical centers where the doctor practises (one or more). */
  centerSlugs: string[];
  photoUrl: string;
  shortDescription: string;
  biography: string;
  education: string[];
  certifications: string[];
  treatments: string[];
  languages: string[];
  yearsOfExperience: number;
  consultationPrice?: number;
  consultationCurrency?: string;
  isFeatured: boolean;
}

export const seedCenters: SeedCenter[] = [
  {
    name: 'Yerevan Medical Center',
    city: 'Yerevan',
    address: '12 Northern Avenue, Yerevan 0001, Armenia',
    shortDescription: 'Multi-specialty hospital in the heart of Yerevan.',
    description:
      'Yerevan Medical Center is a modern multi-specialty hospital offering diagnostics, surgery, and outpatient care across dozens of medical fields, with dedicated coordination for international patients.',
    phone: '+37410500100',
    email: 'info@yerevanmedical.am',
    website: 'https://example.com/yerevan-medical-center',
    photoUrl: 'https://placehold.co/800x480?text=Yerevan+Medical+Center',
    displayOrder: 1,
  },
  {
    name: 'Erebuni Medical Center',
    city: 'Yerevan',
    address: '14 Titogradyan Street, Yerevan 0087, Armenia',
    shortDescription: 'Leading center for cardiology and emergency medicine.',
    description:
      'Erebuni Medical Center is one of Armenia’s largest clinical hospitals, recognized for cardiology, neurology, and advanced emergency care, supported by modern imaging and catheterization facilities.',
    phone: '+37410471555',
    email: 'info@erebunimed.am',
    website: 'https://example.com/erebuni-medical-center',
    photoUrl: 'https://placehold.co/800x480?text=Erebuni+Medical+Center',
    displayOrder: 2,
  },
  {
    name: 'Nairi Medical Center',
    city: 'Yerevan',
    address: '21 Paronyan Street, Yerevan 0015, Armenia',
    shortDescription: "Comprehensive care with strong women's-health and vision services.",
    description:
      "Nairi Medical Center provides comprehensive inpatient and outpatient services with recognized programs in women's health, reproductive medicine, and ophthalmology.",
    phone: '+37410545045',
    email: 'info@nairimed.am',
    website: 'https://example.com/nairi-medical-center',
    photoUrl: 'https://placehold.co/800x480?text=Nairi+Medical+Center',
    displayOrder: 3,
  },
  {
    name: 'Astghik Medical Center',
    city: 'Yerevan',
    address: '2 Kanaker Zeytun, Yerevan 0052, Armenia',
    shortDescription: 'Surgical excellence in orthopedics and plastic surgery.',
    description:
      'Astghik Medical Center is known for its surgical departments, including orthopedics, plastic and reconstructive surgery, and general surgery, with structured rehabilitation programs.',
    phone: '+37410318190',
    email: 'info@astghik.am',
    website: 'https://example.com/astghik-medical-center',
    photoUrl: 'https://placehold.co/800x480?text=Astghik+Medical+Center',
    displayOrder: 4,
  },
  {
    name: 'Wigmore Clinic',
    city: 'Yerevan',
    address: '2/2 Vagharshyan Street, Yerevan 0012, Armenia',
    shortDescription: 'Modern private clinic with international standards.',
    description:
      'Wigmore Clinic is a private multidisciplinary clinic offering dermatology, aesthetic medicine, and general specialties with a strong focus on patient experience and international accreditation standards.',
    phone: '+37460504040',
    email: 'info@wigmoreclinic.am',
    website: 'https://example.com/wigmore-clinic',
    photoUrl: 'https://placehold.co/800x480?text=Wigmore+Clinic',
    displayOrder: 5,
  },
  {
    name: 'Shengavit Medical Center',
    city: 'Yerevan',
    address: '9 Manandyan Street, Yerevan 0038, Armenia',
    shortDescription: 'Established hospital with broad clinical services.',
    description:
      'Shengavit Medical Center offers a wide range of clinical services, with well-developed ENT, orthopedic, and surgical departments serving both local and international patients.',
    phone: '+37410448888',
    email: 'info@shengavitmed.am',
    website: 'https://example.com/shengavit-medical-center',
    photoUrl: 'https://placehold.co/800x480?text=Shengavit+Medical+Center',
    displayOrder: 6,
  },
  {
    name: 'Izmirlyan Medical Center',
    city: 'Yerevan',
    address: '12 Malkhasyants Street, Yerevan 0062, Armenia',
    shortDescription: 'Advanced surgery and oncology services.',
    description:
      'Izmirlyan Medical Center is a well-equipped hospital with strong general surgery, orthopedic, and oncology programs, delivering coordinated multidisciplinary care.',
    phone: '+37410662555',
    email: 'info@izmirlyan.am',
    website: 'https://example.com/izmirlyan-medical-center',
    photoUrl: 'https://placehold.co/800x480?text=Izmirlyan+Medical+Center',
    displayOrder: 7,
  },
  {
    name: 'Gyumri Medical Center',
    city: 'Gyumri',
    address: '2 Tigran Mets Avenue, Gyumri 3101, Armenia',
    shortDescription: "Northern Armenia's referral hospital in Gyumri.",
    description:
      'Gyumri Medical Center is the main referral hospital for the Shirak region, providing surgical, ophthalmology, and general medical services to patients across northern Armenia.',
    phone: '+37431223344',
    email: 'info@gyumrimed.am',
    website: 'https://example.com/gyumri-medical-center',
    photoUrl: 'https://placehold.co/800x480?text=Gyumri+Medical+Center',
    displayOrder: 8,
  },
];

export const seedPackages: SeedPackage[] = [
  {
    name: '10-Day Dental & Discovery Package',
    durationDays: 10,
    shortDescription:
      'A complete 10-day dental treatment trip combining implant or smile-makeover care with a relaxing Armenian getaway.',
    description:
      'This 10-day package is designed for patients travelling to Armenia for dental treatment such as implants, veneers, or a full-mouth rehabilitation. It bundles your clinic appointments with comfortable accommodation, airport transfers, an English-speaking coordinator, and curated tours so you can recover while exploring the country. Your coordinator schedules treatment sessions with recovery time in between, leaving room for sightseeing.',
    hotel: {
      name: 'Grand Hotel Yerevan',
      stars: 4,
      roomType: 'Deluxe double room',
      nights: 9,
      description:
        'A comfortable 4-star hotel in central Yerevan, within short driving distance of partner dental clinics, with breakfast included.',
    },
    tours: [
      {
        title: 'Yerevan city tour',
        description:
          'A half-day guided walk through Republic Square, the Cascade complex, and central Yerevan.',
      },
      {
        title: 'Garni Temple & Geghard Monastery',
        description:
          'A full-day trip to the Hellenistic Garni Temple and the rock-hewn Geghard Monastery, a UNESCO site.',
      },
      {
        title: 'Khor Virap & Areni winery',
        description:
          'A scenic day trip to Khor Virap with views of Mount Ararat, followed by a tasting at an Areni winery.',
      },
    ],
    inclusions: [
      'Airport pick-up and drop-off',
      'All clinic transfers',
      'English-speaking patient coordinator',
      'Daily breakfast at the hotel',
      'Local SIM card with data',
      '3 guided tours as listed',
    ],
    priceFrom: 1200,
    currency: 'USD',
    photoUrl: 'https://placehold.co/800x480?text=Dental+%26+Discovery',
    displayOrder: 1,
  },
  {
    name: '7-Day Health Check & Relax Package',
    durationDays: 7,
    shortDescription:
      'A week-long comprehensive health screening paired with restful accommodation and light sightseeing.',
    description:
      'Ideal for patients seeking a full diagnostic check-up, this 7-day package combines comprehensive screening at a leading medical center with a calm, restorative stay. It includes consultations, laboratory work, and imaging as arranged by your coordinator, plus time to unwind with gentle tours around Yerevan and its surroundings.',
    hotel: {
      name: 'Ani Plaza Hotel',
      stars: 4,
      roomType: 'Standard twin room',
      nights: 6,
      description:
        'A well-located 4-star hotel near Yerevan’s medical district, offering a quiet base for your check-up week.',
    },
    tours: [
      {
        title: 'Cascade & museums walk',
        description:
          'A relaxed afternoon exploring the Cascade, Cafesjian art collection, and nearby cafés.',
      },
      {
        title: 'Lake Sevan day trip',
        description:
          'A day by Armenia’s alpine Lake Sevan, including the Sevanavank monastery peninsula.',
      },
    ],
    inclusions: [
      'Airport pick-up and drop-off',
      'Transfers to the medical center',
      'English/Russian-speaking coordinator',
      'Daily breakfast at the hotel',
      '2 guided tours as listed',
    ],
    priceFrom: 900,
    currency: 'USD',
    photoUrl: 'https://placehold.co/800x480?text=Health+Check+%26+Relax',
    displayOrder: 2,
  },
  {
    name: '14-Day Surgery & Recovery Package',
    durationDays: 14,
    shortDescription:
      'A two-week package built around a planned surgical procedure with extended, supported recovery.',
    description:
      'This 14-day package supports patients undergoing a planned surgery such as orthopedic, plastic, or general surgery. It covers pre-operative consultations, the procedure at an accredited hospital, and a carefully paced recovery period with follow-up visits. Accommodation is chosen for comfort and accessibility, and light optional excursions are offered once your care team clears you to travel.',
    hotel: {
      name: 'Radisson Blu Hotel Yerevan',
      stars: 5,
      roomType: 'Executive room',
      nights: 13,
      description:
        'A 5-star hotel with spacious, accessible rooms and on-call assistance, suited to a longer recovery stay.',
    },
    tours: [
      {
        title: 'Gentle old-town walk',
        description:
          'A short, low-effort stroll through central landmarks, scheduled only when medically cleared.',
      },
      {
        title: 'Matenadaran manuscript museum',
        description:
          'A calm indoor visit to the famous repository of ancient Armenian manuscripts.',
      },
    ],
    inclusions: [
      'Airport pick-up and drop-off',
      'All hospital and follow-up transfers',
      'Dedicated recovery coordinator',
      'Daily breakfast at the hotel',
      'Post-operative check-in calls',
      '2 optional light excursions',
    ],
    priceFrom: 2600,
    currency: 'USD',
    photoUrl: 'https://placehold.co/800x480?text=Surgery+%26+Recovery',
    displayOrder: 3,
  },
];

export const seedSpecialties: SeedSpecialty[] = [
  {
    name: 'ENT / Otolaryngology',
    icon: 'ear',
    shortDescription: 'Diagnosis and treatment of ear, nose, and throat conditions.',
    description:
      'Our ENT specialists treat a wide range of conditions affecting the ears, nose, sinuses, throat, and related structures of the head and neck, combining modern diagnostics with minimally invasive surgery.',
    treatments: ['Sinus surgery', 'Tonsillectomy', 'Hearing restoration', 'Septoplasty'],
    displayOrder: 1,
  },
  {
    name: 'Plastic Surgery',
    icon: 'sparkles',
    shortDescription: 'Reconstructive and aesthetic surgical procedures.',
    description:
      'Board-certified plastic surgeons offer reconstructive and aesthetic procedures in accredited clinics, with careful planning, transparent pricing, and dedicated recovery support for international patients.',
    treatments: ['Rhinoplasty', 'Breast surgery', 'Liposuction', 'Facelift'],
    displayOrder: 2,
  },
  {
    name: 'Dentistry',
    icon: 'tooth',
    shortDescription: 'Comprehensive dental and oral health care.',
    description:
      'From routine care to complex restorations, our partner dental clinics provide implants, cosmetic dentistry, and full-mouth rehabilitation using contemporary materials and techniques.',
    treatments: ['Dental implants', 'Veneers', 'Crowns & bridges', 'Teeth whitening'],
    displayOrder: 3,
  },
  {
    name: 'Cardiology',
    icon: 'heart',
    shortDescription: 'Heart and cardiovascular system care.',
    description:
      'Cardiologists provide diagnostics, preventive care, and treatment for cardiovascular conditions, supported by modern imaging and catheterization facilities.',
    treatments: ['Echocardiography', 'Angiography', 'Arrhythmia management', 'Heart health screening'],
    displayOrder: 4,
  },
  {
    name: 'Ophthalmology',
    icon: 'eye',
    shortDescription: 'Eye care, vision correction, and eye surgery.',
    description:
      'Ophthalmology specialists offer vision correction, cataract surgery, and treatment of retinal and corneal conditions in well-equipped eye centers.',
    treatments: ['LASIK', 'Cataract surgery', 'Glaucoma treatment', 'Retinal care'],
    displayOrder: 5,
  },
  {
    name: 'Orthopedics',
    icon: 'bone',
    shortDescription: 'Musculoskeletal, joint, and spine treatment.',
    description:
      'Orthopedic surgeons treat conditions of bones, joints, ligaments, and the spine, including joint replacement and sports-injury care with structured rehabilitation.',
    treatments: ['Joint replacement', 'Arthroscopy', 'Spine surgery', 'Sports injury care'],
    displayOrder: 6,
  },
  {
    name: 'Dermatology',
    icon: 'skin',
    shortDescription: 'Skin, hair, and nail health.',
    description:
      'Dermatologists diagnose and treat medical and cosmetic skin conditions, offering both clinical care and aesthetic dermatology procedures.',
    treatments: ['Acne treatment', 'Laser therapy', 'Skin cancer screening', 'Cosmetic dermatology'],
    displayOrder: 7,
  },
  {
    name: 'Gynecology',
    icon: 'female',
    shortDescription: "Women's reproductive and general health.",
    description:
      "Gynecologists provide comprehensive women's health services, from routine screening to specialized surgical and non-surgical treatments.",
    treatments: ['Well-woman exams', 'Minimally invasive surgery', 'Fertility consultation', 'Ultrasound'],
    displayOrder: 8,
  },
  {
    name: 'General Surgery',
    icon: 'scalpel',
    shortDescription: 'Broad surgical care for common conditions.',
    description:
      'General surgeons perform a wide range of procedures, emphasizing minimally invasive techniques and evidence-based perioperative care.',
    treatments: ['Hernia repair', 'Gallbladder surgery', 'Appendectomy', 'Laparoscopic surgery'],
    displayOrder: 9,
  },
  {
    name: 'Neurology',
    icon: 'brain',
    shortDescription: 'Disorders of the nervous system.',
    description:
      'Neurologists diagnose and manage conditions of the brain, spinal cord, and nervous system with advanced imaging and individualized treatment plans.',
    treatments: ['Headache & migraine care', 'Epilepsy management', 'Stroke follow-up', 'Neuromuscular assessment'],
    displayOrder: 10,
  },
  {
    name: 'Oncology',
    icon: 'ribbon',
    shortDescription: 'Cancer diagnosis and treatment.',
    description:
      'Oncology specialists coordinate diagnosis, treatment planning, and supportive care, working within multidisciplinary teams.',
    treatments: ['Diagnostic consultation', 'Chemotherapy planning', 'Second opinion', 'Follow-up care'],
    displayOrder: 11,
  },
  {
    name: 'Reproductive Medicine',
    icon: 'dna',
    shortDescription: 'Fertility care and reproductive health.',
    description:
      'Reproductive medicine specialists offer fertility evaluation and assisted reproductive treatments with compassionate, patient-centered care.',
    treatments: ['Fertility evaluation', 'IVF consultation', 'Hormonal assessment', 'Reproductive counseling'],
    displayOrder: 12,
  },
];

export const seedDoctors: SeedDoctor[] = [
  {
    firstName: 'Anna',
    lastName: 'Sargsyan',
    specialtySlug: 'plastic-surgery',
    centerSlugs: ['wigmore-clinic', 'astghik-medical-center'],
    photoUrl: 'https://placehold.co/400x400?text=Dr.+Sargsyan',
    shortDescription: 'Aesthetic and reconstructive plastic surgeon with a focus on facial procedures.',
    biography:
      'Dr. Anna Sargsyan is a board-certified plastic surgeon with extensive experience in facial aesthetic surgery and reconstruction. She is known for a natural-results philosophy and meticulous surgical technique.',
    education: ['MD, Yerevan State Medical University', 'Plastic Surgery Residency, Yerevan'],
    certifications: ['Board Certified in Plastic Surgery', 'Member, International Society of Aesthetic Plastic Surgery'],
    treatments: ['Rhinoplasty', 'Facelift', 'Blepharoplasty'],
    languages: ['Armenian', 'English', 'Russian'],
    yearsOfExperience: 15,
    consultationPrice: 60,
    consultationCurrency: 'USD',
    isFeatured: true,
  },
  {
    firstName: 'Davit',
    lastName: 'Petrosyan',
    specialtySlug: 'dentistry',
    centerSlugs: ['yerevan-medical-center'],
    photoUrl: 'https://placehold.co/400x400?text=Dr.+Petrosyan',
    shortDescription: 'Implantologist and cosmetic dentist restoring smiles with modern techniques.',
    biography:
      'Dr. Davit Petrosyan specializes in dental implants and cosmetic dentistry, helping international patients achieve functional and beautiful results in fewer visits through careful treatment planning.',
    education: ['DDS, Yerevan State Medical University', 'Advanced Implantology, Vienna'],
    certifications: ['ITI Implant Certification', 'Invisalign Provider'],
    treatments: ['Dental implants', 'Veneers', 'Full-mouth rehabilitation'],
    languages: ['Armenian', 'English', 'Russian', 'French'],
    yearsOfExperience: 12,
    consultationPrice: 40,
    consultationCurrency: 'USD',
    isFeatured: true,
  },
  {
    firstName: 'Marine',
    lastName: 'Hakobyan',
    specialtySlug: 'ophthalmology',
    centerSlugs: ['nairi-medical-center', 'erebuni-medical-center'],
    photoUrl: 'https://placehold.co/400x400?text=Dr.+Hakobyan',
    shortDescription: 'Refractive and cataract surgeon dedicated to restoring clear vision.',
    biography:
      'Dr. Marine Hakobyan is an ophthalmologist with a special interest in refractive surgery and cataract care, using the latest laser technology for precise, safe outcomes.',
    education: ['MD, Yerevan State Medical University', 'Fellowship in Refractive Surgery'],
    certifications: ['Board Certified in Ophthalmology'],
    treatments: ['LASIK', 'Cataract surgery', 'Glaucoma treatment'],
    languages: ['Armenian', 'English', 'Russian'],
    yearsOfExperience: 18,
    consultationPrice: 50,
    consultationCurrency: 'USD',
    isFeatured: true,
  },
  {
    firstName: 'Aram',
    lastName: 'Grigoryan',
    specialtySlug: 'cardiology',
    centerSlugs: ['erebuni-medical-center'],
    photoUrl: 'https://placehold.co/400x400?text=Dr.+Grigoryan',
    shortDescription: 'Interventional cardiologist focused on preventive heart care.',
    biography:
      'Dr. Aram Grigoryan is an interventional cardiologist with two decades of experience in diagnostics and cardiovascular treatment, committed to preventive and personalized care.',
    education: ['MD, Yerevan State Medical University', 'Cardiology Fellowship, Moscow'],
    certifications: ['Board Certified in Cardiology'],
    treatments: ['Echocardiography', 'Angiography', 'Heart health screening'],
    languages: ['Armenian', 'Russian', 'English'],
    yearsOfExperience: 22,
    consultationPrice: 55,
    consultationCurrency: 'USD',
    isFeatured: true,
  },
  {
    firstName: 'Lilit',
    lastName: 'Avetisyan',
    specialtySlug: 'dermatology',
    centerSlugs: ['wigmore-clinic'],
    photoUrl: 'https://placehold.co/400x400?text=Dr.+Avetisyan',
    shortDescription: 'Medical and cosmetic dermatologist for healthy, radiant skin.',
    biography:
      'Dr. Lilit Avetisyan treats both medical and cosmetic skin conditions, combining evidence-based dermatology with modern laser and aesthetic therapies.',
    education: ['MD, Yerevan State Medical University'],
    certifications: ['Board Certified in Dermatology'],
    treatments: ['Acne treatment', 'Laser therapy', 'Skin cancer screening'],
    languages: ['Armenian', 'English', 'Persian'],
    yearsOfExperience: 10,
    consultationPrice: 45,
    consultationCurrency: 'USD',
    isFeatured: true,
  },
  {
    firstName: 'Sergey',
    lastName: 'Manukyan',
    specialtySlug: 'orthopedics',
    centerSlugs: ['astghik-medical-center', 'izmirlyan-medical-center'],
    photoUrl: 'https://placehold.co/400x400?text=Dr.+Manukyan',
    shortDescription: 'Joint replacement and sports-injury orthopedic surgeon.',
    biography:
      'Dr. Sergey Manukyan is an orthopedic surgeon specializing in joint replacement and sports medicine, guiding patients through surgery and structured rehabilitation.',
    education: ['MD, Yerevan State Medical University', 'Orthopedic Surgery Fellowship, Germany'],
    certifications: ['Board Certified in Orthopedic Surgery'],
    treatments: ['Joint replacement', 'Arthroscopy', 'Sports injury care'],
    languages: ['Armenian', 'Russian', 'English', 'Arabic'],
    yearsOfExperience: 20,
    consultationPrice: 55,
    consultationCurrency: 'USD',
    isFeatured: true,
  },
  {
    firstName: 'Narine',
    lastName: 'Karapetyan',
    specialtySlug: 'gynecology',
    centerSlugs: ['nairi-medical-center'],
    photoUrl: 'https://placehold.co/400x400?text=Dr.+Karapetyan',
    shortDescription: 'Gynecologist providing compassionate comprehensive care.',
    biography:
      "Dr. Narine Karapetyan offers a full range of women's health services with a focus on minimally invasive procedures and patient comfort.",
    education: ['MD, Yerevan State Medical University'],
    certifications: ['Board Certified in Obstetrics & Gynecology'],
    treatments: ['Well-woman exams', 'Minimally invasive surgery', 'Ultrasound'],
    languages: ['Armenian', 'English', 'Russian'],
    yearsOfExperience: 14,
    consultationPrice: 45,
    consultationCurrency: 'USD',
    isFeatured: false,
  },
  {
    firstName: 'Tigran',
    lastName: 'Vardanyan',
    specialtySlug: 'ent-otolaryngology',
    centerSlugs: ['shengavit-medical-center'],
    photoUrl: 'https://placehold.co/400x400?text=Dr.+Vardanyan',
    shortDescription: 'ENT surgeon treating sinus, hearing, and throat conditions.',
    biography:
      'Dr. Tigran Vardanyan is an otolaryngologist with expertise in endoscopic sinus surgery and hearing restoration, dedicated to improving quality of life.',
    education: ['MD, Yerevan State Medical University'],
    certifications: ['Board Certified in Otolaryngology'],
    treatments: ['Sinus surgery', 'Septoplasty', 'Hearing restoration'],
    languages: ['Armenian', 'Russian', 'English'],
    yearsOfExperience: 16,
    consultationPrice: 40,
    consultationCurrency: 'USD',
    isFeatured: false,
  },
  {
    firstName: 'Gohar',
    lastName: 'Mkrtchyan',
    specialtySlug: 'reproductive-medicine',
    centerSlugs: ['nairi-medical-center'],
    photoUrl: 'https://placehold.co/400x400?text=Dr.+Mkrtchyan',
    shortDescription: 'Fertility specialist supporting patients on their family journey.',
    biography:
      'Dr. Gohar Mkrtchyan is a reproductive medicine specialist offering fertility evaluation and assisted reproduction with a warm, individualized approach.',
    education: ['MD, Yerevan State Medical University', 'Reproductive Medicine Fellowship'],
    certifications: ['Certified in Reproductive Endocrinology'],
    treatments: ['Fertility evaluation', 'IVF consultation', 'Hormonal assessment'],
    languages: ['Armenian', 'English', 'Russian', 'French'],
    yearsOfExperience: 13,
    consultationPrice: 70,
    consultationCurrency: 'USD',
    isFeatured: true,
  },
  {
    firstName: 'Karen',
    lastName: 'Abrahamyan',
    specialtySlug: 'general-surgery',
    centerSlugs: ['izmirlyan-medical-center', 'yerevan-medical-center'],
    photoUrl: 'https://placehold.co/400x400?text=Dr.+Abrahamyan',
    shortDescription: 'General surgeon focused on minimally invasive procedures.',
    biography:
      'Dr. Karen Abrahamyan performs a broad range of general surgical procedures with an emphasis on laparoscopic techniques and rapid recovery.',
    education: ['MD, Yerevan State Medical University'],
    certifications: ['Board Certified in General Surgery'],
    treatments: ['Hernia repair', 'Gallbladder surgery', 'Laparoscopic surgery'],
    languages: ['Armenian', 'Russian', 'English'],
    yearsOfExperience: 19,
    consultationPrice: 50,
    consultationCurrency: 'USD',
    isFeatured: false,
  },
  {
    firstName: 'Ani',
    lastName: 'Gasparyan',
    specialtySlug: 'neurology',
    centerSlugs: ['erebuni-medical-center'],
    photoUrl: 'https://placehold.co/400x400?text=Dr.+Gasparyan',
    shortDescription: 'Neurologist managing headache, epilepsy, and stroke care.',
    biography:
      'Dr. Ani Gasparyan is a neurologist experienced in diagnosing and managing a wide range of neurological conditions with individualized treatment plans.',
    education: ['MD, Yerevan State Medical University'],
    certifications: ['Board Certified in Neurology'],
    treatments: ['Headache & migraine care', 'Epilepsy management', 'Stroke follow-up'],
    languages: ['Armenian', 'English', 'Russian'],
    yearsOfExperience: 11,
    consultationPrice: 50,
    consultationCurrency: 'USD',
    isFeatured: false,
  },
  {
    firstName: 'Hovhannes',
    lastName: 'Simonyan',
    specialtySlug: 'oncology',
    centerSlugs: ['izmirlyan-medical-center'],
    photoUrl: 'https://placehold.co/400x400?text=Dr.+Simonyan',
    shortDescription: 'Medical oncologist coordinating multidisciplinary cancer care.',
    biography:
      'Dr. Hovhannes Simonyan provides oncology consultations, treatment planning, and second opinions within a multidisciplinary team environment.',
    education: ['MD, Yerevan State Medical University', 'Oncology Fellowship'],
    certifications: ['Board Certified in Medical Oncology'],
    treatments: ['Diagnostic consultation', 'Chemotherapy planning', 'Second opinion'],
    languages: ['Armenian', 'Russian', 'English', 'Arabic'],
    yearsOfExperience: 17,
    consultationPrice: 65,
    consultationCurrency: 'USD',
    isFeatured: false,
  },
  {
    firstName: 'Mariam',
    lastName: 'Ghazaryan',
    specialtySlug: 'dentistry',
    centerSlugs: ['yerevan-medical-center'],
    photoUrl: 'https://placehold.co/400x400?text=Dr.+Ghazaryan',
    shortDescription: 'Cosmetic dentist crafting confident, natural smiles.',
    biography:
      'Dr. Mariam Ghazaryan focuses on cosmetic dentistry and smile design, delivering personalized results with attention to detail.',
    education: ['DDS, Yerevan State Medical University'],
    certifications: ['Cosmetic Dentistry Certification'],
    treatments: ['Veneers', 'Teeth whitening', 'Crowns & bridges'],
    languages: ['Armenian', 'English', 'Persian'],
    yearsOfExperience: 8,
    consultationPrice: 35,
    consultationCurrency: 'USD',
    isFeatured: false,
  },
  {
    firstName: 'Vahe',
    lastName: 'Sahakyan',
    specialtySlug: 'plastic-surgery',
    centerSlugs: ['astghik-medical-center'],
    photoUrl: 'https://placehold.co/400x400?text=Dr.+Sahakyan',
    shortDescription: 'Body-contouring plastic surgeon with an artistic eye.',
    biography:
      'Dr. Vahe Sahakyan specializes in body-contouring procedures, combining surgical precision with a patient-first approach to safety and results.',
    education: ['MD, Yerevan State Medical University', 'Plastic Surgery Fellowship, Italy'],
    certifications: ['Board Certified in Plastic Surgery'],
    treatments: ['Liposuction', 'Breast surgery', 'Tummy tuck'],
    languages: ['Armenian', 'English', 'Russian', 'French'],
    yearsOfExperience: 21,
    consultationPrice: 60,
    consultationCurrency: 'USD',
    isFeatured: false,
  },
  {
    firstName: 'Elen',
    lastName: 'Harutyunyan',
    specialtySlug: 'ophthalmology',
    centerSlugs: ['gyumri-medical-center'],
    photoUrl: 'https://placehold.co/400x400?text=Dr.+Harutyunyan',
    shortDescription: 'Pediatric and general ophthalmologist.',
    biography:
      'Dr. Elen Harutyunyan cares for patients of all ages, with a special interest in pediatric ophthalmology and comprehensive eye health.',
    education: ['MD, Yerevan State Medical University'],
    certifications: ['Board Certified in Ophthalmology'],
    treatments: ['Cataract surgery', 'Retinal care', 'Pediatric eye care'],
    languages: ['Armenian', 'Russian', 'English'],
    yearsOfExperience: 9,
    consultationPrice: 45,
    consultationCurrency: 'USD',
    isFeatured: false,
  },
  {
    firstName: 'Ruben',
    lastName: 'Melkonyan',
    specialtySlug: 'orthopedics',
    centerSlugs: ['shengavit-medical-center', 'gyumri-medical-center'],
    photoUrl: 'https://placehold.co/400x400?text=Dr.+Melkonyan',
    shortDescription: 'Spine surgeon dedicated to restoring mobility.',
    biography:
      'Dr. Ruben Melkonyan is a spine surgeon focused on minimally invasive spine procedures and comprehensive musculoskeletal care.',
    education: ['MD, Yerevan State Medical University', 'Spine Surgery Fellowship'],
    certifications: ['Board Certified in Orthopedic Surgery'],
    treatments: ['Spine surgery', 'Arthroscopy', 'Joint replacement'],
    languages: ['Armenian', 'English', 'Russian'],
    yearsOfExperience: 15,
    consultationPrice: 55,
    consultationCurrency: 'USD',
    isFeatured: false,
  },
];
