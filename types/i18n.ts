import type {AbstractIntlMessages} from 'next-intl';

// Import the English messages as the source of truth for types
import enMessages from '@/messages/en.json';

// Define the structure of our messages
export type Messages = typeof enMessages;

// Define the available locales
export type Locale = 'en' | 'ar' | 'fr' | 'fa';

// Define the available namespaces (top-level keys in messages)
export type MessageKeys = keyof Messages;

// Helper type to get nested keys from a namespace
export type NestedKeyOf<ObjectType extends Record<string, any>> = {
  [Key in keyof ObjectType & (string | number)]: ObjectType[Key] extends Record<string, any>
    ? `${Key}` | `${Key}.${NestedKeyOf<ObjectType[Key]>}`
    : `${Key}`;
}[keyof ObjectType & (string | number)];

// Type for translation keys within a specific namespace
export type TranslationKeys<Namespace extends MessageKeys> = 
  Messages[Namespace] extends Record<string, any>
    ? NestedKeyOf<Messages[Namespace]>
    : never;

// Declare module augmentation for next-intl
declare global {
  interface IntlMessages extends Messages {}
}

export {};
