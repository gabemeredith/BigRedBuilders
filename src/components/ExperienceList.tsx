"use client";

import { Experience } from "@/types";
import { Building2 } from "lucide-react";

interface ExperienceListProps {
  experiences: Experience[];
}

export function ExperienceList({ experiences }: ExperienceListProps) {
  const sorted = [...experiences].sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <ul className="flex flex-col gap-3">
      {sorted.map((exp) => (
        <li key={exp.id} className="flex items-center gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted">
            {exp.companyLogo ? (
              <img
                src={exp.companyLogo}
                alt={exp.companyName}
                className="size-5 object-contain"
              />
            ) : (
              <Building2 className="size-4 text-muted-foreground" />
            )}
          </div>
          <div className="min-w-0">
            <p className="truncate text-base font-medium leading-tight">
              {exp.companyName}
            </p>
            <p className="truncate text-sm text-muted-foreground leading-tight">
              {exp.roleTitle}
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}
