# 키 유형 연산자 

## keyof 연산자 

keyof 연산자는 객체 유형을 취하고 키의 리터럴 유니온을 생성합니다
```tsx
type Point = { x: number; y: number };
type P = keyof Point;
```

인덱스 서명이 있는 경우는 해당 타입을 반환합니다
```tsx
type Arrayish = { [n: number]: unknown };
type A = keyof Arrayish;
    
//type A = number
 
type Mapish = { [k: string]: boolean };
type M = keyof Mapish;
    
//type M = string | number
```

# 타입 연산자

## typeof 연산자

typeof연산자는 해당 속성의 유형을 참조하는데 사용합니다
```tsx
let s = "hello";
let n: typeof s;
```

또한 다른 유형의 연산자와 결합하여 많은 패턴을 만들 수 있습니다

```tsx
type Predicate = (x: unknown) => boolean;
type K = ReturnType<Predicate>;
```
위 예제는 함수 유형을 가져와서 반환 유형을 생성합니다 

함수 이름에 사용하려고하면 오류가 발생합니다
```tsx
function f() {
  return { x: 10, y: 3 };
}
type P = ReturnType<f>;
```

값과 타입은 다릅니다 값 f가 갖는 유형을 참조하기 위해서는

```tsx
function f() {
  return { x: 10, y: 3 };
}
type P = ReturnType<typeof f>;
```
typeof를 사용해야 합니다 

# 인덱싱된 액세스 유형
인덱싱된 엑세스 유형을 사용하여 다른 유형의 속성을 조회할 수 있습니다
```tsx
type Person = { age: number; name: string; alive: boolean };
type Age = Person["age"];
```

유니온 타입도 마찬가지로 조회할 수 있습니다
```tsx
type I1 = Person["age" | "name"];
     
// type I1 = string | number
 
type I2 = Person[keyof Person];
     
// type I2 = string | number | boolean
 
type AliveOrName = "alive" | "name";
type I3 = Person[AliveOrName];
     
// type I3 = string | boolean
```
또 다른 예로는 배열 요소의 유형을 가져 오는 데 사용할 수 있습니다 

```tsx
const MyArray = [
  { name: "Alice", age: 15 },
  { name: "Bob", age: 23 },
  { name: "Eve", age: 38 },
];
 
type Person = typeof MyArray[number];
       

type Age = typeof MyArray[number]["age"];
     
// Or
type Age2 = Person["age"];
```

인덱싱 할 때만 유횽을 사용할 수 있으므로 변수를 참조하는 const는 사용할 수 없습니다
```tsx
const key = "age";
type Age = Person[key];
```

해결 : const -> type
```tsx
type key = "age";
type Age = Person[key];
```

# 조건부 유형
조건부를 붙여서 타입에 대한 유추를 할 수 있습니다
```tsx
interface Animal {
  live(): void;
}
interface Dog extends Animal {
  woof(): void;
}
 
type Example1 = Dog extends Animal ? number : string;
        
//type Example1 = number
 
type Example2 = RegExp extends Animal ? number : string;
        
//type Example2 = string
```
이런 조건부 유형을 어디에 사용할 수 있을까요?

바로 제네릭과 함께 사용할때 유용합니다

```tsx
interface IdLabel {
  id: number /* some fields */;
}
interface NameLabel {
  name: string /* other fields */;
}
 
function createLabel(id: number): IdLabel;
function createLabel(name: string): NameLabel;
function createLabel(nameOrId: string | number): IdLabel | NameLabel;
function createLabel(nameOrId: string | number): IdLabel | NameLabel {
  throw "unimplemented";
}
```
위 예제는 오버로드를 사용한 함수인데요 이는 안좋은 결과를 초래할 수 있습니다  
1.라이브러리가 API 전체에서 동일한 종류의 선택을해야하는 경우 번거로워집니다.  
2. 새로운 유형이 처리할 수 있는 모든 경우 오버로드 수가 기하 급수적으로 증가합니다

대신 위 예제를 제네릭을 사용하여 처리할 수 있습니다
```tsx
type NameOrId<T extends number | string> = T extends number
  ? IdLabel
  : NameLabel;

function createLabel<T extends number | string>(idOrName: T): NameOrId<T> {
  throw "unimplemented";
}
 
let a = createLabel("typescript");
   
//let a: NameLabel
 
let b = createLabel(2.8);
   
//let b: IdLabel
 
let c = createLabel(Math.random() ? "hello" : 42);
//let c: NameLabel | IdLabel
```

