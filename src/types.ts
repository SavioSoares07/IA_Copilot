export interface Report {
  kind: "requirement" | "bug";
  description: string;
}

export interface HealSuggestion {
  diagnosis: string;
  suggested_fix: string;
}

export interface DashboardData {
  tests: TestEntry[];
  suggestions: SuggestionEntry[];
}

export interface TestEntry {
  fileName: string;
  createdAt: string;
}

export interface SuggestionEntry {
  fileName: string;
  testName: string;
  diagnosis: string;
  suggestedFix: string;
  createdAt: string;
}
