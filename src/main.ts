import type { Construct } from 'constructs'
import type { IP6CDKWebsiteProps } from 'p6-cdk-website-plus'
import * as fs from 'node:fs'
import * as process from 'node:process'
import * as cdk from 'aws-cdk-lib'
import * as yaml from 'js-yaml'
import { P6CDKWebsitePlus } from 'p6-cdk-website-plus'

// Configuration file
const CONFIG_FILE = 'conf/sites.yml'

/**
 *
 * @param filePath
 * @returns yamlData
 */
function parseYamlFile(filePath: string): IP6CDKWebsiteProps[] {
  const fileContents = fs.readFileSync(filePath, 'utf8')
  const yamlData = yaml.load(fileContents) as IP6CDKWebsiteProps[]
  return yamlData
}

/**
 *
 *
 */
export class MyStack extends cdk.Stack {
  /**
   *
   * @param scope
   * @param id
   * @param props
   */
  constructor(scope: Construct, id: string, props: cdk.StackProps = {}) {
    super(scope, id, props)

    const domains: IP6CDKWebsiteProps[] = parseYamlFile(CONFIG_FILE)

    domains.forEach((domain: IP6CDKWebsiteProps) => {
      new P6CDKWebsitePlus(this, domain.hostedZoneName, domain)
    })
  }
}

// the AwsEnvironment
const theEnv = {
  account: process.env.CDK_DEPLOY_ACCOUNT || process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEPLOY_REGION || process.env.CDK_DEFAULT_REGION,
}

// create the app and stack
const app = new cdk.App()
new MyStack(app, 'p6-sites', { env: theEnv })
app.synth()
