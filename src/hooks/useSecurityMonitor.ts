import { useEffect, useState } from 'react';
import { logSecurityEvent, performRASPChecks, createAuditTrail } from '@/utils/securityHelpers';

interface SecurityStatus {
  isSecure: boolean;
  threats: string[];
  lastCheck: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
}

/**
 * Hook for continuous security monitoring
 */
export const useSecurityMonitor = () => {
  const [securityStatus, setSecurityStatus] = useState<SecurityStatus>({
    isSecure: true,
    threats: [],
    lastCheck: new Date().toISOString(),
    riskLevel: 'low'
  });

  useEffect(() => {
    // Initialize security monitoring
    const initializeSecurityMonitoring = () => {
      // Set up session tracking
      if (!sessionStorage.getItem('session_id')) {
        sessionStorage.setItem('session_id', crypto.randomUUID());
      }

      // Create initial audit trail
      createAuditTrail('session_start', 'application', { 
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString()
      });
    };

    // Perform periodic security checks
    const performSecurityChecks = () => {
      const raspResults = performRASPChecks();
      const threats: string[] = [];
      let riskLevel: 'low' | 'medium' | 'high' | 'critical' = 'low';

      // Check RASP results
      if (!raspResults.secure) {
        threats.push(...raspResults.issues);
        riskLevel = 'critical';
      }

      // Check for suspicious URL parameters
      const urlParams = new URLSearchParams(window.location.search);
      for (const [key, value] of urlParams) {
        if (value.includes('<script') || value.includes('javascript:')) {
          threats.push('Suspicious URL parameters detected');
          riskLevel = 'high';
          logSecurityEvent({
            type: 'xss_attempt',
            details: `Suspicious URL parameter: ${key}=${value}`,
            severity: 'high'
          });
        }
      }

      // Check for localStorage tampering
      try {
        const testKey = 'security_test_' + Date.now();
        localStorage.setItem(testKey, 'test');
        localStorage.removeItem(testKey);
      } catch (error) {
        threats.push('localStorage tampering detected');
        riskLevel = 'medium';
      }

      // Update security status
      setSecurityStatus({
        isSecure: threats.length === 0,
        threats,
        lastCheck: new Date().toISOString(),
        riskLevel
      });

      // Log if threats detected
      if (threats.length > 0) {
        logSecurityEvent({
          type: 'suspicious_activity',
          details: `Security threats detected: ${threats.join(', ')}`,
          severity: riskLevel
        });
      }
    };

    // Initialize monitoring
    initializeSecurityMonitoring();
    performSecurityChecks();

    // Set up periodic checks (every 30 seconds)
    const securityInterval = setInterval(performSecurityChecks, 30000);

    // Set up page visibility monitoring
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        createAuditTrail('page_focus', 'application');
        performSecurityChecks();
      } else {
        createAuditTrail('page_blur', 'application');
      }
    };

    // Set up beforeunload monitoring
    const handleBeforeUnload = () => {
      createAuditTrail('session_end', 'application', {
        duration: Date.now() - parseInt(sessionStorage.getItem('session_start') || '0'),
        timestamp: new Date().toISOString()
      });
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);

    // Store session start time
    if (!sessionStorage.getItem('session_start')) {
      sessionStorage.setItem('session_start', Date.now().toString());
    }

    // Cleanup
    return () => {
      clearInterval(securityInterval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  // Security action methods
  const reportSecurityIncident = (type: string, details: string) => {
    logSecurityEvent({
      type: 'suspicious_activity',
      details: `User reported: ${type} - ${details}`,
      severity: 'medium'
    });
    
    createAuditTrail('security_report', 'user_action', { type, details });
  };

  const clearSecurityLogs = () => {
    try {
      sessionStorage.removeItem('security_logs');
      sessionStorage.removeItem('critical_security_events');
      sessionStorage.removeItem('audit_trail');
      
      createAuditTrail('security_logs_cleared', 'user_action');
    } catch (error) {
      console.error('Failed to clear security logs:', error);
    }
  };

  const getSecurityReport = () => {
    try {
      return {
        securityLogs: JSON.parse(sessionStorage.getItem('security_logs') || '[]'),
        criticalEvents: JSON.parse(sessionStorage.getItem('critical_security_events') || '[]'),
        auditTrail: JSON.parse(sessionStorage.getItem('audit_trail') || '[]'),
        currentStatus: securityStatus
      };
    } catch (error) {
      console.error('Failed to generate security report:', error);
      return null;
    }
  };

  return {
    securityStatus,
    reportSecurityIncident,
    clearSecurityLogs,
    getSecurityReport
  };
};