const magnetLinkRegex = /magnet:\?xt=urn:[a-z0-9]+:[a-z0-9]{32}/i;

const validateMagnetLink = (uri) => {
  if (magnetLinkRegex.test(uri)) {
    return true;
  } else return false;
};

export default validateMagnetLink;
export { magnetLinkRegex, validateMagnetLink };
