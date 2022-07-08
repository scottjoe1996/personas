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
    it('should return expected personaId when no personas exist in given projectId', async () => {
      dynamoMock.getPersonas.mockResolvedValue([]);
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

    it('should return expected personaId when no personas exist with given name in given projectId', async () => {
      dynamoMock.getPersonas.mockResolvedValue([
        {
          id: '1234',
          name: 'Different Persona Name',
          description: TEST_PERSONA_DESCRIPTON,
          projectId: TEST_PERSONA_PROJECT_ID,
          quote: TEST_PERSONA_QUOTE,
          role: TEST_PERSONA_ROLE
        }
      ]);
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

    it('should throw expected error when a persona exists with given name in given projectId', async () => {
      dynamoMock.getPersonas.mockResolvedValue([
        {
          id: '1234',
          name: TEST_PERSONA_NAME,
          description: TEST_PERSONA_DESCRIPTON,
          projectId: TEST_PERSONA_PROJECT_ID,
          quote: TEST_PERSONA_QUOTE,
          role: TEST_PERSONA_ROLE
        }
      ]);
      dynamoMock.putPersona.mockResolvedValue(TEST_PERSONA_ID);

      await expect(
        personaService.createPersona({
          name: TEST_PERSONA_NAME,
          description: TEST_PERSONA_DESCRIPTON,
          projectId: TEST_PERSONA_PROJECT_ID,
          quote: TEST_PERSONA_QUOTE,
          role: TEST_PERSONA_ROLE
        })
      ).rejects.toEqual(Error(`Persona with name [${TEST_PERSONA_NAME}] already exists`));
    });
  });

  describe('getPersonas', () => {
    it('should return expected personas', async () => {
      dynamoMock.getPersonas.mockResolvedValue([TEST_PERSONA]);

      personaService.getPersonas(TEST_PERSONA_PROJECT_ID).then((result) => expect(result).toEqual([TEST_PERSONA]));
    });
  });

  describe('getPersona', () => {
    it('should return expected persona', async () => {
      dynamoMock.getPersona.mockResolvedValue(TEST_PERSONA);

      personaService.getPersona(TEST_PERSONA_PROJECT_ID, TEST_PERSONA_ID).then((result) => expect(result).toEqual(TEST_PERSONA));
    });
  });

  describe('editPersona', () => {
    it('should return expected persona', async () => {
      dynamoMock.editPersona.mockResolvedValue(TEST_PERSONA);

      personaService.editPersona(TEST_PERSONA).then((result) => expect(result).toEqual(TEST_PERSONA));
    });
  });

  describe('deletePersona', () => {
    it('should return void', async () => {
      dynamoMock.deletePersona.mockResolvedValue();

      personaService.deletePersona(TEST_PERSONA_PROJECT_ID, TEST_PERSONA_ID).then((result) => expect(result).toEqual(undefined));
    });
  });
});
