import express from 'express';
import { check } from 'express-validator';
import { validateJWT } from '../middleware/validateJWT.js';
import { validateFields } from '../middleware/validate-fields.js';
import  modalityController  from '../controllers/modality.js'
import { modalityHelper } from '../helpers/modality.js'


const router = express.Router();


router.get('/listallmodality', [
    validateJWT,
], modalityController.listModalities);


router.get('/listmodalitybyid/:id', [
validateJWT,
check('id', 'El id es invalido').isMongoId(),
validateFields
], modalityController.getModalityById);



router.post('/addmodality', [
    validateJWT,
    check("name", "El nombre es obligatorio").not().isEmpty(),
    check('hourInstructorFollow', "La hora del seguimiento del instructor debe ser un número").optional().isNumeric(),
    check("hourInstructorTechnical", "El número de horas del instructor técnico debe ser un número").optional().isNumeric(),
    check("hourInstructorProject", "El número de horas del proyecto debe ser un número").optional().isNumeric(),
validateFields

], modalityController.createModality);



router.put('/updatemodalitybyid/:id', [
validateJWT,
check('id', 'El id es invalido').isMongoId(),
check('name', ' El campo name es obligatorio').notEmpty(),
check('hourInstructorFollo','El campo hourInstructorFollow es obligatorio').notEmpty(),
check('hourInstructorTechnical','El campo hourInstructorTechnical es obligatorio').notEmpty(),
check('hourInstructorProject', 'El campo hourInstructorProject es obligatorio').notEmpty(),
validateFields
], modalityController.editModality);



router.put('/enablemodalitybyid/:id', [
validateJWT,
check('id', 'El id es invalido').isMongoId(),
validateFields
], modalityController.enablemodalitybyid);


router.put('/disablemodalitybyid/:id', [
    validateJWT,
    check('id', 'El id es invalido').isMongoId(),
    validateFields
    ], modalityController.disablemodalitybyid);

export default router;

