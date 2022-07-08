import { PersonaService } from '../services/persona-service/persona-service';
import { CreatePersonaResolver } from './create-persona-resolver/create-persona-resolver';
import { DeletePersonaResolver } from './delete-persona-resolver/delete-persona-resolver';
import { EditPersonaResolver } from './edit-persona-resolver/edit-persona-resolver';
import { PersonaResolver } from './persona-resolver/persona-resolver';
import { PersonasResolver } from './personas-resolver/personas-resolver';

export class ResolverInstantiator {
  private createPersonaResolver?: CreatePersonaResolver;
  private personasResolver?: PersonasResolver;
  private personaResolver?: PersonaResolver;
  private editPersonaResolver?: EditPersonaResolver;
  private deletePersonaResolver?: DeletePersonaResolver;

  constructor(private personaService: PersonaService) {}

  public getCreatePersonaResolver(): CreatePersonaResolver {
    if (!this.createPersonaResolver) {
      this.createPersonaResolver = new CreatePersonaResolver(this.personaService);
    }

    return this.createPersonaResolver;
  }

  public getPersonasResolver(): PersonasResolver {
    if (!this.personasResolver) {
      this.personasResolver = new PersonasResolver(this.personaService);
    }

    return this.personasResolver;
  }

  public getPersonaResolver(): PersonaResolver {
    if (!this.personaResolver) {
      this.personaResolver = new PersonaResolver(this.personaService);
    }

    return this.personaResolver;
  }

  public getEditPersonaResolver(): EditPersonaResolver {
    if (!this.editPersonaResolver) {
      this.editPersonaResolver = new EditPersonaResolver(this.personaService);
    }

    return this.editPersonaResolver;
  }

  public getDeletePersonaResolver(): DeletePersonaResolver {
    if (!this.deletePersonaResolver) {
      this.deletePersonaResolver = new DeletePersonaResolver(this.personaService);
    }

    return this.deletePersonaResolver;
  }
}
