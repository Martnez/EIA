const express = require ('express');

const {check,body} = require('express-validator/check')

const controllers = require('../controllers/home');
const controller = require('../controllers/logs');

const router = express.Router();
const isAuth = require('../middleware/is-auth');

router.get('/',controllers.getIndex);

router.get('/index',controllers.getIndex);

router.post('/login',controllers.postLogin);

router.get('/logout',controllers.postLogout);

router.get('/home',controllers.getHome);

router.get('/dashboard',isAuth,controllers.getDashboard);

router.get("/underwriting",isAuth,controllers.getUnderwriting);

router.get('/new-policy',isAuth,controllers.getNewpolicy);

router.post('/create', check('email')
.isEmail()
.withMessage('please enter a valid email'),
controllers.postCreate);

router.get('/admin',isAuth,controllers.getAdmin);

router.get('/new-user',isAuth,controllers.getNewUser);

router.get('/reset',controllers.getReset);

router.post('/reset',controllers.postReset);

router.get('/reset/:token',controllers.getNewpassword);

router.post('/newPassword',body('password')
.isLength({min: 6, max: 8}).
isAlphanumeric().withMessage('Please ensure that your password is 6-8 character long and contain alphanumeric')
,controllers.postNewPassword);

router.get('/user-profile-view/:userId',isAuth,controllers.getUserProfile);

router.post('/user-profile-view',controllers.postEditUser);

router.post('/delete-user',controllers.postDeleteUser);

router.post('/reset-flag',controllers.postResetFlag);

router.get('/manage-users',isAuth,controllers.getManageUsers);

router.get('/logs',isAuth,controllers.getLogs);

router.post('/logs',controller.PostLogs);

module.exports= router;