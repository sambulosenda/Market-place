import client from "@libs/server/client";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import mail from "@sendgrid/mail";
import { NextApiRequest, NextApiResponse } from "next";
import twilio from "twilio";

const twilioClient = twilio(process.env.TWITLO_SID, process.env.TWILIO_TOKEN);
mail.setApiKey(process.env.SENDGRID_API);

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const { phone, email } = req.body;
  const payload = Math.floor(100000 + Math.random() * 900000) + "";
  const user = await client.user.upsert({
    where: {
      ...(phone ? { phone: +phone } : {}),
      ...(email ? { email } : {}),
    },
    create: {
      name: "Anonymous",
      ...(phone ? { phone: +phone } : {}),
      ...(email ? { email } : {}),
    },
    update: {},
  });
  if (!user) {
    return res.status(400).json({ ok: false });
  }
  // if (email) {
  //   user = await client.user.findUnique({
  //     where: {
  //       email,
  //     },
  //   });
  //   if (user) console.log("found it.");
  //   if (!user) {
  //     console.log("Did not find. Will create.");
  //     user = await client.user.create({
  //       data: {
  //         name: "Anonymous",
  //         email,
  //       },
  //     });
  //   }
  //   console.log(user);
  // }
  // if (phone) {
  //   user = await client.user.findUnique({
  //     where: {
  //       phone: +phone,
  //     },
  //   });
  //   if (user) console.log("found it.");
  //   if (!user) {
  //     console.log("Did not find. Will create.");
  //     user = await client.user.create({
  //       data: {
  //         name: "Anonymous",
  //         phone: +phone,
  //       },
  //     });
  //   }
  //   console.log(user);
  // }

  const token = await client.token.create({
    data: {
      payload,
      user: {
        connect: {
          id: user.id,
        },
      },
    },
  });

  if (phone) {
    // const message = await twilioClient.messages.create({
    //   messagingServiceSid: process.env.TWILIO_MSID,
    //   to: process.env.TWILIO_PHONE!,
    //   body: `Your login token is ${payload}.`,
    // });
    // console.log(message);
  } else if (mail) {
    // const email = await mail.send({
    //   to: 'sambulosendas1@gmail.com', // Change to your recipient
    //   from: 'sambulosendas@gmail.com', // Change to your verified sender
    //   subject: 'Sending with SendGrid is Fun',
    //   text: `Your login token is ${payload}.`,
    //   html: `Your login token is ${payload}.`,
    // })
    // console.log(email)
  }
  return res.json({
    ok: true,
  });
}

export default withHandler("POST", handler);
