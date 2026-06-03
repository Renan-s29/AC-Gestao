const express = require('express');
const { autenticacaoJwt } = require('../middlewares/autenticacaoJwt');
const { autorizarRoles } = require('../middlewares/autorizacaoRbac');
const dashboardController = require('../controllers/dashboardController');

const router = express.Router();

const leitura = autorizarRoles('admin', 'financeiro', 'atendimento', 'gestor');

router.use(autenticacaoJwt);

router.get('/resumo', leitura, dashboardController.resumo);
router.get('/autocomplete', leitura, dashboardController.autocomplete);

module.exports = router;
