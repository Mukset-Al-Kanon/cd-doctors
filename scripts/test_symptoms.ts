async function testQueries() {
  const queries = [
    'amar majai batha ki korbo',
    'buke betha heart er doctor',
    'bacchar jor thanda',
    'chul pora bondho korar doctor',
    'dante batha ki korbo',
    'pet betha gas er problem',
  ];

  for (const q of queries) {
    const res = await fetch(`http://localhost:3000/api/ai/query-master?query=${encodeURIComponent(q)}&apiKey=cddoctors_n8n_sec_key_2026`);
    const data = await res.json();
    console.log(`\nQuery: "${q}" -> Detected: [${data.detected_specialties.join(', ')}]`);
    console.log(`Found ${data.doctors.length} doctors. Top: ${data.doctors[0]?.name} (${data.doctors[0]?.specialization})`);
  }
}

testQueries();
