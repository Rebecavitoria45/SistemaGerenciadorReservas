const axios = require('axios');
const Reserva = require('../models/reservaModel'); 
const { enviarEventoAtualizacaoQuarto } = require('../utils/rabbitmq');
const { differenceInDays, parseISO } = require('date-fns');

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

        const quarto = quartoResponse.data.quarto;

        // Validar se quarto está disponível
        if (!quarto.disponivel) {
            return res.status(400).json({ msg: 'O quarto não está disponível para reserva' });
        }

        // Validar capacidade
        if (numero_pessoas > quarto.capacidade) {
            return res.status(400).json({
                msg: `O quarto não comporta a quantidade de pessoas na reserva. Capacidade de até: ${quarto.capacidade}`
            });
        }

        const dias = differenceInDays(parseISO(check_out), parseISO(check_in));
        if (dias <= 0) {
            return res.status(400).json({ msg: 'Data de check-out deve ser após check-in' });
        }

        const preco_reserva = dias * quarto.preco;

        const novaReserva = await Reserva.create({
            usuario_id,
            numero_quarto,
            data_reserva: new Date(),
            check_in,
            check_out,
            numero_pessoas,
            preco_reserva
        });

        await enviarEventoAtualizacaoQuarto(numero_quarto, false);
        res.status(201).json({ msg: 'Reserva criada com sucesso', reserva: novaReserva });

    } catch (error) {
        console.error('Erro ao criar reserva:', error.message);
        res.status(500).json({ msg: 'Erro ao criar reserva' });
    }
};

exports.excluir_reserva = async (req, res) => {
    try {
        const { id_reserva } = req.params;

        const reserva = await Reserva.findByPk(id_reserva);

        if (!reserva) {
            return res.status(404).json({ msg: 'Reserva não encontrada' });
        }

        const numero_quarto = reserva.numero_quarto;
        await reserva.destroy();

        await enviarEventoAtualizacaoQuarto(numero_quarto, true);

        res.status(200).json({ msg: 'Reserva excluída com sucesso' });
    } catch (error) {
        console.error('Erro ao excluir reserva:', error.message);
        res.status(500).json({ msg: 'Erro ao excluir reserva' });
    }
};

exports.listarReservas = async (req, res) => {
    try {
        const reservas = await Reserva.findAll();
        res.status(200).json(reservas);
    } catch (error) {
        console.error('Erro ao listar reservas:', error);
        res.status(500).json({ error: 'Erro ao listar reservas' });
    }
};

exports.listarReservasPorUsuario = async (req, res) => {
    try {
        const { usuario_id } = req.params;
        const reservas = await Reserva.findAll({
            where: { usuario_id }
        });

        if (reservas.length === 0) {
            return res.status(404).json({ msg: 'Nenhuma reserva encontrada para este usuário' });
        }

        res.status(200).json(reservas);
    } catch (error) {
        console.error('Erro ao listar reservas por usuário:', error.message);
        res.status(500).json({ msg: 'Erro ao buscar reservas por usuário' });
    }
};

exports.atualizarReserva = async (req, res) => {
    try {
        const { id_reserva } = req.params;
        const { numero_quarto, check_in, check_out, numero_pessoas } = req.body;

        const reserva = await Reserva.findByPk(id_reserva);

        if (!reserva) {
            return res.status(404).json({ msg: 'Reserva não encontrada' });
        }

        let quarto;
        // Se o número do quarto mudar, buscar novo quarto
        if (numero_quarto && numero_quarto !== reserva.numero_quarto) {
            try {
                const quartoResponse = await axios.get(`http://quartos-service:3000/${numero_quarto}`);
                quarto = quartoResponse.data.quarto;

                if (!quarto.disponivel) {
                    return res.status(400).json({ msg: 'O novo quarto não está disponível' });
                }

                reserva.numero_quarto = numero_quarto;
            } catch (error) {
                return res.status(404).json({ msg: 'Novo quarto não encontrado' });
            }
        } else {
            // Buscar o quarto atual
            const quartoResponse = await axios.get(`http://quartos-service:3000/${reserva.numero_quarto}`);
            quarto = quartoResponse.data.quarto;
        }

        if (numero_pessoas && numero_pessoas > quarto.capacidade) {
            return res.status(400).json({
                msg: `O quarto não comporta a quantidade de pessoas. Capacidade máxima: ${quarto.capacidade}`
            });
        }

        if (check_in) reserva.check_in = check_in;
        if (check_out) reserva.check_out = check_out;
        if (numero_pessoas) reserva.numero_pessoas = numero_pessoas;

        if (check_in && check_out) {
            const dias = differenceInDays(parseISO(check_out), parseISO(check_in));
            if (dias <= 0) {
                return res.status(400).json({ msg: 'Data de check-out deve ser após o check-in' });
            }
            reserva.preco_reserva = dias * quarto.preco;
        }

        await reserva.save();
        res.status(200).json({ msg: 'Reserva atualizada com sucesso', reserva });

    } catch (error) {
        console.error('Erro ao atualizar reserva:', error.message);
        res.status(500).json({ msg: 'Erro ao atualizar reserva' });
    }
};

exports.buscarReservaPorId = async (req, res) => {
    try {
        const { id_reserva } = req.params;

        const reserva = await Reserva.findByPk(id_reserva);

        if (!reserva) {
            return res.status(404).json({ msg: 'Reserva não encontrada' });
        }

        res.status(200).json(reserva);
    } catch (error) {
        console.error('Erro ao buscar reserva por ID:', error.message);
        res.status(500).json({ msg: 'Erro ao buscar reserva' });
    }
};