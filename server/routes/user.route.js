const UserModel = require("../models/user.model");
const moment = require("moment");
const router = require("express").Router();

// insert user
router.post("/add", async (req, res) => {
  const { phoneNumber } = req.body;

  let user = await UserModel.findOne({ phoneNumber: phoneNumber });

  if (user) {
    return res.json({
      success: true,
      message: "User already created!",
      userId: user._id,
    });
  }

  const newUser = new UserModel({
    phoneNumber,
  });

  newUser
    .save()
    .then((result) => {
      return res.json({
        success: true,
        userId: result._id,
        msg: "User registered successfully",
      });
    })
    .catch((err) => {
      return res.json({ success: false, err });
    });
});

// update name & upi id
router.put("/update", async (req, res) => {
  const { id, name, upiId } = req.body;
  const user = await UserModel.findById(id);

  if (!user) return res.status(401).json({ error: "User not found!" });

  user.name = name;
  user.upiId = upiId;

  await user.save();

  return res.json({ success: true, name: user.name, upiId: user.upiId });
});

// add expo token
router.put("/expoPushTokens", async (req, res) => {
  const { token, id } = req.body;
  const user = await UserModel.findById(id);

  if (!user) return res.status(401).json({ error: "User not found!" });

  user.expoPushToken = token;

  await user.save();

  return res.json({
    success: true,
    msg: "Users ExpoToken Added successfully!",
  });
});

// update budget only
router.put("/updateBudget/:id", async (req, res) => {
  const { id } = req.params;
  const { budget } = req.body;

  if (!id) return res.status(401).json({ error: "Invalid Request" });

  const user = await UserModel.findById(id);

  if (!user) return res.status(401).json({ error: "User not found!" });

  user.budget = budget;

  await user.save();

  res.json({
    id: user._id,
    budget,
  });
});

// get name and upi id if available
router.get("/getUserInfo/:id", async (req, res) => {
  const { id } = req.params;
  if (!id) return res.status(401).json({ error: "Invalid Request" });

  const user = await UserModel.findById(id);

  res.json({
    success: true,
    name: user.name,
    upiId: user.upiId,
  });
});

// get budget only
router.get("/getBudget/:id", async (req, res) => {
  const { id } = req.params;
  if (!id) return res.status(401).json({ error: "Invalid Request" });

  const user = await UserModel.findById(id);

  res.json({
    budget: user.budget,
  });
});

// add transaction
router.put("/tx/add", async (req, res) => {
  const { amount, category, description, withUser, id, owe, lent, txDate } =
    req.body;
  const txAdder = await UserModel.findOneAndUpdate(
    { _id: id },
    {
      $push: {
        personalTxs: {
          amount,
          category,
          description,
          owe,
          lent,
          withUser,
          txDate,
        },
      },
    },
    { new: true }
  );

  // const txOppoUser = await UserModel.findOneAndUpdate(
  // 	{ _id: withUser },
  // 	{
  // 		$push: {
  // 			personalTxs: {
  // 				amount,
  // 				category,
  // 				description,
  // 				owe: lent,
  // 				lent: owe,
  // 				withUser: id,
  // 			},
  // 		},
  // 	},
  // 	{ new: true }
  // );
  return res.json({ success: true, data: txAdder });
  // return res.json({ success: false, err });
});

// update transaction
router.put("/tx/update/:txId", async (req, res) => {
  const { amount, category, description, withUser, id, owe, lent, txDate } =
    req.body;

  const { txId } = req.params;

  const txUpdater = await UserModel.findOneAndUpdate(
    { _id: id, "personalTxs._id": txId },
    {
      "personalTxs.$": {
        amount,
        category,
        description,
        owe,
        lent,
        withUser,
        txDate,
      },
    },
    { new: true }
  );

  return res.json({ success: true, data: txUpdater });
});

// delete transaction
router.put("/tx/delete", async (req, res) => {
  const { id, txId } = req.body;

  UserModel.findOneAndUpdate(
    { _id: id, "personalTxs._id": txId },

    {
      $pull: { personalTxs: { _id: txId } },
    },
    { new: true }
  )
    .then((result) => {
      return res.json({ success: true });
    })
    .catch((err) => {
      return res.json({ success: false, err });
    });
});

// get transaction with txId
router.get("/tx/get/:id/:txId", async (req, res) => {
  const { id, txId } = req.params;
  UserModel.findOne(
    {
      _id: id,
    },
    { personalTxs: { $elemMatch: { _id: txId } } }
  )
    .then((result) => {
      return res.json({ success: true, data: result });
    })
    .catch((err) => {
      return res.json({ success: false, err });
    });
});

// fetch all the trasactions of user with user id

router.get("/:id", (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.json({ success: false, data: "Please provide user  id  " });
  }

  UserModel.findOne({ _id: id })
    .then((result) => {
      return res.json({ success: true, data: result });
    })
    .catch((err) => {
      return res.json({ success: false, err });
    });
});

