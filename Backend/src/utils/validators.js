const validateEmail = (email) => {
  const re = /^\S+@\S+\.\S+$/;
  return re.test(email);
};

const validatePassword = (password) => {
  // Mínimo 6 caracteres
  return password && password.length >= 6;
};

const validateFullName = (name) => {
  return name && name.trim().length >= 3;
};

module.exports = {
  validateEmail,
  validatePassword,
  validateFullName
};