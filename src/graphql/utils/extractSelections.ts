import {GraphQLResolveInfo} from "graphql";

const getSelections = (info: GraphQLResolveInfo) => {
  return info.fieldNodes[0].selectionSet?.selections || null;
};

export const extractSelection = (info: GraphQLResolveInfo) => {
  const selections = getSelections(info);
  if (!selections) return [];

  return selections.reduce<string[]>((initialValue, selection) => {
    if (selection.kind === "Field") {
      return [...initialValue, selection.name.value];
    }
    return initialValue;
  }, []);
};
