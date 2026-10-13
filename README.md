# SourisFinance

This app is for **my personal use**, it's not a app with complex implementations but this app is free for anyone who wants to use it.

## Installing or Testing
For Test the app just use the command below.

```bash
pnpm install

pnpm run tauri dev
```
For install this app use the command below.

```bash
pnpm run tauri build
```

The binary must be on:
```text
SourisFinance/
|--- src-tauri/
    |
    |-- target/
       |
       |-- release/
          |
          |-- budle/  <=== HERE
```

## License
MIT LICENSE. For more information read [LICENSE](LICENSE)