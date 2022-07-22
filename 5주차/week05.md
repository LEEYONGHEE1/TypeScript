# 함수에 대한 추가 정보

## 1. 함수 타입 표현식
함수를 설명하는 방법으로는 함수 타입 표현식을 사용하는 것입니다
```tsx
function greeter(fn: (a: string) => void) {
  fn("Hello, World");
}
 
function printToConsole(s: string) {
  console.log(s);
}
 
greeter(printToConsole);
```
함수 greeter에 fn 은 a: 문자열을 가지는 매개변수  
=> void 리턴값이 void(반환 값이 없다)  
만약 매개변수 타입이 지정되지 않으면 암시 적으로 any 타입이 됩니다  
타입 별칭을 사용하여 함수 타입의 이름을 지정할 수 있습니다
```tsx
type GreetFunction = (a: string) => void;
function greeter(fn: GreetFunction) {
  // ...
}
```

## 2. 호출 서명
자바 스크립트에서 함수는 호출 가능한 것 외에도 속성을 가질 수 있습니다. 그러나 함수 타입 표현식 구문은 속성 선언을 허용하지 않습니다.  
속성으로 호출 할 수있는 것을 설명하려면 객체 유형에 호출 서명을 작성할 수 있습니다.
```tsx
type DescribableFunction = {
  description: string;
  (someArg: number): boolean;
  //check!
};
function doSomething(fn: DescribableFunction) {
  console.log(fn.description + " returned " + fn(6));
}
```
타입 별칭은 함수 타입 표현식과 약간 다른데 매개 변수 목록과 반환 유형 사이에 사용하는 대신 => 를 : 으로 사용합니다 

## 3. 서명 구성
자바 스크립트 함수는 연산자 로 호출할 수도 있습니다  
타입 스크립트는 일반적으로 새 객체를 생성하기 때문에 이것을 생성자 라고 합니다. 호출 서명 앞에 new 키워드를 추가하여 서명 구성을 할 수 있습니다. 
```tsx
type SomeObject = any;

type SomeConstructor = {
  new (s: string): SomeObject;
  // SomeObject는 any타입
};
function fn(ctor: SomeConstructor) {
  return new ctor("hello");
}
```
자바 스크립트의 Date와 같은 객체는 new 키워드를 사용안해도 타입 서명을 할 수 있습니다.
```tsx
interface CallOrConstruct {
  new (s: string): Date;
  (n?: number): number;
}
```
## 4. 제네릭 함수
- 제네릭의 사전적 정의   
제네릭은 C#, Java 등의 언어에서 재사용성이 높은 컴포넌트를 만들 때 자주 활용되는 특징입니다. 특히, 한가지 타입보다 여러 가지 타입에서 동작하는 컴포넌트를 생성하는데 사용됩니다.  

1. 배열의 첫 번재 요소를 반환하는 함수
```tsx
function firstElement(arr: any[]) {
  return arr[0];
}
```
위 함수는 돌아가지만 반환 유형이 any입니다. 함수가 배열 요소의 타입을 반환했다면 더 좋을 것입니다  
TypeScript에서 제네릭 은 두 값 간의 대응 관계를 설명할 때 사용됩니다. 
```tsx
declare function firstElement<Type>(arr: Type[]): Type | undefined;
// s is of type 'string'
const s = firstElement(["a", "b", "c"]);
// n is of type 'number'
const n = firstElement([1, 2, 3]);
// u is of type undefined
const u = firstElement([]);
```
위에서의 함수에 타입 매개변수를 추가하고 중간 중간에 <>를 추가하였습니다
이제 호출하면 더 구체적인 타입이 나옵니다  
타입이 위 예제에서는 지정할 필요가 없습니다. 타입은 타입스크립트에 의해 추론되고 자동으로 선택되었습니다
2. 추론
```tsx
function map<Input, Output>(arr: Input[], func: (arg: Input) => Output): Output[] {
  return arr.map(func);
}
 
// Parameter 'n' is of type 'string'
// 'parsed' is of type 'number[]'
const parsed = map(["1", "2", "3"], (n) => parseInt(n));
```
위 함수는 문자열 배열을 Int로 형변환을 해주어 string타입의 배열로 바꿔줌  
이 예제에서 TypeScript는 형식 매개 변수의 형식(지정된 배열에서)과 함수 표현식()의 반환 값을 기반으로 형식 매개 변수를 모두 유추할 수 있습니다.

