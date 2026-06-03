const express = require('express');
const authRoutes = require('./auth.routes');
const associadosRoutes = require('./associados.routes');
const dependentesRoutes = require('./dependentes.routes');
const planosRoutes = require('./planos.routes');
const faturamentosRoutes = require('./faturamentos.routes');
const consultasScpcRoutes = require('./consultasScpc.routes');
const relatoriosRoutes = require('./relatorios.routes');
const dashboardRoutes = require('./dashboard.routes');

const router = express.Router();

router.get('/health', (req, res) => res.json({ ok: true, servico: 'AC-Gestão API' }));

router.use('/auth', authRoutes);
router.use('/associados', associadosRoutes);
router.use('/associados/:associadoId/dependentes', dependentesRoutes);
router.use('/planos-saude', planosRoutes);
router.use('/faturamentos', faturamentosRoutes);
router.use('/consultas-scpc', consultasScpcRoutes);
router.use('/relatorios', relatoriosRoutes);
router.use('/dashboard', dashboardRoutes);

module.exports = router;
