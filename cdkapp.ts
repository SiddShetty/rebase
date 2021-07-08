import { AmenityClient } from "@amenity/state-cdk";
import { packagePythonCode, packagePythonRequirements } from "@amenity/stateless-cdk";
import { App, Duration } from "@aws-cdk/core";
import { StateStack } from "./cdk/state";
import { build } from "./cdk/stateless";

const serviceName = "adam";

const aClient = new AmenityClient();
const app = new App();

interface InitProps {
    accountId: string;
    region: string;
    stage: string;
    certificateArn: string;
    accountSubdomain: string;
}

export interface EnrichEnv {
    [key: string]: string;
}

export interface LambdaSettings {
    timeout: Duration;
    memory: number;
}

export interface StatelessResources {
    functionsZipPath: string;
    layerZipPath: string;
}

async function PackageLambdaFunction() {
    const zipPromise = packagePythonCode({
        include: ["src/**", "!src/tests/**"],
        exclude: ["**"]
    });
    const layerZipPromise = packagePythonRequirements({
        include: [
            "lib/python3.6/site-packages/**",
            "!lib/python3.6/site-packages/scipy/signal/**",
            "!lib/python3.6/site-packages/scipy/io/**",
            "!lib/python3.6/site-packages/botocore/**",
            "!lib/python3.6/site-packages/pip/**",
            "!lib/python3.6/site-packages/docutils/**"
        ],
        exclude: ["**"]
    });
    const [zipPath, layerZipPath] = await Promise.all([zipPromise, layerZipPromise]);
    return {
        zipPath,
        layerZipPath
    };
}

async function init(): Promise<InitProps> {
    const accountId = process.env.CDK_DEFAULT_ACCOUNT;
    const region = process.env.CDK_DEFAULT_REGION;
    const stage = app.node.tryGetContext("stage") || "dev";

    if (accountId && region) {
        const accountName = await aClient.getAccountName(accountId);
        const accountSubdomain = accountName + ".amenity.cloud";
        const certificateArn = await aClient.getCertificateArn(accountSubdomain);

        return {
            accountId,
            region,
            stage,
            certificateArn,
            accountSubdomain
        };
    } else {
        throw new Error("cant find aws account id or region");
    }
}

init()
    .then(async (initProps: InitProps) => {
        const props = {
            env: {
                account: initProps.accountId,
                region: initProps.region
            }
        };

        const stateProps = {
            // mail for sending alerts to
            email: "ChangeMe@amenityanalytics.slack.com",
            stage: initProps.stage,
            serviceName,
            certificateArn: initProps.certificateArn,
            accountSubdomain: initProps.accountSubdomain
        };

        new StateStack(app, serviceName, stateProps, props);
        const { zipPath, layerZipPath } = await PackageLambdaFunction();

        const statelessResources: StatelessResources = {
            functionsZipPath: zipPath,
            layerZipPath
        };

        await build(app, serviceName, statelessResources, stateProps, props);
    })
    .catch((e) => {
        throw e;
    });
