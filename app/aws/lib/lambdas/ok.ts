import { 
  APIGatewayProxyEvent, 
  APIGatewayProxyResult 
} from "aws-lambda";

exports.handler = async (event: APIGatewayProxyEvent, context: APIGatewayProxyResult) => {

  return {
    statusCode: 200,
    body: 'ok'
  }
}