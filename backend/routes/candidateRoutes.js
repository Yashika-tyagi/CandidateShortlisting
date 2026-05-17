const express = require('express');
const router = express.Router();
const candidateController = require('../controllers/candidateController');

// Standard candidate operations
router.post('/', candidateController.addCandidate);
router.get('/', candidateController.getAllCandidates);

// Matching operations
router.post('/match', candidateController.basicMatch);
router.post('/ai/shortlist', candidateController.aiShortlist);

module.exports = router;
