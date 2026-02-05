import { Palette, Smartphone, Users, Layers } from 'lucide-react';
import ScrollReveal from './ScrollReveal';
import StaggeredReveal from './StaggeredReveal';

const Skills = () => {
  const skillCategories = [
    {
      title: "Product Design",
      icon: <Smartphone className="w-6 h-6" />,
      skills: [
        "UI Design",
        "UX Research",
        "Wireframing",
        "Prototyping", 
        "Interaction Design"
      ]
    },
    {
      title: "Systems & Process",
      icon: <Layers className="w-6 h-6" />,
      skills: [
        "Design Systems",
        "Component Libraries",
        "Information Architecture",
        "Dashboard Design"
      ]
    },
    {
      title: "Collaboration",
      icon: <Users className="w-6 h-6" />,
      skills: [
        "Cross-functional Communication",
        "Stakeholder Alignment",
        "Iterative Design"
      ]
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
          {/* Section Header */}
          <ScrollReveal className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-sm font-medium text-primary mb-4">
              <Palette className="w-4 h-4" />
              Expertise
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Skills & Expertise</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Core competencies in product design, systems thinking, and cross-functional collaboration
            </p>
          </ScrollReveal>

          {/* Skills Categories */}
          <StaggeredReveal staggerDelay={0.15} className="grid md:grid-cols-3 gap-6 mb-16">
            {skillCategories.map((category, index) => (
              <div key={index} className="card-elegant group hover:border-primary/20 transition-all duration-300">
                <div className="inline-flex p-3 rounded-lg bg-primary/10 text-primary mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                  {category.icon}
                </div>
                
                <h3 className="text-lg font-semibold mb-4">{category.title}</h3>
                
                <div className="space-y-2">
                  {category.skills.map((skill, skillIndex) => (
                    <div key={skillIndex} className="skill-tag">
                      {skill}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </StaggeredReveal>

          {/* Tools & Software */}
          <ScrollReveal delay={0.2}>
            <div className="bg-muted/30 rounded-2xl p-8">
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 mb-4">
                  <Palette className="w-6 h-6 text-primary" />
                  <h3 className="text-2xl font-semibold">Tools & Software</h3>
                </div>
                <p className="text-muted-foreground">
                  Proficiency levels with design and collaboration tools
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                {tools.map((tool, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-background rounded-lg border border-border">
                    <span className="font-medium">{tool.name}</span>
                    <div className="flex items-center gap-3">
                      <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-primary rounded-full transition-all duration-1000 ease-out"
                          style={{ width: `${tool.level}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-muted-foreground w-8">{tool.level}%</span>
                    </div>
                  </div>
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
