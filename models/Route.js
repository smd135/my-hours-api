import mongoose from 'mongoose';

const RouteSchema = new mongoose.Schema(
	{
		route_num: { type: Number, required: true },
		start_at: { type: String, required: true },
		end_at: { type: String, required: true },
		diff: { type: Number },
		engine_type: { type: String, required: true },
		engine_num: { type: Number, required: true },
		train_num: { type: Number },
		author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', },
		route_etc: { type: String },
	},
	{ timestamps: true }
);
export default mongoose.model("Route", RouteSchema);
