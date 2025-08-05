import { Request, Response } from 'express';
import { Movie } from '../models/movie.model';
import { Review } from '../models/review.model';
import { Saga } from '../models/saga.model';

export const deleteMovie = async (req: Request, res: Response) => {
  try {
    const movieId = req.params.id;
    const movie = await Movie.findById(movieId);

    if (!movie) {
      return res.status(404).json({ message: 'Filme não encontrado.' });
    }

    // 1. Apagar todas as avaliações associadas a este filme
    await Review.deleteMany({ movie: movieId });

    // 2. Remover a referência do filme de dentro da saga
    await Saga.findByIdAndUpdate(movie.saga, { $pull: { movies: movieId } });

    // 3. Apagar o filme
    await movie.deleteOne();

    res.status(200).json({ message: 'Filme e suas avaliações foram apagados com sucesso.' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao apagar filme', error });
  }
};