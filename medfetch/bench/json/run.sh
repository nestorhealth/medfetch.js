#!/bin/bash

N=10
echo "Run,Node (ms),Jansson (ms),yyjson (ms)"

for ((i=1; i<=N; i++)); do
  node_time=$(node parse_node.mjs | grep -o '[0-9.]\+ms' | sed 's/ms//')
  jansson_time=$(./parse_jansson | grep -o '[0-9.]\+ms' | sed 's/ms//')
  yyjson_time=$(./parse_yyjson | grep -o '[0-9.]\+ms' | sed 's/ms//')
  echo "$i,$node_time,$jansson_time,$yyjson_time"
done

