import { DynamoDB } from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';

import { Persona, CreatePersonaInput, EditPersonaInput } from '../../generated/graphql';

import { PersonaMapper } from '../data-mapper/persona-mapper';

import { PersonaDataInterface } from './persona-data-interface';

export class DynamoPersonaDataInterface implements PersonaDataInterface {
  constructor(private dynamoClient: DynamoDB, private tableName: string) {}

  public putPersona(personaInput: CreatePersonaInput): Promise<string> {
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
        ReturnValues: 'NONE'
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

  public getPersona(projectId: string, id: string): Promise<Persona> {
    return this.dynamoClient
      .getItem({
        TableName: this.tableName,
        Key: { projectId: { S: projectId }, id: { S: id } }
      })
      .promise()
      .then((dynamoResponse) => {
        if (dynamoResponse.$response.error) {
          console.log(`Failed to get item with id ${id} in ${this.tableName} table with error: ${dynamoResponse.$response.error.message}`);
          throw dynamoResponse.$response.error;
        }

        if (dynamoResponse.Item) {
          return PersonaMapper.dynamoItemToGraphQl(dynamoResponse.Item);
        }

        throw new Error(`Persona with id ${id} does not exist`);
      });
  }

  public editPersona(personaInput: EditPersonaInput): Promise<Persona> {
    return this.dynamoClient
      .updateItem({
        TableName: this.tableName,
        Key: { projectId: { S: personaInput.projectId }, id: { S: personaInput.id } },
        ConditionExpression: 'id = :id, ',
        UpdateExpression: 'SET #name = :name, quote = :quote, role = :role, description = :description',
        ExpressionAttributeValues: {
          ':id': { S: personaInput.id },
          ':name': { S: personaInput.name },
          ':quote': { S: personaInput.quote },
          ':role': { S: personaInput.role },
          ':description': { S: personaInput.description }
        },
        ExpressionAttributeNames: {
          '#name': 'name'
        },
        ReturnValues: 'ALL_NEW'
      })
      .promise()
      .then((dynamoResponse) => {
        if (dynamoResponse.$response.error) {
          console.log(`Failed to update item with id ${personaInput.id} in ${this.tableName} table with error: ${dynamoResponse.$response.error.message}`);
          throw dynamoResponse.$response.error;
        }

        if (dynamoResponse.Attributes) {
          return PersonaMapper.dynamoItemToGraphQl(dynamoResponse.Attributes);
        }

        throw new Error(`Update for persona ${personaInput.id} was successful but failed to get attributes from dynamo response`);
      });
  }
}
