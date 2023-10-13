function CleanObject(obj) {
  if (!obj) return obj;

  const { __v, _id, ...rest } = obj;
  return { id: _id, ...rest };
}

export default CleanObject;
