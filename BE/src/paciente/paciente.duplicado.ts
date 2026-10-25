export function mensajeDeDuplicado(error: unknown): string {
  const clave = /for key '([^']+)'/i.exec(error instanceof Error ? error.message : '')?.[1] ?? '';
  if (/dni/i.test(clave)) return 'Ya existe un paciente con ese DNI';
  if (/email/i.test(clave)) return 'Ya existe un paciente con ese email';
  return 'Ya existe un paciente con ese DNI o email';
}