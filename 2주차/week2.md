# 2주차 복습 The Basic

### 먼저 알아야할 문법들
1. toLowerCase() : 소문자로 변환
2. const : 상수화를 시킬때 사용, 반드시 초기값을 설정, 중간에 값을 변경할 수 없다 
3. function : 함수 선언

## 1. 오류 검출

```tsx
const message = "Hello World";
message.toLowerCase();
message();
```

1. 상수인 message 안에 Hello World 문자열을 넣는다 
2. message.toLowerCase(); 는 message를 소문자로 변환해달라는 문법이다 
3. message 함수를 호출하는 명령어다

**에러** : This expression is not callable.
  Type 'String' has no call signatures.

**이유** : string 타입의 message는 함수가 아니기 때문에 호출할 수 없다 

**해결** : message() 함수 호출을 없애거나 주석 처리한다 

```tsx
const message = "Hello World";
message.toLowerCase();
// message();
```

---
```tsx
function fn(x) {
  return x.flip();
}
```
1. 함수 fn에 인자를 x로 받는다
2. 인자 x에 있는 flip()을 실행한다

**에러** : x에 flip이 없으므로 오류

**결과** :  자바 스크립트는 진정으로 동적 타이핑을 제공한다 <br>어떤 일이 발생하는지 확인하기 위해 코드를 실행한다<br>
-> 대안은 타입 스크립트의 정적 형식 시스템을 사용하여 실행되기 전에 예상되는 코드에 대한 예측을 수행하는 것이다

---

## 2. 정적 유형 검사

타입 스크립트는 정적 유형 검사를 통해 코드가 실행되기 전에 버그를 찾는데 도움이 된다

```tsx
const message = "hello!";
 
message();
```
**에러** : This expression is not callable.
  Type 'String' has no call signatures.

-> TypeScript로 마지막 샘플을 실행하면 코드를 처음 실행하기 전에 오류 메시지가 표시됨

## 3. 예외가 아닌 오류

- 1 정의되지 않은 것

```javascript
const user = {
  name: "Daniel",
  age: 26,
};
user.location; // returns undefined
```

자바 스크립트는 정의되지 않은 것에 대한 값을 반환한다  
-> 타입 스크립트는 정의되지 않은 것에 대한 오류를 생성한다 : <br>Property 'location' does not exist on type '{ name: string; age: number; }'.

- 2 오타
```tsx
const announcement = "Hello World!";
 
// How quickly can you spot the typos?
announcement.toLocaleLowercase();
announcement.toLocalLowerCase();
 
// We probably meant to write this...
announcement.toLocaleLowerCase();
```
- 3 호출되지 않은 함수
```tsx
function flipCoin() {
  // Meant to be Math.random()
  return Math.random < 0.5;
}
```

**에러** : Operator '<' cannot be applied to types '() => number' and 'number'.

**원인** : Math.random에 () 괄호가 빠졌다

**해결**
```tsx
 function flipCoin() {
  // 본래 의도는 Math.random()
  return Math.random() < 0.5;
}

console.log(flipCoin())
```
- 4 기본적인 논리 오류
```tsx
const value = Math.random() < 0.5 ? "a" : "b";
if (value !== "a") { 

} else if (value === "b") {

}
```
**에러** : This condition will always return 'false' since the types '"a"' and '"b"' have no overlap.

**원인** : else if 문에서는 조건은 맞지만 if문에서도 조건을 만적하기 때문에 false가 나와 실행이 안됨

**해결** : if 문만 쓰던가 if (value !== "a") 부분을 === 으로 바꾼다

---

## 4 프로그래밍 도구로서의 타입

TypeScript는 우리가 코드 상에서 실수를 저질렀을 때 버그를 잡아줌
여기서 더 나아가 타입 스크립트는 
코드를 입력할 때 오류 메시지를 제공하거나 **코드 완성 기능**을 제공할 수 있다 

---

## 5 tsc, TypeScript 컴파일러

npm install -g typescript

위 코드를 실행하면 TypeScript 컴파일러 tsc가 전역 설치된다

1. hello.ts 을 만든다

```tsx
console.log("Hello world!");
```
2. 터미널에 tsc hello.ts를 입력한다

3. 현재 디렉토리에 hello.js 파일이 생성되게 된다 

