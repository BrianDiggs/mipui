function getUrlParams() {
  var result = {};
  location.search.substr(1).split('&').forEach(pair => {
    const [key, val] = pair.split('=');
    result[key] = val;
  });
  return result;
}

function createTheMapAndUpdateElements() {
  const gridData = state.pstate.gridData;
  state.theMap.create(gridData.from, gridData.from, gridData.to, gridData.to);
  state.theMap.updateAllCells();
}

function wireUiElements() {
  const app = document.getElementById('app');
  document.onkeydown = (keyDownEvent) => { handleKeyDownEvent(keyDownEvent); };
  app.onwheel = (wheelEvent) => { handleWheelEvent(wheelEvent); };
  app.onmousemove = (mouseEvent) => { handleMouseMoveEvent(mouseEvent); };
  document.getElementById('expandButton').onclick = () => { expandGrid(2); };
  document.getElementById('resetViewButton').onclick = () => { resetView(); };
  document.getElementById('resetGridButton').onclick = () => { resetGrid(); };
  document.getElementById('increaseBrushSize').onclick = () => {
    increaseBrushSize();
  };
  document.getElementById('decreaseBrushSize').onclick = () => {
    decreaseBrushSize();
  };
  document.getElementById('manualModeCheckbox').onchange = (e) => {
    handleManualModeChange(e.target.checked);
  }
  document.getElementsByName('tool').forEach(elem => {
    elem.onchange = (e) => { handleSelectedToolChange(elem.id); }
  });
}

function initializeFirebase() {
  var config = {
    apiKey: "AIzaSyBOHHWJ8cdnDljBKr0KlaZH-nsPLmATNOw",
    authDomain: "mipui-a13b3.firebaseapp.com",
    databaseURL: "https://mipui-a13b3.firebaseio.com",
  };
  firebase.initializeApp(config);
  firebase.database.enableLogging(true);
}

function start() {
  createTheMapAndUpdateElements();
  resetView();
  wireUiElements();
  const params = getUrlParams();
  if (params.mid) {
    firebase.database()
        .ref('/maps/' + decodeURIComponent(params.mid) + '/payload')
            .once('value', payloadRef => {
              state.load(params.mid, payloadRef.val());
            });
  }
}

initializeFirebase();
initializeContentTypes(ct, null);
const state = new State();
window.onload = () => { start(); };
