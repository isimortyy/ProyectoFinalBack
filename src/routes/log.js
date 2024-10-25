import express from 'express';
import { check } from 'express-validator';
import { validate } from '../middleware/validateJWT.js';
import { validateFields } from '../middleware/validate-fields.js';
import logController from '../controllers/log.js';
import { logsHelper } from '../helpers/log.js';

const router = express.Router();

router.get('/listlogs', [
    validate.validateJWT,
], logController.listLogs);

router.get('/listlogs/:id', [
    validate.validateJWT,
    check('id', 'El id no es válido').isMongoId(),
    check('id').custom(logsHelper.existsLogID),
    validateFields
], logController.getLogById);

router.post('/addlog', [
    validate.validateJWT,
    check('users', 'El users es obligatorio').notEmpty(),
    check('action', 'La action es obligatoria').notEmpty(),
    check('information', 'La information es obligatoria').notEmpty(),
    check('data', 'La data es obligatoria').notEmpty(),
    check('hourInstructorProject', 'Las horas son obligatorias').notEmpty(),
    validateFields
], logController.createLog);

router.put('/enablelogsbyid/:id', [
    validate.validateJWT,
    check('id', 'El id no es válido').isMongoId(),
    check('id').custom(logsHelper.existsLogID),
    validateFields
], logController.enablelogsbyid);

router.put('/disablelogsbyid/:id', [
    validate.validateJWT,
    check('id', 'El id no es válido').isMongoId(),
    check('id').custom(logsHelper.existsLogID),
    validateFields
], logController.disablelogsbyid);

export default router;
