import React, { useState, useEffect } from 'react';
import { createSaga, addMovieToSaga, getSagas, ISagaSummary } from '../services/api';
import toast from 'react-hot-toast'; // Importamos o toast
import './AdminDashboard.css';

const AdminDashboard: React.FC = () => {
  // Estado para o formulário de criar saga
  const [sagaTitle, setSagaTitle] = useState('');
  const [sagaGenre, setSagaGenre] = useState('');
  const [sagaImageUrl, setSagaImageUrl] = useState('');

  // Estado para o formulário de adicionar filme
  const [sagas, setSagas] = useState<ISagaSummary[]>([]);
  const [selectedSaga, setSelectedSaga] = useState('');
  const [movieTitle, setMovieTitle] = useState('');
  const [movieYear, setMovieYear] = useState('');
  const [movieOrder, setMovieOrder] = useState('');

  useEffect(() => {
    const fetchSagas = async () => {
      try {
        const response = await getSagas();
        setSagas(response.data);
        if (response.data.length > 0) {
          setSelectedSaga(response.data[0]._id);
        }
      } catch (error) {
        console.error("Erro ao buscar sagas", error);
        toast.error("Não foi possível carregar as sagas.");
      }
    };
    fetchSagas();
  }, []);

  const handleCreateSaga = async (e: React.FormEvent) => {
    e.preventDefault();
    const loadingToast = toast.loading('Criando saga...');
    try {
      await createSaga({ title: sagaTitle, genre: sagaGenre, imageUrl: sagaImageUrl });
      toast.success('Saga criada com sucesso!', { id: loadingToast });
      setSagaTitle('');
      setSagaGenre('');
      setSagaImageUrl('');
      const response = await getSagas();
      setSagas(response.data);
    } catch (error) {
      toast.error('Erro ao criar saga.', { id: loadingToast });
    }
  };

  const handleAddMovie = async (e: React.FormEvent) => {
    e.preventDefault();
    const loadingToast = toast.loading('Adicionando filme...');
    try {
      await addMovieToSaga(selectedSaga, {
        title: movieTitle,
        year: Number(movieYear),
        orderInSaga: Number(movieOrder),
      });
      toast.success('Filme adicionado com sucesso!', { id: loadingToast });
      setMovieTitle('');
      setMovieYear('');
      setMovieOrder('');
    } catch (error) {
      toast.error('Erro ao adicionar filme.', { id: loadingToast });
    }
  };

  return (
    <div className="admin-dashboard">
      <h2>Painel de Administração</h2>

      <div className="admin-forms-container">
        {/* Formulário de Criar Saga */}
        <form onSubmit={handleCreateSaga} className="admin-form">
          <h3>Criar Nova Saga</h3>
          <input type="text" value={sagaTitle} onChange={e => setSagaTitle(e.target.value)} placeholder="Título da Saga" required />
          <input type="text" value={sagaGenre} onChange={e => setSagaGenre(e.target.value)} placeholder="Gênero" required />
          <input type="text" value={sagaImageUrl} onChange={e => setSagaImageUrl(e.target.value)} placeholder="URL da Imagem de Capa" />
          <button type="submit">Criar Saga</button>
        </form>

        {/* Formulário de Adicionar Filme */}
        <form onSubmit={handleAddMovie} className="admin-form">
          <h3>Adicionar Filme a uma Saga</h3>
          <select value={selectedSaga} onChange={e => setSelectedSaga(e.target.value)} required disabled={sagas.length === 0}>
            <option value="" disabled>Selecione a Saga</option>
            {sagas.map(saga => (
              <option key={saga._id} value={saga._id}>{saga.title}</option>
            ))}
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