router.get("/txs/:id", (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.json({ success: false, data: "Please provide user  id  " });
  }

  UserModel.findOne({ _id: id })
    .then((result) => {
      return res.json({ success: true, data: result.personalTxs });
    })
    .catch((err) => {
      return res.json({ success: false, err });
    });
});

router.put("/clear-txs/:id", async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.json({ success: false, message: "Please provide user  id  " });
  }

  const user = await UserModel.findById(id);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  user.personalTxs = []; // Clear the personaltx array

  await user.save();
  return res.json({
    success: true,
    message: "Transactions cleared successfully",
  });
});

router.get("/fetchLatestTransactions/:id", async (req, res) => {
  const { id } = req.params;

  if (!id) return res.status(401).json({ error: "Invalid Request" });

  const user = await UserModel.find({ _id: id });

  res.json({
    transactions: user[0].personalTxs.reverse().slice(0, 5),
  });
});

// fetch all user transactions for the current month
router.get("/fetchCurrentMonthTransactions/:id", async (req, res) => {
  const { id } = req.params;

  // check if id is provided
  if (!id) return res.status(401).json({ error: "Invalid Request" });

  // find user by id
  const user = await UserModel.findById(id);

  // get current month in MM format
  let currMonth = moment(Date.now()).format("MM");

  let tx = new Array();

  // filter transactions for current month
  user.personalTxs.map((item) => {
    if (
      item.txDate !== undefined &&
      moment(item?.txDate).format("MM") === currMonth
    ) {
      tx.push(item);
    }
  });
  res.json(tx);
});

// endpoint to fetch transactions for today by user id
router.post("/fetchTodaysTransactions/:id", async (req, res) => {
  const { id } = req.params;
  const { date } = req.body;

  // check if user id is provided in params
  if (!id) return res.status(401).json({ error: "Invalid Request" });

  // find user by id
  const user = await UserModel.findById(id);

  // get current month and date
  let currMonth = moment(date).format("MM");
  let currDate = moment(date).format("DD");

  // array to hold transactions for today
  let tx = new Array();

  // loop through user transactions and filter transactions for today
  user.personalTxs.map((item) => {
    if (
      item.txDate !== undefined &&
      moment(item?.txDate).format("MM") === currMonth &&
      moment(item?.txDate).format("DD") === currDate
    ) {
      tx.push(item);
    }
  });

  // return transactions for today
  res.json(tx);
});

// Get user's transactions along with categories
router.get("/:id/cat", (req, res) => {
  // Extract user id and category from request parameters and query string
  const { id } = req.params;
  const { category } = req.query;

  // Check if user id and category are present in the request
  if (!id) return res.json({ msg: "User id is required" });
  if (!category) return res.json({ msg: "Category is required" });

  // Find user with given id and category in personal transactions
  UserModel.findOne({ _id: id, "personalTxs.category": category })
    .select("personalTxs")
    .then((result) => {
      // If user and category are found, filter the transactions by category
      if (result) {
        let filteredResult = result.personalTxs.filter(
          (item) => item.category === category
        );
        // Return the filtered transactions
        return res.json({
          success: true,
          data: filteredResult || [],
        });
      } else {
        // If no transactions found for the given category, return empty array
        return res.json({ success: true, data: [] });
      }
    })
    .catch((err) => {
      console.log(err);
      // Handle any errors that occur
      return res.json({ success: false, err });
    });
});

// get users transaction for all categories
router.get("/:userId/catwise", async (req, res) => {
  const { userId } = req.params;

  // If userId is not present in request parameter then return error
  if (!userId) {
    return res.status(401).json({ error: "Invalid Request" });
  }

  // Find user from UserModel using userId
  const user = await UserModel.findById(userId);

  // If user is not found, return error
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // Create a new Map object to store data for each category
  const categoryMap = new Map();

  // Iterate through each transaction of the user and add data to the categoryMap
  user.personalTxs.forEach((item) => {
    if (item?.category !== undefined) {
      // If category is not already present in categoryMap, add it
      if (!categoryMap.has(item?.category)) {
        categoryMap.set(item?.category, { expense: 0, total: 0 });
      }
      // Increment the expense count for the category
      categoryMap.get(item?.category).expense++;
      // If amount is present, add it to the total for the category
      if (item?.amount !== undefined) {
        categoryMap.get(item?.category).total += parseInt(item?.amount);
      }
    }
  });

  // Convert the categoryMap to an array of objects
  const finalObj = Array.from(categoryMap, ([category, data]) => {
    return {
      category,
      expense: data.expense,
      total: data.total,
    };
  });

  // Send the final array of objects as response
  res.json(finalObj);
});

//  fetch  all users
router.get("/get/all", async (req, res) => {
  const users = await UserModel.find({});
  let data = new Array();
  users.map((item) => {
    data.push({ id: item._id, name: item.name, phoneNumber: item.phoneNumber });
  });
  return res.json({ data });
});

// fetch user by name
router.get("/get/userByName", async (req, res) => {
  const { name } = req.query;
  const users = await UserModel.find({ name: { $regex: `${name}` } });
  return res.json(users);
});

module.exports = router;
