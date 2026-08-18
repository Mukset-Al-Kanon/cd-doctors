import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

function escapeCsvValue(val: any): string {
  if (val === null || val === undefined) return '';
  const str = String(val).replace(/"/g, '""');
  return `"${str}"`;
}

function toCsv(rows: Array<Record<string, any>>): string {
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
  const exportDir = path.join(process.cwd(), 'exports_google_sheets');
  if (!fs.existsSync(exportDir)) {
    fs.mkdirSync(exportDir, { recursive: true });
  }

  console.log('Fetching database records...');

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
      ID: doc.id,
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
    ID: h.id,
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
    ID: hl.id,
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
    ID: bd.id,
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
    ID: ta.id,
    Test_Name: ta.test.name,
    Category: ta.test.category,
    Hospital_Name: ta.hospital.name,
    Price_BDT: ta.price ? `${ta.price} ৳` : 'Contact Hospital',
    Availability: ta.availabilityStatus,
    Notes: ta.notes || '',
  }));

  // 6. Master Knowledge Base / AI Messenger Bot Context (Single unified sheet for n8n AI)
  const masterAiData: Array<{
    Category: string;
    Title: string;
    Key_Details: string;
    Contact_Number: string;
    Location_Address: string;
    Schedule_Availability: string;
    Pricing_Fee: string;
    AI_Bot_Quick_Reply_Prompt: string;
  }> = [];

  // Add Platform info
  masterAiData.push({
    Category: 'Platform Information',
    Title: 'CD Doctors (HealthBD)',
    Key_Details: 'Chuadanga digital healthcare portal for finding specialist doctors, hospitals, blood donors & 24/7 ambulances.',
    Contact_Number: '+880 761-62588',
    Location_Address: 'Chuadanga, Bangladesh',
    Schedule_Availability: '24/7 Online',
    Pricing_Fee: 'Free Portal',
    AI_Bot_Quick_Reply_Prompt: 'CD Doctors helps you instantly find doctors, hospitals, ambulances, and blood donors across Chuadanga.',
  });

  // Add Doctors
  doctorsData.forEach((doc) => {
    masterAiData.push({
      Category: 'Doctor',
      Title: `${doc.Doctor_Name} (${doc.Specialization})`,
      Key_Details: `Degrees: ${doc.Degrees} | Department: ${doc.Department_BN} (${doc.Department_EN}) | Experience: ${doc.Experience_Years} yrs | Chamber: ${doc.Hospital_Name}, Room: ${doc.Chamber_Room} | Treats: ${doc.Treated_Diseases}`,
      Contact_Number: doc.Contact_Phone,
      Location_Address: `${doc.Hospital_Name}, ${doc.District}`,
      Schedule_Availability: `Days: ${doc.Available_Days_BN} (${doc.Visiting_Hours_Detailed})`,
      Pricing_Fee: `${doc.Consultation_Fee_BDT} ৳`,
      AI_Bot_Quick_Reply_Prompt: `${doc.Doctor_Name} (${doc.Specialization}) sits at ${doc.Hospital_Name} (Room ${doc.Chamber_Room}) on ${doc.Available_Days_BN}. Consultation Fee: ${doc.Consultation_Fee_BDT} BDT. Serial: ${doc.Contact_Phone}`,
    });
  });

  // Add Hospitals
  hospitalsData.forEach((h) => {
    masterAiData.push({
      Category: 'Hospital',
      Title: h.Hospital_Name,
      Key_Details: `Type: ${h.Hospital_Type} | Facilities: ${h.Available_Facilities} | Departments: ${h.Departments_Count} | Info: ${h.Description}`,
      Contact_Number: `${h.Phone} (Emergency: ${h.Emergency_Phone})`,
      Location_Address: `${h.Address}, ${h.District}`,
      Schedule_Availability: '24/7 Emergency & OPD',
      Pricing_Fee: 'Varies by test/service',
      AI_Bot_Quick_Reply_Prompt: `${h.Hospital_Name} is located at ${h.Address}. Phone: ${h.Phone}, Emergency: ${h.Emergency_Phone}. Facilities: ${h.Available_Facilities}`,
    });
  });

  // Add Emergency Helplines
  helplinesData.forEach((hl) => {
    masterAiData.push({
      Category: 'Emergency Helpline / Ambulance',
      Title: hl.Service_Title,
      Key_Details: `${hl.Description} (Badge: ${hl.Category_Badge})`,
      Contact_Number: hl.Helpline_Number,
      Location_Address: 'Chuadanga / Bangladesh',
      Schedule_Availability: '24/7 Available',
      Pricing_Fee: 'Standard govt / private rates',
      AI_Bot_Quick_Reply_Prompt: `For ${hl.Service_Title}, immediately call: ${hl.Helpline_Number} (Available 24/7).`,
    });
  });

  // Add Blood Donors
  bloodDonorsData.forEach((bd) => {
    masterAiData.push({
      Category: 'Blood Donor',
      Title: `${bd.Donor_Name} (${bd.Blood_Group})`,
      Key_Details: `Blood Group: ${bd.Blood_Group} | Age: ${bd.Age} | Gender: ${bd.Gender} | Area: ${bd.Area_Upazila} | Status: ${bd.Availability_Status}`,
      Contact_Number: bd.Phone,
      Location_Address: `${bd.Area_Upazila}, ${bd.Full_Address}`,
      Schedule_Availability: bd.Availability_Status === 'available' ? 'Available for Donation' : 'Currently Unavailable',
      Pricing_Fee: 'Free / Voluntary',
      AI_Bot_Quick_Reply_Prompt: `Blood Donor: ${bd.Donor_Name} (${bd.Blood_Group}) in ${bd.Area_Upazila}. Contact: ${bd.Phone}. Status: ${bd.Availability_Status}.`,
    });
  });

  // Write CSV files
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

  console.log('✅ Export successfully completed! Files created in:', exportDir);
  console.log(`- 1_ALL_IN_ONE_N8N_AI_MASTER.csv: ${masterAiData.length} records`);
  console.log(`- 2_DOCTORS.csv: ${doctorsData.length} records`);
  console.log(`- 3_HOSPITALS.csv: ${hospitalsData.length} records`);
  console.log(`- 4_EMERGENCY_AMBULANCE.csv: ${helplinesData.length} records`);
  console.log(`- 5_BLOOD_DONORS.csv: ${bloodDonorsData.length} records`);
}

main()
  .catch((e) => {
    console.error('Export error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
