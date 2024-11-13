export const truncateText = (string: string, length: number, end = "...") => {
    return string.length < length ? string : string.substring(0, length) + end;
  };
  