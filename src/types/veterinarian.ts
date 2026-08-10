export interface Veterinarian {
  id: string;
  name: string;
  slug: string;
  license_number: string | null;
  description: string | null;
  phone: string;
  whatsapp: string | null;
  email: string | null;
  website: string | null;
  instagram: string | null;
  address: string;
  city_id: string;
  is_active: boolean;
  is_24h: boolean;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface VeterinarianWithRelations extends Veterinarian {
  cities?: { name: string };
  veterinarian_specialties?: {
    specialty_id: string;
    specialties: { id: string; name: string };
  }[];
}
