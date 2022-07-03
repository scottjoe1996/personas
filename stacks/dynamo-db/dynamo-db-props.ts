import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';

export interface DynamoDbProps {
  dynamoDbTableName: string;
  resolverLambda: NodejsFunction;
}
