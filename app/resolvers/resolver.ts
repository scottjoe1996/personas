import { Config, ConfigFactory } from './config-factory';
import { CreatePersonaResolverEvent, PersonaAppSyncResolverEvent, PersonasResolverEvent } from './resolver-events';
import { ResolverInstantiator } from './resolver-instantiator';

let CONFIG: Config;
let RESOLVER_INSTANTIATOR: ResolverInstantiator;

exports.resolve = async (event: PersonaAppSyncResolverEvent) => {
  if (!CONFIG) {
    CONFIG = new ConfigFactory().createConfig();
  }

  if (!RESOLVER_INSTANTIATOR) {
    RESOLVER_INSTANTIATOR = new ResolverInstantiator(CONFIG.personaService);
  }

  switch (event.info.fieldName) {
    case 'persona':
      throw new Error('Persona handler has not yet been implemented');
    case 'personas':
      return RESOLVER_INSTANTIATOR.getPersonasResolver().resolve(event as PersonasResolverEvent);
    case 'createPersona':
      return RESOLVER_INSTANTIATOR.getCreatePersonaResolver().resolve(event as CreatePersonaResolverEvent);
    case 'editPersona':
      throw new Error('editPersona handler has not yet been implemented');
    case 'deletePersona':
      throw new Error('deletePersona handler has not yet been implemented');
    default:
      throw new Error(`Event does not have a handler: ${JSON.stringify(event)}`);
  }
};
