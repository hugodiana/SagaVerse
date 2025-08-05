import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User, IUser } from '../models/user.model';

// Estendemos a interface Request do Express para incluir nossa propriedade 'user'
export interface AuthRequest extends Request {
  user?: IUser;
}

export const protect = async (req: AuthRequest, res: Response, next: NextFunction) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Pega o token do cabeçalho (ex: "Bearer eyJhbGci...")
      token = req.headers.authorization.split(' ')[1];

      // Decodifica o token para pegar o ID do usuário
      const decoded = jwt.verify(token, process.env.JWT_SECRET || '') as { id: string };

      // Busca o usuário no banco pelo ID e anexa ao objeto 'req'
      req.user = await User.findById(decoded.id).select('-password');
      
      if (!req.user) {
        return res.status(401).json({ message: 'Não autorizado, usuário não encontrado.' });
      }

      next(); // Se tudo deu certo, avança para a próxima função (o controller)
    } catch (error) {
      return res.status(401).json({ message: 'Não autorizado, token inválido.' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Não autorizado, sem token.' });
  }
};

// Novo middleware para checar se o usuário é Admin
export const admin = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.user && req.user.role === 'admin') {
    next(); // Se for admin, pode prosseguir
  } else {
    res.status(403).json({ message: 'Acesso negado. Rota exclusiva para administradores.' });
  }
};