import mongoose from 'mongoose';

const RouteSchema = new mongoose.Schema(
	{
		route_num: { type: Number, default: '' },
		start_at: { type: String, required: true },
		end_at: { type: String },
		diff: { type: Number },
		engine_type: { type: String, required: true },
		engine_num: { type: String, default: '' },
		train_num: { type: String, default: '' },
		author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', },
		route_etc: { type: String, default: '' },
	},
	{ timestamps: true }
);



export default mongoose.model("Route", RouteSchema);
