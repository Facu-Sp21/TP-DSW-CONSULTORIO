import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 10;

//hashea la contraseña del usuario antes de guardarla en la base de datos
export async function hashPassword(plainPassword: string): Promise<string> {
  return bcrypt.hash(plainPassword, SALT_ROUNDS);
}
//compara la contraseña ingresada por el usuario con la contraseña hasheada guardada en la base de datos
export async function comparePassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(plainPassword, hashedPassword);
}
