import { Schema, model, Types } from 'mongoose';
import { IMovie } from './movie.model';

export interface ISaga extends Document {
  title: string;
  genre: string;
  imageUrl?: string;
  movies: IMovie[];
  tmdbId: number;
}

const sagaSchema = new Schema<ISaga>({
  title: { type: String, required: true, unique: true, trim: true },
  genre: { type: String, required: true, trim: true },
  imageUrl: { type: String },
  movies: [{ type: Schema.Types.ObjectId, ref: 'Movie' }],
  tmdbId: { type: Number, required: true },
});

export const Saga = model<ISaga>('Saga', sagaSchema);