export class AppError extends Error {
    constructor(message: string) {
        super(message);
        this.name = new.target.name;
    }
}

export class NotFoundError extends AppError {}
export class ForbiddenError extends AppError {}