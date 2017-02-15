# st (wip)
wip wip wip wip wip

### Creating Styles

#### Style
##### `Style :: (a -> ()) -> Style a`
```js
Style(props => ({
  backgroundColor: props.color,
  fontSize: 16,
});
```

#### of
##### `.of :: a -> Style a`
```js
Style.of({
  backgroundColor: 'red',
  fontSize: 16,
});
```

## Algebras

### Setoid
#### `equals :: Style a ~> Style a -> Boolean`
```js
Style.of({ color: 'red' }).equals(Style.of({ color: 'red' }))
// true

Style.of({ color: 'red' }).equals(Style.of({ color: 'blue' }))
// false
```

### Semigroup
#### `concat :: Style a ~> a ~> Style a`
```js
Style.of({ fontWeight: 'bold', fontSize: 14 }).concat({ fontSize: 16, backgroundColor: 'red' })
// { fontWeight: 'bold', fontSize: 16, backgroundColor: 'red' })
```

### Monoid
#### `.empty :: () -> Style _`
<!--#### `#empty :: Style a -> () -> Style _`-->
```js
Style.empty()
// {}
```

### Functor
#### `.map :: Style a ~> (a -> b) -> Style b`
```js
Style.of({
  backgroundColor: 'red',
  fontSize: 14
}).map(style => ({
  ...style,
  fontSize: 16
});
// { backgroundColor: 'red, fontSize: 16 })

Style.of({
  backgroundColor: 'red',
  fontSize: 14
}).map(evolve({
  fontSize: x => x * 2
});
// { backgroundColor: 'red, fontSize: 24 })
```

### Chain
#### .chain


### wip
```js
Style.of(style => ({
  ...style,
  fontSize: style.fontSize * 2,
}).ap({ color: 'red', fontSize: 14 })
// 

// i don't think this is right
Style.of((style, props) => ({
  fontSize: 16,
  color: props.primary ? 'red' : 'blue',
})
.ap(Style.of({ fontSize: 14))
.ap({
  username: 'Jill',
  primary: true,
})
```

