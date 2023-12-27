const redis = require("redis");

async function redisClient() {
    const client = redis.createClient();

    client.on("error", function (error) {
        console.error("Redis connect error", error);
    });

    client.on("connect", function () {
        console.info("Redis connected successfully!");
    });
    await client.connect();

    return client;
}

module.exports = redisClient;
