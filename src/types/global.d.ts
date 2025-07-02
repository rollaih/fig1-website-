declare global {
  // eslint-disable-next-line no-var, @typescript-eslint/no-explicit-any
  var mongoose: {
    conn: any | null;
    promise: Promise<any> | null;
  };
}