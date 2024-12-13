const cloudinary = require('../config/cloudinaryConfig');
const multer = require('multer');

// Configurar almacenamiento en memoria para Multer
const storage = multer.memoryStorage();

// Filtro para permitir imágenes y videos
const fileFilter = (req, file, cb) => {
    const allowedTypes = [
        'image/jpeg',
        'image/png',
        'image/gif',
        'video/mp4',
        'video/avi',
        'video/mkv'
    ];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true); // Acepta el archivo
    } else {
        cb(new Error('Tipo de archivo no permitido. Solo imágenes y videos son aceptados.'), false);
    }
};

// Configuración de Multer
const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 1024 * 1024 * 200 } // Límite de 200MB (en bytes)
});

// Subir archivo a Cloudinary
const uploadFile = async (req, res) => {
    try {
        const file = req.file; // Archivo recibido
        if (!file) {
            return res.status(400).json({ message: 'No se proporcionó ningún archivo' });
        }

        // Determinar si es imagen o video
        const resourceType = file.mimetype.startsWith('image') ? 'image' : 'video';

        // Subir a Cloudinary
        const result = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                { resource_type: resourceType },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            );
            stream.end(file.buffer); // Enviar el archivo al stream
        });

        res.status(200).json({
            message: 'Archivo subido correctamente',
            url: result.secure_url, // URL pública del archivo
            public_id: result.public_id, // ID público para manejar el archivo
        });
    } catch (error) {
        res.status(500).json({ message: 'Error al subir el archivo', error: error.message });
    }
};

module.exports = { upload, uploadFile };