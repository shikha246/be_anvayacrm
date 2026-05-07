import mongoose from "mongoose";

// Lead Schema
const leadSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Lead name is required'],
  },
  source: {
    type: String,
    required: [true, 'Lead source is required'],
    enum: ['Website', 'Referral', 'Cold Call', 'Advertisement', 'Email', 'Other'],  // Predefined lead sources
  },
  salesAgent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SalesAgent',  // Reference to SalesAgent model
    required: [true, 'Sales Agent is required'],
  },
  status: {
    type: String,
    required: true,
    enum: ['new', 'contacted', 'qualified', 'proposalSent', 'closed'],  // Predefined lead statuses
    default: 'new',
  },
  tags: {
    type: [String],  // Array of strings for tags (e.g., High Value, Follow-up)
  },
  comments: [
  {
    text: {
      type: String,
      required: true,
    },

    author: {
      type: String,
      default: "Admin",
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
],
  timeToClose: {
    type: Number,
    required: [true, 'Time to Close is required'],
    min: [1, 'Time to Close must be a positive number'],  // Positive integer validation
  },
 priority: {
  type: Number,
  enum: [1, 2, 3]
},
 
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  closedAt: {
    type: Date,  // The date when the lead was closed (optional, used when status is "Closed")
  },
},
{
    timestamps: true, // ✅ AUTO creates createdAt & updatedAt
  });

// Middleware to update the `updatedAt` field on each save
// leadSchema.pre('save', function () {
//   this.updatedAt = Date.now();
// });

// module.exports = mongoose.model('Lead', leadSchema);
export default mongoose.model("Lead", leadSchema);