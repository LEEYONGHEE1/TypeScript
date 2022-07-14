## 4주차 Narrowing

## 1. 좁히기란?

- Typescript에서 좁히기란?  
여러 유형으로 평가될 수 있는 유형을 좀 더 좁은 의미의 유형으로 좁히는 것을 말한다

- 좁히기는 왜 필요한가?  
JavaScript는 동적 언어이므로 런타임 시점에서 잘못된 유형 접근으로 버그가 발생한다  
이를 방지하기위해 TypeScript는 코딩 시점이나 런타임 시점에서 좁히기 시전을 한다 

- 좁히기로 얻는 이점  
쾌적한 TypeScript 코드 편집  
동적 언어에서 실수 할 수 있는 다양한 유형 오용 방지

## 2. 축소

- padLeft 함수
```tsx
function padLeft(padding: number | string, input: string) {
  return " ".repeat(padding) + input;
}
```

1. 오류 : Argument of type 'string | number' is not assignable to parameter of type 'number'.
  Type 'string' is not assignable to type 'number'.

2. 오류 분석 : 일단 repeat()을 먼저 알아야한다 repeat은 괄호안에 number가 들어와야하는데 위 코드에서는 앞에 " "을 padding : 수 만큼 반복하는거다 

3. 해결 : number에 대한 예외처리를 해줘야한다

```tsx
function padLeft(padding: number | string, input: string) {
  if (typeof padding === "number") {
    return " ".repeat(padding) + input;
  }
  return padding + input;
}
```

- 축소 : TypeScript는 프로그램이 주어진 위치에서 가장 구체적인 유형의 값을 분석하기 위해 취할 수있는 가능한 실행 경로를 따릅니다. 이러한 특수 검사 (유형 가드라고 함)와 할당을 살펴보고 선언 된 유형보다 더 구체적인 유형으로 유형을 구체화하는 프로세스를 축소라고합니다.

## 3. Typeof 유형 가드
JavaScript는 런타임에 우리가 가진 값의 유형에 대한 매우 기본적인 정보를 제공 할 수있는 연산자를 지원합니다.  
ypeScript는 이것이 특정 문자열 집합을 반환합니다
- string
- number
- bigint
- boolean
- symbol
- undefined
- object
- function

TypeScript에서 반환된 값을 확인하는 것은 형식 가드입니다.
```tsx
function printAll(strs: string | string[] | null) {
  if (typeof strs === "object") {
    for (const s of strs) {
Object is possibly 'null'.
      console.log(s);
    }
  } else if (typeof strs === "string") {
    console.log(strs);
  } else {
    // do nothing
  }
}
```
위 코드는  for (const s of strs) 부분에서 오류가 생깁니다

1. 오류 : Object is possibly 'null'.

2. 오류 분석 : 자바스크립트에서는 null도 object 타입으로 인식합니다 
당연히 아무값도 들어오지 않으면
const s of strs 객체안의 수만큼 하나씩 꺼내는 const of 에서는 에러가 납니다 

3. 해결 : null 체크와 자바 스크립트는 "" 빈 문자열도 false로 체크하기 때문에 
이에대한 예외처리가 필요합니다 
```tsx
function printAll(strs: string | string[] | null) {
  if (strs) {
    if (typeof strs === "object") {
      for (const s of strs) {
        console.log(s);
      }
    } else if (typeof strs === "string") {
      console.log(strs);
    }
  }
}
```

## 4. 진실성 축소 
자바 스크립트에서는 조건부, s, s, 문, 부울 부정 () 등의 모든 표현식을 사용할 수 있습니다. 예를 들어, 명령문은 해당 조건이 항상 유형을 가질 것으로 기대하지 않습니다.
```tsx
function getUsersOnlineMessage(numUsersOnline: number) {
  if (numUsersOnline) {
    return `There are ${numUsersOnline} online now!`;
  }
  return "Nobody's here. :(";
}
```
위 코드를 보면 numUsersOnline이라는 인자를 number 타입으로 받는데  
if 문에서 인자만 가져다 썼습니다 ->   
자바 스크립트에서 먼저 조건을 "강요"하여 의미를 부여하고 결과가 있는지 여부에 따라 분기를 선택하는 것과 같은 구문을 사용합니다.  
다음과 같은 값은 flase로 판단합니다 
- 0
- NaN
- ""
- 0n
- null
- undefined

함수를 통해 값을 실행하거나 더 짧은 이중 부울 부정을 사용하여 값을 s로 강제 지정할 수 있습니다.

