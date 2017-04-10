import Style from "../";

describe("setArgs", () => {
  const originalStyle = Style(props => ({
    color: "blue",
    backgroundColor: props.bg,
  }));

  it("modifies args sent to original style", () => {
    const modified = originalStyle.setArgs(() => ({
      bg: "orange",
    }));
    expect(modified.resolve({ bg: "black" })).toEqual({
      color: "blue",
      backgroundColor: "orange",
    });
  });

  it("allows clearing of args with empty return", () => {
    const modified = originalStyle.setArgs(() => ({}));
    expect(modified.resolve({ bg: "black" })).toEqual({
      color: "blue",
      backgroundColor: undefined,
    });
  });

  it("allows addition of args by merging", () => {
    const withSize = originalStyle
      .concat(
        Style(x => ({
          fontSize: x.size,
        }))
      )
      .setArgs(x => ({ size: "12px", ...x }));
    expect(withSize.resolve({ bg: "black" })).toEqual({
      color: "blue",
      backgroundColor: "black",
      fontSize: "12px",
    });
  });

  it("doesn't check return type of the reducer function", () => {
    const badReducer = originalStyle.setArgs(() => "hey");
    expect(() => badReducer.resolve()).not.toThrowError();
    expect(badReducer.resolve()).toEqual({
      color: "blue",
      backgroundColor: undefined,
    });
  });

  it("throws when called with arguemnts that aren't functions", () => {
    expect(() => originalStyle.setArgs("well hiya")).toThrow(TypeError);
    expect(() => originalStyle.setArgs(42)).toThrow(TypeError);
    expect(() => originalStyle.setArgs({ msg: "hiya" })).toThrow(TypeError);
    expect(() => originalStyle.setArgs(() => ({}))).not.toThrow(TypeError);
  });
});
