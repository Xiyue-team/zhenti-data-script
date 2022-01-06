const fs = require('fs');
const Util = require('./tool/until');
const topicUrl = require('./config').topicUrl;
const util = new Util();
const imagemin = require('imagemin');
const imageminMozjpeg = require("imagemin-mozjpeg");
const imageminPngquant = require('imagemin-pngquant');
const drawingUrl = require('./config').drawingUrl;
const jsonStr = fs.readFileSync('./output/zhentiji.json',{flag:'r',encoding:'utf-8'});
const jsonData = JSON.parse(jsonStr);

// fs.rmdir(`./null`, (err) => {
//     if(err){
//         console.log(err);
//         return false;
//     }
//     console.log(`删除./output/picture目录成功`);
// })

/********************* 创建文件夹 ********************************/
fs.readdir(topicUrl, (err, data) => {
    if (err) {
        console.log('\033[;31m', '读取 ‘E:/UI/专题’ fail');
        return
    }

    data.forEach((gradeName) => {
        const fileName = util.getGradeCodebyNum(gradeName).name;
        fs.exists(`./output/picture/${fileName}`, (isExist) => {
            if (isExist) {
                createdTopic(gradeName, fileName);
                return;
            }
            fs.mkdir(`./output/picture/${fileName}`, (err) => {
                if (err) {
                    console.log(err);
                    console.log('\033[;31m', `创建${fileName}文件夹失败`);
                    return;
                }
                console.log('\033[;32m', `创建${fileName}文件夹成功`);
                createdTopic(gradeName, fileName);
            })
        })
    })
})

function createdTopic(gradeName, fileName) {
    fs.readdir(`${topicUrl}/${gradeName}`, (err, data) => {
        if (err) {
            console.log('\033[;31m', `读取${gradeName}topic文件失败`);
            return;
        }
        data.forEach((topic) => {
            const num = topic.split('专题')[1];
            fs.exists(`./output/picture/${fileName}/topic${num}`, (isExist) => {
                if (isExist) {
                    createAnsQue(`./output/picture/${fileName}/topic${num}`);
                    createCrad(gradeName, num);
                    return;
                }
                fs.mkdir(`./output/picture/${fileName}/topic${num}`, (err) => {
                    if (err) {
                        console.log('\033[;31m', `创建${fileName}文件夹失败`);
                        return;
                    }
                    console.log('\033[;32m', `创建${fileName}文件夹成功`);
                    createAnsQue(`./output/picture/${fileName}/topic${num}`);
                    createCrad(gradeName, num);
                })
            })
        })
    })
}

function createAnsQue(dir) {
    fs.exists(`${dir}/answer`, (isExist) => {
        if (isExist) {
            return;
        }
        fs.mkdir(`${dir}/answer`, (err) => {
            if (err) {
                console.log('\033[;31m', `创建 ${dir} 失败`);
                return
            }
            console.log('\033[;32m', `创建 ${dir}/answer 成功`)
        })
    })
    fs.exists(`${dir}/question`, (isExist) => {
        if (isExist) {
            return;
        }
        fs.mkdir(`${dir}/question`, (err) => {
            if (err) {
                console.log('\033[;31m', `创建 ${dir} 失败`);
                return
            }
            console.log('\033[;32m', `创建 ${dir}/answer 成功`)
        })
    })
}

// 创建答题卡文件夹
function createCrad(gradeName, subNum) {
    const gradeNum = util.getGradeCodebyNum(gradeName).num - 1;
    let flag = true;
    if (!jsonData.chapter[gradeNum]) {
        console.log('\033[;31m', `答题卡 --- jsonData.chapter ${gradeName} null`);
        return;
    }
    if (!jsonData.chapter[gradeNum].subject[subNum - 1]) {
        console.log('\033[;31m', `答题卡 --- jsonData.chapter ${gradeName} subject[${subNum} - 1] null`);
        return;
    }
    if (!jsonData.chapter[gradeNum].subject[subNum - 1].topic) {
        console.log('\033[;31m', `答题卡 --- jsonData.chapter ${gradeName} subject[${subNum} - 1].topic null`);
        return;
    }
    jsonData.chapter[gradeNum].subject[subNum - 1].topic.forEach((tpc) => {
        if (tpc.answerCard) {
            flag = false;
        }
    })
    if (flag) {
        return
    }
    const fileName = util.getGradeCodebyNum(gradeName).name;
    fs.exists(`./output/picture/${fileName}/topic${subNum}/card`, (isExist) => {
        if (isExist) {
            return;
        }
        fs.mkdir(`./output/picture/${fileName}/topic${subNum}/card`, (err) => {
            if (err) {
                console.log('\033[;31m', `创建 ./output/picture/${fileName}/topic${subNum}/card 失败`, err);
                return
            }
            console.log('\033[;32m', `创建 ./output/picture/${fileName}/topic${subNum}/card 成功`)
        })
    })
}

