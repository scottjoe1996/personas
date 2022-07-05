import { PersonaAppSyncResolverEvent } from './resolver-events';

exports.resolve = async (event: PersonaAppSyncResolverEvent) => {
  switch (event.info.fieldName) {
    case 'persona':
      throw new Error('Persona handler has not yet been implemented');
    case 'personas':
      throw new Error('Personas handler has not yet been implemented');
    case 'createPersona':
      throw new Error('createPersona handler has not yet been implemented');
    case 'editPersona':
      throw new Error('editPersona handler has not yet been implemented');
    case 'deletePersona':
      throw new Error('deletePersona handler has not yet been implemented');
    default:
      throw new Error(`Event does not have a handler: ${JSON.stringify(event)}`);
  }
};
