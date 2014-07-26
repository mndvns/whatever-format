
# whatever-format

  Liberally accept yaml, ini, and json file formats.

## API

### decode(string)

  Decode the yaml/ini/json `string` into a nested object.

### readFile(path, fn)

  Read file at `path` and call `fn` with decoded data.

### readFileSync(path)

  Read file at `path` synchronously and return decoded data.

## License

  MIT
