const jwt = require('jsonwebtoken');
const User = require('../model/userModel');

// Proteccion de Rutas

const protect = async (req, res, next )=> {
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        try{
            token = req.headers.authorization.split(' ')[1];

            const decoded = jwt.verify(token.process.env.JWT_SECRET);

            req.user = await User.findById(decoded.id).select('-password');
            next()
        }catch(error){
            res.status(401),json({message: 'No autorizado, token fallidox'});
        }
    }
    if(!token){
        res.status(401).json({message: 'No autorizado, no se proporcionó el token'})
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

module.exports = {protect, admin}
