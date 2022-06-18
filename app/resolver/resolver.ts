import { AppSyncResolverEvent } from 'aws-lambda';

exports.resolve = async (event: AppSyncResolverEvent<unknown, unknown>) => {
  switch (event.info.fieldName) {
    case 'persona':
      throw new Error('Persona handler has not yet been implemented');
    case 'personas':
      throw new Error('Personas handler has not yet been implemented');
    default:
      throw new Error(`Event with fieldName ${event.info.fieldName} does not have a handler`);
  }
};
