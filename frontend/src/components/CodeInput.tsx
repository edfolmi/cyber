import { CodeInputProps } from "@/types/security";
import FileUpload from "./FileUpload";

export default function CodeInput({
  codeContent,
  fileName,
  onFileUpload,
  onAnalyzeCode,
  isAnalyzing,
  toolLocked = false,
}: CodeInputProps) {
  return (
    <section className="flex flex-col border border-line bg-surface-solid p-5 sm:p-6">
      <div className="mb-4 flex flex-shrink-0 flex-col gap-4 border-b border-line pb-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 bg-success" aria-hidden />
            <h2 className="font-robot text-sm font-bold uppercase tracking-[0.2em] text-ink">
              Source buffer
            </h2>
          </div>
          <p className="mt-2 max-w-md text-sm leading-relaxed text-ink-muted">
            One Python module, read-only in this pane. Nothing is modified until you act in your
            own editor.
          </p>
        </div>
        <FileUpload
          fileName={fileName}
          onFileUpload={onFileUpload}
          onAnalyzeCode={onAnalyzeCode}
          isAnalyzing={isAnalyzing}
          hasCode={!!codeContent}
          toolLocked={toolLocked}
        />
      </div>

      <label htmlFor="code-input" className="sr-only">
        Python source to review
      </label>
      <textarea
        id="code-input"
        value={codeContent}
        readOnly
        placeholder="// Load a .py file. Payload appears here before scan execution."
        className="min-h-[200px] flex-1 resize-none border border-line bg-canvas p-3 font-mono text-[12px] leading-relaxed text-ink shadow-none placeholder:text-ink-muted/50 focus:outline-none focus:ring-1 focus:ring-line-strong sm:min-h-[240px] sm:text-[13px]"
        spellCheck={false}
      />
    </section>
  );
}
