export const fmtDateTime = (s?: string | number) =>
  s ? new Date(s).toLocaleString() : "-";
