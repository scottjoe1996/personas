import { Persona } from '../../generated/graphql';
import { PersonaService } from '../../services/persona-service/persona-service';

import { PersonaResolverEvent, Resolver } from '../resolver-events';

export class PersonaResolver implements Resolver<PersonaResolverEvent, Persona> {
  constructor(private personaService: PersonaService) {}

  public resolve(resolverEvent: PersonaResolverEvent): Promise<Persona> {
    return this.personaService.getPersona(resolverEvent.arguments.projectId, resolverEvent.arguments.id);
  }
}
