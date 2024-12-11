import express from 'express';
import { check } from 'express-validator';
import { validate } from '../middleware/validateJWT.js';
import { validateFields } from '../middleware/validate-fields.js';
import { Router } from 'express';
import  controllerRegister  from '../controllers/register.js';
import { registerHelper, } from '../helpers/register.js';
import { modalityHelper } from '../helpers/modality.js'
import { apprenticeHelper } from '../helpers/apprentice.js'
import { instructorHelper } from '../helpers/instructor.js';
import ficheHelper from '../helpers/repfora.js';



const router = Router()


router.get('/listallregister', [
  validate.validateJWT,
], controllerRegister.listallregister)


router.get('/listregisterbyid/:id', [
  validate.validateJWT,
  check('id', 'El id no es valido').isMongoId(),
  check('id').custom(registerHelper.existResgister),
 validateFields
], controllerRegister.listtheregisterbyid)


router.get('/lisregisterbyapprentice/:apprentice', [
  validate.validateJWT,
  check('apprentice').custom(apprenticeHelper.existApprentice),
  validateFields
], controllerRegister.listtheapprenticebyid)


router.get ('/listregistersbyfiche/:idfiche',[ 
  validate.validateJWT,
  check('idfiche').custom(async (idfiche, { req }) => {
    await ficheHelper.existeFicheID(idfiche, req.headers.token);
}),
  validateFields
],controllerRegister.listregistersbyfiche )


router.get('/listregisterbymodality/:idmodality', [
  validate.validateJWT,
  check( 'modality' ).custom(modalityHelper.existeModalityID),
  validateFields
], controllerRegister.listthemodalitybyid)


 
router.get('/listregisterbystartdate/:startDate', [
  validate.validateJWT,
  validateFields
], controllerRegister.listregisterstardatebyid)


router.get('/listregisterbyenddate/:endDate', [
  validate.validateJWT,
  validateFields
], controllerRegister.listregisterenddatebyid)


router.post('/addregister',[
  validate.validateJWT,
   check('apprentice','Este Id no es valido').isMongoId(),
  check('apprentice','El id es obligatorio').notEmpty(),
  check('apprentice').custom(apprenticeHelper.existApprentice),
  check('modality','Este Id no es valido').isMongoId(),
  check('modality','El ID es obligatorio').notEmpty(),
  check('modality').custom(modalityHelper.existeModalityID),
  check('startDate', 'El campo startDate es obligatorio').notEmpty(),
  
  check('company', 'El campo company es obligatorio').notEmpty(),
  check('phoneCompany', 'El campo phoneCompany es obligatorio').notEmpty().isLength({max:10}),
  check('addressCompany', 'El campo adrrescompany es obligatorio').notEmpty(),
  check('owner', 'El campo owner es obligatorio').notEmpty(),
  check('assignment').optional(),
  
  check('assignment.followUpInstructor.idInstructor')
    .optional({ nullable: true })
    .custom(async (idInstructor, { req }) => {
      if (idInstructor) {
        await instructorHelper.existsInstructorsID(idInstructor, req.headers.token);
      }
    }),

  check('assignment.technicalInstructor.idInstructor')
    .optional({ nullable: true })
    .custom(async (idInstructor, { req }) => {
      if (idInstructor) {
        await instructorHelper.existsInstructorsID(idInstructor, req.headers.token);
      }
    }),

  check('assignment.projectInstructor.idInstructor')
    .optional({ nullable: true })
    .custom(async (idInstructor, { req }) => {
      if (idInstructor) {
        await instructorHelper.existsInstructorsID(idInstructor, req.headers.token);
      }
    }),

  validateFields
], controllerRegister.insertregister)


router.put('/updateregisterbyid/:id', [
  validate.validateJWT,

   check('id', 'El id no es válido').isMongoId(),
  check('id').custom(registerHelper.existResgister),
  check('apprentice').optional().custom(apprenticeHelper.existApprentice), 
  check('modality').optional().custom(modalityHelper.existeModalityID), 
  check('addressCompany').optional().custom(registerHelper.existAddressCompany), 
  check('phoneCompany').optional().custom(registerHelper.existPhoneCompany), 
  check('startDate').optional().notEmpty().withMessage('El campo startDate es obligatorio si se proporciona'), 
  check('endDate').optional().notEmpty().withMessage('El campo endDate es obligatorio si se proporciona'),
  check('company').optional().notEmpty().withMessage('El campo company es obligatorio si se proporciona'), 
  check('owner').optional().notEmpty().withMessage('El campo owner es obligatorio si se proporciona'),
  check('docAlternative').optional().notEmpty().withMessage('El campo docAlternative es obligatorio si se proporciona'),
  check('hour').optional().isNumeric().withMessage('El campo hour debe ser un número válido si se proporciona'), 
  check('businessProyectHour').optional().isNumeric().withMessage('El campo businessProyectHour debe ser un número válido si se proporciona'), 
  check('productiveProjectHour').optional().isNumeric().withMessage('El campo productiveProjectHour debe ser un número válido si se proporciona'), 
  check('mailCompany').optional().isEmail().withMessage('El campo mailCompany debe ser un email válido si se proporciona'), 
  
  validateFields,
], controllerRegister.updateRegisterById)


