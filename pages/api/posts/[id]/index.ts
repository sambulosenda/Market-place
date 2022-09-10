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
    const post = await client.post.findUnique({
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
        answers: {
          select: {
            answer: true,
            id: true,
            user: {
              select: {
                id: true,
                name: true,
                avatar: true,
              },
            },
          },
        },
        _count: {
          select: {
            answers: true,
            wondering: true,
          },
        },
      },
    });

    const isWondering = Boolean(
      await client.wondering.findFirst({
        where: {
          postId: post?.id,
          userId: user?.id,
        },
        select: {
          id: true,
        }
      })
    );


    res.json({
      ok: true,
      post,
      isWondering
    });
  }
  
  export default withAPiSession(
    withHandler({
      methods: ["GET"],
      handler,
    })
  );