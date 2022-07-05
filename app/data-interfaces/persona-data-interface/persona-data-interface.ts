import { Persona, CreatePersonaInput } from '../../generated/graphql';

export interface PersonaDataInterface {
  putPersona: (personaInput: CreatePersonaInput) => Promise<string>;
  getPersonas: (projectId: string) => Promise<Persona[]>;
}
