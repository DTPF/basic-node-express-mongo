const jwt = require("../services/jwt");
const moment = require("moment");
const User = require("../models/User");

function willExpireToken(token) {
  const { exp } = jwt.decodedToken(token);
  const currentDate = moment().unix();
  if (currentDate > exp) {
    return true;
  }
  return false;
}

function refreshAccessToken(req, res) {
  const { refreshToken } = req.body;
  const isTokenExpired = willExpireToken(refreshToken);
  if (isTokenExpired) {
    res.status(404).send({ message: "El refreshToken ha expirado." });
  } else {
    const { id } = jwt.decodedToken(refreshToken);
    User.findOne({ _id: id })
      .then(userStored => {
        if (!userStored) {
          res.status(404).send({ message: "Usuario no encontrado." });
        } else {
          res.status(200).send({
            accessToken: jwt.createAccessToken(userStored),
            refreshToken: refreshToken,
          });
        }
      })
      .catch(err => {
        if (err) {
          res.status(500).send({ message: "Error del servidor." });
        }
      });
  }
}

module.exports = {
  refreshAccessToken,
};