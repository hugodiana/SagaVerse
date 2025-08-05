import { Response } from 'express';
import { Review } from '../models/review.model';
import { AuthRequest } from '../middleware/auth.middleware';

export const getUserReviews = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?._id;
    const reviews = await Review.find({ user: userId })
      .sort({ createdAt: -1 })
      .populate({
        path: 'movie',
        select: 'title',
        populate: {
          path: 'saga',
          model: 'Saga',
          select: 'title'
        }
      });

    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar avaliações do usuário', error });
  }
};