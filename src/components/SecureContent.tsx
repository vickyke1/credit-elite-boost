import React from 'react';
import { renderSecureContent } from '@/utils/secureContent';

interface SecureContentProps {
  content: string;
  className?: string;
}

/**
 * Secure content renderer that processes markdown-like content safely
 * without using dangerouslySetInnerHTML
 */
export const SecureContent: React.FC<SecureContentProps> = ({ content, className = '' }) => {
  const processContent = (text: string): React.ReactNode[] => {
    // Process the content using our secure renderer
    const processedHtml = renderSecureContent(text);
    
    // Parse the processed HTML into React elements
    const parser = new DOMParser();
    const doc = parser.parseFromString(processedHtml, 'text/html');
    
    const convertNodeToReact = (node: Node, index: number): React.ReactNode => {
      if (node.nodeType === Node.TEXT_NODE) {
        return node.textContent;
      }
      
      if (node.nodeType === Node.ELEMENT_NODE) {
        const element = node as Element;
        const tagName = element.tagName.toLowerCase();
        const props: Record<string, unknown> = { key: index };
        
        // Add classes if they exist
        if (element.className) {
          props.className = element.className;
        }
        
        // Convert children
        const children = Array.from(element.childNodes).map((child, childIndex) => 
          convertNodeToReact(child, childIndex)
        );
        
        // Create React element based on tag
        switch (tagName) {
          case 'h1':
            return React.createElement('h1', props, ...children);
          case 'h2':
            return React.createElement('h2', props, ...children);
          case 'h3':
            return React.createElement('h3', props, ...children);
          case 'p':
            return React.createElement('p', props, ...children);
          case 'br':
            return React.createElement('br', props);
          case 'strong':
            return React.createElement('strong', props, ...children);
          case 'em':
            return React.createElement('em', props, ...children);
          case 'ul':
            return React.createElement('ul', props, ...children);
          case 'ol':
            return React.createElement('ol', props, ...children);
          case 'li':
            return React.createElement('li', props, ...children);
          case 'a': {
            // For links, only allow specific href patterns
            const href = element.getAttribute('href');
            if (href && (href.startsWith('http://') || href.startsWith('https://') || href.startsWith('/'))) {
              props.href = href;
              props.target = '_blank';
              props.rel = 'noopener noreferrer';
            }
            return React.createElement('a', props, ...children);
          }
          case 'blockquote':
            return React.createElement('blockquote', props, ...children);
          default:
            // For any other tags, just return the text content
            return element.textContent;
        }
      }
      
      return null;
    };
    
    return Array.from(doc.body.childNodes).map((node, index) => 
      convertNodeToReact(node, index)
    );
  };

  return (
    <div className={`secure-content ${className}`}>
      {processContent(content)}
    </div>
  );
};