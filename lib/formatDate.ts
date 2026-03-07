function parseDateLoose(value: string): Date | null {
  const trimmed = value.trim();
  if (!trimmed || trimmed === "-") {
    return null;
  }

  const isoLike = trimmed.includes("T") ? trimmed : trimmed.replace(" ", "T");
  const parsed = new Date(isoLike);
  if (Number.isNaN(parsed.getTime())) {
    return null;
  }
  return parsed;
}

export function formatResultDate(dateString: string): string {
  const value = dateString?.trim() ?? "";
  if (!value || value === "-") {
    return "-";
  }

  const parsed = parseDateLoose(value);
  if (!parsed) {
    return value;
  }

  const year = parsed.getFullYear();
  const month = String(parsed.getMonth() + 1).padStart(2, "0");
  const day = String(parsed.getDate()).padStart(2, "0");
  const hours = String(parsed.getHours()).padStart(2, "0");
  const minutes = String(parsed.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day} ${hours}:${minutes}`;
}

export function formatResultDateCompact(dateString: string): string {
  const value = dateString?.trim() ?? "";
  if (!value || value === "-") {
    return "-";
  }

  const parsed = parseDateLoose(value);
  if (!parsed) {
    return value;
  }

  const day = parsed.getDate();
  const month = parsed.toLocaleString("en-US", { month: "short" });
  const year = parsed.getFullYear();
  const hours = String(parsed.getHours()).padStart(2, "0");
  const minutes = String(parsed.getMinutes()).padStart(2, "0");

  return `${day} ${month} ${year} \u2022 ${hours}:${minutes}`;
}
