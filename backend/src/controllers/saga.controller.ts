import { Request, Response } from 'express';
import { Saga } from '../models/saga.model';
import { Movie } from '../models/movie.model';

export const createSaga = async (req: Request, res: Response) => {
    try {
        // Agora esperamos o tmdbId do frontend
        const { title, genre, imageUrl, tmdbId } = req.body;
        const saga = new Saga({ title, genre, imageUrl, tmdbId });
        await saga.save();
        res.status(201).json(saga);
    } catch (error) {
        res.status(400).json({ message: 'Erro ao criar saga', error });
    }
};

export const addMovieToSaga = async (req: Request, res: Response) => {
    try {
        const { sagaId } = req.params;
        const movie = new Movie(req.body);
            saga: sagaId
        await movie.save();

        const saga = await Saga.findByIdAndUpdate(
            sagaId,
            { $push: { movies: movie._id } },
            { new: true }
        );

        if (!saga) return res.status(404).json({ message: 'Saga não encontrada' });
        res.status(201).json(saga);
    } catch (error) {
        res.status(400).json({ message: 'Erro ao adicionar filme', error });
    }
}

export const getAllSagas = async (req: Request, res: Response) => {
    try {
        // Pega o termo de busca da query string (ex: /api/sagas?search=harry)
        const searchTerm = req.query.search || '';

        // Cria um filtro. Se houver termo de busca, usa regex. Senão, o filtro é vazio.
        const filter = searchTerm 
          ? { title: { $regex: searchTerm, $options: 'i' } } // 'i' para case-insensitive
          : {};

        const sagas = await Saga.find(filter).select('-movies').sort({ title: 1 });
        res.status(200).json(sagas);
    } catch (error) {
        res.status(500).json({ message: 'Erro no servidor', error });
    }
};

export const getSagaDetails = async (req: Request, res: Response) => {
    try {
        const { sagaId } = req.params;
        const saga = await Saga.findById(sagaId).populate({
            path: 'movies',
            options: { sort: { orderInSaga: 1 } },
            populate: {
                path: 'reviews',
                populate: {
                    path: 'user',
                    select: 'name'
                }
            }
        });

        if (!saga) {
            return res.status(404).json({ message: 'Saga não encontrada' });
        }
        res.status(200).json(saga);
    } catch (error) {
        res.status(500).json({ message: 'Erro no servidor', error });
    }
};

export const deleteSaga = async (req: Request, res: Response) => {
  try {
    const sagaId = req.params.id;
    const saga = await Saga.findById(sagaId);

    if (!saga) {
      return res.status(404).json({ message: 'Saga não encontrada.' });
    }

    // Encontrar todos os IDs dos filmes da saga
    const movieIds = saga.movies;

    if (movieIds && movieIds.length > 0) {
      // 1. Apagar todas as avaliações de todos os filmes da saga
      await Review.deleteMany({ movie: { $in: movieIds } });

      // 2. Apagar todos os filmes da saga
      await Movie.deleteMany({ _id: { $in: movieIds } });
    }

    // 3. Apagar a saga
    await saga.deleteOne();

    res.status(200).json({ message: 'Saga, filmes e avaliações associadas foram apagados com sucesso.' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao apagar saga', error });
  }
};