const jwt = require('jsonwebtoken');
require('dotenv').config();

function verificaToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Pega só o token após "Bearer"

    if (!token) return res.status(403).json({ msg: 'Token não fornecido' });

    jwt.verify(token, process.env.JWTSECRET, (err, decoded) => {
        if (err) return res.status(403).json({ msg: 'Token inválido' });

        req.usuario = decoded; // Agora vai conter id, nome, email
        next();
    });
}

module.exports = verificaToken;
