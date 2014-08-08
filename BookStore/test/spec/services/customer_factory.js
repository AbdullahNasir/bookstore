'use strict';

describe('Service: CustomerFactory', function () {

  // load the service's module
  beforeEach(module('bookStoreApp'));

  // instantiate service
  var CustomerFactory;
  beforeEach(inject(function (_CustomerFactory_) {
    CustomerFactory = _CustomerFactory_;
  }));

  it('should do something', function () {
    expect(!!CustomerFactory).toBe(true);
  });

});
