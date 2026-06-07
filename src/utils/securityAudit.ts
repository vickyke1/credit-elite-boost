import { supabase } from '@/integrations/supabase/client';

export interface SecurityEvent {
  event_type: string;
  user_id?: string;
  ip_address?: string;
  user_agent?: string;
  metadata?: Record<string, unknown>;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

/**
 * Security audit logging utility
 */
export class SecurityAudit {
  private static instance: SecurityAudit;
  private events: SecurityEvent[] = [];

  private constructor() {}

  static getInstance(): SecurityAudit {
    if (!SecurityAudit.instance) {
      SecurityAudit.instance = new SecurityAudit();
    }
    return SecurityAudit.instance;
  }

  /**
   * Log a security event
   */
  async logEvent(event: SecurityEvent) {
    try {
      // Add timestamp and client info
      const enhancedEvent = {
        ...event,
        timestamp: new Date().toISOString(),
        ip_address: event.ip_address || await this.getClientIP(),
        user_agent: event.user_agent || navigator.userAgent,
      };

      // Store locally for immediate use
      this.events.push(enhancedEvent);

      // Send to server for persistent storage
      await this.sendToServer(enhancedEvent);

      // Keep only last 100 events in memory
      if (this.events.length > 100) {
        this.events = this.events.slice(-100);
      }

    } catch (error) {
      console.error('Failed to log security event:', error);
    }
  }

  /**
   * Log authentication events
   */
  async logAuthEvent(type: 'login_success' | 'login_failed' | 'logout' | 'registration' | 'password_reset', metadata?: Record<string, unknown>) {
    await this.logEvent({
      event_type: type,
      user_id: (await supabase.auth.getUser()).data.user?.id,
      metadata,
      severity: type === 'login_failed' ? 'medium' : 'low',
    });
  }

  /**
   * Log suspicious activity
   */
  async logSuspiciousActivity(description: string, metadata?: Record<string, unknown>) {
    await this.logEvent({
      event_type: 'suspicious_activity',
      user_id: (await supabase.auth.getUser()).data.user?.id,
      metadata: { description, ...metadata },
      severity: 'high',
    });
  }

  /**
   * Log rate limit violations
   */
  async logRateLimitViolation(endpoint: string, identifier: string) {
    await this.logEvent({
      event_type: 'rate_limit_violation',
      metadata: { endpoint, identifier },
      severity: 'medium',
    });
  }

  /**
   * Log XSS attempts
   */
  async logXSSAttempt(input: string, field: string) {
    await this.logEvent({
      event_type: 'xss_attempt',
      user_id: (await supabase.auth.getUser()).data.user?.id,
      metadata: { input: input.substring(0, 200), field },
      severity: 'high',
    });
  }

  /**
   * Get recent security events
   */
  getRecentEvents(limit: number = 50): SecurityEvent[] {
    return this.events.slice(-limit);
  }

  /**
   * Get client IP address
   */
  private getClientIP(): Promise<string> {
    // Avoid third-party IP lookups from the client for privacy
    return Promise.resolve('redacted');
  }

  /**
   * Send event to server for storage
   */
  private async sendToServer(event: SecurityEvent) {
    try {
      // Log to server via Supabase function
      await supabase.functions.invoke('security-audit', {
        body: event
      });
    } catch (error) {
      // Fail silently to not disrupt user experience
      console.warn('Failed to send security event to server:', error);
    }
  }
}

// Export singleton instance
export const securityAudit = SecurityAudit.getInstance();

// Utility functions for common security checks
export const detectXSS = (input: string): boolean => {
  const xssPatterns = [
    /<script[^>]*>.*?<\/script>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi,
    /<iframe[^>]*>.*?<\/iframe>/gi,
    /<object[^>]*>.*?<\/object>/gi,
    /<embed[^>]*>.*?<\/embed>/gi,
    /<link[^>]*>/gi,
    /<style[^>]*>.*?<\/style>/gi,
  ];

  return xssPatterns.some(pattern => pattern.test(input));
};

export const detectSQLInjection = (input: string): boolean => {
  const sqlPatterns = [
    /(\bUNION\b|\bSELECT\b|\bINSERT\b|\bUPDATE\b|\bDELETE\b|\bDROP\b|\bCREATE\b|\bALTER\b)/gi,
    /(\bOR\b|\bAND\b)\s+\d+\s*=\s*\d+/gi,
    /['"][\\s]*(\bOR\b|\bAND\b)[\\s]*['"][\\s]*=[\\s]*['"][\\s]*['"][\\s]*/gi,
    /\-\-/g,
    /\/\*/g,
    /\*\//g,
  ];

  return sqlPatterns.some(pattern => pattern.test(input));
};

export const validateInput = async (input: string, field: string): Promise<boolean> => {
  if (detectXSS(input)) {
    await securityAudit.logXSSAttempt(input, field);
    return false;
  }

  if (detectSQLInjection(input)) {
    await securityAudit.logSuspiciousActivity(`SQL injection attempt detected in ${field}`, { input: input.substring(0, 200) });
    return false;
  }

  return true;
};
