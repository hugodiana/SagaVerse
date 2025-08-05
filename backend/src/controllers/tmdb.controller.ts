import { Request, Response } from 'express';
import axios from 'axios';

const TMDB_API_URL = 'https://api.themoviedb.org/3';

export const searchCollections = async (req: Request, res: Response) => {
  // A variável é lida AQUI, dentro da função, e não mais no topo do arquivo.
  const TMDB_API_KEY = process.env.TMDB_API_KEY;
  const query = req.query.query as string;

  if (!query) {
    return res.status(400).json({ message: 'O termo de busca é obrigatório.' });
  }

  // Checamos se a chave foi carregada corretamente antes de fazer a chamada
  if (!TMDB_API_KEY) {
    console.error('ERRO: A chave da API do TMDb não foi encontrada no .env');
    return res.status(500).json({ message: 'Erro de configuração do servidor: chave da API não encontrada.' });
  }

  try {
    const response = await axios.get(`${TMDB_API_URL}/search/collection`, {
      params: {
        api_key: TMDB_API_KEY, // Agora TMDB_API_KEY terá o valor correto
        language: 'pt-BR',
        query: query,
      },
    });

    const filteredResults = response.data.results.map((saga: any) => ({
      id: saga.id,
      name: saga.name,
      poster_path: saga.poster_path,
      overview: saga.overview,
    }));

    res.json(filteredResults);
  } catch (error: any) {
    // Melhoramos o log de erro para ver a resposta do TMDb se houver falha
    console.error('Erro ao buscar no TMDb:', error.response?.data || error.message);
    res.status(500).json({ message: 'Erro ao se comunicar com a API do TMDb.' });
  }
};