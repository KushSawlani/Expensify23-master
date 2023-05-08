const GroupModel = require("../models/group.model");
const UserModel = require("../models/user.model");
const { sendPushNotification } = require("../utilities/PushNotification");

const router = require("express").Router();

// # create group
router.post("/add", async (req, res) => {
  // Extract the name and members from the request body
  const { name, members } = req.body;

  // Create a new group using the GroupModel and the name and members
  const newGroup = new GroupModel({
    name,
    members,
  });

  // Save the new group to the database
  const createdGrp = await newGroup.save();

  // Add the group id to all users in the group
  const grpId = createdGrp._id;
  const grpMembers = createdGrp.members;

  // Loop through all the members of the group and add the group id to their list of groups
  await grpMembers.forEach(async (grpMemId) => {
    await UserModel.findOneAndUpdate(
      { _id: grpMemId },
      { $push: { groups: grpId } } // Add the group id to the user's list of groups
    );
  });

  // Return a success response with the created group data
  return res.json({
    success: true,
    data: createdGrp,
    msg: "Group Created Successfully",
  });
});

// # get group details and members
router.get("/:grpId", async (req, res) => {
  const { grpId } = req.params;

  // Check if group ID is provided
  if (!grpId) {
    return res.json({ success: false, msg: "Group ID cannot be empty!" });
  }

  // Find group by ID
  const grp = await GroupModel.findOne({ _id: grpId });

  // Return response with group details
  return res.json({ success: true, data: grp });
});

// Add members to group
router.post("/:grpId/members/add", async (req, res) => {
  const { grpId } = req.params;

  // Check if group ID is provided
  if (!grpId) {
    return res.json({ success: false, msg: "Group id cannot be empty!" });
  }

  const { members } = req.body;

  // Update the group with new members
  const updatedGrp = await GroupModel.findOneAndUpdate(
    { _id: grpId },
    { $set: { members: members } },
    { new: true }
  );

  // Add the group ID to each member's list of groups
  members?.forEach(async (memberId) => {
    await UserModel.findOneAndUpdate(
      {
        _id: memberId,
      },
      {
        $push: {
          groups: grpId,
        },
      }
    );
  });

  return res.json({
    success: true,
    data: updatedGrp,
  });
});

// # remove member
router.put("/:grpId/members/remove", async (req, res) => {
  const { grpId } = req.params;
  if (!grpId) {
    return res.json({ success: false, msg: "Group id  cannot be  empty!" });
  }
  const { members } = req.body;

  // Update group's member list by removing the given members
  const updatedGrp = await GroupModel.findOneAndUpdate(
    { _id: grpId },
    { $pullAll: { members: members } },
    { new: true }
  );

  // Remove the group id from the groups list of each member being removed
  members?.forEach(async (memberId) => {
    await UserModel.findOneAndUpdate(
      {
        _id: memberId,
      },
      {
        $pull: {
          groups: grpId,
        },
      }
    );
  });

  // Return the updated group with success status
  return res.json({
    success: true,
    data: updatedGrp,
  });
});

// DELETE group by ID
router.delete("/deleteGrp/:grpId", async (req, res) => {
  const { grpId } = req.params;

  // If group ID is missing, return an error
  if (!grpId) {
    return res.json({ success: false, msg: "Group ID cannot be empty!" });
  }

  // Find and delete the group
  const grp = await GroupModel.findByIdAndDelete(grpId);

  // Return success response with deleted group data
  res.json({ success: true, grp });
});

// # add transaction
router.post("/:grpId/tx/add", async (req, res) => {
  const { grpId } = req.params;
  if (!grpId) {
    return res.json({ success: false, msg: "Group id  cannot be  empty!" });
  }

  // Extract transaction data from request body
  const { paidBy, amount, category, description, lent, withUsers, txDate } =
    req.body;

  // Update group with new transaction using $push operator
  const data = await GroupModel.findOneAndUpdate(
    { _id: grpId },
    {
      $push: {
        txs: {
          paidBy,
          amount,
          category,
          description,
          lent,
          withUsers,
          txDate,
        },
      },
    },
    { new: true }
  );

  // Find group and paidBy user to send push notifications to withUsers
  const grp = await GroupModel.findById(grpId);
  const paidByUser = await UserModel.findById(paidBy);

  // Loop through withUsers array and send push notification to each user with expoPushToken
  withUsers?.map(async (wu) => {
    const user = await UserModel.findById(wu.userId);
    const { expoPushToken } = user;

    if (expoPushToken !== undefined) {
      sendPushNotification(
        expoPushToken,
        "New Expense of " +
          description +
          " from " +
          paidByUser.name +
          "in " +
          grp.name
      );
    }
  });

  // Return success response with updated group data
  return res.json({
    success: true,
    data: data,
  });
});

