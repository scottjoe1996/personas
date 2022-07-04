import { MockProxy, mock } from 'jest-mock-extended';

import { PersonaDataInterface } from '../../data-interfaces/persona-data-interface/persona-data-interface';

import { PersonaService } from './persona-service';

const TEST_PERSONA_ID = '123';
const TEST_PERSONA_NAME = 'name';
const TEST_PERSONA_DESCRIPTON = 'description';
const TEST_PERSONA_PROJECT_ID = '456';
const TEST_PERSONA_QUOTE = 'qoute';
const TEST_PERSONA_ROLE = 'role';
const TEST_PERSONA = {
  id: TEST_PERSONA_ID,
  name: TEST_PERSONA_NAME,
  description: TEST_PERSONA_DESCRIPTON,
  projectId: TEST_PERSONA_PROJECT_ID,
  quote: TEST_PERSONA_QUOTE,
  role: TEST_PERSONA_ROLE
};

describe('PersonaService', () => {
  let dynamoMock: MockProxy<PersonaDataInterface>;
  let personaService: PersonaService;

  beforeEach(() => {
    dynamoMock = mock<PersonaDataInterface>();
    personaService = new PersonaService(dynamoMock);
  });

  describe('createPersona', () => {
    it('should return expected personaId', async () => {
      dynamoMock.putPersona.mockResolvedValue(TEST_PERSONA_ID);

      personaService
        .createPersona({
          name: TEST_PERSONA_NAME,
          description: TEST_PERSONA_DESCRIPTON,
          projectId: TEST_PERSONA_PROJECT_ID,
          quote: TEST_PERSONA_QUOTE,
          role: TEST_PERSONA_ROLE
        })
        .then((result) => expect(result).toEqual(TEST_PERSONA_ID));
    });
  });

  describe('getPersonas', () => {
    it('should return expected personas', async () => {
      dynamoMock.getPersonas.mockResolvedValue([TEST_PERSONA]);

      personaService.getPersonas(TEST_PERSONA_PROJECT_ID).then((result) => expect(result).toEqual([TEST_PERSONA]));
    });
  });
});
