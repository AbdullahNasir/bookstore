'use strict';

describe('Service: PaymentService', function () {

  // load the service's module
  beforeEach(module('bookStoreApp'));

  // instantiate service
  var PaymentService;
  beforeEach(inject(function (_PaymentService_) {
    PaymentService = _PaymentService_;
  }));

  it('should do something', function () {
    expect(!!PaymentService).toBe(true);
  });

});
