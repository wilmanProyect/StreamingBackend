const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
// Schema
const userSchema = new mongoose.Schema({
    nombre: {type: String, required: true},
    email: { 
        type: String, 
        required: true, 
        unique: true, 
        validate: {
            validator: (v) => /^\S+@\S+\.\S+$/.test(v),
            message: props => `${props.value} is not a valid email!`
        }
    },
    password: {type: String, required: true},
    estado: {type: String,enum: ['premiun','normal'], default:'normal'},
    premiumExpiresAt: { type: Date },
    rol:{type: String, enum: ['admin','user','creator'], default: 'user'}
}, { timestamps: true });

// esquema para encriptar la contraseña  antes de guardar
userSchema.pre('save',async function (next) {
    if(!this.isModified('password'))return next();
    this.password =  await bcrypt.hash(this.password,10)
    next()
});

//metodo para comparar contraseñas

userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword,this.password)
};

module.exports =  mongoose.model('User',userSchema);