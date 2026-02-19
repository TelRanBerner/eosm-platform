import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    avatarUrl: String,
  
    role: {
        type: String,
        enum: ['user', 'support', 'engineer', 'admin'],
        default: 'user',
    },
}, { timestamps: true });

export default mongoose.model('User', UserSchema);