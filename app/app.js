exports.handler = async (event, context, callback) => {
  console.log('Event: ', event);
  console.log('Context: ', context);

  var responseMessage = 'Hello, World!!';

  if(event.body) {
    var body = JSON.parse(event.body);
    if (body.message) {
      responseMessage = body.message;
    }
  }

  return {
    "statusCode": 200,
    "headers": {
      'Content-Type': 'application/json',
    },
    "isBase64Encoded": false,
    "body": JSON.stringify({
      "message": responseMessage,
    }),
  }
}