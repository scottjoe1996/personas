import { Persona, CreatePersonaInput } from '../../../generated/graphql';

import { PersonaDataInterface } from '../../data-interfaces/persona-data-interface/persona-data-interface';

export class PersonaService {
  constructor(private personaDataInterface: PersonaDataInterface) {}

  public createPersona(personaInput: CreatePersonaInput): Promise<string> {
    return this.personaDataInterface.getPersonas(personaInput.projectId).then((personas) => {
      if (personas.find((persona) => persona.name == personaInput.name)) {
        throw new Error(`Persona with name [${personaInput.name}] already exists`);
      }

      return this.personaDataInterface.putPersona(personaInput);
    });
  }

  public getPersonas(projectId: string): Promise<Persona[]> {
    return this.personaDataInterface.getPersonas(projectId);
  }
}
