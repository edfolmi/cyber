import { AnalysisResultsProps } from "@/types/security";

function severityBadge(severity: string): string {
  switch (severity) {
    case "critical":
    case "high":
      return "border border-danger/50 bg-danger-dim text-danger";
    case "medium":
      return "border border-line-strong bg-elevated text-ink-muted";
    case "low":
      return "border border-success/40 bg-success-dim text-success";
    default:
      return "border border-line bg-wash text-ink-muted";
  }
}

export default function AnalysisResults({
  analysisResults,
  isAnalyzing,
  error,
}: AnalysisResultsProps) {
  return (
    <section className="flex flex-col border border-line bg-surface-solid p-5 sm:p-6">
      <div className="mb-4 flex-shrink-0 border-b border-line pb-4">
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 bg-danger" aria-hidden />
          <h2 className="font-robot text-sm font-bold uppercase tracking-[0.2em] text-ink">
            Report output
          </h2>
        </div>
        <p className="mt-2 text-sm leading-relaxed text-ink-muted">
          Severity-ordered. Red band = treat first. Green on low = reduced urgency, not a clean
          bill of health for the whole system.
        </p>
      </div>

      <div className="flex-1 overflow-auto">
        {error ? (
          <div className="border border-danger/40 bg-danger-dim p-4">
            <p className="font-robot text-[0.65rem] font-bold uppercase tracking-wider text-danger">
              Scan fault
            </p>
            <p className="mt-2 text-sm leading-relaxed text-ink">{error}</p>
          </div>
        ) : null}

        {!analysisResults && !error ? (
          <div className="border border-dashed border-line bg-canvas px-5 py-10 text-center">
            <p className="font-robot text-xs font-bold uppercase tracking-[0.25em] text-ink-muted">
              {isAnalyzing ? "Scan in progress" : "Awaiting payload"}
            </p>
            <p className="mt-3 text-sm text-ink-muted">
              {isAnalyzing
                ? "Pipeline running. Do not close this session."
                : "Execute a scan from the source buffer. Output streams here."}
            </p>
          </div>
        ) : null}

        {analysisResults ? (
          <div className="space-y-6">
            <div className="border-l-2 border-ink bg-elevated p-4 pl-5">
              <h3 className="font-robot text-[0.65rem] font-bold uppercase tracking-[0.2em] text-ink-muted">
                Executive summary
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-ink sm:text-[0.95rem]">
                {analysisResults.summary}
              </p>
            </div>

            {analysisResults.issues.length > 0 ? (
              <div>
                <h3 className="mb-3 font-robot text-xs font-bold uppercase tracking-[0.2em] text-ink-muted">
                  {analysisResults.issues.length}{" "}
                  {analysisResults.issues.length === 1 ? "signal" : "signals"}
                </h3>
                <ul className="space-y-4">
                  {analysisResults.issues.map((issue, index) => (
                    <li key={index}>
                      <article className="border border-line bg-canvas p-4 sm:p-5">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div className="flex min-w-0 flex-1 items-start gap-3">
                            <span className="font-mono text-[11px] text-ink-muted">
                              {(index + 1).toString().padStart(2, "0")}
                            </span>
                            <h4 className="font-sans text-base font-semibold leading-snug text-ink">
                              {issue.title}
                            </h4>
                          </div>
                          <div className="flex flex-wrap items-center gap-2">
                            <span
                              className={`inline-flex px-2 py-0.5 font-robot text-[0.6rem] font-bold uppercase tracking-wider ${severityBadge(issue.severity)}`}
                            >
                              {issue.severity}
                            </span>
                            <span className="border border-line bg-surface-solid px-2 py-0.5 font-mono text-[11px] text-ink-muted">
                              CVSS {issue.cvss_score}
                            </span>
                          </div>
                        </div>

                        <p className="mt-3 text-sm leading-relaxed text-ink-muted">
                          {issue.description}
                        </p>

                        <div className="mt-4 grid gap-3 sm:grid-cols-2">
                          <div>
                            <p className="font-robot text-[0.6rem] font-bold uppercase tracking-[0.15em] text-danger">
                              Vulnerable fragment
                            </p>
                            <pre className="mt-2 overflow-x-auto border-l-2 border-danger/60 bg-danger-dim p-3 font-mono text-[11px] leading-relaxed text-ink">
                              {issue.code}
                            </pre>
                          </div>
                          <div>
                            <p className="font-robot text-[0.6rem] font-bold uppercase tracking-[0.15em] text-success">
                              Remediation vector
                            </p>
                            <pre className="mt-2 overflow-x-auto border-l-2 border-success/50 bg-success-dim p-3 font-mono text-[11px] leading-relaxed text-ink">
                              {issue.fix}
                            </pre>
                          </div>
                        </div>
                      </article>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="border border-success/30 bg-success-dim p-4">
                <p className="font-robot text-[0.65rem] font-bold uppercase tracking-wider text-success">
                  No discrete signals
                </p>
                <p className="mt-2 text-sm text-ink-muted">
                  This pass did not emit row-level findings. Manual verification still recommended
                  before release.
                </p>
              </div>
            )}
          </div>
        ) : null}
      </div>
    </section>
  );
}
