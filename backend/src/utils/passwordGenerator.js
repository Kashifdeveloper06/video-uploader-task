exports.generatePassword = (firstName, lastName, phoneNumber) => {
  const firstChar = firstName.charAt(0).toUpperCase();
  const lastChar = lastName.charAt(0).toUpperCase();
  const lastFourDigits = phoneNumber.slice(-4);
  const randomChars = Math.random().toString(36).substring(2, 5).toUpperCase();

  return `${firstChar}${lastChar}${lastFourDigits}${randomChars}`;
};
