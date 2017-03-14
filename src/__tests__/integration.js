import { add, always, compose as c, evolve } from "ramda";
import chroma from "chroma-js";

import Style from "../";
// define some abstract style transformations
// bumpFontSize :: CSS -> CSS
const bumpFontSize = evolve({
  fontSize: add(4),
});

// darkenText :: CSS -> CSS
const darkenText = evolve({
  color: a => chroma(a).darken().hex(),
});

// brandify :: CSS -> CSS
const brandify = evolve({
  fontFamily: always("Circular Air Pro"),
});

// and some primitive styles
const boxShadow = Style.of({
  boxShadow: "0 2px 3px rgba(0,0,0,.25)",
});

// encapsulate a style that varies on props
const GenericButtonStyle = Style(props => ({
  fontSize: 16,
  fontWeight: "bold",
  fontFamily: "SF UI Display",
  backgroundColor: props.primary ? "green" : "blue",
  color: "white",
}));

// that relies on more props
const outlineify = style =>
  Style(props => ({
    ...style,
    border: props.outline ? "1px solid currentColor" : "none",
    color: props.outline ? style.backgroundColor : style.color,
    backgroundColor: props.outline ? "transparent" : style.backgroundColor,
  }));

const defaultResult = {
  fontSize: 20,
  fontWeight: "bold",
  fontFamily: "Circular Air Pro",
  backgroundColor: "blue",
  border: "none",
  color: "#cccccc",
  boxShadow: "0 2px 3px rgba(0,0,0,.25)",
};
const primary = {
  fontSize: 20,
  fontWeight: "bold",
  fontFamily: "Circular Air Pro",
  backgroundColor: "green",
  border: "none",
  color: "#cccccc",
  boxShadow: "0 2px 3px rgba(0,0,0,.25)",
};
const outline = {
  fontSize: 20,
  fontWeight: "bold",
  fontFamily: "Circular Air Pro",
  backgroundColor: "transparent",
  border: "1px solid currentColor",
  color: "blue",
  boxShadow: "0 2px 3px rgba(0,0,0,.25)",
};

describe("composition style", () => {
  // compose some of those transformations
  const MyButtonStyle = GenericButtonStyle.map(
    c(bumpFontSize, darkenText, brandify)
  )
    .concat(boxShadow)
    .chain(outlineify);

  it("works without props", () => {
    expect(MyButtonStyle.resolve()).toEqual(defaultResult);
  });
  it("sets primary correctly", () => {
    expect(MyButtonStyle.resolve({ primary: true })).toEqual(primary);
  });
  it("sets outline correctly", () => {
    expect(MyButtonStyle.resolve({ primary: false, outline: true })).toEqual(
      outline
    );
  });
});

describe("associative style", () => {
  // associative, so could be written as
  const MyButtonStyle = GenericButtonStyle.map(bumpFontSize)
    .map(darkenText)
    .map(brandify)
    .concat(boxShadow)
    .chain(outlineify);

  it("works without props", () => {
    expect(MyButtonStyle.resolve()).toEqual(defaultResult);
  });
  it("sets primary correctly", () => {
    expect(MyButtonStyle.resolve({ primary: true })).toEqual(primary);
  });
  it("sets outline correctly", () => {
    expect(MyButtonStyle.resolve({ primary: false, outline: true })).toEqual(
      outline
    );
  });
});
