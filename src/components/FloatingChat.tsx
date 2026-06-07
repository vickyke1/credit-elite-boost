import { useState } from "react";
import { MessageCircle } from "lucide-react";

const FloatingChat = () => {
  const [isVisible] = useState(true);
  if (!isVisible) return null;
  return <div className="fixed bottom-6 right-6 z-50">
      {/* Live Notification Popup */}
      <div className="absolute -top-16 right-0 bg-surface-elevated border border-border rounded-lg p-3 shadow-floating animate-pulse mb-4">
        <div className="flex items-center gap-2 text-sm">
          <div className="w-2 h-2 bg-accent rounded-full animate-pulse"></div>
          <span className="text-foreground font-medium">Alex</span>
          <span className="text-muted-foreground">just purchased 3 Tradelines</span>
        </div>
      </div>

      {/* Chat Button */}
      <a
        href="https://t.me/cpncreditboost"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with us"
        className="flex items-center justify-center w-14 h-14 rounded-full bg-gradient-cta glow-accent shadow-floating text-accent-foreground hover:scale-110 transition-transform duration-300"
      >
        <MessageCircle className="w-7 h-7" />
      </a>
    </div>;
};
export default FloatingChat;
