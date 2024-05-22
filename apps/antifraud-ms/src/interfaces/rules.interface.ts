export interface RootRules {
  'fraud-rules': Rule[];
}

export interface Rule {
  name: string;
  description: string;
  condition: string;
  value: number;
  enabled: boolean;
}
