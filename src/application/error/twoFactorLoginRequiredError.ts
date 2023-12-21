export class TwoFactorLoginRequiredError extends Error {
    constructor(readonly id: string) {
        super();
    }
}