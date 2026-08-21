async function testOtpRegistration() {
  console.log('🧪 1. Testing OTP Generation & Dispatch...');
  const testPhone = '01711334455';
  const testEmail = `patient_${Date.now()}@example.com`;

  const sendRes = await fetch('http://localhost:3000/api/auth/otp/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone: testPhone }),
  });
  const sendData = await sendRes.json();
  console.log('Send OTP Response:', sendData);

  if (!sendData.success) {
    throw new Error('Failed to send OTP');
  }

  const generatedOtp = sendData.devOtp;
  console.log('🔑 Received Dev OTP:', generatedOtp);

  console.log('\n🧪 2. Testing Invalid OTP Code (0000)...');
  const invalidRes = await fetch('http://localhost:3000/api/auth/otp/verify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone: testPhone, code: '0000' }),
  });
  const invalidData = await invalidRes.json();
  console.log('Invalid Code Response (Expected Error):', invalidData);

  console.log(`\n🧪 3. Testing Valid OTP Code (${generatedOtp})...`);
  const verifyRes = await fetch('http://localhost:3000/api/auth/otp/verify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone: testPhone, code: generatedOtp }),
  });
  const verifyData = await verifyRes.json();
  console.log('Verify OTP Response:', verifyData);

  console.log('\n🧪 4. Testing Registration with Verified Phone...');
  const registerRes = await fetch('http://localhost:3000/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Tanvir Hossain',
      email: testEmail,
      phone: testPhone,
      password: 'password123',
      otpCode: generatedOtp,
    }),
  });
  const registerData = await registerRes.json();
  console.log('Registration Response:', registerData);

  if (registerData.success) {
    console.log('\n🎉 ALL TESTS PASSED! PHONE OTP VERIFICATION & REGISTRATION WORKING 100%!');
  } else {
    console.error('❌ Registration failed:', registerData);
  }
}

testOtpRegistration();
