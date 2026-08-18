import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed for CD Doctors (Chuadanga District Platform)...');

  // Clean existing tables thoroughly
  await prisma.bloodDonor.deleteMany();
  await prisma.auditLog.deleteMany();
  await prisma.review.deleteMany();
  await prisma.appointment.deleteMany();
  await prisma.doctorSchedule.deleteMany();
  await prisma.doctor.deleteMany();
  await prisma.department.deleteMany();
  await prisma.hospitalFacility.deleteMany();
  await prisma.hospitalSubscription.deleteMany();
  await prisma.subscriptionPlan.deleteMany();
  await prisma.user.deleteMany();
  await prisma.hospital.deleteMany();
  await prisma.district.deleteMany();
  await prisma.division.deleteMany();

  console.log('✅ Cleared all previous doctor records, appointments, and hospital data.');

  // 1. Seed Khulna Division & Chuadanga District
  const divKhulna = await prisma.division.create({
    data: {
      nameEn: 'Khulna',
      nameBn: 'খুলনা',
      slug: 'khulna',
    },
  });

  const distChuadanga = await prisma.district.create({
    data: {
      divisionId: divKhulna.id,
      nameEn: 'Chuadanga',
      nameBn: 'চুয়াডাঙ্গা',
      slug: 'chuadanga',
    },
  });

  console.log('✅ Created Chuadanga District location record.');

  // 2. Admin Credentials
  const superAdminPassword = await bcrypt.hash('admin123', 10);

  await prisma.user.create({
    data: {
      name: 'CD Doctors Owner Admin',
      email: 'admin@cddoctors.com',
      passwordHash: superAdminPassword,
      role: 'SUPER_ADMIN',
    },
  });
  console.log('✅ Created Owner Admin (admin@cddoctors.com / admin123)');

  // 3. Seed Chuadanga Hospitals (5 Premier Hospitals) with 6 Unique Doctors Each (30 Doctors Total)
  const hospitalsWithUniqueDoctors = [
    {
      hospital: {
        name: 'Evercare Hospital Chuadanga',
        slug: 'evercare-hospital-chuadanga',
        districtId: distChuadanga.id,
        hospitalType: 'Super Specialty Hospital',
        status: 'ACTIVE',
        isFeatured: true,
        address: 'Station Road, Chuadanga Sadar, Chuadanga',
        phone: '+880 761-62588',
        emergencyPhone: '10663',
        email: 'info.chuadanga@evercarebd.com',
        website: 'https://www.evercarebd.com/chuadanga/',
        establishedYear: 2021,
        description: 'Evercare Hospital Chuadanga is a 470-bed multi-disciplinary super-specialty tertiary care hospital in Chuadanga District featuring state-of-the-art emergency care, 24/7 ICU support, advanced cath lab, and international standard surgical suites.',
        latitude: 23.644,
        longitude: 88.8556,
        logoUrl: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=300&auto=format&fit=crop&q=80',
        coverUrl: 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?w=1200&auto=format&fit=crop&q=80',
        licenseNumber: 'REG-CDG-2021-9901',
      },
      doctors: [
        {
          name: 'Dr. Mahbubur Rahman Chowdhury',
          slug: 'dr-mahbubur-rahman-chowdhury-evercare',
          deptEn: 'Cardiology & Heart Care',
          deptBn: 'কার্ডিওলজি ও হৃদরোগ বিভাগ',
          bmdcNumber: 'A-45892',
          degrees: 'MBBS, FCPS (Cardiology), MD (Cardiology)',
          specialization: 'Senior Consultant Cardiologist',
          experienceYears: 18,
          consultationFee: 1200,
          chamberRoom: 'Block A, 4th Floor, Suite 402',
          phone: '+880 1711-209841',
          photoUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&auto=format&fit=crop&q=80',
          bio: 'Dr. Mahbubur Rahman Chowdhury is a senior interventional cardiologist with over 18 years of specialized experience in coronary angioplasty, heart failure management, and acute cardiac care at Evercare Hospital Chuadanga.',
        },
        {
          name: 'Dr. Selina Parveen',
          slug: 'dr-selina-parveen-evercare',
          deptEn: 'Gynecology & Obstetrics',
          deptBn: 'স্ত্রী ও প্রসূতি রোগ বিভাগ',
          bmdcNumber: 'A-56901',
          degrees: 'MBBS, MS (Gynae & Obs), FCPS',
          specialization: 'Consultant Gynecologist & Laparoscopic Surgeon',
          experienceYears: 14,
          consultationFee: 1000,
          chamberRoom: 'Chamber #104, Ground Floor',
          phone: '+880 1819-332145',
          photoUrl: 'https://images.unsplash.com/photo-1594824813566-78a9c2d1b827?w=400&auto=format&fit=crop&q=80',
          bio: 'Dr. Selina Parveen specializes in high-risk pregnancies, advanced laparoscopic gynecological surgeries, pain-free normal deliveries, and infertility care.',
        },
        {
          name: 'Dr. Kazi Ariful Haque',
          slug: 'dr-kazi-ariful-haque-evercare',
          deptEn: 'Orthopedics & Trauma Surgery',
          deptBn: 'অর্থোপেডিক্স ও ট্রমা বিভাগ',
          bmdcNumber: 'A-38910',
          degrees: 'MBBS, MS (Orthopedics), D-Ortho',
          specialization: 'Trauma & Joint Replacement Surgeon',
          experienceYears: 16,
          consultationFee: 1000,
          chamberRoom: 'Room #205, 2nd Floor',
          phone: '+880 1712-445566',
          photoUrl: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400&auto=format&fit=crop&q=80',
          bio: 'Renowned orthopedic surgeon specializing in knee and hip replacement surgery, complex bone fracture reconstruction, and sports injury rehabilitation.',
        },
        {
          name: 'Dr. Nuzhat Fatema',
          slug: 'dr-nuzhat-fatema-evercare',
          deptEn: 'Pediatrics & Child Health',
          deptBn: 'শিশু রোগ বিভাগ',
          bmdcNumber: 'A-61204',
          degrees: 'MBBS, DCH (Pediatrics), FCPS (Paed)',
          specialization: 'Senior Consultant Pediatrician & Neonatologist',
          experienceYears: 11,
          consultationFee: 900,
          chamberRoom: 'Room #108, Pediatric Outdoor',
          phone: '+880 1913-556677',
          photoUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&auto=format&fit=crop&q=80',
          bio: 'Dedicated pediatrician providing comprehensive newborn care, pediatric asthma management, childhood nutrition counseling, and emergency pediatric care.',
        },
        {
          name: 'Dr. Towhidul Islam',
          slug: 'dr-towhidul-islam-evercare',
          deptEn: 'Neurology & Brain Sciences',
          deptBn: 'নিউরোমেডিসিন ও ব্রেইন সাইন্স বিভাগ',
          bmdcNumber: 'A-49021',
          degrees: 'MBBS, MD (Neurology), PhD',
          specialization: 'Consultant Neurologist & Stroke Specialist',
          experienceYears: 15,
          consultationFee: 1200,
          chamberRoom: 'Suite #401, 4th Floor',
          phone: '+880 1715-667788',
          photoUrl: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&auto=format&fit=crop&q=80',
          bio: 'Expert neurologist specializing in stroke treatment, stroke rehabilitation, epilepsy, Parkinson disease, chronic migraine, and peripheral neuropathy.',
        },
        {
          name: 'Dr. Sharmeen Sultana',
          slug: 'dr-sharmeen-sultana-evercare',
          deptEn: 'Dermatology & Skin Care',
          deptBn: 'চর্ম, এলার্জি ও সৌন্দর্য রোগ বিভাগ',
          bmdcNumber: 'A-53219',
          degrees: 'MBBS, DDV, FCPS (Dermatology)',
          specialization: 'Consultant Dermatologist & Laser Specialist',
          experienceYears: 10,
          consultationFee: 800,
          chamberRoom: 'Chamber #210, 2nd Floor',
          phone: '+880 1817-778899',
          photoUrl: 'https://images.unsplash.com/photo-1651008376811-b90baee60c1f?w=400&auto=format&fit=crop&q=80',
          bio: 'Specialist in modern skin disease treatments, acne scar removal, chronic eczema, skin allergies, hair loss therapy, and clinical laser procedures.',
        },
      ],
    },
    {
      hospital: {
        name: 'Chuadanga Medical Center',
        slug: 'chuadanga-medical-center',
        districtId: distChuadanga.id,
        hospitalType: 'Private Hospital',
        status: 'ACTIVE',
        isFeatured: true,
        address: 'Court Road, Chuadanga Sadar, Chuadanga',
        phone: '+880 761-63105',
        emergencyPhone: '+880 761-63106',
        email: 'info@chuadangamedicalcenter.com',
        establishedYear: 1998,
        description: 'Chuadanga Medical Center is one of the premier private hospitals in Chuadanga Sadar, offering expert specialist outdoor chambers, 24/7 diagnostic labs, maternity care, and emergency cardiac support.',
        logoUrl: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=300&auto=format&fit=crop&q=80',
        coverUrl: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=1200&auto=format&fit=crop&q=80',
        licenseNumber: 'REG-CDG-1998-4412',
      },
      doctors: [
        {
          name: 'Dr. Md. Rafiqul Islam',
          slug: 'dr-md-rafiqul-islam-cmc',
          deptEn: 'Internal & General Medicine',
          deptBn: 'মেডিসিন ও ডায়াবেটিস বিভাগ',
          bmdcNumber: 'A-31205',
          degrees: 'MBBS, FCPS (Medicine), MD (Internal Medicine)',
          specialization: 'Senior Consultant Physician & Diabetologist',
          experienceYears: 20,
          consultationFee: 1000,
          chamberRoom: 'Room #101, Main Building',
          phone: '+880 1713-112233',
          photoUrl: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&auto=format&fit=crop&q=80',
          bio: 'Veteran medicine specialist in Chuadanga with 20 years experience in managing complex fever, hypertension, uncontrolled diabetes, and internal organ disorders.',
        },
        {
          name: 'Dr. Farida Yasmin',
          slug: 'dr-farida-yasmin-cmc',
          deptEn: 'Gynecology & Obstetrics',
          deptBn: 'স্ত্রী ও প্রসূতি রোগ বিভাগ',
          bmdcNumber: 'A-42118',
          degrees: 'MBBS, DGO, FCPS (Gynae)',
          specialization: 'Associate Professor & Gynecologist',
          experienceYears: 13,
          consultationFee: 900,
          chamberRoom: 'Chamber #203, Female Ward Block',
          phone: '+880 1814-223344',
          photoUrl: 'https://images.unsplash.com/photo-1594824813566-78a9c2d1b827?w=400&auto=format&fit=crop&q=80',
          bio: 'Experienced gynecologist dedicated to compassionate antenatal care, cesarean & normal deliveries, ovarian cyst treatment, and pelvic health.',
        },
        {
          name: 'Dr. A.H.M. Kamal Hossain',
          slug: 'dr-ahm-kamal-hossain-cmc',
          deptEn: 'General & Laparoscopic Surgery',
          deptBn: 'জেনারেল ও ল্যাপারোস্কোপিক সার্জারি বিভাগ',
          bmdcNumber: 'A-36912',
          degrees: 'MBBS, FCPS (Surgery), MS (General Surgery)',
          specialization: 'Senior General & Laparoscopic Surgeon',
          experienceYears: 17,
          consultationFee: 1100,
          chamberRoom: 'OT Complex, 3rd Floor',
          phone: '+880 1716-334455',
          photoUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&auto=format&fit=crop&q=80',
          bio: 'Specialist laparoscopic surgeon performing keyhole gallbladder surgeries, hernia repair, appendectomy, and abdominal tumor resections.',
        },
        {
          name: 'Dr. Nazmul Huda',
          slug: 'dr-nazmul-huda-cmc',
          deptEn: 'ENT & Head Neck Surgery',
          deptBn: 'ناک, কান ও গলা রোগ বিভাগ',
          bmdcNumber: 'A-58190',
          degrees: 'MBBS, MS (ENT), DLO',
          specialization: 'ENT Specialist & Micro Ear Surgeon',
          experienceYears: 12,
          consultationFee: 800,
          chamberRoom: 'Chamber #112, ENT Outdoor',
          phone: '+880 1918-445566',
          photoUrl: 'https://images.unsplash.com/photo-1623854767648-e7bb8009f0db?w=400&auto=format&fit=crop&q=80',
          bio: 'Skilled ENT surgeon specializing in sinus endoscopic surgery, tonsillectomy, eardrum repair (tympanoplasty), and vocal cord polyp care.',
        },
        {
          name: 'Dr. Syeda Rawnak Jahan',
          slug: 'dr-syeda-rawnak-jahan-cmc',
          deptEn: 'Ophthalmology & Eye Care',
          deptBn: 'চক্ষু রোগ বিভাগ',
          bmdcNumber: 'A-47209',
          degrees: 'MBBS, DO (Eye), FCPS (Ophthalmology)',
          specialization: 'Eye Specialist & Phaco Surgeon',
          experienceYears: 14,
          consultationFee: 800,
          chamberRoom: 'Eye Clinic, 1st Floor',
          phone: '+880 1719-556677',
          photoUrl: 'https://images.unsplash.com/photo-1651008376811-b90baee60c1f?w=400&auto=format&fit=crop&q=80',
          bio: 'Prominent eye surgeon offering sutureless phaco cataract surgery, glaucoma screening, pterygium removal, and pediatric vision correction.',
        },
        {
          name: 'Dr. Md. Moniruzzaman',
          slug: 'dr-md-moniruzzaman-cmc',
          deptEn: 'Urology & Kidney Surgery',
          deptBn: 'ইউরোলজি ও কিডনি সার্জারি বিভাগ',
          bmdcNumber: 'A-39801',
          degrees: 'MBBS, MS (Urology)',
          specialization: 'Consultant Urologist & Andrologist',
          experienceYears: 15,
          consultationFee: 1000,
          chamberRoom: 'Room #305, Urology Dept',
          phone: '+880 1812-667788',
          photoUrl: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400&auto=format&fit=crop&q=80',
          bio: 'Specialist in kidney stone laser removal (URSL/PCNL), prostate surgery (TURP), urinary tract infections, and male infertility treatment.',
        },
      ],
    },
    {
      hospital: {
        name: 'Chuadanga Specialized Hospital',
        slug: 'chuadanga-specialized-hospital',
        districtId: distChuadanga.id,
        hospitalType: 'Private Hospital',
        status: 'ACTIVE',
        isFeatured: false,
        address: 'Hospital Road, Chuadanga Sadar, Chuadanga',
        phone: '+880 761-62201',
        emergencyPhone: '+880 761-62202',
        email: 'contact@chuadangaspecialized.org',
        establishedYear: 2005,
        description: 'Chuadanga Specialized Hospital provides comprehensive outdoor doctor chambers, general surgery, pediatric care, and emergency ambulance services across Chuadanga District.',
        logoUrl: 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=300&auto=format&fit=crop&q=80',
        coverUrl: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1200&auto=format&fit=crop&q=80',
        licenseNumber: 'REG-CDG-2005-3310',
      },
      doctors: [
        {
          name: 'Dr. Sheikh Asaduzzaman',
          slug: 'dr-sheikh-asaduzzaman-csh',
          deptEn: 'Gastroenterology & Liver',
          deptBn: 'গ্যাস্ট্রোএন্টারোলজি ও লিভার বিভাগ',
          bmdcNumber: 'A-44120',
          degrees: 'MBBS, MD (Gastroenterology)',
          specialization: 'Senior Gastroenterologist & Endoscopist',
          experienceYears: 16,
          consultationFee: 1100,
          chamberRoom: 'Suite #201, 2nd Floor',
          phone: '+880 1714-998877',
          photoUrl: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&auto=format&fit=crop&q=80',
          bio: 'Specialist in endoscopy, colonoscopy, fatty liver disease, peptic ulcer, IBS, hepatitis management, and chronic abdominal discomfort.',
        },
        {
          name: 'Dr. Afroza Begum',
          slug: 'dr-afroza-begum-csh',
          deptEn: 'Pediatrics & Child Health',
          deptBn: 'শিশু রোগ বিভাগ',
          bmdcNumber: 'A-51902',
          degrees: 'MBBS, FCPS (Pediatrics), DCH',
          specialization: 'Child & Adolescent Specialist',
          experienceYears: 12,
          consultationFee: 800,
          chamberRoom: 'Room #105, Child Care Unit',
          phone: '+880 1815-887766',
          photoUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&auto=format&fit=crop&q=80',
          bio: 'Extensive expertise in treating pediatric infections, jaundice, pneumonia, malnutrition, and pediatric growth development.',
        },
        {
          name: 'Dr. Md. Zakir Hossain',
          slug: 'dr-md-zakir-hossain-csh',
          deptEn: 'Orthopedics & Spine Surgery',
          deptBn: 'অর্থোপেডিক্স ও স্পাইন বিভাগ',
          bmdcNumber: 'A-37890',
          degrees: 'MBBS, MS (Ortho), Fellow Spine Surgery',
          specialization: 'Spine & Bone Joint Specialist',
          experienceYears: 15,
          consultationFee: 1000,
          chamberRoom: 'Chamber #302, 3rd Floor',
          phone: '+880 1711-776655',
          photoUrl: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400&auto=format&fit=crop&q=80',
          bio: 'Pioneer spine surgeon treating back pain, disc prolapse (PLID), spinal deformity, bone fracture trauma, and osteoarthritis.',
        },
        {
          name: 'Dr. Rehana Chowdhury',
          slug: 'dr-rehana-chowdhury-csh',
          deptEn: 'Gynecology & Infertility',
          deptBn: 'স্ত্রী রোগ ও বন্ধ্যাত্ব চিকিৎসা বিভাগ',
          bmdcNumber: 'A-49210',
          degrees: 'MBBS, MS (Gynae), Fellow IVF',
          specialization: 'Infertility & Gynae Specialist',
          experienceYears: 11,
          consultationFee: 900,
          chamberRoom: 'Room #102, Ground Floor',
          phone: '+880 1916-665544',
          photoUrl: 'https://images.unsplash.com/photo-1594824813566-78a9c2d1b827?w=400&auto=format&fit=crop&q=80',
          bio: 'Specialist in PCOS care, hormonal imbalance, fertility treatment, ovulation induction, and comprehensive gynecological care.',
        },
        {
          name: 'Dr. Md. Enamul Kabir',
          slug: 'dr-md-enamul-kabir-csh',
          deptEn: 'Respiratory & Chest Medicine',
          deptBn: 'বক্ষব্যাধি ও অ্যাজমা বিভাগ',
          bmdcNumber: 'A-41098',
          degrees: 'MBBS, DTCD, MD (Chest Medicine)',
          specialization: 'Pulmonologist & Chest Specialist',
          experienceYears: 13,
          consultationFee: 900,
          chamberRoom: 'Room #204, 2nd Floor',
          phone: '+880 1718-554433',
          photoUrl: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&auto=format&fit=crop&q=80',
          bio: 'Expert chest physician specializing in asthma, COPD, tuberculosis, chronic bronchitis, lung infections, and allergy immunotherapy.',
        },
        {
          name: 'Dr. Shahriar Ahmed',
          slug: 'dr-shahriar-ahmed-csh',
          deptEn: 'Nephrology & Kidney Care',
          deptBn: 'নেফ্রোলজি ও কিডনি রোগ বিভাগ',
          bmdcNumber: 'A-53412',
          degrees: 'MBBS, MD (Nephrology)',
          specialization: 'Consultant Nephrologist',
          experienceYears: 10,
          consultationFee: 1000,
          chamberRoom: 'Kidney Dialysis Unit, 4th Floor',
          phone: '+880 1819-443322',
          photoUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&auto=format&fit=crop&q=80',
          bio: 'Kidney specialist focused on acute kidney injury, chronic kidney disease (CKD), hemodialysis management, and diabetic nephropathy.',
        },
      ],
    },
    {
      hospital: {
        name: 'Alamdanga Health Care Clinic',
        slug: 'alamdanga-health-care-clinic',
        districtId: distChuadanga.id,
        hospitalType: 'Clinic',
        status: 'ACTIVE',
        isFeatured: true,
        address: 'Station Para, Alamdanga, Chuadanga',
        phone: '+880 7622-56120',
        emergencyPhone: '+880 7622-56121',
        email: 'info@alamdangahealthcare.com',
        establishedYear: 2012,
        description: 'Alamdanga Health Care Clinic offers expert doctor consultation, digital X-Ray, diagnostic pathology, and 24-hour emergency care for Alamdanga Upazila residents.',
        logoUrl: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=300&auto=format&fit=crop&q=80',
        coverUrl: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=1200&auto=format&fit=crop&q=80',
        licenseNumber: 'REG-CDG-2012-7721',
      },
      doctors: [
        {
          name: 'Dr. Md. Motiur Rahman',
          slug: 'dr-md-motiur-rahman-alamdanga',
          deptEn: 'General Medicine & Diabetes',
          deptBn: 'মেডিসিন ও ডায়াবেটিস বিভাগ',
          bmdcNumber: 'A-35619',
          degrees: 'MBBS, CCD (BIRDEM), PGT (Medicine)',
          specialization: 'Diabetologist & General Physician',
          experienceYears: 14,
          consultationFee: 700,
          chamberRoom: 'Room #101, Outdoor Chamber',
          phone: '+880 1712-332211',
          photoUrl: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400&auto=format&fit=crop&q=80',
          bio: 'Trusted general medicine doctor serving Alamdanga for 14 years, specializing in diabetes control, hypertension, and family healthcare.',
        },
        {
          name: 'Dr. Tahmina Akter',
          slug: 'dr-tahmina-akter-alamdanga',
          deptEn: 'Gynecology & Maternal Care',
          deptBn: 'স্ত্রী ও প্রসূতি সেবা বিভাগ',
          bmdcNumber: 'A-48901',
          degrees: 'MBBS, DGO (Gynae)',
          specialization: 'Maternal & Women Health Specialist',
          experienceYears: 10,
          consultationFee: 700,
          chamberRoom: 'Room #103, Maternity Block',
          phone: '+880 1813-221100',
          photoUrl: 'https://images.unsplash.com/photo-1651008376811-b90baee60c1f?w=400&auto=format&fit=crop&q=80',
          bio: 'Dedicated maternal health consultant providing safe delivery services, prenatal checkups, post-natal care, and gynecological advice.',
        },
        {
          name: 'Dr. Md. Saiful Islam',
          slug: 'dr-md-saiful-islam-alamdanga',
          deptEn: 'Pediatrics & Child Care',
          deptBn: 'শিশু স্বাস্থ্য বিভাগ',
          bmdcNumber: 'A-52104',
          degrees: 'MBBS, DCH (Child Health)',
          specialization: 'Pediatrician & Child Health Specialist',
          experienceYears: 9,
          consultationFee: 700,
          chamberRoom: 'Room #102, Child Outdoor',
          phone: '+880 1914-110099',
          photoUrl: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&auto=format&fit=crop&q=80',
          bio: 'Child health specialist focused on pediatric cold, fever, diarrhea, vaccination schedules, and infant weight gain management.',
        },
        {
          name: 'Dr. Golam Sarwar',
          slug: 'dr-golam-sarwar-alamdanga',
          deptEn: 'General Surgery',
          deptBn: 'জেনারেল সার্জারি বিভাগ',
          bmdcNumber: 'A-39012',
          degrees: 'MBBS, FCPS (Surgery)',
          specialization: 'Consultant General Surgeon',
          experienceYears: 12,
          consultationFee: 800,
          chamberRoom: 'Minor OT Room, 1st Floor',
          phone: '+880 1715-009988',
          photoUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&auto=format&fit=crop&q=80',
          bio: 'Experienced surgeon performing hydrocele, piles, fistula, cyst, wound debridement, and minor outpatient surgical procedures.',
        },
        {
          name: 'Dr. Rumana Parvin',
          slug: 'dr-rumana-parvin-alamdanga',
          deptEn: 'Physical Medicine & Pain Care',
          deptBn: 'ফিজিকেল মেডিসিন ও পেইন কেয়ার বিভাগ',
          bmdcNumber: 'A-47120',
          degrees: 'MBBS, FCPS (Physical Medicine)',
          specialization: 'Physiotherapy & Pain Specialist',
          experienceYears: 11,
          consultationFee: 800,
          chamberRoom: 'Physiotherapy Unit, Ground Floor',
          phone: '+880 1816-998877',
          photoUrl: 'https://images.unsplash.com/photo-1594824813566-78a9c2d1b827?w=400&auto=format&fit=crop&q=80',
          bio: 'Specialist in non-surgical pain management for neck pain, lumbar paralysis, frozen shoulder, stroke rehab, and joint stiffness.',
        },
        {
          name: 'Dr. Md. Imran Hossain',
          slug: 'dr-md-imran-hossain-alamdanga',
          deptEn: 'Dental Surgery & Oral Care',
          deptBn: 'ডেন্টাল ও মুখরোগ বিভাগ',
          bmdcNumber: 'B-12904',
          degrees: 'BDS, MS (Oral Surgery)',
          specialization: 'Dental Surgeon & Implantologist',
          experienceYears: 8,
          consultationFee: 600,
          chamberRoom: 'Dental Dental Clinic Room',
          phone: '+880 1717-887766',
          photoUrl: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&auto=format&fit=crop&q=80',
          bio: 'Modern dental surgeon offering painless root canal treatment, dental scaling, teeth whitening, tooth extraction, and braces consultation.',
        },
      ],
    },
    {
      hospital: {
        name: 'Damurhuda Digital Hospital & Diagnostic',
        slug: 'damurhuda-digital-hospital',
        districtId: distChuadanga.id,
        hospitalType: 'Diagnostic Center',
        status: 'ACTIVE',
        isFeatured: false,
        address: 'Munshiganj Bazar, Damurhuda, Chuadanga',
        phone: '+880 7623-44109',
        emergencyPhone: '+880 7623-44110',
        email: 'service@damurhudadigital.com',
        establishedYear: 2017,
        description: 'Modern diagnostic center & specialized consultation hospital serving Damurhuda and Darshana border areas with advanced ultrasonography and outdoor chambers.',
        logoUrl: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=300&auto=format&fit=crop&q=80',
        coverUrl: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=1200&auto=format&fit=crop&q=80',
        licenseNumber: 'REG-CDG-2017-8890',
      },
      doctors: [
        {
          name: 'Dr. A.K.M. Fazlul Haque',
          slug: 'dr-akm-fazlul-haque-damurhuda',
          deptEn: 'Cardiology & Vascular Care',
          deptBn: 'কার্ডিওলজি ও রক্তনালী বিভাগ',
          bmdcNumber: 'A-33410',
          degrees: 'MBBS, D-Card, MD (Cardiology)',
          specialization: 'Consultant Cardiologist',
          experienceYears: 15,
          consultationFee: 900,
          chamberRoom: 'Chamber #101, Main Block',
          phone: '+880 1711-665544',
          photoUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&auto=format&fit=crop&q=80',
          bio: 'Heart specialist serving Damurhuda and Darshana region, specializing in ECG interpretation, Echo, high blood pressure, and ischemic heart disease.',
        },
        {
          name: 'Dr. Sayeeda Sultana',
          slug: 'dr-sayeeda-sultana-damurhuda',
          deptEn: 'Gynecology & Women Health',
          deptBn: 'স্ত্রী রোগ ও নারী স্বাস্থ্য বিভাগ',
          bmdcNumber: 'A-46109',
          degrees: 'MBBS, MS (Gynae & Obs)',
          specialization: 'Consultant Gynecologist & Obstetrician',
          experienceYears: 11,
          consultationFee: 800,
          chamberRoom: 'Chamber #102, Ground Floor',
          phone: '+880 1812-554433',
          photoUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&auto=format&fit=crop&q=80',
          bio: 'Expert in female reproductive health, pregnancy care, menstrual irregularities, ultrasound anomaly scans, and post-partum recovery.',
        },
        {
          name: 'Dr. Md. Tariq Hasan',
          slug: 'dr-md-tariq-hasan-damurhuda',
          deptEn: 'Diabetes & Hormone Care',
          deptBn: 'ডায়াবেটিস ও হরমোন বিভাগ',
          bmdcNumber: 'A-42901',
          degrees: 'MBBS, MD (Endocrinology)',
          specialization: 'Hormone & Diabetes Specialist',
          experienceYears: 12,
          consultationFee: 900,
          chamberRoom: 'Chamber #201, 2nd Floor',
          phone: '+880 1913-443322',
          photoUrl: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&auto=format&fit=crop&q=80',
          bio: 'Specialized endocrinologist providing treatment for Type 1 & Type 2 diabetes, thyroid disorders, obesity, and adrenal hormone issues.',
        },
        {
          name: 'Dr. Nazma Akter',
          slug: 'dr-nazma-akter-damurhuda',
          deptEn: 'Child Care & Pediatrics',
          deptBn: 'শিশু রোগ বিভাগ',
          bmdcNumber: 'A-54910',
          degrees: 'MBBS, DCH (Pediatrics)',
          specialization: 'Child Specialist',
          experienceYears: 9,
          consultationFee: 700,
          chamberRoom: 'Room #104, Pediatric Section',
          phone: '+880 1714-332211',
          photoUrl: 'https://images.unsplash.com/photo-1651008376811-b90baee60c1f?w=400&auto=format&fit=crop&q=80',
          bio: 'Attentive child health doctor specializing in infant nutrition, pediatric respiratory infections, viral fever, and childhood growth monitoring.',
        },
        {
          name: 'Dr. Md. Babul Akhter',
          slug: 'dr-md-babul-akhter-damurhuda',
          deptEn: 'Orthopedic Surgery',
          deptBn: 'অর্থোপেডিক্স ও হাড়জোড় বিভাগ',
          bmdcNumber: 'A-38102',
          degrees: 'MBBS, D-Ortho',
          specialization: 'Bone & Joint Fracture Specialist',
          experienceYears: 13,
          consultationFee: 800,
          chamberRoom: 'Room #203, Ortho Block',
          phone: '+880 1815-221100',
          photoUrl: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400&auto=format&fit=crop&q=80',
          bio: 'Orthopedic practitioner specializing in fracture plastering, dislocation reduction, joint pain relief, and orthopedic rehabilitation.',
        },
        {
          name: 'Dr. Fahmida Rahman',
          slug: 'dr-fahmida-rahman-damurhuda',
          deptEn: 'Skin & Allergy Care',
          deptBn: 'চর্ম ও এলার্জি বিভাগ',
          bmdcNumber: 'A-50192',
          degrees: 'MBBS, DDV (Dermatology)',
          specialization: 'Skin & Allergy Specialist',
          experienceYears: 10,
          consultationFee: 700,
          chamberRoom: 'Room #106, Outdoor Clinic',
          phone: '+880 1916-110099',
          photoUrl: 'https://images.unsplash.com/photo-1594824813566-78a9c2d1b827?w=400&auto=format&fit=crop&q=80',
          bio: 'Dermatology consultant treating fungal skin infections, scabies, ringworm, psoriasis, facial acne, and food & dust allergies.',
        },
      ],
    },
  ];

  const daysSatToThu = [6, 0, 1, 2, 3, 4]; // Sat, Sun, Mon, Tue, Wed, Thu

  const facilitiesList = [
    '24/7 Emergency & Trauma Center',
    'ICU & CCU Intensive Support',
    'Outdoor Specialist Chamber',
    'Digital Radiology & MRI',
    '24 Hours Pharmacy',
  ];

  let totalDoctorsSeeded = 0;

  for (const item of hospitalsWithUniqueDoctors) {
    // Create Hospital
    const hospital = await prisma.hospital.create({ data: item.hospital });
    console.log(`🏥 Created Hospital: ${hospital.name}`);

    // Create Facilities
    for (const fName of facilitiesList) {
      await prisma.hospitalFacility.create({
        data: {
          hospitalId: hospital.id,
          facilityName: fName,
        },
      });
    }

    // Create 6 UNIQUE Doctors for this specific hospital
    for (let i = 0; i < item.doctors.length; i++) {
      const docData = item.doctors[i];

      // Ensure/create Department for hospital
      let dept = await prisma.department.findFirst({
        where: { hospitalId: hospital.id, nameEn: docData.deptEn },
      });

      if (!dept) {
        dept = await prisma.department.create({
          data: {
            hospitalId: hospital.id,
            nameEn: docData.deptEn,
            nameBn: docData.deptBn,
          },
        });
      }

      const doctor = await prisma.doctor.create({
        data: {
          hospitalId: hospital.id,
          departmentId: dept.id,
          name: docData.name,
          slug: docData.slug,
          bmdcNumber: docData.bmdcNumber,
          degrees: docData.degrees,
          specialization: docData.specialization,
          experienceYears: docData.experienceYears,
          consultationFee: docData.consultationFee,
          chamberRoom: docData.chamberRoom,
          phone: docData.phone,
          bio: docData.bio,
          languages: 'Bangla, English',
          status: 'ACTIVE',
          photoUrl: docData.photoUrl,
        },
      });

      // Create Weekly Schedule (Sat to Thu) for Doctor
      for (const dayOfWeek of daysSatToThu) {
        await prisma.doctorSchedule.create({
          data: {
            doctorId: doctor.id,
            dayOfWeek,
            startTime: '16:00',
            endTime: '20:00',
            maxPatients: 20,
          },
        });
      }

      totalDoctorsSeeded++;
    }

    console.log(`   ✅ Seeded 6 UNIQUE doctors for ${hospital.name}`);
  }

  // Seed Blood Donors for Chuadanga
  const sampleDonors = [
    {
      fullName: 'Md. Rakibul Hasan',
      phone: '01711223344',
      bloodGroup: 'O+',
      age: 26,
      gender: 'Male',
      address: 'Court Road, Chuadanga Sadar',
      area: 'Chuadanga Sadar',
      availability: 'available',
      lastDonationDate: '2026-04-15',
      note: 'Always ready for emergency blood donation in Chuadanga Sadar.',
      consent: true,
      status: 'approved',
      approvedAt: new Date(),
    },
    {
      fullName: 'Sabrina Yeasmin',
      phone: '01822334455',
      bloodGroup: 'A+',
      age: 23,
      gender: 'Female',
      address: 'Station Para, Alamdanga',
      area: 'Alamdanga',
      availability: 'available',
      lastDonationDate: '2026-03-10',
      note: 'Available on weekends and evenings.',
      consent: true,
      status: 'approved',
      approvedAt: new Date(),
    },
    {
      fullName: 'Tanvir Ahmed Shuvo',
      phone: '01933445566',
      bloodGroup: 'B+',
      age: 29,
      gender: 'Male',
      address: 'Munshiganj Bazar, Damurhuda',
      area: 'Damurhuda',
      availability: 'available',
      lastDonationDate: '2026-02-01',
      note: 'Can travel anywhere inside Chuadanga in urgent cases.',
      consent: true,
      status: 'approved',
      approvedAt: new Date(),
    },
    {
      fullName: 'Kazi Mahfuzur Rahman',
      phone: '01744556677',
      bloodGroup: 'AB+',
      age: 32,
      gender: 'Male',
      address: 'Bus Stand Area, Jibannagar',
      area: 'Jibannagar',
      availability: 'available',
      lastDonationDate: '2026-05-20',
      note: 'Universal recipient, ready for AB+ donations.',
      consent: true,
      status: 'approved',
      approvedAt: new Date(),
    },
    {
      fullName: 'Sharmin Akter',
      phone: '01855667788',
      bloodGroup: 'O-',
      age: 25,
      gender: 'Female',
      address: 'Hospital Road, Chuadanga Sadar',
      area: 'Chuadanga Sadar',
      availability: 'available',
      lastDonationDate: '2026-01-18',
      note: 'O Negative universal donor for emergency ICU patients.',
      consent: true,
      status: 'approved',
      approvedAt: new Date(),
    },
    {
      fullName: 'Mehedi Hasan Babu',
      phone: '01666778899',
      bloodGroup: 'A-',
      age: 27,
      gender: 'Male',
      address: 'Vatala, Chuadanga Sadar',
      area: 'Chuadanga Sadar',
      availability: 'unavailable',
      lastDonationDate: '2026-07-05',
      note: 'Recently donated blood on July 5, unavailable for next 2 months.',
      consent: true,
      status: 'approved',
      approvedAt: new Date(),
    },
    {
      fullName: 'Anik Chowdhury',
      phone: '01777889900',
      bloodGroup: 'B-',
      age: 24,
      gender: 'Male',
      address: 'Alamdanga Railway Station',
      area: 'Alamdanga',
      availability: 'available',
      note: 'Student at Chuadanga Government College.',
      consent: true,
      status: 'pending',
    },
  ];

  for (const donor of sampleDonors) {
    await prisma.bloodDonor.create({ data: donor });
  }

  console.log(`🎉 Seed finished cleanly! Created ${hospitalsWithUniqueDoctors.length} hospitals & ${totalDoctorsSeeded} unique doctors (6 unique doctors per hospital).`);
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
