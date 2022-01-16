"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function CommandError(name, message) {
    const instance = Reflect.construct(Error, [name, message]);
    instance.name = `CommandError: ${name}`;
    instance.message = message;
    Reflect.setPrototypeOf(instance, Reflect.getPrototypeOf(this));
    return instance;
}
CommandError.prototype = Object.create(Error.prototype, {
    constructor: {
        value: Error,
        enumerable: false,
        writable: true,
        configurable: true
    }
});
Reflect.setPrototypeOf(CommandError, Error);
