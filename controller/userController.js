const User = require('../model/userModel');
const jwt = require('jsonwebtoken');

// Funcion para generar token
const generateToken = (id, rol) => {
    return jwt.sign({ id, rol }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

// Registro de usuario
const registerUser = async (req, res) => {
    const {nombre,email,password,rol} = req.body;
    try{
        const userExists = await User.findOne({email});
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

const subscribeUser = async (req, res) => {
    
    try {
        const { cardNumber, expirationDate, cvv, userId } = req.body;

        // Validar que todos los datos estén presentes
        if (!cardNumber || !expirationDate || !cvv || !userId) {
            return res.status(400).json({ message: 'Todos los campos son obligatorios' });
        }

        // Simulación del pago (esto solo valida datos básicos)
        if (cardNumber.length !== 16 || cvv.length !== 3) {
            return res.status(400).json({ message: 'Datos de tarjeta inválidos' });
        }

        // Buscar al usuario
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        if (user.estado === 'premiun') {
            return res.status(400).json({ message: 'El usuario ya tiene una suscripción activa' });
        }
        // Actualizar el estado del usuario a "premium"
        user.estado = 'premium';
        user.premiumExpiresAt = new Date(new Date().setDate(new Date().getDate() + 30)); // Añadir 30 días
        await user.save();

        res.status(200).json({ 
            message: 'Suscripción exitosa', 
            user: {
                id: user._id,
                nombre: user.nombre,
                estado: user.estado,
                premiumExpiresAt: user.premiumExpiresAt
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Error al procesar la suscripción', error: error.message });
    }
};

const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password'); // Excluye la contraseña
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        res.status(200).json({
            id: user._id,
            nombre: user.nombre,
            email: user.email,
            estado: user.estado,
            rol: user.rol,
            premiumExpiresAt: user.premiumExpiresAt,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        });
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el perfil del usuario', error: error.message });
    }
};

module.exports = { registerUser, loginUser , subscribeUser, getUserProfile  };