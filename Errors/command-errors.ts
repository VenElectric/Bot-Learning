
function commandException(this: any, message:any, command:string, ) {
    this.message = message;
    this.name = 'UserException';
  }