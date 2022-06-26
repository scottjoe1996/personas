import { PersonaInput } from '../../../generated/graphql';

import { PersonaDataInterface } from '../../data-interfaces/persona-data-interface/persona-data-interface';

export class PersonaService {
  constructor(private personaDataInterface: PersonaDataInterface) {}

  public createPersona(personaInput: PersonaInput): Promise<string> {
    return this.personaDataInterface.putPersona(personaInput);
  }
}
