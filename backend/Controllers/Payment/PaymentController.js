const {
  handleMulterErrors,
} = require("../../middlewares/multers/avatarMulter");
const { paymentMulter } = require("../../middlewares/multers/paymentMulter");
const { checkDigit } = require("../../utils/CommonFunctions");
const { requiredFields } = require("../../utils/requiredFields");
const PaymentSchema = require("../../models/paymentSchema");
const { default: mongoose } = require("mongoose");

exports.createPayment = [
  paymentMulter.single("image"),
  handleMulterErrors,
  async (req, res) => {
    try {
      if (
        !requiredFields(req, res, [
          "title",
          "description",
          "amount",
          "customer",
        ])
      ) {
        return;
      }

      if (!req.file) {
        return res.status(400).json({ message: "Please upload a file" });
      }

      if (!checkDigit({ number: req.body.amount, decimalAllowed: true })) {
        return res.status(400).json({ message: "Please enter a valid amount" });
      }

      let { status } = req.body;

      if (status && status !== "0" && status !== "1") {
        return res.status(400).json({
          message:
            "Please enter a valid status, either 0 for unpaid or 1 for paid",
        });
      }

      const payment = new PaymentSchema({
        ...req.body,
        amount: Number(req.body.amount),
        status: Number(status) || 0,
        image: req?.file?.path,
      });
      await payment.save();
      res.json({
        message: "payment created",
        payment,
      });
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
  },
];

exports.getPayment = async (req, res) => {
  try {
    let id = req.query.id;
    let payment;
    if (id) {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid ID" });
      }
      payment = await PaymentSchema.findById(id);
    } else {
      payment = await PaymentSchema.find();
    }

    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    res.json({
      count: Array.isArray(payment) ? payment.length : 1,
      payment: Array.isArray(payment) ? payment : [payment],
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

exports.updatePayment = async (req, res) => {
  try {
    let id = req.body.id;
    let payment;

    if (!id) {
      return res.status(400).json({ message: "Please provide an ID" });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ID" });
    }
    payment = await PaymentSchema.findById(id);

    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    const { status, name, email, phone } = req.body;

    if (!requiredFields(req, res, ["status", "name", "email", "phone"])) return;

    if (!status || (status !== "0" && status !== "1")) {
      return res.status(400).json({
        message:
          "Please enter a valid status, either 0 for unpaid or 1 for paid",
      });
    }

    payment.user = {
      name,
      email,
      phone,
    };
    payment.status = status;
    payment.save();

    res.json({
      count: Array.isArray(payment) ? payment.length : 1,
      payment: Array.isArray(payment) ? payment : [payment],
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};
