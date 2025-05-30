const axios = require('axios');
const Reserva = require('../models/reservaModel'); 
const { enviarEventoAtualizacaoQuarto } = require('../utils/rabbitmq');
const { differenceInDays, parseISO } = require('date-fns');

exports.criarReserva = async (req, res) => {
    try {
        const { usuario_id, numero_quarto, check_in, check_out, numero_pessoas } = req.body;

        console.log(`[Reservas Service] Recebida requisição para criar reserva para usuario_id: ${usuario_id}, numero_quarto: ${numero_quarto}`);

        let usuarioResponse;
        try {
            const usuarioServiceURL = `http://usuarios-service:3000/buscar/${usuario_id}`;
            console.log(`[Reservas Service] Chamando serviço de usuários em: ${usuarioServiceURL}`);
            usuarioResponse = await axios.get(usuarioServiceURL);
            console.log(`[Reservas Service] Resposta do serviço de usuários (status: ${usuarioResponse.status}, data:`, usuarioResponse.data);

            if (!usuarioResponse.data || !usuarioResponse.data.usuario) {
                console.log('[Reservas Service] Resposta do serviço de usuários válida, mas não contém a chave "usuario".');
                return res.status(404).json({ msg: 'Usuário não encontrado (resposta inválida do serviço de usuário)' });
            }

        } catch (error) {
            console.error('[Reservas Service] ERRO ao chamar o serviço de usuários:');
            if (error.response) {
                console.error(`  Status: ${error.response.status}, Dados: ${JSON.stringify(error.response.data)}`);
                if (error.response.status === 404) {
                    return res.status(404).json({ msg: 'Usuário não encontrado' });
                }
                return res.status(error.response.status).json({ msg: 'Erro no serviço de usuários', details: error.response.data });
            } else if (error.request) {
                console.error('  Nenhuma resposta recebida do serviço de usuários (serviço pode estar indisponível ou inacessível).');
                return res.status(503).json({ msg: 'Serviço de usuários indisponível ou inacessível' });
            } else {
                console.error('  Erro na configuração da requisição Axios para serviço de usuários:', error.message);
            }
            return res.status(500).json({ msg: 'Erro interno ao verificar usuário' });
        }
        const usuario = usuarioResponse.data.usuario;

        let quartoResponse;
        try {
            const quartoServiceURL = `http://quartos-service:3000/buscar/${numero_quarto}`;
            console.log(`[Reservas Service] Chamando serviço de quartos em: ${quartoServiceURL}`);
            quartoResponse = await axios.get(quartoServiceURL);
            console.log(`[Reservas Service] Resposta do serviço de quartos (status: ${quartoResponse.status}, data:`, quartoResponse.data);

            if (!quartoResponse.data || !quartoResponse.data.quarto) {
                console.log('[Reservas Service] Resposta do serviço de quartos válida, mas não contém a chave "quarto".');
                return res.status(404).json({ msg: 'Quarto não encontrado (resposta inválida do serviço de quarto)' });
            }

        } catch (error) {
            console.error('[Reservas Service] ERRO ao chamar o serviço de quartos:');
            if (error.response) {
                console.error(`  Status: ${error.response.status}, Dados: ${JSON.stringify(error.response.data)}`);
                if (error.response.status === 404) {
                    return res.status(404).json({ msg: 'Quarto não encontrado' });
                }
                return res.status(error.response.status).json({ msg: 'Erro no serviço de quartos', details: error.response.data });
            } else if (error.request) {
                
                console.error('  Nenhuma resposta recebida do serviço de quartos (serviço pode estar indisponível ou inacessível).');
                return res.status(503).json({ msg: 'Serviço de quartos indisponível ou inacessível' });
            } else {
                console.error('  Erro na configuração da requisição Axios para serviço de quartos:', error.message);
            }
            return res.status(500).json({ msg: 'Erro interno ao verificar quarto' });
        }
        const quarto = quartoResponse.data.quarto;

        if (!quarto.disponivel) {
            console.log(`[Reservas Service] Quarto ${numero_quarto} não disponível.`);
            return res.status(400).json({ msg: 'O quarto não está disponível para reserva' });
        }

        if (numero_pessoas > quarto.capacidade) {
            console.log(`[Reservas Service] Quarto ${numero_quarto} não comporta ${numero_pessoas} pessoas. Capacidade: ${quarto.capacidade}`);
            return res.status(400).json({
                msg: `O quarto não comporta a quantidade de pessoas na reserva. Capacidade de até: ${quarto.capacidade}`
            });
        }

        const dias = differenceInDays(parseISO(check_out), parseISO(check_in));
        if (dias <= 0) {
            console.log('[Reservas Service] Data de check-out deve ser após check-in.');
            return res.status(400).json({ msg: 'Data de check-out deve ser após check-in' });
        }

        const preco_reserva = dias * quarto.preco;
        console.log(`[Reservas Service] Preço da reserva calculado: ${preco_reserva} para ${dias} dias.`);

        const novaReserva = await Reserva.create({
            usuario_id,
            numero_quarto,
            data_reserva: new Date(),
            check_in,
            check_out,
            numero_pessoas,
            preco_reserva
        });
        console.log('[Reservas Service] Nova reserva criada com sucesso:', novaReserva.id_reserva);

        await enviarEventoAtualizacaoQuarto(numero_quarto, false);
        console.log(`[Reservas Service] Evento de atualização de quarto (disponibilidade: false) enviado para o quarto ${numero_quarto}.`);
        res.status(201).json({ msg: 'Reserva criada com sucesso', reserva: novaReserva });

    } catch (error) {
        console.error('[Reservas Service] ERRO GERAL ao criar reserva:', error.message);
        if (error.response) {
            console.error('  Detalhes da resposta de erro:', error.response.data);
        } else if (error.request) {
            console.error('  Detalhes da requisição de erro (sem resposta):', error.request);
        }
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
        console.log(`[Reservas Service] Evento de atualização de quarto (disponibilidade: true) enviado para o quarto ${numero_quarto}.`);

        res.status(200).json({ msg: 'Reserva excluída com sucesso' });
    } catch (error) {
        console.error('[Reservas Service] Erro ao excluir reserva:', error.message);
        res.status(500).json({ msg: 'Erro ao excluir reserva' });
    }
};

