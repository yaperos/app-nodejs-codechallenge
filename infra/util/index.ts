export function getCdkPropsFromCustomProps(props: any) {
  return {
    env: {
      account: props.account,
      region: props.region,
    },
    stackName: props.name,
  };
}

export function getResourceNameWithPrefix(resourceName: string) {
  return `yape-${resourceName}`;
}

export function getStackNameWithPrefix(resourceName: string) {
  return `yape-infra-${resourceName}`;
}
