import { FileUploadProps } from "@/types/security";

export default function FileUpload({
  fileName,
  onFileUpload,
  onAnalyzeCode,
  isAnalyzing,
  hasCode,
  toolLocked = false,
}: FileUploadProps) {
  const disabled = toolLocked;

  return (
    <div className="flex flex-wrap items-center justify-end gap-2">
      {fileName ? (
        <span className="max-w-[220px] truncate border border-line bg-elevated px-2 py-1 font-mono text-[11px] text-ink sm:max-w-xs">
          {fileName}
        </span>
      ) : null}

      <input
        type="file"
        accept=".py"
        onChange={onFileUpload}
        className="hidden"
        id="file-upload"
        disabled={disabled}
      />

      {disabled ? (
        <span className="border border-line bg-wash px-3 py-2 font-robot text-[0.65rem] font-bold uppercase tracking-wider text-ink-muted">
          Ingest locked
        </span>
      ) : (
        <label
          htmlFor="file-upload"
          className="cursor-pointer border border-line-strong bg-transparent px-3 py-2 font-robot text-[0.65rem] font-bold uppercase tracking-wider text-ink transition-colors hover:border-ink-muted"
        >
          Ingest file
        </label>
      )}

      <button
        type="button"
        onClick={onAnalyzeCode}
        disabled={!hasCode || isAnalyzing || disabled}
        className="border border-ink bg-ink px-4 py-2 font-robot text-[0.65rem] font-bold uppercase tracking-wider text-canvas transition-colors hover:bg-white hover:text-canvas disabled:cursor-not-allowed disabled:border-line disabled:bg-transparent disabled:text-ink-muted"
      >
        {isAnalyzing ? "Scanning…" : "Execute scan"}
      </button>
    </div>
  );
}
