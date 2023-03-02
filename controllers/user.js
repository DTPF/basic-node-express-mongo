const fs = require("fs");
const path = require("path");
const bcrypt = require("bcrypt");
const jwt = require("../services/jwt");
const User = require("../models/User");
const { SALTROUNDS } = require("../env");
const { userMessage } = require("../responses/user");

function signUp(req, res) {
  const user = new User();
  const { name, lastname, email, password, repeatPassword } = req.body;
  const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
  const emailValidation = emailRegex.test(email);

  user.name = name;
  user.lastname = lastname;
  user.email = email && email.toLowerCase();
  user.role = "user";
  user.createdAt = Date.now();
  user.updatedAt = Date.now();

  // Email requirements
  if (!email) {
    res.status(400).send({ status: 400, message: userMessage.emailEmpty });
    return;
  }

  if (!emailValidation) {
    res.status(400).send({ status: 400, message: userMessage.emailNotValid });
    return;
  }

  // Password requirements
  if (!password) {
    res.status(400).send({ status: 400, message: userMessage.passwordEmpty });
    return;
  }
  if (password.length < 6) {
    res.status(400).send({ status: 400, message: userMessage.passwordMinLength });
    return;
  }
  if (!repeatPassword) {
    res.status(400).send({ status: 400, message: userMessage.repeatPasswordEmpty });
    return;
  }

  if (password !== repeatPassword) {
    res.status(400).send({ status: 400, message: userMessage.passwordNotMatch });
    return;
  }

  bcrypt.genSalt(SALTROUNDS, function (err, salt) {
    if (err) {
      res.status(500).send({ status: 500, message: userMessage.bcryptSalt });
      return;
    }
    bcrypt.hash(password, salt, function (err, hash) {
      if (err) {
        res.status(501).send({ status: 501, message: userMessage.passwordEncryptFailed });
        return;
      } else {
        user.password = hash;
        user.save()
          .then(userStored => {
            if (!userStored) {
              res.status(400).send({ status: 400, message: userMessage.serverError });
              return;
            }
            res.status(200).send({
              status: 200,
              message: userMessage.userCreated,
              user: userStored,
            });
          })
          .catch((err) => {
            if (err.code === 11000) {
              res.status(400).send({ status: 400, message: userMessage.userExists });
            } else {
              res.status(502).send({ status: 502, message: err.errors.name.message });
            }
            return;
          });
      }
    });
  });
}

function signIn(req, res) {
  const params = req.body;
  const email = params.email && params.email.toLowerCase();
  const password = params.password;

  if (!email) {
    res.status(400).send({ status: 400, message: userMessage.emailEmpty });
    return;
  }
  if (!password) {
    res.status(400).send({ status: 400, message: userMessage.passwordEmpty });
    return;
  }

  User.findOne({ email })
    .then(userStored => {
      if (!userStored) {
        res.status(400).send({ status: 400, message: userMessage.userNotFound });
        return;
      }
      bcrypt.compare(password, userStored.password, (err, check) => {
        if (err) {
          res.status(500).send({ status: 500, message: userMessage.serverError });
          return;
        }
        if (!check) {
          res.status(400).send({ status: 400, message: userMessage.passwordNotValid });
          return;
        }
        res.status(200).send({
          status: 200,
          accessToken: jwt.createAccessToken(userStored),
          refreshToken: jwt.createRefreshToken(userStored),
        });
      });
    })
    .catch(err => {
      if (err) {
        res.status(501).send({ status: 501, message: userMessage.serverError });
        return;
      }
    })
}

function getUsers(req, res) {
  User.find()
    .then((users) => {
      if (!users) {
        res.status(404).send({ status: 404, message: userMessage.userNotFound });
      } else {
        res.status(200).send({ status: 200, users: users });
      }
    })
    .catch(err => {
      if (err) {
        res.status(500).send({ status: 500, message: userMessage.serverError });
      }
    });
}

