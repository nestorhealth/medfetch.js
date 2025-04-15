function t(e) {
  return {
    moduleURL: new URL(
      "/sqliteow/vtab/medfetch.vtab.mjs",
      self.location.origin
    ).toString(),
    moduleName: "medfetch",
    loaderAux: [
      new URL(
        "/sqliteow/vtab/fetch.worker.mjs",
        self.location.origin
      ).toString()
    ],
    aux: new TextEncoder().encode(e)
  };
}
export {
  t as default
};
