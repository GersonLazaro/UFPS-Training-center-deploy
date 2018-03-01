#!/bin/bash
time timeout {TL}s java -classpath {path}{code} < {input} > {path}output.out -k
exit_status=$?
if [[ $exit_status -eq 124 ]]; then
    echo "Timelimit"
elif [[ $exit_status == 0 ]]; then
    echo "Accepted"
else
    echo "Runtime"
fi  