/**
 * Security utility functions
 */

/**
 * Sanitize error messages to prevent information disclosure
 */
export const sanitizeErrorMessage = (error: any): string => {
  // Generic error messages to prevent information leakage
  const genericMessages = {
    auth: 'Authentication failed. Please check your credentials.',
    network: 'Network error. Please check your connection and try again.',
    validation: 'Invalid input provided. Please check your data.',
    server: 'Server error. Please try again later.',
    rate_limit: 'Too many requests. Please wait before trying again.',
    default: 'An unexpected error occurred. Please try again.'
  };

  if (typeof error === 'string') {
    // Check for specific error patterns
    if (error.toLowerCase().includes('password') || error.toLowerCase().includes('credential')) {
      return genericMessages.auth;
    }
    if (error.toLowerCase().includes('network') || error.toLowerCase().includes('connection')) {
      return genericMessages.network;
    }
    if (error.toLowerCase().includes('rate') || error.toLowerCase().includes('limit')) {
      return genericMessages.rate_limit;
    }
    if (error.toLowerCase().includes('validation') || error.toLowerCase().includes('invalid')) {
      return genericMessages.validation;
    }
  }

  // For development, log the actual error
  if (process.env.NODE_ENV === 'development') {
    console.error('Original error:', error);
  }

  return genericMessages.default;
};

/**
 * Log security events for comprehensive monitoring
 */
export const logSecurityEvent = (event: {
  type: 'auth_failure' | 'rate_limit' | 'validation_error' | 'suspicious_activity' | 'xss_attempt' | 'csrf_violation' | 'unauthorized_access';
  details: string;
  userAgent?: string;
  ip?: string;
  timestamp?: string;
  severity?: 'low' | 'medium' | 'high' | 'critical';
}) => {
  const securityLog = {
    ...event,
    timestamp: event.timestamp || new Date().toISOString(),
    userAgent: event.userAgent || navigator.userAgent,
    url: window.location.href,
    sessionId: sessionStorage.getItem('session_id') || generateSecureSessionId(),
    severity: event.severity || 'medium',
    fingerprint: generateBrowserFingerprint()
  };

  // Enhanced logging for different environments
  if (process.env.NODE_ENV === 'development') {
    console.warn('🔒 Security Event:', securityLog);
  }

  // Store in session storage for debugging (limit to last 20 events)
  try {
    const existingLogs = JSON.parse(sessionStorage.getItem('security_logs') || '[]');
    const updatedLogs = [securityLog, ...existingLogs].slice(0, 20);
    sessionStorage.setItem('security_logs', JSON.stringify(updatedLogs));
    
    // Trigger alert for critical events
    if (event.severity === 'critical') {
      triggerSecurityAlert(securityLog);
    }
  } catch (error) {
    console.error('Failed to log security event:', error);
  }
};

/**
 * Generate browser fingerprint for security tracking
 */
const generateBrowserFingerprint = (): string => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.textBaseline = 'top';
    ctx.font = '14px Arial';
    ctx.fillText('Browser fingerprint', 2, 2);
  }
  
  const fingerprint = {
    userAgent: navigator.userAgent,
    language: navigator.language,
    platform: navigator.platform,
    cookieEnabled: navigator.cookieEnabled,
    doNotTrack: navigator.doNotTrack,
    canvas: canvas.toDataURL(),
    screen: `${screen.width}x${screen.height}`,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
  };
  
  return btoa(JSON.stringify(fingerprint)).slice(0, 32);
};

/**
 * Trigger security alert for critical events
 */
const triggerSecurityAlert = (event: any) => {
  // In production, this would send to security monitoring service
  console.error('🚨 CRITICAL SECURITY EVENT:', event);
  
  // Store critical events separately
  try {
    const criticalEvents = JSON.parse(sessionStorage.getItem('critical_security_events') || '[]');
    criticalEvents.unshift(event);
    sessionStorage.setItem('critical_security_events', JSON.stringify(criticalEvents.slice(0, 5)));
  } catch (error) {
    console.error('Failed to store critical security event:', error);
  }
};

/**
 * Validate file uploads for security
 */
export const validateFileUpload = (file: File): { valid: boolean; error?: string } => {
  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
  const ALLOWED_TYPES = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'application/pdf',
    'text/plain'
  ];

  if (file.size > MAX_FILE_SIZE) {
    return { valid: false, error: 'File size exceeds 10MB limit' };
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return { valid: false, error: 'File type not allowed' };
  }

  // Check for suspicious file names
  const suspiciousPatterns = ['.php', '.js', '.html', '.exe', '.bat', '.cmd'];
  if (suspiciousPatterns.some(pattern => file.name.toLowerCase().includes(pattern))) {
    return { valid: false, error: 'File name contains suspicious content' };
  }

  return { valid: true };
};

