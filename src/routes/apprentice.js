import express from 'express';
import { check } from 'express-validator';
import { validateJWT } from '../middleware/validateJWT.js';
import { validateFields } from '../middleware/validate-fields.js';
import controllerApprentice from '../controllers/apprentice.js';
import { registerHelper } from '../helpers/register.js';
import { fichesHelper } from '../helpers/fiches.js';
import { apprenticeHelper } from '../helpers/apprentice.js';

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
    check('fiche').custom(fichesHelper.existsFicheID),
    check('fiche', 'El campo fiche es obligatorio').notEmpty(),
    validateFields
], controllerApprentice.listtheapprenticebyficheid);

router.get('/listapprenticebystatus/:status', [
    validateJWT,
    validateFields
], controllerApprentice.listApprenticeByStatus);

router.post('/addapprentice', [
   /*  validateJWT */
    check('fiche', 'el campo es obligatorio').notEmpty(),
    check('fiche.idficha', 'El campo id ficha es obligatorio').isMongoId(),
    check('fiche.idficha').custom(fichesHelper.existsFicheID),
    check('fiche.number', 'El campo number es obligatorio').notEmpty(),
    check('fiche.name', 'El campo name es obligatorio').notEmpty(),

    check('tpDocument', 'El campo tpDocument es obligatorio').notEmpty(),
    check('numDocument', 'El campo numDocument es obligatorio').notEmpty(),
    check('numDocument').custom(apprenticeHelper.existNumDocument),
    check('firstName', 'El campo firstName es obligatorio').notEmpty(),
    check('lastName', 'El campo lastName es obligatorio').notEmpty(),
    check('phone', 'El campo phone es obligatorio').notEmpty(),
    check('email', 'El campo email es obligatorio').notEmpty(),
    check('email').custom(apprenticeHelper.existEmail),
    check('firstName', 'El campo firstName es máximo de 50 caracteres').isLength({ max: 50 }),
    check('lastName', 'El campo lastName es de máximo de 50 caracteres').isLength({ max: 50 }),
    check('phone', 'El campo phone es de máximo 10 caracteres').isLength({ max: 10 }),
    validateFields
], controllerApprentice.inserttheapprentice);

router.put('/updateapprenticebyid/:id', [
    validateJWT,
    check('id', 'El id no es válido').isMongoId(),
    check('id').custom(apprenticeHelper.existApprentice),
    check('fiche').custom(fichesHelper.existsFicheID),
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
