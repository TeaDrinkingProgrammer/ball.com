
const rabbitmqUrl = `amqp://guest:guest@${process.env.host || 'rabbitmq'}:5672`

const mongoUrl = `mongodb://${process.env.host || 'mongo'}:27017/sales-management`;

export { rabbitmqUrl, mongoUrl };