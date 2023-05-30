const rabbitmqUrl = `amqp://guest:guest@${process.env.rabbitmqURL || 'localhost'}:5672`
const eventstoreUrl = `esdb://${process.env.eventstoredbURL || 'localhost'}:2113?tls=false`
export { rabbitmqUrl, eventstoreUrl };
