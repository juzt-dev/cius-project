/**
 * Server Actions Barrel File
 * Centralized export for all Server Actions
 */

export { submitContactAction } from './contact';
export type { ContactFormData, ContactActionResult } from './contact';

export { submitCareersAction } from './careers';
export type { CareersFormData, CareersActionResult } from './careers';

export { submitReportAction } from './report';
export type { ReportFormData, ReportActionResult } from './report';
