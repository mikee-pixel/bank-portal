'use strict';

// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2023-06-11T10:17:24.185Z',
    '2023-06-13T14:11:59.604Z',
    '2023-06-14T17:01:17.194Z',
    '2023-06-15T09:36:17.929Z',
    '2023-06-16T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];
console.log(accounts);

// Elements
const signInErrorMessage = document.querySelector('.signin-error-message');
const labelWelcome = document.querySelector('.welcome');
const userNamex = document.querySelector('.user-name');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const navigation = document.querySelector('nav');
const formMotherContainer = document.querySelector('.form-mother-container');
const formMainContainer = document.querySelector('.form-main-container');
const signInContainer = document.querySelector('.sign-in-container');
const signUpContainer = document.querySelector('.sign-up-container');
const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');
const overlayBtnSignIn = document.querySelector('.overlay-btn-signin');
const overlayBtnSignUp = document.querySelector('.overlay-btn-signup');

const btnSignIn = document.querySelector('.btn-sign-in');
const btnLogOut = document.querySelector('#logout-btn');
// const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const signInEmailInput = document.querySelector('.sign-in-container .email-input-field');
const signInPassInput = document.querySelector('.sign-in-container .password-input-field');
// const inputLoginUsername = document.querySelector('.login__input--user');
// const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');



//TRANSACTION DAY CALCULATION
const calcDateTrans = (date) => {
  const calcDayPassed = (date1, date2) => {
    return Math.round((date2 - date1) / (1000 * 60 * 60 * 24));
  }

  const dayPassed = calcDayPassed(date, new Date() );
  const dateTimeOption = {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  }

  if(dayPassed === 0) return `Today`;
  if(dayPassed === 1) return `Yesterday`;
  if(dayPassed < 7) return `${dayPassed} days ago`;
  else{
    return new Intl.DateTimeFormat(currentUser.locale, dateTimeOption).format(date);
  }
}

//FUNCTION FOR CURRENCY FORMATTER USING INTL.
const currencyFormatter = (currency) => {
  const option = {
    style: 'currency',
    currency: `${currentUser.currency}`
  }

  return new Intl.NumberFormat(currentUser.currency, option).format(currency);
}

/*DISPLAY ACCOUNT MOVEMENTS*/
const displayAccountMov = (acc, isSort = false) => {
  containerMovements.innerHTML = '';
  
  const movs = isSort ? acc.movements.slice().sort((a, b) => a - b) : acc.movements;
  
  movs.forEach( (mov, i) => {
    //Date Formatting using Intl.
    const date = new Date(acc.movementsDates[i]);
    const transDate = calcDateTrans(date);

    const typeDeposit = mov > 0 ? `deposit` : `withdrawal`;
    const htmlContent = `
      <div class="movements__row">
        <div class="movements__type movements__type--${typeDeposit}">${i + 1} ${typeDeposit}</div>
        <div class="movements__date">${transDate}</div>
        <div class="movements__value">${currencyFormatter(mov)}</div>
      </div>
    `;
    containerMovements.insertAdjacentHTML('afterbegin', htmlContent);
  });
}


/*CALCULATE THE ACCOUNT BALANCE*/
const displayAccountBalance = (movements) => {
  const reducerValue = movements.reduce((acc, curr) => acc + curr, 0);
  labelBalance.textContent = currencyFormatter(reducerValue);
}

/*CALCULATE TRANSACTION SUMMARY*/
const displayAccountSummary = (movements) => {

  const transcDesposit = movements.filter(mov => mov > 0).reduce((acc, curr) => acc + curr, 0);
  labelSumIn.textContent = currencyFormatter(transcDesposit);

  const transWithdraw = movements.filter(mov => mov < 0).reduce((acc, curr) => acc + curr, 0);
  labelSumOut.textContent = currencyFormatter(transWithdraw);

  const calcInterestRate = movements.filter(mov => mov > 0).map(deposit => (deposit * currentUser.interestRate) / 100).filter(interest => interest > 1).reduce((acc, curr) => acc + curr, 0);
  labelSumInterest.textContent = currencyFormatter(calcInterestRate);

}


/*SORTING DISPLAY TRANSACTION*/
let isSort = false;
btnSort.addEventListener('click', (e) => {
  e.preventDefault();
  console.log('Sort button is clicked!');
  displayAccountMov(currentUser, !isSort);
  isSort = !isSort;
  console.log(isSort);
});


//UPDATE UI
const updateIU = () => {
  displayAccountMov(currentUser)
  displayAccountBalance(currentUser.movements)
  displayAccountSummary(currentUser.movements);
}

