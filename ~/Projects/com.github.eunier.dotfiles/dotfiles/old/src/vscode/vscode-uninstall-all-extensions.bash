#!/usr/bin/env bash

code --list-extensions | xargs -n 1 code --uninstall-extension
