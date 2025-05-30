const Quarto = require('../models/quartoModel'); 
const amqp = require('amqplib');

exports.cadastrarQuarto = async (req, res) => {
    try {
        const { numero_quarto,tipo, capacidade, preco, disponivel } = req.body;

        if (!numero_quarto) return res.status(422).json({ msg: 'Número do quarto é obrigatório' });
        if (!tipo) return res.status(422).json({ msg: 'Tipo do quarto é obrigatório' });
        if (!capacidade) return res.status(422).json({ msg: 'Capacidade do quarto é obrigatória' });
        if (!preco) return res.status(422).json({ msg: 'Preço do quarto é obrigatório' });

        const quartoExiste = await Quarto.findOne({ where: { numero_quarto: req.body.numero_quarto } });
        if (quartoExiste) return res.status(422).json({ error: 'Já existe um quarto com este número' });

        const quarto = await Quarto.create({ numero_quarto, tipo, capacidade, preco, disponivel });
        res.status(201).json({ msg: 'Quarto cadastrado com sucesso:', quarto });
    } catch (error) {
        console.error('Erro ao cadastrar quarto:', error);
        res.status(500).json({ error: 'Erro ao cadastrar quarto' });
    }
};

exports.listarQuartos = async (req, res) => {
    try {
        const quartos = await Quarto.findAll();
        res.status(200).json(quartos);
    } catch (error) {
        console.error('Erro ao listar quartos:', error);
        res.status(500).json({ error: 'Erro ao listar quartos' });
    }
};

exports.atualizarQuarto = async (req, res) => {
    try {
        const { numero_quarto} = req.params;
        const { tipo, capacidade, preco, disponivel } = req.body;

        const quarto = await Quarto.findByPk(numero_quarto);

        if (!quarto) {
            return res.status(404).json({ msg: 'Quarto não encontrado' });
        }

       
        if (tipo) quarto.tipo = tipo;
        if (capacidade) quarto.capacidade = capacidade;
        if (preco) quarto.preco = preco;
        if (disponivel) quarto.disponivel = disponivel;

        await quarto.save();

        res.status(200).json({ msg: 'Quarto atualizado com sucesso', quarto });
    } catch (error) {
        console.error('Erro ao atualizar quarto:', error);
        res.status(500).json({ msg: 'Erro ao atualizar quarto' });
    }
};

exports.deletarQuarto = async (req, res) => {
    try {
        const { numero_quarto} = req.params;

        const quarto = await Quarto.findByPk(numero_quarto);

        if (!quarto) {
            return res.status(404).json({ msg: 'Quarto não encontrado' });
        }

        await quarto.destroy();

        res.status(200).json({ msg: 'Quarto deletado com sucesso' });
    } catch (error) {
        console.error('Erro ao deletar quarto:', error);
        res.status(500).json({ msg: 'Erro ao deletar quarto' });
    }
};

exports.buscarQuarto = async (req, res) => {
    try {
        const { numero_quarto} = req.params;
    
        const quarto = await Quarto.findByPk(numero_quarto);

        if (!quarto) {
            return res.status(404).json({ msg: 'Quarto não encontrado' });
        }

        res.status(200).json({ msg: 'Quarto encontrado', quarto });
    } catch (error) {
        console.error('Erro ao atualizar quarto:', error);
        res.status(500).json({ msg: 'Erro ao Buscar quarto' });
    }
};