## 조건부 유형 제약 조건
조건부 유형은 우리가 확인하는 유형에 따라 제네릭을 더욱 제한합니다 
```tsx
type MessageOf<T> = T["message"];
```
error : Type '"message"' cannot be used to index type 'T'.

message라는 속성이 T 타입에 없기 때문에 오류가 납니다 

이를 해결하려면
```tsx
type MessageOf<T extends { message: unknown }> = T["message"];
 
interface Email {
  message: string;
}
 
type EmailMessageContents = MessageOf<Email>;
```
extends를 사용하여 해당 유형을 참조하였습니다   
그러나 해당 유형이 없는 경우는 제약 조건을 밖으로 이동하고 조건부 유형을 도입하여 작업을 수행 할 수 있습니다.
```tsx
type MessageOf<T> = T extends { message: unknown } ? T["message"] : never;
 
interface Email {
  message: string;
}
 
interface Dog {
  bark(): void;
}
 
type EmailMessageContents = MessageOf<Email>;
 
type DogMessageContents = MessageOf<Dog>;
```

Dog에는 message라는 속성이 없으므로 never로 유추됩니다

또 다른 예로는 배열인지 그냥 유형인지 유츄되게 할 수 있습니다
```tsx
type Flatten<T> = T extends any[] ? T[number] : T;
 
type Str = Flatten<string[]>;

type Num = Flatten<number>;
```
배열 유형이 주어지면 인덱싱 된 엑세스를 사용하여 해당 요소의 유형을 가져옵니다.

## 조건부 유형 내에서 추론
키워드를 사용하여 유용한 도우미 유형 별칭을 작성할 수 있습니다. 예를 들어, 함수 유형에서 반환 유형을 추출할 수 있습니다.
```tsx
type GetReturnType<Type> = Type extends (...args: never[]) => infer Return
  ? Return
  : never;
 
type Num = GetReturnType<() => number>;
    
type Str = GetReturnType<(x: string) => string>;
     
type Bools = GetReturnType<(a: boolean, b: boolean) => boolean[]>;
```

여러 호출 서명이 있는 경우에는 마지막 서명에서 수행됩니다
```tsx
declare function stringOrNum(x: string): number;
declare function stringOrNum(x: number): string;
declare function stringOrNum(x: string | number): string | number;
 
type T1 = ReturnType<typeof stringOrNum>;
```

## 분배 조건부 유형
조건부 유형이 제네릭 형식에서 작동하면 유니온 유형이 주어지면 배포됩니다.
```tsx
type ToArray<Type> = Type extends any ? Type[] : never;
```
유니온 유형에 연결하면 해당 유니온의 각 맴버에 적용됩니다.
```tsx
type ToArray<Type> = Type extends any ? Type[] : never;
 
type StrArrOrNumArr = ToArray<string | number>;
```

# 매핑된 유형
매핑된 형식은 인덱스 서명에 대한 구문을 기반으로 하며, 미리 선언되지 않은 속성 유형을 선언하는 데 사용됩니다
```tsx
type OnlyBoolsAndHorses = {
  [key: string]: boolean | Horse;
};
 
const conforms: OnlyBoolsAndHorses = {
  del: true,
  rodney: false,
};
```
매핑된 형식은 주로 keyof를 통해 자주 사용하며 키를 반복하여 유형을 만드는 제네릭 유형입니다
```tsx
type OptionsFlags<Type> = {
  [Property in keyof Type]: boolean;
};
```
위 예제에서는 형식에서 모든 속성을 가져와 해당 값을 부울로 변경합니다 
```tsx
type FeatureFlags = {
  darkMode: () => void;
  newUserProfile: () => void;
};
 
type FeatureOptions = OptionsFlags<FeatureFlags>;
```
## 키를 통해 다시 매핑(as)

TypeScript 4.1 이상에서는 매핑된 유형의 절을 사용하여 매핑된 유형의 키를 다시 매핑할 수 있습니다 as를 사용합니다
```tsx
type MappedTypeWithNewProperties<Type> = {
    [Properties in keyof Type as NewKeyType]: Type[Properties]
}
```
템플릿 리터럴 형식과 같은 기능을 활용하여 이전 속성 이름에서 새 속성 이름을 만들 수 있습니다.

