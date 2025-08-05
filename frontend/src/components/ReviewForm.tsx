import React, { useState, useEffect } from 'react';
import { createReview, updateReview, IReview } from '../services/api';
import toast from 'react-hot-toast';

interface ReviewFormProps {
    movieId: string;
    onReviewSubmit: () => void;
    existingReview?: IReview | null; // Prop opcional para o modo de edição
}

const ReviewForm: React.FC<ReviewFormProps> = ({ movieId, onReviewSubmit, existingReview }) => {
    const isEditMode = !!existingReview;
    const [rating, setRating] = useState(existingReview?.rating || 7);
    const [comment, setComment] = useState(existingReview?.comment || '');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
      // Atualiza o formulário se a prop existingReview mudar
      if (existingReview) {
        setRating(existingReview.rating);
        setComment(existingReview.comment || '');
      }
    }, [existingReview]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            if (isEditMode) {
                await updateReview(existingReview._id, { rating, comment });
                toast.success('Avaliação atualizada!');
            } else {
                await createReview({ rating, comment, movieId });
                toast.success('Avaliação enviada!');
            }
            onReviewSubmit();
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Ocorreu um erro.');
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <form className="review-form" onSubmit={handleSubmit}>
            <label>Sua Nota:</label>
            <input type="range" min="0" max="10" step="0.5" value={rating} onChange={e => setRating(Number(e.target.value))} required/>
            <span>{rating}</span>
            <textarea value={comment} onChange={e => setComment(e.target.value)} placeholder="Comentário (opcional)" />
            <button type="submit" disabled={submitting}>
                {submitting ? 'Salvando...' : (isEditMode ? 'Salvar Edição' : 'Avaliar')}
            </button>
        </form>
    );
}

export default ReviewForm;