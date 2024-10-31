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
 * Interface for the stack
 * @interface ISite
 * @extends {cdk.StackProps}
 * @property {IP6CDKWebsiteProps} site - The site configuration
 * @property {string} site.hostedZoneName - The hosted zone name
 * @property {string} site.verifyEmail - The email to verify
 * @property {string} site.cloudfrontRecordName - The cloudfront record name
 * @property {cdk.StackProps} env - The environment
 */
interface ISite extends cdk.StackProps {
  site: IP6CDKWebsiteProps
}
/**
 * MyStack
 *
 */
export class MyStack extends cdk.Stack {
  /**
   *
   * @param scope
   * @param id
   * @param props
   */
  constructor(scope: Construct, id: string, props: ISite) {
    super(scope, id, props)

    new P6CDKWebsitePlus(this, props.site.hostedZoneName, props.site)
  }
}

// the AwsEnvironment
const theEnv = {
  account: process.env.CDK_DEPLOY_ACCOUNT || process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEPLOY_REGION || process.env.CDK_DEFAULT_REGION,
}

// create the app and stack
const app = new cdk.App()
const domains: IP6CDKWebsiteProps[] = parseYamlFile(CONFIG_FILE)
domains.forEach((domain) => {
  const stackName = `p6-site-${domain.hostedZoneName.replace(/\./g, '-')}`

  new MyStack(app, stackName, { site: domain, env: theEnv })
})
app.synth()
