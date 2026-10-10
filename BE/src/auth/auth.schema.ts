import z from 'zod';

export const loginBodySchema = z.object({
  email: z.string().email('El email no es válido').nonempty('El email es obligatorio'),
  password: z.string().nonempty('La contraseña es obligatoria'),
});
