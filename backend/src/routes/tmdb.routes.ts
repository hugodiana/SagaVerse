import { Router } from 'express';
import { searchCollections, getCollectionDetails } from '../controllers/tmdb.controller';
import { protect, admin } from '../middleware/auth.middleware';

const router = Router();

// Apenas admins logados podem buscar sagas para adicionar
router.get('/sagas', protect, admin, searchCollections);
router.get('/saga/:id/movies', protect, admin, getCollectionDetails);

export default router;