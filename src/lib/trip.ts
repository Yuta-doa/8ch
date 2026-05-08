import { createHash } from "crypto";

export type ParsedName = {
  displayName: string;
  trip: string | null;
};

export function parseName(rawName: string | null | undefined): ParsedName {
  const normalized = (rawName ?? "").trim();

  if (!normalized) {
    return {
      displayName: "名無しさん",
      trip: null,
    };
  }

  const separatorIndex = normalized.indexOf("#");

  if (separatorIndex === -1) {
    return {
      displayName: normalized,
      trip: null,
    };
  }

  const displayName = normalized.slice(0, separatorIndex).trim() || "名無しさん";
  const secret = normalized.slice(separatorIndex + 1);

  if (!secret) {
    return {
      displayName,
      trip: null,
    };
  }

  const trip = createHash("sha256").update(secret).digest("base64url").slice(0, 10);

  return {
    displayName,
    trip,
  };
}

export function formatName(name: string, trip: string | null) {
  return trip ? `${name}◆${trip}` : name;
}