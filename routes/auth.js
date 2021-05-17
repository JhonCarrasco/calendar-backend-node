const { Router } = require('express');
const { fieldsValidator } = require('../middlewares/fields-validator');
const { jwtValidator } = require('../middlewares/jwt-validator');

const router = Router();
const { check } = require('express-validator');
const { createUser, login, refreshToken } = require('../controllers/authController');


router.post(
'/new'
, [ 
    check('name', 'Name is required').not().isEmpty(),
    check('name', 'The name must be at least 5 characters').isLength({ min: 5 }),
    check('email', 'Email is required').isEmail(),
    check('password', 'The password must be 6 characters').isLength({ min: 6 }),
    fieldsValidator
]
, createUser );

router.post(
'/'
, [ 
    check('email', 'Email is required').isEmail(),
    check('password', 'The password must be 6 characters').isLength({ min: 6 }),
    fieldsValidator
]
, login);

router.get(
    '/refresh',
    jwtValidator,
     refreshToken);



module.exports = router;