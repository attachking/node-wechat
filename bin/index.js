let path = require('path')
let www = path.join(__dirname, 'www')
let child_process = require('child_process')

function startChild() {
    let child = child_process.spawn('node', [www])
    child.stdout.on('data', (data) => {
        process.stdout.write(data)
    })
    child.stderr.on('data', (data) => {
        console.log(data.toString())
    });
    child.on('error', (err) => {
        console.log(`错误捕获：${err}`);
    });
    child.on('close', (code) => {
        console.log(`子进程退出码：${code}`);
        setTimeout(() => {
            startChild()
        }, 10000)
    });
}

startChild()