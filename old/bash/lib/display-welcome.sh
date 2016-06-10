#!/bin/sh
# node-appgen


cprintf () {
  STR="$3"
  for i in ${@:4}; do
    STR="$STR $i"
  done
  STR=${STR//\\s/ } # replace \s with ' '
  printf "\033[$1m\033[$2m${STR}\033[0m"
}
cecho () {
  STR="$3"
  for i in ${@:4}; do
    STR="$STR $i"
  done
  STR=${STR//\\s/ } # replace \s with ' '
  echo "\033[$1m\033[$2m${STR}\033[0m"
}
ntimes_do () {
  for i in $(seq 1 $1); do $2; done
}
esc_s_to_space () {
  echo ${1//\\s/ } # that's actually a space in there
}
nl () {
  printf "\n"
}

# draw_rows () {

# }

print_banner () {

  local message="$1"

  local arr=()
  local lens=()
  local i=0
  while read -r line; do
    arr+=("$line")
    local current=${arr[i]}
    echo "current is $current"
    local len=${#current}
    echo "it's length is $len"
    lens+=$len
    let "i = i + 1"
  done <<< "$message"


  # local len=${#msg}
  # printf "$msg"
  # local margin=7

  # let "totwidth = len + 2 + (margin * 2)"
  # let "widthwoborder = totwidth - 2"
  # local fg=34
  # local bg=48

  # ntimes_do $totwidth "cprintf $fg $bg _"
  # echo
  # cprintf $fg $bg '|'
  # ntimes_do $widthwoborder "cprintf $fg $bg \s"
  # cprintf $fg $bg '|'
  # echo
  # cprintf $fg $bg '|'
  # ntimes_do $margin "cprintf $fg $bg \s"

  # printf $1

  # ntimes_do $margin "cprintf $fg $bg \s"
  # cprintf $fg $bg '|'
  # echo
  # cprintf $fg $bg '|'
  # ntimes_do $widthwoborder "cprintf $fg $bg _"
  # cprintf $fg $bg '|'
  # echo
  # ntimes_do $totwidth "cprintf $fg $bg \s"
  # echo

}


# print_banner "$@"


test () {
  local i=0
  while read -r line; do
    printf "string[$i] == '$line' "
    local len=${#line}
    printf " It is $len characters long\n"
    let "i = i + 1"
  done <<< "$string"
}


# This actually works if you create "newlines" in a sort of heredoc style:

string="123 567
	123 56
    12 45"

test $string # outputs: 

# string[0] == '123 567'  It is 7 characters long
# string[1] == '123 56'  It is 6 characters long
# string[2] == '12 45'  It is 5 characters long


# But apparently that's not the same as \n 
# Here is the same string but with \n instead of actual new lines:

string="123 567\n123 56\n12 45"

test $string # outputs:

# string[0] == '123 567
# 123 56
# 12 45'  It is 22 characters long

# It prints with new lines (\n's are honored) 
# but the only iterates once (\n's are not honored)






# for (( i=0; i<${#message}; i++ )); do
#   printf "${message:$i:1}"
# done

# echo; echo; echo;

# echo $message | awk -v ORS="" '{ gsub(/./,"&\n") ; print }' | \
# while read char
# do
#    printf " $char "
# done

# i=0
# while (( i++ < ${#message} ))
# do
#    char=$(expr substr "$message" $i 1)
#    echo "<$char>"
# done


# string="I'm Ned Nederlander
# I'm Lucky Day
# I'm Dusty Bottoms"

# arr=()
# while read line; do
#    arr+=("$line")
# done <<< "$string"
# echo ${arr[0]}
