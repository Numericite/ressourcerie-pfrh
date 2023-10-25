export function formatDateToFrenchString(tmpDate: string) {
  const date = new Date(tmpDate);

  if (!(date instanceof Date)) {
    throw new Error("Input is not a valid Date object");
  }

  const formatter = new Intl.DateTimeFormat("fr-FR", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
  });

  return formatter.format(date);
}

export function displayMonthYear(date: string) {
  const tmpDate = new Date(date);
  const month = tmpDate.toLocaleString("fr-FR", { month: "long" });
  const capitalizedMonth = month.charAt(0).toUpperCase() + month.slice(1);

  const year = tmpDate.getFullYear();
  return `${capitalizedMonth} ${year}`;
}
