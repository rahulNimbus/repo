const {
  handleMulterErrors,
} = require("../../middlewares/multers/avatarMulter");
const { paymentMulter } = require("../../middlewares/multers/paymentMulter");

exports.createPayment = [
  paymentMulter.single("image"),
  handleMulterErrors,
  async (req, res) => {
    try {
      const PaymentSchema = require("../../modles/paymentSchema");
      const payment = new PaymentSchema({
        ...req.body,
        image: req.file.path,
        req: req.body,
        file: req,
      });
      await payment.save();
      res.json({
        message: "payment created",
        payment,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send("Internal Server Error");
    }
  },
];
exports.getPayment = async (req, res) => {
  try {
    let id = req.params.id;
    if (!id) {
      const PaymentSchema = require("../../modles/paymentSchema");
      const payment = await PaymentSchema.findById(id);
      payment.occupation = "user";
      if (!payment) {
        return res.status(404).json({ message: "Payment not found" });
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
};