exports.listarReservas = async (req, res) => {
    try {
        const reservas = await Reserva.findAll();
        console.log('[Reservas Service] Listando todas as reservas.');
        res.status(200).json(reservas);
    } catch (error) {
        console.error('[Reservas Service] Erro ao listar reservas:', error);
        res.status(500).json({ error: 'Erro ao listar reservas' });
    }
};

exports.listarReservasPorUsuario = async (req, res) => {
    try {
        const { usuario_id } = req.params;
        console.log(`[Reservas Service] Buscando reservas para usuario_id: ${usuario_id}`);
        const reservas = await Reserva.findAll({
            where: { usuario_id }
        });

        if (reservas.length === 0) {
            console.log(`[Reservas Service] Nenhuma reserva encontrada para o usuário ${usuario_id}.`);
            return res.status(404).json({ msg: 'Nenhuma reserva encontrada para este usuário' });
        }
        console.log(`[Reservas Service] ${reservas.length} reservas encontradas para o usuário ${usuario_id}.`);
        res.status(200).json(reservas);
    } catch (error) {
        console.error('[Reservas Service] Erro ao listar reservas por usuário:', error.message);
        res.status(500).json({ msg: 'Erro ao buscar reservas por usuário' });
    }
};

exports.atualizarReserva = async (req, res) => {
    try {
        const { id_reserva } = req.params;
        const { numero_quarto, check_in, check_out, numero_pessoas } = req.body;

        console.log(`[Reservas Service] Tentando atualizar reserva ${id_reserva}.`);
        const reserva = await Reserva.findByPk(id_reserva);

        if (!reserva) {
            console.log(`[Reservas Service] Reserva ${id_reserva} não encontrada.`);
            return res.status(404).json({ msg: 'Reserva não encontrada' });
        }

        let quarto;
        if (numero_quarto && numero_quarto !== reserva.numero_quarto) {
            console.log(`[Reservas Service] Número do quarto mudando de ${reserva.numero_quarto} para ${numero_quarto}.`);
            try {
                const quartoResponse = await axios.get(`http://quartos-service:3000/buscar/${numero_quarto}`);
                quarto = quartoResponse.data.quarto;

                if (!quarto.disponivel) {
                    console.log(`[Reservas Service] Novo quarto ${numero_quarto} não disponível.`);
                    return res.status(400).json({ msg: 'O novo quarto não está disponível' });
                }

            
                reserva.numero_quarto = numero_quarto;
            } catch (error) {
                console.error(`[Reservas Service] Erro ao buscar/validar novo quarto ${numero_quarto}:`, error.message);
                const statusCode = error.response ? error.response.status : 500;
                return res.status(statusCode).json({ msg: 'Novo quarto não encontrado ou serviço indisponível' });
            }
        } else {
            console.log(`[Reservas Service] Mantendo quarto atual ${reserva.numero_quarto}. Buscando informações.`);
            try {
                const quartoResponse = await axios.get(`http://quartos-service:3000/buscar/${reserva.numero_quarto}`);
                quarto = quartoResponse.data.quarto;
                 if (!quarto) { 
                    console.log(`[Reservas Service] Quarto ${reserva.numero_quarto} não encontrado após buscar informações.`);
                    return res.status(404).json({ msg: 'Informações do quarto atual não encontradas' });
                }
            } catch (error) {
                console.error(`[Reservas Service] Erro ao buscar informações do quarto atual ${reserva.numero_quarto}:`, error.message);
                const statusCode = error.response ? error.response.status : 500;
                return res.status(statusCode).json({ msg: 'Erro ao obter informações do quarto atual' });
            }
        }

        if (numero_pessoas && numero_pessoas > quarto.capacidade) {
            console.log(`[Reservas Service] Atualização: Quarto ${quarto.numero_quarto} não comporta ${numero_pessoas} pessoas. Capacidade: ${quarto.capacidade}`);
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
                console.log('[Reservas Service] Atualização: Data de check-out deve ser após o check-in.');
                return res.status(400).json({ msg: 'Data de check-out deve ser após o check-in' });
            }
            reserva.preco_reserva = dias * quarto.preco;
            console.log(`[Reservas Service] Atualização: Novo preço da reserva calculado: ${reserva.preco_reserva}`);
        }

        await reserva.save();
        console.log(`[Reservas Service] Reserva ${id_reserva} atualizada com sucesso.`);
        res.status(200).json({ msg: 'Reserva atualizada com sucesso', reserva });

    } catch (error) {
        console.error('[Reservas Service] Erro ao atualizar reserva:', error.message);
        if (error.response) {
            console.error('  Detalhes da resposta de erro:', error.response.data);
        }
        res.status(500).json({ msg: 'Erro ao atualizar reserva' });
    }
};

exports.buscarReservaPorId = async (req, res) => {
    try {
        const { id_reserva } = req.params;
        console.log(`[Reservas Service] Buscando reserva por ID: ${id_reserva}`);
        const reserva = await Reserva.findByPk(id_reserva);

        if (!reserva) {
            console.log(`[Reservas Service] Reserva ${id_reserva} não encontrada.`);
            return res.status(404).json({ msg: 'Reserva não encontrada' });
        }
        console.log(`[Reservas Service] Reserva ${id_reserva} encontrada.`);
        res.status(200).json(reserva);
    } catch (error) {
        console.error('[Reservas Service] Erro ao buscar reserva por ID:', error.message);
        res.status(500).json({ msg: 'Erro ao buscar reserva' });
    }
};