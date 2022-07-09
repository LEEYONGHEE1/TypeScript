# 3주차 일상적인 유형

3주차에서는 JavaScript 코드에서 찾을 수 있는 가장 일반적인 값 유형 중 일부를 다루고 TypeScript에서 이러한 유형을 설명하는 해당 방법을 다룬다

## 1. 기본 요소 : string, number, boolean, 배열

- string : 문자열 값을 나타냄
- number : 숫자값을 나타냄 대신 int, float 도 number임 

- boolean : true or false

- 배열 : 

```tsx
let a: string[] = ["study"]
let b: number[] = [0]
let c: boolean[] = [true]


let d = ["study"]
let e = [0]
let f = [true]
```

- any : 값이 type 이면 그 값의 모든 속성에 엑세스 할 수 있고, 함수처럼 호출, 모든 유형의 값에 할당, 구문적으로는 거의 모든 다른값에 할당 가능

```tsx
let obj: any = { x:0 }; //객체
obj.foo();
obj();
obj.bar = 100;
obj = "hello";
const n: number = obj;
```
## 2. 기능

- 매개변수 유형 주석
함수를 선언할 때 각 매개변수 뒤에
어떤 타입이 올지 유형을 선언할 수 있다 
```tsx
// name: 뒤에 타입 선언(string)
function greet(name: string) {
  console.log("Hello, " + name.toUpperCase() + "!!");
}
```

- 반환 유형 주석
반환 유형 주석을 추가할 수 있다  
반환 유형 주석은 매개변수 목록 뒤에 넣으면 된다
```tsx
function getFavoriteNumber(): number {
  return 26;
}
```
반환할 값이 숫자임을 나타내고 있다

## 3. 객체 타입
객체 유형을 정의 하려면 속성과 유형을 나열해야되는데 
```tsx
function printCoord(pt: { x: number; y: number }) {}
```

x,y 타입이 number이고 ,또는 ; 사용하여 속성을 구분할 수 있다
```tsx
function printCoord(pt: { x: number; y: number, }) {}
```
마지막 구분 기호는 선택 사항이다

- 선택적 속성
개체 유형은 속성의 일부 또는 전체를 선택 사항으로 지정할 수 있다. 이렇게 할려면 ?를 속성 이름 뒤에 추가하면 된다
```tsx
function printName(obj: { first: string; last?: string }) {
  // ...
}
// ?로 선택적 속성을 사용했기 때문에 하나의 속성값만 들어가도 에러가 안난다
printName({ first: "Bob" });
printName({ first: "Alice", last: "Alisson" });
```
하지만 first:"Bob" 만 넣게 되면 에러는 안나지만 last값은 undefined 가 된다  

이를 방지하기 위해서는 
따로 처리를 해줘야 한다

```tsx
function printName(obj: { first: string; last?: string }) {
  console.log(obj.first)

  if (obj.last !== undefined) {
    // OK
    console.log(obj.last);
  }

}
// Both OK
printName({ first: "Bob" });
```
최근 자바 스크립트 에서는 console.log(obj.last?.toUpperCase()); 이런식으로 따로 처리를 해준다 

## 4. 조합 타입
TypeScript의 유형 시스템을 사용하면 다양한 연산자를 사용하여 기존 유형에서 새로운 유형을 빌드할 수 있다

- Union 유형 정의
유형을 결합하는 방법중 하나인 union 유형이다  
union 유형이란 둘 이상의 다른 유형으로 구성된 유형으로 이런 유형 중 하나일 수 있는 값을 나타내는 것이다
```tsx
function printId(id: number | string) {
  console.log("Your ID is: " + id);
}
// OK
printId(101);
// OK
printId("202");
// 객체는 number, string 둘다 아니기 때문에 에러가 난다 
printId({ myID: 22342 });
```
만약 객체도 에러가 안나게 할려면
```tsx
function printId(id: {myID: number} | number | string){
    if(typeof id === "object") {
    console.log("Your Id:" + id.myID)
    }else{
        console.log("Your Id:" + id)
    }
} 

// OK
printId(101);
// OK
printId("202");
// OK
printId({ myID: 22342 });
```
객체 타입도 유니온 타입에 넣으면 된다  

- Union 유형 작업
TypeScript는 Union의 모든 구성원에 대해 유효한 경우에만 작업을 허용한다 예를 들면
```tsx
function printId(id: number | string) {
  console.log(id.toUpperCase());
```
toUpperCase()는 string에서는 사용할 수 있지만 number는 대문자로 못바꾸기 때문에 에러가 난다  
그러므로 같이 쓰고 싶으면 따로 처리를 해줘야 한다

