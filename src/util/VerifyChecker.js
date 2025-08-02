const verifiedUser = async (user) => {
  if (user.verified === true) return true;
  return false;
};

module.exports = verifiedUser;
