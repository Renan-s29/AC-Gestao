const documentosRepository = require('../repositories/documentosRepository');
const path = require('path');
const fs = require('fs');

const uploadsRoot = path.join(__dirname, '..', '..', 'uploads');

async function listar(associadoId) {
  return documentosRepository.listarPorAssociado(associadoId);
}

async function registrarUpload(associadoId, file) {
  const caminho_relativo = path.posix.join('associados', String(associadoId), file.filename);
  const id = await documentosRepository.inserir({
    associado_id: associadoId,
    nome_original: file.originalname,
    nome_armazenado: file.filename,
    caminho_relativo,
  });
  return documentosRepository.buscarPorId(id);
}

function resolverCaminhoAbsoluto(doc) {
  return path.join(uploadsRoot, doc.caminho_relativo.replace(/\//g, path.sep));
}

async function buscarParaDownload(associadoId, docId) {
  const doc = await documentosRepository.buscarPorId(docId);
  if (!doc || doc.associado_id !== Number(associadoId)) return null;
  const abs = resolverCaminhoAbsoluto(doc);
  if (!fs.existsSync(abs)) return null;
  return { doc, abs };
}

module.exports = { listar, registrarUpload, buscarParaDownload };
