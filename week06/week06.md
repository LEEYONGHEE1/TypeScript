# 객체 타입

## 1. 객체

자바 스크립트에서 데이터를 그룹화하고 전달하는 방법은 객체를 통해서입니다.

```tsx
function greet(person: { name: string; age: number }) {
  return "Hello " + person.name;
}
```

익명일 수 있고

```tsx
interface Person {
  name: string;
  age: number;
}
 
function greet(person: Person) {
  return "Hello " + person.name;
}
```
인터페이스를 사용하여 이름을 지정할 수 있습니다

```tsx
type Person = {
  name: string;
  age: number;
};
 
function greet(person: Person) {
  return "Hello " + person.name;
}
```
타입 별칭을 통해서도 지정할 수 있습니다 

## 2. 속성 수정자
객체 유형의 각 속성은 선택 사항인지 여부를 지정할 수 있습니다 

### 선택적 속성
해당 속성을 `?` 를 사용하여 선택 사항으로 표시 할 수 있습니다
```tsx
interface PaintOptions {
  shape: Shape;
  xPos?: number;
  yPos?: number;
}
 
function paintShape(opts: PaintOptions) {
  // ...
}
 
const shape = getShape();
paintShape({ shape });
paintShape({ shape, xPos: 100 });
paintShape({ shape, yPos: 100 });
paintShape({ shape, xPos: 100, yPos: 100 });
```
위 에제에서는 xPos, yPos 가 선택사항으로 간주되기 때문에 정상 코드로 작동합니다 
그러나 타입스크립트에서는 잠재적으로 number | undefined 타입으로 유추됩니다 

```tsx
function paintShape(opts: PaintOptions) {
  let xPos = opts.xPos;
                   
//(property) PaintOptions.xPos?: number | undefined
  let yPos = opts.yPos;
                   
//(property) PaintOptions.yPos?: number | undefined
  // ...
}
```
우리는 조건문을 사용해 이를 따로 처리 할 수 있습니다
```tsx
function paintShape(opts: PaintOptions) {
  let xPos = opts.xPos === undefined ? 0 : opts.xPos;
       
//let xPos: number
  let yPos = opts.yPos === undefined ? 0 : opts.yPos;
       
//let yPos: number
  // ...
}
```
위 예제에서는 undefined에 대한 처리를 할 수 있었습니다 

```tsx
function paintShape({ shape, xPos = 0, yPos = 0 }: PaintOptions) {
  console.log("x coordinate at", xPos);
                                  
//(parameter) xPos: number
  console.log("y coordinate at", yPos);
                                  
//(parameter) yPos: number
  // ...
}
```
에초에 지정되지 않은 값에 대해 기본값을 설정해 undefined에 대한 처리를 따로 할 수 있습니다 

```tsx
function draw({ shape: Shape, xPos: number = 100 /*...*/ }) {
  render(shape);
//Cannot find name 'shape'. Did you mean 'Shape'?
  render(xPos);
//Cannot find name 'xPos'.
}
```
객체 소멸 패턴에서 속성이 로컬의 변수로 재정의 되기 때문에 위 예제는 에러가 납니다 

## 3. readonly 속성

### readonly란
- readonly 런타임 시 동작은 변경되지 않습니다
- 초기화는 가능하지만 변경은 안됩니다
- 속성 자체를 다시 쓸 수 없음을 의미합니다.

```tsx
interface SomeType {
  readonly prop: string;
}
 
function doSomething(obj: SomeType) {
  // We can read from 'obj.prop'.
  console.log(`prop has the value '${obj.prop}'.`);
 
  // But we can't re-assign it.
  obj.prop = "hello";
//error : Cannot assign to 'prop' because it is a read-only property.
}
```
위 예제에서는 readonly로 속성을 지정해줬는데 그 속성을 재정의 할려고 했기 때문에 에러가 납니다 

readonly를 사용한다고해서 반드시 값이 완전히 변경 불가능하거나 내부 내용을 변경할 수 없다는 것을 의미하지는 않습니다. 그것은 단지 속성 자체를 다시 쓸 수 없다는 것을 의미합니다

```tsx
interface Home {
  readonly resident: { name: string; age: number };
}
 
function visitForBirthday(home: Home) {
  // We can read and update properties from 'home.resident'.
  console.log(`Happy birthday ${home.resident.name}!`);
  home.resident.age++;
}
 
function evict(home: Home) {
  // But we can't write to the 'resident' property itself on a 'Home'.
  home.resident = {
// error : Cannot assign to 'resident' because it is a read-only property.
    name: "Victor the Evictor",
    age: 42,
  };
}
```
readonly 속성이므로 `resident`에 할당 할 수 없습니다

