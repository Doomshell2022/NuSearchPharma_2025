export const isMobileNumber = (mobile) => {
  const pattern = /^\d{10}$/;
  return pattern.test(mobile);
};

export const isEmailAddress = (email) => {
  // const pattern = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
  const pattern = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  return pattern.test(email);
};
