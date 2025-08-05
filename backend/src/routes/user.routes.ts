import { Router } from 'express';
import { getUserReviews } from '../controllers/user.controller';
import { protect } from '../middleware/auth.middleware';

const router = Router();

// Rota para pegar as avaliações do usuário logado
router.get('/me/reviews', protect, getUserReviews);

export default router;