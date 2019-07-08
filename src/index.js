const output = document.getElementById("output");
const result = document.getElementById("result");
const clear = document.getElementById("clear");
const arrValues = [];

// 버튼 입력 값을 읽고 배열에 저장합니다.
const readValue = event => {
  // console.log(event.target.innerHTML); v
  const value = event.target.innerHTML;
  if (value === "CE") {
    arrValues.pop();
    displayValue();
  } else if (value === "AC") {
    clearAll();
    clear.innerHTML = "CE";
  } else {
    arrValues.push(value);
    displayValue();
  }
  console.log(arrValues);
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

// 저장된 배열을 연산자를 기준으로 분리합니다.
const spliceValues = arr => {
  for (const i in arr) {
    if (
      arr[i] === "+" ||
      arr[i] === "-" ||
      arr[i] === "X" ||
      arr[i] === "/" ||
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
  if (arrValues.length !== 0) {
    while (arrValues.length !== 0) arrValues.pop();
  }
  output.innerHTML = 0;
};

const accumulateValues = value => {
  arrValues.pop();
  arrValues.push(value);
};

// 배열의 길이가 1인지 'true' or 'false'로 체크합니다.
const checkArrValues = () => arrValues.length === 1;

// 배열에 괄호가 있는지 확인합니다.
const checkBracket = () => {
  return arrValues.indexOf("(") !== -1 && arrValues.indexOf(")") !== -1;
};

// 괄호 부분을 따로 분리합니다.
const spliceBracket = arr => {
  const openBracket = arrValues.indexOf("(");
  const closeBracket = arrValues.indexOf(")");
  console.log(openBracket, closeBracket);
  return arr.slice(openBracket, closeBracket + 1);
};

// 괄호를 제거합니다.
const removeBracket = spliceBracketValues => {
  spliceBracketValues.shift();
  const closeBracket = spliceBracketValues.indexOf(")");
  spliceBracketValues.splice(closeBracket, 1);
  return spliceBracketValues;
};

// 배열을 연산자 기준으로 분리 후 다시 합쳐 데이터 형식을 숫자로 바꿉니다.
const numValueLoop = () => {
  const splice = spliceValues(arrValues);
  // console.log(splice); v
  const join = joinValues(splice);
  // console.log(join); v
  const currentNum = changeTypeToNumber(join);
  // console.log(currentNum); v
  return currentNum;
};

const priorityValueLoop = () => {
  const splice = spliceBracket(arrValues);
  // console.log(splice);
  const strNumber = removeBracket(splice);
  // console.log(strNumber);
  const join = joinValues(strNumber);
  // console.log(join);
  const currentNum = changeTypeToNumber(join);
  return currentNum;
};

const returnNum = () => {
  return checkBracket() ? priorityValueLoop() : numValueLoop();
};

const runCalculationLoop = num => {
  while (!checkArrValues()) {
    const op = arrValues.shift();
    const nextNum = numValueLoop();
    num = calculateValues(num, op, nextNum);
  }
  return num;
};

// 로직 실행
const action = () => {
  let currentNum = numValueLoop();
  currentNum = runCalculationLoop(currentNum);
  accumulateValues(currentNum);
  return currentNum;
};

// '=' 을 입력했을 때 메인 액션을 실행하고 화면에 출력합니다.
const execLogic = event => {
  const value = event.target.innerHTML;
  arrValues.push(value);
  output.innerHTML = action();
  result.innerHTML = `Ans = ${output.innerHTML}`;
  clear.innerHTML = "AC";
};