```tsx
interface Person {
  name: string;
  age: number;
}
 
interface ReadonlyPerson {
  readonly name: string;
  readonly age: number;
}
 
let writablePerson: Person = {
  name: "Person McPersonface",
  age: 42,
};
 
// works
let readonlyPerson: ReadonlyPerson = writablePerson;
 
console.log(readonlyPerson.age); // prints '42'
writablePerson.age++;
console.log(readonlyPerson.age); // prints '43'
```
위 예제는 writablePerson이 읽고, 쓸 수 있지만 다른 interface는 readonly로 지정되었습니다 하지만 readonlyPerson에 writablePerson을 대입해도 값을 변경할 수 있습니다 

### 인덱스 시그니처

속성 이름 대신 대괄혼 안에 키와 타입을 작성 value도
[key: 타입] : value

 Key와 Value의 타입을 정확하게 명시해야 하는 경우 사용할 수 있습니다.
딕셔너리 처럼 key  value를 나누어 속성값을 모두 합산한다 등에 사용할 수 있습니다.

인덱스 서명 속성 유형은 '문자열' 또는 '숫자'여야 합니다.
```tsx
interface StringArray {
  [index: number]: string;
}
 
const myArray: StringArray = getStringArray();
const secondItem = myArray[1];
```

문자열 인덱스 시그니처는 모든 속성이 반환 유형과 일치하도록 강제합니다. 이는 문자열 인덱스가. 다음 예제에서 'type이 문자열 인덱스의 유형과 일치하지 않으며 형식 검사기가 오류를 발생시킵니다.

```tsx
interface NumberDictionary {
  [index: string]: number;
 
  length: number; // ok
  name: string;
}
```

error : Property 'name' of type 'string' is not assignable to 'string' index type 'number'.

만약 인덱스 시그니처의 속성 타입이 유니온 속성인 경우 다른 유형의 속성을 사용 할 수 있습니다
```tsx
interface NumberOrStringDictionary {
  [index: string]: number | string;
  length: number; // ok, length is a number
  name: string; // ok, name is a string
}
```
인덱스에 할당되지 않도록 readonly를 사용해 인덱스 시그니처를 만들 수 있습니다 
```tsx
interface ReadonlyStringArray {
  readonly [index: number]: string;
}
 
let myArray: ReadonlyStringArray = getReadOnlyStringArray();
myArray[2] = "Mallory";
```

## 4. 타입 확장
예를 들어, 택배를 보낼 때 필요한 필드를 담은 interface가 있습니다
```tsx
interface BasicAddress {
  name?: string;
  street: string;
  city: string;
  country: string;
  postalCode: string;
}
```
일부 상황에서는 충분하지만
주소의 건물에 여러 단위가 있어서 더 많은 정보가 필요하다고 가정해봅시다
```tsx
interface AddressWithUnit {
  name?: string;
  unit: string;
  street: string;
  city: string;
  country: string;
  postalCode: string;
}
```
우리는 비슷하지만 다른 모든 필드를 반복해야합니다. 하지만 우리는 원래 형식을 확장하고 고유한 새 필드를 추가 할 수 있습니다
```tsx
interface BasicAddress {
  name?: string;
  street: string;
  city: string;
  country: string;
  postalCode: string;
}
 
interface AddressWithUnit extends BasicAddress {
  unit: string;
}
```
interface는 여러 타입에서 확장 될 수도 있습니다
```tsx
interface Colorful {
  color: string;
}
 
interface Circle {
  radius: number;
}
 
interface ColorfulCircle extends Colorful, Circle {}
 
const cc: ColorfulCircle = {
  color: "red",
  radius: 42,
};
```

## 5. 교차 타입

위에서 interface에 유형을 확장하여 새 유형을 구축했는데 타입스크립트는 기존 유형을 결합할 수 있는 `&` 구문을 제공합니다
```tsx
interface Colorful {
  color: string;
}
interface Circle {
  radius: number;
}
 
type ColorfulCircle = Colorful & Circle;
```

## 6. 일반 개체 유형
모든 값을 포함 할 수 있는 타입을 생각해봅시다 
```tsx
interface Box {
  contents: any;
}
```
잘 작동하지만 any타입은 오류의 원인입니다  
이를 사용할 수 있지만 이미 타입을 알고있는 경우 따로 처리를 하거나 타입 어설션을 사용해야합니다 
```tsx
interface Box {
  contents: unknown;
}
 
let x: Box = {
  contents: "hello world",
};
 
// we could check 'x.contents'
if (typeof x.contents === "string") {
  console.log(x.contents.toLowerCase());
}
 
// or we could use a type assertion
console.log((x.contents as string).toLowerCase());
```

