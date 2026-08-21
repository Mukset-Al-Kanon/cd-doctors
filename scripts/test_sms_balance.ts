async function testSmsNetBd() {
  const apiKey = 'g6VBfFh27Mc5S2Xcvg20ZhueNatYM3tDP0S2X6qU';
  console.log('--- 1. Checking Balance on sms.net.bd ---');
  const balRes = await fetch(`https://api.sms.net.bd/user/balance/?api_key=${apiKey}`);
  const balData = await balRes.json();
  console.log('Balance Response:', balData);
}

testSmsNetBd();
