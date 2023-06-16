type Keys = string | string[];

const removeObjectKeys = <T>(object: T, keys: Keys): T => {
  const copiedObject = JSON.parse(JSON.stringify(object));
  if (typeof keys === 'object') {
    for (const key in keys) {
      delete copiedObject[key];
    }
  } else {
    delete copiedObject[keys];
  }
  return copiedObject;
};

export { removeObjectKeys };
