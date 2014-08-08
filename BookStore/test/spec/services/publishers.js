'use strict';

describe('Service: Publishers', function () {

  // load the service's module
  beforeEach(module('bookStoreApp'));

  // instantiate service
  var Publishers;
  beforeEach(inject(function (_Publishers_) {
    Publishers = _Publishers_;
  }));

  it('should do something', function () {
    expect(!!Publishers).toBe(true);
  });

});
