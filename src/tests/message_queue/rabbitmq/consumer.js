const amqplib = require('amqplib');
const message = 'hello world, RabbitMQ';

const runProducer = async () => {
    try{
        const connection = await amqplib.connect('amqp://localhost');
        const channel = await connection.createChannel();

        const queueName = 'test-topic';
        await channel.assertQueue(queueName, {
            durable: true,
        })

        //receive a message
        channel.consume(queueName, (message) => {
            console.log(`Received message: ${message.content.toString()}`)
        }, {
            noAck:true,
        })
    }   
    catch(err){
        console.error(err);
    }
}

runProducer().catch(console.error())