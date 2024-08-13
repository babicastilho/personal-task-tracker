// models/Category.ts
import { ObjectId } from 'mongodb';

export interface ICategory {
  _id?: ObjectId;
  name: string;
  slug: string;
  description?: string;
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
  };
}
