import { createWriteStream } from 'fs';
import { readFileSync, existsSync, mkdirSync, readdirSync, writeFileSync } from 'fs';
import { join, basename, extname } from 'path';
import archiver from 'archiver';
import { CleaningResult } from './fhirDataCleaner';

// Seed Dataset Creator Types
export interface SeedDataset {
  id: string;
  studyTitle: string;
  principalInvestigator: string;
  createdAt: string;
  status: 'processing' | 'ready' | 'downloaded';
  filePath: string;
  fileSize: number;
  resourceTypes: string[];
  totalRecords: number;
  metadata: {
    irbData: any;
    queryResults: any[];
    cleaningResults: CleaningResult[];
  };
}

export interface CreateSeedResult {
  success: boolean;
  seedId: string;
  filePath: string;
  fileSize: number;
  error?: string;
}

// In-memory storage for demo purposes (in production, use a database)
const seedDatasets: Map<string, SeedDataset> = new Map();

// File-based storage for seed dataset persistence
const SEED_STORAGE_FILE = join(process.cwd(), 'data', 'seedDatasets.json');

// Ensure data directory exists
function ensureDataDirectory(): void {
  const dataDir = join(process.cwd(), 'data');
  if (!existsSync(dataDir)) {
    mkdirSync(dataDir, { recursive: true });
  }
}

// Save seed datasets to file
function saveSeedDatasetsToFile(): void {
  try {
    ensureDataDirectory();
    const datasets = Array.from(seedDatasets.values());
    writeFileSync(SEED_STORAGE_FILE, JSON.stringify(datasets, null, 2));
  } catch (error) {
    console.error('Error saving seed datasets to file:', error);
  }
}

// Load seed datasets from file
function loadSeedDatasetsFromFile(): void {
  try {
    if (existsSync(SEED_STORAGE_FILE)) {
      const data = readFileSync(SEED_STORAGE_FILE, 'utf8');
      const datasets: SeedDataset[] = JSON.parse(data);
      
      datasets.forEach(dataset => {
        seedDatasets.set(dataset.id, dataset);
      });
      
      console.log(`📦 Loaded ${datasets.length} seed datasets from storage`);
    }
  } catch (error) {
    console.error('Error loading seed datasets from file:', error);
  }
}

// Load seed datasets on startup
loadSeedDatasetsFromFile();

// Helper function to generate unique study ID
function generateStudyId(): string {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  return `study_${timestamp}_${random}`;
}

// Helper function to get file size in bytes
function getFileSize(filePath: string): number {
  try {
    const stats = require('fs').statSync(filePath);
    return stats.size;
  } catch (error) {
    return 0;
  }
}

