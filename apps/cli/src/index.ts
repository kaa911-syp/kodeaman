#!/usr/bin/env node
import { Command } from "commander";
import { createScanCommand } from "./commands/scan.js";
import { createInitCommand } from "./commands/init.js";
import { createOwaspScanCommand } from "./commands/owasp-scan.js";

const program = new Command();

program
  .name("kodeaman")
  .description("KodeAman — Security coach for Indonesian developers")
  .version("0.2.0");

program.addCommand(createScanCommand());
program.addCommand(createInitCommand());
program.addCommand(createOwaspScanCommand());

program.parse();
