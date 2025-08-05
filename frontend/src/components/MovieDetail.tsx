import React from 'react';
import { IMovie } from '../services/api';
import ReviewForm from './ReviewForm';
import StarRating from './common/StarRating';

interface MovieDetailProps {
  movie: IMovie;
  onReviewAdded: () => void;
}

const MovieDetail: React.FC<MovieDetailProps> = ({ movie, onReviewAdded }) => {
  const calculateMovieAverage = () => {
    if (movie.reviews.length === 0) return 0;
    const sum = movie.reviews.reduce((acc, review) => acc + review.rating, 0);
    return sum / movie.reviews.length;
  };

  const average = calculateMovieAverage();

  return (
    <div className="movie-container">
      <div className="movie-title-header">
        <h4>{movie.orderInSaga}. {movie.title} ({movie.year})</h4>
        <div className="movie-average">
          <StarRating rating={average / 2} /> 
          <span>{average > 0 ? average.toFixed(1) : 'N/A'}</span>
        </div>
      </div>

      <div className="reviews-section">
        <h5>Avaliações:</h5>
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
          <ReviewForm movieId={movie._id} onReviewSubmit={onReviewAdded} />
      </div>
    </div>
  );
};

export default MovieDetail;