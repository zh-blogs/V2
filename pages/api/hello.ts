// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { promiselized, shouldString } from "@/utils";
import { testApi } from "@/utils/api";
import wrapper from "@/utils/backend/api";

export default wrapper<typeof testApi>(
  promiselized((args, req) => {
    if (req.method === "GET") {
      return { "success": true, data: { name: shouldString(args.name, "World") } };
    } 
    
    return { "success": false, "message": "Method not allowed" };
    
  })
);

