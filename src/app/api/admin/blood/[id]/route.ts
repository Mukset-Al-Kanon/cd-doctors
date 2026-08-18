import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAuth } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const donor = await db.bloodDonor.findUnique({
      where: { id: params.id },
    });
    if (!donor) {
      return NextResponse.json({ error: 'Donor not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, donor });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {

  try {
    await requireAuth(['SUPER_ADMIN', 'OWNER_ADMIN']);
    const donorId = params.id;
    const body = await request.json();

    const existing = await db.bloodDonor.findUnique({
      where: { id: donorId },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Donor not found' }, { status: 404 });
    }

    const updateData: any = {};

    if (body.status !== undefined) {
      updateData.status = body.status;
      if (body.status === 'approved' && existing.status !== 'approved') {
        updateData.approvedAt = new Date();
      }
    }

    if (body.availability !== undefined) {
      updateData.availability = body.availability;
    }

    if (body.fullName !== undefined) updateData.fullName = body.fullName.trim();
    if (body.phone !== undefined) updateData.phone = body.phone.trim();
    if (body.bloodGroup !== undefined) updateData.bloodGroup = body.bloodGroup;
    if (body.age !== undefined) updateData.age = Number(body.age);
    if (body.gender !== undefined) updateData.gender = body.gender;
    if (body.address !== undefined) updateData.address = body.address.trim();
    if (body.area !== undefined) updateData.area = body.area.trim();
    if (body.lastDonationDate !== undefined) updateData.lastDonationDate = body.lastDonationDate;
    if (body.note !== undefined) updateData.note = body.note ? body.note.trim() : null;

    const updatedDonor = await db.bloodDonor.update({
      where: { id: donorId },
      data: updateData,
    });

    return NextResponse.json({ success: true, donor: updatedDonor });
  } catch (error: any) {
    if (error.message === 'UNAUTHORIZED' || error.message === 'FORBIDDEN') {
      return NextResponse.json({ error: 'Unauthorized access' }, { status: 401 });
    }
    return NextResponse.json(
      { error: error.message || 'Failed to update donor' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await requireAuth(['SUPER_ADMIN', 'OWNER_ADMIN']);
    const donorId = params.id;

    await db.bloodDonor.delete({
      where: { id: donorId },
    });

    return NextResponse.json({ success: true, message: 'Donor deleted successfully' });
  } catch (error: any) {
    if (error.message === 'UNAUTHORIZED' || error.message === 'FORBIDDEN') {
      return NextResponse.json({ error: 'Unauthorized access' }, { status: 401 });
    }
    return NextResponse.json(
      { error: error.message || 'Failed to delete donor' },
      { status: 500 }
    );
  }
}