// Helper function to format file size for display
function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Helper function to read CSV file and return preview data
function getCSVPreview(filePath: string, maxRows: number = 5): { headers: string[]; rows: string[][] } {
  try {
    if (!existsSync(filePath)) {
      return { headers: [], rows: [] };
    }

    const content = readFileSync(filePath, 'utf-8');
    const lines = content.split('\n').filter(line => line.trim());
    
    if (lines.length === 0) {
      return { headers: [], rows: [] };
    }

    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
    const rows = lines.slice(1, maxRows + 1).map(line => 
      line.split(',').map(cell => cell.trim().replace(/"/g, ''))
    );

    return { headers, rows };
  } catch (error) {
    console.error('Error reading CSV preview:', error);
    return { headers: [], rows: [] };
  }
}

// Helper function to count total records across all CSV files
function countTotalRecords(csvDir: string): number {
  try {
    if (!existsSync(csvDir)) return 0;

    const files = readdirSync(csvDir).filter(file => file.endsWith('.csv'));
    let totalRecords = 0;

    files.forEach(file => {
      const filePath = join(csvDir, file);
      const content = readFileSync(filePath, 'utf-8');
      const lines = content.split('\n').filter(line => line.trim());
      // Subtract 1 for header row
      totalRecords += Math.max(0, lines.length - 1);
    });

    return totalRecords;
  } catch (error) {
    console.error('Error counting records:', error);
    return 0;
  }
}

// Main function to create a seed dataset
export async function createSeedDataset(
  csvDir: string = 'cleaned-data',
  studyTitle: string = 'Research Study',
  principalInvestigator: string = 'Dr. Researcher',
  metadata: any = {}
): Promise<CreateSeedResult> {
  try {
    console.log('📦 Creating seed dataset...');
    console.log(`📁 Source directory: ${csvDir}`);
    console.log(`📋 Study: ${studyTitle}`);

    // Check if CSV directory exists
    if (!existsSync(csvDir)) {
      throw new Error(`CSV directory not found: ${csvDir}`);
    }

    // Get all CSV files
    const csvFiles = readdirSync(csvDir)
      .filter(file => file.endsWith('.csv'))
      .map(file => join(csvDir, file));

    if (csvFiles.length === 0) {
      throw new Error('No CSV files found in the directory');
    }

    console.log(`📊 Found ${csvFiles.length} CSV files to bundle`);

    // Generate unique study ID
    const seedId = generateStudyId();
    
    // Create public/seeds directory
    const seedsDir = join(process.cwd(), 'public', 'seeds');
    if (!existsSync(seedsDir)) {
      mkdirSync(seedsDir, { recursive: true });
    }

    // Create ZIP file path
    const zipFileName = `${seedId}.zip`;
    const zipFilePath = join(seedsDir, zipFileName);

    // Create ZIP archive
    const output = createWriteStream(zipFilePath);
    const archive = archiver('zip', {
      zlib: { level: 9 } // Maximum compression
    });

    // Handle archive events
    archive.pipe(output);

    archive.on('warning', (err) => {
      if (err.code === 'ENOENT') {
        console.warn('Archive warning:', err);
      } else {
        throw err;
      }
    });

    archive.on('error', (err) => {
      throw err;
    });

    // Add CSV files to archive
    csvFiles.forEach(file => {
      const fileName = basename(file);
      console.log(`📎 Adding to archive: ${fileName}`);
      archive.file(file, { name: fileName });
    });

    // Add metadata file
    const metadataContent = {
      studyId: seedId,
      studyTitle,
      principalInvestigator,
      createdAt: new Date().toISOString(),
      totalFiles: csvFiles.length,
      files: csvFiles.map(file => basename(file)),
      metadata
    };

    archive.append(JSON.stringify(metadataContent, null, 2), { name: 'metadata.json' });

    // Finalize the archive
    await new Promise<void>((resolve, reject) => {
      output.on('close', () => {
        console.log('✅ Archive created successfully');
        resolve();
      });
      
      archive.on('error', (err) => {
        reject(err);
      });
      
      archive.finalize();
    });

    // Get file size
    const fileSize = getFileSize(zipFilePath);
    console.log(`📦 Archive size: ${formatFileSize(fileSize)}`);

    // Count total records
    const totalRecords = countTotalRecords(csvDir);
    console.log(`📊 Total records: ${totalRecords}`);

    // Extract resource types from file names
    const resourceTypes = csvFiles.map(file => 
      basename(file, extname(file))
    );

    // Create seed dataset record
    const seedDataset: SeedDataset = {
      id: seedId,
      studyTitle,
      principalInvestigator,
      createdAt: new Date().toISOString(),
      status: 'ready',
      filePath: zipFilePath,
      fileSize,
      resourceTypes,
      totalRecords,
      metadata
    };

    // Store in memory and save to file
    seedDatasets.set(seedId, seedDataset);
    saveSeedDatasetsToFile();

    console.log(`🎉 Seed dataset created: ${seedId}`);
    console.log(`📁 File: ${zipFilePath}`);
    console.log(`📊 Resources: ${resourceTypes.join(', ')}`);
    console.log(`📈 Records: ${totalRecords}`);

    return {
      success: true,
      seedId,
      filePath: zipFilePath,
      fileSize
    };

  } catch (error) {
    console.error('❌ Error creating seed dataset:', error);
    return {
      success: false,
      seedId: '',
      filePath: '',
      fileSize: 0,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

// Function to load existing seed datasets from ZIP files
export function loadExistingSeedDatasets(): void {
  try {
    const seedsDir = join(process.cwd(), 'public', 'seeds');
    if (!existsSync(seedsDir)) {
      return;
    }

    const files = readdirSync(seedsDir).filter(file => file.endsWith('.zip'));
    
    files.forEach(file => {
      const seedId = basename(file, '.zip');
      
      // Skip if already loaded
      if (seedDatasets.has(seedId)) {
        return;
      }

      const zipFilePath = join(seedsDir, file);
      const fileSize = getFileSize(zipFilePath);
      
      // Try to extract basic info from filename or create default
      const parts = seedId.split('_');
      const timestamp = parts.length > 1 ? parseInt(parts[1]) : Date.now();
      
      // Create a basic seed dataset record
      const seedDataset: SeedDataset = {
        id: seedId,
        studyTitle: `Study ${seedId}`,
        principalInvestigator: 'Dr. Researcher',
        createdAt: new Date(timestamp).toISOString(),
        status: 'ready',
        filePath: zipFilePath,
        fileSize,
        resourceTypes: ['Unknown'], // Will be updated when we can read the ZIP
        totalRecords: 0, // Will be updated when we can read the ZIP
        metadata: {
          irbData: {},
          queryResults: [],
          cleaningResults: []
        }
      };

      seedDatasets.set(seedId, seedDataset);
      console.log(`📦 Loaded existing seed dataset: ${seedId}`);
    });
  } catch (error) {
    console.error('Error loading existing seed datasets:', error);
  }
}

// Function to get all seed datasets
export function getAllSeedDatasets(): SeedDataset[] {
  // Check for new ZIP files that might have been created by workflows
  syncSeedDatasetsFromFiles();
  
  // Return datasets sorted by creation date
  return Array.from(seedDatasets.values()).sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

// Function to sync seed datasets from existing ZIP files
function syncSeedDatasetsFromFiles(): void {
  try {
    const seedsDir = join(process.cwd(), 'public', 'seeds');
    if (!existsSync(seedsDir)) {
      return;
    }

    const files = readdirSync(seedsDir).filter(file => file.endsWith('.zip'));
    
    files.forEach(file => {
      const seedId = basename(file, '.zip');
      
      // Skip if already loaded
      if (seedDatasets.has(seedId)) {
        return;
      }

      const zipFilePath = join(seedsDir, file);
      const fileSize = getFileSize(zipFilePath);
      
      // Try to extract basic info from filename or create default
      const parts = seedId.split('_');
      const timestamp = parts.length > 1 ? parseInt(parts[1]) : Date.now();
      
      // Create a basic seed dataset record
      const seedDataset: SeedDataset = {
        id: seedId,
        studyTitle: `Study ${seedId}`,
        principalInvestigator: 'Dr. Researcher',
        createdAt: new Date(timestamp).toISOString(),
        status: 'ready',
        filePath: zipFilePath,
        fileSize,
        resourceTypes: ['Unknown'], // Will be updated when we can read the ZIP
        totalRecords: 0, // Will be updated when we can read the ZIP
        metadata: {
          irbData: {},
          queryResults: [],
          cleaningResults: []
        }
      };

      seedDatasets.set(seedId, seedDataset);
      console.log(`📦 Synced new seed dataset: ${seedId}`);
    });
    
    // Save any new datasets to file
    if (files.length > 0) {
      saveSeedDatasetsToFile();
    }
  } catch (error) {
    console.error('Error syncing seed datasets from files:', error);
  }
}

// Function to get a specific seed dataset
export function getSeedDataset(seedId: string): SeedDataset | null {
  return seedDatasets.get(seedId) || null;
}

// Function to get CSV preview for a specific file
export function getSeedCSVPreview(seedId: string, fileName: string, maxRows: number = 5) {
  const seed = getSeedDataset(seedId);
  if (!seed) {
    return null;
  }

  // Extract the original CSV directory from metadata
  const csvDir = 'cleaned-data'; // This would be stored in metadata in a real implementation
  const csvPath = join(csvDir, fileName);
  
  return getCSVPreview(csvPath, maxRows);
}

// Function to mark seed dataset as downloaded
export function markSeedDownloaded(seedId: string): boolean {
  const seed = seedDatasets.get(seedId);
  if (seed) {
    seed.status = 'downloaded';
    saveSeedDatasetsToFile();
    return true;
  }
  return false;
}

// Function to delete a seed dataset
export function deleteSeedDataset(seedId: string): boolean {
  const seed = seedDatasets.get(seedId);
  if (seed) {
    try {
      // Delete the ZIP file
      if (existsSync(seed.filePath)) {
        require('fs').unlinkSync(seed.filePath);
      }
      
      // Remove from memory and save to file
      seedDatasets.delete(seedId);
      saveSeedDatasetsToFile();
      
      console.log(`🗑️ Deleted seed dataset: ${seedId}`);
      return true;
    } catch (error) {
      console.error('Error deleting seed dataset:', error);
      return false;
    }
  }
  return false;
}

// Function to get storage statistics
export function getStorageStats() {
  const seeds = getAllSeedDatasets();
  const totalSize = seeds.reduce((sum, seed) => sum + seed.fileSize, 0);
  const totalRecords = seeds.reduce((sum, seed) => sum + seed.totalRecords, 0);
  
  return {
    totalDatasets: seeds.length,
    totalSize,
    totalSizeFormatted: formatFileSize(totalSize),
    totalRecords,
    readyDatasets: seeds.filter(s => s.status === 'ready').length,
    downloadedDatasets: seeds.filter(s => s.status === 'downloaded').length
  };
} 