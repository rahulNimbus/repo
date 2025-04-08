const {
  handleMulterErrors,
} = require("../../middlewares/multers/avatarMulter");
const { paymentMulter } = require("../../middlewares/multers/paymentMulter");
const { checkDigit, checkEmail } = require("../../utils/CommonFunctions");
const { requiredFields } = require("../../utils/requiredFields");
const PaymentSchema = require("../../models/paymentSchema");
const { default: mongoose } = require("mongoose");

exports.createPayment = [
  paymentMulter.array("media", 5),
  handleMulterErrors,
  async (req, res) => {
    try {
      if (!requiredFields(req, res, ["title", "description", "amount"])) {
        return;
      }

      if (!req.files?.map((file) => file.path).length) {
        return res
          .status(400)
          .json({ message: "Please upload at least one file" });
      }

      if (req.files?.map((file) => file.path).length > 5) {
        return res
          .status(400)
          .json({ message: "Please upload at most 5 files" });
      }

      if (!checkDigit({ number: req.body.amount, decimalAllowed: true })) {
        return res.status(400).json({ message: "Please enter a valid amount" });
      }

      const payment = new PaymentSchema({
        title: req.body.title,
        amount: Number(req.body.amount),
        description: req.body.description,
        media: req?.files?.map((file) => file.path) || [],
        user: req.user.id,
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
      payment = await PaymentSchema.find({ _id: id });
    } else {
      payment = await PaymentSchema.find({ user: req.user.id });
    }

    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    res.json({
      count: payment.length,
      payment: payment,
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

    let { enabled, customer } = req.body;

    if (enabled?.toString()) {
      payment.enabled = Boolean(enabled);
    } else if (payment.enabled) {
      if (!requiredFields(req, res, ["customer"])) return;
      if (
        typeof customer !== "object" ||
        customer === null ||
        Array.isArray(customer)
      ) {
        return res.status(400).json({
          error:
            "Customer must be a valid object with fields name, email and phone.",
        });
      }

      if (
        customer.name.trim() === "" ||
        customer.email.trim() === "" ||
        customer.phone.trim() === "" ||
        customer.status === ""
      ) {
        return res.status(400).json({
          error: "Customer name, email phone and status cannot be empty.",
        });
      }

      if (
        !customer.status?.toString() ||
        (Number(customer.status) !== 0 && Number(customer.status) !== 1)
      ) {
        return res.status(400).json({
          message:
            "Please enter a valid status, either 0 for unpaid or 1 for paid",
        });
      }

      if (
        customer.phone.length !== 10 ||
        !checkDigit({ number: customer.phone, decimalAllowed: false })
      ) {
        return res
          .status(400)
          .json({ message: "Please enter a valid 10 digit phone number" });
      }

      const isCustomerExists = payment.customer.some(
        (c) => c.email === customer.email
      );

      if (isCustomerExists) {
        payment.customer = payment.customer.map((c) => {
          if (c.email === customer.email) {
            return {
              name: customer.name,
              email: customer.email,
              phone: customer.phone,
              status: customer.status,
            };
          }
          return c;
        });
      } else {
        payment.customer.push(customer);
      }
    } else {
      return res.status(400).json({ message: "Payment is disabled" });
    }
    await payment.save();

    res.json({
      count: 1,
      payment: [payment],
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};
