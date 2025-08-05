import React, { useState, useEffect } from 'react';
import { createSaga, addMovieToSaga, getSagas, ISagaSummary, searchTmdbSagas } from '../services/api';
import toast from 'react-hot-toast';
import './AdminDashboard.css';
import LoadingSpinner from '../components/common/LoadingSpinner';

// Interface para os resultados da busca no TMDb
interface TmdbResult {
  id: number;
  name: string;
  poster_path: string;
}

const AdminDashboard: React.FC = () => {
  // Estados para o formulário de adicionar filme
  const [sagas, setSagas] = useState<ISagaSummary[]>([]);
  const [selectedSaga, setSelectedSaga] = useState('');
  const [movieTitle, setMovieTitle] = useState('');
  const [movieYear, setMovieYear] = useState('');
  const [movieOrder, setMovieOrder] = useState('');

  // Estados para a busca e adição de sagas via TMDb
  const [tmdbSearch, setTmdbSearch] = useState('');
  const [tmdbResults, setTmdbResults] = useState<TmdbResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const fetchSagas = async () => {
    try {
      const response = await getSagas();
      setSagas(response.data);
      if (response.data.length > 0 && !selectedSaga) {
        setSelectedSaga(response.data[0]._id);
      }
    } catch (error) {
      console.error("Erro ao buscar sagas", error);
    }
  };

  useEffect(() => {
    fetchSagas();
  }, []);

  const handleTmdbSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    setTmdbResults([]);
    try {
      const response = await searchTmdbSagas(tmdbSearch);
      setTmdbResults(response.data);
    } catch (error) {
      toast.error('Erro ao buscar sagas no TMDb.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleAddSagaFromTmdb = async (saga: TmdbResult) => {
    const loadingToast = toast.loading('Adicionando saga...');
    try {
      // A URL completa da imagem é construída aqui
      const imageUrl = saga.poster_path ? `https://image.tmdb.org/t/p/w500${saga.poster_path}` : '';
      await createSaga({ title: saga.name, genre: 'A definir', imageUrl });
      toast.success(`Saga "${saga.name}" adicionada!`, { id: loadingToast });
      // Limpa os resultados e atualiza a lista de sagas no outro formulário
      setTmdbResults([]);
      setTmdbSearch('');
      fetchSagas();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erro ao adicionar saga.', { id: loadingToast });
    }
  };

  const handleAddMovie = async (e: React.FormEvent) => {
    e.preventDefault();
    const loadingToast = toast.loading('Adicionando filme...');
    try {
      await addMovieToSaga(selectedSaga, {
        title: movieTitle, year: Number(movieYear), orderInSaga: Number(movieOrder)
      });
      toast.success('Filme adicionado com sucesso!', { id: loadingToast });
      setMovieTitle(''); setMovieYear(''); setMovieOrder('');
    } catch (error) {
      toast.error('Erro ao adicionar filme.', { id: loadingToast });
    }
  };

  return (
    <div className="admin-dashboard">
      <h2>Painel de Administração</h2>
      <div className="admin-forms-container">
        {/* Formulário de Busca e Adição de Saga */}
        <div className="admin-form">
          <h3>Adicionar Saga do TMDb</h3>
          <form onSubmit={handleTmdbSearch}>
            <input type="text" value={tmdbSearch} onChange={e => setTmdbSearch(e.target.value)} placeholder="Buscar saga... (ex: Harry Potter)" required />
            <button type="submit" disabled={isSearching}>Buscar</button>
          </form>
          <div className="tmdb-results">
            {isSearching && <LoadingSpinner />}
            {tmdbResults.map(saga => (
              <div key={saga.id} className="tmdb-result-item">
                <img src={saga.poster_path ? `https://image.tmdb.org/t/p/w200${saga.poster_path}` : 'https://via.placeholder.com/100x150.png?text=Sem+Capa'} alt={saga.name} />
                <span>{saga.name}</span>
                <button onClick={() => handleAddSagaFromTmdb(saga)}>+</button>
              </div>
            ))}
          </div>
        </div>

        {/* Formulário de Adicionar Filme */}
        <form onSubmit={handleAddMovie} className="admin-form">
          <h3>Adicionar Filme a uma Saga</h3>
          <select value={selectedSaga} onChange={e => setSelectedSaga(e.target.value)} required disabled={sagas.length === 0}>
            <option value="" disabled>Selecione a Saga</option>
            {sagas.map(saga => (<option key={saga._id} value={saga._id}>{saga.title}</option>))}
          </select>
          <input type="text" value={movieTitle} onChange={e => setMovieTitle(e.target.value)} placeholder="Título do Filme" required />
          <input type="number" value={movieYear} onChange={e => setMovieYear(e.target.value)} placeholder="Ano de Lançamento" required />
          <input type="number" value={movieOrder} onChange={e => setMovieOrder(e.target.value)} placeholder="Ordem na Saga" required />
          <button type="submit">Adicionar Filme</button>
        </form>
      </div>
    </div>
  );
};

export default AdminDashboard;