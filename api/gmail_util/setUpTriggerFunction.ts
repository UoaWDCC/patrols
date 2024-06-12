// Imports the Google Cloud client library
import { PubSub, Topic, Subscription } from '@google-cloud/pubsub';


async function setUpTopicAndSub(
  projectId: string = process.env.GOOGLE_CLOUD_PROJECT_ID ?? '', // Your Google Cloud Platform project ID
  topicNameOrId: string = process.env.GOOGLE_CLOUD_TOPIC_ID ?? '', // Name for the new topic to create
  subscriptionName: string = process.env.GOOGLE_CLOUD_SUB_ID ?? '' // Name for the new subscription to create
): Promise<void> {
  try {
    // Instantiates a client
    const pubsub = new PubSub({ projectId });

    // Creates a new topic
    const [topic]: [Topic, ...any[]] = await pubsub.createTopic(topicNameOrId);
    console.log(`Topic ${topic.name} created.`);

    // Creates a subscription on that new topic
    const [subscription]: [Subscription, ...any[]] = await topic.createSubscription(subscriptionName);
    console.log(`Subscription ${subscription.name} created`)
  } catch (err: any) {
    throw new Error('Trigger Function Error: ' + err.message)
  }
}

setUpTopicAndSub().catch((err: any) => console.log(err.message))


