const axios = require('axios');
const Reserva = require('../models/reservaModel'); 

exports.criarReserva = async (req, res) => {
    try {
        const { usuario_id, numero_quarto, check_in, check_out, numero_pessoas } = req.body;

        // Verifica se o usuário existe
        let usuarioResponse;
        try {
            usuarioResponse = await axios.get(`http://usuarios-service:3000/${usuario_id}`);
        } catch (error) {
            if (error.response && error.response.status === 404) {
                return res.status(404).json({ msg: 'Usuário não encontrado' });
            }
            throw error;
        }

        // Verifica se o quarto existe
        let quartoResponse;
        try {
            quartoResponse = await axios.get(`http://quartos-service:3000/${numero_quarto}`);
        } catch (error) {
            if (error.response && error.response.status === 404) {
                return res.status(404).json({ msg: 'Quarto não encontrado' });
            }
            throw error;
        }

        const quarto = quartoResponse.data;

        // Validar se a capacidade é igual ao num de pessoas
        if (quarto.capacidade !== numero_pessoas) {
            return res.status(400).json({ msg: `A capacidade do quarto (${quarto.capacidade}) deve ser igual ao número de pessoas na reserva (${numero_pessoas})` });
        }

        // Validar se quarto tá disponivel
        if (!quarto.disponivel) {
            return res.status(400).json({ msg: 'O quarto não está disponível para reserva' });
        }

        // Criar a reserva
        const novaReserva = await Reserva.create({
            usuario_id,
            numero_quarto,
            data_reserva: new Date(),
            check_in,
            check_out,
            numero_pessoas
        });

        res.status(201).json({ msg: 'Reserva criada com sucesso', reserva: novaReserva });

    } catch (error) {
        console.error('Erro ao criar reserva:', error.message);
        res.status(500).json({ msg: 'Erro ao criar reserva' });
    }
};
