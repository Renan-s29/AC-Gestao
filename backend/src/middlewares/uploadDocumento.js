const path = require('path');
const fs = require('fs');
const multer = require('multer');

const uploadDir = path.join(__dirname, '..', '..', 'uploads', 'associados');

function garantirDiretorio(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function criarUploadAssociado() {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const associadoId = req.params.id || req.params.associadoId;
      const dir = path.join(uploadDir, String(associadoId));
      garantirDiretorio(dir);
      cb(null, dir);
    },
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname) || '.pdf';
      const nome = `${Date.now()}_${Math.random().toString(16).slice(2)}${ext}`;
      cb(null, nome);
    },
  });

  function fileFilter(req, file, cb) {
    if (file.mimetype !== 'application/pdf') {
      return cb(new Error('Apenas arquivos PDF são aceitos neste protótipo.'));
    }
    cb(null, true);
  }

  return multer({ storage, fileFilter, limits: { fileSize: 8 * 1024 * 1024 } });
}

module.exports = { criarUploadAssociado, uploadDir };
