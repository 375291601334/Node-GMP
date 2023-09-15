const childProcess = require('child_process');
const os = require('os');
const fs = require('fs');

const command = getCommand();
let unixTime = getUnixTime();

function getCommand() {
  switch (os.type()) {
    case 'Windows_NT':
      return `powershell "Get-Process | Sort-Object CPU -Descending | Select-Object -Property Name, CPU, WorkingSet -First 1 | ForEach-Object { $_.Name + ' ' + $_.CPU + ' ' + $_.WorkingSet }"`;
    case 'Darwin':
    case 'Linux':
      return `ps -A -o %cpu,%mem,comm | sort -nr | head -n 1`;
  }
}

function getUnixTime() {
  return Math.floor(Date.now() / 1000);
}

function execCommand(callback) {
  childProcess.exec(command, callback);
}

const callback = (error, stdout) => {
  printToConsole(stdout);
  logToFileEveryMinute(stdout);

  if (error !== null) {
    console.error(`error: ${error}`);
    clearInterval(intervalID);
  }
};

function printToConsole(str) {
  console.clear();
  console.log(str);
}

function logToFileEveryMinute(str) {
  if (unixTime !== getUnixTime()) {
    logToFile(`${getUnixTime()}: ${str}`);
    unixTime = getUnixTime();
  }
}

function logToFile(str) {
  const fileName = './assets/activityMonitor.log';

  fs.appendFile(fileName, str, (err) => {
    if (err) {
      console.error(`logging error: ${error}`);
      clearInterval(intervalID);
    }
  });
}

const intervalID = setInterval(() => {
  execCommand(callback);
}, 100);
