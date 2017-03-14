// @flow

// Style :: => (Props -> CSS) -> Style CSS
function Style(f) {
  if (!(this instanceof Style)) {
    return new Style(f);
  }

  this.__value = typeof f === "function" ? f : () => f;
  return this;
}

// .of :: Applicative a -> Style a
Style.prototype.of = function(a) {
  return new Style(a);
};
Style.of = Style.prototype.of;

// #concat :: Semigroup Style => Style ~> Style -> Style
Style.prototype.concat = function(a) {
  return new Style(props => {
    return { ...this.resolve(props), ...a.resolve(props) };
  });
};

// .empty :: Monoid Style => () -> Style
Style.prototype.empty = () => Style.of({});
Style.empty = Style.prototype.empty;

// #map :: Functor Style => Style a ~> (a -> b) -> Style b
Style.prototype.map = function(f) {
  return new Style(props => {
    return f(this.resolve(props));
  });
};

// chain :: Chain Style => Style a ~> (a -> Style b) -> Style b
Style.prototype.chain = function(f) {
  return new Style(props => {
    const a = this.resolve(props);

    return f(a).resolve(props);
  });
};

// ap :: Apply Style => Style a ~> Style (a -> b) -> Style b )
Style.prototype.ap = function(a) {
  // eslint-disable-next-line
  return a.chain(f => this.map(f => f));
};

// #resolve :: Style a ~> Props -> CSS
Style.prototype.resolve = function(props = {}) {
  return this.__value(props);
};

export default Style;
