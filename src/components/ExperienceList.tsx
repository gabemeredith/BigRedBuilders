"use client";

import { Experience } from "@/types";
import { Building2 } from "lucide-react";

interface ExperienceListProps {
  experiences: Experience[];
}

export function ExperienceList({ experiences }: ExperienceListProps) {
  const sorted = [...experiences].sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <ul className="flex flex-col gap-2.5">
      {sorted.map((exp) => (
        <li key={exp.id} className="grid grid-cols-[28px_1fr] items-center gap-3">
          <div className="flex size-7 shrink-0 items-center justify-center rounded-[7px] border border-border bg-muted overflow-hidden">
            {exp.companyLogo || exp.companyDomain ? (
              <img
                src={exp.companyLogo ?? `https://www.google.com/s2/favicons?domain=${exp.companyDomain}&sz=64`}
                alt={exp.companyName}
                className="size-4 object-contain"
                onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
              />
            ) : (
              <Building2 className="size-3.5 text-muted-foreground" />
            )}
          </div>
          <div className="min-w-0">
            <p className="truncate text-[13.5px] font-medium leading-snug">
              {exp.companyName}
            </p>
            <p className="truncate text-xs text-muted-foreground leading-snug mt-0.5">
              {exp.roleTitle}
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}
