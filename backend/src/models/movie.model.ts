import { Schema, model, Types } from 'mongoose';
import { IReview } from './review.model';

export interface IMovie extends Document {
  title: string;
  year: number;
  orderInSaga: number;
  saga: Types.ObjectId;
  reviews: IReview[];
}

const movieSchema = new Schema<IMovie>({
  title: { type: String, required: true, trim: true },
  year: { type: Number, required: true },
  orderInSaga: { type: Number, required: true },
  reviews: [{ type: Schema.Types.ObjectId, ref: 'Review' }],
});

export const Movie = model<IMovie>('Movie', movieSchema);