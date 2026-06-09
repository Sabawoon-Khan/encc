"use client";

import { useEffect, useId, useRef } from "react";

export function MermaidDiagram({ chart }: { chart: string }) {
  const id = useId().replace(/:/g, "");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;

    async function render() {
      try {
        const mermaid = (await import("mermaid")).default;
        mermaid.initialize({
          startOnLoad: false,
          theme: "neutral",
          securityLevel: "strict",
          flowchart: { curve: "basis" },
        });
        if (!ref.current || cancelled) return;
        const { svg } = await mermaid.render(`mmd-${id}`, chart);
        if (!cancelled && ref.current) ref.current.innerHTML = svg;
      } catch {
        if (ref.current && !cancelled) {
          ref.current.innerHTML = `<pre class="text-xs text-slate-600 whitespace-pre-wrap">${chart}</pre>`;
        }
      }
    }

    render();
    return () => {
      cancelled = true;
    };
  }, [chart, id]);

  return (
    <div
      ref={ref}
      className="overflow-x-auto rounded-lg border border-slate-200 bg-white p-4 [&_svg]:mx-auto"
    />
  );
}
