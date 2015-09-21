# Install
```
npm install
```

# Run

`node file.js params`:

## getAccountStatus.js

**Show account status**

Required `accounts.json` like this:
```
{
	"Character Name First" : {
		"keyID" : "",
		"vCode"	: ""
	},
    "Character Name Second" : {
        "keyID" : "",
        "vCode"	: ""
    }

}
```

## getPortrait.js

**Download character portrait** to folder `./images`

`node getPortrait.js "Character Name" imagesize`

Imagesize can be 1024, 512, 256

## getServerStatus.js

**Displays EVE Tranquility server status**
