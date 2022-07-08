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
      .then(() => {
        return personaId;
      })
      .catch((err) => {
        console.error(`Failed to put persona object in ${this.tableName} table with error: ${err.message}`);
        throw err;
      });
  }

  public deletePersona(projectId: string, id: string): Promise<void> {
    return this.dynamoClient
      .deleteItem({
        TableName: this.tableName,
        Key: { projectId: { S: projectId }, id: { S: id } }
      })
      .promise()
      .then(() => {})
      .catch((err) => {
        console.error(`Failed to delete item with id ${id} in ${this.tableName} table with error: ${err.message}`);
        throw err;
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
        if (dynamoResponse.Items) {
          return dynamoResponse.Items.map((item) => PersonaMapper.dynamoItemToGraphQl(item));
        }

        return [];
      })
      .catch((err) => {
        console.error(`Failed to get personas in ${this.tableName} table with error: ${err.message}`);
        throw err;
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
        if (dynamoResponse.Item) {
          return PersonaMapper.dynamoItemToGraphQl(dynamoResponse.Item);
        }

        throw new Error(`Persona with id ${id} does not exist`);
      })
      .catch((err) => {
        console.error(`Failed to get item with id ${id} in ${this.tableName} table with error: ${err.message}`);
        throw err;
      });
  }

  public editPersona(personaInput: EditPersonaInput): Promise<Persona> {
    return this.dynamoClient
      .updateItem({
        TableName: this.tableName,
        Key: { projectId: { S: personaInput.projectId }, id: { S: personaInput.id } },
        ConditionExpression: 'id = :id',
        UpdateExpression: 'SET #name = :name, quote = :quote, #role = :role, description = :description',
        ExpressionAttributeValues: {
          ':id': { S: personaInput.id },
          ':name': { S: personaInput.name },
          ':quote': { S: personaInput.quote },
          ':role': { S: personaInput.role },
          ':description': { S: personaInput.description }
        },
        ExpressionAttributeNames: {
          '#name': 'name',
          '#role': 'role'
        },
        ReturnValues: 'ALL_NEW'
      })
      .promise()
      .then((dynamoResponse) => {
        if (dynamoResponse.Attributes) {
          return PersonaMapper.dynamoItemToGraphQl(dynamoResponse.Attributes);
        }

        throw new Error(`Update for persona ${personaInput.id} was successful but failed to get attributes from dynamo response`);
      })
      .catch((err) => {
        console.error(`Failed to update item with id ${personaInput.id} in ${this.tableName} table with error: ${err.message}`);

        throw err;
      });
  }
}