// # remove transaction
router.put("/:grpId/tx/:txId/remove", async (req, res) => {
  const { grpId, txId } = req.params;

  // Check if group id and transaction id are provided
  if (!grpId)
    return res.json({ success: false, msg: "Group id cannot  be empty" });
  if (!txId) return res.json({ success: false, msg: "Tx id cannot  be empty" });

  // Find the group with the provided id and remove the transaction with the provided id
  await GroupModel.findOneAndUpdate(
    { _id: grpId, "txs._id": txId },
    {
      $pull: { txs: { _id: txId } },
    },
    { new: true }
  )
    .then((result) =>
      res.json({
        success: true,
        data: result,
      })
    )
    .catch((err) => console.log(err));
});

// # edit the transaction
router.put("/:grpId/tx/:txId/update", async (req, res) => {
  const { grpId, txId } = req.params;
  const { paidBy, amount, category, description, lent, withUsers, txDate } =
    req.body;

  // Check if the group ID is present in the request params
  if (!grpId)
    return res.json({ success: false, msg: "Group Id cannot  be  empty!" });

  try {
    // Find the group by ID and transaction by transaction ID and update it with new transaction data
    const data = await GroupModel.findOneAndUpdate(
      { _id: grpId, "txs._id": txId },
      {
        $set: {
          "txs.$.paidBy": paidBy,
          "txs.$.amount": amount,
          "txs.$.category": category,
          "txs.$.description": description,
          "txs.$.lent": lent,
          "txs.$.withUsers": withUsers,
          "txs.$.txDate": txDate,
        },
      },
      { new: true }
    );

    return res.json({ success: true, data });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, msg: "Unable to update transaction!" });
  }
});

// get group transactions
router.get("/:grpId/txs", (req, res) => {
  const { grpId } = req.params;

  if (!grpId)
    return res.json({ success: false, msg: "Group Id cannot be empty!" });

  GroupModel.findOne({ _id: grpId })
    .select("txs") // select only the "txs" field from the document
    .then((result) => {
      return res.json({ success: true, data: result });
    })
    .catch((err) => {
      console.log(err);
    });
});

// # get all groups for respective user
router.get("/get/all/:userId", async (req, res) => {
  const user = await UserModel.findById(req.params.userId);
  const groupIds = user?.groups;
  const groups = await GroupModel.find({ _id: { $in: groupIds } });
  res.send(groups);
});

// Settle expenses
router.put("/settle/:groupId", async (req, res) => {
  // Extract groupId, userId, and amount from request
  const { groupId } = req.params;
  const { userId, amount } = req.body;

  try {
    // Find the group by groupId
    const group = await GroupModel.findById(groupId); // Return 404 error if group not found
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    // Find the transaction in the group that is not paid by the user and not yet settled by the user
    const userIndex = group.txs.findIndex(
      (tx) => tx.paidBy.toString() !== userId && !tx.settledBy.includes(userId)
    );

    // Return 404 error if transaction not found
    if (userIndex === -1) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    // Get the transaction and calculate the total amount that the user owes
    const tx = group.txs[userIndex];
    const totalOwes = tx.withUsers.reduce((acc, user) => {
      if (user.userId.toString() === userId) {
        return acc + user.owe;
      }
      return acc;
    }, 0);

    // Return 400 error if amount is greater than the total amount that the user owes
    if (amount > totalOwes) {
      return res.status(400).json({ message: "Invalid amount" });
    }

    // Add the user to the list of settled users in the transaction
    tx.settledBy.push(userId);

    // Update the amount that the user owes in the transaction
    tx.withUsers.forEach((user) => {
      if (user.userId.toString() === userId) {
        user.owe = totalOwes - amount;
      } else {
        user.owe = user.owe - (amount / totalOwes) * user.owe;
      }
    });

    // Save the group and return success message
    await group.save();
    return res.json({ success: true, message: "Expense settled successfully" });
  } catch (err) {
    // Return 500 error if there is an internal server error
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

//  returns the amount that a user has to give to each user in a group
router.get("/exp/:userId/:groupId", async (req, res) => {
  const { userId, groupId } = req.params;
  try {
    // Find the user by userId
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // Find the group by groupId
    const group = await GroupModel.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    // Filter the group transactions that haven't been settled by the user
    const expenses = group.txs.filter(
      (tx) => tx.paidBy.toString() !== userId && !tx.settledBy.includes(userId)
    );

    // Generate a summary of what each member owes or is owed by the user
    const summary = {};
    expenses.forEach((expense) => {
      expense.withUsers.forEach((user) => {
        if (user.userId.toString() === userId) {
          summary[expense.paidBy.toString()] =
            (summary[expense.paidBy.toString()] || 0) + user.owe;
        } else if (user.userId.toString() !== expense.paidBy.toString()) {
          summary[user.userId.toString()] =
            (summary[user.userId.toString()] || 0) - user.owe;
        }
      });
    });

    // Generate the response with user information and amount owed
    const response = await Promise.all(
      Object.keys(summary).map(async (key) => {
        const user = await UserModel.findById(key).select("name upiId");
        return {
          userId: key,
          name: user.name,
          owes: summary[key],
          upiId: user.upiId,
        };
      })
    );

    // The owes field in the response shows how much money you are owed by each group member
    return res.json(response);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
