const mongoose = require('mongoose');
const reviewSchema = new mongoose.Schema({
    usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    contenido: { type: mongoose.Schema.Types.ObjectId, ref: 'Content', required: true },
    texto: { type: String },
    calificacion: { type: Number, min: 1, max: 5, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Review',reviewSchema);