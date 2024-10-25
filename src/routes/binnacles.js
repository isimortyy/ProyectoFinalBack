import express from 'express';
import { check } from 'express-validator';
import { validate} from '../middleware/validateJWT.js';
import { validateFields } from '../middleware/validate-fields.js';
import controllerBinnacles from '../controllers/binnacles.js';
import { binnaclesHelper } from '../helpers/binnacles.js';
/* import { assignmentHelper } from '../helpers/assignment.js';
 */
import ficheHelper from '../helpers/repfora.js';

const router = express.Router();

router.get('/listarbinnacles', [
    validate.validateJWT,
    validateFields
], controllerBinnacles.listAllBinnacles);

router.get('/listbinnaclesbyid/:id', [
    validate.validateJWT,
    check('id', 'El id no es válido').isMongoId(),
    check('id').custom(binnaclesHelper.existBinnacles),
    validateFields
], controllerBinnacles.listBinnacleById);

router.get('/listbinnaclesbyassignment/:assignment', [
    validate.validateJWT,
    check('assignment').custom(),
    validateFields
], controllerBinnacles.listAssignmentsById);

router.get('/listbinnaclesbyinstructor/:instructor', [
    validate.validateJWT,
    check('instructor').custom(),
    validateFields
], controllerBinnacles.listInstructorsById);

router.post('/addbinnacles', [
    validate.validateJWT,
    check('assignment', 'El campo assignment es obligatorio').notEmpty(),
    check('number', 'El campo number es obligatorio y máximo de 10 caracteres').notEmpty().isLength({ max: 10 }),
    check('document', 'El campo document es obligatorio y máximo de 50 caracteres').notEmpty().isLength({ max: 50 }),
    check('observations', 'El campo observations es obligatorio y máximo de 50 caracteres').notEmpty().isLength({ max: 50 }),
    check('users', 'El campo users es obligatorio').notEmpty(),
    validateFields
], controllerBinnacles.insertBinnacles);

router.put('/updatebinnaclebyid/:id', [
    validate.validateJWT,
    check('id', 'El id no es válido').isMongoId(),
    check('id').custom(binnaclesHelper.existBinnacles),
    check('number', 'El campo number es máximo de 10 caracteres').isLength({ max: 10 }),
    check('document', 'El campo document es máximo de 50 caracteres').isLength({ max: 50 }),
    check('observations', 'El campo observations es máximo de 50 caracteres').isLength({ max: 50 }),
    validateFields
], controllerBinnacles.updateBinnacleById);

router.put('/updatestatus/:id/:status', [
    validate.validateJWT,
    check('id', 'El id no es válido').isMongoId(),
    check('id').custom(binnaclesHelper.existBinnacles),
    validateFields
], controllerBinnacles.updateBinnacleById); //Arreglarr

export default router;
