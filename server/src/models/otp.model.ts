import { Schema, model, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IOtp extends Document {
  email: string;
  otp: string;
  createdAt: Date;
}

const otpSchema = new Schema<IOtp>({
  email: { type: String, required: true },
  otp: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: '5m' }, // OTP expires in 5 minutes
});

// Hash the OTP before saving
otpSchema.pre<IOtp>('save', async function (next) {
  if (!this.isModified('otp')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.otp = await bcrypt.hash(this.otp, salt);
  next();
});

export default model<IOtp>('Otp', otpSchema);