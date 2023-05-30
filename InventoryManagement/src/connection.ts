const rabbitmqUrl = `amqp://guest:guest@${process.env.rabbitmqURL || 'localhost'}:5672`
const eventstoreUrl = `esdb://${process.env.eventstoredbURL || 'localhost'}:2113?tls=false`
const mongoUrl = `mongodb://${process.env.mongodbURL || 'localhost'}:27017/inventory-management`;

export { rabbitmqUrl, eventstoreUrl, mongoUrl };