3. 제약 조건
지금까지 모든 종류에서 작동 할 수 있는 제네릭 함수를 다뤘는데 이번에는 특정 타입의 매개 변수가 허용할 수 있는 타입으로 제한을 해보자
```tsx
function longest<Type extends { length: number }>(a: Type, b: Type) {
  if (a.length >= b.length) {
    return a;
  } else {
    return b;
  }
}
 
// longerArray is of type 'number[]'
const longerArray = longest([1, 2], [1, 2, 3]);
// longerString is of type 'alice' | 'bob'
const longerString = longest("alice", "bob");
// Error! Numbers don't have a 'length' property
const notOK = longest(10, 100);
```
에러 : Argument of type 'number' is not assignable to parameter of type '{ length: number; }'.

에러 이유 : number는 길이를 셀 수 없슴.

여기서 주목해야 할 것은 타입 스크립트가 반환 유형을 추론한다는 것이다 반환 타입 추론은 제네릭 함수에서도 작동합니다 

4. 제한된 가치로 작업 

다음은 일반 제약 조건으로 작업 할 때 발생하는 일반적인 오류입니다.

```tsx
function minimumLength<Type extends { length: number }>(
  obj: Type,
  minimum: number
): Type {
  if (obj.length >= minimum) {
    return obj;
  } else {
    return { length: minimum };
  }
}
```

에러 : Type '{ length: number; }' is not assignable to type 'Type'.
  '{ length: number; }' is assignable to the constraint of type 'Type', but 'Type' could be instantiated with a different subtype of constraint '{ length: number; }'.

  위 함수가 정상적인 것처럼 보일 수 있지만 함수는 반환하거나 해당 제약 조건과 일치하는 값을 반환해야합니다 
  문제는 함수가 제약 조건과 일치하는 일부 객체뿐만 아니라 전달 된 것과 동일한 종류의 객체를 반환 할 것을 약속한다는 것입니다.

  만약 위 코드가 정상적이라면 잘 작동해야되는데 
  ```tsx
  const arr = minimumLength([1, 2, 3], 6);
console.log(arr.slice(0));
```
위 코드에서 에러가 나는데: 
arr.slice is not a function

반환은 되었지만 객체가 반환이 안되었다? 타입 스크립트가 반환 값에 대한 유추를 했습니다 

5. 형식 인수 지정
TypeScript는 일반적으로 제네릭 호출에서 의도 된 형식 인수를 추론 할 수 있지만 항상 그런 것은 아닙니다. 예를 들어, 두 배열을 결합하는 함수를 작성했다고 가정 해 봅시다.
```tsx
function combine<Type>(arr1: Type[], arr2: Type[]): Type[] {
  return arr1.concat(arr2);
}
const arr = combine([1, 2, 3], ["hello"]);
```
에러 : Type 'string' is not assignable to type 'number'.

원인 : 배열 타입이 일치하지 않습니다 

해결 : 수동으로 타입을 지정해줍니다 
```tsx
const arr = combine<string | number>([1, 2, 3], ["hello"]);
```
6. 좋은 제네힉 함수를 작성하기 위한 지침

- 더 적은 유형 매개 변수 사용
```tsx
function filter1<Type>(arr: Type[], func: (arg: Type) => boolean): Type[] {
  return arr.filter(func);
}
 
function filter2<Type, Func extends (arg: Type) => boolean>(
  arr: Type[],
  func: Func
): Type[] {
  return arr.filter(func);
}
```
두 함수는 서로 
두 값을 연관시키지 않는 타입 매개변수를 만들었습니다. 타입 인수를 지정하려는 호출자가 아무 이유 없이 추가 유형 인수를 수동으로 지정해야 하기 때문입니다. 함수를 읽고 추론하기 어렵게 만드는 것 외에는 아무 것도 하지 않습니다

