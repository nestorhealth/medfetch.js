#!/usr/bin/env node

import { Command } from 'commander';
import { createSuggestManifestCommand } from '../dist/cli/suggest-manifest.js';

const program = new Command();

program
  .name('medfetch')
  .description('CLI for MedFetch healthcare data tools')
  .version('0.1.0');

// Add the suggest-manifest command
program.addCommand(createSuggestManifestCommand());

// Parse command line arguments
program.parse(); 