# alt:V Radio

alt:V Radio resource replaces the default GTA V vehicle radio with custom online 
radio stations.

Preview: [https://youtu.be/OLFx78yJ0nw](https://youtu.be/OLFx78yJ0nw)

## Installation

Download the resource and add it to resources folder of your server and 
add it to the `server.cfg`.

## Usage

There are currently some default stations loaded into the radio. If you 
wish to change them and add yours, go to `/server/config.mjs`. There 
you will find an array of radio stations.

### Radio Station Object format

```js
{
    name: 'Name of the radio station',
    url: 'Radio station's stream url',
    image: 'Radio station's logo image',
    volume: 60 // This is optional, default volume is 40
}
```

### In-game usage

While in a vehicle, scroll the mouse wheel while holding the Q key.

## License

[MIT](http://opensource.org/licenses/MIT)
