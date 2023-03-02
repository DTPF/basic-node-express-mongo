const userMessage = {
  // Sign
  emailEmpty: 'El email es obligatorio',
  emailNotValid: 'Email incorrecto',
  passwordEmpty: 'Introduce la contraseña',
  repeatPasswordEmpty: 'Repite la contraseña',
  passwordNotValid: 'Contraseña incorrecta',
  passwordMinLength: 'Mínimo 6 carácteres',
  passwordNotMatch: 'Las contraseñas no coinciden',
  bcryptSalt: 'Error en bcrypt salt',
  passwordEncryptFailed: 'Error al encriptar la contraseña',
  userCreated: 'Usuario creado correctamente',
  userExists: 'El usuario ya existe',

  // Update
  userUpdateSuccess: 'Usuario actualizado correctamente',

  // Delete
  adminReject: 'No se puede eliminar al administrador',
  deleteSuccess: 'Usuario eliminado correctamente',
  
  // Avatar upload
  imageEmpty: 'Sube la imágen',
  extensionNotValid: 'Extensiones permitidas: .png y .jpg',
  avatarNotExist: 'El avatar que buscas no existe',

  // Rol
  roleEmpty: 'Introduce el rol',
  roleSuccess: 'Nuevo rol: ',
  
  // Shared
  serverError: 'Error del servidor',
  userNotFound: 'No se ha encontrado ningún usuario',
  userNotFoundServer: 'No se ha encontrado ningún usuario el el servidor',
}

module.exports = {
  userMessage
}