export interface InfraStackProps {
  projectName: string;
  region?: string;
}

export function createPlaceholderStack(props: InfraStackProps) {
  // Placeholder for CDK for Terraform stack factory. Replace with real constructs.
  return props;
}
