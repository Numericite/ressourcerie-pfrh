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

export function cssStringToObject(cssString: string) {
  const cssArray = cssString.split(";").filter(Boolean);
  const cssObject: any = {};

  cssArray.forEach((entry) => {
    const [property, value] = entry.split(":").map((str) => str.trim());
    const jsProperty = property.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
    cssObject[jsProperty] = value;
  });

  return cssObject;
}
