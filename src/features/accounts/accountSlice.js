import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  balance: 0,
  loan: 0,
  loanPurpose: "",
  isLoading: false,
};

// export default function accountReducer(state = initialStateAccounts, action) {
//   switch (action.type) {
//     case "accounts/deposit":
//       return {
//         ...state,
//         balance: state.balance + action.payload,
//         isLoading: false,
//       };
//     case "accounts/withdraw":
//       return {
//         ...state,
//         balance: state.balance - action.payload,
//       };
//     case "accounts/requestLoan":
//       if (state.loan > 0) return state;
//       return {
//         ...state,
//         loan: action.payload.amount,
//         loanPurpose: action.payload.purpose,
//         balance: state.balance + action.payload.amount,
//       };
//     case "accounts/payLoan":
//       return {
//         ...state,
//         loan: 0,
//         loanPurpose: "",
//         balance: state.balance - state.loan,
//       };
//     case "accounts/convertingCurrency":
//       return {
//         ...state,
//         isLoading: true,
//       };
//     default:
//       return state;
//   }
// }

// //acction creators
// export function deposit(amount, currency) {
//   if (currency === "USD")
//     return {
//       type: "accounts/deposit",
//       payload: amount,
//     };
//   return async function (dispatch, getState) {
//     //this dispatch will return the loading state when converting the money
//     dispatch({ type: "accounts/convertingCurrency" });

//     const res = await fetch(
//       `https://api.frankfurter.app/latest?amount=${amount}&from=${currency}&to=USD`
//     );

//     const data = await res.json();
//     const converted = data.rates.USD;

//     dispatch({ type: "accounts/deposit", payload: converted });
//   };
// }
// export function withdraw(amount) {
//   return {
//     type: "accounts/withdraw",
//     payload: amount,
//   };
// }
// export function requestLoan(amount, purpose) {
//   return {
//     type: "accounts/requestLoan",
//     payload: { amount, purpose },
//   };
// }
// export function payLoan() {
//   return {
//     type: "accounts/payLoan",
//   };
// }

// from here we are using the createSlice for creating the slice

const accountSlice = createSlice({
  name: "account",
  initialState: initialState,
  reducers: {
    deposit(state, action) {
      state.balance = state.balance + action.payload;
      state.isLoading = false;
    },
    withdraw(state, action) {
      state.balance = state.balance - action.payload;
    },
    requestLoan: {
      prepare(amount, purpose) {
        return {
          payload: { amount, purpose },
        };
      },
      reducer(state, action) {
        if (state.loan > 0) return;
        state.loan = action.payload.amount;
        state.loanPurpose = action.payload.loanPurpose;
        state.balance += action.payload.amount;
      },
    },
    payLoan(state, action) {
      state.balance -= state.loan;
      state.loan = 0;
      state.loanPurpose = "";
    },
    convertingCurrency(state, action) {
      state.isLoading = true;
    },
  },
});

export const { withdraw, requestLoan, payLoan } = accountSlice.actions;

export function deposit(amount, currency) {
  if (currency === "USD")
    return {
      type: "account/deposit",
      payload: amount,
    };
  return async function (dispatch, getState) {
    //this dispatch will return the loading state when converting the money
    dispatch({ type: "account/convertingCurrency" });

    const res = await fetch(
      `https://api.frankfurter.app/latest?amount=${amount}&from=${currency}&to=USD`
    );

    const data = await res.json();
    const converted = data.rates.USD;

    dispatch({ type: "account/deposit", payload: converted });
  };
}

export default accountSlice.reducer;
