import { Stack, StateProps } from "@amenity/state-cdk";
import { App, CfnOutput, StackProps, Tags } from "@aws-cdk/core";

export class StateStack extends Stack {
    constructor(scope: App, serviceName: string, stateProps: StateProps, props?: StackProps) {
        super(scope, serviceName + "-" + stateProps.stage + "-state", stateProps, props);

        Tags.of(this).add("service", serviceName);
        Tags.of(this).add("stage", stateProps.stage);
        Tags.of(this).add("stackType", "state");

        new CfnOutput(this, "AccountSubdomain", {
            value: stateProps.accountSubdomain!
        });

        new CfnOutput(this, "ServiceSubDomain", {
            value: stateProps.serviceName + "-" + stateProps.stage + "." + stateProps.accountSubdomain
        });
    }
}
