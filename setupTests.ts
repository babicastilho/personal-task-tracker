// Import jest-dom's custom matchers
import '@testing-library/jest-dom';

// Polyfill for TextEncoder and TextDecoder
import { TextEncoder, TextDecoder } from 'util';

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder as typeof global.TextDecoder;

// Load environment variables from the .env.local file
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

// Additional global setups can be added here if needed
