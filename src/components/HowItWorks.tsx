const HowItWorks = () => {
  const steps = [
    {
      step: "01",
      title: "Browse the Marketplace",
      description: "Explore our vetted inventory of authorized-user tradelines. Filter by age, credit limit, and reporting date to find the right fit for your goals.",
      color: "primary"
    },
    {
      step: "02",
      title: "Choose Your Tradeline",
      description: "Select with confidence using clear, upfront details on every listing, then check out through our secure, encrypted payment system.",
      color: "accent"
    },
    {
      step: "03",
      title: "Get Added as an Authorized User",
      description: "We submit your information to be added to the account. You'll receive confirmation and an estimated reporting date.",
      color: "primary"
    },
    {
      step: "04",
      title: "Watch the History Report",
      description: "Once the account posts, the established payment history appears on your credit file as an authorized user — strengthening your overall profile.",
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
            A clear, transparent process that gets you from browsing to a stronger credit profile in 4 simple steps.
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
            Reporting timelines depend on the issuing bank's cycle and are estimates, not guarantees.
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;