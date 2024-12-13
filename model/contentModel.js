const mongoose = require('mongoose');

const contentSchema = new mongoose.Schema({
    titulo: { type: String, required: true },
    descripcion: { type: String, required: true },
    categorias: [{ type: String }], // Ejemplo: ['Acción', 'Drama']
    tipo: { type: String, enum: ['película', 'serie'], required: true },
    portada: { type: String, required: true }, // URL de la portada
    clasificacion: { type: String, enum: ['+7', '+13', '+18'], required: true },
    calificaciones: {
        promedio: { type: Number, default: 0 },
        votos: { type: Number, default: 0 }
    },
    creador: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

module.exports =  mongoose.model('Content',contentSchema);