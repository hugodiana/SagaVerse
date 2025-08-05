// Este é o código que já havíamos corrigido, apenas para garantir.
import { Request, Response } from 'express';
import { User } from '../models/user.model';
import jwt from 'jsonwebtoken';

const generateToken = (id: string) => {
  const secret = process.env.JWT_SECRET || 'seu_segredo_super_secreto_padrao';
  return jwt.sign({ id }, secret, {
    expiresIn: '1d',
  });
};

export const registerUser = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'Este e-mail já está em uso.' });
    }
    const user = new User({ name, email, password });
    await user.save();
    const userResponse = user.toObject();
    delete userResponse.password;
    res.status(201).json({
      ...userResponse,
      token: generateToken(user._id.toString()),
    });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao registrar usuário', error });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'E-mail ou senha inválidos.' });
    }
    const userResponse = user.toObject();
    delete userResponse.password;
    res.status(200).json({
      ...userResponse,
      token: generateToken(user._id.toString()),
    });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao fazer login', error });
  }
};