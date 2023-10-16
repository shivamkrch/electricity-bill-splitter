function renderFlatReadingsForm(num) {
  const flatMeterReadings = document.querySelector("#flatReadingsForm");
  flatMeterReadings.innerHTML = "";
  for (let i = 1; i <= num; ++i) {
    flatMeterReadings.innerHTML += `
        <div class="row mt-4">
            <div class="col-3">
                <h6>Flat ${i}</h6>
            </div>
            <div class="col-3">
                <input type="number" step="0.01" class="form-control form-control-sm" id="currFlat${i}Units" required />
            </div>
            <div class="col-3">
                <input type="number" step="0.01" class="form-control form-control-sm" id="prevFlat${i}Units" required />
            </div>
            <div class="col-3 text-center shown-on-result">
                <h6 id="flat${i}Units"></h6>
            </div>
        </div>
    `;
  }
}

function renderFlatWiseResults(flatWiseSplit) {
  const flatWiseResults = document.querySelector("#flatWiseResults");
  flatWiseResults.innerHTML = "";
  for (let i = 0; i < flatWiseSplit.length; ++i) {
    flatWiseResults.innerHTML += `
      <div class="row mt-4">
          <div class="col-3">
              <h6>Flat ${i + 1}</h6>
          </div>
          <div class="col-3">
            <b>₹ ${flatWiseSplit[i].cost}</b>
          </div>
          <div class="col-3">
            ₹ ${flatWiseSplit[i].commonCost}
          </div>
          <div class="col-3">
              <h6>₹ ${flatWiseSplit[i].totalCost}</h6>
          </div>
      </div>
  `;
    document.getElementById(`flat${i + 1}Units`).innerText =
      flatWiseSplit[i].unitsConsumed;
  }
}

function onFormSubmit(e) {
  e.preventDefault();

  const mainMeterReading = {
    balance: {
      prev: prevBalance.valueAsNumber,
      curr: currBalance.valueAsNumber
    },
    unitsConsumed: {
      prev: prevUnits.valueAsNumber,
      curr: currUnits.valueAsNumber
    },
    // arrearBalance: {
    //   prev: prevArrearBalance.valueAsNumber,
    //   curr: currArrearBalance.valueAsNumber
    // },
    recharge: rechargeAmount.valueAsNumber
  };

  console.log(mainMeterReading);

  const flatWiseReading = [];
  for (let i = 1; i <= numFlats.valueAsNumber; ++i) {
    flatWiseReading.push({
      prev: document.getElementById(`prevFlat${i}Units`).valueAsNumber,
      curr: document.getElementById(`currFlat${i}Units`).valueAsNumber
    });
  }
  console.log(flatWiseReading);

  const splitResult = splitElectricityBill(mainMeterReading, flatWiseReading);
  console.log(splitResult);

  if (splitResult.error) {
    return alert(splitResult.error);
  }

  unitsConsumed.innerText = splitResult.totalUnitsConsumed;
  totalCost.innerText = splitResult.totalCost;
  totalCost2.innerText = splitResult.totalCost;
  costPerUnit.innerText = splitResult.costPerUnit;
  // arrearDeducted.innerText = splitResult.arrearDeducted;

  flatUnits.innerText = splitResult.unitsConsumedByFlats;
  totalFlatCost.innerText = splitResult.totalCostByFlats;

  commonUnits.innerText = splitResult.remainingUnits;
  totalCommonCost.innerText = splitResult.commonCost;
  totalCommonCost2.innerText = splitResult.commonCost;
  commonCostPerFlat.innerText = splitResult.commonCostPerFlat;

  renderFlatWiseResults(splitResult.flatWiseSplit);

  document.querySelectorAll(".shown-on-result").forEach((el) => {
    el.classList.remove("shown-on-result");
    el.classList.add("showing-on-result");
  });
}

function onFormReset() {
  document.querySelectorAll(".showing-on-result").forEach((el) => {
    el.classList.remove("showing-on-result");
    el.classList.add("shown-on-result");
  });
}

window.onload = function () {
  renderFlatReadingsForm(numFlats.value);

  numFlats.onchange = (e) => renderFlatReadingsForm(e.target.valueAsNumber);

  billSplitterForm.onsubmit = onFormSubmit;
  billSplitterForm.onreset = onFormReset;

  printBtn.onclick = () => {
    window.print();
  };
};
