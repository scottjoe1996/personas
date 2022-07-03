import { DynamoDB } from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';

import { Persona, PersonaInput } from '../../../generated/graphql';

import { PersonaMapper } from '../data-mapper/persona-mapper';

import { PersonaDataInterface } from './persona-data-interface';

export class DynamoPersonaDataInterface implements PersonaDataInterface {
  constructor(private dynamoClient: DynamoDB, private tableName: string) {}

  public putPersona(personaInput: PersonaInput): Promise<string> {
    const personaId = uuidv4();

    return this.dynamoClient
      .putItem({
        TableName: this.tableName,
        Item: {
          id: { S: personaId },
          name: { S: personaInput.name },
          description: { S: personaInput.description },
          role: { S: personaInput.role },
          quote: { S: personaInput.quote },
          projectId: { S: personaInput.projectId }
        },
        ReturnValues: 'ALL_NEW'
      })
      .promise()
      .then((dynamoResponse) => {
        if (dynamoResponse.$response.error) {
          console.log(`Failed to put persona object in ${this.tableName} table with error: ${dynamoResponse.$response.error.message}`);
          throw dynamoResponse.$response.error;
        }

        return personaId;
      });
  }

  public getPersonas(projectId: string): Promise<Persona[]> {
    return this.dynamoClient
      .query({
        TableName: this.tableName,
        KeyConditionExpression: 'projectId = :projectId',
        ExpressionAttributeValues: {
          ':projectId': { S: projectId }
        }
      })
      .promise()
      .then((dynamoResponse) => {
        if (dynamoResponse.$response.error) {
          console.log(`Failed to get personas in ${this.tableName} table with error: ${dynamoResponse.$response.error.message}`);
          throw dynamoResponse.$response.error;
        }

        if (dynamoResponse.Items) {
          return dynamoResponse.Items.map((item) => PersonaMapper.dynamoItemToGraphQl(item));
        }

        return [];
      });
  }
}
