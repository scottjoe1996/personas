import { PersonaInput } from '../../../generated/graphql';

export interface PersonaDataInterface {
  putPersona: (personaInput: PersonaInput) => Promise<string>;
}
