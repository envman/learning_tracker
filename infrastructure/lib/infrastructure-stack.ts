import * as cdk from '@aws-cdk/core';
import { CfnOutput } from '@aws-cdk/core';
import { Repository } from '@aws-cdk/aws-codecommit';
import { Project, Source } from '@aws-cdk/aws-codebuild';
import { Pipeline } from '@aws-cdk/aws-codepipeline';
import { CodeBuildProject } from '@aws-cdk/aws-events-targets';

export class InfrastructureStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const repository = new Repository(this, 'Repository', {
      repositoryName: 'learning-tracker',
      description: 'Demo for AWS things, track and help people learn.',
    });

    new CfnOutput(this, 'CLONE_URL', {
      value: repository.repositoryCloneUrlSsh
    })

    const project = new Project(this, 'master-build', {
      projectName: 'master-build',
      source: Source.codeCommit({
        repository,
        branchOrRef: 'refs/heads/master'
      }),
      environment: {
        privileged: true
      },
      // role:
    })

    repository.onCommit('commitToMaster', {
      target: new CodeBuildProject(project),
      branches: ['master']
    })

    repository.onPullRequestStateChange('pullRequestStateChange', {
      // eventPattern
    })

    // const pipeline = new Pipeline(this, 'master-build-pipeline', {
    //   pipelineName: 'master-build-pipeline',
    //   stages: [
    //     {
    //       stageName: '',

    //     }
    //   ]
    // })
  }
}
