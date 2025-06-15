# Hospital Data Cleaning Showcase

This directory contains a showcase implementation of hospital data cleaning functionality, demonstrating how to process and clean hospital data using FHIR resources.

## Directory Structure

- `components/`: React components for the cleaning UI
- `utils/`: Utility functions for data processing
- `data/`: Sample data and manifest files

## Features

- FHIR resource validation and cleaning
- Patient and Procedure data processing
- Interactive data cleaning interface
- Sample data for testing

## Usage

The showcase provides a UI for:
1. Uploading hospital data
2. Viewing and editing FHIR resources
3. Running cleaning operations
4. Exporting cleaned data

## Implementation Details

The cleaning process follows these steps:
1. Data ingestion from FHIR resources
2. Schema validation using manifest definitions
3. Data cleaning and transformation
4. Storage in SQLite database
5. Export to cleaned format

## Dependencies

- React for UI components
- SQLite for data storage
- FHIR.js for resource validation
- JSON Schema for data validation 