import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function verifyAll() {
  console.log('--- 1. Testing Database Records ---');
  const [hospCount, docCount, deptCount, schedCount, donorCount, helpCount, testCount] = await Promise.all([
    prisma.hospital.count(),
    prisma.doctor.count(),
    prisma.department.count(),
    prisma.doctorSchedule.count(),
    prisma.bloodDonor.count(),
    prisma.emergencyHelpline.count(),
    prisma.diagnosticTest.count(),
  ]);

  console.log(`Hospitals: ${hospCount}`);
  console.log(`Doctors: ${docCount}`);
  console.log(`Departments: ${deptCount}`);
  console.log(`Doctor Schedules: ${schedCount}`);
  console.log(`Blood Donors: ${donorCount}`);
  console.log(`Emergency Helplines: ${helpCount}`);
  console.log(`Diagnostic Tests: ${testCount}`);

  if (docCount === 0 || hospCount === 0) {
    throw new Error('Database is missing doctors or hospitals!');
  }

  console.log('--- 2. Testing Doctor Search Sample ---');
  const cardioDocs = await prisma.doctor.findMany({
    where: {
      OR: [
        { specialization: { contains: 'Cardiologist' } },
        { department: { nameEn: { contains: 'Cardiology' } } },
      ],
    },
    include: {
      hospital: true,
      department: true,
      schedules: true,
    },
  });
  console.log(`Found ${cardioDocs.length} Cardiologists:`);
  cardioDocs.forEach((d) => {
    console.log(`- ${d.name} (${d.specialization}) at ${d.hospital.name}, Fee: ${d.consultationFee} BDT, Schedules: ${d.schedules.length} days`);
  });

  console.log('--- 3. Testing Hospital Lookup Sample ---');
  const evercare = await prisma.hospital.findFirst({
    where: { slug: 'evercare-hospital-chuadanga' },
    include: {
      doctors: true,
      facilities: true,
      departments: true,
    },
  });
  if (evercare) {
    console.log(`Hospital: ${evercare.name}`);
    console.log(`Facilities: ${evercare.facilities.map((f) => f.facilityName).join(', ')}`);
    console.log(`Total Doctors attached: ${evercare.doctors.length}`);
  }

  console.log('✅ ALL DATABASE VERIFICATIONS PASSED SUCCESSFULLY!');
}

verifyAll()
  .catch((e) => {
    console.error('❌ Verification failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