```tsx
// both of these result in 'true'
Boolean("hello"); // type: boolean, value: true
!!"world"; // type: true,    value: true

let a : boolean = !!"world";

if(a){ // !"world"는 false
}
```

TypeScript는 종종 초기에 버그를 잡는 데 도움이 될 수 있지만 값으로 아무 것도하지 않기로 선택하면 지나치게 규범적이지 않고 할 수있는 일이 너무 많습니다
원하는 경우 린터로 이와 같은 상황을 처리 할 수 있습니다.

! 부울 연산자  
```tsx
function multiplyAll(
  values: number[] | undefined,
  factor: number
): number[] | undefined {
  if (!values) {
    return values;
  } else {
    return values.map((x) => x * factor);
  }
}
```

undefined는 false이므로 undefined가 들어오면 values를 그래로 출력하고 그게 아니면 else문을 실행합니다 

## 5. 평등 축소
TypeScript는 또한 , , 와 같은 명령문 및 동등성 검사를 사용하고 유형을 좁힙니다. 예를 들어: switch===!====!=
```tsx
function example(x: string | number, y: string | boolean) {
  if (x === y) {
    x.toUpperCase();
    y.toLowerCase();  
  } else {
    console.log(x);
    console.log(y);
  }
}
```
위 코드는 x와 y의 동등성을 검사합니다 if문에서는 x 와 y가 같을경우는 두 인자의 타입이 string 일때만 일치하기 때문에 문자열에서만 쓸 수 있는 toUpperCase()를 사용할 수 있습니다  
자바 스크립트의 느슨한 평등은 올바르게 좁혀지고 좁혀집니다. 익숙하지 않은 경우 실제로 무언가가 실제로 값인지 여부를 확인하는 것뿐만 아니라 잠재적으로 있는지 여부를 확인합니다.
```tsx
interface Container {
  value: number | null | undefined;
}
 
function multiplyValue(container: Container, factor: number) {
  // Remove both 'null' and 'undefined' from the type.
  if (container.value != null) {
    console.log(container.value);
                           
(property) Container.value: number
 
    // Now we can safely multiply 'container.value'.
    container.value *= factor;
  }
}
```

위 코드는 != null값만 아니면 if문이 실행되지만 잠재적으로 실제로 값이 있는지 확인하기 때문에 null, undefuned도 확인한다 

## 6. 작업자 축소 in
JavaScript에는 객체에 이름을 가진 속성이 있는지 여부를 결정하는 연산자인 in 이 있습니다 

```tsx
type Fish = { swim: () => void };
type Bird = { fly: () => void };
 
function move(animal: Fish | Bird) {
  if ("swim" in animal) {
    return animal.swim();
  }
 
  return animal.fly();
}
```
코드를 보면 문자열 리터럴이며 유니온 유형입니다. "true" 분기는 선택적 또는 필수 속성을 가진 유형의 범위를 좁히고 "false" 분기는 선택 속성 또는 누락된 속성을 가진 유형으로 좁혀집니다.  
swim은 Fish에 있기 때문에  return animal.swim(); 반환합니다

예를들어 
```tsx
type Fish = { swim: () => void };
type Bird = { fly: () => void };
type Human = { swim?: () => void; fly?: () => void };
 
function move(animal: Fish | Bird | Human) {
  if ("swim" in animal) {
    animal;
      
//(parameter) animal: Fish | Human
  } else {
    animal;
      
//(parameter) animal: Bird | Human
  }
}
```
Fish와 Human이 swim이 있으므로 if 문에서 animal은 Fish | Human으로 다른 경우는 Bird | Human 으로 좁혀집니다

## 7. instanceof 축소
instanceof : JavaScript에서 값이 다른 값의 "인스턴스"인지 여부를 확인하는 연산자

```tsx
function logValue(x: Date | string) {
  if (x instanceof Date) {
    console.log(x.toUTCString());
               
//(parameter) x: Date
  } else {
    console.log(x.toUpperCase());
               
//(parameter) x: string
  }
}
```
위 코드는 x인자가 Date에 속해 있는지 확인하고 맞으면 true 아니면 else문을 실행 합니다  
짐작할 수 있듯이 유형 가드이기도 하며 TypeScript는 조건문에서 분기에서 좁혀집니다.

