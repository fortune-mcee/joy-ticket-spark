import { useState } from "react";
import { CATEGORIES, events } from "@/data/events";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Trash2, Plus } from "lucide-react";
import { toast } from "sonner";

export default function AdminCategories() {
  const [cats, setCats] = useState<string[]>([...CATEGORIES]);
  const [val, setVal] = useState("");

  const count = (c: string) => events.filter((e) => e.category === c).length;

  return (
    <div className="space-y-6 max-w-3xl">
      <Card className="border-border">
        <CardHeader><CardTitle className="font-display">Add category</CardTitle></CardHeader>
        <CardContent>
          <form
            className="flex gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              if (!val.trim()) return;
              if (cats.includes(val.trim())) { toast.error("Category exists"); return; }
              setCats([...cats, val.trim()]);
              setVal("");
              toast.success("Category added");
            }}
          >
            <Input value={val} onChange={(e) => setVal(e.target.value)} placeholder="e.g. Comedy" />
            <Button type="submit" variant="hero"><Plus className="h-4 w-4" /> Add</Button>
          </form>
        </CardContent>
      </Card>

      <Card className="border-border">
        <CardHeader><CardTitle className="font-display">All categories</CardTitle></CardHeader>
        <CardContent className="divide-y divide-border">
          {cats.map((c) => (
            <div key={c} className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                <span className="font-medium">{c}</span>
                <Badge variant="outline" className="font-mono-label">{count(c)} events</Badge>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  if (count(c) > 0) { toast.error("Cannot delete: events use this category"); return; }
                  setCats(cats.filter((x) => x !== c));
                  toast.success("Removed");
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
