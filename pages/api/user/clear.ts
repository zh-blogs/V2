import { shouldString, Result } from "@/utils";
import wrapper from "@/utils/backend/api";
import DB from "@/utils/backend/db";
import { checkPermission } from "@/utils/backend/permission";

export default wrapper<(_: { token: string }) => Promise<Result<any>>>(
  async (args, req) => {
    if (!(await checkPermission(shouldString(args.token)))) {
      return { success: false, message: "You do not has permission" };
    }

    if (req.method === "GET") {
      return await DB.clearToken();
    }

    return { success: false, message: "Method not allowed" };
  },
);
