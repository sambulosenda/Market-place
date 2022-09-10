import client from "@libs/server/client";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import { withAPiSession } from "@libs/server/withSession";
import { NextApiRequest, NextApiResponse } from "next";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const {
    body: { question },
    session: { user },
  } = req;
  const post = await client.post.create({
    data: {
      question,
      user: {
        connect: {
          id: user?.id,
        },
      },
    },
  });
  res.json({
    ok: true,
    post,
  });
}

export default withAPiSession(
  withHandler({
    methods: ["POST"],
    handler,
  })
);
