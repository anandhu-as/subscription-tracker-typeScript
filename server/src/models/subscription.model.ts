import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "subscriptionName is required"],
      trim: true,
      minLength: 2,
      maxLength: 100,
    },
    price: {
      type: Number,
      required: [true, "price is required"],
      minLength: [0, "price must be greater than 0"],
    },
    currency: {
      type: String,
      enum: ["INR", "EUR", "USD"],
      default: "INR",
    },
    frequency: {
      type: String,
      enum: ["daily", "weekly", "monthly", "yearly"],
    },
    category: {
      type: String,
      required: true,
      enum: ["sports", "news", "lifestyle", "entertainment", "technology"],
    },
    paymentMethod: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["active", "cancelled", "expired"],
      default: "active",
    },
    startDate: {
      type: Date,
      required: true,
      validate: {
        validator: (value: Date) => value <= new Date(),
        message: "Start date must be in the past",
      },
    },
    renewalDate: {
      type: Date,
      validate: {
        validator: function (this: any, value: Date) {
          return value >= this.startDate;
        },
        message: "Renewal date must be after the start date",
      },
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
  },
  { timestamps: true },
);
//fn to autoCalculate renewal date
subscriptionSchema.pre("save", function () {
  if (!this.renewalDate) {
    const renewalPeriods = {
      daily: 1,
      weekly: 7,
      monthly: 30,
      yearly: 365,
    };

    this.renewalDate = new Date(this.startDate);

    this.renewalDate.setDate(
      this.renewalDate.getDate() + renewalPeriods[this.frequency!],
    );
  }

  this.status = this.renewalDate < new Date() ? "expired" : "active";
});
//start date-05-06-2026
//renewalDate=05-06-2026
//renewalPeriod=monthly 30
//05-06-2026 + 30 = 35 = 05-07-2026
export default subscriptionSchema;
