import { UnwrapPromise, APIRequest } from "@/utils";
import type { NextApiRequest, NextApiResponse } from "next";

export default function wrapper<T extends (...args: any) => any>(
  callback: (
        args: APIRequest<Parameters<T>[0]>,
        req: NextApiRequest,
        res: NextApiResponse<UnwrapPromise<ReturnType<T>>>
    ) => Promise<UnwrapPromise<ReturnType<T>>>
) {
  return async function (
    req: NextApiRequest,
    res: NextApiResponse<UnwrapPromise<ReturnType<T>>>
  ) {
    var args = {};
    if (req.method === "GET") {
      args = req.query;
    } else {
      args = JSON.parse(req.body);
    }
    var result = await callback(args, req, res);
    res.status(200).json(result);
  };
}
