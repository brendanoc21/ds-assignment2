#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { Assignment2AppStack } from "../lib/assignment2-stack";

const app = new cdk.App();
new Assignment2AppStack(app, "Assignment2Stack", {
  env: { region: "eu-west-1" },
});
