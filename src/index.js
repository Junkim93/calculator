const output = document.getElementById("output");
const result = document.getElementById("result");
const clear = document.getElementById("clear");
const arrValues = [];
const postfixValues = [];
const stackValues = [];

const CONDITION_OPERATOR = value => {
  return value === "+" || value === "-" || value === "X" || value === "/";
};

// 버튼 입력 값을 읽고 배열에 저장합니다.
const readValue = event => {
  // console.log(event.target.innerHTML); v
  const value = event.target.innerHTML;
  clearValue(value);
  pushValue(value);
  clearValueView();
  console.log(arrValues);
};

const clearValue = value => {
  if (value === "CE") {
    arrValues.pop();
    displayValue();
  } else if (value === "AC") {
    clearAll();
    clear.innerHTML = "CE";
  }
};

const clearValueView = () => {
  if (arrValues.length !== 0) {
    clear.innerHTML = "CE";
  } else {
    clear.innerHTML = "AC";
  }
};

const pushValue = value => {
  if (
    value !== "AC" &&
    value !== "CE" &&
    !(CONDITION_OPERATOR(value) && arrValues[arrValues.length - 1] === value)
  ) {
    arrValues.push(value);
    displayValue();
  }
};

// output의 innerHTML 값을 배열을 누산한 값으로 리턴합니다.
const displayValue = () => {
  if (arrValues.length === 0) {
    output.innerHTML = 0;
  } else {
    output.innerHTML = arrValues.reduce((prev, curr) => {
      return prev + curr;
    });
  }
};

// 연산자, 현재 값, 다음 값을 입력받아 해당 연산자에 맞게 계산합니다.
const calculateValues = (currentNum, op, nextNum) => {
  let ret;
  switch (op) {
    case "+":
      ret = currentNum + nextNum;
      break;
    case "-":
      ret = currentNum - nextNum;
      break;
    case "X":
      ret = currentNum * nextNum;
      break;
    case "/":
      ret = currentNum / nextNum;
      break;
  }
  return ret;
};

const clearAll = () => {
  if (arrValues.length !== 0) {
    while (arrValues.length !== 0) arrValues.pop();
  }
  output.innerHTML = 0;
};

// 배열의 길이가 1인지 'true' or 'false'로 체크합니다.
const checkArrValues = () => arrValues.length === 1;

const pushLeftOperator = () => {
  while (!(stackValues.length === 0)) {
    const postfixOp = stackValues.pop();
    postfixValues.push(postfixOp);
  }
};

// ["5", "+", "(", "2", "+", "5", ")", "+", "3", "="]
// 로직 실행
const action = () => {
  while (!checkArrValues()) {
    checkFirstValue();
    const num = returnNum();
    if (num !== 0) postfixValues.push(num);
    if (arrValues[0] !== "=") changePostfix();
  }
  pushLeftOperator();
  calculatePostfix();
  currentNum = pushResult();
  return currentNum;
};

// '=' 을 입력했을 때 메인 액션을 실행하고 화면에 출력합니다.
const execLogic = event => {
  const value = event.target.innerHTML;
  arrValues.push(value);
  console.log(arrValues);
  output.innerHTML = action();
  result.innerHTML = `Ans = ${output.innerHTML}`;
  clear.innerHTML = "AC";
};

const pushResult = () => {
  const result = stackValues.shift();
  arrValues.pop();
  arrValues.push(result);
  return result;
};

const calculatePostfix = () => {
  while (postfixValues.length !== 0) {
    if (typeof postfixValues[0] === "number") {
      const num = postfixValues.shift();
      stackValues.push(num);
    } else {
      const op = postfixValues.shift();
      const num1 = stackValues.pop();
      const num2 = stackValues.pop();
      const result = calculateValues(num1, op, num2);
      stackValues.push(result);
    }
  }
};

const checkFirstValue = () => {
  if (arrValues[0] === "(") {
    const bracket = arrValues.shift();
    return stackValues.push(bracket);
  }
};

const returnNum = () => {
  for (const v of arrValues) {
    if (isNaN(Number(v)) === true) {
      const strNum = arrValues.splice(0, arrValues.indexOf(v));
      return Number(strNum.join(""));
    }
  }
};

const checkSub = (value, num) => {
  if (value === "-") {
    return Number(value + num);
  }
};

const changePostfix = () => {
  const op = arrValues.shift();
  const lastValue = stackValues[stackValues.length - 1];
  if (op === ")") {
    while (lastValue !== "(") {
      const lastOp = stackValues.pop();
      stackValues.pop();
      return postfixValues.push(lastOp);
    }
  }
  if (stackValues.length === 0 || op === "(") {
    return stackValues.push(op);
  }
  if (lastValue === "(") return stackValues.push(op);
  if (
    (op === "X" || op === "/") &&
    (lastValue === "+" || lastValue === "-" || lastValue === "(")
  ) {
    return stackValues.push(op);
  } else {
    const lastOp = stackValues.pop();
    stackValues.push(op);
    return postfixValues.push(lastOp);
  }
};
