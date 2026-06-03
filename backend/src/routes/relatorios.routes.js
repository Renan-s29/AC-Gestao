const express = require('express');
const { autenticacaoJwt } = require('../middlewares/autenticacaoJwt');
const { autorizarRoles } = require('../middlewares/autorizacaoRbac');
const relatoriosController = require('../controllers/relatoriosController');

const router = express.Router();

const leitura = autorizarRoles('admin', 'financeiro', 'gestor');

router.use(autenticacaoJwt);

router.get('/excel', leitura, relatoriosController.excel);
router.get('/pdf', leitura, relatoriosController.pdf);

module.exports = router;
