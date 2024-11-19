import Multer from 'multer';

// Configuración de multer
const upload = Multer({
    limits: { fileSize: 5 * 1024 * 1024 }, // Limita el tamaño del archivo a 5 MB
    fileFilter: (req, file, cb) => {
        // Verifica que el archivo tenga extensión CSV
        if (file.mimetype !== 'text/csv' && file.mimetype !== 'application/vnd.ms-excel') {
            return cb(new Error('Solo se permiten archivos en formato CSV'));
        }
        cb(null, true);
    }
});

export default upload;