import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Edit, Eye } from "lucide-react";

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
      .replace(/^# (.*$)/gm, '<h1 class="text-2xl font-bold mb-4 text-slate-900">$1</h1>')
      .replace(/^## (.*$)/gm, '<h2 class="text-xl font-semibold mb-3 text-slate-800">$1</h2>')
      .replace(/^### (.*$)/gm, '<h3 class="text-lg font-medium mb-2 text-slate-700">$1</h3>')
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-slate-900">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="italic text-slate-700">$1</em>')
      .replace(/`(.*?)`/g, '<code class="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-sm font-mono text-slate-900 dark:text-slate-100">$1</code>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-500 hover:text-blue-600 underline transition-colors">$1</a>')
      .replace(/^\* (.*)$/gm, '<li class="ml-4 text-slate-600">• $1</li>')
      .replace(/^\d+\. (.*)$/gm, '<li class="ml-4 text-slate-600">$1</li>')
      .replace(/\n\n/g, '</p><p class="mb-4 text-slate-600 leading-relaxed">')
      .replace(/\n/g, '<br>');

    // Wrap in paragraph if content doesn't start with a block element
    if (html && !html.match(/^<(h[1-6]|p|li)/)) {
      html = '<p class="mb-4 text-slate-600 leading-relaxed">' + html + '</p>';
    }

    setPreview(html || '<p class="text-slate-500 italic">Content preview will appear here...</p>');
  }, [value]);

  return (
    <div className={className}>
      <Label className="block text-sm font-medium text-slate-700 mb-3">
        {label} *
      </Label>
      
      <Tabs defaultValue="edit" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="edit" className="flex items-center gap-2">
            <Edit size={16} />
            Edit
          </TabsTrigger>
          <TabsTrigger value="preview" className="flex items-center gap-2">
            <Eye size={16} />
            Preview
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="edit" className="mt-4">
          <Textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full h-80 font-mono text-sm resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <div className="mt-2 text-xs text-slate-500">
            Supports: **bold**, *italic*, `code`, [links](url), # headers, * lists
          </div>
        </TabsContent>
        
        <TabsContent value="preview" className="mt-4">
          <div 
            className="w-full h-80 p-4 border border-slate-300 rounded-md bg-slate-50 dark:bg-slate-900 dark:border-slate-700 overflow-y-auto prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: preview }}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
