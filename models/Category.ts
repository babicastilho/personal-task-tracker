// 
/**
 * models/Category.ts
 * Defines the Category model and provides a factory function for creating categories.
 * 
 * The Category model includes fields such as name, slug, description, and userId,
 * which associates the category with a specific user.
 * 
 * @param data - Partial category data that includes name, slug, description, and userId.
 * @returns - A new ICategory instance with the necessary fields populated.
 * @throws - Throws an error if the category name is missing.
 */

import { ObjectId } from 'mongodb';

export interface ICategory {
  _id?: ObjectId;
  name: string;
  slug: string;
  description?: string;
  userId: ObjectId; // Associate the category with a user
}

export function createCategory(data: Partial<ICategory>): ICategory {
  if (!data.name) {
    throw new Error('Category name is required');
  }

  return {
    _id: data._id || new ObjectId(),
    name: data.name,
    slug: data.slug || data.name.toLowerCase().replace(/ /g, '-'),
    description: data.description || '',
    userId: data.userId!, // Ensure userId is provided when creating a category
  };
}
