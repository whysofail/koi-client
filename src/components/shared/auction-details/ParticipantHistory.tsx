"use client";

import { formatDistanceToNow } from "date-fns";
import { AuctionParticipant } from "@/types/auctionParticipantTypes";
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from "@radix-ui/react-tooltip";
import { User } from "lucide-react";
import Link from "next/link";

interface ParticipantHistoryProps {
  participants: AuctionParticipant[];
}

export function ParticipantHistory({ participants }: ParticipantHistoryProps) {
  if (participants.length === 0) {
    return (
      <div className="py-4 text-center">
        <p className="text-muted-foreground text-sm">No participants yet</p>
      </div>
    );
  }

  return (
    <div className="rounded-md ">
      <div className="overflow-y-auto" style={{ maxHeight: "300px" }}>
        {participants.map((participants) => (
          <Link
            key={participants.auction_participant_id}
            href={`/dashboard/users/${participants.user.user_id}`}
            passHref
          >
            <div className="flex  items-center space-x-3 border-b p-2 transition-colors last:border-b-0 hover:bg-slate-200/25">
              <div className="flex-shrink-0">
                {/* {bid.user?.avatarUrl ? (
                <img
                  src={bid.user.avatarUrl || "/placeholder.svg"}
                  alt={`${bid.user.name}'s avatar`}
                  className="h-8 w-8 rounded-full"
                />
              ) :
               */}

                <div className="bg-muted flex h-8 w-8 items-center justify-center rounded-full">
                  <User className="text-muted-foreground h-4 w-4" />
                </div>
              </div>
              <div className="min-w-0 flex-grow">
                <div className="flex items-center space-x-2">
                  <p className="truncate  font-medium">
                    {participants.user.username}
                  </p>
                  <p className="text-sm">Joined auction</p>
                </div>
              </div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <p className="text-muted-foreground text-xs">
                      {formatDistanceToNow(new Date(participants.joined_at), {
                        addSuffix: true,
                      })}
                    </p>
                  </TooltipTrigger>
                  <TooltipContent sideOffset={0} side="top" align="start">
                    {new Date(participants.joined_at).toLocaleString()}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
