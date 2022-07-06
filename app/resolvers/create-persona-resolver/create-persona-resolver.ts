import { PersonaService } from '../../services/persona-service/persona-service';

import { CreatePersonaResolverEvent, Resolver } from '../resolver-events';

export class CreatePersonaResolver implements Resolver<CreatePersonaResolverEvent, string> {
  constructor(private personaService: PersonaService) {}

  public resolve(resolverEvent: CreatePersonaResolverEvent): Promise<string> {
    return this.personaService.createPersona(resolverEvent.arguments.persona);
  }
}
