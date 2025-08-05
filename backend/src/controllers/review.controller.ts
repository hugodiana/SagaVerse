import { Response } from 'express';
import { Review } from '../models/review.model';
import { Movie } from '../models/movie.model';
import { AuthRequest } from '../middleware/auth.middleware'; // Importe a interface

export const createReview = async (req: AuthRequest, res: Response) => {
    try {
        const { movieId, rating, comment } = req.body;
        const userId = req.user?._id; // Pega o ID do usuário logado!

        if (!userId) {
            return res.status(400).json({ message: 'Usuário não encontrado.' });
        }

        const review = new Review({
            movie: movieId,
            user: userId, // Salva a referência do usuário
            rating,
            comment
        });
        await review.save();

        await Movie.findByIdAndUpdate(movieId, { $push: { reviews: review._id } });

        res.status(201).json(review);
    } catch (error) {
        res.status(400).json({ message: 'Erro ao criar avaliação', error });
    }
};