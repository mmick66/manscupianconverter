# Mancuspian Converter

This is a basic converted for Fuji's RAF (RAW) format into a PNG. 
You can download sample images to test the app [here](https://www.rawsamples.ch/index.php/en/fuji).

<p align="center"> 
  <img src="https://github.com/mmick66/manscupianconverter/blob/master/screenshot.png">
</p>

It was built using [Electron](https://electronjs.org/) and [Antd](https://ant.design/) for the UI.

## Installation

```bash
git clone https://github.com/mmick66/manscupianconverter
cd manscupianconverter
npm install
npm start
```

## Packaging into an App

This app uses `electron-builder` for compilation so put assets such as icons inside of the `build` folder

```bash
npm run release
```

Then look inside the `dist` folder of this repo for the compiled app.

## About the name and logo

The [Mancuspia](https://es.wikipedia.org/wiki/Mancuspia) are imaginary creatures invented by the Argentinian author [Julio Cortázar](https://en.wikipedia.org/wiki/Julio_Cort%C3%A1zar). An exact depiction was always left to the reader's imagination. 
