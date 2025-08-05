import React, { useState, useEffect } from 'react';
import { getMyReviews, IMyReview } from '../services/api';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/common/LoadingSpinner';
import StarRating from '../components/common/StarRating';
import './MyProfilePage.css';

const MyProfilePage: React.FC = () => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<IMyReview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await getMyReviews();
        setReviews(response.data);
      } catch (error) {
        console.error("Erro ao buscar avaliações", error);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="profile-page">
      <h2>Minhas Avaliações</h2>
      <p>Olá, <strong>{user?.name}</strong>! Aqui está todo o seu histórico de avaliações.</p>

      <div className="reviews-list">
        {reviews.length > 0 ? (
          reviews.map(review => (
            <div key={review._id} className="review-card">
              <h3>{review.movie.title}</h3>
              <p className="review-saga-title">da saga "{review.movie.saga.title}"</p>
              <div className="review-rating">
                <StarRating rating={review.rating / 2} />
                <span className="rating-text">Sua nota: {review.rating}/10</span>
              </div>
              {review.comment && <p className="review-comment">"{review.comment}"</p>}
              <p className="review-date">Avaliado em: {new Date(review.createdAt).toLocaleDateString()}</p>
            </div>
          ))
        ) : (
          <p>Você ainda não fez nenhuma avaliação.</p>
        )}
      </div>
    </div>
  );
};

export default MyProfilePage;