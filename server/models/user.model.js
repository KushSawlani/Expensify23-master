const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
  name: { type: String },
  phoneNumber: { type: String, unique: true },
  budget: { type: Number },
  upiId: { type: String },
  expoPushToken: { type: String },
  personalTxs: {
    type: [
      mongoose.Schema({
        amount: Number,
        category: String,
        description: String,
        owe: { type: Number, default: 0 },
        lent: { type: Number, default: 0 },
        withUser: mongoose.Types.ObjectId,
        txDate: { type: String },
      }),
    ],
  },
  groups: [mongoose.Types.ObjectId],
});

const UserModel = mongoose.model("users", UserSchema);

module.exports = UserModel;
