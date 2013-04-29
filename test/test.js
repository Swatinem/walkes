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
			Type2: function () {
				walker.checkProps(this.child);
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
});
