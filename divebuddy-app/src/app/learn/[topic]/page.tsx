import fs from "fs";
import path from "path";
import { notFound } from "next/navigation";
import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type Props = {
  params: { topic: string };
};

export async function generateStaticParams() {
  const dataDir = path.join(process.cwd(), "data", "education", "open-water");
  try {
    const files = fs.readdirSync(dataDir).filter((f) => f.endsWith(".md"));
    return files.map((f) => ({ topic: f.replace(/\.md$/, "") }));
  } catch (e) {
    return [];
  }
}

export default function TopicPage({ params }: Props) {
  const { topic } = params;
  const filePath = path.join(process.cwd(), "data", "education", "open-water", `${topic}.md`);

  if (!fs.existsSync(filePath)) return notFound();

  const source = fs.readFileSync(filePath, "utf-8");

  return (
    <article className="prose max-w-none">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{source}</ReactMarkdown>
    </article>
  );
}
