import type { IvySchool } from "@/types";

const DOMAIN_TO_SCHOOL: Record<string, IvySchool> = {
  "harvard.edu": "Harvard",
  "yale.edu": "Yale",
  "princeton.edu": "Princeton",
  "columbia.edu": "Columbia",
  "barnard.edu": "Columbia",
  "cornell.edu": "Cornell",
  "dartmouth.edu": "Dartmouth",
  "brown.edu": "Brown",
  "upenn.edu": "Penn",
};

export function getIvySchoolFromEmail(email: string): IvySchool | null {
  const domain = email.split("@")[1]?.toLowerCase();
  if (!domain) return null;
  for (const [ivyDomain, school] of Object.entries(DOMAIN_TO_SCHOOL)) {
    if (domain === ivyDomain || domain.endsWith("." + ivyDomain)) return school;
  }
  return null;
}

export function isIvyEduEmail(email: string): boolean {
  return getIvySchoolFromEmail(email) !== null;
}
