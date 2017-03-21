import React from "react";
import renderer from "react-test-renderer";
import Provider from "fela/lib/bindings/react/Provider";

import Style from "../";

describe("react-web integration", () => {
  let W;
  let generated = jest.fn(_ => JSON.stringify(_));
  beforeEach(() => {
    // pseusdo renderer
    const fela = {
      renderRule: (func, props) => generated(func(props)),
    };
    // eslint-disable-next-line react/display-name, react/prop-types
    W = ({ children }) => <Provider renderer={fela}>{children}</Provider>;
  });
  afterEach(() => {
    generated.mockClear();
  });

  it("has a render function which returns a react component", () => {
    // eslint-disable-next-line
    const Link = Style.of({ color: "inherit", textDecoration: "none" })
      .render("div");

    const tree = renderer.create(<W><Link /></W>);
    expect(tree).toMatchSnapshot();

    expect(generated).toBeCalledWith({
      color: "inherit",
      textDecoration: "none",
    });
  });
  it("Allows mapping on the component", () => {
    const Link = Style.of({ color: "inherit", textDecoration: "none" })
      .render("div");

    const NewLink = Link.map(style => ({ ...style, padding: 10 }));
    const tree = renderer.create(<W><NewLink /></W>);
    expect(tree).toMatchSnapshot();

    expect(generated).toBeCalledWith({
      color: "inherit",
      textDecoration: "none",
      padding: 10,
    });
  });
  it("Allows mapping on the component using class", () => {
    const Link = Style.of({ color: "inherit", textDecoration: "none" })
      .render("div");

    const padding = style => ({ ...style, padding: 10 });
    const NewLink = Link.class(padding);

    const tree = renderer.create(<W><NewLink /></W>);
    expect(tree).toMatchSnapshot();
    expect(generated).toBeCalledWith({
      color: "inherit",
      textDecoration: "none",
      padding: 10,
    });
  });
  it("Allows concating on the component", () => {
    const Link = Style.of({ color: "inherit", textDecoration: "none" })
      .render("div");

    const padding = Style.of({ padding: 10 });
    const NewLink = Link.concat(padding);

    const tree = renderer.create(<W><NewLink /></W>);
    expect(tree).toMatchSnapshot();
    expect(generated).toBeCalledWith({
      color: "inherit",
      textDecoration: "none",
      padding: 10,
    });
  });
  it("Allows concating on the component with add", () => {
    const Link = Style.of({ color: "inherit", textDecoration: "none" })
      .render("div");

    const padding = Style.of({ padding: 10 });
    const NewLink = Link.add(padding);

    const tree = renderer.create(<W><NewLink /></W>);
    expect(tree).toMatchSnapshot();
    expect(generated).toBeCalledWith({
      color: "inherit",
      textDecoration: "none",
      padding: 10,
    });
  });
});
describe("react-native integration", () => {
  let W;
  let generated = jest.fn(_ => JSON.stringify(_));
  beforeEach(() => {
    // pseusdo renderer
    const fela = {
      renderRule: (func, props) => generated(func(props)),
      isNativeRenderer: true,
    };
    // eslint-disable-next-line react/display-name, react/prop-types
    W = ({ children }) => <Provider renderer={fela}>{children}</Provider>;
  });
  afterEach(() => {
    generated.mockClear();
  });

  it("has a render function which returns a react component", () => {
    // eslint-disable-next-line
    const Link = Style.of({ color: "inherit", textDecoration: "none" })
      .render("div");

    const tree = renderer.create(<W><Link /></W>);
    expect(tree).toMatchSnapshot();

    expect(generated).toBeCalledWith({
      color: "inherit",
      textDecoration: "none",
    });
  });
  it("Allows mapping on the component", () => {
    const Link = Style.of({ color: "inherit", textDecoration: "none" })
      .render("div");

    const NewLink = Link.map(style => ({ ...style, padding: 10 }));
    const tree = renderer.create(<W><NewLink /></W>);
    expect(tree).toMatchSnapshot();

    expect(generated).toBeCalledWith({
      color: "inherit",
      textDecoration: "none",
      padding: 10,
    });
  });
  it("Allows mapping on the component using class", () => {
    const Link = Style.of({ color: "inherit", textDecoration: "none" })
      .render("div");

    const padding = style => ({ ...style, padding: 10 });
    const NewLink = Link.class(padding);

    const tree = renderer.create(<W><NewLink /></W>);
    expect(tree).toMatchSnapshot();
    expect(generated).toBeCalledWith({
      color: "inherit",
      textDecoration: "none",
      padding: 10,
    });
  });
  it("Allows concating on the component", () => {
    const Link = Style.of({ color: "inherit", textDecoration: "none" })
      .render("div");

    const padding = Style.of({ padding: 10 });
    const NewLink = Link.concat(padding);

    const tree = renderer.create(<W><NewLink /></W>);
    expect(tree).toMatchSnapshot();
    expect(generated).toBeCalledWith({
      color: "inherit",
      textDecoration: "none",
      padding: 10,
    });
  });
  it("Allows concating on the component with add", () => {
    const Link = Style.of({ color: "inherit", textDecoration: "none" })
      .render("div");

    const padding = Style.of({ padding: 10 });
    const NewLink = Link.add(padding);

    const tree = renderer.create(<W><NewLink /></W>);
    expect(tree).toMatchSnapshot();
    expect(generated).toBeCalledWith({
      color: "inherit",
      textDecoration: "none",
      padding: 10,
    });
  });
});
