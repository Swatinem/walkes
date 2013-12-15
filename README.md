# walker, texas ranger

very simple walker for esprima AST

[![Build Status](https://travis-ci.org/Swatinem/walkes.png?branch=master)](https://travis-ci.org/Swatinem/walkes)
[![Coverage Status](https://coveralls.io/repos/Swatinem/walkes/badge.png?branch=master)](https://coveralls.io/r/Swatinem/walkes)
[![Dependency Status](https://gemnasium.com/Swatinem/walkes.png)](https://gemnasium.com/Swatinem/walkes)

## Installation

    $ npm install walkes

## Compatibility warning

`walkes ~ 0.1.0` used to pass in the node as `this`. This changed with version
`~ 0.2.0` which passes it as the first parameter. Please keep that in mind, and
sorry for the inconvenience.

## Usage

```js
walker(esprima.parse("…"), {
	MemberExpression: function (node, recurse, stop) {
		// you are responsible to call `recurse()` on all the children yourself
		recurse(node.object);
		recurse(node.property);
		// or use `walker.checkProps` to walk all child properties (also takes care of arrays)
		walker.checkProps(node, recurse);
	},
	default: function (recurse, stop) {
		// call or throw `stop` to completely stop walking.
		stop();
		throw stop;
	}
}, offset);
// when offset is set, will only recurse to nodes that lie within the offset
// esprima option {range: true} needs to be set for this to work
```

## License

  LGPLv3

