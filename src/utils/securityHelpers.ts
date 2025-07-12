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
 * Log security events for monitoring
 */
export const logSecurityEvent = (event: {
  type: 'auth_failure' | 'rate_limit' | 'validation_error' | 'suspicious_activity';
  details: string;
  userAgent?: string;
  ip?: string;
  timestamp?: string;
}) => {
  const securityLog = {
    ...event,
    timestamp: event.timestamp || new Date().toISOString(),
    userAgent: event.userAgent || navigator.userAgent,
    url: window.location.href,
    sessionId: sessionStorage.getItem('session_id') || 'anonymous'
  };

  // In production, this would be sent to a security monitoring service
  if (process.env.NODE_ENV === 'development') {
    console.warn('Security Event:', securityLog);
  }

  // Store in session storage for debugging (limit to last 10 events)
  try {
    const existingLogs = JSON.parse(sessionStorage.getItem('security_logs') || '[]');
    const updatedLogs = [securityLog, ...existingLogs].slice(0, 10);
    sessionStorage.setItem('security_logs', JSON.stringify(updatedLogs));
  } catch (error) {
    console.error('Failed to log security event:', error);
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