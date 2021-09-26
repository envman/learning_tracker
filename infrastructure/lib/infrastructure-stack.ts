import * as cdk from '@aws-cdk/core';
import { BuildSpec, EventAction, FilterGroup, LinuxBuildImage, Project, Source } from '@aws-cdk/aws-codebuild';
import { ManagedPolicy, PolicyStatement, Role, ServicePrincipal } from '@aws-cdk/aws-iam';

export class InfrastructureStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const role = new Role(this, 'build-role', {
      assumedBy: new ServicePrincipal('codebuild.amazonaws.com'),
      managedPolicies: [
        ManagedPolicy.fromAwsManagedPolicyName('AWSLambda_FullAccess'),
        ManagedPolicy.fromAwsManagedPolicyName('AmazonAPIGatewayAdministrator'),
      ]
    })

    role.addToPolicy(new PolicyStatement({
      actions: [
        's3:*'
      ],
      resources: [
        'arn:aws:s3:::cdktoolkit-stagingbucket-1j52nar89uj9e'
      ]
    }))

    // ManagedPolicy.fromAwsManagedPolicyName('')

    // role.addToPolicy(ManagedPolicy.fromAwsManagedPolicyName(''))

    // role.addToPolicy(new PolicyStatement({
    //   actions: [
    //     'codebuild:CreateReport',
    //     'codebuild:UpdateReport',
    //     'codebuild:CreateReportGroup',
    //     'codebuild:BatchPutTestCases',
    //     'codebuild:BatchPutCodeCoverages'
    //   ],
    //   resources: ['*'],
    // }));

    // role.addToPolicy(new PolicyStatement({
    //   actions: [
    //     'codebuild:CreateReport',
    //     'codebuild:UpdateReport',
    //     'codebuild:CreateReportGroup',
    //     'codebuild:BatchPutTestCases',
    //     'codebuild:BatchPutCodeCoverages'
    //   ],
    //   resources: ['*'],
    // }));

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
      role
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
      role
    })
  }
}
