import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  className?: string;
}

export function MarkdownEditor({ 
  value, 
  onChange, 
  placeholder = "Write your content in markdown...", 
  label = "Content (Markdown)",
  className = ""
}: MarkdownEditorProps) {
  const [preview, setPreview] = useState("");

  useEffect(() => {
    // Simple markdown to HTML conversion
    let html = value
      .replace(/^# (.*$)/gm, '<h1 class="text-2xl font-bold mb-4">$1</h1>')
      .replace(/^## (.*$)/gm, '<h2 class="text-xl font-semibold mb-3">$1</h2>')
      .replace(/^### (.*$)/gm, '<h3 class="text-lg font-medium mb-2">$1</h3>')
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
      .replace(/`(.*?)`/g, '<code class="bg-slate-100 px-1 py-0.5 rounded text-sm">$1</code>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-500 hover:text-blue-600 underline">$1</a>')
      .replace(/\n\n/g, '</p><p class="mb-4">')
      .replace(/\n/g, '<br>');

    if (html && !html.startsWith('<p')) {
      html = '<p class="mb-4">' + html + '</p>';
    }

    setPreview(html || '<p class="text-slate-500">Content preview will appear here...</p>');
  }, [value]);

  return (
    <div className={`grid grid-cols-1 lg:grid-cols-2 gap-4 ${className}`}>
      <div>
        <Label className="block text-sm font-medium text-slate-700 mb-2">
          {label} *
        </Label>
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full h-80 font-mono text-sm resize-none"
        />
      </div>
      <div>
        <Label className="block text-sm font-medium text-slate-700 mb-2">
          Preview
        </Label>
        <div 
          className="w-full h-80 p-3 border border-slate-300 rounded-md bg-slate-50 overflow-y-auto prose prose-sm max-w-none"
          dangerouslySetInnerHTML={{ __html: preview }}
        />
      </div>
    </div>
  );
}