-> hello.js 는 hello.ts 파일을 JavaScript 파일로 컴파일 또는 _변형_한 결과물이다

### 오류 발생 시키기
```tsx
function greet(person, date) {
  console.log(`Hello ${person}, today is ${date}!`);
}
 
greet("Brendan");
```
위에 같이 tsc hello.ts를 입력하면  
->1 function greet(person, date) {
                             ~~~~
    An argument for 'date' was not provided.


Found 1 error in hello.ts:5
라는 오류가 생긴다 

-> 여기서 타입 스크립트의 강점이 나타난다<br> 오직 표준적인 JavaScript만을 작성했을 뿐인데, 여전히 타입 검사를 통하여 코드 상의 문제를 발견해낼 수 있었다

좀 더 엄격하게 동작하길 원한다면  
tsc --noEmitOnError hello.ts
를 터미널에 입력해라 hello.js가 생성되지 않거나 수정되지 않는다

---

## 6 명시적 타입

```tsx
function greet(person, date) {
  console.log(`Hello ${person}, today is ${date}!`);
}
 
greet("Brendan");
```
위 코드에서는 person, data에 타입 표기를 안한 상태이다 

```tsx
function greet(person: string, date: Date) {
  console.log(`Hello ${person}, today is ${date.toDateString()}!`);
}
```
person : string 타입을, date : Date 타입을 표기했다  
-> 표기를 하면 TypeScript에서는 해당 함수를 올바르지 못하게 사용했을 경우 이를 알려줄 수 있게 된다

**에러** : Argument of type 'string' is not assignable to parameter of type 'Date'.

**원인** : Date()를 호출하면 string을 반환한다

해결 : new Date()를 사용하여 Date 타입을 생성한다 
```tsx
function greet(person: string, date: Date) {
  console.log(`Hello ${person}, today is ${date.toDateString()}!`);
}
 
greet("Maddison", new Date());
```

명시적 타입 표기르 항상 작성할 필요는 없지만 TypeScript는 생략된 타입 정보를 추론할 수 있다

---

## 7 지워진 타입

앞서 작성한 함수 greet를 tsc로 컴파일하여 JavaScript 출력을 얻었을 때 
```tsx
function greet(person, date) {
    console.log("Hello ".concat(person, ", today is ").concat(date, "!"));
}
greet("Brendan");
```
로 변환이 된다 여기서 두 가지를 알 수 있다

1. person, data 인자는 더 이상 타입 표기를 가지지 않는다
2. “템플릿 문자열” - 백틱(` 문자)을 사용하여 작성된 문장 - 은 연결 연산자(+)로 이루어진 일반 문자열로 변환되었다 

-> 바뀐 이유 : 새로운 또는 “상위” 버전의 ECMAScript를 예전의 또는 “하위” 버전의 것으로 바꾸는 과정을 _다운레벨링_이라 부르기도 한다 

TypeScript는 ES3라는 아주 구버전의 ECMAScript를 타겟으로 동작하는 것이 기본 동작이다 

타겟 버전의 기본값은 ES3이지만, 현존하는 대다수의 브라우저들은 ES2015를 지원하고 있다

그러므로 
tsc --target es2015 파일명.ts
지정해주면 아래와 같이 변환이 된다 
```JavaScript
function greet(person, date) {
  console.log(`Hello ${person}, today is ${date.toDateString()}!`);
}
greet("Maddison", new Date());
```
---

## 8 엄격도 
TypeScript의 타입 검사기를 사용하는 목적은 다양하지만
사용자들은 TypeScript가 최대한으로 타입 검사를 수행 해주기를 선호한다 -> 이것이 엄격도 설정을 제공하는 이유이다 

TypeScript에는 켜고 끌 수 있는 타입 검사 엄격도 플래그가 몇 가지 존재한다 예를 들면
oImplicitAny와 strictNullChecks 이다

1. noImplicitAny  
noImplicitAny 플래그를 활성화하면 타입이 any로 암묵적으로 추론되는 변수에 대하여 오류를 발생

2. strictNullChecks  
null과 undefined의 처리를 잊는 것은 세상의 셀 수 없이 많은 버그들의 원인 -> strictNullChecks 플래그는 null과 undefined를 보다 명시적으로 처리해준다  










