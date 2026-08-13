import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function DashboardPage() {
  const supabase = await createClient();

  const [total, active, open24, cities, specialties] = await Promise.all([
    supabase.from("veterinarians").select("*", { count: "exact", head: true }),
    supabase
      .from("veterinarians")
      .select("*", { count: "exact", head: true })
      .eq("is_active", true),
    supabase
      .from("veterinarians")
      .select("*", { count: "exact", head: true })
      .eq("is_24h", true),
    supabase.from("cities").select("*", { count: "exact", head: true }),
    supabase.from("specialties").select("*", { count: "exact", head: true }),
  ]);

  const stats = [
    { label: "Total Veterinarias", value: total.count ?? 0 },
    { label: "Activas", value: active.count ?? 0 },
    { label: "24 Horas", value: open24.count ?? 0 },
    { label: "Ciudades", value: cities.count ?? 0 },
    { label: "Especialidades", value: specialties.count ?? 0 },
  ];

  return (
    <div className="max-w-4xl space-y-6 mx-auto">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Panel administrativo de veterinarios
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-5">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader>
              <CardTitle>{stat.label}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
