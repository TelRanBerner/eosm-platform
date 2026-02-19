import mongoose from 'mongoose';

const IncidentSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    priority: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        default: 'OPEN',
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
}, {
    timestamps: true,
});

// ВАЖНО: Мы используем именованный экспорт (export const),
// чтобы в роутах работал импорт { IncidentModel }
export const IncidentModel = mongoose.model('Incident', IncidentSchema);