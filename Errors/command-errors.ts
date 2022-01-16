import {CommandErrorEnums} from "../Interfaces/LoggingTypes";

function CommandError(this: typeof CommandError, name: CommandErrorEnums, message: string,): any {
  const instance = Reflect.construct(Error,[name, message]);
  instance.name = `CommandError: ${name}`;
  instance.message = message;
  Reflect.setPrototypeOf(instance,Reflect.getPrototypeOf(this));
  return instance;
}

CommandError.prototype = Object.create(Error.prototype, {
  constructor: {
    value: Error,
    enumerable: false,
    writable: true,
    configurable: true
  }
})
Reflect.setPrototypeOf(CommandError, Error);