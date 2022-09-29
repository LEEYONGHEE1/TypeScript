# 클래스

## 빈 클래스
```tsx
class Point {}
```

가장 기본적인 클래스입니다.

이제부터 일부 맴버를 추가해보겠습니다

### 필드
필드 선언은 클래스에 공용 쓰기 속성을 만듭니다

```tsx
class Point {
    x:number;
    y:number;
}

const pt = new Point();
pt.x = 0;
pt.y = 0;
```
### --strictPropertyInitialization

이 설정은 생성자에서 클래스 필드를 초기화해야 하는지 여부를 제어합니다.
```tsx
class BadGreeter {
  name: string;
```
error : Property 'name' has no initializer and is not definitely assigned in the constructor.

```tsx
class GoodGreeter {
  name: string;
 
  constructor() {
    this.name = "hello";
  }
}
```

이 필드는 생성자에서 초기화했습니다  
생성자가 아닌 다른 수단을 통해 필드를 초기화하려면 **!** 연산자를 사용할 수 있습니다.
```tsx
class OKGreeter {
  // Not initialized, but no error
  name!: string;
}
```

### readonly

필드에서 수정자에 접두사가 붙을 수 있습니다. ``readonly``를 사용하면 생성자 외부 필드에 대한 할당이 방지됩니다.
```tsx
class Greeter {
  readonly name: string = "world";
 
  constructor(otherName?: string) {
    if (otherName !== undefined) {
      this.name = otherName;
    }
  }
 
  err() {
    this.name = "not ok";
}
const g = new Greeter();
g.name = "also not ok";
```

### 생성자

클래스 생성자는 함수와 유사합니다. 타입 주석, 기본값 및 오버로드가 있는 매개 변수를 추가할 수 있습니다.
```tsx
class Point {
  x: number;
  y: number;
 
  // Normal signature with defaults
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }
}
```
```tsx
class Point {
  // Overloads
  constructor(x: number, y: string);
  constructor(s: string);
  constructor(xs: any, y?: any) {
    // TBD
  }
}
```
클래스 생성자와 함수 서명간에는 차이점이 있습니다.
- 생성자는 타입 매개 변수를 가질 수 없습니다.
- 생성자는 반환 유형 주석을 가질 수 없습니다.

### super
자바 스크립트에서와 마찬가지로 기본 클래스가 있는 경우 맴버를 사용하기 전에 생성자 본문을 호출해야합니다.

```tsx
class Base {
  k = 4;
}
 
class Derived extends Base {
  constructor() {
    // Prints a wrong value in ES5; throws exception in ES6
    console.log(this.k);
    super();
  }
}
```
에러 : super() 사용 전에 this를 썼음 

해결 : super()를 먼저 호출
```tsx
class Base {
  k = 4;
}
 
class Derived extends Base {
  constructor() {
    super();
    // Prints a wrong value in ES5; throws exception in ES6
    console.log(this.k);
    
  }
}
```

### 방법
클래스의 함수 속성을 메서드라고 합니다. 메서드는 함수 및 생성자와 동일한 형식 주석을 모두 사용할 수 있습니다.
```tsx
class Point {
  x = 10;
  y = 10;
 
  scale(n: number): void {
    this.x *= n;
    this.y *= n;
  }
}
```

메서드 본문 내에서는 를 통해 필드 및 기타 메서드에 액세스하는 것이 여전히 필수입니다. 메서드 본문의 정규화되지 않은 이름은 항상 둘러싸는 범위의 ``this``를 참조합니다.
```tsx
let x: number = 0;
 
class C {
  x: string = "hello";
 
  m() {
    // This is trying to modify 'x' from line 1, not the class property
    this.x = "world";
  }
}
```

## 게터 / 세터
클래스에는 접근자가 있을 수도 있습니다.
```tsx
class C {
  _length = 0;
  get length() {
    return this._length;
  }
  set length(value) {
    this._length = value;
  }
}
```
게터(getter)와 세터(setter)를 사용하지 않는 경우와 동일하게 동작하지만, 게터(getter)와 세터(setter) 내부에 로직을 작성하여 반복적인 작업을 피할 수 있습니다.

