import express from 'express';
import { check } from 'express-validator';
import { validateJWT } from '../middleware/validateJWT.js';
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
  validateJWT
], controllerRegister.listtheregister)


router.get('/listregisterbyid/:id', [
  validateJWT,
  check('id', 'El id no es valido').isMongoId(),
  check('id').custom(registerHelper.existResgister),
 validateFields
], controllerRegister.listtheregisterbyid)


router.get('/lisregisterbyapprentice/:apprentice', [
  validateJWT,
  check('apprentice').custom(apprenticeHelper.existApprentice),
  validateFields
], controllerRegister.listtheapprenticebyid)


router.get ('/listregistersbyfiche/:idfiche',[ 
  validateJWT,
  check ('idfiche','EL campo es obligatorio').notEmpty(),
  check('fiche.idfiche').custom(ficheHelper.existeFicheID),
  validateFields
],controllerRegister.listregistersbyfiche )

router.get('/listregisterbymodality/:madality', [
  validateJWT,
  check('modality').custom(modalityHelper.existsModalityID),
  check('modality', 'El campo modality es obigatorio').notEmpty(),
  validateFields
], controllerRegister.listthemodalitybyid)



router.get('/listregisterbystartdate', [
  validateJWT,
  check('startDate', 'El campo StartDate es obigatorio').notEmpty(),
  validateFields
], controllerRegister.listregisterstardatebyid)


router.get('/listregisterbyenddate', [
  validateJWT,
  check('endDate', 'El campo endDate es obigatorio').notEmpty(),
  validateFields
], controllerRegister.listregisterenddatebyid)


router.post('/addregister',[
  validateJWT,
  check('apprentice','Este Id no es valido').isMongoId(),
  check('apprentice','El id es obligatorio').notEmpty(),
  check('apprentice').custom(apprenticeHelper.existApprentice),
  check('modality','Este Id no es valido').isMongoId(),
  check('modality','El ID es obligatorio').notEmpty(),
  check('modality').custom(modalityHelper.existsModalityID),
  check('startDate', 'El campo startDate es obligatorio').notEmpty(),
  
  check('company', 'El campo company es obligatorio').notEmpty(),
  check('phoneCompany', 'El campo phoneCompany es obligatorio').notEmpty().isLength({max:10}),
  check('addresscompany', 'El campo adrrescompany es obligatorio').notEmpty(),
  check('owner', 'El campo owner es obligatorio').notEmpty(),
  check('hour', 'El campo hour es obligatorio').notEmpty(),
  check("businessProyectHour", "Las horas de instruntor de proyecto empresarial son obligatorias").notEmpty().isNumeric(),
  check("productiveProjectHour", "Las horas de instructor de proyecto productivo son obligatorias").notEmpty().isNumeric(),
  check('emailCompany', 'El campo es obligatorio').notEmpty().isEmail(),
  validateFields
], controllerRegister.insertregister)


router.put('/updatemodalitybyid/:id', [
  validateJWT,
  check('apprentice','Este Id no es valido').isMongoId(),
  check('apprentice','El id es obligatorio').notEmpty(),
  check('apprentice').custom(apprenticeHelper.existApprentice),
  check('modality','Este Id no es valido').isMongoId(),
  check('modality','El ID es obligatorio').notEmpty(),
   check('modality').custom(modalityHelper.existsModalityID),
  check('startDate', 'El campo startDate es obligatorio').notEmpty(),
  
  check('company', 'El campo company es obligatorio').notEmpty(),
  check('phoneCompany', 'El campo phoneCompany es obligatorio').notEmpty().isLength({max:10}),
  check('addresscompany', 'El campo adrrescompany es obligatorio').notEmpty(),
  check('owner', 'El campo owner es obligatorio').notEmpty(),
  check('docalternative', 'El campo docalternative').notEmpty(),
  check('hour', 'El campo hour es obligatorio').notEmpty(),
  check('adreessCompany').custom(registerHelper.existAddressCompany),
  check('phoneCompany').custom(registerHelper.existPhoneCompany),
  validateFields,
], controllerRegister.updateRegisterById)


router.put('/enableregister/:id', [
  validateJWT,
  check('id', 'El id no es valido').isMongoId(),
  check('id').custom(registerHelper.existResgister),
  validateFields
], controllerRegister.enableregister)

router.put('/disableregister/:id', [
  validateJWT,
  check('id', 'El id no es valido').isMongoId(),
  check('id').custom(registerHelper.existResgister),
  validateFields
], controllerRegister.disableregiste)

export default router;


