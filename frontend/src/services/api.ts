import axios from 'axios';

const API_URL = 'http://localhost:5001/api';

export const api = axios.create({ // Exportamos a instância do axios
  baseURL: API_URL,
});

// Funções de Autenticação
export const registerUser = (data: any) => api.post('/auth/register', data);
export const loginUser = (data: any) => api.post('/auth/login', data);
export const getMyReviews = () => api.get('/users/me/reviews');

// Funções de Sagas
export const getSagas = (search?: string) => api.get('/sagas', {
  params: { search }
});
export const getSagaDetails = (sagaId: string) => api.get(`/sagas/${sagaId}`);

// Funções de Reviews
export const createReview = (data: { rating: number; comment?: string; movieId: string }) => api.post('/reviews', data);

// Interfaces de Tipagem
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
  user: IUser; // ANTES: friend
}

export interface IMovie {
  _id: string;
  title: string;
  year: number;
  orderInSaga: number;
  reviews: IReview[];
}

export interface ISagaSummary {
    _id: string;
    title: string;
    genre: string;
    imageUrl?: string;
}

export interface ISagaDetails extends ISagaSummary {
  movies: IMovie[];
}

// Funções de Admin
export const createSaga = (data: { title: string; genre: string; imageUrl?: string }) => api.post('/sagas', data);
export const addMovieToSaga = (sagaId: string, data: { title: string; year: number; orderInSaga: number }) => api.post(`/sagas/${sagaId}/movies`, data);

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