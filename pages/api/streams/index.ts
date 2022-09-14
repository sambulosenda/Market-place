import client from "@libs/server/client";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import { withAPiSession } from "@libs/server/withSession";
import { NextApiRequest, NextApiResponse } from "next";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const {
    session: { user },
    body: { name, price, description },
  } = req;
  if (req.method === "POST") {
    const stream = await client.stream.create({
      data: {
        name,
        price,
        description,
        user: {
          connect: {
            id: user?.id,
          },
        },
      },
    });
    res.json({ ok: true, stream });
  } else if (req.method === "GET") {
    const streams = await client.stream.findMany({
      take: 5,
    });
    res.json({ ok: true, streams });
  }
}

export default withAPiSession(
  withHandler({
    methods: ["GET", "POST"],
    handler,
  })
);
