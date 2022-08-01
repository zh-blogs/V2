import { shouldString } from "@/utils";
import wrapper from "@/utils/backend/api";
import DB from "@/utils/backend/db";
import { checkPermission } from "@/utils/backend/permission";
import { Result } from "@/utils/types";

export default wrapper<
  (_: { token: string; key: string; value: any }) => Promise<Result<any>>
>(async (args, req) => {
  if (!(await checkPermission(shouldString(args.token)))) {
    return { success: false, message: "You do not has permission" };
  }

  if (req.method === "GET") {
    return await DB.getSetting({
      key: shouldString(args.key),
    });
  } else if (req.method === "POST") {
    return await DB.setSetting({
      key: shouldString(args.key),
      value: args.value,
    });
  }

  return { success: false, message: "Method not allowed" };
});
