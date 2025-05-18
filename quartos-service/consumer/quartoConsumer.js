const amqp = require('amqplib');
const Quarto = require('../models/quartoModel');

const RABBITMQ_URL = 'amqp://rabbitmq';
const QUEUE_NAME = 'atualizar_status_quarto';
const RETRY_DELAY_MS = 5000;

async function consumirEventos() {
    while (true) {
        try {
            const connection = await amqp.connect(RABBITMQ_URL);
            const channel = await connection.createChannel();
            await channel.assertQueue(QUEUE_NAME);

            console.log('Conectado ao RabbitMQ e aguardando mensagens...');

            channel.consume(QUEUE_NAME, async (msg) => {
                if (msg !== null) {
                    const dados = JSON.parse(msg.content.toString());
                    const { numero_quarto, disponivel } = dados;

                    try {
                        const quarto = await Quarto.findByPk(numero_quarto);
                        if (quarto) {
                            quarto.disponivel = disponivel;
                            await quarto.save();
                            console.log(`✅ Quarto ${numero_quarto} atualizado para disponível: ${disponivel}`);
                        } else {
                            console.warn(`⚠️ Quarto ${numero_quarto} não encontrado`);
                        }
                    } catch (err) {
                        console.error('❌ Erro ao atualizar quarto:', err);
                    }

                    channel.ack(msg);
                }
            });

            break; // Conexão bem-sucedida, sai do loop
        } catch (error) {
            console.error(`❌ Falha ao conectar no RabbitMQ: ${error.message}`);
            console.log(`🔁 Retentando em ${RETRY_DELAY_MS / 1000} segundos...`);
            await new Promise(resolve => setTimeout(resolve, RETRY_DELAY_MS));
        }
    }
}

module.exports = consumirEventos;
