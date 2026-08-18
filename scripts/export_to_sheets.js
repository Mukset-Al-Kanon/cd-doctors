const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

function escapeCsvValue(val) {
  if (val === null || val === undefined) return '';
  const str = String(val).replace(/"/g, '""');
  return `"${str}"`;
}

function toCsv(rows) {
  if (!rows || rows.length === 0) return '';
  const headers = Object.keys(rows[0]);
  const headerLine = headers.map((h) => `"${h}"`).join(',');
  const dataLines = rows.map((row) =>
    headers.map((h) => escapeCsvValue(row[h])).join(',')
  );
  return [headerLine, ...dataLines].join('\r\n');
}

const DAY_NAMES_BN = ['রবিবার', 'সোমবার', 'মঙ্গলবার', 'বুধবার', 'বৃহস্পতিবার', 'শুক্রবার', 'শনিবার'];
const DAY_NAMES_EN = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

async function main() {
  const exportDir = path.join(__dirname, '..', 'exports_google_sheets');
  if (!fs.existsSync(exportDir)) {
    fs.mkdirSync(exportDir, { recursive: true });
  }

  console.log('Fetching database records from Prisma...');

  // 1. Doctors
  const doctors = await prisma.doctor.findMany({
    include: {
      hospital: {
        include: {
          district: {
            include: { division: true },
          },
        },
      },
      department: true,
      schedules: true,
    },
  });

  const doctorsData = doctors.map((doc) => {
    const daysBn = doc.schedules
      .map((s) => DAY_NAMES_BN[s.dayOfWeek])
      .join(', ');
    const daysEn = doc.schedules
      .map((s) => DAY_NAMES_EN[s.dayOfWeek])
      .join(', ');
    const timeSlots = doc.schedules
      .map((s) => `${DAY_NAMES_EN[s.dayOfWeek]}: ${s.startTime} - ${s.endTime}`)
      .join(' | ');

    return {
      Doctor_Name: doc.name,
      Specialization: doc.specialization,
      Department_EN: doc.department?.nameEn || '',
      Department_BN: doc.department?.nameBn || '',
      Degrees: doc.degrees,
      Experience_Years: doc.experienceYears,
      Consultation_Fee_BDT: doc.consultationFee,
      Hospital_Name: doc.hospital?.name || '',
      Hospital_Type: doc.hospital?.hospitalType || '',
      Chamber_Room: doc.chamberRoom,
      Contact_Phone: doc.phone || doc.hospital?.phone || '',
      Available_Days_BN: daysBn,
      Available_Days_EN: daysEn,
      Visiting_Hours_Detailed: timeSlots,
      Languages: doc.languages,
      BMDC_Number: doc.bmdcNumber,
      Bio: doc.bio || '',
      Treated_Diseases: doc.treatedDiseases || '',
      District: doc.hospital?.district?.nameEn || '',
      Status: doc.status,
    };
  });

  // 2. Hospitals
  const hospitals = await prisma.hospital.findMany({
    include: {
      district: {
        include: { division: true },
      },
      facilities: true,
      departments: true,
    },
  });

  const hospitalsData = hospitals.map((h) => ({
    Hospital_Name: h.name,
    Hospital_Type: h.hospitalType,
    District: h.district?.nameEn || '',
    District_BN: h.district?.nameBn || '',
    Division: h.district?.division?.nameEn || '',
    Address: h.address,
    Phone: h.phone,
    Emergency_Phone: h.emergencyPhone,
    Email: h.email,
    Website: h.website || '',
    Google_Map_URL: h.googleMapUrl || '',
    Established_Year: h.establishedYear || '',
    Status: h.status,
    Is_Featured: h.isFeatured ? 'Yes' : 'No',
    Available_Facilities: h.facilities.filter((f) => f.isAvailable).map((f) => f.facilityName).join(', '),
    Departments_Count: h.departments.length,
    Description: h.description,
  }));

  // 3. Emergency Helplines & Ambulance
  const helplines = await prisma.emergencyHelpline.findMany({
    orderBy: { orderIndex: 'asc' },
  });

  const helplinesData = helplines.map((hl) => ({
    Service_Title: hl.title,
    Helpline_Number: hl.number,
    Category_Badge: hl.badge,
    Description: hl.desc,
    Available_24_7: hl.isAvailable ? 'Yes' : 'No',
  }));

  // 4. Blood Donors
  const bloodDonors = await prisma.bloodDonor.findMany({
    orderBy: { createdAt: 'desc' },
  });

  const bloodDonorsData = bloodDonors.map((bd) => ({
    Donor_Name: bd.fullName,
    Blood_Group: bd.bloodGroup,
    Phone: bd.phone,
    Age: bd.age,
    Gender: bd.gender || '',
    Area_Upazila: bd.area,
    Full_Address: bd.address,
    Availability_Status: bd.availability,
    Last_Donation_Date: bd.lastDonationDate || 'Not specified',
    Note: bd.note || '',
    Approval_Status: bd.status,
  }));

  // 5. Diagnostic Tests & Hospital Pricing
  const testAvailabilities = await prisma.testAvailability.findMany({
    include: {
      test: true,
      hospital: true,
    },
  });

  const testsData = testAvailabilities.map((ta) => ({
    Test_Name: ta.test.name,
    Category: ta.test.category,
    Hospital_Name: ta.hospital.name,
    Price_BDT: ta.price ? `${ta.price} ৳` : 'Contact Hospital',
    Availability: ta.availabilityStatus,
    Notes: ta.notes || '',
  }));

  // 6. Master Knowledge Base / AI Messenger Bot Context (Single unified sheet for n8n AI)
  const masterAiData = [];

  // Add Platform info
  masterAiData.push({
    Category: 'Platform Information',
    Topic_Name: 'CD Doctors (HealthBD)',
    Quick_Summary_For_AI: 'CD Doctors is a Chuadanga-based digital healthcare discovery platform for specialist doctors, hospital chambers, 24/7 ambulances & blood donors.',
    Contact_Phone: '+880 761-62588',
    Location_Address: 'Chuadanga, Khulna, Bangladesh',
    Schedule_or_Hours: '24/7 Online Service',
    Pricing_or_Fee: 'Free Portal',
    Messenger_AI_Response_Template: 'CD Doctors helps you easily find specialist doctors, hospitals, ambulance contacts, and blood donors across Chuadanga.',
  });

  // Add Doctors
  doctorsData.forEach((doc) => {
    masterAiData.push({
      Category: 'Doctor',
      Topic_Name: `${doc.Doctor_Name} (${doc.Specialization})`,
      Quick_Summary_For_AI: `Specialist in ${doc.Specialization} (${doc.Department_BN}). Degrees: ${doc.Degrees}. Chamber: ${doc.Hospital_Name}, Room ${doc.Chamber_Room}. Experience: ${doc.Experience_Years} yrs. Treats: ${doc.Treated_Diseases}`,
      Contact_Phone: doc.Contact_Phone,
      Location_Address: `${doc.Hospital_Name}, ${doc.District}`,
      Schedule_or_Hours: `Available Days: ${doc.Available_Days_BN} | Visiting Hours: ${doc.Visiting_Hours_Detailed}`,
      Pricing_or_Fee: `${doc.Consultation_Fee_BDT} ৳`,
      Messenger_AI_Response_Template: `${doc.Doctor_Name} (${doc.Specialization}) sits at ${doc.Hospital_Name} (Room ${doc.Chamber_Room}) on ${doc.Available_Days_BN}. Fee: ${doc.Consultation_Fee_BDT} BDT. Serial Call: ${doc.Contact_Phone}`,
    });
  });

  // Add Hospitals
  hospitalsData.forEach((h) => {
    masterAiData.push({
      Category: 'Hospital / Clinic',
      Topic_Name: h.Hospital_Name,
      Quick_Summary_For_AI: `Type: ${h.Hospital_Type}. Facilities: ${h.Available_Facilities}. Total Departments: ${h.Departments_Count}. Description: ${h.Description}`,
      Contact_Phone: `Phone: ${h.Phone} | Emergency: ${h.Emergency_Phone}`,
      Location_Address: `${h.Address}, ${h.District}`,
      Schedule_or_Hours: '24/7 Emergency & OPD Services',
      Pricing_or_Fee: 'Hospital Service / Test Rates',
      Messenger_AI_Response_Template: `${h.Hospital_Name} is located at ${h.Address}. Phone: ${h.Phone}, Emergency: ${h.Emergency_Phone}. Facilities: ${h.Available_Facilities}`,
    });
  });

  // Add Emergency Helplines
  helplinesData.forEach((hl) => {
    masterAiData.push({
      Category: 'Emergency Helpline / Ambulance',
      Topic_Name: hl.Service_Title,
      Quick_Summary_For_AI: `${hl.Description} (Badge: ${hl.Category_Badge})`,
      Contact_Phone: hl.Helpline_Number,
      Location_Address: 'Chuadanga / Bangladesh',
      Schedule_or_Hours: '24/7 Available',
      Pricing_Fee: 'Standard govt / private rates',
      Messenger_AI_Response_Template: `For ${hl.Service_Title}, immediately call: ${hl.Helpline_Number} (Available 24/7).`,
    });
  });

  // Add Blood Donors
  bloodDonorsData.forEach((bd) => {
    masterAiData.push({
      Category: 'Blood Donor',
      Topic_Name: `${bd.Donor_Name} (${bd.Blood_Group})`,
      Quick_Summary_For_AI: `Blood Group: ${bd.Blood_Group}, Age: ${bd.Age}, Area: ${bd.Area_Upazila}, Address: ${bd.Full_Address}, Status: ${bd.Availability_Status}`,
      Contact_Phone: bd.Phone,
      Location_Address: `${bd.Area_Upazila}, ${bd.Full_Address}`,
      Schedule_or_Hours: bd.Availability_Status === 'available' ? 'Available for donation' : 'Unavailable',
      Pricing_or_Fee: 'Free (Voluntary Donation)',
      Messenger_AI_Response_Template: `Blood Donor: ${bd.Donor_Name} (${bd.Blood_Group}) in ${bd.Area_Upazila}. Phone: ${bd.Phone}. Status: ${bd.Availability_Status}.`,
    });
  });

  // Write CSV files with UTF-8 BOM so Excel and Google Sheets render Bengali text perfectly
  fs.writeFileSync(path.join(exportDir, '1_ALL_IN_ONE_N8N_AI_MASTER.csv'), '\ufeff' + toCsv(masterAiData), 'utf8');
  fs.writeFileSync(path.join(exportDir, '2_DOCTORS.csv'), '\ufeff' + toCsv(doctorsData), 'utf8');
  fs.writeFileSync(path.join(exportDir, '3_HOSPITALS.csv'), '\ufeff' + toCsv(hospitalsData), 'utf8');
  fs.writeFileSync(path.join(exportDir, '4_EMERGENCY_AMBULANCE.csv'), '\ufeff' + toCsv(helplinesData), 'utf8');
  fs.writeFileSync(path.join(exportDir, '5_BLOOD_DONORS.csv'), '\ufeff' + toCsv(bloodDonorsData), 'utf8');
  if (testsData.length > 0) {
    fs.writeFileSync(path.join(exportDir, '6_DIAGNOSTIC_TESTS.csv'), '\ufeff' + toCsv(testsData), 'utf8');
  }

  // Also write JSON versions for direct n8n webhook / HTTP Request node ingestion
  fs.writeFileSync(
    path.join(exportDir, 'n8n_master_data.json'),
    JSON.stringify(
      {
        totalRecords: masterAiData.length,
        masterKnowledge: masterAiData,
        doctors: doctorsData,
        hospitals: hospitalsData,
        emergency: helplinesData,
        bloodDonors: bloodDonorsData,
      },
      null,
      2
    ),
    'utf8'
  );

  console.log('EXPORT_SUCCESS');
  console.log(`Master records: ${masterAiData.length}`);
  console.log(`Doctors: ${doctorsData.length}`);
  console.log(`Hospitals: ${hospitalsData.length}`);
  console.log(`Emergency: ${helplinesData.length}`);
  console.log(`Blood Donors: ${bloodDonorsData.length}`);
}

main()
  .catch((e) => {
    console.error('Export error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
