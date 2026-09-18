export type OperationType = 'venda' | 'arrendamento';

export type PropertyType = 'Apartamento' | 'Moradia' | 'Penthouse' | 'Escritório' | 'Terreno';

export type NeighborhoodName = 
  | 'Polana'
  | 'Sommerschield'
  | 'Costa do Sol'
  | 'Triunfo'
  | 'Coop'
  | 'Matola';

export interface PropertyAgent {
  name: string;
  role: string;
  phone: string;
  email: string;
  photo: string;
}

export interface Property {
  id: string;
  slug: string;
  title: string;
  operation: OperationType;
  type: PropertyType;
  location: NeighborhoodName;
  neighborhood: string;
  city: string;
  address: string;
  price: number;
  priceDisplay: string;
  pricePeriod?: string; // '/mês' for rentals
  currency: string;
  bedrooms: number;
  bathrooms: number;
  suites?: number;
  area: number; // m²
  parking: number;
  yearBuilt?: number;
  featured: boolean;
  tag?: string; // 'Exclusivo', 'Novo no Mercado', 'Destaque'
  description: string;
  longDescription: string[];
  highlights: string[];
  amenities: string[];
  images: string[];
  agent: PropertyAgent;
  status: 'Disponível' | 'Reservado' | 'Em Negociação' | 'Arquivado';
}

export interface NeighborhoodInfo {
  id: string;
  name: NeighborhoodName;
  tagline: string;
  propertyCount: number;
  averagePriceSale: string;
  image: string;
  description: string;
}

export interface FilterState {
  searchQuery: string;
  operation?: OperationType;
  location: string;
  type: string;
  minPrice: number | '';
  maxPrice: number | '';
  bedrooms: string;
  sortBy: 'featured' | 'price-asc' | 'price-desc' | 'area-desc';
}

export interface VisitBookingData {
  id: string;
  propertyId: string;
  propertyTitle: string;
  fullName: string;
  phone: string;
  email: string;
  preferredDate: string;
  preferredTime: string;
  message: string;
  createdAt: string;
}

export interface ContactFormData {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  createdAt: string;
}
