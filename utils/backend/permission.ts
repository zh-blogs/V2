import DB from "@/utils/backend/db";

export async function checkPermission(token: string) {
  const permission = await DB.getUser({ token });
  
  return !!permission.message && !!permission.data && !!permission.data.admin;
}
