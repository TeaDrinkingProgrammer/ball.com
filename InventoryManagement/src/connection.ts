const rabbitmqUrl = `amqp://guest:guest@${process.env.host || 'rabbitmq'}:5672`
const mongodb = `mongodb://${process.env.host || 'mongo'}:27017/inventory-management`;

export { rabbitmqUrl, mongodb };