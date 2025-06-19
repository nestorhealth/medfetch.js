import { faker } from "@faker-js/faker";
import z from "zod";

type MapValues<RecordLike, V> = {
  [Key in keyof RecordLike]: V;
};

export function makeFactory<T extends z.ZodObject<any>, Output = z.infer<T>>(
  schema: T
): (overrides: Partial<MapValues<Output, () => any>>) => Output {
  const shape = schema.shape;

  return (overrides: Partial<MapValues<Output, () => any>> = {}) => {
    const result: any = {};

    for (const key in shape) {
      if (key.startsWith("_")) continue;

      const def = shape[key] as z.ZodTypeAny;

      if (overrides[key as keyof Output]) {
        result[key] = overrides[key as keyof Output]!();
      } else {
        // Garbage defaults
        if (def instanceof z.ZodBoolean) result[key] = false;
        else if (def instanceof z.ZodNumber) result[key] = faker.number.int();
        else if (def instanceof z.ZodString || def instanceof z.ZodLiteral)
          result[key] = faker.lorem.word();
        else if (def instanceof z.ZodArray) result[key] = [faker.lorem.word()];
        else result[key] = faker.lorem.words(2);
      }
    }

    return result;
  };
}