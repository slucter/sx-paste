"use client";

import CodeMirror from "@uiw/react-codemirror";
import { EditorView } from "@codemirror/view";
import { oneDark } from "@codemirror/theme-one-dark";
import { usePrefersDark } from "@/lib/use-prefers-dark";

const baseTheme = EditorView.theme({
  "&": { fontSize: "13.5px" },
  ".cm-content": { fontFamily: "var(--font-geist-mono), monospace" },
  ".cm-gutters": { fontFamily: "var(--font-geist-mono), monospace" },
});

export function CodeArea({
  value,
  onChange,
  readOnly = false,
  placeholder,
}: {
  value: string;
  onChange?: (value: string) => void;
  readOnly?: boolean;
  placeholder?: string;
}) {
  const dark = usePrefersDark();

  return (
    <div className="overflow-hidden rounded-md border border-border">
      <CodeMirror
        value={value}
        onChange={onChange}
        readOnly={readOnly}
        editable={!readOnly}
        placeholder={placeholder}
        theme={dark ? oneDark : "light"}
        extensions={[EditorView.lineWrapping, baseTheme]}
        basicSetup={{
          lineNumbers: true,
          foldGutter: false,
          highlightActiveLine: !readOnly,
          highlightActiveLineGutter: !readOnly,
        }}
        height="60vh"
      />
    </div>
  );
}
