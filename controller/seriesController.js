const Content = require('../model/contentModel');
const Episode = require('../model/episodeModel');
const cloudinary = require('../config/cloudinaryConfig');

const createSeries = async (req, res) => {
    try {
        const { titulo, descripcion, categorias, clasificacion } = req.body;
        const file = req.file; // Archivo de portada

        if (!titulo || !descripcion || !clasificacion) {
            return res.status(400).json({ message: 'Faltan datos obligatorios: título, descripción o clasificación.' });
        }

        if (!file) {
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
            clasificacion,
            creador: req.user._id // Referencia al creador (usuario autenticado)
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

const searchSeriesByTitle = async (req, res) => {
    const { titulo } = req.query;
    try {
        if (!titulo) {
            return res.status(400).json({ message: 'El título es obligatorio para realizar la búsqueda' });
        }

        console.log('Título recibido:', titulo);

        const series = await Content.find({
            titulo: { $regex: titulo, $options: 'i' }
        });

        if (!series.length) {
            return res.status(404).json({ message: 'No se encontraron series con ese título' });
        }

        res.status(200).json(series);
    } catch (error) {
        console.error('Error al buscar la serie:', error.message);
        res.status(500).json({ message: 'Error al buscar la serie', error: error.message });
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

const updateSeries = async (req, res) => {
    try {
        const { id } = req.params;
        const { titulo, descripcion, categorias, clasificacion } = req.body;

        const updatedData = {
            ...(titulo && { titulo }),
            ...(descripcion && { descripcion }),
            ...(categorias && { categorias: categorias.split(',') }),
            ...(clasificacion && { clasificacion }),
        };

        if (req.file) {
            // Subir nueva portada a Cloudinary si se envía un archivo
            const result = await new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    { resource_type: 'image' },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result);
                    }
                );
                stream.end(req.file.buffer);
            });

            updatedData.portada = result.secure_url;
        }

        const series = await Content.findByIdAndUpdate(id, updatedData, { new: true });

        if (!series) {
            return res.status(404).json({ message: 'Serie no encontrada' });
        }

        res.status(200).json({ message: 'Serie actualizada correctamente', series });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar la serie', error: error.message });
    }
};

const deleteSeries = async (req, res) => {
    try {
        const { id } = req.params;

        // Eliminar episodios relacionados
        await Episode.deleteMany({ contenido: id });

        // Eliminar la serie
        const series = await Content.findByIdAndDelete(id);

        if (!series) {
            return res.status(404).json({ message: 'Serie no encontrada' });
        }

        res.status(200).json({ message: 'Serie y episodios eliminados correctamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar la serie', error: error.message });
    }
};

const updateEpisode = async (req, res) => {
    try {
        const { id, episodeId } = req.params;
        const { titulo, descripcion, numero, temporada } = req.body;

        const updatedData = {
            ...(titulo && { titulo }),
            ...(descripcion && { descripcion }),
            ...(numero && { numero }),
            ...(temporada && { temporada }),
        };

        if (req.file) {
            // Subir nuevo video a Cloudinary si se envía un archivo
            const result = await new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    { resource_type: 'video' },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result);
                    }
                );
                stream.end(req.file.buffer);
            });

            updatedData.url = result.secure_url;
        }

        const episode = await Episode.findByIdAndUpdate(episodeId, updatedData, { new: true });

        if (!episode) {
            return res.status(404).json({ message: 'Episodio no encontrado' });
        }

        res.status(200).json({ message: 'Episodio actualizado correctamente', episode });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar el episodio', error: error.message });
    }
};

const deleteEpisode = async (req, res) => {
    try {
        const { episodeId } = req.params;

        const episode = await Episode.findByIdAndDelete(episodeId);

        if (!episode) {
            return res.status(404).json({ message: 'Episodio no encontrado' });
        }

        res.status(200).json({ message: 'Episodio eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar el episodio', error: error.message });
    }
};
const getMovies = async (req, res) => {
    try {
        // Filtrar por tipo: 'película'
        const movies = await Content.find({ tipo: 'película' });

        if (!movies.length) {
            return res.status(404).json({ message: 'No se encontraron películas' });
        }

        res.status(200).json(movies);
    } catch (error) {
        console.error('Error al obtener las películas:', error.message);
        res.status(500).json({ message: 'Error al obtener las películas', error: error.message });
    }
};


const getContentByCreator = async (req, res) => {
    try {
        const { id } = req.params;

        // Verificar si el creador existe
        const content = await Content.find({ creador: id });

        if (!content.length) {
            return res.status(404).json({ message: 'No se encontró contenido para este creador' });
        }

        res.status(200).json(content);
    } catch (error) {
        console.error('Error al obtener contenido del creador:', error.message);
        res.status(500).json({ message: 'Error al obtener contenido del creador', error: error.message });
    }
};

module.exports = { 
    createSeries,
    getAllSeries, 
    addEpisode, 
    getEpisodesBySeries, 
    updateSeries, 
    deleteSeries,
    updateEpisode,
    deleteEpisode,
    searchSeriesByTitle,
    getMovies,
    getContentByCreator
};
