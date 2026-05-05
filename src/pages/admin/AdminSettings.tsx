import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

export default function AdminSettings() {
  return (
    <div className="space-y-6 max-w-3xl">
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="font-display">Box office</CardTitle>
          <CardDescription>Public-facing details for Olive Send · National Theatre, Iganmu.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2"><Label>Display name</Label><Input defaultValue="Olive Send · National Theatre Box Office" /></div>
          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-2"><Label>Support email</Label><Input defaultValue="hello@olivesend.ng" /></div>
            <div className="grid gap-2"><Label>Support phone</Label><Input defaultValue="+234 800 OLIVE" /></div>
          </div>
          <div className="grid gap-2"><Label>Address</Label><Input defaultValue="National Theatre, Iganmu, Lagos" /></div>
        </CardContent>
      </Card>

      <Card className="border-border">
        <CardHeader>
          <CardTitle className="font-display">Sales</CardTitle>
          <CardDescription>Service fees and ticketing rules.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid grid-cols-3 gap-3">
            <div className="grid gap-2"><Label>Service fee (%)</Label><Input type="number" defaultValue={5} /></div>
            <div className="grid gap-2"><Label>Min ticket (₦)</Label><Input type="number" defaultValue={1000} /></div>
            <div className="grid gap-2"><Label>Max per order</Label><Input type="number" defaultValue={10} /></div>
          </div>
          <div className="flex items-center justify-between rounded-sm border border-border p-3">
            <div>
              <div className="font-medium">Hold seats during checkout</div>
              <div className="text-xs text-muted-foreground">Reserve seats for 8 minutes while a customer pays.</div>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between rounded-sm border border-border p-3">
            <div>
              <div className="font-medium">Allow refunds up to 24h before show</div>
              <div className="text-xs text-muted-foreground">After this window, refunds require manual approval.</div>
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button variant="hero" onClick={() => toast.success("Settings saved")}>Save changes</Button>
      </div>
    </div>
  );
}
