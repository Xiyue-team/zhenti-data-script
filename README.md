# zhenti-data-script
真题集数据生成脚本

## 生成json数据
1、把excel表格数据转换成json数据后，放入./input/data.json文件中。
2、修改config.js 中modifyVersion的修改版本。
3、运行main.js
4、生成的数据在output目录下。
备注: excel转json链接 https://www.bejson.com/json/col2json/

## 复制及优化图片到指定目录
1、在config中配置年级目录的根目录。
2、运行move.js。
3、运行video.js。
备注: output/picture文件夹要为空。
