// models/User.ts
import { Collection, Document } from 'mongodb';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
}

export const hashPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, 10);
};

export const verifyPassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  return await bcrypt.compare(password, hashedPassword);
};

export const createUser = async (usersCollection: Collection<IUser>, user: IUser): Promise<void> => {
  user.password = await hashPassword(user.password);
  await usersCollection.insertOne(user);
};
