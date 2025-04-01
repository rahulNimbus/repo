exports.requiredFields = (req, res, requiredFields) => {
  const missingFields = requiredFields.filter((field) => !req.body[field]);
  if (missingFields.length > 0) {
    res.status(400).json({
      message: `Missing fields: ${missingFields.join(", ")}`,
    });
    return false;
  }
  return true;
};
