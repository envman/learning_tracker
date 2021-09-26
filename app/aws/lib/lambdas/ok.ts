import { 
  APIGatewayProxyEvent, 
  APIGatewayProxyResult 
} from "aws-lambda";

exports.handler = async (event: APIGatewayProxyEvent, context: APIGatewayProxyResult) => {

  console.log('ok')

  return {
    statusCode: 200,
    body: 'ok'
  }
}