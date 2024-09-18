import express from 'express';
import { check } from 'express-validator';
import { validateJWT } from '../middleware/validateJWT.js';
import { validateFields } from '../middleware/validate-fields.js';
import  userController  from '../controllers/userEP.js';
import { userHelper } from '../helpers/userEP.js';

const router = express.Router();


router.post('/', [
    validateJWT,
    check('name', 'Name is required').not().isEmpty(),
    check('name', 'Name cannot be longer than 60 characters').isLength({ max: 60 }),
    check('email', 'Email is required').not().isEmpty(),
    check('email', 'Invalid email').isEmail(),
    check('email').custom(userHelper.emailExists),
    check('password', 'Password must be at least 8 characters long').isLength({ min: 8 }),
    validateFields
], userController.createUser);


router.post('/login', [
    check('email', 'Email is required').not().isEmpty(),
    check('email', 'Invalid email').isEmail(),
    check('password', 'Password must be at least 8 characters long').isLength({ min: 8 }),
    validateFields
], userController.login);

router.get('/list', userController.listUsers);


router.put('/edit/:id', [
    validateJWT,
    check('id', 'Invalid ID').isMongoId(),
    check('email', 'Email is required').not().isEmpty(),
    check('email', 'Invalid email').isEmail(),
    validateFields
], userController.editUser);


router.put('/changePassword/:id', [
    validateJWT,
    check('id', 'Invalid ID').isMongoId(),
    check('password', 'Password must be at least 8 characters long').isLength({ min: 8 }),
    validateFields
], userController.changePassword);


router.put('/enableuserStatus/:id', [
    validateJWT,
    check('id', 'Invalid ID').isMongoId(),
    validateFields
], userController.enableuserStatus);


router.put('/disableuserStatus/:id', [
    validateJWT,
    check('id', 'Invalid ID').isMongoId(),
    validateFields
], userController.disableuserStatus);


router.delete('/delete/:id', [
    validateJWT,
    check('id', 'Invalid ID').isMongoId(),
    validateFields
], userController.deleteUser);

export default router;
