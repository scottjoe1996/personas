import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';

export interface DynamoDbProps {
  dynamoTableName: string;
  resolverLambda: NodejsFunction;
}
