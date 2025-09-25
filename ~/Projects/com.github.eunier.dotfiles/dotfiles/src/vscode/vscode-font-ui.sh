#!/bin/sh

set -e

css="<style>.monaco-icon-label{zoom:1.1}</style>"

action="${1:-patch}"

base_dir="${2:-$(dirname "$(readlink -f "$(which code)")")}"

workbench_html_id="vs/code/electron-sandbox/workbench/workbench.html"
workbench_html_file="$(realpath "$base_dir/../resources/app/out/$workbench_html_id")"
product_json_file="$(realpath "$base_dir/../resources/app/product.json")"

if [ ! -f "$workbench_html_file" ]; then
  echo >&2 "error: workbench.html not found at: $workbench_html_file"
  exit 1
fi

if [ ! -f "$product_json_file" ]; then
  echo >&2 "error: product.json not found at: $product_json_file"
  exit 1
fi

# backup just in-case
if [ ! -f "$workbench_html_file.bku" ]; then
  cp "$workbench_html_file" "$workbench_html_file.bku"
fi
if [ ! -f "$product_json_file.bku" ]; then
  cp "$product_json_file" "$product_json_file.bku"
fi

# clear the previous patch if re-patching after update or reverting
sed -i "\|$css|d" "$workbench_html_file"
echo "reset $workbench_html_file OK"

if [ "$action" != "revert" ]; then
  # (re)add the $css
  sed -i "\|<link rel=.*/workbench/workbench.desktop.main.css\">|a\
$css" "$workbench_html_file"
  echo "patch $workbench_html_file OK"
fi

hash="$(shasum -a 256 "$workbench_html_file" | cut -d " " -f 1 | xxd -r -p | base64 | tr -d '=')"

# update the checksum so we don't get the 'corrupted...' warning
sed -i "s|^\(.*\"$workbench_html_id\": \"\).*\(\".*\)$|\1$hash\2|" "$product_json_file"
echo "patch $product_json_file OK"
