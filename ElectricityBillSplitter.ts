export interface IMeterReading {
  prev: number;
  curr: number;
}

export interface IMainMeterReading {
  balance: IMeterReading;
  unitsConsumed: IMeterReading;
  arrearBalance: IMeterReading;
  recharge: number;
}

export interface IFlatSplit {
  unitsConsumed: number;
  cost: number;
  commonCost: number;
  totalCost: number;
}

export class SplitResult {
  error?: string;
  totalUnitsConsumed: number;
  totalCost: number;
  costPerUnit: number;
  unitsConsumedByFlats: number;
  totalCostByFlats: number;
  remainingUnits: number;
  // arrearDeducted: number;
  commonCost: number;
  commonCostPerFlat: number;
  flatWiseSplit: IFlatSplit[];

  public constructor(err?: string) {
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
}

function formatDecimalValue(num: number) {
  return parseFloat(num.toFixed(2));
}

export function splitElectricityBill(
  mainMeterReading: IMainMeterReading,
  flatWiseReading: IMeterReading[]
): SplitResult {
  const splitResult = new SplitResult(undefined);

  if (
    mainMeterReading.unitsConsumed.curr < mainMeterReading.unitsConsumed.prev
  ) {
    return new SplitResult(
      `Invalid main meter reading: Previous reading (${mainMeterReading.unitsConsumed.prev}) is more than current reading (${mainMeterReading.unitsConsumed.curr}).`
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

  for (const flatReading of flatWiseReading) {
    const flatSplit: IFlatSplit = {
      unitsConsumed: 0,
      cost: 0,
      commonCost: 0,
      totalCost: 0
    };

    if (flatReading.curr < flatReading.prev) {
      return new SplitResult(
        `Invalid flat meter reading: Previous reading (${flatReading.prev}) is more than current reading (${flatReading.curr}).`
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

  for (const flatSplit of splitResult.flatWiseSplit) {
    flatSplit.commonCost = splitResult.commonCostPerFlat;
    flatSplit.totalCost = formatDecimalValue(
      flatSplit.cost + flatSplit.commonCost
    );
  }

  return splitResult;
}
