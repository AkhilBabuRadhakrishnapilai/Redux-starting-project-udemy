const initialStateAccounts = {
  balance: 0,
  loan: 0,
  loanPurpose: "",
  isLoading: false,
};

export default function accountReducer(state = initialStateAccounts, action) {
  switch (action.type) {
    case "accounts/deposit":
      return {
        ...state,
        balance: state.balance + action.payload,
        isLoading: false,
      };
    case "accounts/withdraw":
      return {
        ...state,
        balance: state.balance - action.payload,
      };
    case "accounts/requestLoan":
      if (state.loan > 0) return state;
      return {
        ...state,
        loan: action.payload.amount,
        loanPurpose: action.payload.purpose,
        balance: state.balance + action.payload.amount,
      };
    case "accounts/payLoan":
      return {
        ...state,
        loan: 0,
        loanPurpose: "",
        balance: state.balance - state.loan,
      };
    case "accounts/convertingCurrency":
      return {
        ...state,
        isLoading: true,
      };
    default:
      return state;
  }
}

//acction creators
export function deposit(amount, currency) {
  if (currency === "USD")
    return {
      type: "accounts/deposit",
      payload: amount,
    };
  return async function (dispatch, getState) {
    //this dispatch will return the loading state when converting the money
    dispatch({ type: "accounts/convertingCurrency" });

    const res = await fetch(
      `https://api.frankfurter.app/latest?amount=${amount}&from=${currency}&to=USD`
    );

    const data = await res.json();
    const converted = data.rates.USD;

    dispatch({ type: "accounts/deposit", payload: converted });
  };
}
export function withdraw(amount) {
  return {
    type: "accounts/withdraw",
    payload: amount,
  };
}
export function requestLoan(amount, purpose) {
  return {
    type: "accounts/requestLoan",
    payload: { amount, purpose },
  };
}
export function payLoan() {
  return {
    type: "accounts/payLoan",
  };
}

// store.dispatch(deposit(500));
// store.dispatch(withdraw(200));
// console.log(store.getState());

// store.dispatch(requestLoan(1000, "Buy a car"));
// console.log(store.getState());
// store.dispatch(payLoan());
// console.log(store.getState());
