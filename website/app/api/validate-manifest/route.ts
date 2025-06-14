import { NextRequest, NextResponse } from 'next/server';
import { loadManifest, ManifestValidationError } from 'medfetch';

interface ValidationError {
  instancePath: string;
  message: string;
}

export async function POST(request: NextRequest) {
  try {
    const yamlText = await request.text();
    
    // Create a temporary URL for the manifest content
    const blob = new Blob([yamlText], { type: 'application/yaml' });
    const url = URL.createObjectURL(blob);

    try {
      await loadManifest(url);
      return NextResponse.json({ valid: true });
    } catch (error: unknown) {
      if (error instanceof ManifestValidationError) {
        return NextResponse.json({
          valid: false,
          errors: error.errors.map((e: ValidationError) => `${e.instancePath} ${e.message}`)
        }, { status: 400 });
      }
      throw error;
    } finally {
      URL.revokeObjectURL(url);
    }
  } catch (error: unknown) {
    return NextResponse.json({
      valid: false,
      message: error instanceof Error ? error.message : 'Unknown error occurred'
    }, { status: 500 });
  }
} 