```tsx
type Getters<Type> = {
    [Property in keyof Type as `get${Capitalize<string & Property>}`]: () => Type[Property]
};
 
interface Person {
    name: string;
    age: number;
    location: string;
}
 
type LazyPerson = Getters<Person>;
```
조건부 유형을 통해 생성하여 키를 필터링할 수 있습니다.
```tsx
// Remove the 'kind' property
type RemoveKindField<Type> = {
    [Property in keyof Type as Exclude<Property, "kind">]: Type[Property]
};
 
interface Circle {
    kind: "circle";
    radius: number;
}
 
type KindlessCircle = RemoveKindField<Circle>;
```
조합뿐만 아니라 모든 유형의 유니온을 매핑 할 수있는 임의의 유니온을 매핑 할 수 있습니다.
```tsx
type EventConfig<Events extends { kind: string }> = {
    [E in Events as E["kind"]]: (event: E) => void;
}
 
type SquareEvent = { kind: "square", x: number, y: number };
type CircleEvent = { kind: "circle", radius: number };
 
type Config = EventConfig<SquareEvent | CircleEvent>
```
# 템플릿 리터럴 유형
템플릿 리터럴 유형은 문자열 리터럴 유형을 기반으로 하며 유니온을 통해 많은 문자열로 확장할 수 있습니다 
```tsx
type World = "world";
 
type Greeting = `hello ${World}`;
```
유니온에서도 사용됩니다 
```tsx
type EmailLocaleIDs = "welcome_email" | "email_heading";
type FooterLocaleIDs = "footer_title" | "footer_sendoff";
 
type AllLocaleIDs = `${EmailLocaleIDs | FooterLocaleIDs}_id`;
```
템플릿 리터럴의 각 보간된 위치에 대해 유니온은 교차 곱해집니다.
```tsx
type AllLocaleIDs = `${EmailLocaleIDs | FooterLocaleIDs}_id`;
type Lang = "en" | "ja" | "pt";
 
type LocaleMessageIDs = `${Lang}_${AllLocaleIDs}`;
```
일반적으로 큰 문자열 유니온에 대해 미리 생성 된 것을 사용하는 것이 좋지만 작은 경우에는 유용합니다.

## 형식의 문자열 유니온
템플릿 리터럴의 힘은 유형 내부의 정보를 기반으로 새 문자열을 정의 할 때 발생합니다.

함수에 전달 된 객체에서 호출 된 새 함수를 추가하는 경우를 고려해봅시다. 
```tsx
const passedObject = {
  firstName: "Saoirse",
  lastName: "Ronan",
  age: 26,
};

type PropEventSource<Type> = {
    on(eventName: `${string & keyof Type}Changed`, callback: (newValue: any) => void): void;
};
```
속성의 이름을 Changed로 만들고 콜백합니다 

## 템플릿 리터럴을 사용한 추론

```tsx
type PropEventSource<Type> = {
    on<Key extends string & keyof Type>
        (eventName: `${Key}Changed`, callback: (newValue: Type[Key]) => void ): void;
};
 
declare function makeWatchedObject<Type>(obj: Type): Type & PropEventSource<Type>;
 
const person = makeWatchedObject({
  firstName: "Saoirse",
  lastName: "Ronan",
  age: 26
});
 
person.on("firstNameChanged", newName => { console.log(`new name is ${newName.toUpperCase()}`);
});
```
변경에 대한 콜백은 인수를 수신해야 합니다. 템플릿 리터럴 형식을 사용하면 속성의 데이터 형식이 해당 속성의 콜백의 첫 번째 인수와 동일한 유형인지 확인 할 수 있습니다  
추론은 여러 가지 방법으로 결합 될 수 있으며, 종종 문자열을 해체하고 다른 방식으로 재구성 할 수 있습니다.

## 고유 문자열 조작 유형
```tsx
type Greeting = "Hello, world"
type ShoutyGreeting = Uppercase<Greeting>
type QuietGreeting = Lowercase<Greeting>
type Greeting = Capitalize<LowercaseGreeting>;
type UncomfortableGreeting = Uncapitalize<UppercaseGreeting>;
```
Uppercase<StringType> : 
문자열의 각 문자를 대문자 버전으로 변환합니다.

Lowercase<StringType> :
문자열의 각 문자를 소문자 등가물로 변환합니다.

Capitalize<StringType>
문자열의 첫 번째 문자를 대문자로 변환합니다.

Uncapitalize<StringType>
문자열의 첫 번째 문자를 소문자 등가물로 변환합니다.



