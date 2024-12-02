const mongoose = require('mongoose');

const contentSchema = new mongoose.Schema({
    titulo: { type: String, required: true },
    descripcion: { type: String, required: true },
    categoria: [{ type: String }], // Ejemplo: ['acción', 'comedia']
    tipo: { type: String, enum: ['película', 'serie'], required: true },
    url: { type: String, required: true },
    portada: { type: String }, // URL a la imagen de portada
    clasificacion: { type: String }, // Ejemplo: '+13'
    calificaciones: {
        promedio: { type: Number, default: 0 },
        votos: { type: Number, default: 0 }
    }
}, { timestamps: true });

module.exports =  mongoose.model('Content',contentSchema);