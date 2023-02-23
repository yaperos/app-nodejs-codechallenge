import { ArgumentNode, ASTNode, DirectiveNode, FieldNode, GraphQLArgument, GraphQLDirective, GraphQLField, GraphQLInputType, GraphQLObjectType, SelectionSetNode, SourceLocation, ValueNode, VariableNode } from "graphql";
import { CompilationContext } from "./execution";
import { Maybe } from "./types";
export interface JitFieldNode extends FieldNode {
    __internalShouldInclude?: string;
}
export interface FieldsAndNodes {
    [key: string]: JitFieldNode[];
}
/**
 * Given a selectionSet, adds all of the fields in that selection to
 * the passed in map of fields, and returns it at the end.
 *
 * CollectFields requires the "runtime type" of an object. For a field which
 * returns an Interface or Union type, the "runtime type" will be the actual
 * Object type returned by that field.
 */
export declare function collectFields(compilationContext: CompilationContext, runtimeType: GraphQLObjectType, selectionSet: SelectionSetNode, fields: FieldsAndNodes, visitedFragmentNames: {
    [key: string]: boolean;
}): FieldsAndNodes;
/**
 * Resolves the field on the given source object. In particular, this
 * figures out the value that the field returns by calling its resolve function,
 * then calls completeValue to complete promises, serialize scalars, or execute
 * the sub-selection-set for objects.
 */
export declare function resolveFieldDef(compilationContext: CompilationContext, parentType: GraphQLObjectType, fieldNodes: FieldNode[]): Maybe<GraphQLField<any, any>>;
/**
 * A memoized collection of relevant subfields in the context of the return
 * type. Memoizing ensures the subfields are not repeatedly calculated, which
 * saves overhead when resolving lists of values.
 */
export declare const collectSubfields: (compilationContext: CompilationContext, returnType: GraphQLObjectType, fieldNodes: FieldNode[]) => {
    [key: string]: FieldNode[];
};
declare type ResponsePathType = "variable" | "literal" | "meta";
export interface ObjectPath {
    prev: ObjectPath | undefined;
    key: string;
    type: ResponsePathType;
}
interface MissingVariablePath {
    valueNode: VariableNode;
    path?: ObjectPath;
    argument?: {
        definition: GraphQLArgument;
        node: ArgumentNode;
    };
}
export interface Arguments {
    values: {
        [argument: string]: any;
    };
    missing: MissingVariablePath[];
}
/**
 * Prepares an object map of argument values given a list of argument
 * definitions and list of argument AST nodes.
 *
 * Note: The returned value is a plain Object with a prototype, since it is
 * exposed to user code. Care should be taken to not pull values from the
 * Object prototype.
 */
export declare function getArgumentDefs(def: GraphQLField<any, any> | GraphQLDirective, node: FieldNode | DirectiveNode): Arguments;
interface ASTValueWithVariables {
    value: object | string | boolean | symbol | number | null | any[];
    variables: MissingVariablePath[];
}
interface ASTValue {
    value: object | string | boolean | symbol | number | null | any[];
}
export declare function valueFromAST(valueNode: ValueNode, type: GraphQLInputType): undefined | ASTValue | ASTValueWithVariables;
export declare function computeLocations(nodes: ASTNode[]): SourceLocation[];
export declare function addPath(responsePath: ObjectPath | undefined, key: string, type?: ResponsePathType): ObjectPath;
export declare function flattenPath(path: ObjectPath): Array<{
    key: string;
    type: ResponsePathType;
}>;
export {};
