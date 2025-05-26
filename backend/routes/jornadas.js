const express = require('express');
const router = express.Router();
const { getJornadas, crearJornada, eliminarJornada, actualizarJornada } = require('../controllers/jornadasController');

router.get('/', getJornadas);
router.post('/', crearJornada);
router.delete('/:id', eliminarJornada);
router.put('/:id', actualizarJornada);

module.exports = router;
