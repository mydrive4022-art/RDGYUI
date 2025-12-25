
export interface ClipartImage {
  id: string;
  file: File;
  previewUrl: string;
  status: 'pending' | 'processing' | 'done' | 'error';
  resultUrl?: string;
  transparentUrl?: string; // Storing the raw transparent version from AI
  error?: string;
  originalWidth?: number;
  originalHeight?: number;
}

export interface ProcessingOptions {
  edgeSmoothing: boolean;
  transparencyThreshold: number;
  autoRefine: boolean;
  backgroundColor: string; // Hex color or 'transparent'
}
