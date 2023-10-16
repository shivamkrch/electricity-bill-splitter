"use strict";
var SplitResult = /** @class */ (function () {
  function SplitResult(err) {
    this.error = err;
    this.totalUnitsConsumed = 0;
    this.totalCost = 0;
    this.costPerUnit = 0;
    this.unitsConsumedByFlats = 0;
    this.totalCostByFlats = 0;
    this.remainingUnits = 0;
    this.commonCostPerFlat = 0;
    // this.arrearDeducted = 0;
    this.commonCost = 0;
    this.flatWiseSplit = [];
  }
  return SplitResult;
})();
function formatDecimalValue(num) {
  return parseFloat(num.toFixed(2));
}
function splitElectricityBill(mainMeterReading, flatWiseReading) {
  var splitResult = new SplitResult(undefined);
  if (
    mainMeterReading.unitsConsumed.curr < mainMeterReading.unitsConsumed.prev
  ) {
    return new SplitResult(
      "Invalid main meter reading: Previous reading ("
        .concat(
          mainMeterReading.unitsConsumed.prev,
          ") is more than current reading ("
        )
        .concat(mainMeterReading.unitsConsumed.curr, ").")
    );
  }
  splitResult.totalUnitsConsumed = formatDecimalValue(
    mainMeterReading.unitsConsumed.curr - mainMeterReading.unitsConsumed.prev
  );
  // splitResult.arrearDeducted = formatDecimalValue(
  //   mainMeterReading.arrearBalance.prev - mainMeterReading.arrearBalance.curr
  // );
  splitResult.totalCost = formatDecimalValue(
    mainMeterReading.balance.prev +
      mainMeterReading.recharge -
      mainMeterReading.balance.curr
  );
  splitResult.costPerUnit = formatDecimalValue(
    splitResult.totalCost / splitResult.totalUnitsConsumed
  );
  for (
    var _i = 0, flatWiseReading_1 = flatWiseReading;
    _i < flatWiseReading_1.length;
    _i++
  ) {
    var flatReading = flatWiseReading_1[_i];
    var flatSplit = {
      unitsConsumed: 0,
      cost: 0,
      commonCost: 0,
      totalCost: 0
    };
    if (flatReading.curr < flatReading.prev) {
      return new SplitResult(
        "Invalid flat meter reading: Previous reading ("
          .concat(flatReading.prev, ") is more than current reading (")
          .concat(flatReading.curr, ").")
      );
    }
    flatSplit.unitsConsumed = formatDecimalValue(
      flatReading.curr - flatReading.prev
    );
    flatSplit.cost = formatDecimalValue(
      flatSplit.unitsConsumed * splitResult.costPerUnit
    );
    flatSplit.totalCost = formatDecimalValue(
      flatSplit.cost + flatSplit.commonCost
    );
    splitResult.flatWiseSplit.push(flatSplit);
    splitResult.unitsConsumedByFlats += flatSplit.unitsConsumed;
    splitResult.totalCostByFlats += flatSplit.cost;
  }
  splitResult.totalCostByFlats = formatDecimalValue(
    splitResult.totalCostByFlats
  );
  splitResult.remainingUnits = formatDecimalValue(
    splitResult.totalUnitsConsumed - splitResult.unitsConsumedByFlats
  );
  splitResult.commonCost = formatDecimalValue(
    splitResult.remainingUnits * splitResult.costPerUnit
  );
  splitResult.commonCostPerFlat = formatDecimalValue(
    splitResult.commonCost / flatWiseReading.length
  );
  for (var _a = 0, _b = splitResult.flatWiseSplit; _a < _b.length; _a++) {
    var flatSplit = _b[_a];
    flatSplit.commonCost = splitResult.commonCostPerFlat;
    flatSplit.totalCost = formatDecimalValue(
      flatSplit.cost + flatSplit.commonCost
    );
  }
  return splitResult;
}
