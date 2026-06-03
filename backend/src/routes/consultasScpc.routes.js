const express = require('express');
const { autenticacaoJwt } = require('../middlewares/autenticacaoJwt');
const { autorizarRoles } = require('../middlewares/autorizacaoRbac');
const consultasScpcController = require('../controllers/consultasScpcController');

const router = express.Router();

const escrita = autorizarRoles('admin', 'atendimento', 'gestor');
const leitura = autorizarRoles('admin', 'financeiro', 'atendimento', 'gestor');

router.use(autenticacaoJwt);

router.get('/consolidado', leitura, consultasScpcController.consolidado);
router.post('/', escrita, consultasScpcController.registrar);

module.exports = router;
