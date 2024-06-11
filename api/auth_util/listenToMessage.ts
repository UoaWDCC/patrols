// Copyright 2019-2023 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

// This is a generated sample, using the typeless sample bot. Please
// look for the source TypeScript sample (.ts) for modifications.

'use strict';

/**
 * This application demonstrates how to perform basic operations on
 * subscriptions with the Google Cloud Pub/Sub API.
 *
 * For more information, see the README.md under /pubsub and the documentation
 * at https://cloud.google.com/pubsub/docs.
 */

// sample-metadata:
//   title: Listen For Messages
//   description: Listens for messages from a subscription.
//   usage: node listenForMessages.js <subscription-name-or-id> [timeout-in-seconds]

/**
 * TODO(developer): Uncomment these variables before running the sample.
 */

// Imports the Google Cloud client library
import { PubSub, Message } from '@google-cloud/pubsub';
import { getHistoryRecords } from '../controller/gmailController';

// Creates a client; cache this for further use
const pubSubClient = new PubSub();

function listenForMessages(subscriptionNameOrId: string): void {
    // References an existing subscription
    try {
        const subscription = pubSubClient.subscription(subscriptionNameOrId);

        // Create an event handler to handle messages
        const messageHandler = async (message: Message) => {

            message.ack();

            const newMessage = message.data.toString();
            console.log('Received message:', newMessage);

            // const newMessageObj = JSON.parse(newMessage);


            //missing retrieve historyId in DB
            const historyTestId = '15299' // Temp historyId

            const success = await getHistoryRecords(historyTestId);

            if (success) {
                console.log('Successfully retrieve and store info from messages: ' + newMessage + ' in DB')
            }
        };

        // Listen for new messages until timeout is hit
        subscription.on('message', messageHandler);
    } catch (err) {
        console.log('Error: failed to pull a message from gmail')
    }

}

export { listenForMessages }
