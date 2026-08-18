import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAuth } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    // Require logged in user session first
    const session = await requireAuth();

    const body = await request.json();
    const {
      fullName,
      phone,
      bloodGroup,
      age,
      gender,
      address,
      area,
      availability,
      lastDonationDate,
      note,
      consent,
    } = body;

    // Data validation
    if (!fullName || typeof fullName !== 'string' || fullName.trim().length === 0) {
      return NextResponse.json({ error: 'Full name is required.' }, { status: 400 });
    }

    if (!phone || typeof phone !== 'string') {
      return NextResponse.json({ error: 'Mobile number is required.' }, { status: 400 });
    }

    // Validate Bangladesh phone number format (11 digits starting with 01)
    const cleanedPhone = phone.trim();
    const bdPhoneRegex = /^01[3-9]\d{8}$/;
    if (!bdPhoneRegex.test(cleanedPhone)) {
      return NextResponse.json(
        { error: 'Please enter a valid Bangladesh mobile number (e.g. 01712345678).' },
        { status: 400 }
      );
    }

    const validBloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
    if (!bloodGroup || !validBloodGroups.includes(bloodGroup)) {
      return NextResponse.json(
        { error: 'Please select a valid blood group.' },
        { status: 400 }
      );
    }

    const numAge = Number(age);
    if (isNaN(numAge) || numAge < 18 || numAge > 65) {
      return NextResponse.json(
        { error: 'Age must be between 18 and 65 years.' },
        { status: 400 }
      );
    }

    if (!address || typeof address !== 'string' || address.trim().length === 0) {
      return NextResponse.json({ error: 'Address is required.' }, { status: 400 });
    }

    if (!area || typeof area !== 'string' || area.trim().length === 0) {
      return NextResponse.json({ error: 'Area / Upazila selection is required.' }, { status: 400 });
    }

    if (!consent) {
      return NextResponse.json(
        { error: 'You must agree to the privacy consent to register as a donor.' },
        { status: 400 }
      );
    }

    // Check duplicate phone
    const existingDonor = await db.bloodDonor.findUnique({
      where: { phone: cleanedPhone },
    });

    if (existingDonor) {
      return NextResponse.json(
        { error: 'This mobile number is already registered as a donor.' },
        { status: 400 }
      );
    }

    // Create donor record with status: pending
    const newDonor = await db.bloodDonor.create({
      data: {
        fullName: fullName.trim(),
        phone: cleanedPhone,
        bloodGroup,
        age: numAge,
        gender: gender || 'Other',
        address: address.trim(),
        area: area.trim(),
        availability: availability === 'unavailable' ? 'unavailable' : 'available',
        lastDonationDate: lastDonationDate || null,
        note: note ? note.trim() : null,
        consent: Boolean(consent),
        status: 'pending',
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Registration submitted successfully for admin review.',
      donorId: newDonor.id,
    });
  } catch (error: any) {
    if (error.message === 'UNAUTHORIZED') {
      return NextResponse.json(
        { error: 'You must log in or register an account on CD Doctors before registering as a blood donor.' },
        { status: 401 }
      );
    }
    return NextResponse.json(
      { error: error.message || 'Failed to submit registration' },
      { status: 500 }
    );
  }
}
