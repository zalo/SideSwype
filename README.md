# [SideSwype](https://zalo.github.io/SideSwype/)

<p align="left">
  <a href="https://github.com/zalo/SideSwype/deployments/activity_log?environment=github-pages">
      <img src="https://img.shields.io/github/deployments/zalo/SideSwype/github-pages?label=Github%20Pages%20Deployment" title="Github Pages Deployment"></a>
  <a href="https://github.com/zalo/SideSwype/commits/master">
      <img src="https://img.shields.io/github/last-commit/zalo/SideSwype" title="Last Commit Date"></a>
  <!--<a href="https://github.com/zalo/SideSwype/blob/master/LICENSE">
      <img src="https://img.shields.io/github/license/zalo/SideSwype" title="License: Apache V2"></a>-->  <!-- No idea what license this should be! -->
</p>

A simple latency benchmark for sending touch events from the phone to a PC browser via WebRTC.

Just open this page up on your phone and in the browser to observe gesture transmission speeds.

May evolve into an app for using Swype-esque gestures to discretely communicate data through the fabric of your pockets.

 # Building

This demo can either be run without building (in Chrome/Edge/Opera since raw three.js examples need [Import Maps](https://caniuse.com/import-maps)), or built with:
```
npm install
npm run build
```
After building, make sure to edit the index .html to point from `"./src/main.js"` to `"./build/main.js"`.

 # Dependencies
 - [peer.js](https://peerjs.com//) (WebRTC Wrapper)
 - [esbuild](https://github.com/evanw/esbuild/) (Bundler)
