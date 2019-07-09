const output = document.getElementById("output");
const result = document.getElementById("result");
const clear = document.getElementById("clear");
const OriginalArrValues = [];
const postfixValues = [];
const stackValues = [];

// 버튼 입력 값을 읽고 배열에 저장합니다.
const readValue = event => {
  // console.log(event.target.innerHTML); v
  const value = event.target.innerHTML;
  if (value === "CE") {
    OriginalArrValues.pop();
    displayValue();
  } else if (value === "AC") {
    clearAll();
    clear.innerHTML = "CE";
  } else {
    OriginalArrValues.push(value);
    displayValue();
  }
  if (OriginalArrValues.length !== 0) {
    clear.innerHTML = "CE";
  } else {
    clear.innerHTML = "AC";
  }
  console.log(OriginalArrValues);
};

// output의 innerHTML 값을 배열을 누산한 값으로 리턴합니다.
const displayValue = () => {
  if (OriginalArrValues.length === 0) {
    output.innerHTML = 0;
  } else {
    output.innerHTML = OriginalArrValues.reduce((prev, curr) => {
      return prev + curr;
    });
  }
};

// 저장된 배열을 연산자를 기준으로 분리합니다.
const spliceValues = arr => {
  for (const i in arr) {
    if (
      arr[i] === "+" ||
      arr[i] === "-" ||
      arr[i] === "X" ||
      arr[i] === "/" ||
      arr[i] === "(" ||
      arr[i] === ")" ||
      arr[i] === "="
    ) {
      const num = arr.splice(0, i);
      return num;
    }
  }
};

// 배열을 하나의 문자열로 합칩니다.
const joinValues = value => {
  return value.join("");
};

// 인자 값의 데이터 타입을 Number로 바꿉니다.
const changeTypeToNumber = value => {
  return Number(value);
};

// 연산자, 현재 값, 다음 값을 입력받아 해당 연산자에 맞게 계산합니다.
const calculateValues = (currentNum, op, nextNum) => {
  let ret = currentNum;
  switch (op) {
    case "+":
      ret += nextNum;
      break;
    case "-":
      ret -= nextNum;
      break;
    case "X":
      ret *= nextNum;
      break;
    case "/":
      ret /= nextNum;
      break;
  }
  return ret;
};

const clearAll = () => {
  if (OriginalArrValues.length !== 0) {
    while (OriginalArrValues.length !== 0) OriginalArrValues.pop();
  }
  output.innerHTML = 0;
};

// 배열의 길이가 1인지 'true' or 'false'로 체크합니다.
const checkOriginalArrValues = () => OriginalArrValues.length === 1;

// 배열을 연산자 기준으로 분리 후 다시 합쳐 데이터 형식을 숫자로 바꿉니다.
const numValueLoop = () => {
  const splice = spliceValues(OriginalArrValues);
  // console.log(splice);
  const join = joinValues(splice);
  // console.log(join);
  const currentNum = changeTypeToNumber(join);
  // console.log(currentNum);
  postfixValues.push(currentNum);
};

const getOperator = () => {
  const op = OriginalArrValues.shift();
  const lastValue = stackValues[stackValues.length - 1];
  if (stackValues.length === 0) {
    // console.log(op);
    stackValues.push(op);
  } else if (
    (op === "X" || op === "/") &&
    (lastValue === "+" || lastValue === "-")
  ) {
    // console.log(op);
    stackValues.push(op);
  } else {
    // console.log(op);
    const postfixOp = stackValues.pop();
    stackValues.push(op);
    postfixValues.push(postfixOp);
  }
};

const pushLeftOperator = () => {
  while (!(stackValues.length === 0)) {
    const postfixOp = stackValues.pop();
    postfixValues.push(postfixOp);
  }
};

// 로직 실행
const action = () => {
  while (!checkOriginalArrValues()) {
    numValueLoop();
    if (OriginalArrValues[0] !== "=") {
      getOperator();
    }
  }
  console.log(stackValues);
  pushLeftOperator();
  // console.log(postfixValues); 정상작동
  while (postfixValues.length !== 0) {
    if (typeof postfixValues[0] === "number") {
      let testA = postfixValues.shift();
      stackValues.push(testA); //잘됨
    }
    if (typeof postfixValues[0] !== "number") {
      let op = postfixValues.shift();
      let num1 = stackValues.pop();
      let num2 = stackValues.pop();
      let result = calculateValues(num1, op, num2);
      // console.log(num1, num2, result);
      stackValues.push(result);
    }
  }
  currentNum = test();
  // console.log(postfixValues);
  return currentNum;
};

const test = () => {
  const result = stackValues.shift();
  OriginalArrValues.pop();
  OriginalArrValues.push(result);
  return result;
};

// '=' 을 입력했을 때 메인 액션을 실행하고 화면에 출력합니다.
const execLogic = event => {
  const value = event.target.innerHTML;
  OriginalArrValues.push(value);
  output.innerHTML = action();
  result.innerHTML = `Ans = ${output.innerHTML}`;
  clear.innerHTML = "AC";
};

// 맨 앞에 -와 괄호만 삽입 가능
// 괄호 로직 처리
// 괄호 로직 처리를 위해서 -와 괄호 오는 경우에 대한 처리 로직 필요
