import { Construct } from "constructs";
import * as cdk from "aws-cdk-lib";
import * as secretsmanager from "aws-cdk-lib/aws-secretsmanager";

import { BasicStackProps } from "../interfaces";
import * as Util from "../util";

export class SecretsManagerStack extends cdk.Stack {
  public kafkaSecret: secretsmanager.Secret;

  constructor(scope: Construct, id: string, props: BasicStackProps) {
    super(scope, id, Util.getCdkPropsFromCustomProps(props));

    this.createKafkaSecret(props);
  }

  private createKafkaSecret(props: BasicStackProps) {
    let username: string = "";
    let password: string = "";
    let broker: string = "";

    switch (props.env) {
      case "test":
        username = process.env.KAFKA_USERNAME_TEST || "";
        password = process.env.KAFKA_PASSWORD_TEST || "";
        broker = process.env.KAFKA_BROKER_TEST || "";
        break;
    }

    if (username === "") {
      throw new Error("Kafka Username is not defined");
    }

    if (broker === "") {
      throw new Error("Kafka broker is not defined");
    }

    if (password === "") {
      throw new Error("Kafka Password is not defined");
    }

    this.kafkaSecret = new secretsmanager.Secret(this, "KafkaSecret", {
      secretName: Util.getResourceNameWithPrefix(`kafka-secret-${props.env}`),
      generateSecretString: {
        secretStringTemplate: JSON.stringify({
          broker,
          username,
          password,
        }),
        generateStringKey: "generateStringKey",
      },
    });

    new cdk.CfnOutput(this, "KafkaSecretArn", {
      value: this.kafkaSecret.secretArn,
      exportName: Util.getResourceNameWithPrefix(
        `kafka-secret-arn-${props.env}`
      ),
    });
  }
}
