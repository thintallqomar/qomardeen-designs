import CaseStudyView from '@/components/caseStudy/CaseStudyView';
import { UNWIND_CASE_STUDY as cs } from '@/content/builtInCaseStudies';

/**
 * Built-in page. The content lives in src/content/builtInCaseStudies.ts and is drawn by the same
 * CaseStudyView as admin-made case studies. Once it is imported into the admin and published,
 * the admin copy is shown instead (see ProjectRoute in App.tsx).
 */
const WellnessProject = () => (
  <CaseStudyView
    slug={cs.slug}
    title={cs.title}
    lead={cs.lead}
    seoTitle={cs.seoTitle}
    seoDescription={cs.seoDescription}
    body={cs.body}
  />
);

export default WellnessProject;
