const {
  handleMulterErrors,
} = require("../../middlewares/multers/avatarMulter");
const { paymentMulter } = require("../../middlewares/multers/paymentMulter");
const { checkDigit, checkEmail } = require("../../utils/CommonFunctions");
const { requiredFields } = require("../../utils/requiredFields");
const PaymentSchema = require("../../models/paymentSchema");
const { default: mongoose } = require("mongoose");
const User = require("../../models/user/userSchema");

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
          .json({ error: "Please upload at least one file" });
      }

      if (req.files?.map((file) => file.path).length > 5) {
        return res
          .status(400)
          .json({ error: "Please upload at most 5 files" });
      }

      if (!checkDigit({ number: req.body.amount, decimalAllowed: true })) {
        return res.status(400).json({ error: "Please enter a valid amount" });
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
      res.status(500).send({ error: "Internal Server Error" });
    }
  },
];

exports.getPayment = async (req, res) => {
  try {
    let id = req.query.id;
    let payment;
    if (id) {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: "Invalid ID" });
      }
      payment = await PaymentSchema.find({ _id: id });
    } else {
      payment = await PaymentSchema.find({ user: req.user.id });
    }

    if (!payment) {
      return res.status(404).json({ error: "Payment not found" });
    }
    const updatedPayments = payment.map((e) => ({
      ...e.toObject(),
      media: e.media.map(
        (curr) =>
          req.protocol +
          "://" +
          req.get("host") +
          "/api/" +
          curr.replaceAll("\\", "/")
      ),
    }));

    const payload = {
      count: payment.length,
      payment: updatedPayments,
    };
    if (!id) {
      const totalSales = payment
        .map((p) => p.customer.filter((c) => c.status === 1).length)
        .reduce((acc, curr) => acc + curr, 0);

      const totalRevenue = payment
        .map((p) => p.customer.filter((c) => c.status === 1).length * p.amount)
        .reduce((acc, curr) => acc + curr, 0);

      const notPaidCustomers = payment
        .map((p) => p.customer.filter((c) => c.status === 0).length)
        .reduce((acc, curr) => acc + curr, 0);

      payload.totalSales = totalSales;
      payload.totalRevenue = totalRevenue;
      payload.notPaidCustomers = notPaidCustomers;
    }
    res.json(payload);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

exports.payPayment = async (req, res) => {
  try {
    let id = req.body.id;
    let payment;

    if (!id) {
      return res.status(400).json({ error: "Please provide an ID" });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid ID" });
    }
    payment = await PaymentSchema.findById(id);

    if (!payment) {
      return res.status(404).json({ error: "Payment not found" });
    }

    let { enabled, customer } = req.body;

    if (enabled?.toString()) {
      if (payment.user.toString() !== req.user.id.toString()) {
        return res.status(403).json({ error: "Forbidden" });
      }
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

      if (!customer.name || !customer.email || !customer.phone) {
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
      if (Number(customer.status) !== 0 && Number(customer.status) !== 1) {
        return res.status(400).json({
          error:
            "Please enter a valid status, either 0 for unpaid or 1 for paid",
        });
      }
      if (
        customer.phone.length !== 10 ||
        !checkDigit({ number: customer.phone, decimalAllowed: false })
      ) {
        return res
          .status(400)
          .json({ error: "Please enter a valid 10 digit phone number" });
      }

      const existingCustomer = payment.customer.filter(
        (c) => c.email === customer.email
      )[0];

      if (existingCustomer) {
        if (existingCustomer.status === 1) {
          return res.status(400).json({ error: "Customer already paid" });
        }
        existingCustomer.status = customer.status;
        existingCustomer.name = customer.name;
        existingCustomer.phone = customer.phone;
        existingCustomer.email = customer.email;
        payment.customer = payment.customer.map((e) =>
          e._id?.toString() === customer._id?.toString() ? existingCustomer : e
        );
      } else {
        payment.customer.push(customer);
      }
      if (customer.status === "1") {
        const user = await User.findById(payment.user);
        user.headers.balance += payment.amount;
        await user.save();
      }
    } else {
      return res.status(400).json({ error: "Payment is disabled" });
    }
    await payment.save();

    res.json({
      count: 1,
      payment: [payment],
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};
