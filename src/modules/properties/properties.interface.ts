import { PropertyWhereInput } from "../../../generated/prisma/models";

export interface PropertyInput {
  title: string;
  description: string;
  price: number;
  address: string;
  city: string;
  bedrooms: number;
  bathrooms: number;
  categoryId: string;
  amenities?: string[];
}

export interface IPropertyQuery extends PropertyWhereInput {
    sortby?: string 
    sortOrder?: string,
    searchTerm?: string
}