import client from "@libs/server/client";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import { withAPiSession } from "@libs/server/withSession";
import { NextApiRequest, NextApiResponse } from "next";
async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ResponseType>
  ) {
    const { id } = req.query;
    const product = await client.product.findUnique({
      where: {
        id: +id.toString(),
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      },
    });
    console.log(product);
    res.json({ ok: true, product });
  }
  
  export default withAPiSession(
    withHandler({
      methods: ["GET"],
      handler,
    })
  );