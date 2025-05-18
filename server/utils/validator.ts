import type { Schema } from "joi";
import oplog from "../oplog/oplog";

export function validateDataUsingJOI<T>(
  data: any,
  joiSchema: Schema
): T | Error {
  const result = joiSchema.validate(data);

  if (result.error) {
    oplog.error("error validating data: " + result.error.message);

    return Error(result.error.message);
  }

  return result.value;
}
