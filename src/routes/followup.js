import express from 'express';
import { check } from 'express-validator';
import { validateJWT } from '../middleware/validateJWT.js';
import { validateFields } from '../middleware/validate-fields.js';
import controllerFollowup from '../controllers/followup.js';
import { followupHelper } from '../helpers/followup.js';

const router = express.Router();

router.get('/listallfollowup', [
    validateJWT,
], controllerFollowup.listFollowups);

router.get('/listfollowupbyid/:id', [
    validateJWT,
    check('id', 'El id no es válido').isMongoId(),
    validateFields
], controllerFollowup.getFollowupById);

router.get('/listfollowupbyassignment/:idassignment', [
    validateJWT,
    check('idassignment').custom(followupHelper.existsAssignment),
    validateFields
], controllerFollowup.listFollowupsByAssignment);

router.get('/listfollowupbyinstructor/:idinstructor', [
    validateJWT,
    check('idinstructor').custom(followupHelper.existsInstructor),
    validateFields
], controllerFollowup.listFollowupsByInstructor);

router.post('/addfollowup', [
    validateJWT,
    check('assignment', 'La assignment es obligatoria').notEmpty(),
    check('instructor', 'El instructor es obligatorio').notEmpty(),
    check('number', 'El number es máximo de 10 caracteres').isLength({ max: 10 }),
    check('number', 'El number es obligatorio').notEmpty(),
    check('month', 'El month es obligatorio').notEmpty(),
    check('document', 'El document es máximo de 50 caracteres').isLength({ max: 50 }),
    check('document', 'El document es obligatorio').notEmpty(),
    check('users', 'El users es obligatorio').notEmpty(),
    check('observations', 'El observations es de máximo 50 caracteres').isLength({ max: 50 }),
    check('observations', 'El observations es obligatorio').notEmpty(),
    validateFields
], controllerFollowup.insertFollowup);

router.put('/updatefollowupbyid/:id', [
    validateJWT,
    check('id', 'El id no es válido').isMongoId(),
    check('number', 'El number es máximo de 10 caracteres').isLength({ max: 10 }),
    check('document', 'El document es máximo de 50 caracteres').isLength({ max: 50 }),
    check('observations', 'El observations es de máximo 50 caracteres').isLength({ max: 50 }),
    validateFields
], controllerFollowup.updateFollowup);

router.put('/updatestatus/:id/:status', [
    validateJWT,
    check('id', 'El id no es válido').isMongoId(),
    validateFields
], controllerFollowup.updatestatus); //Arreglarr

export default router;
