import { Badge } from "@/components/ui/badge";

export function StatusBadge({ isActive }: { isActive: boolean }) {
  return (
    <Badge variant={isActive ? "default" : "destructive"}>
      {isActive ? "Activo" : "Inactivo"}
    </Badge>
  );
}
