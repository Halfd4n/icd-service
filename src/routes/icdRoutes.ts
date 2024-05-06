import express from 'express';
import {
  getIcdFoundationInfo,
  getIcdBySearchText,
  getEnrichedIcdData,
  getEntityByDiagnosis,
} from '../controllers/icdController';

const router = express.Router();

router.get('/entity/:id', getIcdFoundationInfo);
router.get('/search/:searchQuery', getIcdBySearchText);
router.get('/enriched/:icdCodes', getEnrichedIcdData);
router.get('/diagnosis', getEntityByDiagnosis);

export default router;
