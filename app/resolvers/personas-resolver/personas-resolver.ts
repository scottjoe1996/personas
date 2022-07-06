import { Persona } from '../../generated/graphql';
import { PersonaService } from '../../services/persona-service/persona-service';

import { PersonasResolverEvent, Resolver } from '../resolver-events';

export class PersonasResolver implements Resolver<PersonasResolverEvent, Persona[]> {
  constructor(private personaService: PersonaService) {}

  public resolve(resolverEvent: PersonasResolverEvent): Promise<Persona[]> {
    return this.personaService.getPersonas(resolverEvent.arguments.projectId);
  }
}
