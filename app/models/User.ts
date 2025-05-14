import mongoose, { Schema, model, models, Document } from 'mongoose'

export interface UserDocument extends Document {
  name: string
  email: string
  image?: string
  role: 'user' | 'admin'
  createdAt: Date
  updatedAt: Date
}

const userSchema = new Schema<UserDocument>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  image: String,
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
}, {
  timestamps: true
})

const User = mongoose.models.User || mongoose.model<UserDocument>('User', userSchema)
export default User 