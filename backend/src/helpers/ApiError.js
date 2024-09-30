export class ApiError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode || 500;
    this.status = String(statusCode).startsWith('4') ? 'fail' : 'error';
  }
}
