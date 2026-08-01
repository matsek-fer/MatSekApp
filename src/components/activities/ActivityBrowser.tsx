"use client";

import { useState } from "react";
import type { Activity } from "@/types";
import ActivityListItem from "./ActivityListItem";
import Button from "@/components/ui/Button";

/** How many of the soonest events the calendar opens with. */
const PREVIEW = 3;

/**
 * The calendar's list.
 *
 * Opens on the next few events and nothing else. Everything before now sits
 * behind the control above the list, everything further ahead behind the one
 * below it, so the page starts as the short answer to "what is on soon".
 *
 * Both expanded sections carry their own close control, and both are sticky:
 * the one closing the past pins to the top of the viewport, the one closing the
 * future to the bottom. A term's worth of events is a long scroll, and a close
 * button you have to go back to the far end of the list to reach is a close
 * button that does not exist.
 */
export default function ActivityBrowser({
  upcoming,
  past,
}: {
  upcoming: Activity[];
  past: Activity[];
}) {
  const [showPast, setShowPast] = useState(false);
  const [showAllUpcoming, setShowAllUpcoming] = useState(false);

  const preview = upcoming.slice(0, PREVIEW);
  const rest = upcoming.slice(PREVIEW);

  return (
    <div className="space-y-4">
      {past.length > 0 &&
        (showPast ? (
          <section aria-label="Prošle aktivnosti" className="space-y-3">
            {/* Below the navbar, which is sticky at 4rem and would otherwise
                cover this. */}
            <div className="sticky top-16 z-20 -mx-1 border-b border-border bg-bg px-1 pb-2 pt-1
                         shadow-[0_10px_16px_-12px_rgb(0_0_0/0.8)]">
              <Button
                variant="secondary"
                fullWidth
                onClick={() => setShowPast(false)}
              >
                ↑ Sakrij prošle aktivnosti
              </Button>
            </div>

            <ul className="grid gap-3">
              {past.map((activity) => (
                <ActivityListItem key={activity.id} activity={activity} past />
              ))}
            </ul>

            <p className="text-center text-sm text-fg-subtle">
              Gore su prošle aktivnosti · dolje slijedi ono što tek dolazi
            </p>
          </section>
        ) : (
          <Button
            variant="ghost"
            fullWidth
            onClick={() => setShowPast(true)}
          >
            ↑ Prikaži prošle aktivnosti ({past.length})
          </Button>
        ))}

      <ul className="grid gap-3">
        {(showAllUpcoming ? upcoming : preview).map((activity) => (
          <ActivityListItem key={activity.id} activity={activity} />
        ))}
      </ul>

      {rest.length > 0 &&
        (showAllUpcoming ? (
          <div className="sticky bottom-0 z-20 -mx-1 border-t border-border bg-bg px-1 pb-1 pt-2
                       shadow-[0_-10px_16px_-12px_rgb(0_0_0/0.8)]">
            <Button
              variant="secondary"
              fullWidth
              onClick={() => setShowAllUpcoming(false)}
            >
              ↓ Sakrij ostale aktivnosti
            </Button>
          </div>
        ) : (
          <Button
            variant="ghost"
            fullWidth
            onClick={() => setShowAllUpcoming(true)}
          >
            ↓ Prikaži sve nadolazeće ({rest.length} više)
          </Button>
        ))}
    </div>
  );
}
