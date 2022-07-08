import { Persona } from '../../generated/graphql';
import { PersonaService } from '../../services/persona-service/persona-service';

import { EditPersonaResolverEvent, PersonasResolverEvent, Resolver } from '../resolver-events';

export class EditPersonaResolver implements Resolver<EditPersonaResolverEvent, Persona> {
  constructor(private personaService: PersonaService) {}

  public resolve(resolverEvent: EditPersonaResolverEvent): Promise<Persona> {
    return this.personaService.editPersona(resolverEvent.arguments.persona);
  }
}
