import { Router } from 'express';
import { deleteMovie } from '../controllers/movie.controller';
import { protect, admin } from '../middleware/auth.middleware';

const router = Router();

router.delete('/:id', protect, admin, deleteMovie);

export default router;