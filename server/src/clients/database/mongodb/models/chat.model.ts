import mongoose from 'mongoose';

const chatSchema = new mongoose.Schema({
  client: { type: String, required: true },
  assistant: { type: String, required: true },
  time: { type: Date, default: Date.now },
});

export const ChatModel = mongoose.model('Chat', chatSchema);
