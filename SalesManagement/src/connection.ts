
const rabbitmqOptions = `amqp://guest:guest@${process.env.host || 'rabbitmq'}:5672`

const mongodb = `mongodb://${process.env.host || 'mongo'}:27017/sales-management`;

export { rabbitmqOptions as rabbitmq, mongodb };