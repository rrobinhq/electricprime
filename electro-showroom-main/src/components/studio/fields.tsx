interface TextFieldProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}

export function TextField({ label, value, onChange, placeholder }: TextFieldProps) {
  return (
    <label className="block text-xs">
      <span className="mb-1 block uppercase tracking-wide text-muted-foreground">{label}</span>
      <input
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-border bg-background px-2.5 py-1.5 text-sm text-foreground outline-none focus:border-foreground"
      />
    </label>
  );
}

interface NumberFieldProps {
  label: string;
  value: number | undefined;
  onChange: (v: number | undefined) => void;
}

export function NumberField({ label, value, onChange }: NumberFieldProps) {
  return (
    <label className="block text-xs">
      <span className="mb-1 block uppercase tracking-wide text-muted-foreground">{label}</span>
      <input
        type="number"
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value === "" ? undefined : Number(e.target.value))}
        className="w-full border border-border bg-background px-2.5 py-1.5 text-sm text-foreground outline-none focus:border-foreground"
      />
    </label>
  );
}

interface TextAreaFieldProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
}

export function TextAreaField({ label, value, onChange, rows = 3 }: TextAreaFieldProps) {
  return (
    <label className="block text-xs">
      <span className="mb-1 block uppercase tracking-wide text-muted-foreground">{label}</span>
      <textarea
        value={value}
        rows={rows}
        onChange={(e) => onChange(e.target.value)}
        className="w-full resize-y border border-border bg-background px-2.5 py-1.5 text-sm text-foreground outline-none focus:border-foreground"
      />
    </label>
  );
}

interface CheckboxFieldProps {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}

export function CheckboxField({ label, checked, onChange }: CheckboxFieldProps) {
  return (
    <label className="flex items-center gap-2 text-xs">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4"
      />
      <span className="uppercase tracking-wide text-muted-foreground">{label}</span>
    </label>
  );
}

/** Editable list of plain strings (used for storage/memory options). */
interface StringListFieldProps {
  label: string;
  value: string[];
  onChange: (v: string[]) => void;
}

export function StringListField({ label, value, onChange }: StringListFieldProps) {
  return (
    <div className="text-xs">
      <span className="mb-1 block uppercase tracking-wide text-muted-foreground">{label}</span>
      <div className="space-y-1.5">
        {value.map((item, i) => (
          <div key={i} className="flex gap-1.5">
            <input
              type="text"
              value={item}
              onChange={(e) => {
                const next = [...value];
                next[i] = e.target.value;
                onChange(next);
              }}
              className="flex-1 border border-border bg-background px-2.5 py-1.5 text-sm text-foreground outline-none focus:border-foreground"
            />
            <button
              type="button"
              onClick={() => onChange(value.filter((_, j) => j !== i))}
              className="border border-border px-2 text-muted-foreground hover:text-destructive"
            >
              ✕
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => onChange([...value, ""])}
          className="border border-dashed border-border px-2.5 py-1 text-muted-foreground hover:border-foreground hover:text-foreground"
        >
          + Add
        </button>
      </div>
    </div>
  );
}

/** Editable list of {name, hex} color swatches. */
interface ColorListFieldProps {
  value: { name: string; hex: string }[];
  onChange: (v: { name: string; hex: string }[]) => void;
}

export function ColorListField({ value, onChange }: ColorListFieldProps) {
  return (
    <div className="text-xs">
      <span className="mb-1 block uppercase tracking-wide text-muted-foreground">Colors</span>
      <div className="space-y-1.5">
        {value.map((c, i) => (
          <div key={i} className="flex items-center gap-1.5">
            <input
              type="color"
              value={/^#[0-9a-fA-F]{6}$/.test(c.hex) ? c.hex : "#000000"}
              onChange={(e) => {
                const next = [...value];
                next[i] = { ...next[i]!, hex: e.target.value };
                onChange(next);
              }}
              className="h-8 w-8 shrink-0 border border-border bg-background p-0"
            />
            <input
              type="text"
              value={c.name}
              placeholder="Color name"
              onChange={(e) => {
                const next = [...value];
                next[i] = { ...next[i]!, name: e.target.value };
                onChange(next);
              }}
              className="flex-1 border border-border bg-background px-2.5 py-1.5 text-sm text-foreground outline-none focus:border-foreground"
            />
            <button
              type="button"
              onClick={() => onChange(value.filter((_, j) => j !== i))}
              className="border border-border px-2 py-1.5 text-muted-foreground hover:text-destructive"
            >
              ✕
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => onChange([...value, { name: "", hex: "#000000" }])}
          className="border border-dashed border-border px-2.5 py-1 text-muted-foreground hover:border-foreground hover:text-foreground"
        >
          + Add color
        </button>
      </div>
    </div>
  );
}

/** Editable key/value list (used for the specs table). */
interface SpecsFieldProps {
  value: Record<string, string>;
  onChange: (v: Record<string, string>) => void;
}

export function SpecsField({ value, onChange }: SpecsFieldProps) {
  const entries = Object.entries(value);

  function updateEntry(index: number, key: string, val: string) {
    const next = [...entries];
    next[index] = [key, val];
    onChange(Object.fromEntries(next));
  }

  function removeEntry(index: number) {
    onChange(Object.fromEntries(entries.filter((_, j) => j !== index)));
  }

  return (
    <div className="text-xs">
      <span className="mb-1 block uppercase tracking-wide text-muted-foreground">Specs</span>
      <div className="space-y-1.5">
        {entries.map(([key, val], i) => (
          <div key={i} className="flex gap-1.5">
            <input
              type="text"
              value={key}
              placeholder="Label (e.g. CPU)"
              onChange={(e) => updateEntry(i, e.target.value, val)}
              className="w-28 shrink-0 border border-border bg-background px-2.5 py-1.5 text-sm text-foreground outline-none focus:border-foreground"
            />
            <input
              type="text"
              value={val}
              placeholder="Value"
              onChange={(e) => updateEntry(i, key, e.target.value)}
              className="flex-1 border border-border bg-background px-2.5 py-1.5 text-sm text-foreground outline-none focus:border-foreground"
            />
            <button
              type="button"
              onClick={() => removeEntry(i)}
              className="border border-border px-2 text-muted-foreground hover:text-destructive"
            >
              ✕
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => onChange({ ...value, "": "" })}
          className="border border-dashed border-border px-2.5 py-1 text-muted-foreground hover:border-foreground hover:text-foreground"
        >
          + Add spec
        </button>
      </div>
    </div>
  );
}
