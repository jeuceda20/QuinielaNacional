import type { AuditJson } from "@/modules/audit/domain/audit-log-repository";
import type { IntegrityCheck } from "@/modules/diagnostics/application/integrity-checker";

export function createIntegrityRunSummary(check: IntegrityCheck): AuditJson {
  return {
    isValid: check.isValid,
    failedChecks: check.findings.filter((finding) => !finding.isValid).length,
    findings: check.findings.map((finding) => ({
      code: finding.code,
      isValid: finding.isValid,
      affectedRecords: finding.affectedRecords,
    })),
  };
}
