# 8. 제네릭

### 제네릭이란?

제네릭(Generics)은 하나의 데이타 타입이 아닌 여러 데이타 타입에 대해 클래스/인터페이스 혹은 함수가 동일하게 동작할 수있게 해주는 기능입니다.

## 1. 제네릭
일단 제네릭이 없는 일반 함수를 작성해보자
```tsx
function identity(arg: number): number {
  return arg;
}
```
이를 타입을 사용하면
```tsx
function identity(arg: any): any {
  return arg;
}
```
any 유형은 모든 유형이 반환될 수 있고, 타입 유추가 힘들어 사용을 지양해야합니다 

```tsx
function identity<Type>(arg: Type): Type {
  return arg;
}
```
제네릭을 사용하면 자료형을 정하지 않고 여러 타입을 사용할 수 있게 해주고, 
생성 시점에서 타입을 명시하여 하나의 타입만이 아닌 다양한 타입을 사용할 수 있도록 해줍니다.

일반 함수를 작성 후 두 가지 방법 중 하나로 호출할 수 있습니다
```tsx
let output = identity<string>("myString");
```
let output: string
```tsx
let output = identity("myString");
```
let output: string

굳이 꺽쇠 괄호를 통해 타입을 명시적으로 전달할 필요는 없지만
컴파일러가 타입을 추론하지 못할 경우에서는 이전 예제와 같이 타입을 명시적으로 전달해야 할 수도 있습니다 

## 2.제네릭 타입 변수 작업
제네릭을 사용할때 함수에 들어올 매개 변수를 올바르게 사용하도록 강제합니다 
```tsx
function loggingIdentity<Type>(arg: Type): Type {
  console.log(arg.length);
  return arg;
}
```

error : Property 'length' does not exist on type 'Type'.

타입이 아직 추론되지 않아서 length를 사용하지 못합니다 

우리는 타입스크립트에게 좀 더 힌트를 줘야합니다
```tsx
function loggingIdentity<Type>(arg: Type[]): Type[] {
  console.log(arg.length);
  return arg;
}
```
해결 : 배열을 사용하면 length 속성에 접근할 수 있습니다 

```tsx
function loggingIdentity<Type>(arg: Array<Type>): Array<Type> {
  console.log(arg.length); 
  return arg;
}
```
또는 다음과 같이도 작성 할 수 있습니다 

## 3. 제네릭 타입
이번에는 함수 자체의 타입과 인터페이스를 만들어 봅시다 

제네릭 함수의 타입은 제네릭이 아닌 함수의 타입과 같으며 type 매개 변수가 먼저 나열되고 함수 선언과 유사합니다
```tsx
function identity<Type>(arg: Type): Type {
  return arg;
}
 
let myIdentity: <Type>(arg: Type) => Type = identity;
```

꼭 Type이 아닌 다른 이름을 사용할 수 있습니다

```tsx
function identity<T>(arg: T): T {
  return arg;
}
 
let myIdentity: <A>(arg: A) => A = identity;
```

제네릭 타입을 리터럴 타입의 호출 서명으로도 작성 할 수 있습니다
```tsx
function identity<Type>(arg: Type): Type {
  return arg;
}
 
let myIdentity: { <Type>(arg: Type): Type } = identity;
```

이전 예제의 리터럴 객체를 가져와서 인터페이스로 작성해봅시다

```tsx
interface GenericIdentityFn {
  <Type>(arg: Type): Type;
}
 
function identity<Type>(arg: Type): Type {
  return arg;
}
 
let myIdentity: GenericIdentityFn = identity;
```

또한 일반 매개 변수를 인터페이스 매개 변수로도 작성 할 수 있습니다
```tsx
interface GenericIdentityFn<Type> {
  (arg: Type): Type;
}
 
function identity<Type>(arg: Type): Type {
  return arg;
}
 
let myIdentity: GenericIdentityFn<number> = identity;
```

## 4. 제네릭 클래스

제네릭 클레스는 인터페이스처럼 비슷하게 클래스 이름 뒤에 꺽쇠 괄호를 써서 사용합니다 
```tsx
class GenericNumber<NumType> {
  zeroValue: NumType;
  add: (x: NumType, y: NumType) => NumType;
}
 
let myGenericNumber = new GenericNumber<number>();
myGenericNumber.zeroValue = 0;
myGenericNumber.add = function (x, y) {
  return x + y;
};
```

위 class의 NumType은 number로 씌였지만 string을 넣어서도 사용할 수 있습니다
```tsx
let stringNumeric = new GenericNumber<string>();
stringNumeric.zeroValue = "";
stringNumeric.add = function (x, y) {
  return x + y;
};
 
console.log(stringNumeric.add(stringNumeric.zeroValue, "test"));
```

## 5. 제네릭 제약 조건

아까 예제에서 length를 사용할 수 없는 예제가 있었는데요 
```tsx
function loggingIdentity<Type>(arg: Type): Type {
  console.log(arg.length);
  return arg;
}
```
error : Property 'length' does not exist on type 'Type'.

length를 가능하게 할려면 extends를 사용하면 됩니다

일단 length 속성을 가지는 인터페이스를 만들어봅시다
```tsx
interface Lengthwise {
  length: number;
}
 
function loggingIdentity<Type extends Lengthwise>(arg: Type): Type {
  console.log(arg.length); // 
  return arg;
}
```
Lengthwise를 extends하면 length속성이 있으므로 사용할 수 있습니다 


하지만 extends를 사용하면 length 속성만 사용이 가능하기 때문에 
```tsx
loggingIdentity(3);
```
error : Argument of type 'number' is not assignable to parameter of type 'Lengthwise'.

대신 타입에 필요한 모든 속성이 있는 값을 전달해야합니다 
```tsx
loggingIdentity({ length: 10, value: 3 });
```

## 6. 제넬릭 제약 조건엣서 타입 매개 변수 사용

우리는 실수로 존재하지 않는 속성을 못 오도록 keyof 키워드를 사용해 제약을 걸 수 있습니다
```tsx
function getProperty<Type, Key extends keyof Type>(obj: Type, key: Key) {
  return obj[key];
}
 
let x = { a: 1, b: 2, c: 3, d: 4 };
 
getProperty(x, "a");
getProperty(x, "m");
```
error: Argument of type '"m"' is not assignable to parameter of type '"a" | "b" | "c" | "d"'.

x없는 속성을 제한되어 m이 오류 처리됩니다 

## 7. 제네릭에서 클래스 유형 사용
제네릭을 사용하여 타입스크립트에서 팩토리를 만들 때는 생성자 함수별로 클래스 유형을 참조해야 합니다 

```tsx
function create<Type>(c: { new (): Type }): Type {
  return new c();
}
```
보다 고급 예제에서는 prototype 속성을 사용하여 생성자 함수와 클래스 형식의 인스턴스 측 간의 관계를 유추하고 제한합니다.

```tsx
class BeeKeeper {
  hasMask: boolean = true;
}
 
class ZooKeeper {
  nametag: string = "Mikle";
}
 
class Animal {
  numLegs: number = 4;
}
 
class Bee extends Animal {
  keeper: BeeKeeper = new BeeKeeper();
}
 
class Lion extends Animal {
  keeper: ZooKeeper = new ZooKeeper();
}
 
function createInstance<A extends Animal>(c: new () => A): A {
  return new c();
}
 
createInstance(Lion).keeper.nametag;
createInstance(Bee).keeper.hasMask;
```

