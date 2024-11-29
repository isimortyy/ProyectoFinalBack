import express from 'express';
import { check } from 'express-validator';
import { validate} from '../middleware/validateJWT.js';
import { validateFields } from '../middleware/validate-fields.js';
import controllerBinnacles from '../controllers/binnacles.js';
import { binnaclesHelper } from '../helpers/binnacles.js';
import { registerHelper  } from '../helpers/register.js'
import { instructorHelper } from '../helpers/instructor.js'


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

router.get('/listBinnaclesByRegister/:register',[
    validate.validateJWT,
    check('register', "no es valido").isMongoId(),
    check('register').custom(registerHelper.existResgister),
    validateFields
 ],controllerBinnacles.listBinnaclesByRegister)



 router.get('/listbinnaclesbyinstructor/:idinstructor', [
    validate.validateJWT,
    check('idInstructor').custom(async (idInstructor, { req }) => {
       await instructorHelper.existsInstructorsID(idInstructor, req.headers.token);
     }),
    validateFields
 ], controllerBinnacles.listbinnaclesbyinstructor)

 
router.get('/getobservations/:id', [
    check('id', 'El id de la bitácora no es válido').isMongoId(), 
      validateFields, 
 ], controllerBinnacles.getObservations); 
 

 router.post('/addbinnacles', [
   check('register').custom(registerHelper.existResgister),
   check('instructor', 'El instructor es obligatorio').notEmpty(),
   check('instructor.idInstructor', 'El id no es válido').isMongoId(),
   check('idInstructor').custom(async (idInstructor, { req }) => {
     if (idInstructor) {
       await instructorHelper.existsInstructorsID(idInstructor, req.headers.token);
     }
   }),
   check('number', 'El number es obligatorio').notEmpty(),
   check('document', 'El document es obligatorio').notEmpty(),
   check('number').custom(binnaclesHelper.existNumber),
   check('document').custom(binnaclesHelper.existDocument),
   validateFields
], controllerBinnacles.addbinnacles);


router.put('/updatebinnaclebyid/:id', [
    validate.validateJWT,
    check('id', 'El id no es válido').isMongoId(), 
    check('id').custom(binnaclesHelper.existBinnacles), 
    check('number').optional().isNumeric(), 
    check('number').optional().custom(async (number, { req }) => {
        if (number) {
            await binnaclesHelper.existNumber(number, req.params.id);
        }
    }),
    check('document').optional().isLength({ max: 50 }),
    check('document').optional().custom(async (document, { req }) => {
        if (document) {
            await binnaclesHelper.existDocument(document, req.params.id);
        }
    }),
    validateFields
 ], controllerBinnacles.updatebinnaclebyid);
 

 router.put('/updatestatus/:id/:status',[
    validate.validateJWT,
     check('id','El id no es valido').isMongoId(),
     check('id').custom(binnaclesHelper.existBinnacles),
     validateFields
 ],controllerBinnacles.updatestatus)

 router.put('/updateCheckProjectInstructor/:id', [
        validate.validateJWT,
    check('id', 'El id no es válido').isMongoId(),
    check('id').custom(binnaclesHelper.existBinnacles),
   validateFields
 ],controllerBinnacles.updateCheckProjectInstructor);
 
 
 router.put('/updateCheckTechnicalInstructor/:id', [
        validate.validateJWT,
    check('id', 'El id no es válido').isMongoId(),
    check('id').custom(binnaclesHelper.existBinnacles),
   validateFields
 ],controllerBinnacles.updateCheckTechnicalInstructor);
 
 
 router.put('/validateHoursTechnical/:id', [
        validate.validateJWT,
    check('id', 'El id no es válido').isMongoId(),
    check('id').custom(binnaclesHelper.existBinnacles),
   validateFields
 ],controllerBinnacles.validateHoursTechnical);
 

 router.put('/validateHoursProject/:id', [
     validate.validateJWT,
    check('id', 'El id no es válido').isMongoId(),
    check('id').custom(binnaclesHelper.existBinnacles),
      validateFields
 ],controllerBinnacles.validateHoursProject);
 
 
 
 router.put('/addobservation/:id', [
     validate.validateJWT,
    check('id', 'El id de la bitácora no es válido').isMongoId(),
    check('observation', 'La observación es obligatoria').not().isEmpty(), 
      validateFields, 
 ], controllerBinnacles.addObservation);
 



export default router;
