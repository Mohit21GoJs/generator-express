export const appendToObj = (
  obj: Record<any, any>,
  val: Record<any, any>
): Record<any, any> => ({
  ...obj,
  ...val
});
