import { PubSub, Message } from '@google-cloud/pubsub';
import { getHistoryRecords } from '../controller/gmailController';
import prisma from '../db/database';

const pubSubClient = new PubSub();

function listenForMessages(subscriptionNameOrId: string): void {
    // References an existing subscription
    try {
        const subscription = pubSubClient.subscription(subscriptionNameOrId);

        // Create an event handler to handle messages
        const messageHandler = async (message: Message) => {

            message.ack();

            const newMessage = message.data.toString();
            console.log('\n')
            console.log('Received message:', newMessage);

            // const newMessageObj = JSON.parse(newMessage);

            const fetchHistoryId = await prisma.email_history_dev.findUnique({
                where: {
                    id: 1,
                },
                select: {
                    history_id: true,
                },
            })

            const historyId: bigint | null | undefined = fetchHistoryId?.history_id

            if(!historyId) {
                throw new Error('Failed to fetch gmail history ID')
            }
            
            const success = await getHistoryRecords(historyId);

            if (success) {
                console.log('Successfully retrieve and store info from messages: ' + newMessage + ' in DB')
            }
        };

        subscription.on('message', messageHandler);
    } catch (err) {
        console.log('Error: failed to pull a message from gmail')
    }

}

export { listenForMessages }
