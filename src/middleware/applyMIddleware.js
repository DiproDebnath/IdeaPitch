function chainFunctions(funcs) {
  if (funcs.length === 1) {
    return funcs[0];
  }
  return funcs.reduce((currentMiddleware, nextMiddleware) =>
    currentMiddleware(nextMiddleware)
  );
}

module.exports = chainFunctions;
