const RESET = "\x1b[0m";
const RED = "\x1b[31m";
const GREEN = "\x1b[32m";
const YELLOW = "\x1b[33m";
const BLUE = "\x1b[34m";
const DIM = "\x1b[2m";

let verbose = false;

export function setVerbose(v: boolean): void {
  verbose = v;
}

export function info(msg: string): void {
  console.log(`${BLUE}[info]${RESET} ${msg}`);
}

export function success(msg: string): void {
  console.log(`${GREEN}[ok]${RESET} ${msg}`);
}

export function warn(msg: string): void {
  console.warn(`${YELLOW}[warn]${RESET} ${msg}`);
}

export function error(msg: string): void {
  console.error(`${RED}[error]${RESET} ${msg}`);
}

export function debug(msg: string): void {
  if (verbose) {
    console.log(`${DIM}[debug] ${msg}${RESET}`);
  }
}
