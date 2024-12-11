const multer = require('multer');
const path = require('path');

//Configuracion del almacenamiento
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Carpeta donde se guardarán los archivos
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}_${file.originalname}`);
    }
});
//Filtros para los tipos de archivos 

const fileFilter = (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png|mp4|avi|mkv/
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    if(extname){
        cb(null,true);
    }else{
        cb(new Error('El tipo de archivo no es permitido'));
    }
};

const upload = multer({
    storage, limits: {fileSize: 2080 * 1080 * 1000},fileFilter
});

module.exports = upload;