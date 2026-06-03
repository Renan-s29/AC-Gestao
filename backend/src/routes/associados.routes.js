const express = require('express');
const { autenticacaoJwt } = require('../middlewares/autenticacaoJwt');
const { autorizarRoles } = require('../middlewares/autorizacaoRbac');
const associadosController = require('../controllers/associadosController');
const beneficiosController = require('../controllers/beneficiosController');
const documentosController = require('../controllers/documentosController');
const consultasScpcController = require('../controllers/consultasScpcController');
const { criarUploadAssociado } = require('../middlewares/uploadDocumento');

const router = express.Router();
const upload = criarUploadAssociado();

const leitura = autorizarRoles('admin', 'financeiro', 'atendimento', 'gestor');
const escritaAssociado = autorizarRoles('admin', 'atendimento', 'gestor');
const gestao = autorizarRoles('admin', 'gestor');

router.use(autenticacaoJwt);

router.get('/busca', leitura, associadosController.busca);
router.get('/', leitura, associadosController.listar);
router.post('/', escritaAssociado, associadosController.criar);

router.get('/:id/beneficios/status', leitura, beneficiosController.status);
router.get('/:id/documentos', leitura, documentosController.listar);
router.post(
  '/:id/documentos',
  escritaAssociado,
  (req, res, next) => {
    upload.single('arquivo')(req, res, (err) => {
      if (err) return next(err);
      return next();
    });
  },
  documentosController.upload
);
router.get('/:id/documentos/:docId/download', leitura, documentosController.download);
router.get('/:id/consultas-scpc', leitura, consultasScpcController.listarPorAssociado);

router.get('/:id', leitura, associadosController.buscarPorId);
router.put('/:id', escritaAssociado, associadosController.atualizar);
router.patch('/:id/inativar', gestao, associadosController.inativar);

module.exports = router;