//TRANSFER MONEY
btnTransfer.addEventListener('click', (e) => {
  e.preventDefault();
  const accountReceiver = accounts.find(receiverUser => receiverUser.username === inputTransferTo.value);
  if(accountReceiver && Number(inputTransferAmount.value) > 0 /*&& Number(inputTransferAmount.value) < parseInt(labelBalance.textContent)*/){
    console.log('Transaction sucessful!');
    currentUser.movements.push(Number(-inputTransferAmount.value));
    currentUser.movementsDates.push(new Date().toISOString());

    accountReceiver.movements.push(Number(inputTransferAmount.value));
    accountReceiver.movementsDates.push(new Date().toISOString());
    updateIU();
    inputTransferAmount.value = inputTransferTo.value = "";
    inputTransferAmount.blur();

    // Reset timer
    clearInterval(timer);
    timer = startLoOutTimer();
  } else {
    //Show error message here
    console.log('transaction failed');
  }
})

//REQUEST LOAN
btnLoan.addEventListener('click', (e) => {
  e.preventDefault();
  const requestLoan = currentUser.movements.some(deposit => deposit > inputLoanAmount.value * 0.1);
  if(requestLoan === true){
    setTimeout(() => {
      currentUser.movements.push(Number(inputLoanAmount.value));
      currentUser.movementsDates.push(new Date().toISOString());
      updateIU();
      inputLoanAmount.value = '';
      inputLoanAmount.blur();

      // Reset timer
      clearInterval(timer);
      timer = startLoOutTimer();
    }, 2000);
    
    
  } else {
    //Show error message here
  }
})

//CLOSE/DELETE ACCOUNT
btnClose.addEventListener('click', (e) => {
  e.preventDefault();
  if(inputCloseUsername.value === currentUser.username && Number(inputClosePin.value) === currentUser.pin){
    const accDeleted = accounts.findIndex(acc => acc.username === inputCloseUsername.value);
    accounts.splice(accDeleted, 1);
    containerApp.classList.remove('active');
    navigation.classList.remove('active');
    formMotherContainer.classList.remove('hidden');
  }


})


//CREATE ACCOUNT USER NAME
const accountUserName = accounts.map(acc => acc.username = acc.owner.toLowerCase().split(' ').map(initials => initials[0]).join(''));



//USER LOGIN
let currentUser, timer;
// currentUser = account1;
// updateIU();


//Timer before the user will be logout
const startLoOutTimer = () => {
  let time = 30;
  const tick = () => {
    let minute = String(Math.trunc(time / 60)).padStart(2, 0);
    let second = String(time % 60).padStart(2, 0);

    labelTimer.textContent = `${minute}:${String(second).padStart(2, 0)}`;
    console.log(`${minute}:${String(second).padStart(2, 0)}`);

    //current user will be logout
    if(time === 0){
      clearInterval(timer);
      navigation.classList.remove('active');
      containerApp.classList.remove('active');
      formMotherContainer.classList.remove('hidden');
      console.log('User will be now logout');
    }

    time--;
  }

  tick();
  const timer = setInterval(tick, 1000)
  return timer;
}



overlayBtnSignUp.addEventListener('click', () => {
  formMainContainer.classList.add('switching-active');
  console.log('SignUp button is clicked!');
})

overlayBtnSignIn.addEventListener('click', () => {
  formMainContainer.classList.remove('switching-active');
  console.log('SignIn button is clicked!');
})

btnSignIn.addEventListener('click', (e) => {
  e.preventDefault();
  currentUser = accounts.find(acc => acc.username === signInEmailInput.value);
  console.log(currentUser);
  if(currentUser && currentUser.pin === Number(signInPassInput.value)){
    formMotherContainer.classList.add('hidden');
    containerApp.classList.add('active');
    navigation.classList.add('active');

    //To update the time clock in real time
    setInterval(() => {
      const dateNow = new Date();
      const timeDateOption = {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric'
      }
      const userLocale = currentUser.locale;
      labelDate.textContent = new Intl.DateTimeFormat(userLocale, timeDateOption).format(dateNow);

    }, 1000)

    if(timer) clearInterval(timer);
    timer = startLoOutTimer();

    updateIU();

    labelWelcome.textContent = `Welcome back! ${currentUser.owner.split(" ")[0]},`;
    userNamex.textContent = `${currentUser.owner.split(" ")[0]} ${currentUser.owner.split(" ").slice(-1).map(word => word[0])}.`;
    signInEmailInput.value = signInPassInput.value = "";

  } else if (signInEmailInput.value === '' || signInPassInput === ''){
    signInErrorMessage.classList.add('active');
    signInErrorMessage.textContent = '*Input field(s) cannot be empty';
  } 
  else {
    signInErrorMessage.classList.add('active');
    signInErrorMessage.textContent = '*This user does not exists';
  }
})



//USER LOGOUT
btnLogOut.addEventListener('click', () => {
  console.log('Logout button is clicked!');
  navigation.classList.remove('active');
  containerApp.classList.remove('active');
  formMotherContainer.classList.remove('hidden');
})