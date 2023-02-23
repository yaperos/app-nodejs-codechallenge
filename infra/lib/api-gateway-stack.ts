import { Construct } from "constructs";
import * as cdk from "aws-cdk-lib";
import { BasicStackProps } from "../interfaces";
import * as Util from "../util";
import * as apigwv2 from "@aws-cdk/aws-apigatewayv2-alpha";

export class ApiGatewayStack extends cdk.Stack {
  public httpApi: apigwv2.HttpApi;

  constructor(scope: Construct, id: string, props: BasicStackProps) {
    super(scope, id, Util.getCdkPropsFromCustomProps(props));

    this.createHttpApi(props);
  }

  private createHttpApi(props: BasicStackProps) {
    this.httpApi = new apigwv2.HttpApi(this, "HttpApi");

    new cdk.CfnOutput(this, "OutputHttpApiId", {
      value: this.httpApi.apiId,
      exportName: Util.getResourceNameWithPrefix(`api-id-${props.env}`),
    });
  }
}
