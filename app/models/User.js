import mongoose from "mongoose";
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    department: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

let User;

try {
  // Trying to retrieve the existing model first
  User = mongoose.model("User");
} catch {
  // If the model doesn't exist, create it
  User = mongoose.model("User", userSchema);
}

export default User;
