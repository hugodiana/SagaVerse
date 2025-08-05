import React, { useState } from 'react';
import { IMovie } from '../services/api';
import ReviewForm from './ReviewForm';
import StarRating from './common/StarRating';
import { useAuth } from '../context/AuthContext';
import { deleteReview } from '../services/api';
import toast from 'react-hot-toast';

interface MovieDetailProps {
  movie: IMovie;
  onReviewAdded: () => void; // Esta função agora servirá para recarregar os dados
}

const MovieDetail: React.FC<MovieDetailProps> = ({ movie, onReviewAdded }) => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  // Encontra a avaliação do usuário logado, se existir
  const userReview = user ? movie.reviews.find(review => review.user._id === user._id) : null;

  const calculateMovieAverage = () => {
    if (movie.reviews.length === 0) return 0;
    const sum = movie.reviews.reduce((acc, review) => acc + review.rating, 0);
    return sum / movie.reviews.length;
  };

  const average = calculateMovieAverage();

  const handleDelete = async () => {
    if (!userReview) return;
    if (window.confirm('Tem certeza que deseja apagar sua avaliação?')) {
      try {
        await deleteReview(userReview._id);
        toast.success('Avaliação apagada!');
        onReviewAdded(); // Recarrega os dados da saga
      } catch (error) {
        toast.error('Não foi possível apagar a avaliação.');
      }
    }
  };

  return (
    // Adicionamos a classe 'with-poster' para o novo layout
    <div className="movie-container with-poster">
      {/* Adicionamos a imagem do pôster do filme aqui */}
      <img 
        src={movie.imageUrl || 'https://via.placeholder.com/150x225.png?text=Sem+Pôster'} 
        alt={`Pôster de ${movie.title}`} 
        className="movie-poster"
      />
      
      {/* Agrupamos todo o resto das informações nesta div */}
      <div className="movie-info">
        <div className="movie-title-header">
          <h4>{movie.orderInSaga}. {movie.title} ({movie.year})</h4>
          <div className="movie-average">
            <StarRating rating={average / 2} />
            <span>{average > 0 ? average.toFixed(1) : 'N/A'}</span>
          </div>
        </div>

        <div className="reviews-section">
          <h5>Avaliações dos Usuários:</h5>
          {movie.reviews.length > 0 ? (
            <ul>
              {movie.reviews.map(review => (
                <li key={review._id}>
                  <strong>{review.user.name}:</strong> <span>{review.rating}/10</span>
                  {review.comment && <p>"{review.comment}"</p>}
                </li>
              ))}
            </ul>
          ) : (
            <p>Nenhuma avaliação ainda.</p>
          )}
        </div>

        <div className="add-review-section">
          <h5>Sua Avaliação</h5>
          {user ? (
            userReview ? (
              isEditing ? (
                <ReviewForm 
                  movieId={movie._id} 
                  onReviewSubmit={() => {
                    setIsEditing(false);
                    onReviewAdded();
                  }}
                  existingReview={userReview}
                />
              ) : (
                <div className="user-review-box">
                  <StarRating rating={userReview.rating / 2} />
                  {userReview.comment && <p>"{userReview.comment}"</p>}
                  <div className="review-actions">
                    <button onClick={() => setIsEditing(true)}>Editar</button>
                    <button onClick={handleDelete} className="delete">Apagar</button>
                  </div>
                </div>
              )
            ) : (
              <ReviewForm movieId={movie._id} onReviewSubmit={onReviewAdded} />
            )
          ) : (
            <p>Você precisa <a href="/login">fazer login</a> para avaliar.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MovieDetail;