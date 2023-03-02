const jwt = require("jwt-simple");
const moment = require("moment");
const { SECRET_KEY } = require("../env");

exports.ensureAuth = function (req, res, next) {
  if (!req.headers.authorization) {
    return res
      .status(403)
      .send({ message: "La petición no tiene cabecera de autentificación." });
  }
  const token = req.headers.authorization.replace(/['"]+/g, "");
  try {
    var payload = jwt.decode(token, SECRET_KEY);
    if (payload.exp <= moment.unix()) {
      return res.status(404).send({ message: "El token ha expirado." });
    }
  } catch (ex) {
    return res.status(200).send({ message: "Token inválido." });
  }
  req.user = payload;
  next();
};

exports.ensureAdminAuth = function (req, res, next) {
  if (!req.headers.authorization) {
    return res
      .status(403)
      .send({ message: "La petición no tiene cabecera de autentificación." });
  }
  const token = req.headers.authorization.replace(/['"]+/g, "");
  try {
    var payload = jwt.decode(token, SECRET_KEY);
    if (payload.exp <= moment.unix()) {
      return res.status(404).send({ message: "El token ha expirado." });
    }
    if (payload.role !== 'admin' ) {
      return res.status(404).send({ message: "No tienes permisos." });
    }
  } catch (ex) {
    return res.status(200).send({ message: "Token inválido." });
  }
  req.user = payload;
  next();
};