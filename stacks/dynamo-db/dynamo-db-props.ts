import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';

export interface DynamoDbProps {
  resolverLambda: NodejsFunction;
}
