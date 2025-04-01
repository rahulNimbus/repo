exports.checkEmail = (email) => {
  if (typeof email !== "string") return false;
  if (email.trim() == "") return true;
  const [localPart, domain] = email.split("@");
  if (!domain || domain.startsWith(".")) return false;
  const regex =
    /^[a-zA-Z0-9](?!.*\.\.)[a-zA-Z0-9._%+-]*@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return regex.test(email);
};

exports.checkDigit = ({ number, decimalAllowed = false }) => {
  if (number === null || number === undefined) return false;
  if (typeof number !== "number" && typeof number !== "string") return false;
  if (number.trim() === "") return true;

  const numStr = String(number).trim();
  const regex = decimalAllowed
    ? /^(0|[1-9]\d*)(\.\d{0,2})?$/
    : /^(0|[1-9]\d*)$/;
  return regex.test(numStr);
};
