import express from 'express';
import { check } from 'express-validator';
import { validateJWT } from '../middleware/validateJWT.js';
import { validateFields } from '../middleware/validate-fields.js';
import controllerApprentice from '../controllers/apprentice.js';
import ficheHelper from '../helpers/repfora.js'
import { apprenticeHelper } from '../helpers/apprentice.js';
import { modalityHelper } from '../helpers/modality.js';

const router = express.Router();

router.get('/listallapprentice', [
    validateJWT,
    validateFields
], controllerApprentice.listtheapprentice);

router.get('/listapprenticebyid/:id', [
    validateJWT,
    check('id', 'El id no es válido').isMongoId(),
    check('id').custom(apprenticeHelper.existApprentice),
    validateFields
], controllerApprentice.listtheapprenticebyid);

router.get('/listapprenticebyfiche/:fiche', [
    validateJWT,
    check('fiche').custom(ficheHelper.existeFicheID),
    check('fiche', 'El campo fiche es obligatorio').notEmpty(),
    validateFields
], controllerApprentice.listtheapprenticebyficheid);

router.get('/listapprenticebystatus/:status', [
    validateJWT,
    validateFields
], controllerApprentice.listApprenticeByStatus);

router.post('/addapprentice', [
    validateJWT ,
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
   check('email', 'el email es obligatorio').notEmpty(),
   check('modality', 'No es un ID válido').isMongoId(),
   check('modality').custom(modalityHelper.existsModalityID),
    validateFields
], controllerApprentice.inserttheapprentice);

router.put('/updateapprenticebyid/:id', [
    validateJWT,
    check('id', 'El id no es válido').isMongoId(),
    check('id').custom(apprenticeHelper.existApprentice),
    check('fiche').custom(ficheHelper.existeFicheID),
    check('firstName', 'El campo firstName es máximo de 50 caracteres').isLength({ max: 50 }),
    check('lastName', 'El campo lastName es de máximo de 50 caracteres').isLength({ max: 50 }),
    check('phone', 'El campo phone es de máximo 10 caracteres').isLength({ max: 10 }),
    validateFields
], controllerApprentice.updateapprenticebyid);

router.put('/enableapprentice/:id', [
    validateJWT,
    check('id', 'El id no es válido').isMongoId(),
    check('id').custom(apprenticeHelper.existApprentice),
    validateFields
], controllerApprentice.enableapprentice);

router.put('/disableapprentice/:id', [
    validateJWT,
    check('id', 'El id no es válido').isMongoId(),
    check('id').custom(apprenticeHelper.existApprentice),
    validateFields
], controllerApprentice.disableapprentice);

export default router;
