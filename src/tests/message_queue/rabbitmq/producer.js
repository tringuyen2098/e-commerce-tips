const amqplib = require('amqplib');
const message = 'hello world, RabbitMQ';

const runProducer = async () => {
    try{
        const connection = await amqplib.connect('amqp://guest:guest@localhost');
        const channel = await connection.createChannel();

        const queueName = 'test-topic';
        await channel.assertQueue(queueName, {
            durable: true,
        })

        //send messages to consumer channel
        channel.sendToQueue(queueName, Buffer.from(message));
        console.log(`message sent: ${message}`);
        setTimeout(() => {
            connection.close();
        },3000) 
    }   
    catch(err){
        console.error(err);
    }
}

runProducer().catch(console.error())