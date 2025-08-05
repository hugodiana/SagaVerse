import { Request, Response } from 'express';
import { User } from '../models/user.model';
import jwt from 'jsonwebtoken';

// Função para gerar o Token JWT
const generateToken = (id: string) => {
  // O 'process.env.JWT_SECRET' deve ser uma string segura e longa no seu arquivo .env
  const secret = process.env.JWT_SECRET || 'seu_segredo_super_secreto_padrao';
  return jwt.sign({ id }, secret, {
    expiresIn: '1d', // Token expira em 1 dia
  });
};

// Controller para registrar um novo usuário
export const registerUser = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'Este e-mail já está em uso.' });
    }

    const user = new User({ name, email, password });
    await user.save();

    // Retornamos os dados do usuário (sem a senha) e um token para ele já logar
    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(201).json({
      ...userResponse,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao registrar usuário', error });
  }
};

// Controller para fazer o login
export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    // Usamos .select('+password') para forçar o Mongoose a incluir a senha na busca
    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'E-mail ou senha inválidos.' });
    }
    
    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(200).json({
      ...userResponse,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao fazer login', error });
  }
};