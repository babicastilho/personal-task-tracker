// 
/**
 * app/api/auth/login/route.ts
 * Handles user login requests and generates JWT tokens for authenticated users.
 * 
 * Validates email and password, checks for the user in the database, verifies 
 * the password, and generates a JWT token upon successful authentication. 
 * Returns appropriate responses based on validation and authentication results.
 * 
 * @param request - The POST request containing email and password in JSON format.
 * @returns A JSON response with success status, JWT token if authenticated, or error message.
 */

import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { verifyPassword, IUser } from '@/models/User';
import { generateToken } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    // Verificar se os campos estão presentes
    if (!email || !password) {
      return NextResponse.json({
        success: false,
        message: 'Email and password are required',
      }, { status: 400 });
    }

    // Conectar ao banco de dados
    const db = await dbConnect();
    const usersCollection = db.collection<IUser>('users');

    // Encontrar o usuário no banco de dados
    const user = await usersCollection.findOne({ email });
    if (!user) {
      return NextResponse.json({
        success: false,
        message: 'User not found',
      }, { status: 404 });
    }

    // Verificar se a senha é válida
    const isMatch = await verifyPassword(password, user.password);
    if (!isMatch) {
      return NextResponse.json({
        success: false,
        message: 'Invalid credentials',
      }, { status: 401 });
    }

    // Gerar o token JWT
    const token = generateToken(user._id.toString());

    // Retornar sucesso com o token
    return NextResponse.json({
      success: true,
      token,
      message: 'Logged in successfully',
    }, { status: 200 });

  } catch (error) {
    // Tratar erros inesperados e retornar 500
    return NextResponse.json({
      success: false,
      message: 'Internal server error',
      error: (error as Error).message,
    }, { status: 500 });
  }
}
