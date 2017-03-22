import React from "react";
import renderer from "react-test-renderer";

import Style, { Provider } from "../";

it("throws if not renderer found in the context", () => {
  const Link = Style.of({ color: "inherit", textDecoration: "none" }).render(
    "div"
  );

  const NewLink = Link.map(style => ({ ...style, padding: 10 }));
  try {
    renderer.create(<NewLink />);
  } catch (e) {
    expect(e.message).toContain("render() can't render");
  }
});

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
    const Link = Style.of({ color: "inherit", textDecoration: "none" }).render(
      "div"
    );

    const tree = renderer.create(
      <W><Link style={{ backgroundColor: "blue" }} /></W>
    );
    expect(tree).toMatchSnapshot();

    expect(generated).toBeCalledWith({
      color: "inherit",
      textDecoration: "none",
    });
  });
  it("allows choosing type via props", () => {
    // eslint-disable-next-line
    const Link = Style.of({ color: "inherit", textDecoration: "none" }).render(
      "div"
    );

    const tree = renderer.create(<W><Link is="span" /></W>);
    expect(tree).toMatchSnapshot();

    expect(generated).toBeCalledWith({
      color: "inherit",
      textDecoration: "none",
    });
  });

  it("Allows mapping on the component", () => {
    const Link = Style.of({ color: "inherit", textDecoration: "none" }).render(
      "div"
    );

    const NewLink = Link.map(style => ({ ...style, padding: 10 }));
    const tree = renderer.create(<W><NewLink id="10" /></W>);
    expect(tree).toMatchSnapshot();

    expect(generated).toBeCalledWith({
      color: "inherit",
      textDecoration: "none",
      padding: 10,
    });
  });
  it("Allows concating on the component", () => {
    const Link = Style.of({ color: "inherit", textDecoration: "none" }).render(
      "div"
    );

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
    const Link = Style.of({ color: "inherit", textDecoration: "none" }).render(
      "div"
    );

    const tree = renderer.create(<W><Link /></W>);
    expect(tree).toMatchSnapshot();

    expect(generated).toBeCalledWith({
      color: "inherit",
      textDecoration: "none",
    });
  });
  it("Allows mapping on the component", () => {
    const Link = Style.of({ color: "inherit", textDecoration: "none" }).render(
      "div"
    );

    const NewLink = Link.map(style => ({ ...style, padding: 10 }));
    const tree = renderer.create(<W><NewLink /></W>);
    expect(tree).toMatchSnapshot();

    expect(generated).toBeCalledWith({
      color: "inherit",
      textDecoration: "none",
      padding: 10,
    });
  });
  it("Allows concating on the component", () => {
    const Link = Style.of({ color: "inherit", textDecoration: "none" }).render(
      "div"
    );

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
});
