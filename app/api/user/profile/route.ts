import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { auth } from '@/auth'
import bcrypt from 'bcryptjs'
import { updateProfileSchema } from '@/lib/zod-schemas'
import { z } from 'zod'

export async function PUT(req: Request) {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const validatedData = updateProfileSchema.parse(body)

    // Fetch user from DB
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const updateData: any = {
      name: validatedData.name,
    }

    // Handle password update
    if (validatedData.newPassword) {
      // Verify current password
      const isPasswordValid = await bcrypt.compare(validatedData.currentPassword!, user.password)
      if (!isPasswordValid) {
        return NextResponse.json({ error: 'รหัสผ่านเดิมไม่ถูกต้อง' }, { status: 400 })
      }
      
      // Hash new password
      const hashedNewPassword = await bcrypt.hash(validatedData.newPassword, 10)
      updateData.password = hashedNewPassword
    }

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      }
    })

    return NextResponse.json({ message: 'อัปเดตข้อมูลสำเร็จ', user: updatedUser })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation Error', details: error.flatten().fieldErrors }, { status: 400 })
    }
    console.error('Error updating profile:', error)
    return NextResponse.json({ error: 'เกิดข้อผิดพลาดในการอัปเดตข้อมูล' }, { status: 500 })
  }
}
