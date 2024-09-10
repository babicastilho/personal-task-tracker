// models/User.ts
import { Collection, Document, ObjectId } from 'mongodb';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  _id: ObjectId;
  username: string;
  email: string;
  password: string;
  firstName?: string;  // New field: first name
  lastName?: string;   // New field: last name
  nickname?: string;   // New field: nickname
  bio?: string;       // New field: bio (optional)
  profilePicture?: string; // New field: profile picture (optional, URL to the image)
}

export const hashPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, 10);
};

export const verifyPassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  return await bcrypt.compare(password, hashedPassword);
};

export const createUser = async (usersCollection: Collection<IUser>, user: IUser): Promise<IUser> => {
  user.password = await hashPassword(user.password);
  const result = await usersCollection.insertOne(user);
  return { ...user, _id: result.insertedId };
};
