import client from "@libs/server/client";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import { withAPiSession } from "@libs/server/withSession";
import { NextApiRequest, NextApiResponse } from "next";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const {
    query: { id },
    session: { user },
  } = req;

  const alreadyExist = await client.wondering.findFirst({
    where: {
      postId: +id.toString(),
      userId: user?.id,
    },
  });

  if (alreadyExist) {
    await client.wondering.delete({
      where: {
        id: alreadyExist.id,
      },
    });
  } else {
    await client.wondering.create({
      data: {
        user: {
          connect: {
            id: user?.id,
          },
        },
        post: {
          connect: {
            id: +id.toString(),
          },
        },
      },
    });
  }
  res.json({ ok: true });
}

export default withAPiSession(
  withHandler({
    methods: ["POST"],
    handler,
  })
);