function uploadAvatar(req, res) {
  const params = req.params;
  const path = req.files.avatar && req.files.avatar.path;

  User.findById({ _id: params.id })
    .then(userData => {
      if (!userData) {
        res.status(404).send({ status: 404, message: userMessage.userNotFound });
        path && fs.unlinkSync(path);
        return;
      }

      let user = userData;
      const avatarNameOld = user.avatar;
      const filePathOld = "./uploads/avatar/" + avatarNameOld;

      if (req.files.avatar) {
        let filePath = path;
        let fileSplit = filePath.split("/");
        let fileName = fileSplit[2];
        let extSplit = fileName.split(".");
        let fileExt = extSplit[1] && extSplit[1].toLowerCase();

        if (fileExt !== "png" && fileExt !== "jpg" && fileExt !== "jpeg") {
          res.status(400).send({ status: 400, message: userMessage.extensionNotValid });
          path && fs.unlinkSync(path);
          return;
        }

        user.avatar = fileName;
        user.updatedAt = Date.now();

        User.findByIdAndUpdate({ _id: params.id }, user)
          .then(userResult => {
            if (!userResult) {
              res.status(404).send({ status: 404, message: userMessage.userNotFound });
              path && fs.unlinkSync(path);
              return;
            }
            (avatarNameOld !== undefined) && fs.unlinkSync(filePathOld);
            res.status(200).send({ status: 200, avatarName: fileName });
          })
          .catch(err => {
            if (err) {
              res.status(500).send({ status: 500, message: err });
              path && fs.unlinkSync(path);
              return;
            }
          })
      } else {
        res.status(404).send({ status: 404, message: userMessage.imageEmpty });
        path && fs.unlinkSync(path);
      }
    })
    .catch(err => {
      if (err) {
        res.status(500).send({ status: 500, message: userMessage.serverError });
        path && fs.unlinkSync(path);
        return;
      }
    })
}

function getAvatar(req, res) {
  const avatarName = req.params.avatarName;
  const filePath = "./uploads/avatar/" + avatarName;

  fs.exists(filePath, (exists) => {
    if (!exists) {
      res.status(404).send({ status: 404, message: userMessage.avatarNotExist });
    } else {
      res.sendFile(path.resolve(filePath));
    }
  });
}

function updateUser(req, res) {
  const params = req.params;
  let userData = req.body;
  userData.email = req.body.email && req.body.email.toLowerCase();
  userData.updatedAt = Date.now();

  if (userData.password) {
    bcrypt.hash(userData.password, null, null, (err, hash) => {
      if (err) {
        res.status(500).send({ status: 500, message: userMessage.passwordEncryptFailed });
      } else {
        userData.password = hash;
      }
    });
  }

  User.findByIdAndUpdate({ _id: params.id }, userData)
    .then(userUpdate => {
      if (!userUpdate) {
        res.status(404).send({ message: userMessage.userNotFound, status: 404 });
      } else {
        res.status(200).send({ status: 200, message: userMessage.userUpdateSuccess, user: userData });
      }
    })
    .catch(err => {
      if (err) {
        res.status(500).send({ status: 500, message: userMessage.serverError });
      }
    })
}

function deleteUser(req, res) {
  const { id } = req.params;

  User.findById({ _id: id })
    .then(user => {
      if (!user) {
        res.status(400).send({ status: 400, message: userMessage.userNotFound });
      } else {
        if (user.role === 'admin') {
          res.status(400).send({ status: 400, message: userMessage.adminReject });
          return
        }
        User.findByIdAndRemove(id)
          .then(userDelete => {
            if (!userDelete) {
              res.status(404).send({ status: 404, message: userMessage.userNotFound });
              return;
            }

            let avatarPath = userDelete.avatar;
            if (avatarPath !== undefined) {
              let filePathToDelete = "./uploads/avatar/" + avatarPath;
              fs.unlinkSync(filePathToDelete);
            }
            res.status(200).send({ status: 200, message: userMessage.deleteSuccess });
            return
          })
          .catch(err => {
            if (err) {
              res.status(500).send({ status: 500, message: userMessage.serverError });
            }
          });
      }
    })
    .catch(err => {
      if (err) {
        res.status(500).send({ status: 500, message: err });
      }
    })
}

function updateRole(req, res) {
  const { id } = req.params;
  const { role } = req.body;

  User.findByIdAndUpdate(id, { role })
    .then(userStored => {
      if (!userStored) {
        res.status(404).send({ status: 404, message: userMessage.userNotFound });
      } else {
        if (!role) {
          res.status(404).send({ status: 404, message: userMessage.roleEmpty });
        } else {
          res.status(200).send({ status: 200, message: userMessage.roleSuccess + role });
        }
      }
    })
    .catch(err => {
      if (err) {
        res.status(500).send({ status: 500, message: userMessage.serverError });
      }
    })
}

module.exports = {
  signUp,
  signIn,
  getUsers,
  uploadAvatar,
  getAvatar,
  updateUser,
  deleteUser,
  updateRole,
};
