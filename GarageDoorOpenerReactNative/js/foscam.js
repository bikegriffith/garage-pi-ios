import  { BASE_URL_WITH_AUTH } from '../config';
const STOP_DELAY = 1000;
const PRESET_MAP = {
  '1' : '31',
  '2' : '33',
  '3' : '35',
  '4' : '37',
  '5' : '39',
  '6' : '41',
  '7' : '43',
  '8' : '45',
  '9' : '47',
  '10' : '479'
}


export default class Foscam {
  constructor(id) {
    this.id = id;
  }

  left(autostop = true) {
    this.processCommand('6');
    autostop && this.afterCommandRequest();
  }

  right(autostop = true) {
    this.processCommand('4');
    autostop && this.afterCommandRequest();
  }

  up(autostop = true) {
    this.processCommand('0');
    autostop && this.afterCommandRequest();
  }

  down(autostop = true) {
    this.processCommand('2');
    autostop && this.afterCommandRequest();
  }

  upLeft(autostop = true) {
    this.processCommand('91');
    autostop && this.afterCommandRequest();
  }

  upRight(autostop = true) {
    this.processCommand('90');
    autostop && this.afterCommandRequest();
  }

  downLeft(autostop = true) {
    this.processCommand('93');
    autostop && this.afterCommandRequest();
  }

  downRight(autostop = true) {
    this.processCommand('92');
    autostop && this.afterCommandRequest();
  }

  stop() {
    this.processCommand('1');
  }

  center() {
    this.processCommand('25');
  }

  afterCommandRequest() {
    this.stopTimeout = setTimeout(() => this.stop(), STOP_DELAY);
  }

  irOn() {
    this.processCommand('95');
  }

  irOff() {
    this.processCommand('94');
  }

  gotoPreset(presetNumber) {
    if (presetNumber in PRESET_MAP) {
      this.processCommand(PRESET_MAP[presetNumber]);
    }
  }

  processCommand(commandNum) {
    clearTimeout(this.stopTimeout);
    return fetch(`${BASE_URL_WITH_AUTH}/${this.id}.control?command=${commandNum}`);
  }
}
