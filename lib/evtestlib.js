const spawn = require('child_process').spawn;
const EventEmitter = require('events');

function listInputEvents() {
  return new Promise((resolve, reject) => {
    const proc = spawn('sh', ['-c', 'evtest', '2>&1'], {shell: true});
    proc.stdout.setEncoding('UTF-8');
    const events = [];
    let i = 0;
    proc.stdout.on('data', (data) => {
      const lines = data.split(/\r?\n/);
      for (const line of lines) {
        if (line.match(/^Select the device event number/)) {
          resolve(events);
          return;
        }
        const res = line.match(/^(\/dev\/input\/event[0-9]*):\t(.*)$/);
        if (!res) continue;
        events.push(new InputEvent(i, res[1], res[2]));
        i++;
      }
    });
    proc.on('error', (error) => {
      reject(error);
    });
  });
}

class InputEvent extends EventEmitter {

  constructor(index, path, name) {
    super();
    this.index = index;
    this.path = path;
    this.name = name;

    const proc = spawn('sh', ['-c', 'evtest', '2>&1'], {shell: true});
    proc.stdin.setEncoding('utf-8');
    proc.stdout.setEncoding('utf-8');
    let incoming = false;
    proc.stdout.on('data', ((data) => {
      const lines = data.split(/\r?\n/);
      for (const line of lines) {
        if (!incoming) {
          if (line.match(/^Select the device event number/)) {
            incoming = true;
            proc.stdin.write(`${this.index}\n`);
            proc.stdin.end();
          }
          continue;
        }

        const res = line.match(/^Event: time [0-9]*\.[0-9]*, type ([0-9]*) \((.*)\), code ([0-9]*) \((.*)\), value ([0-9]*)$/);
        if (res)
          this.emit('data', {type_id: parseInt(res[1]), type_name: res[2], code_id: parseInt(res[3]), code_name: res[4], value: parseInt(res[5])});
      }
    }).bind(this));
    proc.on('error', ((error) => {
      this.emit('error', error);
    }).bind(this));
    this.on('data', ((data) => {
      if (data.value == 1) {
        this.emit('keydown', data);
      } else if (data.value == 0) {
        this.emit('keyup', data);
      } else {
        this.emit('keypress', data);
      }
    }).bind(this));
  }

  exit() {
    // ...
  }

}

/*listInputEvents().then((events) => {
  console.log(events);
  events[2].on('keydown', console.log);
  events[2].on('keyup', console.log);
}).catch((err) => {
  console.error(err);
});*/

module.exports = listInputEvents;
