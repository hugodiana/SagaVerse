import { Router } from 'express';
import { createSaga, getAllSagas, getSagaDetails, addMovieToSaga, deleteSaga } from '../controllers/saga.controller';
import { protect, admin } from '../middleware/auth.middleware'; // Importe os middlewares

const router = Router();

// Rotas públicas (qualquer um pode ver)
router.get('/', getAllSagas);
router.get('/:sagaId', getSagaDetails);

// Rotas protegidas (apenas admins podem criar/adicionar)
router.post('/', protect, admin, createSaga);
router.post('/:sagaId/movies', protect, admin, addMovieToSaga);
router.delete('/:id', protect, admin, deleteSaga);

export default router;