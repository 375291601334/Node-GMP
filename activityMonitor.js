const os = require('os');
const childProcess = require('child_process');

const command = getCommand();

function getCommand() {
  switch (os.type()) {
    case 'Windows_NT':
      return `powershell "Get-Process | Sort-Object CPU -Descending | Select-Object -Property Name, CPU, WorkingSet -First 1 | ForEach-Object { $_.Name + ' ' + $_.CPU + ' ' + $_.WorkingSet }"`;
    case 'Darwin':
    case 'Linux':
      return `ps -A -o %cpu,%mem,comm | sort -nr | head -n 1`;
  }
}

function execCommand() {
  childProcess.exec(command, (error, stdout) => {
    console.clear();
    console.log(stdout);

    if (error !== null) {
      console.log(`error: ${error}`);
      clearInterval(intervalID);
    }
  });
}

const intervalID = setInterval(() => execCommand(), 100);
