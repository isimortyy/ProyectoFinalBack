import express from 'express';
import { check } from 'express-validator';
import { validate } from '../middleware/validateJWT.js';
import { validateFields } from '../middleware/validate-fields.js';
import controllerApprentice from '../controllers/apprentice.js';
import ficheHelper from '../helpers/repfora.js'
import { apprenticeHelper } from '../helpers/apprentice.js';
import { modalityHelper } from '../helpers/modality.js';
import multer from 'multer';
import mongoose from 'mongoose';

const router = express.Router();

const upload = multer({ 
    storage: multer.memoryStorage(),
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'text/csv' || file.mimetype === 'application/vnd.ms-excel') {
            cb(null, true);
        } else {
            cb(new Error('El archivo debe ser un CSV válido'), false);
        }
    },
    limits: {
        fileSize: 1024 * 1024 * 5 // Limitar a 5MB
    }
});

router.post('/login', [
    check('email')
        .isEmail().withMessage('El correo es obligatorio y debe ser valido')
        .custom(async (email) => {
            const exist = await apprenticeHelper.notExistEmail(email)
            if (exist){
                throw new Error ('No existe un aprendiz con ese correo')
            }
            return true
        }),
    check('numDocument', 'El documento es obligatorio').notEmpty().custom(apprenticeHelper.notExistNumDocument), 
    validateFields
], controllerApprentice.postLogin);

router.get('/listallapprentice', [ 
    validate.validateJWT,
    validateFields
], controllerApprentice.listtheapprentice);

router.get('/listapprenticebyid/:id', [
    validate.validateJWT,
    check('id', 'El id no es válido').isMongoId(),
    check('id').custom(apprenticeHelper.existApprentice),
    validateFields
], controllerApprentice.listtheapprenticebyid);

router.get('/listapprenticebyfiche/:idfiche', [
    validate.validateJWT,
    check('idfiche','El id de la ficha es obligatorio').notEmpty(),
    check('idfiche').custom(async (idfiche, { req }) => {
        if(!mongoose.Types.ObjectId.isValid(idfiche)){
            throw new Error ('El id de la ficha debe ser valido')
        }
        await ficheHelper.existeFicheID(idfiche, req.headers.token);
    }),
    validateFields
], controllerApprentice.listtheapprenticebyficheid);

router.get('/listapprenticebystatus/:status', [
    validate.validateJWT,
    check ('status', ' El estado es obligatorio').notEmpty(),
    validateFields
], controllerApprentice.listApprenticeByStatus);

router.get('/listapprenticebymodality', [
    validate.validateJWT,
    check('modality', 'La modalidad es obligatoria').notEmpty(),
    check('modality').custom(modalityHelper.existeModalityID),
    validateFields
], controllerApprentice.listApprenticeByModality);

router.post('/addapprentice', [
    validate.validateJWT,
    check('fiche', 'El campo ficha es obligatorio').notEmpty(),
    check('fiche.idfiche', 'El ID no es valido').isMongoId(),
    check('fiche.idfiche').custom(async (idFiche, { req }) => {
        await ficheHelper.existeFicheID(idFiche, req.headers.token)
    }),
    check('fiche.number', 'El codigo de la ficha es obligatorio').notEmpty(),
    check('fiche.name', 'El nombre de la ficha es obligatorio').notEmpty(),
    check('modality', 'No es un ID válido').isMongoId(),
    check('modality').custom(modalityHelper.existeModalityID),
    check('tpDocument', 'el documento es obligatorio').notEmpty(),
    check('numDocument', 'el documento es obligatorio').notEmpty(),
    check('numDocument').custom(apprenticeHelper.existNumDocument),
    check('firstName', 'el nombre es obligatorio').notEmpty(),
    check('lastName', 'el apellido es obligatorio').notEmpty(),
    check('phone', 'el telefono es obligatorio').notEmpty(),
    check('personalEmail', 'el email es obligatorio').notEmpty(),  
    check('personalEmail').isEmail().withMessage('El correo debe ser valido').custom(apprenticeHelper.existPersonalEmail),
    check('institucionalEmail', 'el email es obligatorio').notEmpty().isEmail(),
    check('institucionalEmail').isEmail().withMessage('El correo debe ser valido').custom(apprenticeHelper.existInstitucionalEmail),
    validateFields
], controllerApprentice.inserttheapprentice);

router.put('/updateapprenticebyid/:id', [
    validate.validateJWT,
    check('id', 'El id no es valido').isMongoId(),
    check('fiche.idfiche','El ID no es valido').optional().isMongoId(),
    check('fiche','El campo ficha es obligatorio').optional().notEmpty(),
    check('fiche.idfiche').optional().custom(async (idfiche, { req }) => {
        await ficheHelper.existeFicheID(idfiche, req.headers.token);
    }),
    check('fiche.number','El código de la ficha es obligatorio').optional().notEmpty(),
    check('fiche.name','El nombre de la ficha es obligatorio').optional().notEmpty(),
    check('modality').optional().custom(modalityHelper.existeModalityID),
    check('tpNocument','El documento es obligatorio').optional().notEmpty(),
    check('numNocument','El documento es obligatorio').optional().notEmpty(),
    check('numDocument').optional().custom((numDocument , {req})=> apprenticeHelper.existNumDocument (numDocument,req.params.id)),
    check('firstName','El nombre es obligatorio').optional().notEmpty(),
    check('lastName','El apellido es obligatorio').optional().notEmpty(),
    check('phone','El teléfono es obligatorio').optional().notEmpty(),
    check('institutionalEmail').optional().isEmail(),
    check('personalEmail').optional().isEmail(),
    validateFields
], controllerApprentice.updateapprenticebyid);

router.put('/updateStatus/:id',[
    validate.validateJWT,
    check ('id', 'El id no es valido').isMongoId(),
    check ('status', 'El estado es obligatorio').notEmpty(),
    validateFields
], controllerApprentice.updateStatus);

router.put('/enableapprentice/:id', [
    validate.validateJWT,
    check('id', 'El id no es válido').isMongoId(),
    check('id').custom(apprenticeHelper.existApprentice),
    validateFields
], controllerApprentice.enableapprentice);

router.put('/disableapprentice/:id', [
    validate.validateJWT,
    check('id', 'El id no es válido').isMongoId(),
    check('id').custom(apprenticeHelper.existApprentice),
    validateFields
], controllerApprentice.disableapprentice);

//carga de archivo plano
router.post('/uploadFile', 
    controllerApprentice.upload.single('file'), 
    controllerApprentice.uploadFile,
    upload.single('file'),
    validate.validateJWT,
    async (req, res) => {
        try {
            if (!req.file) {
                return res.status(400).json({ message: 'No se ha cargado ningún archivo' });
            }
            const results = await controllerApprentice.createApprenticesCSV(req.file, req.headers.authorization);
            res.status(201).json({ 
                message: 'Archivo procesado correctamente', 
                data: results
            });
        } catch (error) {
            console.error('Error al procesar el archivo:', error);
            res.status(500).json({ 
                message: 'Error al procesar el archivo', 
                error: error.message 
            });
        }
    }
);

export default router;

