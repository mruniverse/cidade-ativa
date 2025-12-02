export class TokenExpiredError extends Error {
  constructor() {
    super('Token expirado');
    this.name = 'TokenExpiredError';
  }
}

export class TokenInvalidError extends Error {
  constructor() {
    super('Token inválido');
    this.name = 'TokenInvalidError';
  }
}
