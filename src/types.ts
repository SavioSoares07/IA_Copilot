export interface Report {
  kind: "requirement" | "bug";
  description: string;
}

export interface HealSuggestion {
  diagnosis: string;
  suggested_fix: string;
}
