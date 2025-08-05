import { Request, Response } from 'express';
import axios from 'axios';

const TMDB_API_URL = 'https://api.themoviedb.org/3';
const TMDB_API_KEY = process.env.TMDB_API_KEY;

export const searchCollections = async (req: Request, res: Response) => {
  // O termo de busca virá da query string (ex: /api/tmdb/sagas?query=star%20wars)
  const query = req.query.query as string;

  if (!query) {
    return res.status(400).json({ message: 'O termo de busca é obrigatório.' });
  }

  try {
    const response = await axios.get(`${TMDB_API_URL}/search/collection`, {
      params: {
        api_key: TMDB_API_KEY,
        language: 'pt-BR',
        query: query,
      },
    });

    // Filtramos os resultados para enviar apenas o que precisamos para o frontend
    const filteredResults = response.data.results.map((saga: any) => ({
      id: saga.id,
      name: saga.name,
      poster_path: saga.poster_path,
      overview: saga.overview,
    }));

    res.json(filteredResults);
  } catch (error) {
    console.error('Erro ao buscar no TMDb:', error);
    res.status(500).json({ message: 'Erro ao se comunicar com a API do TMDb.' });
  }
};