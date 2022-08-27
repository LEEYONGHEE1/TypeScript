# 모듈

## 타입스크립트에서 모듈이란?

ES6부터 모듈을 지원합니다  
모듈은 파일 자체 범위내에서 실행되며  
모듈 내 선언된 변수, 함수, 클래스 등을 명시적으로 내보내지 않는 이상  
모듈 외부에서 접근할 수 없음을 의미합니다.  
반대로 다른 모듈에서 내보낸  변수, 함수, 클래스, 인터페이스 등을 사용하려면 불러 와야 합니다.

## 비모듈
자바스크립트에서는 `export` , `await` 가 들어있지 않은 파일은 모두 비모듈입니다.

만약
```tsx
export {};
```
다음줄에 `export` 를 추가하면
아무 것도 내보내지 않는 모듈이 됩니다.

## 타입스크립트의 모듈 
타입스크립트에서 모듈 기반 코드를 작성할때 고려해야 할 세 가지 주요 사항이 있습니다.  
1. 구문 : 어떤 구문을 사용할 것인지  
2. 모듈 해석 : 모듈 이름(또는 경로)와 디스크의 파일 간의 관계  
3. 모듈 출력 대상 : 방출 된 자바스크립트의 모듈의 모양  

### ES 모듈 구문
파일은 `export` , `default` 를 통해 내보낼 수 있습니다.
```tsx
// @filename: hello.ts
export default function helloWorld() {
  console.log("Hello, world!");
}
```
export default : default 로 선언된 모듈은 하나의 파일에서 단 하나의 변수 또는 클래스 등등만 export 할 수 있습니다.

```tsx
import helloWorld from "./hello.js";
helloWorld();
```
가져올때는 `import` 를 사용합니다.

```tsx
// @filename: maths.ts
export var pi = 3.14;
export let squareTwo = 1.41;
export const phi = 1.61;
 
export class RandomNumberGenerator {}
 
export function absolute(num: number) {
  if (num < 0) return num * -1;
  return num;
}
```

기본 내보내기 외에도 생략하여 변수와 함수를 두 개 이상 내보낼 수 있습니다.

```tsx
import { pi, phi, absolute } from "./maths.js";
 
console.log(pi);
const absPhi = absolute(phi);
```
`import`구문을 통해 다른 파일에서 사용할 수 있습니다.

### 추가 가져오기 구문
가져오기는 `as` 를 사용하여 이름을 바꿀 수 있습니다.
```tsx
import { pi as π } from "./maths.js";
 
console.log(π);
```
위의 구문을 혼합하여 일치시킬 수 있습니다.
```tsx
// @filename: maths.ts
export const pi = 3.14;
export default class RandomNumberGenerator {}
 
// @filename: app.ts
import RandomNumberGenerator, { pi as π } from "./maths.js";
 
RandomNumberGenerator;
 
console.log(π);
```
`as` 를 사용하여 내보낸 모든 개체를 가져와 단일 네임 스페이스에 넣을 수 있습니다.
```tsx
// @filename: app.ts
import * as math from "./maths.js";
 
console.log(math.pi);
const positivePhi = math.absolute(math.phi);
```

`import` 를 통해 파일을 가져올 수 있으며 현재 모듈에 변수를 포함하지 않을 수 있습니다.
```tsx
// @filename: app.ts
import "./maths.js";
 
console.log("3.14");
```

위 경우에는 아무 것도 하지 않았습니다.그러나 모든 코드가 평가되어 다른 개체에 영향을 미치는 부작용이 발생할 수 있습니다.

### 타입 스크립트 특정 ES 모듈 구문
```tsx
// @filename: animal.ts
export type Cat = { breed: string; yearOfBirth: number };
 
export interface Dog {
  breeds: string[];
  yearOfBirth: number;
}
 
// @filename: app.ts
import { Cat, Dog } from "./animal.js";
type Animals = Cat | Dog;
```

타입스크립에서는 타입을 가져오기를 선언하기 위한 두 가지 방법으로 구문을 확장 했습니다.

