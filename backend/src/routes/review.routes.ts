import { Router } from 'express';
// A CORREÇÃO ESTÁ AQUI: Adicionamos 'updateReview' e 'deleteReview' na lista
import { createReview, updateReview, deleteReview } from '../controllers/review.controller';
import { protect } from '../middleware/auth.middleware';

const router = Router();

router.post('/', protect, createReview);

// Rotas para editar e apagar uma avaliação
router.put('/:id', protect, updateReview);
router.delete('/:id', protect, deleteReview);

export default router;