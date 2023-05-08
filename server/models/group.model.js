const mongoose = require("mongoose");

const GroupSchema = mongoose.Schema({
  name: { type: String },
  members: [mongoose.Types.ObjectId],
  txs: {
    type: [
      mongoose.Schema({
        paidBy: mongoose.Types.ObjectId,
        settledBy: [mongoose.Types.ObjectId],
        amount: Number,
        category: String,
        description: String,
        lent: { type: Number, default: 0 },
        withUsers: [
          mongoose.Schema({
            userId: mongoose.Types.ObjectId,
            owe: { type: Number, default: 0 },
          }),
        ],
        txDate: { type: Date, default: new Date() },
      }),
    ],
  },
});

const GroupModel = mongoose.model("groups", GroupSchema);

module.exports = GroupModel;
