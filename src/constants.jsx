export const cardRebateType = {
    "DBS ABC": { rebateType: "cashback" },
    "UOB DEF": { rebateType: "cashback" },
    "Citi DEF": { rebateType: "reward" },
    "AmericanExpress":{ rebateType: "mile" },
  };
  
  export const bankCardOptions = {
    DBS: ["DBS ABC"],
    UOB: ["UOB DEF"],
    Citi: ["Citi DEF"],
    AmericanExpress: ["American Express Singapore Airlines KrisFlyer Credit Card"],
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
    },
    "American Express Singapore Airlines KrisFlyer Credit Card": {
      travel: ["Singapore Airline/Scoot", "Grab Singapore", "Other"]},
  };