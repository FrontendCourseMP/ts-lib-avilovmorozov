function resolver(value: unknown) {
  if (typeof value === "undefined") {
    return "-";
  } else if (typeof value === "object" && !value) {
    return "-";
  } else {
    return String(value);
  }
}

function makeTable(data: Array<Record<string, unknown>>, columns: string[]) {
  const columnSizes = columns.reduce((acc, val) => ({
    ...acc,
    [val]: Math.max(...data.map((row) => resolver(row[val]).length))
  }), {})

  return columnSizes
}
