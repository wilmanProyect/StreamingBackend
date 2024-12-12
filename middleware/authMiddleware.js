const jwt = require('jsonwebtoken');
const User = require('../model/userModel');

// Proteccion de Rutas

const protect = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select('-password'); // Excluye la contraseña
            next();
        } catch (error) {
            res.status(401).json({ message: 'No autorizado, token inválido' });
        }
    } else {
        res.status(401).json({ message: 'No autorizado, token no proporcionado' });
    }
};

//Verificamos rol del administrador 

const admin = (req, res , next) =>{
    if(req.User && req.User.rol === 'admin'){
        next();
    }else{
        res.status(403).json({message: ' No autorizado, acceso solo para administradores'})
    }
};

// Verificamos el rol de Creador
const creator = (req, res, next) => {

    if(req.User && req.User.rol === 'creator'){
        next();
    }else{
        res.status(403).json({message:'No autorizado, acceso solo para creadores' })
    }
}

// Middleware para roles
const role = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.rol)) {
            return res.status(403).json({ message: 'No autorizado, acceso restringido.' });
        }
        next();
    };
};

const isPremium = (req, res, next) => {
    if (req.user.estado === 'premium' && req.user.premiumExpiresAt > new Date()) {
        return next(); // Continúa si el usuario aún tiene premium activo
    }

    // Si la suscripción ha expirado, actualizar el estado del usuario
    req.user.estado = 'normal';
    req.user.premiumExpiresAt = null;
    req.user.save();

    return res.status(403).json({ message: 'Tu suscripción premium ha expirado.' });
};


module.exports = {protect, admin, creator, role, isPremium}
