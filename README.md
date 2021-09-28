**krix/devtool-connector** - a library which provides an interface to connect Krix DevTool with packages from Krix ecosystem. It's an independent part of Krix ecosystem.

# Installation
```
npm install -S @krix/devtool-plugin
```

# Introduction
## What for?
How to get value from Krix stores? Common pattern to read some data from variable - add console log. Some developers're debugging app using DevTool debugger. But what happens when you know about specialized tool which allows to read data from Krix stors in realtime? Yes, it exists and this package connect your Krix store with Krix DevTool application. 

## Setup
You may find this hard to believe but connecting your Krix store with Krix DevTool application takes 4 code lines. Let's go look at them:

```typescript
// user.resource-store.ts
import * as KrixDevToolConnector from '@krix/devtool-connector';
import { stateStore } from './state.store.ts';

// some code...

const krixDevToolConnector = await KrixDevToolConnector.getConnector();
krixDevToolConnector.connectStateStore('main', stateStore);
```

And it's all. Your `stateStore` is connected to Krix DevTool application in your DevTool.