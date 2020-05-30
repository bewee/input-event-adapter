'use strict';

const Device = require('gateway-addon').Device;
const Event = require('gateway-addon').Event;

class InputEventDevice extends Device {
  constructor(adapter, id, event) {
    super(adapter, id);
    this.event = event;

    this['@type'] = [];
    this.name = event.name;
    this.description = `Input Event Device ${event.path}`;

    if (!this.adapter.config.devices.find((e) => e.id == this.event.path)) {
      this.adapter.config.devices.push({id: this.event.path, name: this.event.name, events: ['keydown']});
      this.adapter.saveConfig();
    }

    for (const ev of this.adapter.config.devices.find((e) => e.id == this.event.path).events) {
      if (ev == 'keydown' || ev == 'keyup' || ev == 'keypress' || ev == 'data') {
        this.addEvent(ev);
        console.log(`Add default event ${ev}`);
      } else if (ev.startsWith('keydown:') || ev.startsWith('keyup:') || ev.startsWith('keypress:')) {
        this.addEvent(ev);
        console.log(`Add key event ${ev}`);
      }
    }

    this.event.on('keydown', this.keydown.bind(this));
    this.event.on('keyup', this.keyup.bind(this));
    this.event.on('keypress', this.keypress.bind(this));
    this.event.on('data', this.data.bind(this));
  }

  keydown(info) {
    if (this.adapter.config.devices.find((e) => e.id == this.event.path).events.includes(`keydown:${info.code_name}`)) {
      this.eventNotify(new Event(this, `keydown:${info.code_name}`, `${JSON.stringify(info)} [${new Date()}]`));
      console.log(`Event notify keydown:${info.code_name}`);
    } else if (this.adapter.config.devices.find((e) => e.id == this.event.path).events.includes('keydown')) {
      this.eventNotify(new Event(this, 'keydown', `${JSON.stringify(info)} [${new Date()}]`));
      console.log('Event notify keydown');
    }
  }

  keyup(info) {
    if (this.adapter.config.devices.find((e) => e.id == this.event.path).events.includes(`keyup:${info.code_name}`)) {
      this.eventNotify(new Event(this, `keyup:${info.code_name}`, `${JSON.stringify(info)} [${new Date()}]`));
      console.log(`Event notify keyup:${info.code_name}`);
    } else if (this.adapter.config.devices.find((e) => e.id == this.event.path).events.includes('keyup')) {
      this.eventNotify(new Event(this, 'keyup', `${JSON.stringify(info)} [${new Date()}]`));
      console.log('Event notify keyup');
    }
  }

  keypress(info) {
    if (this.adapter.config.devices.find((e) => e.id == this.event.path).events.includes(`keypress:${info.code_name}`)) {
      this.eventNotify(new Event(this, `keypress:${info.code_name}`, `${JSON.stringify(info)} [${new Date()}]`));
      console.log(`Event notify keypress:${info.code_name}`);
    } else if (this.adapter.config.devices.find((e) => e.id == this.event.path).events.includes('keypress')) {
      this.eventNotify(new Event(this, 'keypress', `${JSON.stringify(info)} [${new Date()}]`));
      console.log('Event notify keypress');
    }
  }

  data(info) {
    //console.log('Event notify data');
    this.eventNotify(new Event(this, `data`, `${info} [${new Date()}]`));
  }

  run() {
    if ('dead' in this) {
      console.log(this.id, 'Already dead!');
      return;
    }
    console.log('Run!');
    this.connectedNotify(true);
  }

  stop() {
    console.log(this.id, 'Stop!');
    this.dead = true;
    this.event.exit();
  }
}

module.exports = InputEventDevice;
