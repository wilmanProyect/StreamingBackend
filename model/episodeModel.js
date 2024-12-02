const mongoose = require('mongoose');
const content = require('../model/contentModel');

const episodeSchema = new mongoose.Schema({
    titulo: { type: String, required: true },
    descripcion: { type: String, required: true },
    url: { type: String, required: true },
    contenido: { type: mongoose.Schema.Types.ObjectId, ref: 'Content', required: true },
    numero: { type: Number, required: true },
    temporada: { type: Number, required: true }
}, { timestamps: true });

module.exports =  mongoose.model('Episode',episodeSchema);