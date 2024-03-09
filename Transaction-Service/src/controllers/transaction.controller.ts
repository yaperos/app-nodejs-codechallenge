import { Response, Request } from "express";

export const postTransaction = async ( req: Request, res: Response ): Promise<void> => {
  res.status( 200 ).json( { message: "Hello!" } );
};