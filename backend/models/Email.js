import mongoose from "mongoose";

const emailSchema = new mongoose.Schema({
  sender: { type: String, required: true },
  recipients: { type: [String], required: true },
  subject: { type: String, required: true },
  body: { type: String, required: true },
  sentAt: { type: Date, default: Date.now },
  archived: { type: Boolean, default: false },
});

const Email = mongoose.model("Email", emailSchema);

export default Email;
