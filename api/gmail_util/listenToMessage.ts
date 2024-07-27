import { PubSub, Message } from "@google-cloud/pubsub";
import { getHistoryRecords } from "../controller/gmailController";
import prisma from "../db/database";

function listenForMessages(subscriptionNameOrId: string): void {
  // References an existing subscription
  try {
    const gCloudClientEmail = process.env.GOOGLE_CLOUD_CLIENT_EMAIL;
    // const gCloudPrivateKey = process.env.GOOGLE_CLOUD_PRIVATE_KEY?.replace(
    //   /^"|"$/g,
    //   ""
    // )
    //   .split(String.raw`\n`)
    //   .join("\n");

    const gCloudProjectId = process.env.GOOGLE_CLOUD_PROJECT_ID;

    // console.log(
    //   Buffer.from(process.env.GOOGLE_ENCODED_KEY!, "base64")
    //     .toString()
    //     .replace(/^"|"$/g, "")
    //     .split(String.raw`\n`)
    //     .join("\n")
    // );

    // console.log(
    //   process.env.GOOGLE_CLOUD_PRIVATE_KEY?.replace(/^"|"$/g, "")
    //     .split(String.raw`\n`)
    //     .join("\n")
    // );

    const gCloudPrivateKey = Buffer.from(
      process.env.GOOGLE_ENCODED_KEY!,
      "base64"
    )
      .toString()
      .replace(/^"|"$/g, "")
      .split(String.raw`\n`)
      .join("\n");

    if (!gCloudClientEmail || !gCloudPrivateKey || !gCloudProjectId) {
      throw new Error(
        "Error: please ensure [GOOGLE_CLOUD_CLIENT_EMAIL], [GOOGLE_CLOUD_PRIVATE_KEY] or [GOOGLE_CLOUD_PROJECT_ID] .env variables are properly stored"
      );
    }

    // const formattedPrivateKey = gCloudPrivateKey.replace(/\\n/g, "\n");

    const pubSubClient = new PubSub({
      projectId: gCloudProjectId,
      credentials: {
        client_email: gCloudClientEmail,
        private_key: gCloudPrivateKey,
      },
    });

    const subscription = pubSubClient.subscription(subscriptionNameOrId);

    // Create an event handler to handle messages
    const messageHandler = async (message: Message) => {
      message.ack();

      const newMessage = message.data.toString();
      console.log("\n");
      console.log("Received message:", newMessage);

      // const newMessageObj = JSON.parse(newMessage);

      const fetchHistoryId = await prisma.email_history_dev.findUnique({
        where: {
          id: 1,
        },
        select: {
          history_id: true,
        },
      });

      const historyId: bigint | null | undefined = fetchHistoryId?.history_id;

      if (!historyId) {
        throw new Error("Failed to fetch gmail history ID");
      }

      const success = await getHistoryRecords(historyId);

      if (success) {
        console.log(
          "Successfully retrieve and store info from messages: " +
            newMessage +
            " in DB"
        );
      }
    };

    subscription.on("message", messageHandler);
  } catch (err: any) {
    console.log("Error - failed to pull a message from gmail:");
    console.log(err.message);
  }
}

export { listenForMessages };
