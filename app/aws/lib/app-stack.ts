import * as path from 'path';
import { NodejsFunction } from '@aws-cdk/aws-lambda-nodejs';
import * as cdk from '@aws-cdk/core';
import { LambdaIntegration, LambdaRestApi } from '@aws-cdk/aws-apigateway';

export class AppStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const okFunction = new NodejsFunction(this, 'ok', {
      entry: path.join(__dirname, 'lambdas', 'ok.ts')
    })

    const api = new LambdaRestApi(this, 'api', {
      handler: okFunction
    })
  }
}
