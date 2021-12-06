'use strict';

var base = module.superModule;

module.exports = function (
  productSearch,
  refinementDefinition,
  refinementValue
) {
  //Invoke SizeRefinementValueWrapper on the base
  base.call(this, productSearch, refinementDefinition, refinementValue);
  //extend values on the returning object to get a hitCount
  this.hitCount = refinementValue.hitCount;
};
