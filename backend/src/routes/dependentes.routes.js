const express = require('express');
const { autenticacaoJwt } = require('../middlewares/autenticacaoJwt');
const { autorizarRoles } = require('../middlewares/autorizacaoRbac');
const dependentesController = require('../controllers/dependentesController');

const router = express.Router({ mergeParams: true });

const escrita = autorizarRoles('admin', 'atendimento', 'gestor');
const leitura = autorizarRoles('admin', 'financeiro', 'atendimento', 'gestor');

router.use(autenticacaoJwt);

router.get('/', leitura, dependentesController.listar);
router.post('/', escrita, dependentesController.criar);
router.put('/:dependenteId', escrita, dependentesController.atualizar);
router.patch('/:dependenteId/status', escrita, dependentesController.alterarStatus);

module.exports = router;
