import { Smartphone, Monitor, Search, Palette, ArrowRight } from 'lucide-react';

const Services = () => {
  const services = [
    {
      icon: <Smartphone className="w-8 h-8" />,
      title: "UI/UX Design",
      description: "Creating intuitive, user-centered interfaces that delight and convert. From wireframes to pixel-perfect designs.",
      features: [
        "User Interface Design",
        "User Experience Strategy",
        "Interaction Design",
        "Design Systems",
        "Accessibility Focus"
      ],
      highlight: "Most Popular"
    },
    {
      icon: <Monitor className="w-8 h-8" />,
      title: "Web Design",
      description: "Responsive, modern websites that look stunning on all devices and drive business results.",
      features: [
        "Responsive Design",
        "Landing Pages",
        "E-commerce Design",
        "Brand Integration",
        "Performance Optimization"
      ]
    },
    {
      icon: <Search className="w-8 h-8" />,
      title: "UX Research",
      description: "Data-driven insights to inform design decisions and validate solutions with real users.",
      features: [
        "User Interviews",
        "Usability Testing",
        "Journey Mapping",
        "Persona Development",
        "Competitive Analysis"
      ]
    },
    {
      icon: <Palette className="w-8 h-8" />,
      title: "Design Consultation",
      description: "Strategic design guidance to elevate your product and align design with business goals.",
      features: [
        "Design Audits",
        "Strategy Sessions",
        "Team Workshops",
        "Process Optimization",
        "Mentoring"
      ]
    }
  ];

  const process = [
    {
      step: "01",
      title: "Discovery",
      description: "Understanding your goals, users, and constraints through research and collaboration"
    },
    {
      step: "02", 
      title: "Strategy",
      description: "Defining the design direction, user flows, and technical requirements"
    },
    {
      step: "03",
      title: "Design",
      description: "Creating wireframes, prototypes, and high-fidelity designs with attention to detail"
    },
    {
      step: "04",
      title: "Delivery",
      description: "Providing design files, documentation, and ongoing support for implementation"
    }
  ];

  return (
    <section id="services" className="section-padding bg-muted/30">
      <div className="container-custom">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Services</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Comprehensive design services that bridge creativity and functionality, 
              bringing your digital vision to life
            </p>
          </div>

          {/* Services Grid */}
          <div className="grid md:grid-cols-2 gap-8 mb-20">
            {services.map((service, index) => (
              <div key={index} className="card-elegant relative group">
                {service.highlight && (
                  <div className="absolute -top-3 right-4">
                    <span className="bg-primary text-primary-foreground text-xs font-medium px-3 py-1 rounded-full">
                      {service.highlight}
                    </span>
                  </div>
                )}
                
                <div className="flex items-start gap-4 mb-6">
                  <div className="p-3 bg-secondary rounded-lg text-foreground group-hover:scale-110 transition-transform">
                    {service.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                    <p className="text-muted-foreground mb-4">{service.description}</p>
                  </div>
                </div>

                <div className="space-y-2 mb-6">
                  {service.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center gap-2 text-sm">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                <button className="inline-flex items-center gap-2 text-primary font-medium hover:gap-3 transition-all">
                  Let's discuss
                  <ArrowRight size={16} />
                </button>
              </div>
            ))}
          </div>

          {/* Process */}
          <div className="bg-background rounded-2xl p-8 border border-border">
            <div className="text-center mb-12">
              <h3 className="text-2xl font-semibold mb-4">My Process</h3>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                A structured approach that ensures every project delivers exceptional results, 
                from initial concept to final implementation
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-8">
              {process.map((item, index) => (
                <div key={index} className="text-center group">
                  <div className="relative mb-6">
                    <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                      <span className="text-xl font-bold text-foreground">{item.step}</span>
                    </div>
                    {index < process.length - 1 && (
                      <div className="hidden md:block absolute top-8 left-full w-full h-px bg-border -ml-8"></div>
                    )}
                  </div>
                  
                  <h4 className="font-semibold mb-2">{item.title}</h4>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="text-center mt-16">
            <div className="max-w-2xl mx-auto">
              <h3 className="text-2xl font-semibold mb-4">Ready to Start Your Project?</h3>
              <p className="text-muted-foreground mb-8">
                Let's discuss how we can work together to bring your vision to life. 
                Every great product starts with a conversation.
              </p>
              <button 
                onClick={() => {
                  const element = document.querySelector('#contact');
                  if (element) element.scrollIntoView({ behavior: 'smooth' });
                }}
                className="btn-primary inline-flex items-center gap-2"
              >
                Get In Touch
                <ArrowRight size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;