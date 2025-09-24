import { GraduationCap, Briefcase, MapPin } from 'lucide-react';
const About = () => {
  return <section id="about" className="section-padding bg-muted/30">
      <div className="container-custom">
        <div className="max-w-4xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">About Me</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover my journey from fashion design to product design, and the unique perspective I bring to digital experiences.
            </p>
          </div>

          {/* Personal Story */}
          <div className="mb-12">
            <div className="card-elegant">
              <div className="flex items-start gap-4 mb-6">
                <div className="p-3 bg-primary/20 rounded-lg">
                  <MapPin className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">My Story</h3>
                  <p className="text-muted-foreground leading-relaxed">I transform complex problems into seamless digital solutions. My approach to design is a blend of empathy and logic—meticulously deconstructing challenges to reveal simple, elegant pathways forward. I'm passionate about crafting user-centric products that are not only easy to use but also delightful to discover.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Education & Experience Grid */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* Education */}
            <div className="card-elegant">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-primary/20 rounded-lg">
                  <GraduationCap className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Education</h3>
              </div>
              
              <div className="space-y-6">
                <div className="border-l-2 border-primary pl-4">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium">AltSchool Africa</h4>
                    <span className="text-sm bg-primary/20 text-primary px-2 py-1 rounded">Current</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-1">School of Product Design</p>
                  <p className="text-xs text-muted-foreground">
                    Comprehensive training in UX/UI design, user research, and product strategy
                  </p>
                </div>
                
                <div className="border-l-2 border-muted pl-4">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium">LAUTECH</h4>
                    <span className="text-sm text-muted-foreground">2014</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-1">B.Tech. Human Anatomy</p>
                  <p className="text-xs text-muted-foreground">
                    Deep understanding of human form and function—invaluable for user-centered design
                  </p>
                </div>
              </div>
            </div>

            {/* Experience */}
            <div className="card-elegant">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-primary/20 rounded-lg">
                  <Briefcase className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Experience</h3>
              </div>
              
              <div className="space-y-6">
                <div className="border-l-2 border-primary pl-4">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium">Project Manager</h4>
                    <span className="text-sm bg-primary/20 text-primary px-2 py-1 rounded">Current</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-1">O'ladel Global Resources Limited</p>
                  <p className="text-xs text-muted-foreground">
                    Leading project coordination, communication, and strategic planning initiatives
                  </p>
                </div>
                
                <div className="border-l-2 border-muted pl-4">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium">Fashion Designer</h4>
                    <span className="text-sm text-muted-foreground">Self-employed</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-1">Independent Tailor</p>
                  <p className="text-xs text-muted-foreground">
                    Created custom garments, developed pattern drafting skills, and managed client relationships
                  </p>
                </div>
                
                <div className="border-l-2 border-muted pl-4">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium">Casual Staff</h4>
                    <span className="text-sm text-muted-foreground">2015</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-1">Sumal Foods Nigeria</p>
                  <p className="text-xs text-muted-foreground">
                    Early professional experience in operations and team collaboration
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Philosophy */}
          <div className="mt-12 text-center">
            <div className="max-w-3xl mx-auto bg-gradient-subtle p-8 rounded-2xl border border-border">
              <h3 className="text-xl font-semibold mb-4">Design Philosophy</h3>
              <p className="text-muted-foreground leading-relaxed">
                "Great design is not just about how it looks, but how it feels and functions. 
                My fashion background taught me that every detail matters—from the first touch 
                to the final experience. I bring this meticulous attention to digital products, 
                ensuring they're not only beautiful but truly serve the people who use them."
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>;
};
export default About;