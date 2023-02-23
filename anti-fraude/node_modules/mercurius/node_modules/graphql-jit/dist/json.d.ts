import { JSONSchema6 } from "json-schema";
import { CompilationContext } from "./execution";
/**
 * GQL -> JSON Schema transform
 *
 * @param compilationContext
 * @return     {object}  A plain JavaScript object which conforms to JSON Schema
 */
export declare function queryToJSONSchema(compilationContext: CompilationContext): JSONSchema6;
