import client from "@libs/server/client";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import { withAPiSession } from "@libs/server/withSession";
import { NextApiRequest, NextApiResponse } from "next";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
if (req.method === "GET") {
  const profile = await client.user.findUnique({
    where: { id: req.session.user?.id },
  });
  res.json({
    ok: true,
    profile,
  });
}
if (req.method === "POST") {
  const {
    session: { user },
    body: { email, phone, name, avatarId },
  } = req;
  const currentUser = await client.user.findUnique({
    where: {
      id: user?.id,
    },
  });
  if (email && email !== currentUser?.email) {
    const alreadyExists = Boolean(
      await client.user.findUnique({
        where: {
          email,
        },
        select: {
          id: true,
        },
      })
    );
    if (alreadyExists) {
      return res.json({
        ok: false,
        error: "Email already taken.",
      });
    }
    await client.user.update({
      where: {
        id: user?.id,
      },
      data: {
        email,
      },
    });
    res.json({ ok: true });
  }
  if (phone && phone !== currentUser?.phone) {
    const alreadyExists = Boolean(
      await client.user.findUnique({
        where: {
          phone,
        },
        select: {
          id: true,
        },
      })
    );
    if (alreadyExists) {
      return res.json({
        ok: false,
        error: "Phone already in use.",
      });
    }
    await client.user.update({
      where: {
        id: user?.id,
      },
      data: {
        phone,
      },
    });
    res.json({ ok: true });
  }
  if (name) {
    await client.user.update({
      where: {
        id: user?.id,
      },
      data: {
        name,
      },
    });
  }

  if (avatarId) {
    await client.user.update({
      where: {
        id: user?.id,
      },
      data: {
        avatar: avatarId,
      },
    });
  }
  res.json({ ok: true });
}

}


export default withAPiSession(
  withHandler({
    methods: ["GET", "POST"],
    handler,
  })
);
