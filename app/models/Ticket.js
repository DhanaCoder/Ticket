import mongoose, { Schema } from "mongoose";

mongoose.connect(process.env.MONGODB_URI);
mongoose.Promise = global.Promise;

const ticketSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    priority: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    progress: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    status: {
      type: String,
      enum: ["not started", "started", "done"],
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    assignedTo: {
      type: [String],
      required: false,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

ticketSchema.pre("save", function (next) {
  if (!this.isNew && this.isModified("email")) {
    this.invalidate(
      "email",
      "Email cannot be modified once the ticket is created."
    );
  }
  next();
});

const Ticket = mongoose.models.Ticket || mongoose.model("Ticket", ticketSchema);

export default Ticket;
