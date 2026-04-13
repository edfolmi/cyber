/**
 * Type definitions for security analysis components
 */

export interface SecurityIssue {
  title: string;
  description: string;
  code: string;
  fix: string;
  cvss_score: number;
  severity: 'critical' | 'high' | 'medium' | 'low';
}

export interface AnalysisResponse {
  summary: string;
  issues: SecurityIssue[];
}

export interface FileUploadProps {
  fileName: string;
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onAnalyzeCode: () => void;
  isAnalyzing: boolean;
  hasCode: boolean;
  /** When true, upload/analyze are disabled (e.g. signed in but no active plan). */
  toolLocked?: boolean;
}

export interface CodeInputProps {
  codeContent: string;
  fileName: string;
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onAnalyzeCode: () => void;
  isAnalyzing: boolean;
  toolLocked?: boolean;
}

export interface AnalysisResultsProps {
  analysisResults: AnalysisResponse | null;
  isAnalyzing: boolean;
  error: string | null;
}