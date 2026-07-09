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