한 가지 타입의 안전한 접근법으로는
```tsx
interface NumberBox {
  contents: number;
}
 
interface StringBox {
  contents: string;
}
 
interface BooleanBox {
  contents: boolean;
}
```

그러나 이러한ㄴ 타입에서 작동하기 위해 다른 함수 또는 함수 오버로드를 만들어야합니다
```tsx
function setContents(box: StringBox, newContents: string): void;
function setContents(box: NumberBox, newContents: number): void;
function setContents(box: BooleanBox, newContents: boolean): void;
function setContents(box: { contents: any }, newContents: any) {
  box.contents = newContents;
}
```
하지만 긴 코드로 인해 새로운 타입과 과부화가 생길 수 있습니다 이를 효과적으로 작동시키기위해  
type 매개 변수를 선언하는 제네릭 형식을 만들 수 있습니다
```tsx
interface Box<Type> {
  contents: Type;
}
```
이를 활용하면
```tsx
interface Box<Type> {
  contents: Type;
}
interface StringBox {
  contents: string;
}
 
let boxA: Box<string> = { contents: "hello" };
boxA.contents;
        
//(property) Box<string>.contents: string
 
let boxB: StringBox = { contents: "world" };
boxB.contents;
        
//(property) StringBox.contents: string
```
Box에 어떤 타입이든 대체 할 수 있다는 점에서 재사용이 가능합니다. 즉, 새로운 유형의 상자가 필요할 때 새로운 유형을 선언 할 필요가 전혀 없습니다

```tsx
interface Box<Type> {
  contents: Type;
}
 
interface Apple {
  // ....
}
 
// Same as '{ contents: Apple }'.
type AppleBox = Box<Apple>;
```
이것은 또한 제네릭 함수를 사용하여 오버로드를 피할 수 있습니다 

```tsx
interface Box<Type> {
  contents: Type;
}

let boxA: Box<string> = { contents: "hello" };
boxA.contents;
```
오버로드 필요없이 제네릭 선언으로
타입을 유연하게 받을 수 있습니다

```tsx
function setContents<Type>(box: Box<Type>, newContents: Type) {
  box.contents = newContents;
}
```
다음과 같이 새로운 인터페이스를 정의할 수 있습니다 
```tsx
interface Box<Type> {
  contents: Type;
}
```
타입 별칭을 사용도 가능합니다
```tsx
type Box<Type> = {
  contents: Type;
};
```

타입 별칭은 인터페이스와 달리 객체 타입 이상을 설명 할 수 있기 때문에 다른 종류의 일반 타입을 작성하는 데 사용할 수도 있습니다 

```tsx
type OrNull<Type> = Type | null;
 
type OneOrMany<Type> = Type | Type[];
 
type OneOrManyOrNull<Type> = OrNull<OneOrMany<Type>>;
           
//type OneOrManyOrNull<Type> = OneOrMany<Type> | null
 
type OneOrManyOrNullStrings = OneOrManyOrNull<string>;
               
//type OneOrManyOrNullStrings = OneOrMany<string> | null
```

### Array 타입
Array<number> = number[]와 같습니다 string도 마찬가지입니다
```tsx
function doSomething(value: Array<string>) {
  // ...
}
 
let myArray: string[] = ["hello", "world"];
 
// either of these work!
doSomething(myArray);
doSomething(new Array("hello", "world"));
```

위의 타입과 마찬가지로 Array는 제네릭 타입입니다
```tsx
interface Array<Type> {
  /**
   * Gets or sets the length of the array.
   */
  length: number;
 
  /**
   * Removes the last element from an array and returns it.
   */
  pop(): Type | undefined;
 
  /**
   * Appends new elements to an array, and returns the new length of the array.
   */
  push(...items: Type[]): number;
 
  // ...
}
```

### ReadonlyArray
변경하지 않아야하는 배열을 설명하는 특수 타입입니다
```tsx
function doStuff(values: ReadonlyArray<string>) {
  // We can read from 'values'...
  const copy = values.slice();
  console.log(`The first value is ${values[0]}`);
 
  // ...but we can't mutate 'values'.
  values.push("hello!");
}
```
error : Property 'push' does not exist on type 'readonly string[]'.

readonly로 작성되었기 때문에 값을 추가할 수 없습니다 

```tsx
new ReadonlyArray("red", "green", "blue");
```
유형만 참조하지만 여기서는 값으로 쓰였기 때문에 에러가 납니다 

