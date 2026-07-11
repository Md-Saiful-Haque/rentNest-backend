
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

export interface IUpdateProperty {
  title?: string;
  description?: string;
  price?: number;
  address?: string;
  city?: string;
  bedrooms?: number;
  bathrooms?: number;
  categoryId?: string;
  amenities?: string[];
}

export interface FilterProperty {
  location?: string;
  minPrice?: string;
  maxPrice?: string;
  categoryId?: string;
  bedrooms?: string;
}