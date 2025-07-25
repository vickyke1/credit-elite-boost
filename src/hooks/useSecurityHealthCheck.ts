import { useState, useEffect, useCallback } from 'react';
import { performRASPChecks } from '@/utils/securityHelpers';
import { securityAudit } from '@/utils/securityAudit';

interface SecurityHealthStatus {
  isSecure: boolean;
  issues: string[];
  lastCheck: Date | null;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
}

/**
 * Hook for periodic security health monitoring
 */
export const useSecurityHealthCheck = () => {
  const [healthStatus, setHealthStatus] = useState<SecurityHealthStatus>({
    isSecure: true,
    issues: [],
    lastCheck: null,
    riskLevel: 'low'
  });

  const performHealthCheck = useCallback(async () => {
    try {
      // Perform RASP checks
      const raspResults = performRASPChecks();
      
      // Check for security environment
      const isHTTPS = window.location.protocol === 'https:';
      const hasCSP = !!document.querySelector('meta[http-equiv="Content-Security-Policy"]');
      
      // Collect all issues
      const allIssues = [
        ...raspResults.issues,
        ...(!isHTTPS && window.location.hostname !== 'localhost' ? ['Site not served over HTTPS'] : []),
        ...(!hasCSP ? ['Content Security Policy not detected'] : [])
      ];

      // Determine risk level
      let riskLevel: 'low' | 'medium' | 'high' | 'critical' = 'low';
      if (allIssues.length > 5) riskLevel = 'critical';
      else if (allIssues.length > 3) riskLevel = 'high';
      else if (allIssues.length > 1) riskLevel = 'medium';

      const newStatus: SecurityHealthStatus = {
        isSecure: allIssues.length === 0,
        issues: allIssues,
        lastCheck: new Date(),
        riskLevel
      };

      setHealthStatus(newStatus);

      // Log security health status
      if (allIssues.length > 0) {
        await securityAudit.logSuspiciousActivity(
          `Security health check failed: ${allIssues.length} issues detected`,
          { issues: allIssues, riskLevel }
        );
      }

      return newStatus;
    } catch (error) {
      console.error('Security health check failed:', error);
      
      const errorStatus: SecurityHealthStatus = {
        isSecure: false,
        issues: ['Health check failed to complete'],
        lastCheck: new Date(),
        riskLevel: 'medium'
      };
      
      setHealthStatus(errorStatus);
      return errorStatus;
    }
  }, []);

  // Perform initial check and set up periodic monitoring
  useEffect(() => {
    performHealthCheck();
    
    // Perform health checks every 5 minutes
    const interval = setInterval(performHealthCheck, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [performHealthCheck]);

  return {
    healthStatus,
    performHealthCheck,
    isSecure: healthStatus.isSecure,
    riskLevel: healthStatus.riskLevel
  };
};