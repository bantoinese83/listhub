import Link from "next/link"
import { Shield, AlertTriangle, MapPin, DollarSign, Eye } from "lucide-react"

export default function SafetyTips() {
  return (
    <div className="rounded-lg border p-6 space-y-4">
      <div className="flex items-center gap-2">
        <Shield className="h-5 w-5 text-primary" />
        <h3 className="font-semibold">Safety Tips</h3>
      </div>

      <ul className="space-y-3">
        <li className="flex gap-2 text-sm">
          <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
          <span>Meet in a safe, public place like a coffee shop or bank lobby</span>
        </li>
        <li className="flex gap-2 text-sm">
          <DollarSign className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
          <span>Never pay or transfer money before receiving an item</span>
        </li>
        <li className="flex gap-2 text-sm">
          <Eye className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
          <span>Inspect the item and ensure it matches the description before buying</span>
        </li>
        <li className="flex gap-2 text-sm">
          <AlertTriangle className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
          <span>Trust your instincts and report suspicious behavior</span>
        </li>
      </ul>

      <Link href="/safety" className="text-sm text-primary hover:underline block mt-2">
        Read our complete safety guide
      </Link>
    </div>
  )
}

