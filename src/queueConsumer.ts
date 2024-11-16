import amqp, { Connection, Channel, Message } from 'amqplib/callback_api.js';

const RABBITMQ_URL = 'amqp://localhost'; // Replace with your RabbitMQ server URL
const QUEUE_NAME = 'zeppelin-defender-webhook'; // Replace with your queue name

export function startRabbitMQConsumer() {
  amqp.connect(RABBITMQ_URL, function (error0: Error, connection: Connection) {
    if (error0) {
      throw error0;
    }
    connection.createChannel(function (error1: Error, channel: Channel) {
      if (error1) {
        throw error1;
      }

      channel.assertQueue(QUEUE_NAME, {
        durable: false
      });

      console.log(`Waiting for messages in ${QUEUE_NAME}. To exit press CTRL+C`);

      channel.consume(QUEUE_NAME, function (msg: Message | null) {
        if (msg !== null) {
          const messageContent = msg.content.toString();
        //   console.log(`Received message: ${messageContent}`);
          console.log(`Received message`);

          // Process the message
          processMessage(messageContent);

          // Acknowledge the message
          channel.ack(msg);
        }
      });
    });
  });
}

function processMessage(messageContent: string) {
  // Implement your message processing logic here
  console.log(`Processing message: ${messageContent}`);
}