```tsx
const roArray: ReadonlyArray<string> = ["red", "green", "blue"];
```

대신에 일반 변수에는 할당 할 수 있습니다 

```tsx
let x: readonly string[] = [];
let y: string[] = [];
 
x = y;
y = x;
```

readonly string[] 타입은 'readonly'이며 가변 타입 string[]에 할당할 수 없습니다.

### 튜플 타입 

튜플을 사용하는게 낯설 수 있지만 많은 코드를 작성하다보면 바꿀 수 없는 튜플을 사용하는게 안전한 코드를 작성하는데 도움을 줄 수 있습니다 
```tsx
type StringNumberPair = [string, number];
```
여기서 튜플로 인덱스가 포함하는 배열을 대입비교 할 수 있습니다
```tsx
function doSomething(pair: [string, number]) {
  const a = pair[0];
       
//const a: string
  const b = pair[1];
       
//const b: number
  // ...
}
 
doSomething(["hello", 42]);
```

요소 수를 초과하면 오류가 발생합니다 
```tsx
function doSomething(pair: [string, number]) {
  // ...
 
  const c = pair[2];
}
```
우리는 또한 자바 스크립트의 구조 분해를 사용하여 튜플을 해체 할 수 있습니다.
```tsx
function doSomething(stringHash: [string, number]) {
  const [inputString, hash] = stringHash;
 
  console.log(inputString);
                  
//const inputString: string
 
  console.log(hash);
               
//const hash: number
}
```
간단한 튜플 타입은 특정 인덱스에 대한 속성을 선언하고 숫자 리터럴 타입으로 선언하는 것과 동일합니다 
```tsx
interface StringNumberPair {
  // specialized properties
  length: 2;
  0: string;
  1: number;
 
  // Other 'Array<string | number>' members...
  slice(start?: number, end?: number): Array<string | number>;
}
```
`?`를 붙여서 선택적 튜플 요소를 만들 수 있습니다 
```tsx
type Either2dOr3d = [number, number, number?];
 
function setCoordinate(coord: Either2dOr3d) {
  const [x, y, z] = coord;
              
//const z: number | undefined
 
  console.log(`Provided coordinates had ${coord.length} dimensions`);
}
```

튜플도 나머지 요소를 가질 수 있습니다 

```tsx
const a: StringNumberBooleans = ["hello", 1];
const b: StringNumberBooleans = ["beautiful", 2, true];
const c: StringNumberBooleans = ["world", 3, true, false, true, false, true];
```

가변 매개변수
나머지 요소는 사용자가 지정한 만큼 더 넣을 수 있음
```tsx
function myFun(a, b, ...manyMoreArgs) {
  console.log("a", a);
  console.log("b", b);
  console.log("manyMoreArgs", manyMoreArgs);
}

myFun("one", "two", "three", "four", "five", "six");
```
나머지 요소가 없어도 오류는 안납니다 

나머지 요소를 활용한 예제
```tsx
function readButtonInput(...args: [string, number, ...boolean[]]) {
  const [name, version, ...input] = args;
  // ...
}
```
다음과도 같습니다
```tsx
function readButtonInput(name: string, version: number, ...input: boolean[]) {
  // ...
}
```
이것은 매개 변수로 가변 수의 인수를 가져 와서 최소 수의 요소가 필요하지만 중간 변수를 도입하고 싶지 않을 때 유용합니다.

### readonly 튜플 타입
튜플 타입에는 변형이 있으며 배열 구문과 마찬가지로 앞에 readonly를 붙여 지정할 수 있습니다
```tsx
function doSomething(pair: readonly [string, number]) {
  // ...
}
```
튜플의 속성에 다시 값을 넣는것은 허용되지 않습니다
```tsx
function doSomething(pair: readonly [string, number]) {
  pair[0] = "hello!";
}
```
튜플은 대부분의 코드에서 생성되고 수정되지 않은 상태로 유지되는 경향이 있으므로 가능한 경우 유형에 튜플로 주석을 추가하는 것이 좋은 기본값입니다.
```tsx
let point = [3, 4] as const;
 
function distanceFromOrigin([x, y]: [number, number]) {
  return Math.sqrt(x ** 2 + y ** 2);
}
 
distanceFromOrigin(point);
```
error : 
'읽기 전용 [3, 4]' 타입의 인수는 '[number, number]' 타입의 매개변수에 할당할 수 없습니다.
  '읽기 전용 [3, 4]' 타입은 '읽기 전용'이며 변경 가능한 타입 '[number, number]'에 할당할 수 없습니다.




