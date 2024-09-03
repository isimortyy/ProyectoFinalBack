import express from 'express';
import { check } from 'express-validator';
import { validateJWT } from '../middleware/validateJWT.js';
import { validateFields } from '../middleware/validate-fields.js';
import { Router } from 'express';
import  controllerRegister  from '../controllers/register.js';
import { registerHelper, } from '../helpers/register.js';
import { modalityHelper } from '../helpers/modality.js'
import { apprenticeHelper } from '../helpers/apprentice.js'

const router = Router()


router.get('/listregister', [
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


router.post('/addregister', [
  validateJWT,
  check('apprentice').custom(apprenticeHelper.existApprentice),
  check('modality').custom(modalityHelper.existsModalityID),
  check('startDate', 'El campo startDate es obligatorio').notEmpty(),
  check('endDate', 'El campo endDate es obligatorio').notEmpty(),
  check('company', 'El campo company es obligatorio').notEmpty(),
  check('phoneCompany', 'El campo phoneCompany es obligatorio').notEmpty(),
  check('addresscompany', 'El campo adrrescompany es obligatorio').notEmpty(),
  check('owner', 'El campo owner es obligatorio').notEmpty(),
  check('docalternative', 'El campo docalternative').notEmpty(),
  check('hour', 'El campo hour es obligatorio').notEmpty(),
  check('adreessCompany').custom(registerHelper.existAddressCompany),
  check('phoneCompany').custom(registerHelper.existPhoneCompany),
  validateFields
], controllerRegister.insertregister)


router.put('/updatemodalitybyid/:id', [
  validateJWT,
  check('apprentice').custom(apprenticeHelper.existApprentice),
  check('modality').custom(modalityHelper.existsModalityID),
  check('adresscompany').custom(registerHelper.existAddressCompany),
  check('phoneCompany').custom(registerHelper.existPhoneCompany),
  validateFields,
], controllerRegister.updateregisterbyid)


router.put('/enableAndDisablebinnacles/:id', [
  validateJWT,
  check('id', 'El id no es valido').isMongoId(),
  check('id').custom(registerHelper.existResgister),
  validateFields
], controllerRegister.activateAndDesactiveregister)

export default router;


