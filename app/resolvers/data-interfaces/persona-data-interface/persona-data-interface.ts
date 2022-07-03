import { Persona, PersonaInput } from '../../../generated/graphql';

export interface PersonaDataInterface {
  putPersona: (personaInput: PersonaInput) => Promise<string>;
  getPersonas: (projectId: string) => Promise<Persona[]>;
}
