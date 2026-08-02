import { Link } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import PageTransition from '@/components/PageTransition';
import PageSEO from '@/components/PageSEO';
import ScrollReveal from '@/components/ScrollReveal';
import Icon3D from '@/components/Icon3D';
import { useLocalizedPath } from '@/hooks/useLocalizedNavigate';
import { FileText, Lightbulb, Boxes, Download, User, ArrowRight } from 'lucide-react';

const sections = [
  { path: '/explore/articles', label: 'Articles', desc: 'Long-form essays on product design, UX and systems.', icon: FileText, variant: 'primary' },
  { path: '/explore/thinking', label: 'Thinking', desc: 'Short opinion pieces, teardowns and design lessons.', icon: Lightbulb, variant: 'violet' },
  { path: '/explore/architecture', label: 'Architecture', desc: 'PRDs, system design, user flows and decision logs.', icon: Boxes, variant: 'teal' },
  { path: '/explore/resources', label: 'Resources', desc: 'Templates, checklists, kits and downloads.', icon: Download, variant: 'blue' },
  { path: '/about', label: 'About', desc: 'Background, experience and how I work.', icon: User, variant: 'amber' },
] as const;

const ExploreHub = () => {
  const localizedPath = useLocalizedPath();
  return (
    <>
      <Navigation />
      <PageSEO
        title="Explore — Articles, Thinking, Architecture & Resources"
        description="A product design knowledge hub: long-form articles, short thinking pieces, systems architecture documents and free downloadable resources."
        path="/explore"
      />
      <PageTransition>
        <main className="min-h-screen pt-14">
          <section className="section-padding">
            <div className="container-custom max-w-4xl">
              <ScrollReveal>
                <h1 className="text-3xl md:text-4xl font-bold mb-4">Explore</h1>
                <p className="text-lg text-muted-foreground mb-12 max-w-2xl">
                  Everything I write, document and share — organised so you can find the depth you need.
                </p>
              </ScrollReveal>
              <div className="grid sm:grid-cols-2 gap-4">
                {sections.map(s => (
                  <ScrollReveal key={s.path}>
                    <Link
                      to={localizedPath(s.path)}
                      className="card-elegant p-6 flex items-start gap-4 hover:border-primary/40 transition-colors h-full group"
                    >
                      <Icon3D variant={s.variant as never} size="sm"><s.icon /></Icon3D>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <h2 className="text-base font-semibold">{s.label}</h2>
                          <ArrowRight className="w-4 h-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{s.desc}</p>
                      </div>
                    </Link>
                  </ScrollReveal>
                ))}
              </div>
            </div>
          </section>
        </main>
      </PageTransition>
      <Footer />
    </>
  );
};

export default ExploreHub;
