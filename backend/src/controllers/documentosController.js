const documentosService = require('../services/documentosService');

async function listar(req, res, next) {
  try {
    const dados = await documentosService.listar(req.params.id);
    return res.json({ sucesso: true, dados });
  } catch (err) {
    return next(err);
  }
}

async function upload(req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).json({ sucesso: false, mensagem: 'Envie um arquivo PDF no campo "arquivo".' });
    }
    const dados = await documentosService.registrarUpload(req.params.id, req.file);
    return res.status(201).json({ sucesso: true, dados });
  } catch (err) {
    return next(err);
  }
}

async function download(req, res, next) {
  try {
    const resultado = await documentosService.buscarParaDownload(req.params.id, req.params.docId);
    if (!resultado) {
      return res.status(404).json({ sucesso: false, mensagem: 'Documento não encontrado.' });
    }
    return res.download(resultado.abs, resultado.doc.nome_original);
  } catch (err) {
    return next(err);
  }
}

module.exports = { listar, upload, download };
