import * as cdk from '@aws-cdk/core';
import { BuildSpec, EventAction, FilterGroup, LinuxBuildImage, Project, Source } from '@aws-cdk/aws-codebuild';

export class InfrastructureStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

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
        privileged: true,
        buildImage: LinuxBuildImage.STANDARD_5_0
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
  }
}
