// models/Category.ts
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
