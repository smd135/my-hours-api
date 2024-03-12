import mongoose from "mongoose";
import bcrypt from 'bcrypt'


const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
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
UserSchema.methods.matchPassword = async function (enteredpassword) {
  return await bcrypt.compare(enteredpassword, this.password)
},
  UserSchema.pre('save', async function (next) {
    if (!this.isModified('passwrd')) {
      next()
    }
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
  })

export default mongoose.model("User", UserSchema);
