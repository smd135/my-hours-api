import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    avatarUrl: String,
    routes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Route",
      },
    ],
    nextShifts: [
      {
        type: mongoose.Schema.Types.ObjectId, ref: "nextRoute"
      }
    ]
  },
  { timestamps: true },
);
export default mongoose.model("User", UserSchema);
