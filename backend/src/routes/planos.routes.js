const express = require('express');
const { autenticacaoJwt } = require('../middlewares/autenticacaoJwt');
const { autorizarRoles } = require('../middlewares/autorizacaoRbac');
const planosController = require('../controllers/planosController');

const router = express.Router();

const leitura = autorizarRoles('admin', 'financeiro', 'atendimento', 'gestor');
const escrita = autorizarRoles('admin', 'financeiro', 'gestor');

router.use(autenticacaoJwt);

router.get('/', leitura, planosController.listar);
router.post('/', escrita, planosController.criar);
router.put('/:id', escrita, planosController.atualizar);

module.exports = router;
