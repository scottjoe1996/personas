import { StackProps } from 'aws-cdk-lib';

interface Config {
  dynamoDbName: string;
}

export interface CustomStackProps<T> extends StackProps {
  customProps: T;
}

export const CONFIG: Config = { dynamoDbName: 'personas' };

export const getStackProps = <T>(customProps: T): CustomStackProps<T> => ({
  env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },
  customProps
});
