var walker = require('../');

describe('walker', function () {
	it('should call the function corresponding to the type', function () {
		var obj = {
			type: 'Type'
		};
		var called = false;
		walker(obj, {
			Type: function () {
				called = true;
				obj.should.equal(this);
			}
		});
		called.should.eql(true);
	});
	it('should call the `default` function on unknown types', function () {
		var obj = {
			type: 'Type'
		};
		var called = false;
		walker(obj, {
			default: function () {
				called = true;
				obj.should.equal(this);
			}
		});
		called.should.eql(true);
	});
	it('should handle arrays', function () {
		var obj = {
			type: 'Type',
			arr: [{
				type: 'Type2'
			}, {
				type: 'Type2'
			}, {
				type: 'Type2'
			}]
		};
		var called = 0;
		walker(obj, {
			Type2: function () {
				called++;
			}
		});
		called.should.eql(3);
	});
	it('should require objects to have `type`', function () {
		var fnTable = {
			Type: function (recurse) {
				recurse(this.child);
			},
			Type2: function (recurse) {
				walker.checkProps.call(this.child, recurse);
			},
			default: function () {
				should.fail('should not be reached');
			}
		}
		walker({no: 'Type'}, fnTable);
		walker({
			type: 'Type',
			child: {
				no: 'Type'
			}
		}, fnTable);
		walker({
			type: 'Type2',
			child: {
				no: 'Type'
			}
		}, fnTable);
	});
	it('should stop()', function () {
		walker({
			type: 'Type1',
			prop: {
				type: 'Type2'
			}
		}, {
			Type1: function (recurse, stop) {
				stop();
			},
			Type2: function () {
				should.fail('should not be reached');
			}
		});
	});
	it('should only recurse when the node is in range', function () {
		walker({
			type: 'Type1',
			prop: {
				type: 'Type2',
				range: [0,5]
			}
		}, {
			Type2: function () {
				should.fail('should not be reached');
			}
		}, 10);
	});
	it('should rethrow exceptions', function () {
		(function () {
		walker({
			type: 'Type1'
		}, {
			Type1: function () {
				throw 1;
			}
		});
		}).should.throw();
	});
	it('should return the original ast', function () {
		var ast = {
			type: 'Type1',
			prop: {type: 'Type2'},
			arr: [{type: 'Type3'}]
		};
		walker(ast, {}).should.eql(ast);
	});
	it('should return the original even if it is skipped via range', function () {
		var ast = {
			type: 'Type1',
			prop: {
				type: 'Type2',
				range: [0,5],
				sub: {type: 'Type4'}
			},
			arr: [{type: 'Type3'}]
		};
		walker(ast, {Type4: function () {
			should.fail('should not be reached');
		}}, 10).should.eql(ast);
	});
	it('should be able to transform objects', function () {
		var transformed = {
			type: 'Type2',
			prop2: 'prop2'
		};
		walker({
			type: 'Type',
			prop1: 'prop1'
		}, {default: function () {
			return transformed;
		}}).should.eql(transformed);
	});
	it('should transform properties', function () {
		var transformed = {
			type: 'Type2',
			prop2: 'prop2'
		};
		walker({
			type: 'SomeType',
			prop1: {
				type: 'Type'
			}
		}, {Type: function () {
			return transformed;
		}}).prop1.should.eql(transformed);
	});
	it('should transform array elements', function () {
		var transformed = {
			type: 'Type2',
			prop2: 'prop2'
		};
		var mapped = walker({
			type: 'SomeType',
			arr: [
				{type: 'Type'},
				{type: 'Type'},
				{type: 'Type'}
			]
		}, {Type: function () {
			return transformed;
		}});
		mapped.arr[0].should.eql(transformed);
		mapped.arr[2].should.eql(transformed);
	});
});
