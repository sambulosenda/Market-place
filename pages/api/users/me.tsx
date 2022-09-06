import client from "@libs/server/client";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import { withIronSessionApiRoute } from "iron-session/next";
import { NextApiRequest, NextApiResponse } from "next";

declare module "iron-session" {
  interface IronSessionData {
    user?: {
      id: number;
    };
  }
}
async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  console.log(req.session.user)
  const profile = await client.user.findUnique({
    where: {
        id: req.session.user?.id
    }
  })
  console.log(profile)
  res.json({
    ok: true,
    profile 

  })

}

export default withIronSessionApiRoute(withHandler("GET", handler), {
  cookieName: "myapp_cookiename",
  password: "complex_password_at_least_32_characters_long",
  // secure: true should be used in production (HTTPS) but can't be used in development (HTTP)
  //   cookieOptions: {
  //     secure: process.env.NODE_ENV === "production",
  //   },
});
