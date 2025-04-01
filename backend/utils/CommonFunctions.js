exports.checkEmail = (email) => {
  if (typeof email !== "string") return false;
  if (email.trim() == "") return true;
  const [localPart, domain] = email.split("@");
  if (!domain || domain.startsWith(".")) return false;
  const regex =
    /^[a-zA-Z0-9](?!.*\.\.)[a-zA-Z0-9._%+-]*@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return regex.test(email);
};
