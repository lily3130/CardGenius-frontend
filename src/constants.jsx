export const cardRebateType = {
    "DBS ABC": { rebateType: "cashback" },
    "UOB DEF": { rebateType: "cashback" },
    "Citi DEF": { rebateType: "reward" },
  };
  
  export const bankCardOptions = {
    DBS: ["DBS ABC"],
    UOB: ["UOB DEF"],
    Citi: ["Citi DEF"],
  };
  
  export const cardTransactionMap = {
    "DBS ABC": {
      bill: ["Singapore Power"],
      dining: ["Starbucks"]
    },
    "UOB DEF": {
      travel: ["Agoda"],
      bill: ["Singapore Power"]
    },
    "Citi DEF": {
      grocery: ["NTUC"]
    }
  };