타입 만 가져올 수 있는 import 예제입니다.
```tsx
// @filename: animal.ts
export type Cat = { breed: string; yearOfBirth: number };

export type Dog = { breeds: string[]; yearOfBirth: number };
export const createCatName = () => "fluffy";
 
// @filename: valid.ts
import type { Cat, Dog } from "./animal.js";
export type Animals = Cat | Dog;
 
// @filename: app.ts
import type { createCatName } from "./animal.js";
const name = createCatName();
```
TypeScript 4.5에서는 가져온 참조가 타입임을 나타내기 위해 개별 가져오기에 접두사를 붙일 수도 있습니다.

```tsx
// @filename: app.ts
import { createCatName, type Cat, type Dog } from "./animal.js";
 
export type Animals = Cat | Dog;
const name = createCatName();
```

### CommonJS 동작을 사용하는 ES 모듈 구문

TypeScript에는 CommonJS 및 AMD와 직접 관련이있는 ES 모듈 구문이 있습니다.  
CommonJS에서는 ES 모듈에서 사용했던 방법과는 다른 `require` 을 사용합니다.
```tsx
import fs = require("fs");
const code = fs.readFileSync("hello.ts", "utf8");
```

## 공통 JS 구문

CommonJS는 npm의 대부분의 모듈이 전달되는 형식입니다. 
위의 ES 모듈 구문을 사용하여 작성하는 경우에도 CommonJS 구문의 작동 방식을 간략하게 이해하면 디버깅을 더 쉽게 할 수 있습니다.

### 내보내기

식별자는 전역 호출된 `module.exports` 를 통해 내보내집니다.
```tsx
function absolute(num: number) {
  if (num < 0) return num * -1;
  return num;
}
 
module.exports = {
  pi: 3.14,
  squareTwo: 1.41,
  phi: 1.61,
  absolute,
};
```
그런 다음 `require` 문을 통해 가져올 수 있습니다.
```tsx
const maths = require("maths");
maths.pi;
```
또는 자바 스크립트의 구조 분해를 통해 조금 단순화 할 수 있습니다.
```tsx
const { squareTwo } = require("maths");
squareTwo;
```

## 타입스크립트의 모듈 출력 옵션

내보낸 자바스크립트의 출력에 영향을 주는 두 가지 옵션이 있습니다.

1. 어떤 JS 기능이 하위 레벨링 되었는지 그리고 어떤 JS 기능이 그대로 유지되는지를 결정하는 대상입니다.

2. 모듈이 서로 상호 작용하는 데 사용되는 코드를 결정하는 모듈

모듈 간의 모든 통신은 모듈 로더를 통해 이루어지며 컴파일러 옵션 모듈은 어떤 모듈이 사용되는지 결정합니다. 런타임에 모듈 로더는 모듈을 실행하기 전에 모듈의 모든 종속성을 찾아 실행하는 작업을 담당합니다.

- ES2020
```tsx
import { valueOfPi } from "./constants.js";
export const twoPi = valueOfPi * 2;
```

- CommonJS
```tsx
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.twoPi = void 0;
const constants_js_1 = require("./constants.js");
exports.twoPi = constants_js_1.valueOfPi * 2;
```
- UMD
```tsx
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./constants.js"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.twoPi = void 0;
    const constants_js_1 = require("./constants.js");
    exports.twoPi = constants_js_1.valueOfPi * 2;
});
 ```

 ## 타입스크립트 네임스페이스
 타입스크립트에는 ES 모듈 표준보다 앞선 자체 모듈 형식이 있습니다. 이 구문에는 복잡한 정의 파일을 만드는 데 유용한 기능이 많이 있으며 DefinitelyTyped에서 여전히 활발하게 사용됩니다. 더 이상 사용되지 않지만 네임 스페이스의 대부분의 기능은 ES 모듈에 존재하며이를 사용하여 JavaScript의 방향에 맞추는 것이 좋습니다.
