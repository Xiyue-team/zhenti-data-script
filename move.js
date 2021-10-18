const fs = require('fs');
const Util = require('./tool/until');
const fileUrl = require('./config').fileUrl;
const util = new Util();
const imagemin = require('imagemin');
const imageminMozjpeg = require("imagemin-mozjpeg");
const imageminPngquant = require('imagemin-pngquant');

// fs.rmdir(`./null`, (err) => {
//     if(err){
//         console.log(err);
//         return false;
//     }
//     console.log(`删除./output/picture目录成功`);
// })

// 年级文件夹名称
fs.readdir(fileUrl, (err, data) => {
    if (err) {
        console.log('读取 ‘E:/UI/专题’ fail');
        return
    }

    data.forEach((gradeName) => {
        const fileName = util.getGradeCodebyNum(gradeName).name;
        fs.mkdir(`./output/picture/${fileName}`, (err) => {
            if (err) {
                console.log(err);
                console.log(`创建${fileName}文件夹失败`);
                return;
            }
            console.log(`创建${fileName}文件夹成功`);
            createdTopic(gradeName, fileName);
        })
    })
})

function createdTopic(gradeName, fileName) {
    fs.readdir(`${fileUrl}/${gradeName}`, (err, data) => {
        if (err) {
            console.log(`读取${gradeName}topic文件失败`);
            return;
        }
        data.forEach((topic) => {
            const num = topic.split('专题')[1];
            fs.mkdir(`./output/picture/${fileName}/topic${num}`, (err) => {
                if (err) {
                    console.log(`创建${fileName}文件夹失败`);
                    return;
                }
                console.log(`创建${fileName}文件夹成功`);
                createAnsQue(`./output/picture/${fileName}/topic${num}`);
            })
        })
    })
}

function createAnsQue(dir) {
    fs.mkdir(`${dir}/answer`, (err) => {
        if (err) {
            console.log(`创建 ${dir} 失败`);
            return
        }
        console.log(`创建 ${dir}/answer 成功`)
    })
    fs.mkdir(`${dir}/question`, (err) => {
        if (err) {
            console.log(`创建 ${dir} 失败`);
            return
        }
        console.log(`创建 ${dir}/question 成功`)
    })
}

fs.readdir(`${fileUrl}`, (err, chapterList) => {
    if (err) {
        console.log(`${fileUrl}  失败`);
        return;
    }
    chapterList.forEach((chapter) => {
        fs.readdir(`${fileUrl}/${chapter}`, (err, subjectList) => {
            if (err) {
                console.log(`${fileUrl}/${chapter}  失败`);
                return;
            }
            subjectList.forEach((topic) => {
                fs.readdir(`${fileUrl}/${chapter}/${topic}`, (err, nameList) => {
                    if (err) {
                        console.log(`${fileUrl}/${chapter}/${topic}  失败`);
                        return;
                    }
                    nameList.forEach((name) => {
                        if (name.indexOf('.png') !== -1) {
                            const url = `${fileUrl}/${chapter}/${topic}/${name}`
                            fs.readFile(url, (err, data) => {
                                if (err) {
                                    console.log(`${url} 获取图片失败`);
                                    return;
                                }
                                const dir = util.getOutPutPicNameByURL(url, true);
                                getMinImage(url).then((files) => {
                                    writeFile(`./output/picture/${dir}introduce.png`, files);
                                });
                            })
                            return;
                        }
                        fs.readdir(`${fileUrl}/${chapter}/${topic}/${name}`, (err, picList) => {
                            if (err) {
                                console.log(`${fileUrl}/${chapter}/${topic}/${name}  失败`);
                                return;
                            }
                            picList.forEach((pic) => {
                                const url = `${fileUrl}/${chapter}/${topic}/${name}/${pic}`;
                                fs.readFile(url, (err, data) => {
                                    if (err) {
                                        console.log(`${url} 获取图片失败`);
                                        return;
                                    }
                                    const picName = util.getPicureNameByURL(url);
                                    if (!picName) {
                                        console.log('error' + url);
                                        return;
                                    }
                                    const dir = util.getOutPutPicNameByURL(url, false);
                                    // 优化图片
                                    getMinImage(url).then((files) => {
                                        writeFile(`./output/picture/${dir}${picName}.png`, files);
                                    });
                                })
                            })
                        })
                    })
                })
            })
        })
    })
})

async function getMinImage(url) {
    const files = await imagemin([url], {
        plugins: [
            imageminMozjpeg(),
            imageminPngquant({
                quality: [0.6, 0.8]
            })
        ]
    });
    return files[0].data;
}

function writeFile(url, files) {
    fs.writeFile(url, files, (err)=> {
        if (err) {
            console.log(url + '复制失败', err);
            return
        }
        console.log(url + '复制成功');
    })
}