## 8. 할당
TypeScript는 변수에 할당 할 때 할당의 오른쪽을보고 왼쪽을 적절하게 좁힙니다.
```tsx
let x = Math.random() < 0.5 ? 10 : "hello world!";
   
x = 1;
 
console.log(x);
           
x = "goodbye!";
 
console.log(x);
```
위 코드는 Math.random()이 0.5보다 작으면 true이므로 10을 false면 "hello world"를 x에 담습니다  
위 코드를 보면 x는 타입이 number | string으로 좁혀지고 
특정 값을 넣었을때 그 값에 맞는 타입으로 다시 좁혀지게 됩니다.

선언 된 유형의 일부가 아닐때
```tsx
let x = Math.random() < 0.5 ? 10 : "hello world!";
   
x = 1;
console.log(x);
           
x = true;
console.log(x);
```
위 코드에서는 x = true는 boolean으로 처음 x가 선언될 때 타입이 number | string 이므로 오류가 생기게 됩니다 

## 9. 제어 흐름 분석
지금까지 TypeScript가 특정 분기 내에서 좁아지는 방법에 대한 몇 가지 기본 예제를 살펴 보았는데 조건문 등에서 유형 가드를 찾는 것보다 더 많은 일이 일어나고 있습니다 
```tsx
function padLeft(padding: number | string, input: string) {
  if (typeof padding === "number") {
    return " ".repeat(padding) + input;
  }
  return padding + input;
}
```
padLeft 첫 번째 블록 내에서 반환됩니다. TypeScript는이 코드를 분석하고 본문 ()의 나머지 부분이 . 그 결과, 나머지 기능에 대해 좁히는 유형에서 제거 할 수있었습니다.  
도달 가능성을 기반으로 하는 이러한 코드 분석을 제어 흐름 분석이라고 하며, TypeScript는 이 흐름 분석을 사용하여 유형 가드 및 할당이 발생할 때 유형을 좁힙니다  
```tsx
function example() {
  let x: string | number | boolean;
  x = Math.random() < 0.5;
  console.log(x);        
//let x: boolean
  if (Math.random() < 0.5) {
    x = "hello";
    console.log(x);           
//let x: string
  } else {
    x = 100;
    console.log(x);            
//let x: number
  }
  return x;    
//let x: string | number
}
```
이번 예제에서는 변수가 분석되면 제어 흐름이 분리되어 반복해서 다시 병합 될 수 있으며 해당 변수는 각 지점에서 다른 유형을 갖는 것을 알 수 있습니다

## 10. 형식 조건자 사용 
지금까지 축소를 처리하기 위해 기존 JavaScript 구문을 사용해 왔지만 코드 전체에서 형식이 변경되는 방식을 보다 직접적으로 제어하려는 경우도 있습니다.  

사용자 정의 유형 가드를 정의하려면 반환 유형이 유형 술어인 함수를 정의하기만 하면 됩니다.
```tsx
function isFish(pet: Fish | Bird): pet is Fish {
  return (pet as Fish).swim !== undefined;
}
```
pet is fish는 형식 조건자입니다. 술어는 형식이고 함수 명은 매개 변수 이름이어야 합니다 

```tsx
type Fish = { swim: () => void };
type Bird = { fly: () => void };
declare function getSmallPet(): Fish | Bird;
function isFish(pet: Fish | Bird): pet is Fish {
  return (pet as Fish).swim !== undefined;
}
let pet = getSmallPet();

if (isFish(pet)) {
  pet.swim();
} else {
  pet.fly();
}
```
TypeScript에서는 각각의 타입에 대한 유추를 할 수 있습니다  
위 코드를 보면 pet is fish 가 형식 조건자가 되고 swim이 있고 undefined이면 pet은 Fish가 됩니다 

## 11. 차별된 유니언
여기까지 간단한 유형이나 단일 변수를 좁히는데 중점을 두었지만 여기서는 더 복잡한 구조를 다룰 것입니다 

```tsx
interface Shape {
  kind: "circle" | "square";
  radius?: number;
  sideLength?: number;
}

function handleShape(shape: Shape) {
  // oops!
  if (shape.kind === "rect") {
    // ...
  }
}
```
위 코드는 리터럴 유형의 조합을 사용하고 있으면 shape.kind에 유형에 따라 원 또는 사각형으로 처리해야하는지 알려줍니다 

1. 오류 : This condition will always return 'false' since the types '"circle" | "square"' and '"rect"' have no overlap.

2. 오류 분석 : 맞춤법 오류 

다른 예제도 보면
```tsx
interface Shape {
  kind: "circle" | "square";
  radius?: number;
  sideLength?: number;
}

function getArea(shape: Shape) {
  return Math.PI * shape.radius ** 2;
}
```
1. 오류 :  Object is possibly 'undefined'.

