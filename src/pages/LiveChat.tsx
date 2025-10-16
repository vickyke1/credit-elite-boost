import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import FloatingChat from "@/components/FloatingChat";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

const LiveChat = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "system",
      message: "Welcome to CPN Credit Boost live chat! How can we help you today?",
      timestamp: "10:30 AM"
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");

  const quickActions = [
    "Check tradeline availability",
    "Get CPN package pricing", 
    "Schedule consultation",
    "Track my order status",
    "Request credit analysis",
    "Speak with specialist"
  ];

  const supportTopics = [
    {
      title: "Tradelines",
      description: "Questions about our tradeline marketplace and services",
      icon: "💳"
    },
    {
      title: "CPN Packages",
      description: "Information about our complete CPN credit packages",
      icon: "📦"
    },
    {
      title: "Credit Repair",
      description: "Credit repair services and dispute processes",
      icon: "🔧"
    },
    {
      title: "Account Support",
      description: "Help with your account, orders, and portal access",
      icon: "👤"
    }
  ];

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      const newMessage = {
        id: messages.length + 1,
        sender: "user",
        message: inputMessage,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages([...messages, newMessage]);
      setInputMessage("");
      
      // Simulate agent response
      setTimeout(() => {
        const agentResponse = {
          id: messages.length + 2,
          sender: "agent",
          message: "Thank you for your message. An agent will be with you shortly to assist with your inquiry.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, agentResponse]);
      }, 1000);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-16 bg-gradient-subtle">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                Live Chat Support
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Instant support through our live chat system for quick answers to your questions 
                and real-time assistance.
              </p>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-6 py-16">
          <div className="grid lg:grid-cols-3 gap-8">
            
            {/* Chat Interface */}
            <div className="lg:col-span-2">
              <div className="bg-surface-elevated border border-border rounded-lg overflow-hidden">
                {/* Chat Header */}
                <div className="bg-primary text-primary-foreground p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">Live Support</h3>
                      <p className="text-sm opacity-90">Connected - Average response: &lt; 2 minutes</p>
                    </div>
                    <div className="w-3 h-3 bg-accent rounded-full animate-pulse"></div>
                  </div>
                </div>
                
                {/* Chat Messages */}
                <div className="h-96 overflow-y-auto p-4 space-y-4">
                  {messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        msg.sender === 'user' 
                          ? 'bg-primary text-primary-foreground' 
                          : msg.sender === 'system'
                          ? 'bg-accent text-accent-foreground'
                          : 'bg-muted text-muted-foreground'
                      }`}>
                        <p className="text-sm">{msg.message}</p>
                        <span className="text-xs opacity-75">{msg.timestamp}</span>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Chat Input */}
                <div className="border-t border-border p-4">
                  <div className="flex gap-2">
                    <Input 
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      placeholder="Type your message..."
                      className="flex-1"
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    />
                    <Button onClick={handleSendMessage}>Send</Button>
                  </div>
                </div>
              </div>
              
              {/* Quick Actions */}
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-foreground mb-3">Quick Actions</h3>
                <div className="grid grid-cols-2 gap-2">
                  {quickActions.map((action, index) => (
                    <Button 
                      key={index}
                      variant="outline" 
                      size="sm"
                      className="text-left justify-start h-auto py-2"
                      onClick={() => setInputMessage(action)}
                    >
                      {action}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Support Topics */}
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-6">What can we help with?</h3>
              <div className="space-y-4">
                {supportTopics.map((topic, index) => (
                  <div key={index} className="bg-surface-elevated border border-border p-4 rounded-lg hover:shadow-elegant transition-all duration-300 cursor-pointer">
                    <div className="flex items-start gap-3">
                      <div className="text-2xl">{topic.icon}</div>
                      <div>
                        <h4 className="font-semibold text-foreground mb-1">{topic.title}</h4>
                        <p className="text-sm text-muted-foreground">{topic.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Contact Info */}
              <div className="mt-8 bg-surface-elevated border border-border p-4 rounded-lg">
                <h4 className="font-semibold text-foreground mb-3">Other Ways to Contact Us</h4>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div>📞 Phone: +1 (904) 243-5425</div>
                  <div>✉️ Email: support@cpncreditboost.com</div>
                  <div>🕒 Hours: Mon-Fri 9AM-6PM EST</div>
                </div>
              </div>
              
              {/* Agent Status */}
              <div className="mt-6 bg-surface-elevated border border-border p-4 rounded-lg">
                <h4 className="font-semibold text-foreground mb-3">Current Status</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-accent rounded-full"></div>
                    <span className="text-sm text-foreground">5 agents online</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-primary rounded-full"></div>
                    <span className="text-sm text-foreground">Average wait: &lt; 2 min</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-muted rounded-full"></div>
                    <span className="text-sm text-foreground">3 people in queue</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <FloatingChat />
    </div>
  );
};

export default LiveChat;