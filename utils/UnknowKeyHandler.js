const UnknownKeyHandler = ({ unknown }) => {
  const unknow_keys = unknown.split(", ");

  const error_msg = `${unknow_keys.join(", ")} ${
    unknow_keys.length > 1 ? "are invalid keys" : "is a invalid key"
  }`;

  return error_msg;
};

export default UnknownKeyHandler;
