/* import express from 'express';
import { check } from 'express-validator';
import { validate } from '../middleware/validateJWT.js';
import { validateFields } from '../middleware/validate-fields.js';
import  controllerAssignments from '../controllers/assignment.js';
import { assignmentHelper } from '../helpers/assignment.js'
import { registerHelper } from '../helpers/register.js'



const router = express.Router();

router.get('/listallassignment',[
    validate.validateJWT,
    validateFields
], controllerAssignments.listallassignments)



router.get('/listassignmentbyid/:id',[
    validate.validateJWT,
    check('id', 'el id es invalido').isMongoId(),
    check('id').custom(assignmentHelper.existsAssignmentID),
    validateFields
], controllerAssignments.listtheAssignmentById)



router.get('/listassignmentbyregister/:idregister',[
    validate.validateJWT,
    check('register').custom(registerHelper),
   validateFields
], controllerAssignments.listregisterassignment)



router.get('/listassigmentbyfollowupinstructor/:idinstructor',[
    validate.validateJWT,
    check('instructor').custom(),
    validateFields
], controllerAssignments.listfollowupinstructor)



router.get('/listassigmentbytechnicalinstructor/:idinstructor',[
    validate.validateJWT,
    validateFields
], controllerAssignments.listtechnicalinstructor)



router.get('/listassigmentbyprojectinstructor/:idinstructor',[
    validate.validateJWT,
    validateFields
], controllerAssignments.listprojectinstructor)


router.post('/addassignment',[
    validate.validateJWT,
    check('register').custom(),
    check(' instructorfollow').custom(),
    check(' instructortechnical').custom(),
    check(' instructorproject').custom(),
    check('certificationdoc','El campo certificationdoc es obligatorio').notEmpty(),
    check('judymentPhoto','El campo judymentPhoto es olbigatorio').notEmpty(),
    check('observation','El campo observation es obligatyorio').notEmpty(),
    validateFields
],controllerAssignments.addassignment)


router.put('/updateassignmentbyid/:id',[
    validate.validateJWT,
    check('register').custom(),
    check(' instructorfollow').custom(),
    check(' instructortechnical').custom(),
    check(' instructorproject').custom(),
    validateFields
],controllerAssignments.updateassignmentbyid)


router.put('enableassignmentbyid',[
    validate.validateJWT,

    validateFields
],controllerAssignments.enableassignmentbyid)

router.put('disableassigmentbyid',[
    validate.validateJWT,
    validateFields
],controllerAssignments.disableassigmentbyid)

export default router;


 














; */