import Terminal from "../src/index"
import Logger from "@improved-javascript/logger";

const terminal = new Terminal("@YELLOW@Launching rocket in: @WHITE@#countdown#")
const logger = new Logger(__dirname + "/logs.json");

const countdown = terminal.createVariable("countdown", 10)

function loop(){
    countdown.value--;
}

setInterval(loop, 1000)