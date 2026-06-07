import * as React from "react";

// A tiny, dependency-free renderer for our simple markdown-ish blog content.
// Supports ## headings, ordered lists (1. ), and paragraphs.
export function ArticleContent({ content }: { content: string }) {
  const blocks = content.split("\n").filter((line) => line.trim() !== "");
  const elements: React.ReactNode[] = [];
  let listBuffer: string[] = [];

  const flushList = (key: string) => {
    if (listBuffer.length === 0) return;
    elements.push(
      <ol
        key={key}
        className="my-4 list-decimal space-y-1.5 pl-6 text-muted-foreground"
      >
        {listBuffer.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ol>,
    );
    listBuffer = [];
  };

  blocks.forEach((line, i) => {
    const trimmed = line.trim();
    if (trimmed.startsWith("## ")) {
      flushList(`list-${i}`);
      elements.push(
        <h2 key={i} className="mt-8 text-2xl font-bold tracking-tight">
          {trimmed.slice(3)}
        </h2>,
      );
    } else if (/^\d+\.\s/.test(trimmed)) {
      listBuffer.push(trimmed.replace(/^\d+\.\s/, ""));
    } else {
      flushList(`list-${i}`);
      elements.push(
        <p key={i} className="my-4 leading-relaxed text-muted-foreground">
          {trimmed}
        </p>,
      );
    }
  });
  flushList("list-final");

  return <div className="text-base">{elements}</div>;
}
