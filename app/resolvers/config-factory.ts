import { PersonaService } from '../services/persona-service/persona-service';
import { DynamoPersonaDataInterface } from '../data-interfaces/persona-data-interface/dynamo-persona-data-interface';
import { DynamoDB } from 'aws-sdk';

interface Config {
  personaService: PersonaService;
}

export class ConfigFactory {
  public createConfig(): Config {
    const personaInterface = new DynamoPersonaDataInterface(new DynamoDB({ apiVersion: '2012-08-10' }), process.env.DYNAMO_DB_TABLE_NAME as string);

    return { personaService: new PersonaService(personaInterface) };
  }
}
