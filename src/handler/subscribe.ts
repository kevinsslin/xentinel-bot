import { HandlerContext } from "@xmtp/message-kit";
import { createClient } from "@libsql/client";
// Handler function to process game-related commands
export async function handler(context: HandlerContext) {

  if (`${process.env.webhook}` === "true") {
    return;
  }

  const turso = createClient({
      url: `${process.env.TURSO_DATABASE_URL}`,
      authToken: `${process.env.TURSO_AUTH_TOKEN}`,
  });

  const {
    message: {
      content: { command, params },
    },
  } = context;

  const email = params?.email;
  const subscriber = context.message.sender.address;

  console.log(`Subscriber ${subscriber} requested to subscribe.`);
  console.log(`Email: ${email}`);

  try {
    const existingSubscriber = await turso.execute({
      sql: "SELECT * FROM subscribers WHERE address = $sub",
      args: { sub: subscriber },
    });

    if (existingSubscriber.rows.length > 0) {
      await context.reply(`Subscriber ${subscriber} already exists.`);
      console.log(`Subscriber ${subscriber} already exists.`);
      return;
    }

    if (email) {
      const existingEmail = await turso.execute({
        sql: "SELECT * FROM subscribers WHERE email = $email",
        args: { email: email },
      });

      if (existingEmail.rows.length > 0) {
        await context.reply(`Email ${email} is already associated with another subscriber.`);
        console.log(`Email ${email} is already associated with another subscriber.`);
        return;
      }
    }

    if (email) {
      await turso.execute({
        sql: "INSERT INTO subscribers (address, email, subscribe_time) VALUES ($sub, $email, CURRENT_TIMESTAMP)",
        args: { sub: subscriber, email: email },
      });
    } else {
      await turso.execute({
        sql: "INSERT INTO subscribers (address, subscribe_time) VALUES ($sub, CURRENT_TIMESTAMP)",
        args: { sub: subscriber },
      });
    }
    
    await context.reply(`Subscriber ${subscriber} added successfully.`);
    console.log(`Subscriber ${subscriber} added successfully.`);
  } catch (error) {
    console.error(`Error adding subscriber ${subscriber}:`, error);
  }
}