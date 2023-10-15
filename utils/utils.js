function toTitle(str) {
  return str.replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export { toTitle };
