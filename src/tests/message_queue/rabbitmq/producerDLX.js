const amqplib = require("amqplib");
const message = "hello world, RabbitMQ";

const runProducer = async () => {
	try {
		const connection = await amqplib.connect("amqp://guest:guest@localhost");
		const channel = await connection.createChannel();
		const notificationExchange = "notificationEx";
		const notiQueue = "notificationQueueProcess";
		const notificationExchangeDLX = "notificationExDLX";
		const notificationRoutingKeyDLX = "notificationRoutingKeyDLX";

		//1.create Exchange
		await channel.assertExchange(notificationExchange, "direct", {
			durable: true,
		});

		//2.create queue
		const queueResult = await channel.assertQueue(notiQueue, {
			exclusive: false, // cho phep cac ket noi truy cap cung mot luc hang doi
			deadLetterExchange: notificationExchangeDLX,
			deadLetterRoutingKey: notificationRoutingKeyDLX,
		});

		//3.bindQueue

		await channel.bindQueue(queueResult.queue, notificationExchange);

		//4. sendMessage
		const msg = "a new product";

		await channel.sendToQueue(queueResult.queue, Buffer.from(msg), {
			expiration: "10000",
		});
		setTimeout(() => {
			connection.close();
		}, 3000);
	} catch (err) {
		console.error(err);
	}
};

runProducer().catch(console.error());