/**
 * Generate secure session ID
 */
export const generateSecureSessionId = (): string => {
  return crypto.randomUUID();
};

/**
 * Check if the current environment is secure (HTTPS)
 */
export const isSecureEnvironment = (): boolean => {
  return window.location.protocol === 'https:' || window.location.hostname === 'localhost';
};

/**
 * Detect potential XSS attempts in user input
 */
export const detectXSSAttempt = (input: string): boolean => {
  const xssPatterns = [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi,
    /<iframe/gi,
    /<object/gi,
    /<embed/gi,
    /eval\s*\(/gi,
    /expression\s*\(/gi
  ];
  
  return xssPatterns.some(pattern => pattern.test(input));
};

/**
 * Enhanced input validation with security checks
 */
export const validateSecureInput = (input: string, type: 'email' | 'text' | 'password' | 'url' = 'text'): { valid: boolean; error?: string; threat?: string } => {  
  // Check for XSS attempts
  if (detectXSSAttempt(input)) {
    logSecurityEvent({
      type: 'xss_attempt',
      details: `XSS attempt detected in ${type} input`,
      severity: 'high'
    });
    return { valid: false, error: 'Invalid input detected', threat: 'xss' };
  }
  
  // Check for SQL injection patterns
  const sqlPatterns = [
    /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION)\b)/gi,
    /(\b(OR|AND)\s+\d+\s*=\s*\d+)/gi,
    /[';-]/g
  ];
  
  if (sqlPatterns.some(pattern => pattern.test(input))) {
    logSecurityEvent({
      type: 'suspicious_activity',
      details: `SQL injection attempt detected in ${type} input`,
      severity: 'high'
    });
    return { valid: false, error: 'Invalid input format', threat: 'sql_injection' };
  }
  
  // Type-specific validation
  switch (type) {
    case 'email':
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(input)) {
        return { valid: false, error: 'Invalid email format' };
      }
      break;
    case 'url':
      try {
        new URL(input);
      } catch {
        return { valid: false, error: 'Invalid URL format' };
      }
      break;
    case 'password':
      if (input.length < 8) {
        return { valid: false, error: 'Password must be at least 8 characters' };
      }
      break;
  }
  
  return { valid: true };
};

/**
 * Create secure audit trail entry
 */
export const createAuditTrail = (action: string, resource: string, details?: any) => {
  const auditEntry = {
    timestamp: new Date().toISOString(),
    action,
    resource,
    details,
    sessionId: sessionStorage.getItem('session_id') || generateSecureSessionId(),
    fingerprint: generateBrowserFingerprint(),
    url: window.location.href
  };
  
  // Store audit trail (limit to last 50 entries)
  try {
    const auditTrail = JSON.parse(sessionStorage.getItem('audit_trail') || '[]');
    auditTrail.unshift(auditEntry);
    sessionStorage.setItem('audit_trail', JSON.stringify(auditTrail.slice(0, 50)));
  } catch (error) {
    console.error('Failed to create audit trail entry:', error);
  }
  
  // Log sensitive actions
  if (['login', 'logout', 'password_change', 'data_export'].includes(action)) {
    logSecurityEvent({
      type: 'suspicious_activity',
      details: `Audit: ${action} on ${resource}`,
      severity: 'low'
    });
  }
};

/**
 * Runtime Application Self-Protection (RASP) checks
 */
export const performRASPChecks = (): { secure: boolean; issues: string[] } => {
  const issues: string[] = [];
  
  // Check for console tampering
  if (typeof console.log !== 'function') {
    issues.push('Console tampering detected');
  }
  
  // Check for prototype pollution
  if (Object.prototype.hasOwnProperty('__proto__')) {
    issues.push('Prototype pollution detected');
  }
  
  // Check for DOM tampering
  if (document.documentElement.getAttribute('data-tampered')) {
    issues.push('DOM tampering detected');
  }
  
  // Check for suspicious global variables
  const suspiciousGlobals = ['eval', 'Function', 'setTimeout', 'setInterval'];
  suspiciousGlobals.forEach(global => {
    if (typeof (window as any)[global] !== 'function') {
      issues.push(`Global ${global} has been tampered with`);
    }
  });
  
  if (issues.length > 0) {
    logSecurityEvent({
      type: 'suspicious_activity',
      details: `RASP checks failed: ${issues.join(', ')}`,
      severity: 'critical'
    });
  }
  
  return { secure: issues.length === 0, issues };
};