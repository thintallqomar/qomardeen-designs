import { ExternalLink, Github, ArrowRight, Image, Layers, Users } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const Portfolio = () => {
  // Project data structure - ready for real projects
  const projects = [
    {
      id: 1,
      title: "E-commerce Mobile App",
      description: "A comprehensive mobile shopping experience with intuitive navigation, seamless checkout, and personalized recommendations.",
      thumbnail: "/placeholder.svg", // Replace with actual project image
      liveUrl: "https://example.com", // Replace with actual live URL
      githubUrl: "https://github.com/example", // Replace with actual GitHub URL (optional)
      technologies: ["Figma", "Prototyping", "User Research", "Mobile Design"],
      category: "Mobile App",
      status: "completed", // completed, in-progress, coming-soon
      featured: true
    },
    {
      id: 2,
      title: "SaaS Dashboard Design",
      description: "Clean and modern dashboard interface for a productivity SaaS platform with advanced data visualization and user management.",
      thumbnail: "/placeholder.svg", // Replace with actual project image
      liveUrl: "https://example.com", // Replace with actual live URL
      technologies: ["Figma", "Design Systems", "Data Visualization", "Web Design"],
      category: "Web Application",
      status: "completed",
      featured: true
    },
    {
      id: 3,
      title: "Fintech App Redesign",
      description: "Complete UX overhaul of a financial application focusing on user trust, accessibility, and simplified money management.",
      thumbnail: "/placeholder.svg", // Replace with actual project image
      liveUrl: "https://example.com", // Replace with actual live URL
      technologies: ["User Research", "Wireframing", "Accessibility", "Fintech"],
      category: "Mobile App",
      status: "completed",
      featured: false
    }
  ];

  const skills = [
    "User Research", "Wireframing", "Prototyping", "Visual Design", 
    "Design Systems", "Usability Testing", "Journey Mapping", "Fashion Design"
  ];

  // Filter projects by status
  const completedProjects = projects.filter(project => project.status === 'completed');
  const featuredProjects = projects.filter(project => project.featured && project.status === 'completed');
  
  return (
    <section id="portfolio" className="section-padding">
      <div className="container-custom">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Portfolio</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover my journey in product design through real-world projects that combine 
              user-centered design principles with creative problem-solving.
            </p>
          </div>

          {/* Featured Projects */}
          {featuredProjects.length > 0 && (
            <div className="mb-16">
              <h3 className="text-2xl font-semibold mb-8 text-center">Featured Work</h3>
              <div className="grid md:grid-cols-2 gap-8">
                {featuredProjects.map((project) => (
                  <Card key={project.id} className="group hover:shadow-elegant transition-all duration-300 overflow-hidden">
                    <div className="aspect-video bg-muted relative overflow-hidden">
                      <img 
                        src={project.thumbnail} 
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
                        <a 
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-primary inline-flex items-center gap-2"
                        >
                          <ExternalLink size={16} />
                          View Live
                        </a>
                        {project.githubUrl && (
                          <a 
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-outline inline-flex items-center gap-2 bg-background/90"
                          >
                            <Github size={16} />
                            Code
                          </a>
                        )}
                      </div>
                    </div>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-xl">{project.title}</CardTitle>
                        <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                          {project.category}
                        </span>
                      </div>
                      <CardDescription className="leading-relaxed">
                        {project.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {project.technologies.map((tech, index) => (
                          <span key={index} className="text-xs bg-secondary text-secondary-foreground px-3 py-1 rounded-full">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* All Projects Grid */}
          {completedProjects.length > 0 && (
            <div className="mb-16">
              <h3 className="text-2xl font-semibold mb-8 text-center">All Projects</h3>
              <div className="grid md:grid-cols-3 gap-6">
                {completedProjects.map((project) => (
                  <Card key={project.id} className="group hover:shadow-md transition-all duration-300 overflow-hidden">
                    <div className="aspect-video bg-muted relative overflow-hidden">
                      <img 
                        src={project.thumbnail} 
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-3 right-3">
                        <span className="text-xs bg-background/90 backdrop-blur-sm px-2 py-1 rounded-full border">
                          {project.category}
                        </span>
                      </div>
                    </div>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">{project.title}</CardTitle>
                      <CardDescription className="text-sm line-clamp-2">
                        {project.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="flex flex-wrap gap-1 mb-4">
                        {project.technologies.slice(0, 3).map((tech, index) => (
                          <span key={index} className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded">
                            {tech}
                          </span>
                        ))}
                        {project.technologies.length > 3 && (
                          <span className="text-xs text-muted-foreground px-2 py-1">
                            +{project.technologies.length - 3}
                          </span>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <a 
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 btn-primary text-center text-sm py-2 inline-flex items-center justify-center gap-2"
                        >
                          <ExternalLink size={14} />
                          View
                        </a>
                        {project.githubUrl && (
                          <a 
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-outline text-sm py-2 px-3 inline-flex items-center gap-2"
                          >
                            <Github size={14} />
                          </a>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Empty State - Show when no completed projects */}
          {completedProjects.length === 0 && (
            <div className="bg-gradient-subtle rounded-2xl p-12 mb-12 text-center border border-border">
              <div className="max-w-3xl mx-auto">
                <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Layers className="w-10 h-10 text-primary" />
                </div>
                
                <h3 className="text-2xl font-semibold mb-4">Portfolio Coming Soon</h3>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  I'm currently working on exciting projects that showcase the intersection of my fashion 
                  design background with modern UX/UI principles. Stay tuned for case studies and real-world applications.
                </p>
                
                <div className="grid md:grid-cols-3 gap-6 mb-8">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <Users className="w-6 h-6 text-primary" />
                    </div>
                    <h4 className="font-medium mb-2">User Research</h4>
                    <p className="text-sm text-muted-foreground">Understanding user needs and behaviors</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <Layers className="w-6 h-6 text-primary" />
                    </div>
                    <h4 className="font-medium mb-2">Design Systems</h4>
                    <p className="text-sm text-muted-foreground">Creating consistent, scalable designs</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <Image className="w-6 h-6 text-primary" />
                    </div>
                    <h4 className="font-medium mb-2">Visual Design</h4>
                    <p className="text-sm text-muted-foreground">Crafting beautiful, functional interfaces</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Skills Preview */}
          <div className="bg-muted/30 rounded-2xl p-8 mb-12">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-semibold mb-4">Skills I'm Developing</h3>
              <p className="text-muted-foreground">
                Core competencies I'm building through coursework and practical application
              </p>
            </div>
            
            <div className="flex flex-wrap justify-center gap-3">
              {skills.map((skill, index) => (
                <span key={index} className="skill-tag">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Fashion Background Showcase */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="card-elegant">
              <h3 className="text-xl font-semibold mb-4">Fashion Design Background</h3>
              <p className="text-muted-foreground mb-4 leading-relaxed">
                While I transition into product design, my fashion background continues to inform my approach. 
                The attention to detail, understanding of user needs (fit and comfort), and aesthetic sensibility 
                from fashion directly translate to creating better digital experiences.
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                  <span>Pattern drafting precision</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                  <span>User-centered approach (fit & comfort)</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                  <span>Aesthetic sensibility & visual hierarchy</span>
                </div>
              </div>
            </div>

            <div className="card-elegant">
              <h3 className="text-xl font-semibold mb-4">Current Learning Path</h3>
              <p className="text-muted-foreground mb-4 leading-relaxed">
                Through AltSchool Africa and self-directed learning, I'm building a comprehensive skill set 
                in product design, combining theoretical knowledge with hands-on project experience.
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                  <span>Design thinking methodology</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                  <span>User research & testing</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                  <span>Digital design tools mastery</span>
                </div>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center">
            <div className="max-w-2xl mx-auto">
              <h3 className="text-2xl font-semibold mb-4">Interested in My Journey?</h3>
              <p className="text-muted-foreground mb-8">
                Follow my transition from fashion to product design. I'll be sharing my learning process, 
                insights, and projects as they develop.
              </p>
              <button 
                onClick={() => {
                  const element = document.querySelector('#contact');
                  if (element) element.scrollIntoView({ behavior: 'smooth' });
                }}
                className="btn-primary inline-flex items-center gap-2"
              >
                Stay Connected
                <ArrowRight size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Portfolio;