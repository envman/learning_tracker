import { Repository } from '@aws-cdk/aws-codecommit';
import * as cdk from '@aws-cdk/core';
import { CfnOutput } from '@aws-cdk/core';

export class InfrastructureStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const repo = new Repository(this, 'Repository', {
      repositoryName: 'learning-tracker',
      description: 'Demo for AWS things, track and help people learn.',
    });

    new CfnOutput(this, 'CLONE_URL', {
      value: repo.repositoryCloneUrlSsh
    })
  }
}
