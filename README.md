# walker, texas ranger

very simple walker for esprima AST

[![Build Status](https://travis-ci.org/Swatinem/walkes.png?branch=master)](https://travis-ci.org/Swatinem/walkes)
[![Coverage Status](https://coveralls.io/repos/Swatinem/walkes/badge.png?branch=master)](https://coveralls.io/r/Swatinem/walkes)
[![Dependency Status](https://gemnasium.com/Swatinem/walkes.png)](https://gemnasium.com/Swatinem/walkes)

## Installation

    $ npm install walkes

## Usage

```js
walker(esprima.parse("…"), {
	MemberExpression: function (recurse, stop) {
		// the node can be used as `this`
		this.object;
		// you are responsible to call `recurse()` on all the children yourself
		recurse(this.object);
		recurse(this.property);
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

