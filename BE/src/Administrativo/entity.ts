export class Administrativo {
  constructor(
    public id: number,
    public nombreCompleto: string,
    public legajo: string,
    public email: string,
    public password?: string
  ) {}
}