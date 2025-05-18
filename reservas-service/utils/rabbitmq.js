const amqp = require('amqplib');

let channel;

async function connectRabbitMQ() {
    try {
        const connection = await amqp.connect('amqp://rabbitmq'); // rabbitmq = nome do serviço no docker-compose
        channel = await connection.createChannel();
        await channel.assertQueue('atualizar_status_quarto');
        console.log('[RabbitMQ] Conectado e fila criada: atualizar_status_quarto');
    } catch (error) {
        console.error('[RabbitMQ] Erro na conexão:', error.message);
        // Tentar reconectar depois de um tempo
        setTimeout(connectRabbitMQ, 5000);
    }
}

async function enviarEventoAtualizacaoQuarto(numero_quarto, disponivel) {
    if (!channel) await connectRabbitMQ();

    const evento = { numero_quarto, disponivel };
    channel.sendToQueue('atualizar_status_quarto', Buffer.from(JSON.stringify(evento)));
}

module.exports = { enviarEventoAtualizacaoQuarto, connectRabbitMQ };
