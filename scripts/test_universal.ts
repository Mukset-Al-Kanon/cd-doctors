import { PrismaClient } from '@prisma/client';
import { CD_DOCTORS_PLATFORM_KNOWLEDGE } from '../src/lib/platformKnowledge';

const prisma = new PrismaClient();

async function testUniversal() {
  console.log('--- Testing Entire Website Dataset ---');
  const [docs, hosps, donors, emergencies, tests] = await Promise.all([
    prisma.doctor.findMany({ select: { name: true } }),
    prisma.hospital.findMany({ select: { name: true } }),
    prisma.bloodDonor.findMany({ select: { fullName: true, bloodGroup: true } }),
    prisma.emergencyHelpline.findMany({ select: { title: true, number: true } }),
    prisma.diagnosticTest.findMany({ select: { name: true } }),
  ]);

  console.log(`1. Total Doctors in Database: ${docs.length}`);
  console.log(`2. Total Hospitals in Database: ${hosps.length}`);
  console.log(`3. Total Blood Donors in Database: ${donors.length}`);
  console.log(`4. Total Emergency Helplines in Database: ${emergencies.length}`);
  console.log(`5. Total Diagnostic Tests in Database: ${tests.length}`);
  console.log(`6. Total Platform Knowledge Topics: ${CD_DOCTORS_PLATFORM_KNOWLEDGE.length}`);

  console.log('✅ ALL WEBSITE CATEGORIES SUCCESSFULLY LOADED!');
}

testUniversal()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
