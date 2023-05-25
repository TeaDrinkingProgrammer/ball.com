const rabbitmqUrl = `amqp://guest:guest@${process.env.host || 'rabbitmq'}:5672`
const eventstoreUrl = `esdb://${process.env.host || 'eventstoredb'}:2113?tls=false`
export { rabbitmqUrl, eventstoreUrl };