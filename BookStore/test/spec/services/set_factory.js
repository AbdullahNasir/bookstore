'use strict';

describe('Service: SetFactory', function () {

  // load the service's module
  beforeEach(module('bookStoreApp'));

  // instantiate service
  var SetFactory;
  beforeEach(inject(function (_SetFactory_) {
    SetFactory = _SetFactory_;
  }));

  it('should do something', function () {
    expect(!!SetFactory).toBe(true);
  });

});
