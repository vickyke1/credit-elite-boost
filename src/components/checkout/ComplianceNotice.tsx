import { ShieldCheck } from "lucide-react";

// Reusable legal / refund / compliance disclosure shown at checkout and on
// order pages. No credit-score promises; no CPN / identity products.
const ComplianceNotice = () => (
  <div className="rounded-lg border-l-4 border-primary bg-surface-elevated p-5 text-sm text-muted-foreground">
    <div className="mb-2 flex items-center gap-2 font-semibold text-foreground">
      <ShieldCheck className="h-4 w-4 text-primary" />
      Terms, Compliance &amp; Refund Policy
    </div>
    <ul className="list-disc space-y-1.5 pl-5">
      <li>
        We sell authorized-user tradelines and legal credit-education materials only.
        We do <strong>not</strong> sell, create, or deliver CPNs, synthetic identities,
        or any product intended to misrepresent your identity.
      </li>
      <li>
        Tradelines are a tool to add positive account history. We make{" "}
        <strong>no guarantee of any specific credit-score increase</strong> — results
        depend on your individual credit profile.
      </li>
      <li>
        You agree to use all products lawfully and to provide accurate information.
        Misrepresenting your identity on any credit application is illegal.
      </li>
      <li>
        <strong>Refunds:</strong> education products are non-refundable once delivered.
        If a purchased tradeline fails to post within its stated reporting window, you
        are eligible for a replacement or a full refund of that item.
      </li>
      <li>
        Payments are processed through the methods shown at checkout. Manual payments
        (Cash App / Venmo / Bitcoin) are reviewed before any product is delivered.
      </li>
    </ul>
  </div>
);

export default ComplianceNotice;
