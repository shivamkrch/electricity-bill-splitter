import {
  IFlatSplit,
  IMainMeterReading,
  IMeterReading,
  splitElectricityBill
} from "./ElectricityBillSplitter";

const mainMeterReading: IMainMeterReading = {
  balance: {
    prev: 0,
    curr: 131.97
  },
  unitsConsumed: {
    prev: 0,
    curr: 90.4
  },
  recharge: 600
};

const flatWiseReading: IMeterReading[] = [
  {
    prev: 301.0,
    curr: 310.0
  },
  {
    prev: 552.5,
    curr: 573.3
  },
  {
    prev: 1315.8,
    curr: 1348.4
  }
];

const splitResult = splitElectricityBill(mainMeterReading, flatWiseReading);
console.log(splitResult);
