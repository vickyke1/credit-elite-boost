const HowItWorks = () => {
  const steps = [
    {
      step: "01",
      title: "Pick Your Package",
      description: "Choose from our CPN kits, tradelines, or complete credit boosting packages tailored to your needs.",
      color: "primary"
    },
    {
      step: "02", 
      title: "Submit Info Securely",
      description: "Provide your information through our encrypted portal. All data is protected with bank-level security.",
      color: "accent"
    },
    {
      step: "03",
      title: "Tradelines/CPN Delivered", 
      description: "Receive your CPNs and tradelines within 24-72 hours. Track progress in your client dashboard.",
      color: "primary"
    },
    {
      step: "04",
      title: "Watch Your Score Improve",
      description: "Monitor your credit profile transformation and access funding opportunities within 30-60 days.",
      color: "accent"
    }
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            How It{" "}
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Works
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Our streamlined process gets you from application to improved credit in just 4 simple steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((stepItem, index) => (
            <div key={index} className="relative group">
              {/* Connection Line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-16 left-full w-full h-0.5 bg-gradient-to-r from-primary to-accent opacity-30 z-0"></div>
              )}
              
              <div className="relative z-10 text-center">
                {/* Step Number */}
                <div className={`mx-auto w-16 h-16 rounded-2xl flex items-center justify-center mb-6 text-2xl font-bold transition-all duration-300 group-hover:scale-110 ${
                  stepItem.color === 'primary' 
                    ? 'bg-gradient-primary text-primary-foreground glow-primary' 
                    : 'bg-gradient-cta text-accent-foreground glow-accent'
                }`}>
                  {stepItem.step}
                </div>
                
                {/* Content */}
                <h3 className="text-xl font-semibold mb-4 text-foreground">
                  {stepItem.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {stepItem.description}
                </p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-16">
          <div className="inline-flex items-center gap-2 text-sm text-muted-foreground bg-surface-elevated px-6 py-3 rounded-full">
            <div className="w-2 h-2 bg-accent rounded-full animate-pulse"></div>
            Typical completion time: 24-72 hours
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;