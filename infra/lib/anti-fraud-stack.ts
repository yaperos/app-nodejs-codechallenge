import { Construct } from "constructs";
import * as cdk from "aws-cdk-lib";
import * as iam from "aws-cdk-lib/aws-iam";

import { BasicStackProps } from "../interfaces";
import * as Util from "../util";

export class AntiFraudStack extends cdk.Stack {
  private lambdaRole: iam.Role;
  //import values
  private kafkaSecretArn: string;

  constructor(scope: Construct, id: string, props: BasicStackProps) {
    super(scope, id, Util.getCdkPropsFromCustomProps(props));

    this.importValues(props);
    this.createLambdaRole(props);
    this.exportValues(props);
  }

  private importValues(props: BasicStackProps) {
    this.kafkaSecretArn = cdk.Fn.importValue(
      Util.getResourceNameWithPrefix(`kafka-secret-arn-${props.env}`)
    );
  }

  private createLambdaRole(props: BasicStackProps) {
    const secretGetValueStatement = new iam.PolicyStatement();
    secretGetValueStatement.addResources(this.kafkaSecretArn);
    secretGetValueStatement.addActions("secretsmanager:GetSecretValue");

    this.lambdaRole = new iam.Role(this, "LambdaAntiFraudRole", {
      assumedBy: new iam.ServicePrincipal("lambda.amazonaws.com"),
      roleName: Util.getResourceNameWithPrefix(
        `lambda-anti-fraud-role-${props.env}`
      ),
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName(
          "service-role/AWSLambdaVPCAccessExecutionRole"
        ),
        iam.ManagedPolicy.fromAwsManagedPolicyName(
          "service-role/AWSLambdaBasicExecutionRole"
        ),
      ],
      inlinePolicies: {
        [Util.getResourceNameWithPrefix(
          `lambda-anti-fraud-role-policy-${props.env}`
        )]: new iam.PolicyDocument({
          statements: [secretGetValueStatement],
        }),
      },
    });
  }

  private exportValues(props: BasicStackProps) {
    new cdk.CfnOutput(this, "LambdaAntiFraudRoleArn", {
      value: this.lambdaRole.roleArn,
      exportName: Util.getResourceNameWithPrefix(
        `lambda-anti-fraud-role-arn-${props.env}`
      ),
    });
  }
}
