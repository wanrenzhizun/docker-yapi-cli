#!/bin/bash
#!/bin/sh
#说明
show_usage="args:[-v] [--version=]"
#参数
#版本
version=""
GETOPT_ARGS=`getopt -o v: -al version: -- "$@"`
eval set -- "$GETOPT_ARGS"

#获取参数
while [ -n "$1" ]
    do
        case "$1" in
            -v|--version) version=$2; shift 2;;
            --) break ;;
            *) echo $1,$2,$show_usage; break ;;
        esac
done
#对必填项做输入检查，此处假设都为必填项
if [ -z $version ]; then
    echo $show_usage
    exit 0
fi
# 一切正常的话输出取值结果

git clone \
  --branch "v${version}" \
  --single-branch \
  --depth 1 \
  https://github.com/YMFE/yapi.git vendors