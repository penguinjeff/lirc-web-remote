#!/usr/bin/env bash
rfun(){
  declare -n __mode="mode"
  declare -n __json="json"
  __mode="rfun mode test"
  __json="rfun json test"
}

mode="mode has stayed the same in global"
json="json has stayed the same in global"

main(){
  local mode="mode has stayed the same in main"
  local json="json has stayed the same in main"
  rfun
  echo "mode:${mode}"
  echo "json:${json}"
}

main
echo "mode:${mode}"
echo "json:${json}"
