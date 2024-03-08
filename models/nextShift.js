import mongoose from "mongoose";

const NextSchema = new mongoose.Schema({
   next_at: { type: String, required: true },
   next_etc: { type: String, required: true }
})

export default mongoose.model('nextRoute', NextSchema)