import { Schema, model, Types } from 'mongoose';

export interface IReview extends Document {
  rating: number;
  comment?: string;
  user: Types.ObjectId;
  movie: Types.ObjectId;
}

// 1. PRIMEIRO, o schema é criado e definido na variável 'reviewSchema'.
const reviewSchema = new Schema<IReview>({
  rating: { type: Number, required: true, min: 0, max: 10 },
  comment: { type: String, trim: true },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  movie: { type: Schema.Types.ObjectId, ref: 'Movie', required: true },
}, { timestamps: true });

// 2. DEPOIS, nós usamos a variável 'reviewSchema' que acabamos de criar para adicionar o índice.
reviewSchema.index({ movie: 1, user: 1 }, { unique: true });

// 3. Finalmente, exportamos o modelo.
export const Review = model<IReview>('Review', reviewSchema);