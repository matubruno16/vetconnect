import type { MetadataRoute } from "next";
import { createClient } from "@supabase/supabase-js";

const BASE_URL = "https://vetconnect-tandil.vercel.app";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );

  const [{ data: veterinarians }, { data: lostPets }] = await Promise.all([
    supabase
      .from("veterinarians")
      .select("slug, updated_at")
      .eq("is_active", true),
    supabase
      .from("lost_pets")
      .select("id, created_at")
      .eq("status", "lost"),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${BASE_URL}/perdidos`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/perdidos/reportar`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.4,
    },
    {
      url: `${BASE_URL}/registrarse`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  const veterinarianRoutes: MetadataRoute.Sitemap = (veterinarians ?? []).map(
    (vet) => ({
      url: `${BASE_URL}/veterinaria/${vet.slug}`,
      lastModified: vet.updated_at ? new Date(vet.updated_at) : new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    }),
  );

  const lostPetRoutes: MetadataRoute.Sitemap = (lostPets ?? []).map((pet) => ({
    url: `${BASE_URL}/perdidos/${pet.id}`,
    lastModified: pet.created_at ? new Date(pet.created_at) : new Date(),
    changeFrequency: "daily",
    priority: 0.6,
  }));

  return [...staticRoutes, ...veterinarianRoutes, ...lostPetRoutes];
}