TypeScript 4.3부터는 가져오기 및 설정을 위해 서로 다른 유형의 접근자를 가질 수 있습니다.
```tsx
class Thing {
  _size = 0;
 
  get size(): number {
    return this._size;
  }
 
  set size(value: string | number | boolean) {
    let num = Number(value);
 
    // Don't allow NaN, Infinity, etc
 
    if (!Number.isFinite(num)) {
      this._size = 0;
      return;
    }
 
    this._size = num;
  }
}
```

## 인덱스 서명
클래스는 인덱스 서명을 선언할 수 있습니다. 이것은 다른 객체 유형에 대한 인덱스 서명과 동일하게 작동합니다.
```tsx
class MyClass {
  [s: string]: boolean | ((s: string) => boolean);
 
  check(s: string) {
    return this[s] as boolean;
  }
}
```

## 클래스 상속
객체 지향 기능을 가진 다른 언어와 마찬가지로 JavaScript의 클래스는 기본 클래스에서 상속받을 수 있습니다.

- implements 절
implements을 사용하여 클래스가 특정 룰을 충족하는지 확인할 수 있습니다.
```tsx
interface Pingable {
  ping(): void;
}
 
class Sonar implements Pingable {
  ping() {
    console.log("ping!");
  }
}
 
class Ball implements Pingable {
      ping() {
    console.log("pong!");
  }
}
```
클래스는 또한 여러 인터페이스를 구현할 수 있습니다 (예 : .class C implements A, B {
```tsx
interface Checkable {
  check(name: string): boolean;
}

class NameChecker implements Checkable {
  check(s) {

    // Notice no error here
    return s.toLowercse() === "ok";
                
  }
}
```
check(s)가 name타입으로 유추될 것이라 생각할 수 있지만 그렇지 않습니다.

```tsx
interface A {
  x: number;
  y?: number;
}
class C implements A {
  x = 0;
}
const c = new C();
c.y = 10;
```

에러 : Property 'y' does not exist on type 'C'.

또한 정의되지 않은 y는 쓸 수 없습니다.

## extends 절

클래스는 기본 클래스에서 가져올 수 있습니다.
파생 클래스에는 기본 클래스의 모든 속성과 메서드가 있으면 추가 맴버도 정의됩니다.

```tsx
class Animal {
  move() {
    console.log("Moving along!");
  }
}
 
class Dog extends Animal {
  woof(times: number) {
    for (let i = 0; i < times; i++) {
      console.log("woof!");
    }
  }
}
 
const d = new Dog();
// Base class method
d.move();
// Derived class method
d.woof(3);
```

### 메서드 재정의
파생 클래스는 기본 클래스 필드 또는 속성을 재정의할 수도 있습니다.  
타입스크립트는 파생 클래스가 항상 기본 클래스의 하위 유형임을 적용합니다.

예를 들어 메서드를 재정의하는 법적 방법은 다음과 같습니다.
```tsx
class Base {
  greet() {
    console.log("Hello, world!");
  }
}
 
class Derived extends Base {
  greet(name?: string) {
    if (name === undefined) {
      super.greet();
    } else {
      console.log(`Hello, ${name.toUpperCase()}`);
    }
  }
}
 
const d = new Derived();
d.greet();
d.greet("reader");
```

서명을 따르지 않을 경우에는 에러가 납니다.
```tsx
class Base {
  greet() {
    console.log("Hello, world!");
  }
}
 
class Derived extends Base {
  // Make this parameter required
  greet(name: string) {

    console.log(`Hello, ${name.toUpperCase()}`);
  }
}
```

error : Property 'greet' in type 'Derived' is not assignable to the same property in base type 'Base'.
  Type '(name: string) => void' is not assignable to type '() => void'.

오류에도 불구하고 이 코드를 컴파일하면 샘플이 충돌합니다.
```tsx
const b: Base = new Derived();
// Crashes because "name" will be undefined
b.greet();
```

### 초기화 순서

자바스크립트 클래스가 초기화되는 순서를 알아봅시다.
```tsx
class Base {
  name = "base";
  constructor() {
    console.log("My name is " + this.name);
  }
}
 
class Derived extends Base {
  name = "derived";
}
 
// Prints "base", not "derived"
const d = new Derived();
```

지금 정의 된 클래스의 초기화 순서는 다음과 같습니다.
1. 기본 클래스 필드가 초기화됩니다.
2. 기본 클래스 생성자가 실행됩니다.
3. 파생된 클래스 필드가 초기화됩니다.
4. 파생 클래스 생성자가 실행됩니다.

즉, 파생 클래스 필드 초기화가 아직 실행되지 않았기 때문에 기본 클래스 생성자가 자체 생성자 중에 자체 값을 보았습니다.

## 회원 가시성
TypeScript를 사용하여 특정 메서드 또는 속성이 클래스 외부의 코드에 표시되는지 여부를 제어할 수 있습니다.
public , protected, private

- public : 클래스 맴버의 기본 표시 화면입니다. public은 어디서나 엑세스할 수 있습니다.
```tsx
class Greeter {
  public greet() {
    console.log("hi!");
  }
}
const g = new Greeter();
g.greet();
```

이미 기본 가시성 수정자이기에 따로 쓸 필요는 없지만, 타일/가독성을 이유로 써줄 수 있습니다.

- protected : 선언 된 클래스의 하위 클래스에만 표시됩니다.

```tsx
class Greeter {
  public greet() {
    console.log("Hello, " + this.getName());
  }
  protected getName() {
    return "hi";
  }
}
 
class SpecialGreeter extends Greeter {
  public howdy() {
    // OK to access protected member here
    console.log("Howdy, " + this.getName());
  }
}
const g = new SpecialGreeter();
g.greet(); // OK

g.getName();
//Property 'getName' is protected and only accessible within class 'Greeter' and its subclasses.
```

### 회원 노출 protected
파생 클래스는 기본 클래스의 계약을 따라야 하지만 더 많은 기능을 가진 기본 클래스의 하위 유형을 노출하도록 ``protected``를 사용하여 선택할 수 있습니다.

```tsx
class Base {
  protected m = 10;
}
class Derived extends Base {
  // No modifier, so default is 'public'
  m = 15;
}
const d = new Derived();
console.log(d.m); // OK
```

- private : 하위 클래스에도 맴버에 대한 엑세스를 허용하지 않습니다.
```tsx
class Base {
  private x = 0;
}
const b = new Base();
// Can't access from outside the class
console.log(b.x);
// Property 'x' is private and only accessible within class 'Base'.
```
```tsx
class Derived extends Base {
  showX() {
    // Can't access in subclasses
    console.log(this.x);
// Property 'x' is private and only accessible within class 'Base'.
  }
}
```

### 인스턴스 간 private

TypeScript는 private 교차 인스턴스 액세스를 허용합니다.
```tsx
class A {
  private x = 10;
 
  public sameAs(other: A) {
    // No error
    return other.x === this.x;
  }
}
```

하지만 클래스 외에서 쓰게 된다면 당연히 허용되지 않습니다.
```tsx
class MySafe {
  private secretKey = 12345;
}
 
const s = new MySafe();
 
// Not allowed during type checking
console.log(s.secretKey);
// Property 'secretKey' is private and only accessible within class 'MySafe'.
 
// OK
console.log(s["secretKey"]);
```

타입스크립트와 달리 자바스크립트의 개인 필드는 컴파일 후에도 비공개로 유지되며 대괄호 표기법 엑세스와 같이 ``#``을 사용하면 비공개로 유지됩니다.
```tsx
class Dog {
  #barkAmount = 0;
  personality = "happy";
 
  constructor() {}
}
```
```tsx
"use strict";
class Dog {
    #barkAmount = 0;
    personality = "happy";
    constructor() { }
}
```

## 정적 맴버
정적 맴버는 클래스의 특정 인스턴스와 연결되지 않습니다. 클래스 생성자 객체 자체를 통해 실행할 수 있습니다.
```tsx
class MyClass {
  static x = 0;
  static printX() {
    console.log(MyClass.x);
  }
}
console.log(MyClass.x);
MyClass.printX();
```

정적 맴버인 static 또한 동일하게 ``public protected private``를 적용시킬 수 있습니다.
```tsx
class MyClass {
  private static x = 0;
}
console.log(MyClass.x);
```

정적 맴버도 상속됩니다.
```tsx
class Base {
  static getGreeting() {
    return "Hello world";
  }
}
class Derived extends Base {
  myGreeting = Derived.getGreeting();
}
```

### 특수한 정적 이름  
클래스 자체는 호출할 수 있는 함수이기 때문에 특정 이름을 사용할 수 없습니다.  
ex) name length call
```tsx
class S {
  static name = "S!";
}
```
에러 : name이 Function.name과 충돌합니다.

### 그러면 정적 클래스는 있을까?

타입스크립트 및 자바스크립트에는 static class가 없습니다.  
이러한 구문은 모든 데이터와 함수가 클래스 내에 있어야하기 때문에 존재합니다.  
예를 들어, 일반 객체가 작업을 수행하기 때문에 타입스크립트에서 정적 클래스 구문이 필요하지 않습니다.
```tsx
// Unnecessary "static" class
class MyStaticClass {
  static doSomething() {}
}
 
// Preferred (alternative 1)
function doSomething() {}
 
// Preferred (alternative 2)
const MyHelperObject = {
  dosomething() {},
};
```

## static 클래스의 블록

정적 블록을 사용하면 포함 된 클래스 내의 개인 필드에서 실행할 수 있는 자체 범위가 있는
일련의 명령문을 작성할 수 있습니다.
```tsx
class Foo {
    static #count = 0;
 
    get count() {
        return Foo.#count;
    }
 
    static {
        try {
            const lastInstances = loadLastInstances();
            Foo.#count += lastInstances.length;
        }
        catch {}
    }
}
```

## 제네릭 클래스
클래스에도 인스턴스화 되면 해당 형식 매개 변수는 함수 호출에서와 동일한 방식으로 유추됩니다.
```tsx
class Box<Type> {
  contents: Type;
  constructor(value: Type) {
    this.contents = value;
  }
}
 
const b = new Box("hello!");
     
//const b: Box<string>
```

클래스는 인터페이스와 동일한 방식으로 제네릭 제약 조건과 기본값을 사용할 수 있습니다.

### 정적 맴버에 매개 변수 입력
이 코드는 합벅적이지 않습니다.

```tsx
class Box<Type> {
  static defaultValue: Type;
//Static members cannot reference class type parameters.
}
```

정적 맴버는 클래스 유형 매개 변수를 참조할 수 없습니다.

## this 클래스의 런타임
타입스크립트는 자바스크립트의 런타임 동작을 변경하지 않으면 자바스크립트에는 몇가지 도특한 런타임을 갖습니다.

```tsx
class MyClass {
  name = "MyClass";
  getName() {
    return this.name;
  }
}
const c = new MyClass();
const obj = {
  name: "obj",
  getName: c.getName,
};
 
// Prints "obj", not "MyClass"
console.log(obj.getName());
```
간단히 말해서, 비노적으로 함수 내부의 값은 함수가 호출 된 방법에 따라 다릅니다. 위 예제에서는 함수가 참조를 통해 호출되었기 때문에 함수의 값은 클래스 인스턴스가 아닌 값입니다.  
 TypeScript는 이러한 종류의 오류를 완화하거나 방지하는 몇 가지 방법을 제공합니다.
 ### 화살표 함수
 컨텍스트를 잃는 방식으로 자주 호출되는 함수가 있는경우 메서드 정의 대신 화살표 함수 속성을 사용하는 것이 좋습니다.
 ```tsx
 class MyClass {
  name = "MyClass";
  getName = () => {
    return this.name;
  };
}
const c = new MyClass();
const g = c.getName;
// Prints "MyClass" instead of crashing
console.log(g());
```
여기에는 몇 가지 절충안이 있습니다.
- 타입스크립트로 확인되지 않은 코드의 경우에도 런타임에 값이 올바르게 보장됩니다.  
- 이것은 각 클래스 인스턴스가 이런 식으로 정의 된 각 함수 자체 사본을 갖기 떄문에 더 많은 메모리를 사용합니다.
- 프로토 타입 체인에 기본 클래스 메서드를 가져 오는 항목이 없기 때문에 파생 클래스에서 사용할 수 없습니다.

### this 매개 변수
메서드 또는 함수 정의에서 명명된 초기 매개 변수는 타입스크립트에서 특별한 의미를 갖습니다. this 매개 변수는 컴파일 중에 지워집니다.
```tsx
// TypeScript input with 'this' parameter
function fn(this: SomeType, x: number) {
  /* ... */
}
```
```tsx
// JavaScript output
function fn(x) {
  /* ... */
}
```
타입스크립트는 매개 변수가 있는 함수 호출이 올바른 컨텍스트로 수행되었는지 확인합니다. 화살표 함수를 사용하는 대신 메서드 정의에 매개 변수를 추가하여 메서드가 올바르게 호출되도록 정적으로 적용할 수 있습니다.
```tsx
class MyClass {
  name = "MyClass";
  getName(this: MyClass) {
    return this.name;
  }
}
const c = new MyClass();
// OK
c.getName();
 
// Error, would crash
const g = c.getName;
console.log(g());
```

에러 : void 유형의 this 컨텍스트를 MyClass 유형의 메서드 this에 할당할 수 없습니다.

이 방법은 화살표 함수 접근 방긷의 반대 절충안을 만듭니다.

- 자바스크립트 호출자는 여전히 클래스 메서드를 깨닫지 못하고 잘못 사용할 수 있습니다.
- 클래스 정의 당 하나의 함수 만 할당되며 클래스 인스턴스 당 하나의 함수가 할당되지 않습니다.
- 기본 메소드 정의는 super을 통해 호출 할 수 있습니다.

## this 형식

클래스에서 호출되는 특수 유형은 현재 클래스의 타입을 동적으로 참조합니다.
```tsx
class Box {
  contents: string = "";
  set(value: string) {
  
//(method) Box.set(value: string): this
    this.contents = value;
    return this;
  }
}
```
여기서 반환 유형을 다음과 같은 하위 클래스를 만들어 보겠습니다.
```tsx
class ClearableBox extends Box {
  clear() {
    this.contents = "";
  }
}
 
const a = new ClearableBox();
const b = a.set("hello");
```

const b: ClearableBox

 매개 변수 유형 주석에도 사용할 수 있습니다.

```tsx
class Box {
  content: string = "";
  sameAs(other: this) {
    return other.content === this.content;
  }
}
```

이것은 쓰기와 다릅니다. 파생 클래스가 있는 경우 해당 메서드는 동일한 파생 클래스의 다른 인스턴스만 허용합니다.
```tsx
class Box {
  content: string = "";
  sameAs(other: this) {
    return other.content === this.content;
  }
}
 
class DerivedBox extends Box {
  otherContent: string = "?";
}
 
const base = new Box();
const derived = new DerivedBox();
derived.sameAs(base);
```

에러 : 'Box' 형식의 인수를 'DerivedBox' 형식의 매개 변수에 할당할 수 없습니다.
속성 'otherContent'가 'Box' 유형에는 없지만 'DerivedBox' 유형에는 필요합니다.

### this - 기반의 타입 가드
클래스 및 인터페이스의 메소드에 대한 반환 위치에서 사용할 수 있습니다.
```tsx
class FileSystemObject {
  isFile(): this is FileRep {
    return this instanceof FileRep;
  }
  isDirectory(): this is Directory {
    return this instanceof Directory;
  }
  isNetworked(): this is Networked & this {
    return this.networked;
  }
  constructor(public path: string, private networked: boolean) {}
}
 
class FileRep extends FileSystemObject {
  constructor(path: string, public content: string) {
    super(path, false);
  }
}
 
class Directory extends FileSystemObject {
  children: FileSystemObject[];
}
 
interface Networked {
  host: string;
}
 
const fso: FileSystemObject = new FileRep("foo/bar.txt", "foo");
 
if (fso.isFile()) {
  fso.content;
  
//const fso: FileRep
} else if (fso.isDirectory()) {
  fso.children;
  
//const fso: Directory
} else if (fso.isNetworked()) {
  fso.host;
  
//const fso: Networked & FileSystemObject
}
```

위 사례는 특정 필드에 대한 게으른 유효성 검사를 허용하는 것입니다. 예를들어 undefined hasValue 인 경우 true로 확인되었을때 상자 안에 들어 있는 값에서 a를 제거합니다.
```tsx
class Box<T> {
  value?: T;
 
  hasValue(): this is { value: T } {
    return this.value !== undefined;
  }
}
 
const box = new Box();
box.value = "Gameboy";
 
box.value;
     
//(property) Box<unknown>.value?: unknown
 
if (box.hasValue()) {
  box.value;
       
//(property) value: unknown
}
```

## 매개 변수 속성

타입스크립트는 생성자 매개 변수를 이름과 값이 같은 클래스 속성으로 변환하기위한 특수 구문을 제공합니다. 이를 매개 변수 속성이라고하며 생성자 인수 앞에 가시성 수정자 또는 결과 필드는 해당 수정자를 가져옵니다.
```tsx
class Params {
  constructor(
    public readonly x: number,
    protected y: number,
    private z: number
  ) {
    // No body necessary
  }
}
const a = new Params(1, 2, 3);
console.log(a.x);
             
//(property) Params.x: number
console.log(a.z);
```
속성 'z'는 비공개이며 클래스 'Params' 내에서만 액세스할 수 있습니다.

## 클래스 표현식 
클래스 표현식은 클래스 선언과 매우 유사합니다. 유일한 차이점은 클래스 표현식에는 이름이 필요하지 않지만 바인딩 된 식별자를 통해 클래스 표현식을 참조할 수 있다는 것입니다.
```tsx
const someClass = class<Type> {
  content: Type;
  constructor(value: Type) {
    this.content = value;
  }
};
 
const m = new someClass("Hello, world");
```

## abstract 수업 및 회원

타입스크립트의 클래스, 매서드 및 필드는 추상적일 수 있습니다.  
추상 메소드 또는 추상 필드는 구현이 제공되지 않은 메소드입니다. 이러한 맴버는 추상 클래스 내에 존재해야 하며, 이 클래스는 직접 인스턴스화할 수 없습니다.

추상 클래스의 역할은 모든 추상 맴버를 구현하는 서브 클래스의 기본 클래스 역할을 하는 것입니다. 클래스에 추상적인 맴버가 없으면 구체적이라고 합니다.
```tsx
abstract class Base {
  abstract getName(): string;
 
  printName() {
    console.log("Hello, " + this.getName());
  }
}
 
const b = new Base();
```

error : Cannot create an instance of an abstract class.

추상 클래스는 인스턴스화할 수 없기때문에 에러가 납니다.
대신 파생 클래스를 만들고 추상 맴버를 구현해야합니다.
```tsx
class Derived extends Base {
  getName() {
    return "world";
  }
}
 
const d = new Derived();
d.printName();
```

기본 클래스의 추상 맴버를 구현하는 것을 잊어 버리면 오류가 발생합니다.
```tsx
class Derived extends Base {
    // forgot to do anything
}
```

### 추상 사명 구성
때로는 추상 클래스에서 파생 된 클래스의 인스턴스를 생성하는 클래스 생성자 함수를 받아들이려고합니다.
```tsx
function greet(ctor: typeof Base) {
  const instance = new ctor();
//Cannot create an instance of an abstract class.
  instance.printName();
}
```
타입스크립트는 추상 클래스를 인스턴스화하여고 한다면 올바르게 알려줍니다.
```tsx
// Bad!
greet(Base);
```
대신 구문 서명으로 무언가를 받아들이는 함수를 작성하려고 합니다.
```tsx
function greet(ctor: new () => Base) {
  const instance = new ctor();
  instance.printName();
}
greet(Derived);
greet(Base);
```
에러 : 'type of Base' 형식의 인수는 'new() => Base' 형식의 매개 변수에 할당할 수 없습니다.
추상 생성자 유형을 추상 생성자 유형이 아닌 생성자 유형에 할당할 수 없습니다.

타입스크립트는 어떤 클래스의 생성자 함수를 호출 할 수 있는지에 대해 올바르게 알려줍니다. 

## 클래스 간의 관계

대부분의 경우 타입스크립트의 클래스는 다른 형식과 동일하게 구조적으로 비교됩니다.
예를 들어, 이 두 클래스는 동일하기 때문에 서로 대신하여 사용할 수 있습니다.
```tsx
class Point1 {
  x = 0;
  y = 0;
}
 
class Point2 {
  x = 0;
  y = 0;
}
 
// OK
const p: Point1 = new Point2();
```

마찬가지로 클래스 간의 하위 유형 관계는 명시적 상속이 없더라도 존재합니다.
```tsx
class Person {
  name: string;
  age: number;
}
 
class Employee {
  name: string;
  age: number;
  salary: number;
}
 
// OK
const p: Person = new Employee();
```

빈 클래스에는 맴버가 없습니다. 구조 유형 시스템에서 맴버가 없는 유형은 일반적으로 다른 유형의 슈퍼 유형입니다. 따라서 빈 클래스를 작성하지 마세요, 그 대신 무엇이든 사용할 수 있습니다.
```tsx
class Empty {}
 
function fn(x: Empty) {
  // can't do anything with 'x', so I won't
}
 
// All OK!
fn(window);
fn({});
fn(fn);
```