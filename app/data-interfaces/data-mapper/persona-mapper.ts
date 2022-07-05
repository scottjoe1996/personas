import { AttributeMap } from 'aws-sdk/clients/dynamodb';

import { Persona } from '../../generated/graphql';

type AttributeValueKey = 'S';

export class PersonaMapper {
  public static dynamoItemToGraphQl(item: AttributeMap): Persona {
    return {
      id: this.getAttribute(item, 'id', 'S'),
      description: this.getAttribute(item, 'description', 'S'),
      name: this.getAttribute(item, 'name', 'S'),
      projectId: this.getAttribute(item, 'projectId', 'S'),
      quote: this.getAttribute(item, 'quote', 'S'),
      role: this.getAttribute(item, 'role', 'S')
    };
  }

  private static getAttribute(item: AttributeMap, attributeKey: string, attributeValueKey: AttributeValueKey): string {
    if (!item[attributeKey]) {
      throw new Error(`item does not have ${attributeKey} as an attribute`);
    }

    if (!item[attributeKey][attributeValueKey]) {
      throw new Error(`item with property ${attributeKey} does not have expected attribute type ${attributeValueKey}`);
    }

    return item[attributeKey][attributeValueKey]!;
  }
}
