import * as path from 'path';
import { NodejsFunction } from '@aws-cdk/aws-lambda-nodejs';
import * as cdk from '@aws-cdk/core';
import { LambdaRestApi } from '@aws-cdk/aws-apigateway';
import { Bucket } from '@aws-cdk/aws-s3';
import { CfnOutput, RemovalPolicy } from '@aws-cdk/core';
import { BucketDeployment, Source } from '@aws-cdk/aws-s3-deployment';

export class AppStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const okFunction = new NodejsFunction(this, 'ok', {
      entry: path.join(__dirname, 'lambdas', 'ok.ts')
    })

    const api = new LambdaRestApi(this, 'api', {
      handler: okFunction
    })

    const clientBucket = new Bucket(this, 'client-bucket', {
      removalPolicy: RemovalPolicy.DESTROY,
    })

    new BucketDeployment(this, 'client-bucket-deployment', {
      sources: [Source.asset(path.join(__dirname, '..', 'web'))],
      destinationBucket: clientBucket,
      retainOnDelete: false
    })

    new CfnOutput(this, 'WEB_BUCKET', { value: clientBucket.bucketWebsiteUrl })
  }
}
