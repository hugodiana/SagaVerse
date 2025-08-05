import { Response } from 'express';
import { Review } from '../models/review.model';
import { Movie } from '../models/movie.model';
import { AuthRequest } from '../middleware/auth.middleware';

export const createReview = async (req: AuthRequest, res: Response) => {
    try {
        const { movieId, rating, comment } = req.body;
        const userId = req.user?._id;

        const reviewData = { movie: movieId, user: userId, rating, comment };

        const newReview = await Review.create(reviewData);

        await Movie.findByIdAndUpdate(movieId, { $push: { reviews: newReview._id } });

        res.status(201).json(newReview);
    } catch (error: any) {
        // Se o erro for de duplicidade (código 11000), enviamos uma mensagem amigável
        if (error.code === 11000) {
            return res.status(409).json({ message: 'Você já avaliou este filme.' });
        }
        res.status(400).json({ message: 'Erro ao criar avaliação', error });
    }
};

export const updateReview = async (req: AuthRequest, res: Response) => {
    try {
        const { rating, comment } = req.body;
        const reviewId = req.params.id;
        const userId = req.user?._id;

        const review = await Review.findById(reviewId);

        if (!review) {
            return res.status(404).json({ message: 'Avaliação não encontrada.' });
        }

        // Checagem de segurança: o usuário logado é o dono da avaliação?
        if (review.user.toString() !== userId?.toString()) {
            return res.status(403).json({ message: 'Você não tem permissão para editar esta avaliação.' });
        }

        review.rating = rating;
        review.comment = comment;
        await review.save();

        res.status(200).json(review);
    } catch (error) {
        res.status(400).json({ message: 'Erro ao atualizar avaliação', error });
    }
};

export const deleteReview = async (req: AuthRequest, res: Response) => {
    try {
        const reviewId = req.params.id;
        const userId = req.user?._id;

        const review = await Review.findById(reviewId);

        if (!review) {
            return res.status(404).json({ message: 'Avaliação não encontrada.' });
        }

        if (review.user.toString() !== userId?.toString()) {
            return res.status(403).json({ message: 'Você não tem permissão para apagar esta avaliação.' });
        }

        // Remove a referência da avaliação de dentro do filme
        await Movie.findByIdAndUpdate(review.movie, { $pull: { reviews: review._id } });

        // Remove a avaliação
        await review.deleteOne();

        res.status(200).json({ message: 'Avaliação apagada com sucesso.' });
    } catch (error) {
        res.status(400).json({ message: 'Erro ao apagar avaliação', error });
    }
};