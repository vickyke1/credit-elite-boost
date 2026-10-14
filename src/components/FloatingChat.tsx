import { useState } from "react";
import { MessageCircle } from "lucide-react";

const FloatingChat = () => {
  const [isVisible] = useState(true);
  if (!isVisible) return null;
  return <div className="fixed bottom-6 right-6 z-50">
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
