import { withIronSessionApiRoute } from "iron-session/next";

const cookieOptions = {
  cookieName: "myapp_cookiename",
  password: "complex_password_at_least_32_characters_long",
};

declare module "iron-session" {
  interface IronSessionData {
    user?: {
      id: number;
    };
  }
}

export function withAPiSession(fn: any) {
  return withIronSessionApiRoute(fn, cookieOptions);
}
