exports.handler = async (event, context) => {
  console.log(event);
  console.log(context);

  let responseMessage = 'Hello, World!';

  if (event.message) {
      responseMessage = 'Message: ' + event.message;
  }

  return responseMessage;
}