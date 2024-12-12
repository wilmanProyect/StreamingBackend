const Content = require('../model/contentModel');
const Episode = require('../model/episodeModel');
const cloudinary = require('../config/cloudinaryConfig');

const createSeries = async (req, res) => {
    try {
        const { titulo, descripcion, categorias, clasificacion } = req.body;
        const file = req.file; // Archivo de portada

        if (!titulo || !descripcion || !clasificacion) {
            return res.status(400).json({ message: 'No se proporcionó la portada.' });
        }

        // Subir portada a Cloudinary
        const result = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                { resource_type: 'image' },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            );
            stream.end(file.buffer);
        });

        // Crear la serie en la base de datos
        const series = await Content.create({
            titulo,
            descripcion,
            categorias: categorias ? categorias.split(',') : [], // Convertir categorías separadas por comas en array
            tipo: 'serie',
            portada: result.secure_url,
            clasificacion
        });

        res.status(201).json({ message: 'Serie creada exitosamente', series });
    } catch (error) {
        res.status(500).json({ message: 'Error al crear la serie', error: error.message });
    }
};

const getAllSeries = async (req, res) => {
    try {
        const series = await Content.find({ tipo: 'serie' });
        res.status(200).json(series);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener las series', error: error.message });
    }
};
const getSeriesById = async (req, res) => {
    try {
        const { id } = req.params;

        const series = await Content.findById(id);
        if (!series) {
            return res.status(404).json({ message: 'Serie no encontrada' });
        }

        // Obtener episodios relacionados
        const episodes = await Episode.find({ contenido: id });

        res.status(200).json({ series, episodes });
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener la serie', error: error.message });
    }
};

const addEpisode = async (req, res) => {
    try {
        const { id } = req.params; // ID de la serie
        const { titulo, descripcion, numero, temporada } = req.body;
        const file = req.file; // Archivo del video

        if (!file) {
            return res.status(400).json({ message: 'No se proporcionó el archivo de video.' });
        }

        // Subir video a Cloudinary
        const result = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                { resource_type: 'video' },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            );
            stream.end(file.buffer);
        });

        // Crear el episodio en la base de datos
        const episode = await Episode.create({
            titulo,
            descripcion,
            numero,
            temporada,
            url: result.secure_url,
            contenido: id
        });

        res.status(201).json({ message: 'Episodio agregado exitosamente', episode });
    } catch (error) {
        res.status(500).json({ message: 'Error al agregar el episodio', error: error.message });
    }
};

const getEpisodesBySeries = async (req, res) => {
    try {
        const { id } = req.params;
        const episodes = await Episode.find({ contenido: id });
        res.status(200).json(episodes);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los episodios', error: error.message });
    }
};
module.exports = { createSeries, getAllSeries, getSeriesById, addEpisode, getEpisodesBySeries };
