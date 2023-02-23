import { Construct } from "constructs";
import * as cdk from "aws-cdk-lib";
import * as iam from "aws-cdk-lib/aws-iam";
import * as dynamo from "aws-cdk-lib/aws-dynamodb";

import { BasicStackProps } from "../interfaces";
import * as Util from "../util";

export class TransactionStack extends cdk.Stack {
  public table: dynamo.Table;
  private lambdaRole: iam.Role;
  //import values
  private kafkaSecretArn: string;

  constructor(scope: Construct, id: string, props: BasicStackProps) {
    super(scope, id, Util.getCdkPropsFromCustomProps(props));

    this.importValues(props);
    this.createTables(props);
    this.createLambdaRole(props);
    this.exportValues(props);
  }

  private importValues(props: BasicStackProps) {
    this.kafkaSecretArn = cdk.Fn.importValue(
      Util.getResourceNameWithPrefix(`kafka-secret-arn-${props.env}`)
    );
  }

  private createLambdaRole(props: BasicStackProps) {
    const dynamoPolicyStatement = new iam.PolicyStatement();

    dynamoPolicyStatement.addResources(this.table.tableArn);
    dynamoPolicyStatement.addActions("dynamodb:*");

    const secretGetValueStatement = new iam.PolicyStatement();
    secretGetValueStatement.addResources(this.kafkaSecretArn);
    secretGetValueStatement.addActions("secretsmanager:GetSecretValue");

    this.lambdaRole = new iam.Role(this, "LambdaTransactionRole", {
      assumedBy: new iam.ServicePrincipal("lambda.amazonaws.com"),
      roleName: Util.getResourceNameWithPrefix(
        `lambda-transaction-role-${props.env}`
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
          `lambda-transaction-role-policy-${props.env}`
        )]: new iam.PolicyDocument({
          statements: [secretGetValueStatement, dynamoPolicyStatement],
        }),
      },
    });
  }

  private createTables(props: BasicStackProps) {
    this.table = new dynamo.Table(this, "TransactionsTable", {
      tableName: Util.getResourceNameWithPrefix(`transactions-${props.env}`),
      billingMode: dynamo.BillingMode.PAY_PER_REQUEST,
      partitionKey: {
        name: "id",
        type: dynamo.AttributeType.STRING,
      },
      stream: dynamo.StreamViewType.NEW_AND_OLD_IMAGES,
    });
  }

  private exportValues(props: BasicStackProps) {
    new cdk.CfnOutput(this, "TransactionsTableName", {
      value: this.table.tableName,
      exportName: Util.getResourceNameWithPrefix(
        `transactions-table-name-${props.env}`
      ),
    });

    new cdk.CfnOutput(this, "LambdaTransactionRoleArn", {
      value: this.lambdaRole.roleArn,
      exportName: Util.getResourceNameWithPrefix(
        `lambda-transaction-role-arn-${props.env}`
      ),
    });
  }
}
