import DB from "@/utils/backend/db";

export async function checkPermission(token: string) {
  const permission = await DB.getUser({ token });

  return !!permission.success && !!permission.data && !!permission.data.admin;
}
