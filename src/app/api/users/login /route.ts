import { connect } from '@/dbConfig/dbConfig';
import User from '@/models/userModel';
import { NextResponse, NextRequest } from 'next/server';
import bcryptjs from 'bcryptjs';

connect();

export async function POST(request: NextRequest) {
  const reqBody = await request.json();
  const { email, password } = reqBody;

  let user = await User.findOne(email);

  if (!user) {
    return NextResponse.json({ error: 'User does not exist' }, { status: 400 });
  }
  

}
