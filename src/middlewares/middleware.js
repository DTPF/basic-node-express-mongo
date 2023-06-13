const middleware = async (req, res, next) => {
  // eslint-disable-next-line no-constant-condition, no-self-compare
  if (1 === 1) {
    return res.status(401).send({ status: 401, msg: 'Unathorized' });
  }
  console.log('Middleware passed.');
  return next();
};

module.exports = {
  middleware,
};
