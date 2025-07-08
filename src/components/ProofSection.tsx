const examples = [
  {
    question: "Can I make money on YouTube in 30 days?",
    result: "Found 47 success stories",
    proofExamples: [
      { source: "Reddit r/entrepreneur", text: "Made $2,847 in my first month on YouTube with 847 subscribers", type: "Success Story" },
      { source: "Twitter @CreatorDaily", text: "Day 28 update: $1,200 from AdSense + $800 affiliate commissions 🎉", type: "Real Tweet" },
      { source: "Medium Article", text: "'How I Hit $3K Monthly on YouTube Starting From Zero'", type: "Case Study" },
      { source: "YouTube Comment", text: "Started 6 weeks ago, already at $1.1K/month. Your tutorial works!", type: "Testimonial" }
    ]
  },
  {
    question: "Is it too late to switch to tech at 35?",
    result: "Found 89 career changes",
    proofExamples: [
      { source: "LinkedIn Post", text: "At 37, I just got hired as a Software Engineer at Google. Career change is possible!", type: "Success Story" },
      { source: "Reddit r/cscareerquestions", text: "38F here - landed my first dev job after 8 months of learning. Salary: $85K", type: "Career Change" },
      { source: "Dev.to Article", text: "'From Teacher to Developer at 40: My Complete Journey'", type: "Case Study" },
      { source: "Twitter Thread", text: "Thread: Why I switched to tech at 36 and how it changed my life (15 tweets)", type: "Experience" }
    ]
  },
  {
    question: "Can I build a profitable side business?",
    result: "Found 156 examples",
    proofExamples: [
      { source: "Indie Hackers", text: "My weekend side project just hit $4K MRR. Here's the full breakdown", type: "Revenue Report" },
      { source: "Reddit r/sidehustle", text: "Update: My Etsy shop made $12K last month while working full-time", type: "Success Update" },
      { source: "YouTube Video", text: "'$50K Side Business in 6 Months: Complete Tutorial'", type: "Tutorial" },
      { source: "Blog Post", text: "How I Built a $8K/Month Business Working 2 Hours Daily", type: "Case Study" }
    ]
  }
];

export const ProofSection = () => {
  return (
    <section className="py-24 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-light mb-6">
            We help you believe,<br />
            <span className="font-normal">with data.</span>
          </h2>
        </div>

        <div className="space-y-8">
          {examples.map((example, index) => (
            <div key={index} className="group relative">
              <div className="flex items-center justify-between py-6 border-b border-border cursor-pointer transition-all duration-200 hover:border-primary/30">
                <div className="text-lg md:text-xl font-light text-muted-foreground group-hover:text-foreground transition-colors">
                  "{example.question}"
                </div>
                <div className="text-sm font-medium text-primary ml-4 flex-shrink-0">
                  {example.result}
                </div>
              </div>
              
              {/* Hover expansion */}
              <div className="absolute top-full left-0 right-0 z-10 bg-background border border-border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-4">
                <div className="p-6 space-y-4">
                  <div className="text-sm font-medium text-primary mb-4">Real proof we'd send you:</div>
                  {example.proofExamples.map((proof, proofIndex) => (
                    <div key={proofIndex} className="flex items-start gap-3 p-3 bg-muted/30 rounded-md">
                      <div className="flex-shrink-0">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                      </div>
                      <div className="flex-grow min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-medium text-primary">{proof.source}</span>
                          <span className="text-xs text-muted-foreground">•</span>
                          <span className="text-xs text-muted-foreground">{proof.type}</span>
                        </div>
                        <p className="text-sm text-foreground">{proof.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};