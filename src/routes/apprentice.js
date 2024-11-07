import express, { Router } from 'express';
import { check } from 'express-validator';
import { validate } from '../middleware/validateJWT.js';
import { validateFields } from '../middleware/validate-fields.js';
import controllerApprentice from '../controllers/apprentice.js';
import ficheHelper from '../helpers/repfora.js'
import { apprenticeHelper } from '../helpers/apprentice.js';
import { modalityHelper } from '../helpers/modality.js';

const router = express.Router();

router.post('/login' , [
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
    check('idfiche').custom(async (idfiche, { req }) => {
        await ficheHelper.existeFicheID(idfiche, req.headers.token);
    })
    .withMessage('ID de ficha es obligatorio'),

    validateFields
], controllerApprentice.listtheapprenticebyficheid);

router.get('/listapprenticebystatus/:status', [
    validate.validateJWT,
    validateFields
], controllerApprentice.listApprenticeByStatus);

router.post('/addapprentice', [
    validate.validateJWT,
   check('fiche', 'El campo ficha es obligatorio').notEmpty(),
   check('fiche.idfiche', 'El ID no es valido').isMongoId(),
   check('fiche.idfiche').custom(async (idFiche, { req }) => {
       await ficheHelper.existeFicheID(idFiche, req.headers.token)
   }),
   check('fiche.number', 'El codigo de la ficha es obligatorio').notEmpty(),
   check('fiche.name', 'El nombre de la ficha es obligatorio').notEmpty(),
   check('tpdocument', 'el documento es obligatorio').notEmpty(),
   check('numdocument', 'el documento es obligatorio').notEmpty(),
   check('firstname', 'el nombre es obligatorio').notEmpty(),
   check('lastname', 'el apellido es obligatorio').notEmpty(),
   check('phone', 'el telefono es obligatorio').notEmpty(),
   check('personalEmail', 'el email es obligatorio').notEmpty(),  
    check('institucionalEmail', 'el email es obligatorio').notEmpty(),
   check('modality', 'No es un ID válido').isMongoId(),
   check('modality').custom(modalityHelper.existeModalityID),
    validateFields
], controllerApprentice.inserttheapprentice);

router.put('/updateapprenticebyid/:id', [
    validate.validateJWT,
    check('id').custom(apprenticeHelper.existApprentice),
    check('fiche.idfiche','El ID no es valido').optional().isMongoId(),
    check('fiche','El campo ficha es obligatorio').optional().notEmpty(),
    check('fiche.idfiche').optional().custom(async (idfiche, { req }) => {
            await ficheHelper.existeFicheID(idfiche, req.headers.token);
        }),
    check('fiche.number','El código de la ficha es obligatorio').optional().notEmpty(),
    check('fiche.name','El nombre de la ficha es obligatorio').optional().notEmpty(),
    check('tpdocument','El documento es obligatorio').optional().notEmpty(),
    check('numdocument','El documento es obligatorio').optional().notEmpty(),
    check('firstname','El nombre es obligatorio').optional().notEmpty(),
    check('lastname','El apellido es obligatorio').optional().notEmpty(),
    check('phone','El teléfono es obligatorio').optional().notEmpty(),
    check('email','El email es obligatorio').optional().notEmpty(),
    
    validateFields
], controllerApprentice.updateapprenticebyid);

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

export default router;
