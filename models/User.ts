// 
/**
 * models/User.ts
 * Defines the User model, password utilities, and a factory function for creating users.
 * 
 * The User model includes fields like username, email, password, firstName, lastName,
 * nickname, bio, and profilePicture. Password hashing and verification are implemented
 * for secure authentication.
 * 
 * @param password - The user's plain text password.
 * @param hashedPassword - The user's hashed password for verification.
 * @param usersCollection - MongoDB collection for storing user documents.
 * @param user - An IUser document instance to be created and saved in the database.
 * @returns - For createUser, returns the newly created user document with an ID.
 * @throws - Throws an error if password hashing fails.
 */

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
