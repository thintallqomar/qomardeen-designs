import { Palette, Smartphone, Users, Layers } from 'lucide-react';
import { motion } from 'framer-motion';
import ScrollReveal from './ScrollReveal';
import StaggeredReveal from './StaggeredReveal';
import Icon3D from './Icon3D';

const Skills = () => {
  const skillCategories = [
    {
      title: "Product Design",
      icon: <Smartphone />,
      variant: 'blue' as const,
      skills: ["UI Design", "UX Research", "Wireframing", "Prototyping", "Interaction Design"]
    },
    {
      title: "Systems & Process",
      icon: <Layers />,
      variant: 'violet' as const,
      skills: ["Design Systems", "Component Libraries", "Information Architecture", "Dashboard Design"]
    },
    {
      title: "Collaboration",
      icon: <Users />,
      variant: 'emerald' as const,
      skills: ["Cross-functional Communication", "Stakeholder Alignment", "Iterative Design"]
    }
  ];

  const tools = [
    { name: "Figma", level: 90 },
    { name: "Adobe XD", level: 75 },
    { name: "Illustrator", level: 70 },
    { name: "AI Tools (ChatGPT, Gemini, Cursor, Claude)", level: 85 }
  ];

  return (
    <section id="skills" className="section-padding">
      <div className="container-custom">
        <div className="max-w-6xl mx-auto">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Skills & Expertise</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Core competencies in product design, systems thinking, and cross-functional collaboration
              </p>
            </div>
          </ScrollReveal>

          <StaggeredReveal className="grid md:grid-cols-3 gap-6 mb-16" staggerDelay={0.12} equalHeight>
            {skillCategories.map((category, index) => (
              <motion.div
                key={index}
                className="card-elegant group h-full flex flex-col"
                whileHover={{ y: -4, boxShadow: 'var(--shadow-lg)' }}
                transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
              >
                <Icon3D variant={category.variant} size="lg" className="mb-4 group-hover:scale-110 transition-transform duration-300">
                  {category.icon}
                </Icon3D>
                <h3 className="text-lg font-semibold mb-4">{category.title}</h3>
                <div className="space-y-2">
                  {category.skills.map((skill, skillIndex) => (
                    <div key={skillIndex} className="skill-tag">{skill}</div>
                  ))}
                </div>
              </motion.div>
            ))}
          </StaggeredReveal>

          <ScrollReveal delay={0.1}>
            <div className="bg-muted/30 rounded-2xl p-8">
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-3 mb-4">
                  <Icon3D variant="rose" size="sm">
                    <Palette />
                  </Icon3D>
                  <h3 className="text-2xl font-semibold">Tools & Software</h3>
                </div>
                <p className="text-muted-foreground">
                  Proficiency levels with design and collaboration tools
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                {tools.map((tool, index) => (
                  <motion.div
                    key={index}
                    className="flex items-center justify-between p-4 bg-background rounded-lg border border-border"
                    initial={{ opacity: 0, x: -12 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.08, duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
                  >
                    <span className="font-medium">{tool.name}</span>
                    <div className="flex items-center gap-3">
                      <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-gradient-primary rounded-full"
                          initial={{ width: 0 }}
                          whileInView={{ width: `${tool.level}%` }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.3 + index * 0.1, duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
                        />
                      </div>
                      <span className="text-sm text-muted-foreground w-8">{tool.level}%</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};

export default Skills;