/********************* copy图片 ********************************/
fs.readdir(`${topicUrl}`, (err, chapterList) => {
    if (err) {
        console.log('\033[;31m', `${topicUrl}  失败`);
        return;
    }
    chapterList.forEach((chapter) => {
        fs.readdir(`${topicUrl}/${chapter}`, (err, subjectList) => {
            if (err) {
                console.log('\033[;31m', `${topicUrl}/${chapter}  失败`, err);
                return;
            }
            subjectList.forEach((topic) => {
                fs.readdir(`${topicUrl}/${chapter}/${topic}`, (err, nameList) => {
                    if (err) {
                        console.log('\033[;31m', `${topicUrl}/${chapter}/${topic}  失败`, err);
                        return;
                    }
                    nameList.forEach((name) => {
                        if (name.indexOf('.png') !== -1) {
                            const url = `${topicUrl}/${chapter}/${topic}/${name}`
                            fs.readFile(url, (err, data) => {
                                if (err) {
                                    console.log('\033[;31m', `${url} 获取图片失败`);
                                    return;
                                }
                                const dir = util.getOutPutPicNameByURL(url, true);
                                getMinImage(url).then((files) => {
                                    writeFile(`./output/picture/${dir}introduce.png`, files);
                                });
                            })
                            return;
                        }
                        fs.readdir(`${topicUrl}/${chapter}/${topic}/${name}`, (err, picList) => {
                            if (err) {
                                console.log('\033[;31m', `${topicUrl}/${chapter}/${topic}/${name}  失败`);
                                return;
                            }
                            picList.forEach((pic) => {
                                const url = `${topicUrl}/${chapter}/${topic}/${name}/${pic}`;
                                fs.readFile(url, (err, data) => {
                                    if (err) {
                                        console.log('\033[;31m', `${url} 获取图片失败`);
                                        return;
                                    }
                                    const picName = util.getPicureNameByURL(url);

                                    if (!picName) {
                                        console.log('\033[;31m', 'error' + url);
                                        return;
                                    }
                                    const dir = util.getOutPutPicNameByURL(url, false);
                                    // 优化图片
                                    getMinImage(url).then((files) => {
                                        writeFile(`./output/picture/${dir}${picName}.png`, files);
                                    }).catch(() => {
                                        console.log(url);
                                        console.log(`获取优化图片 ${url} 失败`);
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


// 配图
fs.readdir(`${drawingUrl}`, (err, gradeList) => {
    if (err) {
        console.log('\033[;31m', `${drawingUrl}  失败`);
        return;
    }
    gradeList.forEach((grade) => {
        if (grade === 'old') {
            return;
        }
        fs.readdir(`${drawingUrl}/${grade}`, (err, subList) => {
            if (err) {
                console.log('\033[;31m', `${drawingUrl}/${grade}  失败`);
                return;
            }
            subList.forEach((sub) => {
                if (sub.indexOf('@3x') !== -1) {
                    const gradeDir = util.getGradeCode(sub.slice(0,3)).name;
                    getMinImage(`${drawingUrl}/${grade}/${sub}`).then((files) => {
                        fs.exists(`./output/picture/${gradeDir}`, (isExist) => {
                            if (isExist) {
                                writeFile(`./output/picture/${gradeDir}/coverImg.png`, files);
                            }
                        });
                    }).catch(() => {
                        console.log(`获取${drawingUrl}/${grade}/${sub} 失败`);
                    });
                    return;
                }
                const gradeDir = util.getGradeCodebyNum(sub.slice(0,3)).name;
                const topicDir = util.getSubjectCodeByStr(sub.slice(3, sub.length - 9)).name;
                getMinImage(`${drawingUrl}/${grade}/${sub}`).then((files) => {
                    fs.exists(`./output/picture/${gradeDir}/${topicDir}`, (isExist) => {
                        if (isExist) {
                            writeFile(`./output/picture/${gradeDir}/${topicDir}/drawing.png`, files);
                        }
                    });
                }).catch(() => {
                    console.log(`获取${drawingUrl}/${grade}/${sub} 失败`);
                });
            })
        })
    })
})

async function getMinImage(url) {
    try {
        const files = await imagemin([url], {
            plugins: [
                imageminMozjpeg(),
                imageminPngquant()
            ]
        });

        return files[0].data;
    } catch (err) {
        console.log('^^^^^^^^^^^^^^^^^', err);
    }
}

function writeFile(url, files) {
    fs.writeFile(url, files, (err)=> {
        if (err) {
            console.log('\033[;31m', url + '复制失败', err);
            return
        }
        console.log('\033[;32m', url + '复制成功');
    })
}
