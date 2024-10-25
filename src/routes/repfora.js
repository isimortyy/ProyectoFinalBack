import express from 'express';
import { check } from 'express-validator';
import {validate} from '../middleware/validateJWT.js'
import ControllerRepfora from '../controllers/repfora.js';  


const router = express.Router();

router.post('/Login', [ 
],ControllerRepfora.login)


router.post('/loginInstructor',[
],ControllerRepfora.loginInstructor)


router.get('/listInstructors' , [ 
validate.validateJWT
], ControllerRepfora.listallinstructors)


router.get('/listInstructorsId/:id',[
validate.validateJWT
 ],  ControllerRepfora.listinstructorbyid)


router.get('/listFiche',[ 
validate.validateJWT
], ControllerRepfora.listafiches)


router.get('/listFicheId/:id',[ 
validate.validateJWT
], ControllerRepfora.listfichesbyid)

export default router