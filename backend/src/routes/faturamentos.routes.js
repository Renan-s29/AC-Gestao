const express = require('express');
const { autenticacaoJwt } = require('../middlewares/autenticacaoJwt');
const { autorizarRoles } = require('../middlewares/autorizacaoRbac');
const faturamentosController = require('../controllers/faturamentosController');

const router = express.Router();

const leitura = autorizarRoles('admin', 'financeiro', 'gestor');
const escrita = autorizarRoles('admin', 'financeiro', 'gestor');

router.use(autenticacaoJwt);

router.get('/inadimplencia', leitura, faturamentosController.inadimplencia);
router.post('/gerar-mensal', escrita, faturamentosController.gerarMensal);
router.get('/', leitura, faturamentosController.listar);
router.post('/:id/calcular-juros-multa', escrita, faturamentosController.calcularJurosMulta);
router.patch('/:id/marcar-pagamento', escrita, faturamentosController.marcarPagamento);

module.exports = router;
