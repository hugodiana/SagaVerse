import axios from 'axios';

const API_URL = 'http://localhost:5001/api';

export const api = axios.create({
  baseURL: API_URL,
});

// Funções de Autenticação
export const registerUser = (data: any) => api.post('/auth/register', data);
export const loginUser = (data: any) => api.post('/auth/login', data);

// Funções de Sagas
export const getSagas = (search?: string) => api.get('/sagas', {
  params: { search }
});
export const getSagaDetails = (sagaId: string) => api.get(`/sagas/${sagaId}`);

// Funções de Reviews
export const createReview = (data: { rating: number; comment?: string; movieId: string }) => api.post('/reviews', data);
export const updateReview = (reviewId: string, data: { rating: number; comment?: string }) => api.put(`/reviews/${reviewId}`, data);
export const deleteReview = (reviewId: string) => api.delete(`/reviews/${reviewId}`);

// Funções de Usuário
export const getMyReviews = () => api.get('/users/me/reviews');

// Funções de Gerenciamento
export const deleteSaga = (sagaId: string) => api.delete(`/sagas/${sagaId}`);
export const deleteMovie = (movieId: string) => api.delete(`/movies/${movieId}`);

// Funções de Admin (TMDb)
export const createSaga = (data: { title: string; genre: string; imageUrl?: string, tmdbId: number }) => api.post('/sagas', data);
export const addMovieToSaga = (sagaId: string, data: { title: string; year: number; orderInSaga: number, imageUrl?: string }) => api.post(`/sagas/${sagaId}/movies`, data);
export const searchTmdbSagas = (query: string) => api.get('/tmdb/sagas', {
  params: { query }
});
export const getTmdbSagaMovies = (tmdbSagaId: number) => api.get(`/tmdb/saga/${tmdbSagaId}/movies`);

// --- Interfaces de Tipagem ---
export interface IUser {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
}

export interface IReview {
  _id: string;
  rating: number;
  comment?: string;
  user: IUser;
}

export interface IMovie {
  _id: string;
  title: string;
  year: number;
  orderInSaga: number;
  imageUrl?: string; // <-- A CORREÇÃO ESTÁ AQUI
  reviews: IReview[];
}

export interface ISagaSummary {
    _id: string;
    title: string;
    genre: string;
    imageUrl?: string;
    tmdbId: number;
}

export interface ISagaDetails extends ISagaSummary {
  movies: IMovie[];
}

export interface IMyReview {
    _id: string;
    rating: number;
    comment?: string;
    movie: {
        _id: string;
        title: string;
        saga: {
            _id: string;
            title: string;
        }
    };
    createdAt: string;
}