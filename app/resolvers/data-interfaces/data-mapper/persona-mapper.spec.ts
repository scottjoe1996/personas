import { DynamoDB } from 'aws-sdk';
import { PersonaMapper } from './persona-mapper';

const TEST_PERSONA_ID = '123';
const TEST_PERSONA_NAME = 'name';
const TEST_PERSONA_DESCRIPTON = 'description';
const TEST_PERSONA_PROJECT_ID = '456';
const TEST_PERSONA_QUOTE = 'qoute';
const TEST_PERSONA_ROLE = 'role';

describe('PersonaMapper', () => {
  describe('dynamoItemToGraphQl', () => {
    it('should return expected persona', () => {
      const actual = PersonaMapper.dynamoItemToGraphQl({
        id: { S: TEST_PERSONA_ID },
        name: { S: TEST_PERSONA_NAME },
        description: { S: TEST_PERSONA_DESCRIPTON },
        projectId: { S: TEST_PERSONA_PROJECT_ID },
        quote: { S: TEST_PERSONA_QUOTE },
        role: { S: TEST_PERSONA_ROLE }
      });

      expect(actual).toEqual({
        id: TEST_PERSONA_ID,
        name: TEST_PERSONA_NAME,
        description: TEST_PERSONA_DESCRIPTON,
        projectId: TEST_PERSONA_PROJECT_ID,
        quote: TEST_PERSONA_QUOTE,
        role: TEST_PERSONA_ROLE
      });
    });

    it.each([
      [
        {
          id: { S: TEST_PERSONA_ID },
          description: { S: TEST_PERSONA_DESCRIPTON },
          projectId: { S: TEST_PERSONA_PROJECT_ID },
          quote: { S: TEST_PERSONA_QUOTE },
          role: { S: TEST_PERSONA_ROLE }
        },
        'item does not have name as an attribute'
      ],
      [
        {
          id: { S: TEST_PERSONA_ID },
          name: { S: TEST_PERSONA_NAME },
          description: { B: 'description is not a boolean' },
          projectId: { S: TEST_PERSONA_PROJECT_ID },
          quote: { S: TEST_PERSONA_QUOTE },
          role: { S: TEST_PERSONA_ROLE }
        },
        'item with property description does not have expected attribute type S'
      ]
    ])('should throw expected error if dynamo object cannot map to persona', (invalidDynamoItem: DynamoDB.AttributeMap, expectedError: string) => {
      expect(() => PersonaMapper.dynamoItemToGraphQl(invalidDynamoItem)).toThrowError(expectedError);
    });
  });
});
