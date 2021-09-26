import * as cdk from '@aws-cdk/core';
import { CfnOutput } from '@aws-cdk/core';
import { Repository } from '@aws-cdk/aws-codecommit';
import { BuildSpec, EventAction, FilterGroup, LinuxBuildImage, Project, Source } from '@aws-cdk/aws-codebuild';
import { Pipeline } from '@aws-cdk/aws-codepipeline';
import { CodeBuildProject } from '@aws-cdk/aws-events-targets';

export class InfrastructureStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // const repository = new Repository(this, 'Repository', {
    //   repositoryName: 'learning-tracker',
    //   description: 'Demo for AWS things, track and help people learn.',
    // });

    // new CfnOutput(this, 'CLONE_URL', {
    //   value: repository.repositoryCloneUrlSsh
    // })

    const project = new Project(this, 'master-build', {
      projectName: 'learning-tracker',
      source: Source.gitHub({
        owner: 'envman',
        repo: 'learning_tracker',
        webhook: true,
        webhookFilters: [
          FilterGroup
            .inEventOf(EventAction.PUSH)
            .andBranchIs('master')
            // .andHeadRefIs('refs/heads/master')
        ]
      }),
      environment: {
        privileged: true
      },
      // role:
    })

    const prProject = new Project(this, 'review-build', {
      projectName: 'learning-tracker-review',
      buildSpec: BuildSpec.fromSourceFilename('buildspec-pr.yml'),
      source: Source.gitHub({
        owner: 'envman',
        repo: 'learning_tracker',
        webhook: true,
        webhookFilters: [
          FilterGroup.inEventOf(EventAction.PULL_REQUEST_UPDATED),
          FilterGroup.inEventOf(EventAction.PULL_REQUEST_CREATED)
        ]
      }),
      environment: {
        privileged: true,
        buildImage: LinuxBuildImage.STANDARD_5_0
      },
      // role:
    })

    // repository.onCommit('commitToMaster', {
    //   target: new CodeBuildProject(project),
    //   branches: ['master']
    // })



    // repository.onCommit('prCommit', {
    //   target: new CodeBuildProject(prProject),
    //   branches: ['refs/heads/feature/*'],
    //   eventPattern: {

    //   }
    // })

    // console.log('test')

    // repository.onPullRequestStateChange('pullRequestStateChange', {
    //   target: new CodeBuildProject(prProject),
    //   // eventPattern: {
    //     // detail: [
    //       // 'pullRequestCreated',
    //       // 'pullRequestSourceBranchUpdated'
    //     // ]
    //   // }
    // })

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
