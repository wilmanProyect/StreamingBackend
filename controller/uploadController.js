const cloudinary = require('../config/cloudinaryConfig');
const multer = require('multer');

// Configurar almacenamiento en memoria para Multer
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Subir archivo a Cloudinary
const uploadFile = async (req, res) => {
    try {
        const file = req.file; // Archivo recibido
        if (!file) {
            return res.status(400).json({ message: 'No se proporcionó ningún archivo' });
        }

        // Subir a Cloudinary
        const result = await cloudinary.uploader.upload_stream(
            { resource_type: 'auto' },
            (error, result) => {
                if (error) return res.status(500).json({ message: error.message });

                res.status(200).json({
                    message: 'Archivo subido correctamente',
                    url: result.secure_url, // URL pública del archivo
                    public_id: result.public_id, // ID público para manejar el archivo
                });
            }
        );

        // Usar el buffer del archivo para subirlo
        result.end(req.file.buffer);
    } catch (error) {
        res.status(500).json({ message: 'Error al subir el archivo', error: error.message });
    }
};

module.exports = { upload, uploadFile };
