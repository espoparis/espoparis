import {createNavigation} from 'next-intl/navigation';
import {routing} from '@/i18n/routing';

// Create locale-aware navigation utilities
export const {Link, redirect, usePathname, useRouter, getPathname} = 
  createNavigation(routing);
