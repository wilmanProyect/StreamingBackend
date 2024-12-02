const User = require('../model/userModel');
const jwt = require('jsonwebtoken');

// Funcion para generar token
const generateToken = (id, rol) => {
    return jwt.sign({ id, rol }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

// Registro de usuario
const registerUser = async (req,res)=>{
    const {nombre,email,password,rol} = req.body;
    try{
        const userExists = await User.find({email});
        if(userExists){
            return res.status(400).json({message: 'El usuario ya existe'});
        }

        const user = await User.create({nombre,email,password,rol});
        if(user){
            res.status(201).json({
                message: 'Usuario registrado',
                _id: user.id,
                nombre: user.nombre,
                email: user.email,
                rol: user.rol,
            });
        }else{
            res.status(400).json({message: 'Datos invalidos'})
        }
    }catch(error){
        res.status(500).json({message: error.message})
    }
};
//Inicio de Sesión 
const loginUser = async (req, res) => {
    const {email,password}= req.body;
    try{
        const user = await User.findOne({ email });

        if(!user){
            return res.status(401).json({message: 'Usuario no encontrado'});
        }
        const contraseñaCorrecta = await user.matchPassword(password)
        if(!contraseñaCorrecta){
            return res.status(401).json({message: 'Contraseña Incorrecta'});
        } 

        res.json({
            _id: user.id,
            nombre: user.nombre,
            email: user.email,
            rol: user.rol,
            token: generateToken(user.id, user.rol)
        })
    }catch(error){
        res.status(500).json({message:error.message})
    }
};

module.exports = { registerUser, loginUser };