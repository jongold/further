// @flow
import fl from "fantasy-land";
import render, { Provider } from "./react";

export { Provider };

// Style :: => (Props -> CSS) -> Style CSS
function Style(f) {
  if (!(this instanceof Style)) return new Style(f);
  if (typeof f !== "function") {
    throw new TypeError(
      `Style expects to be called with a function. Actual ${f}`
    );
  }

  this.__value = f;
  return this;
}

// .of :: Applicative a -> Style a
Style.prototype.of = function(a) {
  return new Style(() => a);
};
Style.of = Style.prototype.of;
Style.prototype[fl.of] = Style.prototype.of;
Style[fl.of] = Style.of;

// #concat :: Semigroup Style => Style ~> Style -> Style
Style.prototype.concat = function(a) {
  return new Style(props => {
    return { ...this.resolve(props), ...a.resolve(props) };
  });
};
Style.prototype[fl.concat] = Style.prototype.concat;

// .empty :: Monoid Style => () -> Style
Style.prototype.empty = () => Style.of({});
Style.empty = Style.prototype.empty;
Style.prototype[fl.empty] = Style.prototype.empty;
Style[fl.empty] = Style.empty;

// #map :: Functor Style => Style a ~> (a -> b) -> Style b
Style.prototype.map = function(f) {
  return new Style(props => {
    return f(this.resolve(props));
  });
};
Style.prototype[fl.map] = Style.prototype.map;

// chain :: Chain Style => Style a ~> (a -> Style b) -> Style b
Style.prototype.chain = function(f) {
  return new Style(props => {
    const a = this.resolve(props);

    return f(a).resolve(props);
  });
};
Style.prototype[fl.chain] = Style.prototype.chain;

// from :: Array Style -> Style
Style.prototype.from = function(arr) {
  return new Style(props => {
    return arr
      .reduce(
        (x, y) => x.concat(y),
        this instanceof Style ? this : Style.empty()
      )
      .resolve(props);
  });
};
Style.from = Style.prototype.from;

// ap :: Apply Style => Style a ~> Style (a -> b) -> Style b )
Style.prototype.ap = function(a) {
  // eslint-disable-next-line
  return a.chain(f => this.map(f => f));
};
Style.prototype[fl.ap] = Style.prototype.ap;

// #resolve :: Style a ~> Props -> CSS
Style.prototype.resolve = function(props = {}) {
  return this.__value(props);
};

// #render :: Style a ~> React<Component> -> React<Component>
Style.prototype.render = render;

export default Style;
