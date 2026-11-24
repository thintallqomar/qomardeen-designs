/**
 * Personal photos for the About page (workspace, you out and about, PS5 setup...).
 * The photo row stays hidden until at least one is added. Put the files in src/assets/about/ and list them here:
 *
 *   import desk from '@/assets/about/desk.jpg';
 *   export const aboutPhotos = [{ src: desk, alt: 'My desk in Lagos' }];
 */
export interface AboutPhoto { src: string; alt: string }
export const aboutPhotos: AboutPhoto[] = [];
