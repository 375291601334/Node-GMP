const https = require('https');
const EventEmitter = require('./customEventEmitter.js');

class WithTime extends EventEmitter {
  async execute(asyncFunc, ...args) {
    const start = Date.now();
    this.emit('begin');

    try {
      const data = await asyncFunc(...args);
      this.emit('data', data);
    } catch (err) {
      console.log(`Error: ${err}`)
    }

    const end = Date.now();
    this.emit('end');

    return end - start;
  }
}
 
const withTime = new WithTime();

const testFunc = async () => {
  const url = 'https://jsonplaceholder.typicode.com/posts/1';

  return new Promise((resolve, reject) => {
    const req = https.get(url, (res) => {
      if (res.statusCode < 200 || res.statusCode >= 300) {
        return reject(new Error('statusCode=' + res.statusCode));
      }
        
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
        
      res.on('end', () => {
        resolve(data);
      });

      req.on('error', (e) => {
        reject(e.message);
      });

      req.end();
    });
  });
}

withTime.on('begin', () => console.log('About to execute'));
withTime.on('end', () => console.log('Done with execute'));
withTime.on('data', (chunk) => console.log(`Execute chunk of data ${chunk}`));

(async () => {
  const time = await withTime.execute(testFunc);
  console.log(`Time taken by function is ${time}ms`);
})();

console.log(withTime.rawListeners('end'));
