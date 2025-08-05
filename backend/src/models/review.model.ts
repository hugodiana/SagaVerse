import { Schema, model, Types } from 'mongoose';

export interface IReview extends Document {
  rating: number;
  comment?: string;
  friend: Types.ObjectId;
  movie: Types.ObjectId;
}

const reviewSchema = new Schema<IReview>({
  rating: { type: Number, required: true, min: 0, max: 10 },
  comment: { type: String, trim: true },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  movie: { type: Schema.Types.ObjectId, ref: 'Movie', required: true },
}, { timestamps: true });

export const Review = model<IReview>('Review', reviewSchema);