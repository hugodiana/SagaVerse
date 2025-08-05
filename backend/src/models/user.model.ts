import { Schema, model } from 'mongoose';
import bcrypt from 'bcryptjs';

// Interface para definir a estrutura do nosso documento de usuário
export interface IUser extends Document {
  name: string;
  email: string;
  password?: string; // A senha é opcional no retorno do objeto
  role: 'user' | 'admin';
  comparePassword(password: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, select: false }, // 'select: false' impede que a senha seja retornada em queries
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
}, { timestamps: true });

// Middleware (hook) que é executado ANTES de salvar um usuário
// Usamos para criptografar a senha
userSchema.pre('save', async function (next) {
  // 'this' se refere ao documento do usuário que está sendo salvo
  if (!this.isModified('password')) {
    return next();
  }
  if (this.password) {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

// Método para comparar a senha enviada no login com a senha criptografada no banco
userSchema.methods.comparePassword = function (password: string): Promise<boolean> {
  return bcrypt.compare(password, this.password);
};

export const User = model<IUser>('User', userSchema);