2. 오류 분석 : strictNullChecks에서 우리에게 오류를 제공합니다 - 정의되지 않았을 수 있습니다 

3. 해결 : 속성에 대한 검사를 수행한다? 아래 코드를 보자

```tsx
interface Shape {
  kind: "circle" | "square";
  radius?: number;
  sideLength?: number;
}

function getArea(shape: Shape) {
  if (shape.kind === "circle") {
    return Math.PI * shape.radius ** 2;
  }
}
```

1. 오류 : Object is possibly 'undefined'.

2. ,오류 분석 : 속성 검사를 했지만 null이 존재할 수 도 있다는 것을 유추 할 수 있습니다 

3. 해결 : !사용해서 null이 들어 올 수 없다는 것을 알려줘야한다 
```tsx
interface Shape {
  kind: "circle" | "square";
  radius?: number;
  sideLength?: number;
}

function getArea(shape: Shape): {
  if (shape.kind === "circle") {
    return Math.PI * shape.radius! ** 2;
  }
}
```
그러나 이것은 이상적이지 않습니다  
null 아닌 것을 주장하기 위해서 !를 썼지만 코드를 쓰다보면 이러한 오류가 발생하기 쉽습니다.
또한 strictNullChecks 외부에서 실수로 해당 필드에 액세스 할 수 있습니다.  
```tsx
interface Circle {
  kind: "circle";
  radius: number;
}
 
interface Square {
  kind: "square";
  sideLength: number;
}
 
type Shape = Circle | Square;
```
여기서는 속성데 대해 서로 다른 값을 가진 두 유형으로 분리되었습니다 실행 할려고 할 때 어떤 일이 발생할까?
```tsx
function getArea(shape: Shape) {
  return Math.PI * shape.radius ** 2;
}
```
1. 오류 : Property 'radius' does not exist on type 'Shape'.
  Property 'radius' does not exist on type 'Square'.

2. 오류 분석 : square에는 radius 속성이 없고 다른 의미로는
TypeScript가 속성이 있는지 여부를 알 수 없기 때문에 strictNullChecks가 활성화 된 상태에서 오류가 발생했습니다

3. 해결 : 속성에 대한 확인을 하면 된다
```tsx
function getArea(shape: Shape) {
  if (shape.kind === "circle") {
    return Math.PI * shape.radius ** 2;
  }
}
```
동일한 검사는 명령문에서도 작동합니다 (ex : switch)
```tsx
function getArea(shape: Shape) {
  switch (shape.kind) {
    case "circle":
      return Math.PI * shape.radius ** 2;
                        
//(parameter) shape: Circle
    case "square":
      return shape.sideLength ** 2;
              
//(parameter) shape: Square
  }
}
```
최종 : TypeScript에서는 올바른 정보를 전달하고 유형 검사를 통해 안전한 코드를 작성할 수 있었습니다 

12. 유형 never, 철저한 검사
TypeScript는 형식을 사용하여 존재하지 않아야 하는 상태를 나타낼때 never를 사용합니다 

예를 들면
```tsx
interface Circle {
  kind: "circle";
  radius: number;
}

interface Square {
  kind: "square";
  sideLength: number;
}
// ---cut---
type Shape = Circle | Square;

function getArea(shape: Shape) {
  switch (shape.kind) {
    case "circle":
      return Math.PI * shape.radius ** 2;
    case "square":
      return shape.sideLength ** 2;
    default:
      const _exhaustiveCheck: never = shape;
      return _exhaustiveCheck;
  }
}
```
shape에는 Circle, Square만 있기 때문에 모두 일치하지 않는 never를 사용했습니다 

만약 Union에 새 맴버를 추가하면 오류가 발생합니다 
```tsx
// @errors: 2322
interface Circle {
  kind: "circle";
  radius: number;
}

interface Square {
  kind: "square";
  sideLength: number;
}
// ---cut---
interface Triangle {
  kind: "triangle";
  sideLength: number;
}

type Shape = Circle | Square | Triangle;

function getArea(shape: Shape) {
  switch (shape.kind) {
    case "circle":
      return Math.PI * shape.radius ** 2;
    case "square":
      return shape.sideLength ** 2;
    default:
      const _exhaustiveCheck: never = shape;
      return _exhaustiveCheck;
  }
}
```
never가 성립되지 않습니다 

never : 숫자에서 아무것도 존재하지 않는 것을 표현하기 위해 0이 존재하는 것처럼, 타입 시스템에서도 그 어떤 것도 불가능하다는 것을 나타내는 타입이 필요하기 때문에 never가 생겼습니다 

























