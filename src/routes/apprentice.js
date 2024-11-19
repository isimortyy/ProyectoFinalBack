import express, { Router } from 'express';
import { check } from 'express-validator';
import { validate } from '../middleware/validateJWT.js';
import { validateFields } from '../middleware/validate-fields.js';
import controllerApprentice from '../controllers/apprentice.js';
import ficheHelper from '../helpers/repfora.js'
import { apprenticeHelper } from '../helpers/apprentice.js';
import { modalityHelper } from '../helpers/modality.js';
import upload from "../middleware/uploadCSV.js"
import mongoose from 'mongoose';


const router = express.Router();

router.post('/login', [

    check ('email')
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
],controllerApprentice.postLogin)


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

router.get ('/listapprenticebymodality', [
    validate.validateJWT,
    check('modality', 'La modalidad es obligatoria').notEmpty(),
    check('modality').custom(modalityHelper.existeModalityID),
    validateFields
], controllerApprentice.listApprenticeByModality )


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
    check('modality'). optional().custom(modalityHelper.existeModalityID),
    check('tpNocument','El documento es obligatorio').optional().notEmpty(),
    check('numNocument','El documento es obligatorio').optional().notEmpty(),
    check('numDocument').optional().custom((numDocument , {req})=> apprenticeHelper.existNumDocument (numDocument,req.params.id)),
    check('firstName','El nombre es obligatorio').optional().notEmpty(),
    check('lastName','El apellido es obligatorio').optional().notEmpty(),
    check('phone','El teléfono es obligatorio').optional().notEmpty(),
    check('institutionalEmail').optional().isEmail(),/* .withMessage('El email institucional debe ser válido').custom((institutionalEmail, { req }) => apprenticeHelper.existInstitucionalEmail(institutionalEmail, req.params.id)), */        
    check('personalEmail').optional().isEmail(),/* .withMessage('El email personal debe ser válido').custom((personalEmail, { req }) => apprenticeHelper.existPersonalEmail(personalEmail, req.params.id)), */

    validateFields
], controllerApprentice.updateapprenticebyid);

router.put('/updateStatus/:id',[
    validate.validateJWT,
    check ('id', 'El id no es valido').isMongoId(),
    check ('status', 'El estado es obligatorio').notEmpty(),
    validateFields
], controllerApprentice.updateStatus)


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


router.post( '/uploadFile', upload.single('file'), // Middleware para manejar la carga del archivo
[
    validate.validateJWT,
    /* check('file', 'El archivo CSV es obligatorio').custom((value, { req }) => {
        if (!req.file) throw new Error('No se ha cargado un archivo');
        return true;
    }),
    check('ficheNumber', 'El número de la ficha es obligatorio').notEmpty(),
    check('ficheNumber').custom(async (number, { req }) => {
        await ficheHelper.existsFicheNumber(number, req.headers.token);
    }),
    validateFields */
],
async (req, res) => {
    try {
        const token = req.headers['authorization'] || req.headers['token'];
        const createdRecords = await controllerApprentice.createApprenticesCSV(req.file, token);
        res.status(201).json({ message: 'Aprendices y preregistros guardados exitosamente', data: createdRecords });
    } catch (error) {
        res.status(500).json({ message: error.message });
          }
}
    
)

export default router;
