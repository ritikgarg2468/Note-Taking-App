import { Schema, model, Document } from 'mongoose';

export interface INote extends Document {
  user: Schema.Types.ObjectId;
  title: string;
  content: string;
}

const noteSchema = new Schema<INote>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true, trim: true },
  content: { type: String, required: true, trim: true },
}, { timestamps: true });

export default model<INote>('Note', noteSchema);