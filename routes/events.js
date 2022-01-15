const { Router } = require("express");
const { check } = require("express-validator");
const { getEvents, createEvents, updateEvents, delEvents } = require("../controllers/events");
const isDate = require("../helpers/isDate");
const { validarCampos } = require("../middlewares/validar-campos");
const { validarJWT } = require("../middlewares/validar-jwt");

const router = Router();

// Validar todas las peticiones
router.use(validarJWT);

router.get('/', getEvents);

router.post('/',
[
    check('title','El campo title es obligatorio').not().isEmpty(),
    check('start','La fecha de inicio es obligatoria').custom( isDate ),
    check('end','La fecha de finalización es obligatoria').not().custom( isDate ),
    validarCampos
],
createEvents);

router.put('/:id', updateEvents);

router.delete('/:id', delEvents);

module.exports = router;


