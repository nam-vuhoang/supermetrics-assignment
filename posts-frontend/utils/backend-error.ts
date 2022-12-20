export class BackendError extends Error {
  constructor(msg: string, public status?: number, public info?: any) {
    super(msg);

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, BackendError.prototype);
  }
}
