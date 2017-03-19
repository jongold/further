# Further
[![npm](https://img.shields.io/npm/v/@jongold/further.svg)](https://www.npmjs.com/package/@jongold/further)
[![CircleCI](https://circleci.com/gh/jongold/further.svg?style=shield)](https://circleci.com/gh/jongold/further)
[![FantasyLand](https://img.shields.io/badge/FantasyLand-3-ff69b4.svg)](https://github.com/fantasyland/fantasy-land)

Further adventures
down the functional styling rabbit hole
leading to the fantasy land

* 🦄 algebraic style composition
* 🌈 compose evolutions & transformations
* 🍄 abstract interaction with props

## Usage
```js
import Style from '@jongold/further';
import { add, always, compose as c, evolve } from 'ramda';
import chroma from 'chroma';
import { Touchable, View } from 'react-primitives'; // or react-native etc

// define some abstract style transformations
// bumpFontSize :: CSS -> CSS
const bumpFontSize = evolve({
  fontSize: add(4),
});

// darkenText :: CSS -> CSS
const darkenText = evolve({
  color: c => chroma(a).darken(),
});

// brandify :: CSS -> CSS
const brandify = evolve({
  fontFamily: always('Circular Air Pro'),
});

// and some primitive styles
const boxShadow = {
  boxShadow: '0 2px 3px rgba(0,0,0,.25)',
};

// encapsulate a style that varies on props
const GenericButtonStyle = Style(props => ({
  fontSize: 16,
  fontWeight: 'bold',
  fontFamily: 'SF UI Display'
  backgroundColor: props.primary ? 'green' : 'blue',
  color: 'white',
}));

// and maybe another transform
// that relies on more props
const outlineify = style => Style(props => ({
  ...style,
  border: props.outline ? '1px solid currentColor' : 'none',
  color: props.outline ? style.backgroundColor : style.color,
  backgroundColor: props.outline ? 'transparent' : style.backgroundColor,
}));

// compose some of those transformations
const MyButtonStyle = GenericButtonStyle.map(
  c(bumpFontSize, darkenText, brandify)
).concat(boxShadow).chain(outlineify);

// associative, so could be written as
const MyButtonStyle = GenericButtonStyle
  .map(bumpFontSize)
  .map(darkenText)
  .map(brandify)
  .concat(boxShadow)
  .chain(outlineify);

// Notice that we have passed in any props yet
// so neither GenericButtonStyle nor MyButton
// are complete.

// Let's use it in context. I'm using Flow +
// react-primitives but neither are necessary
type P = {
  children: string,
  primary: bool,
  outline: bool,
  onPress: () => void,
}
const MyButton = (props: P) =>
  <Touchable onPress={props.onPress}>
    <View style={MyButtonStyle.resolve(props)}>
      { props.children }
    </View>
  </Touchable>

<MyButton primary={true} />
// => rendered View has style:
// {
//   fontSize: 20,
//   fontWeight: 'bold',
//   fontFamily: 'Circular Air Pro',
//   backgroundColor: 'darkGreen',
//   color: 'white',
//   boxShadow: '0 2px 3px rgba(0,0,0,.25)',
// }

<MyButton primary={false} outline={true} />
// => rendered View has style:
// {
//   fontSize: 20,
//   fontWeight: 'bold',
//   fontFamily: 'Circular Air Pro',
//   color: 'darkBlue',
//   backgroundColor: 'transparent',
//   border: '1px solid darkBlue',
//   boxShadow: '0 2px 3px rgba(0,0,0,.25)',
// }
```

## Interoperability
[<img src="https://raw.github.com/fantasyland/fantasy-land/master/logo.png" align="right" width="82" height="82" alt="Fantasy Land" />][FL]

**Further** implements [FantasyLand 1][FL1], [FantasyLand 2][FL2],
[FantasyLand 3][FL3] compatible `Semigroup`, `Monoid`, `Functor`, `Apply`, `Applicative`, `Chain`, `ChainRec` and `Monad`.


## Table of contents
* [Usage](#usage)
* [Interoperability](#interoperability)
* [Documentation](#documentation)
  1. [Type signatures](#type-signatures)
  1. [Creating Styles](#creating-styles)
    * [Style](#style)
    * [of](#of)
  1. [Transforming Styles](#transforming-styles)
    * [concat](#concat)
    * [empty](#empty)
    * [map](#map)
    * [chain](#chain)
    * [ap](#ap)
  1. [Consuming Styles](#consuming-styles)
    * [resolve](#resolve)

## Documentation

### Type signatures

Hindley-Milner type signatures are used to document functions. Signatures starting with a `.` refer to "static" functions, whereas signatures starting with a `#` refer to functions on the prototype.

A list of types used within the signatures:
* **Style** - Instances of Style provided by St
* **Props** - any JS prop object
* **CSS** - raw CSS style objects

### Creating Styles

#### Style
##### `Style :: => (Props -> CSS) -> Style CSS`
```js
Style(props => ({
  backgroundColor: props.color,
  fontSize: 16,
});
// Style({ backgroundColor: __color__, fontSize: 16 })
```

#### of
##### `.of :: a -> Style a`
[applicative](FL:applicative)
```js
Style.of({
  backgroundColor: 'red',
  fontSize: 16,
});
// Style({ backgroundColor: 'red', fontSize: 16, });
```

### Transforming Styles

#### concat
##### `#concat :: Style a ~> Style a ~> Style a`
[semigroup](FL:semigroup)
```js
Style.of({ fontWeight: 'bold', fontSize: 14 }).concat({ fontSize: 16, backgroundColor: 'red' })
// Style({ fontWeight: 'bold', fontSize: 16, backgroundColor: 'red' }))
```

#### empty
##### `.empty :: () -> Style _`
<!--#### `#empty :: Style a -> () -> Style _`-->
[monoid](FL:monoid)
```js
Style.empty()
// Style({})
```

#### map
##### `#map :: Style a ~> (a -> b) -> Style b`
[functor](FL:functor)

```js
Style.of({
  backgroundColor: 'red',
  fontSize: 14
}).map(style => ({
  ...style,
  fontSize: 16
});
// Style({ backgroundColor: 'red, fontSize: 16 }))

Style.of({
  backgroundColor: 'red',
  fontSize: 14
}).map(evolve({
  fontSize: x => x * 2
});
// { backgroundColor: 'red, fontSize: 24 })
```

#### chain
##### `#chain :: Style a ~> Style a -> Style a`
[chain](FL:chain)

wip

#### ap
##### `#ap :: Style (a -> b) ~> Style a -> Style b`
[apply](FL:apply)
```js
Style.of(style => ({
  ...style,
  fontSize: style.fontSize * 2,
}).ap({ color: 'red', fontSize: 14 })
//
```

### Consuming styles
#### resolve
##### `#resolve :: Style a ~> Props -> CSS`
```js
const st = Style(props => ({
  backgroundColor: props.primary ? 'green' : 'gray',
  fontSize: 16,
})).map(evolve({ fontSize: add(2) }))

st.resolve({ title: 'sign up', primary: true })
// { backgroundColor: 'red', fontSize: 18 }
```

e.g., in a render function
```js
const Button = props =>
  <button style={st.resolve(props)}>
    { props.children }
  </button>
// <button style="background-color: 'red', font-size: 18">sign up</button>
```

## Contributors

Made with love and monads by ([emoji key](https://github.com/kentcdodds/all-contributors#emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
| [<img src="https://avatars1.githubusercontent.com/u/591643?v=3" width="100px;"/><br /><sub>Jon Gold</sub>](http://jon.gold)<br />[📖](https://github.com/jongold/st/commits?author=jongold) 💡 👀 | [<img src="https://avatars1.githubusercontent.com/u/4967600?v=3" width="100px;"/><br /><sub>James Baxley</sub>](https://newspring.cc)<br />[💻](https://github.com/jongold/st/commits?author=jbaxleyiii) |
| :---: | :---: |
<!-- ALL-CONTRIBUTORS-LIST:END -->

<!-- References -->
[FL]:                   https://github.com/fantasyland/fantasy-land
[FL1]:                  https://github.com/fantasyland/fantasy-land/tree/v1.0.1
[FL2]:                  https://github.com/fantasyland/fantasy-land/tree/v2.2.0
[FL3]:                  https://github.com/fantasyland/fantasy-land
[SL]:                    https://github.com/rpominov/static-land

[FL:alternative]:       https://github.com/fantasyland/fantasy-land#alternative
[FL:functor]:           https://github.com/fantasyland/fantasy-land#functor
[FL:chain]:             https://github.com/fantasyland/fantasy-land#chain
[FL:apply]:             https://github.com/fantasyland/fantasy-land#apply
[FL:applicative]:       https://github.com/fantasyland/fantasy-land#applicative
[FL:bifunctor]:         https://github.com/fantasyland/fantasy-land#bifunctor
[FL:chainrec]:          https://github.com/fantasyland/fantasy-land#chainrec
[FL:semigroup]:          https://github.com/fantasyland/fantasy-land#semigroup
[FL:setoid]:          https://github.com/fantasyland/fantasy-land#setoid
[FL:moinoid]: https://github.com/fantasyland/fantasy-land#monoid
