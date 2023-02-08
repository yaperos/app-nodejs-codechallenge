#!/bin/bash

yarn install
pre-commit install

alias st="nest start transaction --watch"
alias sa="nest start anti-fraud --watch"
