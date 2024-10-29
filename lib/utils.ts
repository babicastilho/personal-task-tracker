// 
/**
 * lib/utils.ts
 * Utility functions for general formatting and data handling.
 * 
 * Contains functions to format strings for usage in data-cy attributes, ensuring consistency and
 * compatibility across different parts of the application.
 * 
 * @param text - The input string to be formatted.
 * @returns - A formatted string suitable for data-cy attribute usage.
 */

export const formatForDataCy = (text: string): string => text.trim().replace(/\s+/g, "-").toLowerCase();

