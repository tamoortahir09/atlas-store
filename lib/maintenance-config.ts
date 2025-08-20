// Maintenance Configuration
// This file controls which pages are redirected to maintenance in production

export interface MaintenanceConfig {
  enabled: boolean;
  pages: string[];
  excludePaths: string[];
}

export const maintenanceConfig: MaintenanceConfig = {
  // Set to true to enable maintenance mode redirects in production
  enabled: true,
  
  // Pages that should be redirected to maintenance
  // These are the exact paths that will be checked
  pages: [
    '/leaderboards',
    '/clans',
    '/servers',
    '/maps',
    '/support',
    '/support/report-cheater',
    '/support/general-ticket',
    '/support/bug-report',
    '/support/rules',
    '/support/faq',
    '/support/discord',
    '/support/staff-application',
  ],
  
  // Paths to exclude from maintenance redirects
  // These will never be redirected even if they match the pages above
  excludePaths: [
    '/maintenance',
    '/api',
    '/_next',
    '/favicon.ico',
    '/logo',
    '/Emblems',
    '/hero',
    '/linking',
    '/Media',
    '/Socials',
    '/store',
    '/3D-assets',
  ]
};

// Helper function to check if a path should be redirected to maintenance
export function shouldRedirectToMaintenance(pathname: string): boolean {
  // Only apply in production
  if (process.env.NODE_ENV !== 'production') {
    return false;
  }
  
  // Check if maintenance mode is enabled
  if (!maintenanceConfig.enabled) {
    return false;
  }
  
  // Check if path is in exclude list
  const isExcluded = maintenanceConfig.excludePaths.some(excludePath => 
    pathname.startsWith(excludePath)
  );
  
  if (isExcluded) {
    return false;
  }
  
  // Check if path matches any maintenance pages
  return maintenanceConfig.pages.some(page => {
    // Exact match or starts with the page path (for nested routes)
    return pathname === page || pathname.startsWith(page + '/');
  });
}

// Helper function to get all maintenance pages (for debugging)
export function getMaintenancePages(): string[] {
  return maintenanceConfig.pages;
}

// Helper function to check if maintenance mode is enabled
export function isMaintenanceModeEnabled(): boolean {
  return process.env.NODE_ENV === 'production' && maintenanceConfig.enabled;
} 