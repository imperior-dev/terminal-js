import Terminal from "../src/index"

const terminal = new Terminal("@YELLOW@Launching rocket in: @WHITE@#countdown#")

const countdown = terminal.createVariable("countdown", 10)

function loop(){
    countdown.value--;
}

setInterval(loop, 1000)