import { Persona, CreatePersonaInput, EditPersonaInput } from '../../generated/graphql';

export interface PersonaDataInterface {
  putPersona: (personaInput: CreatePersonaInput) => Promise<string>;
  getPersonas: (projectId: string) => Promise<Persona[]>;
  getPersona: (projectId: string, id: string) => Promise<Persona>;
  editPersona: (personaInput: EditPersonaInput) => Promise<Persona>;
}
