import { Persona } from '../../generated/graphql';
import { PersonaService } from '../../services/persona-service/persona-service';

import { DeletePersonaResolverEvent, Resolver } from '../resolver-events';

export class DeletePersonaResolver implements Resolver<DeletePersonaResolverEvent, boolean> {
  constructor(private personaService: PersonaService) {}

  public resolve(resolverEvent: DeletePersonaResolverEvent): Promise<boolean> {
    return this.personaService.deletePersona(resolverEvent.arguments.projectId, resolverEvent.arguments.id);
  }
}
