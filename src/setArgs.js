import Style from "./";

// can be used to update, overwrite, or reset arguemnts anywhere in the chain
// f: reducer function for argument object

// #setArgs :: Style ~> (a -> a) -> Style
const setArgs = function(f) {
  if (typeof f !== "function") {
    throw TypeError(
      `setArgs expects to be called with a function. Actual: ${f}`
    );
  }
  return new Style(props => {
    return this.resolve(f(props));
  });
};

export default setArgs;
