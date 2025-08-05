import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { getSagaDetails, ISagaDetails } from '../services/api';
import MovieDetail from '../components/MovieDetail';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { FaTags } from 'react-icons/fa';

const SagaDetailPage: React.FC = () => {
  const { sagaId } = useParams<{ sagaId: string }>();
  const [saga, setSaga] = useState<ISagaDetails | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchDetails = useCallback(async () => {
    if (sagaId) {
      try {
        const response = await getSagaDetails(sagaId);
        setSaga(response.data);
      } catch (error) {
        console.error("Erro ao buscar detalhes da saga:", error);
      } finally {
        setLoading(false);
      }
    }
  }, [sagaId]);

  useEffect(() => {
    setLoading(true);
    fetchDetails();
  }, [fetchDetails]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!saga) {
    return <p>Saga não encontrada.</p>;
  }

  const calculateSagaAverage = () => {
    const allRatings = saga.movies.flatMap(m => m.reviews.map(r => r.rating));
    if (allRatings.length === 0) return 'N/A';
    const sum = allRatings.reduce((acc, rating) => acc + rating, 0);
    return (sum / allRatings.length).toFixed(1);
  };

  return (
    <div className="saga-detail-page">
      <div className="saga-header">
        <img src={saga.imageUrl || `https://via.placeholder.com/200x300.png?text=${saga.title.replace(' ', '+')}`} alt={saga.title} />
        <div>
          <h2>{saga.title}</h2>
          <p className="saga-genre">
            <FaTags /> {saga.genre}
          </p>
          <p className="saga-average"><strong>Média da Saga: {calculateSagaAverage()}</strong></p>
        </div>
      </div>

      <div className="movies-list">
        <h3>Filmes</h3>
        {saga.movies.map(movie => (
          <MovieDetail key={movie._id} movie={movie} onReviewAdded={fetchDetails} />
        ))}
      </div>
    </div>
  );
};

export default SagaDetailPage;