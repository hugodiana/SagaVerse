import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes';
import sagaRoutes from './routes/saga.routes';
import reviewRoutes from './routes/review.routes';
import userRoutes from './routes/user.routes';
import tmdbRoutes from './routes/tmdb.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;
const MONGO_URI = process.env.MONGO_URI;

// Middlewares
app.use(cors());
app.use(express.json());

// Rotas da API
app.use('/api/auth', authRoutes); 
app.use('/api/users', userRoutes);
app.use('/api/tmdb', tmdbRoutes);
app.use('/api/sagas', sagaRoutes);
app.use('/api/reviews', reviewRoutes);

// Conexão com o MongoDB
if (!MONGO_URI) {
    console.error("String de conexão do MongoDB não definida no arquivo .env");
    process.exit(1);
}
mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB conectado com sucesso.'))
  .catch(err => console.error('Erro na conexão com MongoDB:', err));

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Servidor backend rodando em http://localhost:${PORT}`);
});