import { Config, ConfigFactory } from './config-factory';
import {
  CreatePersonaResolverEvent,
  DeletePersonaResolverEvent,
  EditPersonaResolverEvent,
  PersonaAppSyncResolverEvent,
  PersonaResolverEvent,
  PersonasResolverEvent
} from './resolver-events';
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
      return RESOLVER_INSTANTIATOR.getPersonaResolver().resolve(event as PersonaResolverEvent);
    case 'personas':
      return RESOLVER_INSTANTIATOR.getPersonasResolver().resolve(event as PersonasResolverEvent);
    case 'createPersona':
      return RESOLVER_INSTANTIATOR.getCreatePersonaResolver().resolve(event as CreatePersonaResolverEvent);
    case 'editPersona':
      return RESOLVER_INSTANTIATOR.getEditPersonaResolver().resolve(event as EditPersonaResolverEvent);
    case 'deletePersona':
      return RESOLVER_INSTANTIATOR.getDeletePersonaResolver().resolve(event as DeletePersonaResolverEvent);
    default:
      throw new Error(`Event does not have a handler: ${JSON.stringify(event)}`);
  }
};