- 타입 매개 변수를 적게 사용할 것
```tsx
function greet<Str extends string>(s: Str) {
  console.log("Hello, " + s);
}
 
greet("world");
```
더 간단하게 작성하자
```tsx
function greet(s: string) {
  console.log("Hello, " + s);
}
```
## 5. 선택적 매개 변수
자바 스크립트의 함수는 종종 다양한 수의 인수를 사용합니다. 예를 들어, 선택적 숫자 수를 취하는 방법은 다음과 같습니다.
```tsx
function f(n: number) {
  console.log(n.toFixed()); // 0 arguments
  console.log(n.toFixed(3)); // 1 argument
}
```
타입스크립트에서는 매개 변수를 ?를 사용하여 선택 사항으로 모델링 할 수 있습니다
```tsx
function f(x?: number) {
  // ...
}
f(); // OK
f(10); // OK
```
x뒤어 ?를 붙이면 number | undefined 유니온 타입으로 유추가 됩니다 
```tsx
declare function f(x?: number): void;
// cut
// All OK
f();
f(10);
f(undefined);
```
누락된 인수도 OK

### 콜백 선택적 매개 변수

콜백을 호출하는 함수
```tsx
function myForEach(arr: any[], callback: (arg: any, index?: number) => void) {
  for (let i = 0; i < arr.length; i++) {
    callback(arr[i], i);
  }
}

myForEach([1, 2, 3], (a) => console.log(a));
myForEach([1, 2, 3], (a, i) => console.log(a, i));
```

위 함수는 모두 잘 작동한다 하지만 아래 예제를 보면

```tsx
function myForEach(arr: any[], callback: (arg: any, index?: number) => void) {
  for (let i = 0; i < arr.length; i++) {
    callback(arr[i]);
  }
}

myForEach([1, 2, 3], (a, i) => {
  console.log(i.toFixed());
});
```

에러 : undefined 가 올 수 있다

해결 : undefined 가 올 수 없게 index도 무조건 값을 받아야하므로 ?를 제거한다 

JavaScript에서 매개 변수보다 많은 인수가있는 함수를 호출하면 추가 인수가 무시됩니다. TypeScript는 같은 방식으로 동작합니다. 매개 변수가 적은 함수는 항상 더 많은 매개 변수가있는 함수를 대신 할 수 있습니다.

## 6. 함수 오버로드 
타입스크립트의 ‘함수 오버로드(Overloads)’는 이름은 같지만 매개변수 타입과 반환 타입이 다른 여러 함수를 가질 수 있는 것을 말한다.

자바스크립트 함수는 다양한 인수 카운트 및 타입으로 호출 할 수 있습니다 ex) timestamp
```tsx
function makeDate(timestamp: number): Date;
function makeDate(m: number, d: number, y: number): Date;
function makeDate(mOrTimestamp: number, d?: number, y?: number): Date {
  if (d !== undefined && y !== undefined) {
    return new Date(y, mOrTimestamp, d);
  } else {
    return new Date(mOrTimestamp);
  }
}
const d1 = makeDate(12345678);
const d2 = makeDate(5, 5, 5);
const d3 = makeDate(1, 3);
```

d3에서 에러가 나는데 : No overload expects 2 arguments, but overloads do exist that expect either 1 or 3 arguments.

원인 : 
오버로드에는 2개의 인수가 필요하지 않지만 1개 또는 3개의 인수가 필요한 오버로드는 존재합니다.

### 오버로드 시그니처 및 구현 시그니처
```tsx
function fn(x: string): void;
function fn() {
  // ...
}
// Expected to be able to call with zero arguments
fn();
```

에러 : Expected 1 arguments, but got 0.

원인 : 위 함수를 먼저 인식해서 오류 

구현 시그니처는 오버로드 시그니처와도 호한이되어야 합니다 
```tsx
function fn(x: boolean): void;
// Argument type isn't right
function fn(x: string): void;
function fn(x: boolean) {}
```
구현 시그니처인 function fn(x: boolean) {} 이 boolean만 인정하는데 string 타입은 일치하지 않습니다 
```tsx
function fn(x: string): string;
// Return type isn't right
function fn(x: number): boolean;
function fn(x: string | number) {
  return "oops";
}
```
마찬가지로 반환값도 일치해야합니다 

### 좋은 오버로드 작성

```tsx
function len(s: string): number;
function len(arr: any[]): number;
function len(x: any) {
  return x.length;
}
len(""); // OK
len([0]); // OK
len(Math.random() > 0.5 ? "hello" : [0]);
```

