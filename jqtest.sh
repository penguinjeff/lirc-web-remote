function lines() {  echo -ne "$1"|jq -M -R -s 'split("\n")'; }

declare -a ran


ran+=("$(jq -c -n \
                  --argjson args "$(lines "arg1\narg2\narg3")" \
                  --arg delay "arg4" \
                  --arg loops "arg5" \
                  --argjson stdout "$(lines "This\nis\nStandard Out")" \
                  --argjson stderr "$(lines "This\nis\nStandard Error")" \
                  '$ARGS.named' \
        )")
ran+=("$(jq -c -n \
                  --argjson args "$(lines "arg1\narg2\narg3")" \
                  --arg delay "arg4" \
                  --arg loops "arg5" \
                  --argjson stdout "$(lines "This\nis\nStandard Out")" \
                  --argjson stderr "$(lines "This\nis\nStandard Error")" \
                  '$ARGS.named' \
        )")


function display()
{
jq -c -s . <<< "$(for item in "$@"; do echo "$item";done)"
}


display "${ran[@]}"
