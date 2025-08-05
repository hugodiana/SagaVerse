import React, { useState } from 'react';
import { createReview } from '../services/api';
import { useAuth } from '../context/AuthContext';

interface ReviewFormProps {
    movieId: string;
    onReviewSubmit: () => void;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ movieId, onReviewSubmit }) => {
    const { user } = useAuth(); // Usamos o contexto para saber se o usuário está logado
    const [rating, setRating] = useState(7);
    const [comment, setComment] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');
        try {
            await createReview({ rating, comment, movieId });
            onReviewSubmit();
            setComment('');
            setRating(7);
        } catch (err) {
            setError("Erro ao enviar avaliação. Você está logado?");
            console.error(err);
        } finally {
            setSubmitting(false);
        }
    }

    // Se não houver usuário logado, mostramos uma mensagem
    if (!user) {
        return <p>Você precisa <a href="/login">fazer login</a> para avaliar.</p>
    }

    return (
        <form className="review-form" onSubmit={handleSubmit}>
            <label>Sua Avaliação:</label>
            <input type="range" min="0" max="10" step="0.5" value={rating} onChange={e => setRating(Number(e.target.value))} required/>
            <span>Nota: {rating}</span>
            <textarea value={comment} onChange={e => setComment(e.target.value)} placeholder="Comentário (opcional)" />
            <button type="submit" disabled={submitting}>
                {submitting ? 'Enviando...' : 'Avaliar'}
            </button>
            {error && <p className="error-message" style={{width: '100%', marginTop: '10px'}}>{error}</p>}
        </form>
    );
}

export default ReviewForm;