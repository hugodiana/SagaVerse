import React, { useState, useEffect } from 'react';
import { getSagas, ISagaSummary, searchTmdbSagas, createSaga, getTmdbSagaMovies, addMovieToSaga } from '../services/api';
import toast from 'react-hot-toast';
import './AdminDashboard.css';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ManageContent from '../components/admin/ManageContent';

// Interfaces
interface TmdbResult { id: number; name: string; poster_path: string; }
interface TmdbMovie { id: number; title: string; release_date: string; poster_path: string; }
interface ISagaWithTmdbId extends ISagaSummary { tmdbId: number; }

const AdminDashboard: React.FC = () => {
  const [sagas, setSagas] = useState<ISagaWithTmdbId[]>([]);
  const [selectedSaga, setSelectedSaga] = useState('');
  const [tmdbSearch, setTmdbSearch] = useState('');
  const [tmdbResults, setTmdbResults] = useState<TmdbResult[]>([]);
  const [isSearchingSagas, setIsSearchingSagas] = useState(false);
  const [tmdbMovies, setTmdbMovies] = useState<TmdbMovie[]>([]);
  const [isLoadingMovies, setIsLoadingMovies] = useState(false);

  const fetchSagas = async () => {
    try {
      const response = await getSagas();
      setSagas(response.data);
      if (response.data.length > 0 && !selectedSaga) {
        setSelectedSaga(response.data[0]._id);
      }
    } catch (error) {
      console.error("Erro ao buscar sagas do banco de dados", error);
    }
  };

  useEffect(() => {
    fetchSagas();
  }, []);

  const handleTmdbSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tmdbSearch.trim()) return;
    setIsSearchingSagas(true);
    setTmdbResults([]);
    try {
      const response = await searchTmdbSagas(tmdbSearch);
      setTmdbResults(response.data);
    } catch (error) {
      toast.error('Erro ao buscar sagas no TMDb.');
    } finally {
      setIsSearchingSagas(false);
    }
  };

  const handleAddSagaFromTmdb = async (saga: TmdbResult) => {
    const loadingToast = toast.loading('Adicionando saga...');
    try {
      const imageUrl = saga.poster_path ? `https://image.tmdb.org/t/p/w500${saga.poster_path}` : '';
      await createSaga({ title: saga.name, genre: 'A definir', imageUrl, tmdbId: saga.id });
      toast.success(`Saga "${saga.name}" adicionada!`, { id: loadingToast });
      setTmdbResults([]);
      setTmdbSearch('');
      fetchSagas();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erro ao adicionar saga.', { id: loadingToast });
    }
  };

  useEffect(() => {
    if (!selectedSaga) {
      setTmdbMovies([]);
      return;
    }

    const findSaga = sagas.find(s => s._id === selectedSaga);
    if (!findSaga || !findSaga.tmdbId) return;

    const fetchMoviesFromTmdb = async () => {
      setIsLoadingMovies(true);
      try {
        const response = await getTmdbSagaMovies(findSaga.tmdbId);
        setTmdbMovies(response.data);
      } catch (error) {
        toast.error('Erro ao buscar filmes desta saga no TMDb.');
        setTmdbMovies([]);
      } finally {
        setIsLoadingMovies(false);
      }
    };
    fetchMoviesFromTmdb();
  }, [selectedSaga, sagas]);

  const handleAddMovieFromTmdb = async (movie: TmdbMovie, index: number) => {
    const loadingToast = toast.loading(`Adicionando ${movie.title}...`);
    try {
      const movieData = {
        title: movie.title,
        year: movie.release_date ? new Date(movie.release_date).getFullYear() : 0,
        orderInSaga: index + 1,
        imageUrl: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : ''
      };
      await addMovieToSaga(selectedSaga, movieData);
      toast.success('Filme adicionado!', { id: loadingToast });
    } catch (error) {
      toast.error('Erro ao adicionar filme.', { id: loadingToast });
    }
  };

  return (
    <div className="admin-dashboard">
      <h2>Painel de Administração</h2>
      <div className="admin-forms-container">
        <div className="admin-form">
          <h3>1. Adicionar Saga do TMDb</h3>
          <form onSubmit={handleTmdbSearch}>
            <input type="text" value={tmdbSearch} onChange={e => setTmdbSearch(e.target.value)} placeholder="Buscar saga... (ex: Harry Potter)" required />
            <button type="submit" disabled={isSearchingSagas}>Buscar</button>
          </form>
          <div className="tmdb-results">
            {isSearchingSagas && <LoadingSpinner />}
            {tmdbResults.map(saga => (
              <div key={saga.id} className="tmdb-result-item">
                <img src={saga.poster_path ? `https://image.tmdb.org/t/p/w200${saga.poster_path}` : 'https://via.placeholder.com/100x150.png?text=Sem+Capa'} alt={saga.name} />
                <span>{saga.name}</span>
                <button onClick={() => handleAddSagaFromTmdb(saga)}>+</button>
              </div>
            ))}
          </div>
        </div>
        <div className="admin-form">
          <h3>2. Adicionar Filmes a uma Saga</h3>
          <select value={selectedSaga} onChange={e => setSelectedSaga(e.target.value)} required disabled={sagas.length === 0}>
            <option value="" disabled>Selecione a Saga</option>
            {sagas.map(saga => (<option key={saga._id} value={saga._id}>{saga.title}</option>))}
          </select>
          <div className="tmdb-results">
            {isLoadingMovies && <LoadingSpinner />}
            {!isLoadingMovies && tmdbMovies.map((movie, index) => (
               <div key={movie.id} className="tmdb-result-item">
                <img src={movie.poster_path ? `https://image.tmdb.org/t/p/w200${movie.poster_path}` : 'https://via.placeholder.com/100x150.png?text=Sem+Capa'} alt={movie.title} />
                <span>{movie.title} ({movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A'})</span>
                <button onClick={() => handleAddMovieFromTmdb(movie, index)}>+</button>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Nova seção de Gerenciamento separada */}
      <div className="admin-form manage-section">
        <ManageContent sagas={sagas} onContentDeleted={fetchSagas} />
      </div>
    </div>
  );
};

export default AdminDashboard;