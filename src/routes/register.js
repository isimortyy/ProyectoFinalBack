import express from 'express';
import { check } from 'express-validator';
import { validate } from '../middleware/validateJWT.js';
import { validateFields } from '../middleware/validate-fields.js';
import { Router } from 'express';
import  controllerRegister  from '../controllers/register.js';
import { registerHelper, } from '../helpers/register.js';
import { modalityHelper } from '../helpers/modality.js'
import { apprenticeHelper } from '../helpers/apprentice.js'
import apprentice from '../models/apprentice.js';
import ficheHelper from '../helpers/repfora.js';



const router = Router()


router.get('/listallregister', [
  validate.validateJWT,
], controllerRegister.listtheregister)


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
  check('idmodality').custom(modalityHelper.existeModalityID),
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
  check('phonecompany', 'El campo phoneCompany es obligatorio').notEmpty().isLength({max:10}),
  check('addresscompany', 'El campo adrrescompany es obligatorio').notEmpty(),
  check('owner', 'El campo owner es obligatorio').notEmpty(),
  check('hour', 'El campo hour es obligatorio').notEmpty(),
  check("businessProjectHour", "Las horas de instruntor de proyecto empresarial son obligatorias").notEmpty().isNumeric(),
  check("productiveProjectHour", "Las horas de instructor de proyecto productivo son obligatorias").notEmpty().isNumeric(),
  check('emailCompany', 'El campo es obligatorio').notEmpty().isEmail(),
  validateFields
], controllerRegister.insertregister)


router.put('/updateregisterbyid/:id', [
  validate.validateJWT,
  check('apprentice','Este Id no es valido').optional().isMongoId(),
  check('apprentice','El id es obligatorio').optional().notEmpty(),
  check('apprentice').optional().custom(apprenticeHelper.existApprentice),
  check('modality','Este Id no es valido').optional().isMongoId(),
  check('modality','El ID es obligatorio').optional().notEmpty(),
  check('modality').optional().custom(modalityHelper.existeModalityID),
  check('startDate', 'El campo startDate es obligatorio').optional().notEmpty(),
  
  check('company', 'El campo company es obligatorio').optional().notEmpty(),
  check('phonecompany', 'El campo phoneCompany es obligatorio').optional().notEmpty().isLength({max:10}),
  check('addresscompany', 'El campo adrrescompany es obligatorio').optional().notEmpty(),
  check('owner', 'El campo owner es obligatorio').optional().notEmpty(),
  check('hour', 'El campo hour es obligatorio').optional().notEmpty(),
  check("businessProjectHour", "Las horas de instruntor de proyecto empresarial son obligatorias").optional().notEmpty().isNumeric(),
  check("productiveProjectHour", "Las horas de instructor de proyecto productivo son obligatorias").optional().notEmpty().isNumeric(),
  check('emailCompany', 'El campo es obligatorio').optional().notEmpty().isEmail(),
  validateFields,
], controllerRegister.updateRegisterById)


router.put('/updatemodalityregister/:id',[
  validate.validateJWT,
  check('modality','Este Id no es valido').optional().isMongoId(),
  check('modality','El ID es obligatorio').optional().notEmpty(),
  check('modality').optional().custom(modalityHelper.existeModalityID),
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

export default router;


