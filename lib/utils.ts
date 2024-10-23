// lib/utils.ts

// Utility function to format strings for data-cy attributes
export const formatForDataCy = (text: string): string => text.trim().replace(/\s+/g, "-").toLowerCase();

