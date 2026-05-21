export type ProfileRole = "cliente" | "desarrollador";

export type ProfileRow = {
  id: string;
  role: ProfileRole;
};

export function dashboardPathForRole(role: ProfileRole | string | null | undefined): string {
  if (role === "cliente") return "/dashboard/cliente";
  if (role === "desarrollador") return "/dashboard/desarrollador";
  return "/";
}
