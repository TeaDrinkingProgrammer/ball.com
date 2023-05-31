const rabbitmqUrl = `amqp://guest:guest@${process.env.rabbitmqURL || 'localhost'}:5672`
const mongoUrl = `mongodb://${process.env.mongodbURL || 'localhost'}:27017/invoice-management`;

export { rabbitmqUrl, mongoUrl };