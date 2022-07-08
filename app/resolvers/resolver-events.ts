import { AppSyncResolverEvent } from 'aws-lambda';

import {
  MutationCreatePersonaArgs,
  MutationDeletePersonaArgs,
  MutationEditPersonaArgs,
  Persona,
  QueryPersonaArgs,
  QueryPersonasArgs
} from '../generated/graphql';

type PersonaEventArguements = MutationCreatePersonaArgs | MutationDeletePersonaArgs | MutationEditPersonaArgs | QueryPersonaArgs | QueryPersonasArgs;

type PersonaEventNames = 'persona' | 'personas' | 'createPersona' | 'editPersona' | 'deletePersona';

interface GenericPersonaAppSyncResolverEvent<T extends PersonaEventArguements, F extends PersonaEventNames>
  extends Omit<AppSyncResolverEvent<T, unknown>, 'info'> {
  info: { fieldName: F };
}

export interface PersonaResolverEvent extends GenericPersonaAppSyncResolverEvent<QueryPersonaArgs, 'persona'> {}
export interface PersonasResolverEvent extends GenericPersonaAppSyncResolverEvent<QueryPersonasArgs, 'personas'> {}
export interface CreatePersonaResolverEvent extends GenericPersonaAppSyncResolverEvent<MutationCreatePersonaArgs, 'createPersona'> {}
export interface EditPersonaResolverEvent extends GenericPersonaAppSyncResolverEvent<MutationEditPersonaArgs, 'editPersona'> {}
export interface DeletePersonaResolverEvent extends GenericPersonaAppSyncResolverEvent<MutationDeletePersonaArgs, 'deletePersona'> {}

export type PersonaAppSyncResolverEvent =
  | PersonaResolverEvent
  | PersonasResolverEvent
  | CreatePersonaResolverEvent
  | EditPersonaResolverEvent
  | DeletePersonaResolverEvent;

export type PersonaAppSyncResolverResponse = Persona | Persona[] | string | boolean;

export interface Resolver<E extends PersonaAppSyncResolverEvent, R extends PersonaAppSyncResolverResponse> {
  resolve: (resolverEvent: E) => Promise<R>;
}
