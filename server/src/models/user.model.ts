import { Schema, model, Document } from 'mongoose';

export interface IUser extends Document {
  googleId?: string;
  email: string;
  name: string;
  dob: Date;
}

const userSchema = new Schema<IUser>({
  googleId: { type: String, unique: true, sparse: true },
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  dob: { type: Date, required: true },
}, { timestamps: true });

export default model<IUser>('User', userSchema);