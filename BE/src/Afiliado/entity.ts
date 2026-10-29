export class Afiliado {
  constructor(
    public id: number,
    public nombreCompleto: string,
    public dni: string,
    public email: string,
    public password?: string,
    public obraSocialId?: number
  ) {}
}