```tsx
function printId(id: number | string) {
  if (typeof id === "string") {
    console.log(id.toUpperCase());
  } else {
    console.log(id);
  }
}
```
또 다른 경우는 둘다 사용 가능한 기능을 쓰는 것이다
```tsx
function getFirstThree(x: number[] | string) {
  return x.slice(0, 3);
}
```
배열과 문자열에는 모두 slice메서드가 있다 

## 5. 타입 별칭
만약 유형을 두 번 이상 사용할려고 유형을 따로 관리 해주는게 편리할 것이다
```tsx
type Point = {
  x: number;
  y: number;
};
 
// Exactly the same as the earlier example
function printCoord(pt: Point) {
  console.log("The coordinate's x value is " + pt.x);
  console.log("The coordinate's y value is " + pt.y);
}
 
printCoord({ x: 100, y: 100 });
```
유형 별칭은 모든 유형의 이름이다

## 6. 인터페이스
인텊페이스는 객체 유형의 이름을 지정하는 또 다른 방법이다

```tsx
interface Point {
  x: number;
  y: number;
}
 
function printCoord(pt: Point) {
  console.log("The coordinate's x value is " + pt.x);
  console.log("The coordinate's y value is " + pt.y);
}
 
printCoord({ x: 100, y: 100 });
```
위에서 타입 별칭을 사용할 때와 마찬가지로 예제에도 익명 개체 유형을 사용한 것처럼 작동한다
그러면 차이점은 무엇일까?

## 7. 인터페이스와 타입 별칭의 차이점

1. 확장 방식이 다르다

- 인터페이스 -> extends 사용
```tsx
interface Animal {
  name: string
}

interface Bear extends Animal {
  honey: boolean
}

const bear = getBear() 
bear.name
bear.honey
``` 

- 타입 별칭 -> 교차를 통해 확장
```tsx
type Animal = {
  name: string
}

type Bear = Animal & { 
  honey: boolean 
}

const bear = getBear();
bear.name;
bear.honey;
```
2. 추가 방식이 다르다
- 인터페이스 -> 새 필드 추가
```tsx
interface Window {
  title: string
}

interface Window {
  ts: TypeScriptAPI
}

const src = 'const a = "Hello World"';
window.ts.transpileModule(src, {});
```
- 타입 별칭 -> 생성된 후에는 변경할 수 없다
```tsx
type Window = {
  title: string
}

type Window = {
  ts: TypeScriptAPI
}
```
error :  Duplicate identifier 'Window'.

## 8. 타입 단언
타입 단언은 때때로 TypeScript가 알 수 없는 값의 유형에 대한 정보가 있을 것에 대해 타입 단언을 사용하여 더욱 구체적인 유형을 지정할 수 있다
```tsx
const myCanvas = document.getElementById("main_canvas") as HTMLCanvasElement;

const myCanvas = <HTMLCanvasElement>document.getElementById("main_canvas");
```

타입 단언은 as 나 꺾쇠 갈호 구문을 통해 사용할 수 있다  
하지만 타입 단언이라도 불가능한 강제 변환은 방지한다
```tsx
const x = "hello" as number;
```
string -> number로 변환은 불가능 하다 

## 9. 리터럴 타입
특정 문자열과 숫자를 타입으로 지정할 수 있다
```tsx
let changingString = "Hello World";
changingString = "Olá Mundo";
changingString;
      
const constantString = "Hello World";
constantString;
```
예를 들면
```tsx
function printText(s: string, alignment: "left" | "right" | "center") {
  // ...
}
printText("Hello, world", "left");
printText("G'day, mate", "centre");
```
error: 특정 집합만 허용하는 함수이기 때문에 에러

- 숫자 리터럴 타입도 동일한 방식으로 작동
```tsx
function compare(a: string, b: string): -1 | 0 | 1 {
  return a === b ? 0 : a > b ? 2 : -1;
}
```
error: '-1 | 0 | 2' 유형은 '0 | 1 | -1' 유형에 할당할 수 없습니다.

물론, 리터럴이 아닌 타입과도 함께 사용할 수 있다
```tsx
interface Options {
  width: number;
}
function configure(x: Options | "auto") {
  // ...
}
configure({ width: 100 });
configure("auto");
configure("auto");
```
Options 인터페이스 옆에 유니온 타입인 "auto" 가 올 수 있다



