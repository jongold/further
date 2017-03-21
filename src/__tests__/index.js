import fl from "fantasy-land";
import Style from "../";

describe("constructor", () => {
  it("retuns an instance without calling new", () => {
    const st = Style(() => ({}));
    expect(st instanceof Style).toBe(true);
  });

  it("saves a function if passed", () => {
    const st = Style(() => ({ foo: "bar" }));
    expect(st.__value()).toEqual({ foo: "bar" });
  });

  it("should error if anything other than a function is passed", () => {
    expect(() => Style({ foo: "bar" })).toThrowError(TypeError);
    expect(() => Style(5)).toThrowError(TypeError);
    expect(() => Style("foo")).toThrowError(TypeError);
    expect(() => Style(true)).toThrowError(TypeError);
  });
});

describe("Applicative", () => {
  it("is a static function which returns a Style", () => {
    const st = Style.of({});
    expect(st instanceof Style).toBe(true);
  });
  it("is available on the prototype", () => {
    const st = Style.of({});
    expect(st.of({}) instanceof Style).toBe(true);
  });
  it("is available on the constructor of the returned Style", () => {
    const st = Style.of({});
    expect(st.constructor.of({}) instanceof Style).toBe(true);
  });
  it("is fantasy-land compatible", () => {
    const st = Style.of({});
    expect(st[fl.of]({}) instanceof Style).toBe(true);
  });
});

describe("Semigroup", () => {
  it("joins two Style's together", () => {
    const st = Style.of({ color: "blue" }).concat(Style.of({ padding: 20 }));
    expect(st.resolve()).toEqual({ color: "blue", padding: 20 });
  });
  it("is associative", () => {
    const a = Style.of({ color: "blue" });
    const b = Style.of({ padding: 20 });
    const c = Style.of({ margin: 10 });

    const st1 = a.concat(b).concat(c);
    const st2 = a.concat(b.concat(c));

    expect(st1.resolve()).toEqual(st2.resolve());
  });
  it("returns a Style", () => {
    const st = Style.of({ color: "blue" }).concat(Style.of({ padding: 20 }));
    expect(st instanceof Style).toBe(true);
  });
  it("is fantasy-land compatible", () => {
    const st = Style.of({ color: "blue" })[fl.concat](
      Style.of({ padding: 20 })
    );
    expect(st instanceof Style).toBe(true);
  });
});

describe("Monoid", () => {
  it("is a static function which returns a Style", () => {
    const st = Style.empty();
    expect(st instanceof Style).toBe(true);
  });
  it("is available on the prototype", () => {
    const st = Style.empty();
    expect(st.of({}) instanceof Style).toBe(true);
  });
  it("is available on the constructor of the returned Style", () => {
    const st = Style.empty();
    expect(st.constructor.of({}) instanceof Style).toBe(true);
  });
  it("is fantasy-land compatible", () => {
    const st = Style[fl.empty]();
    expect(st.of({}) instanceof Style).toBe(true);
  });
  it("implements Semigroup right identity", () => {
    const st = Style.of({ color: "blue" });
    expect(st.concat(Style.empty()).resolve()).toEqual(st.resolve());
  });
  it("implements Semigroup left identity", () => {
    const st = Style.of({ color: "blue" });
    expect(Style.empty().concat(st).resolve()).toEqual(st.resolve());
  });
});

describe("Functor", () => {
  it("st.map(a => a) is equivalent to st (identity)", () => {
    const st = Style.of({ color: "blue" });
    expect(st.map(a => a).resolve()).toEqual(st.resolve());
  });
  it("st.map(x => f(g(x))) is equivalent to st.map(g).map(f) (composition)", () => {
    const st = Style.of({ color: "blue" });
    const f = a => a;
    const g = a => ({ ...a, ...{ padding: 20 } });

    expect(st.map(x => f(g(x))).resolve()).toEqual(st.map(g).map(f).resolve());
  });
  it("returns a Style", () => {
    const st = Style.of({ color: "blue" });
    const f = a => a;

    expect(st.map(f) instanceof Style).toBe(true);
  });
  it("is fantasy-land compatible", () => {
    const st = Style.of({ color: "blue" });
    const f = a => a;

    expect(st[fl.map](f) instanceof Style).toBe(true);
  });
});

describe("Chain", () => {
  it("st.chain(f).chain(g) is equivalent to st.chain(x => f(x).chain(g)) (associativity)", () => {
    const st = Style(props => ({ color: props.color }));
    const f = x => Style(props => ({ ...x, margin: props.margin + 1 }));
    const g = x => Style(props => ({ ...x, padding: props.padding / 2 }));

    const result1 = st.chain(f).chain(g);
    const result2 = st.chain(x => f(x).chain(g));

    const props = { color: "blue", padding: 10, margin: 9 };
    expect(result1.resolve(props)).toEqual(result2.resolve(props));
  });
  it("returns a Style", () => {
    const st = Style.of(props => ({ color: props.color }));
    const f = x => Style.of(props => ({ ...x, margin: props.margin + 1 }));

    expect(st.chain(f) instanceof Style);
  });

  it("is fantasy-land compatible", () => {
    const st = Style.of(props => ({ color: props.color }));
    const f = x => Style.of(props => ({ ...x, margin: props.margin + 1 }));

    expect(st[fl.chain](f) instanceof Style);
  });
});

describe("Apply", () => {
  it("st.ap(st2.ap(st3.map(f => g => x => f(g(x))))) is equivalent to st.ap(st2).ap(st3) (composition)", () => {
    const st = Style.of(x => ({ ...x, color: "blue" }));
    const st2 = Style.of(x => ({ ...x, padding: 10 }));
    const st3 = Style.of(x => ({ ...x, margin: 10 }));

    const result1 = st.ap(st2.ap(st3.map(f => g => x => f(g(x)))));
    const result2 = st.ap(st2).ap(st3);

    expect(result1.resolve()).toEqual(result2.resolve());
  });

  it("is fantasy-land compatible", () => {
    const st = Style.of(x => ({ ...x, color: "blue" }));
    const st2 = Style.of(x => ({ ...x, padding: 10 }));
    const st3 = Style.of(x => ({ ...x, margin: 10 }));

    const result1 = st[fl.ap](st2[fl.ap](st3.map(f => g => x => f(g(x)))));
    const result2 = st.ap(st2)[fl.ap](st3);

    expect(result1.resolve()).toEqual(result2.resolve());
  });
});

describe("resolve", () => {
  it("passes a default object if no props", () => {
    const st = Style(x => ({ ...x, color: "blue" }));
    expect(st.resolve()).toEqual({ color: "blue" });
  });
  it("executes the value of the Style with the passed object", () => {
    const st = Style(x => ({ ...x, color: "blue" }));
    expect(st.resolve({ padding: 10 })).toEqual({ padding: 10, color: "blue" });
  });
});

it("remaps common prototypes for component names", () => {
  const st = Style.of({ color: "blue" });

  // class => map
  expect(st.map(_ => _).resolve({})).toEqual(st.class(_ => _).resolve({}));

  // add => concat
  expect(st.concat(Style.of({ backgroundColor: "pink" })).resolve({})).toEqual(
    st.add(Style.of({ backgroundColor: "pink" })).resolve({})
  );

  const apst = Style(_ => ({ ..._ }));
  // apply = ap
  expect(apst.ap(Style.of({ color: "blue" })).resolve()).toEqual(
    apst.apply(Style.of({ color: "blue" })).resolve()
  );
});
