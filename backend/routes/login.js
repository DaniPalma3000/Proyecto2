
const express = require('express');
const router = express.Router();
const { verificarCredenciales } = require('../controllers/loginController');

router.post('/login', verificarCredenciales);

module.exports = router;