## 10. 리터럴 추론
객체로 변수를 초기화할 때 TypeScript는 해당 객체의 속성이 나중에 값을 변경할 수 있다고 가정한다

```tsx
const obj = { counter: 0 };
if (someCondition) {
  obj.counter = 1;
}
```
1은 TypeScript는 이전에 있었던 필드에 대한 할당이 0오류라고 가정하지 않는다 

- 문자열에도 동일하게 적용된다
```tsx
declare function handleRequest(url: string, method: "GET" | "POST"): void;

const req = { url: "https://example.com", method: "GET" };
handleRequest(req.url, req.method);
```
error : Argument of type 'string' is not assignable to parameter of type '"GET" | "POST"'.

객체는 나중에 값을 변경할 수 있다고 가정하기 때문에 string으로 간주한다  
이를 해결할려면  
1. 타입 단언
타입 단언을 사용하여 타입을 바꿔준다 
```tsx
declare function handleRequest(url: string, method: "GET" | "POST"): void;

const req = { url: "https://example.com", method: "GET" as "GET" };

handleRequest(req.url, req.method as "GET");
```

2. as const전체 객체를 유형 리터럴로 변환하는데 사용한다
```tsx
declare function handleRequest(url: string, method: "GET" | "POST"): void;

const req = { url: "https://example.com", method: "GET" } as const;

handleRequest(req.url, req.method);
```

## 11. null 과 undefined
JavaScript에는 빈 값 또는 초기화되지 않은 값을 가리키는 두 가지 원시값이 존재한다. 바로 null과 undefined 이다

null, undefined 검사의 부재는 버그의 주요 원인이 되기 때문에 strictNullChecks 옵션을 설정하는 것을 항상 권장한다

strictNullChecks가 설정되었다면, 어떤 값이 null 또는 undefined일 때, 옵셔널 프로퍼티를 사용하기에 앞서 undefined 여부를 검사하는 것과 마찬가지로, _좁히기_를 통하여 null일 수 있는 값에 대한 검사를 수행할 수 있다

```tsx
function doSomething(x: string | undefined) {
  if (x === undefined) {
    // 아무 것도 하지 않는다
  } else {
    console.log("Hello, " + x.toUpperCase());
  }
}
```

- Null 아님 단언 연산자 (접미사
!
)  
TypeScript에서는 명시적인 검사를 하지 않고도 타입에서 null과 undefined를 제거할 수 있는 특별한 구문을 제공합니다. 표현식 뒤에 !를 작성하면 해당 값이 null 또는 undefined가 아니라고 타입 단언하는 것
```tsx
function liveDangerously(x?: number | undefined) {
  // 오류 없음
  console.log(x!.toFixed());
}
```
다른 타입 단언과 마찬가지로 이 구문은 코드의 런타임 동작을 변화시키지 않으므로, ! 연산자는 반드시 해당 값이 null 또는 undefined가 아닌 경우에만 사용해야 한다

## 12. 열거형  
열거형인 enum은 열거형 변수로 정수를 하나로 합칠 때 편리한 기능이다. 임의의 숫자나 문자열을 할당할 수 있다
```tsx
enum grade {
    a, 
    b,
    c=11,
    d,
}

console.log(grade.a) // 0
console.log(grade.b) // 1
console.log(grade.c) // 11
console.log(grade.d) // 12
```
하지만 열거형은 컴파일시 코드가 남게 되므로 컴파일시 코드가 안남는 const enum을 사용하기도 한다 

## 13. 자주 사용되지 않는 원시형 타입

원시타입에는 string, number, bigint, boolean, undefined, symbol 가 있지만 자주 사용되지 않는 bigint와 symbol 에 대해서 알아보자

- bigint : 
ES2020 이후, 아주 큰 정수를 다루기 위한 원시 타입이 JavaScript에 추가되었다.
```tsx
// BigInt 함수를 통하여 bigint 값을 생성
const oneHundred: bigint = BigInt(100);
 
// 리터럴 구문을 통하여 bigint 값을 생성
const anotherHundred: bigint = 100n;
```

- symbol :
symbol은 전역적으로 고유한 참조값을 생성하는 데에 사용할 수 있는 원시 타입이다 symbol은 함수를 통하여 생성할 수 있다
```tsx
const firstName = Symbol("name");
const secondName = Symbol("name");
 
if (firstName === secondName) {
This condition will always return 'false' since the types 'typeof firstName' and 'typeof secondName' have no overlap.
  // 절대로 일어날 수 없습니다
}
```
symbol은 전역적으로 고유한 참조값을 가지기 때문에 에러가 난다 
















