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



export default router;
