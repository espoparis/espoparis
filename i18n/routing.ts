import {defineRouting} from 'next-intl/routing';

export const routing = defineRouting({
  // All supported locales
  locales: ['en', 'ar', 'fr', 'fa'],
  
  // Default locale (won't show in URL)
  defaultLocale: 'en',
  
  // Locale prefix strategy
  localePrefix: {
    mode: 'as-needed',
    prefixes: {
      // Default locale doesn't need prefix
      // Other locales will show in URL: /ar, /fr, /fa
    }
  }
});
