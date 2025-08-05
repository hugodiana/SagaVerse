import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getSagas, ISagaSummary } from '../services/api';
import LoadingSpinner from '../components/common/LoadingSpinner';

const SagaListPage: React.FC = () => {
  const [sagas, setSagas] = useState<ISagaSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState(''); // <-- Estado para a busca

  // Usamos o useEffect para buscar as sagas quando o componente monta
  // ou quando o termo de busca (searchTerm) muda.
  useEffect(() => {
    const fetchSagas = async () => {
      // Setamos o loading como true no início de cada busca
      setLoading(true); 
      try {
        const response = await getSagas(searchTerm);
        setSagas(response.data);
      } catch (err) {
        setError("Não foi possível carregar as sagas.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    // Um pequeno "debounce" manual para não fazer a busca a cada tecla digitada
    const delayDebounceFn = setTimeout(() => {
      fetchSagas();
    }, 300); // Espera 300ms após o usuário parar de digitar

    return () => clearTimeout(delayDebounceFn); // Limpa o timeout
  }, [searchTerm]); // <-- O gatilho do useEffect agora é o searchTerm

  return (
    <div>
      <div className="search-header">
        <h2>Sagas para Avaliar</h2>
        <input
          type="text"
          placeholder="Buscar saga pelo nome..."
          className="search-input"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </div>

      {loading && <LoadingSpinner />}

      {!loading && error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

      {!loading && !error && (
        <div className="saga-list">
          {sagas.length > 0 ? sagas.map(saga => (
            <Link to={`/saga/${saga._id}`} key={saga._id} className="saga-card">
              <img src={saga.imageUrl || `https://via.placeholder.com/200x300.png?text=${saga.title.replace(' ', '+')}`} alt={saga.title} />
              <h3>{saga.title}</h3>
              <span>{saga.genre}</span>
            </Link>
          )) : (
            <p>Nenhuma saga encontrada com o termo "{searchTerm}".</p>
          )}
        </div>
      )}
    </div>
  );
};

export default SagaListPage;