router.put('/updatemodalityregister/:id',[
  validate.validateJWT,

  check('id', 'El id no es valido').isMongoId(),
  check('id').custom(registerHelper.existResgister),
   check('modality', 'No es un ID válido').isMongoId().notEmpty(),
   check('modality').custom(modalityHelper.existeModalityID),
   check('docAlternative', 'El documento alternativo es obligatorio').notEmpty(),
 /*   check('docAlternative').custom(registerHelper.verifyDocAlternative), */

  validateFields
],controllerRegister.updatemodalityregister)


router.put('/enableregister/:id', [
  validate.validateJWT,
  check('id', 'El id no es valido').isMongoId(),
  check('id').custom(registerHelper.existResgister),
  validateFields
], controllerRegister.enableregister)



router.put('/disableregister/:id', [
  validate.validateJWT,
  check('id', 'El id no es valido').isMongoId(),
  check('id').custom(registerHelper.existResgister),
  validateFields
], controllerRegister.disableregiste)

//Asignaciones rutass

router.get('/listallassignment', [
 validate.validateJWT
],controllerRegister.listAllAssignments);

//------------------------------------------------------------------
router.get('/listassigmentbyfollowupinstructor/:idInstructor',[
 validate.validateJWT
], controllerRegister.listRegisterByFollowupInstructor);


//----------------------------------------------------------------------
router.get('/listassigmentbytechnicalinstructor/:idInstructor',[
 validate.validateJWT
], controllerRegister.listRegisterByTechnicalInstructor);

//------------------------------------------------------------------------
router.get('/listassigmentbyprojectinstructor/:idInstructor',[
 validate.validateJWT
], controllerRegister.listRegisterByProjectInstructor);

//------------------------------------------------------------------------
router.get('/listRegisterByInstructorInAssignment/:idInstructor',[
 validate.validateJWT
], controllerRegister.listRegisterByInstructorInAssignment);

//------------------------------------------------------------------------
router.get('/listRegisterByAssignmentId/:id',[
 validate.validateJWT
], controllerRegister.listRegisterByAssignmentId);


router.put('/addassignment/:id', [
  validate.validateJWT,  
  check('id', 'El id no es válido').isMongoId(),
  check('id').custom(registerHelper.existResgister),
  check('assignment', 'El campo assignment es obligatorio').isArray().notEmpty(),
  check('assignment.*.followUpInstructor', 'El campo followUpInstructor es obligatorio').isArray().notEmpty(),
  check('assignment.*.followUpInstructor.*.idInstructor', 'ID de instructor de seguimiento es obligatorio').notEmpty().custom(async (idInstructor, { req }) => {
    await instructorHelper.existsInstructorsID(idInstructor, req.headers.token);
  }),
  check('assignment.*.technicalInstructor').optional().isArray(),
  check('assignment.*.technicalInstructor.*.idInstructor').optional()
  .custom(async (idInstructor, { req }) => {
    await instructorHelper.existsInstructorsID(idInstructor, req.headers.token);
  }),
  check('assignment.*.projectInstructor').optional().isArray(),
  check('assignment.*.projectInstructor.*.idInstructor').optional()
  .custom(async (idInstructor, { req }) => {
    await instructorHelper.existsInstructorsID(idInstructor, req.headers.token);
  }),
  validateFields  
],controllerRegister.addAssignment);


router.put('/updateassignment/:id', [
  validate.validateJWT,
  check('id', 'El id no es válido').isMongoId(),
  check('id').custom(registerHelper.existResgister),
  check('assignment', 'El campo assignment es obligatorio').notEmpty(),
  check('assignment.followUpInstructor.idInstructor').optional()
    .custom(async (idInstructor, { req }) => {
      if (idInstructor) {
        await instructorHelper.existsInstructorsID(idInstructor, req.headers.token);
      }
    }),
  check('assignment.technicalInstructor.idInstructor').optional()
    .custom(async (idInstructor, { req }) => {
      if (idInstructor) {
        await instructorHelper.existsInstructorsID(idInstructor, req.headers.token);
      }
    }),
  check('assignment.projectInstructor.idInstructor').optional()
    .custom(async (idInstructor, { req }) => {
      if (idInstructor) {
        await instructorHelper.existsInstructorsID(idInstructor, req.headers.token);
      }
    }),
  validateFields
], controllerRegister.updateAssignment);









export default router;


