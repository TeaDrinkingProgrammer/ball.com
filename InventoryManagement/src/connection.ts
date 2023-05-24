
const rabbitmq = {
    urls: [`amqp://guest:guest@${process.env.host || 'rabbitmq'}:5672`],
    queue: 'ball-com',
    queueOptions: {
        durable: false
    },
};

const mongodb = `mongodb://${process.env.host || 'mongo'}:27017/sales-management`;

export { rabbitmq, mongodb };