에러 : No overload matches this call.
  Overload 1 of 2, '(s: string): number', gave the following error.
    Argument of type 'number[] | "hello"' is not assignable to parameter of type 'string'.
      Type 'number[]' is not assignable to type 'string'.
  Overload 2 of 2, '(arr: any[]): number', gave the following error.
    Argument of type 'number[] | "hello"' is not assignable to parameter of type 'any[]'.
      Type 'string' is not assignable to type 'any[]'.
두 오버로드 모두 동일한 인수 수와 동일한 반환 타입을 갖기 때문에 대신 오버로드되지 않은 버전의 함수를 작성해야 한다
```tsx
function len(x: any[] | string) {
  return x.length;
}
``` 
가능한 경우 오버로드 대신 유니온 유형이있는 매개 변수를 항상 선호합니다.

### 함수에서 this 선언
TypeScript는 코드 흐름 분석을 통해 함수에 무엇이 있어야하는지 추론합니다 (예 :this
```tsx
const user = {
  id: 123,
 
  admin: false,
  becomeAdmin: function () {
    this.admin = true;
  },
};
```
위 예제에서 becomeAdmin에서 this를 통해 TypeScript는 함수에 외부 객체 인 해당 객체가 있음을 이해합니다. 
```tsx
interface DB {
  filterUsers(filter: (this: User) => boolean): User[];
}
 
const db = getDB();
const admins = db.filterUsers(function (this: User) {
  return this.admin;
});
```
이 패턴은 콜백 스타일 API에서 일반적이며, 다른 객체는 일반적으로 함수가 호출될 때를 제어합니다. 
```tsx
interface DB {
  filterUsers(filter: (this: User) => boolean): User[];
}
 
const db = getDB();
const admins = db.filterUsers(() => this.admin);
The containing arrow function captures the global value of 'this'.
Element implicitly has an 'any' type because type 'typeof globalThis' has no index signature.
```
이 동작을 정상 작동할려면 화살표 함수가 아닌 일반 함수로 작성해야 합니다 

## 7. 알아야 할 다른 타입
함수 타입으로 작업 할 때 자주 나타나는 몇 가지 추가 타입이 있습니다 


1. void 

void는 값을 변환하지 않는 함수의 반환 값을 나타냅니다 
 함수에 명령문이 없거나 해당 return 문에서 명시 적 값을 반환하지 않을 때마다 유추 된 타입입니다.
```tsx
// The inferred return type is void
function noop() {
  return;
}
```
반환값을 따로 지정해주지 않으면 반환 타입은 void

2. object

- x특수 형식은 프리미티브가 아닌 값(, , 또는 )을 나타냅니다.  
원시값이 아닌 값은 object   

- 자바 스크립트에서 함수 값은 객체입니다 : 속성을 가지고 있고, 프로토 타입 체인에 있고, , 호출 할 수 있습니다
이러한 이유로 함수 유형은 TypeScript에서 object로 간주됩니다

3. unknown
unknown 타입은 단어의 뜻과 동일하게 '알 수 없다, 모른다'라는 의미를 가집니다.

unknown 형식은 모든 값을 나타냅니다. 타입과는 비슷하지만 값으로 아무 것도하지 않는 것이 합법적이지 않기 때문에 더 안전합니다.
```tsx
function f1(a: any) {
  a.b(); // OK
}
function f2(a: unknown) {
  a.b();
Object is of type 'unknown'.
}
```
unknown을 방지하기 위해서는 조건문을 붙여서 제한을 걸면됩니다 

4. never
일부 함수는 값을 반환하지 않습니다.
```tsx
function fail(msg: string): never {
  throw new Error(msg);
}
```
반환 타입에서 never는 함수가 예외를 throw하거나 프로그램 실행을 종료한다는 것을 의미합니다
```tsx
function fn(x: string | number) {
  if (typeof x === "string") {
    // do something
  } else if (typeof x === "number") {
    // do something else
  } else {
    x; // has type 'never'!
  }
}
```
never TypeScript가 유니온에 아무것도 남아 있지 않다고 결정할 때도 나타납니다.

5. Function  
전역 형식은 , 와 같은 속성을 설명하고 JavaScript의 모든 함수 값에 존재하는 다른 속성을 설명합니다. 또한 유형의 값이 항상 호출 될 수있는 특수 속성이 있습니다
```tsx
function doSomething(f: Function) {
  return f(1, 2, 3);
}
```
임의의 함수를 받아 들여야하지만 호출하지 않으려는 경우 형식은 일반적으로 더 안전합니다.() => void

## 8. 나머지 매개 변수 및 인수
### 8-1 나머지 매개 변수  
선택적 매개 변수 또는 오버로드를 사용하여 다양한 고정 인수 수를 허용할 수 있는 함수를 만드는 것 외에도 rest 매개 변수를 사용하여 무제한의 인수를 사용하는 함수를 정의할 수도 있습니다.

rest 매개 변수는 다른 모든 매개 변수 뒤에 나타나고 ...구문을 사용합니다
```tsx
function multiply(n: number, ...m: number[]) {
  return m.map((x) => n * x);
}
// 'a' gets value [10, 20, 30, 40]
const a = multiply(10, 1, 2, 3, 4);
```
타입스크립트에서 이러한 매개 변수에 대한 모든 타입 주석은 , 또는 튜플 유형이어야합니다 

### 나머지 인수
spread 구문을 사용하여 배열에서 가변 수의 인수를 제공 할 수 있습니다.
```tsx
const arr1 = [1, 2, 3];
const arr2 = [4, 5, 6];
arr1.push(...arr2);
```
일반적으로 TypeScript는 배열이 변경할 수 없다고 가정하지 않습니다. 이로 인해 몇 가지 놀라운 동작이 발생할 수 있습니다.
```tsx
const args = [8, 5];
const angle = Math.atan2(...args);
```
에러 : 스프레드 인수는 튜플 형식을 갖거나 rest 매개 변수에 전달되어야 합니다.

해결 : const를 사용해보자 
```tsx
// Inferred as 2-length tuple
const args = [8, 5] as const;
// OK
const angle = Math.atan2(...args);
```
## 9. 매개변수 분해
매개 변수 소멸을 사용하여 인수로 제공된 객체를 함수 본문의 하나 이상의 로컬 변수로 편리하게 압축 해제할 수 있습니다.
```tsx
function sum({ a, b, c }) {
  console.log(a + b + c);
}
sum({ a: 10, b: 3, c: 9 });
```
객체에 대한 형식 주석은 소멸 구문 다음에 사용됩니다.
```tsx
function sum({ a, b, c }: { a: number; b: number; c: number }) {
  console.log(a + b + c);
}
```
이렇기 작성도 가능하다
```tsx
type ABC = { a: number; b: number; c: number };
function sum({ a, b, c }: ABC) {
  console.log(a + b + c);
}
```

## 10. 함수의 할당 가능성
반환 타입 void
함수에 대한 반환 타입은 비정상적이지만 예상되는 동작을 생성 할 수 있습니다.  
반환 타입을 사용하는 const 타이핑은 함수가 무언가를 반환하지 않도록 강제하지 않습니다.  
반환 유형 ()이있는 문맥 함수 타입이며, 구현 될 때 다른 값을 반환 할 수 있지만 무시됩니다.  
따라서 유형의 다음 구현이 유효합니다.() => void
```tsx
type voidFunc = () => void;
 
const f1: voidFunc = () => {
  return true;
};
 
const f2: voidFunc = () => true;
 
const f3: voidFunc = function () {
  return true;
};
```
하나의 반환 값이 다른 변수에 할당되면 void 타입을 유지합니다 
```tsx
const v1 = f1();
 
const v2 = f2();
 
const v3 = f3();
```
이 동작은 숫자를 반환하고 메서드가 반환 유형이 인 함수를 기대하더라도 다음 코드가 유효하도록 존재합니다.
```tsx
const src = [1, 2, 3];
const dst = [0];
 
src.forEach((el) => dst.push(el));
```
리터럴 함수 정의에 반환 유형이 void인 경우 해당 함수가 아무 것도 반환해서는 안됩니다 
```tsx
function f2(): void {
  // @ts-expect-error
  return true;
}
 
const f3 = function (): void {
  // @ts-expect-error
  return true;
};
```







