import { Router } from 'express';
import { createReview } from '../controllers/review.controller';
import { protect } from '../middleware/auth.middleware'; // Importe o middleware

const router = Router();

// A rota agora é protegida. Só passa se o token for válido.
router.post('/', protect, createReview);

export default router;