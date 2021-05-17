const { Router } = require('express');
const { fieldsValidator } = require('../middlewares/fields-validator');
const { jwtValidator } = require('../middlewares/jwt-validator');

const router = Router();
const { check } = require('express-validator');
const { getEvents, createEvent, updateEvent, deleteEvent } = require('../controllers/eventsController')
const { isDate } = require('../helpers/isDate');

// Todos los endpoint deben pasar por la validación de jwt
router.use( jwtValidator );

router.get(
    '/',
    getEvents
);

router.post(
    '/',
    [
        check('title', 'Title is required').not().isEmpty(),
        check('start', 'Start date is required').custom( isDate ),
        check('end', 'End date is required').custom( isDate ),
        fieldsValidator
    ],
    createEvent
);

router.put(
    '/:id',
    [
        check('title', 'Title is required').not().isEmpty(),
        check('start', 'Start date is required').custom( isDate ),
        check('end', 'End date is required').custom( isDate ),
        fieldsValidator
    ],
    updateEvent
);

router.delete(
    '/:id',
    deleteEvent
);



module.exports = router;