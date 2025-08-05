import React, { useState, useEffect } from 'react';
import { getSagaDetails, ISagaDetails, deleteSaga, deleteMovie, ISagaSummary } from '../../services/api';
import toast from 'react-hot-toast';
import { FiTrash2 } from 'react-icons/fi';
import './ManageContent.css';
import LoadingSpinner from '../common/LoadingSpinner';

interface ManageContentProps {
  // A correção está aqui: agora ele aceita a lista resumida de sagas
  sagas: ISagaSummary[]; 
  onContentDeleted: () => void;
}

const ManageContent: React.FC<ManageContentProps> = ({ sagas, onContentDeleted }) => {
  const [detailedSagas, setDetailedSagas] = useState<ISagaDetails[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Esta função agora busca os detalhes completos das sagas que recebe
    const fetchDetails = async () => {
      if (sagas.length > 0) {
        setIsLoading(true);
        try {
          const promises = sagas.map(s => getSagaDetails(s._id));
          const results = await Promise.all(promises);
          setDetailedSagas(results.map(r => r.data));
        } catch (error) {
          console.error("Erro ao buscar detalhes das sagas", error);
          toast.error("Não foi possível carregar os detalhes do conteúdo.");
        } finally {
          setIsLoading(false);
        }
      } else {
        setDetailedSagas([]); // Limpa os detalhes se não houver sagas
      }
    };
    fetchDetails();
  }, [sagas]); // Roda sempre que a lista de sagas do painel principal muda

  const handleDeleteSaga = async (sagaId: string) => {
    if(window.confirm('Tem certeza? Isso apagará a saga, TODOS os seus filmes e TODAS as avaliações.')){
      try {
        await deleteSaga(sagaId);
        toast.success('Saga apagada com sucesso!');
        onContentDeleted(); // Avisa o painel principal para recarregar a lista de sagas
      } catch (error) {
        toast.error('Erro ao apagar a saga.');
      }
    }
  }

  const handleDeleteMovie = async (movieId: string) => {
     if(window.confirm('Tem certeza? Isso apagará o filme e TODAS as suas avaliações.')){
      try {
        await deleteMovie(movieId);
        toast.success('Filme apagado com sucesso!');
        onContentDeleted(); // Avisa o painel principal para recarregar tudo
      } catch (error) {
        toast.error('Erro ao apagar o filme.');
      }
    }
  }

  return (
    <div className="manage-content">
      <h3>3. Gerenciar Conteúdo Existente</h3>
      {isLoading ? <LoadingSpinner /> : (
        detailedSagas.length > 0 ? detailedSagas.map(saga => (
          <div key={saga._id} className="manage-saga-item">
            <div className="manage-saga-header">
              <span>{saga.title}</span>
              <button onClick={() => handleDeleteSaga(saga._id)} className="delete-btn" title="Apagar Saga"><FiTrash2 /></button>
            </div>
            <ul className="manage-movie-list">
              {saga.movies.length > 0 ? saga.movies.map(movie => (
                <li key={movie._id}>
                  <span>{movie.title}</span>
                  <button onClick={() => handleDeleteMovie(movie._id)} className="delete-btn" title="Apagar Filme"><FiTrash2 /></button>
                </li>
              )) : <li>Nenhum filme cadastrado nesta saga.</li>}
            </ul>
          </div>
        )) : <p>Nenhuma saga cadastrada para gerenciar.</p>
      )}
    </div>
  );
};

export default ManageContent;