import * as process from 'node:process'
import * as cdk from 'aws-cdk-lib'
import { Template } from 'aws-cdk-lib/assertions'
import { MyStack } from '../src/main'

describe('myStack Snapshot Test', () => {
  it('should match the synthesized CloudFormation template snapshot', () => {
    // the AwsEnvironment
    const theEnv = {
      account: process.env.CDK_DEPLOY_ACCOUNT || process.env.CDK_DEFAULT_ACCOUNT,
      region: process.env.CDK_DEPLOY_REGION || process.env.CDK_DEFAULT_REGION,
    }
    const app = new cdk.App()

    // Create the stack
    const stack = new MyStack(app, 'p6-sites', { env: theEnv })

    // Prepare the stack template for assertions
    const template = Template.fromStack(stack)

    // Assert that the stack matches the snapshot
    expect(template.toJSON()).toMatchSnapshot()
  })
})
