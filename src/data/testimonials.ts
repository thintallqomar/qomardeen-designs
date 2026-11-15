/**
 * Real testimonials shown on the Hire page.
 *
 * The section stays hidden until at least one entry is added here. Only add words that the person
 * actually wrote or approved, with their permission. Example entry (remove the comment marks to use):
 *
 *   {
 *     quote: 'Qomardeen turned a messy workflow into a clear, usable product.',
 *     name: 'Full Name',
 *     role: 'Their role',
 *     company: 'Their company',
 *     link: 'https://www.linkedin.com/in/their-profile',   // optional: where the recommendation lives
 *   },
 */
export interface Testimonial {
  quote: string;
  name: string;
  role?: string;
  company?: string;
  link?: string;
}

export const testimonials: Testimonial[] = [];
