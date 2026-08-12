"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function HomeFilters({
  cities,
  specialties,
}: {
  cities: any[];
  specialties: any[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());

    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    router.push(`/?${params.toString()}`);
  }

  function toggleBoolean(key: string, checked: boolean) {
    const params = new URLSearchParams(searchParams.toString());

    if (checked) {
      params.set(key, "true");
    } else {
      params.delete(key);
    }

    router.push(`/?${params.toString()}`);
  }

  return (
    <div className="mb-8 space-y-4 rounded-xl border p-4">
      <input
        placeholder="Buscar veterinaria..."
        className="w-full rounded-md border px-3 py-2"
        defaultValue={searchParams.get("search") || ""}
        onChange={(e) => updateParam("search", e.target.value)}
      />

      <select
        className="w-full rounded-md border px-3 h-8 text-sm"
        defaultValue={searchParams.get("city") || ""}
        onChange={(e) => updateParam("city", e.target.value)}
      >
        <option value="">Todas las ciudades</option>
        {cities.map((city) => (
          <option key={city.id} value={city.id}>
            {city.name}
          </option>
        ))}
      </select>

      <select
        className="w-full rounded-md border px-3 h-8 text-sm"
        defaultValue={searchParams.get("specialty") || ""}
        onChange={(e) => updateParam("specialty", e.target.value)}
      >
        <option value="">Todas las especialidades</option>
        {specialties.map((specialty) => (
          <option key={specialty.id} value={specialty.id}>
            {specialty.name}
          </option>
        ))}
      </select>

      <div className="flex flex-col gap-3">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            defaultChecked={searchParams.get("open24") === "true"}
            onChange={(e) => toggleBoolean("open24", e.target.checked)}
          />
          Solo 24 horas
        </label>

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            defaultChecked={searchParams.get("featured") === "true"}
            onChange={(e) => toggleBoolean("featured", e.target.checked)}
          />
          Solo destacadas
        </label>
      </div>
    </div>
  );
}