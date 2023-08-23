# jest-svg-transformer

transform svgs for for jest+react to declutter snapshots

Very useful with react-svg-loader. This allows you to import
svgs directly into your react components, but still have nice snapshots.

Using enzyme's shallow rendering, for example:

```js
import React from 'react';
import MySvg from '../images/an-image.svg';

function MyComponent() {
    return (
        <div>
            <MySvg style={{color: 'blue'}}/>
        </div>
    );
}
```

will result in a snapshot that looks like this:

```
<div>
    <SvgAnImage style={{color: 'blue'}} />
</div>
```

# usage

This works with both enzyme and react-test-renderer.

Configure jest:

```json
{
    "jest": {
        "transform": {
            "^.+\\.jsx?$": "babel-jest",
            "^.+\\.svg$": "jest-svg-transformer"
        }
    }
}
```

