const express = require ('express');

const controllers = require('../controllers/client')

const router = express.Router();
const isAuth = require('../middleware/is-auth');

router.get('/new-client',isAuth,controllers.getNewClient);

router.get('/client-profile/:clientId',isAuth,controllers.getClientProfile);

router.post('/new-client',controllers.postClient);

// router.get('/uploads/:clientId',controllers.getKraCert);

router.get('/motor-details/:clientId',isAuth,controllers.getMotor);

router.get('/non-motor-details/:clientId',controllers.getNonMotor);

router.post('/motor-details/:clientId',controllers.postMotor);

router.post('/non-motor-details/:clientId',controllers.postNonMotor);

router.get('/mv-details/:policyId',isAuth,controllers.getMvDetails);

router.get('/claims',isAuth,controllers.getClaims);

router.get('/new-claim/:policyId',isAuth,controllers.getNewClaims);

router.get('/singleClaim/:claimId',isAuth,controllers.getClaimEdit);

router.post('/singleClaim/:claimId',isAuth,controllers.postClaimEdit);

router.post('/motorEdit/:policyId',isAuth,controllers.postMotorEdit);

router.post('/nonMotorEdit/:policyId',isAuth,controllers.postNonMotorEdit);

router.get('/policyEdit/:policyId',isAuth,controllers.getPolicyEdit);
router.get('/policyView/:policyId',isAuth,controllers.getPolicyView);

router.post('/new-claim/:policyId',controllers.postClaim);

router.get('/policy-selection',isAuth,controllers.getPolicySelection);



module.exports= router;