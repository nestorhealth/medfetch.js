'use client';

import React, { useEffect } from 'react';
import { ModuleRegistry, AllCommunityModule, Module } from 'ag-grid-community';
import { AllEnterpriseModule, LicenseManager } from 'ag-grid-enterprise';

// Initialize AG Grid modules - this runs once when the module is loaded
if (typeof window !== 'undefined') {
  try {
    // Register both Community and Enterprise modules
    // Using type assertion to handle version mismatch
    ModuleRegistry.registerModules([
      AllCommunityModule,
      AllEnterpriseModule as unknown as Module
    ]);
    console.log('AG Grid modules registered successfully');
  } catch (error) {
    console.error('Failed to register AG Grid modules:', error);
  }
}

export function AGGridProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Initialize license key on the client side
    const licenseKey = process.env.NEXT_PUBLIC_AG_GRID_LICENSE_KEY;
    if (!licenseKey) {
      console.warn('AG Grid Enterprise license key not found. Some features may be limited.');
      return;
    }

    try {
      LicenseManager.setLicenseKey(licenseKey);
      console.log('AG Grid Enterprise license initialized successfully');
    } catch (error) {
      console.error('Failed to initialize AG Grid Enterprise license:', error);
    }
  }, []);

  return <>{children}</>;
} 