const mongoose = require("mongoose");
const User = require("../../models/user/userSchema");

exports.getWithdrawal = async (req, res) => {
  try {
    const withdrawalID = req.query.id;

    if (withdrawalID) {
      if (!mongoose.Types.ObjectId.isValid(withdrawalID)) {
        return res.status(400).json({ message: "Invalid withdrawal ID" });
      }

      const user = await User.findOne(
        {
          _id: req.user.id,
          "headers.withdrawal._id": withdrawalID,
        },
        { "headers.withdrawal.$": 1 } // Project only the matched withdrawal
      ).lean();

      if (!user || !user.headers.withdrawal.length) {
        return res.status(404).json({ message: "Withdrawal not found" });
      }

      return res.status(200).json({
        count: 1,
        withdrawals: user.headers.withdrawal,
      });
    } else {
      const user = await User.findById(req.user.id)
        .select("headers.withdrawal")
        .lean();

      const withdrawals = (user?.headers?.withdrawal || [])?.sort(
        (a, b) => b.created - a.created
      );

      return res.status(200).json({
        count: withdrawals.length,
        withdrawals,
      });
    }
  } catch (err) {
    console.error("Error in getWithdrawal:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.initiateWithdrawal = async (req, res) => {
  try {
    const { amount, description } = req.body;

    if (!amount || isNaN(amount)) {
      return res.status(400).json({ message: "Invalid withdrawal amount" });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (amount == 0) {
      return res
        .status(400)
        .json({ message: "Amount should be greater than 0." });
    }

    if (user.headers.balance < amount) {
      return res.status(400).json({ message: "Insufficient balance" });
    }

    const newWithdrawal = {
      amount,
      description: description || "",
      status: "pending",
      created: new Date(),
      updated: new Date(),
    };

    user.headers.withdrawal.push(newWithdrawal);
    await user.save();

    return res.status(201).json({
      message: "Withdrawal initiated successfully",
      withdrawal: user.headers.withdrawal.slice(-1)[0],
    });
  } catch (error) {
    console.error("Error initiating withdrawal:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.approveWithdrawal = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid withdrawal ID" });
    }

    if (status !== "success" && status !== "failure") {
      return res.status(400).json({
        message: "Invalid status. It can either be success or failure",
      });
    }

    // Step 1: Get user first
    const user = await User.findById(req.user.id).lean();
    if (!user) return res.status(404).json({ message: "User not found" });

    const withdrawal = user.headers.withdrawal.find(
      (w) => w._id.toString() === id
    );

    if (!withdrawal)
      return res.status(404).json({ message: "Withdrawal not found" });

    if (withdrawal.status != "pending") {
      return res
        .status(400)
        .json({ message: "Withdrawal already approved/failed", withdrawal });
    }
    const amount = withdrawal.amount;
    const currentBalance = user.headers.balance;

    // Step 2: Calculate new balance
    let newBalance = currentBalance;
    if (status === "success") {
      newBalance -= amount;
    }

    // Step 3: Update document
    const updatedUser = await User.findOneAndUpdate(
      {
        _id: req.user.id,
        "headers.withdrawal._id": id,
      },
      {
        $set: {
          "headers.withdrawal.$.status": status,
          "headers.withdrawal.$.updated": new Date(),
          "headers.balance": newBalance,
        },
      },
      { new: true }
    ).lean();

    if (!updatedUser || !updatedUser.headers.withdrawal.length) {
      return res.status(404).json({ message: "Withdrawal not found" });
    }

    return res.status(200).json({
      message: "Withdrawal status updated successfully",
      headers: {
        withdrawal: updatedUser.headers.withdrawal.filter(
          (e) => e._id.toString() === id
        ),
        balance: updatedUser.headers.balance,
      },
    });
  } catch (error) {
    console.error("Error approving withdrawal:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
