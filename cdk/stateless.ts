import { StateProps } from "@amenity/state-cdk";
import { HTTPEvent, PythonFunction, RestApiWithDomainName } from "@amenity/stateless-cdk";
import { AuthorizationType } from "@aws-cdk/aws-apigateway";
import { Certificate } from "@aws-cdk/aws-certificatemanager";
import { PolicyStatement } from "@aws-cdk/aws-iam";
import { AssetCode, LayerVersion, Runtime } from "@aws-cdk/aws-lambda";
import { App, Duration, Stack, StackProps, Tags } from "@aws-cdk/core";
import { EnrichEnv, LambdaSettings, StatelessResources } from "../cdkapp";

export interface EndpointParams {
    path: string;
    name: string;
    handlerPath: string;
    method: string;
}

export async function build(scope: App, serviceName: string, statelessResources: StatelessResources, stateProps: StateProps, props: StackProps) {
    const statelessStack = new Stack(scope, `${serviceName}-${stateProps.stage}-stateless`, props);

    Tags.of(statelessStack).add("service", serviceName);
    Tags.of(statelessStack).add("stage", stateProps.stage);
    Tags.of(statelessStack).add("stackType", "stateless");

    const serviceSubDomain = `${serviceName}-${stateProps.stage}.${stateProps.accountSubdomain!}`;
    const certificate = Certificate.fromCertificateArn(statelessStack, `${statelessStack.stackName}Certificate`, stateProps.certificateArn!);
    const restapi = new RestApiWithDomainName(statelessStack, `${statelessStack.stackName}RestAPI`, {
        certificate,
        serviceSubDomain,
        accountSubdomain: stateProps.accountSubdomain!,

        // Base path should be different from /
        basePath: "/v1"
    });

    const layer = new LayerVersion(statelessStack, `${statelessStack.stackName}Layer`, {
        code: new AssetCode(statelessResources.layerZipPath)
    });

    const helloFunctionParams: EndpointParams = {
        // The path to this endpoint is /v1/hello-world because of basePath
        path: "hello-world",
        name: "helloWorld",
        handlerPath: "src/hello_world.api_handler",
        method: "post"
    };

    const lambdaDefaultSettings: LambdaSettings = {
        timeout: Duration.seconds(20),
        memory: 128
    };

    addEndpoint(
        statelessStack,
        restapi,
        layer,
        statelessResources.functionsZipPath,
        { SERVICE_NAME: serviceName },
        [],
        helloFunctionParams,
        lambdaDefaultSettings
    );
}

export function addEndpoint(
    stack: Stack,
    restApi: RestApiWithDomainName,
    layer: LayerVersion,
    zipPath: string,
    enrichEnv: EnrichEnv,
    initialPolicy: PolicyStatement[],
    endpointParams: EndpointParams,
    lambdaSettings: LambdaSettings
) {
    new PythonFunction(stack, endpointParams.name, {
        layers: [layer],
        code: new AssetCode(zipPath),
        runtime: Runtime.PYTHON_3_6,
        handler: endpointParams.handlerPath,
        environment: enrichEnv,
        events: [
            new HTTPEvent(stack, `Endpoint${endpointParams.name}Query`, {
                method: endpointParams.method,
                path: endpointParams.path,
                restApi,
                methodOptions: {
                    authorizationType: AuthorizationType.IAM
                }
            })
        ],
        memorySize: lambdaSettings.memory,
        timeout: lambdaSettings.timeout,
        initialPolicy
    });
}
