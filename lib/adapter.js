'use strict';

const Adapter = require('gateway-addon').Adapter;
const Database = require('gateway-addon').Database;
const manifest = require('../manifest.json');
const Device = require('./device');
const listInputEvents = require('./evtestlib');

class InputEventAdapter extends Adapter {
  constructor(addonManager) {
    super(addonManager, 'InputEventAdapter', manifest.id);
    addonManager.addAdapter(this);
    this.savedDevices = [];

    this.db = new Database(this.packageName);
    this.db.open().then((() => {
      return this.db.loadConfig();
    }).bind(this)).then(((config) => {
      this.config = config;
      if (!('devices' in this.config)) {
        this.config.devices = [];
        this.saveConfig();
      }
      return Promise.resolve();
    }).bind(this)).then((() => {
      this.scan();
    }).bind(this)).catch(console.error);
  }

  scan() {
    listInputEvents().then((events) => {
      for (const event of events) {
        const eid = `input-event-${event.path.replace(/[^a-zA-Z0-9]/g, '-')}`;
        let d;
        if (this.devices[eid]) {
          d = this.devices[eid];
          d.event = event;
          console.log('Updated pheripheral', d.id);
        } else {
          d = new Device(this, eid, event);
          this.handleDeviceAdded(d);
        }
        if (this.savedDevices.includes(d.id)) {
          console.log('Thing saved later', d.id);
          d.run();
        }
      }
    }).catch((err) => {
      console.error(err);
    });
  }

  saveConfig() {
    this.db.saveConfig(this.config);
  }

  handleDeviceAdded(device, reload = false) {
    super.handleDeviceAdded(device);
    if (reload) return;
    console.log('Thing added', device.id);
  }

  handleDeviceUpdated(device) {
    super.handleDeviceAdded(device, true);
    console.log('Thing updated', device.id);
  }

  handleDeviceSaved(deviceId) {
    super.handleDeviceSaved(deviceId);
    this.savedDevices.push(deviceId);
    if (this.devices[deviceId]) {
      const device = this.devices[deviceId];
      console.log('Thing saved', deviceId);
      device.run();
    }
  }

  startPairing(_timeoutSeconds) {
    console.log('Pairing started');
    try {
      this.scan();
    } catch (error) {
      console.error('Error during scan', error);
    }
  }

  cancelPairing() {
    console.log('Pairing cancelled');
  }

  handleDeviceRemoved(device) {
    super.handleDeviceRemoved(device);
    device.stop();
    console.log('Thing removed', device.id);
  }

  removeThing(device) {
    console.log('Remove thing', device.id);

    this.handleDeviceRemoved(device);
    if (this.savedDevices.includes(device.id))
      this.savedDevices.splice(this.savedDevices.indexOf(device.id), 1);
  }

  cancelRemoveThing(device) {
    console.log('cancel removing thing', device.id);
  }
}

module.exports = InputEventAdapter;
