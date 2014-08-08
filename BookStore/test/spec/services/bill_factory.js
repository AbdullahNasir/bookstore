'use strict';

describe('Service: BillFactory', function () {

  // load the service's module
  beforeEach(module('bookStoreApp'));

  // instantiate service
  var BillFactory;
  beforeEach(inject(function (_BillFactory_) {
    BillFactory = _BillFactory_;
  }));

  it('should do something', function () {
    expect(!!BillFactory).toBe(true);
  });

});
