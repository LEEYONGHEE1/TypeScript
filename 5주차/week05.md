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

## 6. 기능 과부화 


