const fs = require('fs');

const Util = require('./tool/until');
const util = new Util();
const videoUrl = require('./config').videoUrl;
const jsonStr = fs.readFileSync('./output/zhentiji.json',{flag:'r',encoding:'utf-8'});
const jsonData = JSON.parse(jsonStr);

const imagemin = require('imagemin');
const imageminMozjpeg = require("imagemin-mozjpeg");
const imageminPngquant = require('imagemin-pngquant');

fs.readdir(`${videoUrl}`, (err, data) => {
    if (err) {
        console.log(`error ${videoUrl}`, err);
        return;
    }
    data.forEach((chapter) => {
        fs.readdir(`${videoUrl}/${chapter}`, (err, data) => {
            if (err) {
                console.log('\033[;31m', `读取失败 ${videoUrl}/${chapter}`, err);
                return;
            }
            data.forEach((subject) => {
                const subUrl = util.getOutPutVideoNameByUrl(`${videoUrl}/${chapter}/${subject}`)
                fs.mkdir(`./output/picture/${subUrl}`, (err) => {
                    if (err) {
                        console.log('\033[;31m', `创建${subUrl}文件夹失败`, err)
                        return;
                    }
                    console.log('\033[;32m', `/output/picture/${videoUrl}/${chapter}/${subject}`, '创建成功')
                })
                fs.readdir(`${videoUrl}/${chapter}/${subject}`, (err, data) => {
                    if (err) {
                        console.log('\033[;31m', `读取失败 ${videoUrl}/${chapter}/${subject}`, err)
                        return;
                    }
                    const url = `${videoUrl}/${chapter}/${subject}/${data[0]}`;
                    fs.readFile(url, (err, data) => {
                        if (err) {
                            console.log('\033[;31m', `${url} 获取图片失败`);
                            return;
                        }
                        let bizId = 0
                        jsonData.chapter.forEach((jsonChapter) => {
                            if (jsonChapter.moduleTitle !== util.getGradeCodebyNum(chapter).chineseName){
                                return;
                            }
                            jsonChapter.subject.forEach((jsonSubject) => {
                                if(jsonSubject.title.slice(0, 3) === util.getSubjectCodeByStr(subject).chineseName) {
                                    bizId = jsonSubject.components[0].bizId;
                                }
                            })
                        })
                        // 优化图片
                        getMinImage(url).then((files) => {
                            writeFile(`./output/picture/${subUrl}/${bizId}.png`, files);
                        });
                    })
                })
            })
        })
    })
    console.log('\033[;37m');
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
            console.log('\033[;31m', url + '复制失败', err);
            return
        }
        console.log('\033[;32m', url + '复制成功');
    })
}
