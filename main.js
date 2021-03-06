const Ebook = require('./entity/Ebook');
const Chapter = require('./entity/Chapter');
const Subject = require('./entity/Subject');
const Until = require('./tool/Until');
const Components = require('./entity/Components');
const { nanoid } = require('nanoid')
const jsonUrl = require('./config').jsonUrl;
const modifyVersion = require('./config').modifyVersion;
const topicType = require('./config').topicType;

const fs  = require('fs');

const jsonStr = fs.readFileSync('./input/data.json',{flag:'r',encoding:'utf-8'});
const jsonData = JSON.parse(jsonStr);

const oldJson = fs.readFileSync(jsonUrl,{flag:'r',encoding:'utf-8'});
const oldJsonData = JSON.parse(oldJson);

const until = new Until();

// 对象的key值取英文字符串
const json = [];
jsonData.forEach((item) => {
    let jsonItem = {};
    for (const itemKey in item) {
        const key = itemKey.split('/')[1];
        if (!key) {
            continue;
        }
        jsonItem[key] = item[itemKey];
    }
    json.push(jsonItem);
})

// 处理json部分键值为空的字段
let grade = '';
let gradeName = '';
const subjectComponents = [];
const topicComponents = [];
json.forEach((item) => {
    if (item['grade']) {
        gradeName = '';
        grade = item['grade'];
    }
    item['grade'] = grade;
    if (item['gradeName']) {
        gradeName = item['gradeName'];
    }
    item['gradeName'] = gradeName;
    item['topicType'] = until.getSubjectType(item);
    if (item['subjectComponent']) {
        subjectComponents.push(item);
    }
    if (item['topicComponent']) {
        topicComponents.push(item);
    }
})

const ebook = new Ebook();
// 添加年级
let chapter = '';
json.forEach((item) => {
    if (item.grade !== chapter) {
        chapter = item.grade;
        const chap = new Chapter();
        chap.moduleTitle = chapter;
        chap.coverImg = "${workspace}/img/" + `${until.getGradeCode(chapter).name}/coverImg.png`;
        ebook.chapter.push(chap);
    }
})
// 添加专题
let subject = '';
json.forEach((item) => {
    ebook.chapter.forEach((chapter) => {
        if (item.grade === chapter.moduleTitle) {
            if (subject !== item.gradeName) {
                const sub = new Subject();
                sub.title = item.gradeName;
                sub.coverImg.push("${workspace}/img/" +
                    `${until.getGradeCode(item.grade).name}/${until.getSubjectCode(item).name}/introduce.png`);
                sub.coverImg.push("${workspace}/img/" +
                    `${until.getGradeCode(item.grade).name}/${until.getSubjectCode(item).name}/drawing.png`);
                subjectComponents.forEach((component) => {
                    if (component.grade === item.grade && component.gradeName === item.gradeName) {
                        // const comp = new Components();
                        // comp.componentType = component['subjectComponent'].split('/')[0].replace(/^\s*|\s*$/g,"");
                        // comp.bizId = component['subjectComponent'] .split(',')[1].replace(/^\s*|\s*$/g,"");
                        // const fileName = comp.componentType === 'widget' ? 'widget' : 'video';
                        // comp.url = "${workspace}/video/" +
                        //     `${component['subjectComponent'].split('/')[1].split(',')[0].replace(/^\s*|\s*$/g,"")}`;
                        // comp.coverImg = "${workspace}/img/" +
                        //     `${until.getGradeCode(item.grade).name}/${until.getSubjectCode(item).name}/${fileName}/${comp.bizId}.png`
                        const comp = getComponents(component['subjectComponent'], item)
                        sub.components.push(comp);
                    }
                })
                chapter.subject.push(sub);
                // 每个年级专题一免费
                chapter.subject[0].isFree = true;
            }
            subject = item.gradeName;
        }
    })
})

// 添加题目
json.forEach((item) => {
    ebook.chapter.forEach((chapter, chapterIndex) => {
        if (item.grade === chapter.moduleTitle) {
            chapter.subject.forEach((sub, subIndex) => {
                if (item.gradeName === sub.title) {
                    const textTpc = {
                        question: { id: '', type: '', src: '' },
                        answer: { id: '', src: '' }
                    };
                    const figureTpc = {
                        question: { id: '', type: '', src: '' },
                        answer: { id: '', src: '' },
                        answerCard: {id: '', src: ''}
                    }
                    const videoTpc = {
                        question: { id: '', type: '', src: '' },
                        answer: { id: '', src: '' },
                        components: []
                    }
                    let tpc = item.topicType === topicType.figure ? figureTpc : item['topicComponent'] !== '' ? videoTpc : textTpc;
                    if (item.topicType === topicType.figure && item['topicComponent'] !== '') {
                        tpc = {
                            question: { id: '', type: '', src: '' },
                            answer: { id: '', src: '' },
                            answerCard: {id: '', src: ''},
                            components: []
                        }
                    }
                    tpc.question.type = item.topicType;
                    tpc.question.src = "${workspace}/img/" +
                        `${until.getGradeCode(item.grade).name}/${until.getSubjectCode(item).name}/question/${until.getPictureName(item)}.png`
                    tpc.answer.src = "${workspace}/img/" +
                        `${until.getGradeCode(item.grade).name}/${until.getSubjectCode(item).name}/answer/${until.getPictureName(item)}.png`
                    if (item.topicType === topicType.figure) {
                        tpc.answerCard.src = "${workspace}/img/" +
                            `${until.getGradeCode(item.grade).name}/${until.getSubjectCode(item).name}/card/${until.getPictureName(item)}.png`
                    }
                    if (item[modifyVersion]) {
                        tpc.question.id = nanoid();
                        console.log('\033[;32m', `${until.getPictureName(item)}`, '---- update new id');
                    } else if (handleTopicIsSave(chapterIndex, subIndex, tpc)) {
                        tpc.question.id = handleTopicIsSave(chapterIndex, subIndex, tpc);
                    } else {
                        tpc.question.id = nanoid();
                        console.log('\033[;33m', `${until.getPictureName(item)}`, '---- non-existent new id',);
                    }
                    // todo 题目素材
                    topicComponents.forEach((component) => {
                        if (item.grade === component.grade && item.gradeName === component.gradeName && item.topic === component.topic) {
                            const comp = getComponents(component['topicComponent'], item)
                            tpc.components.push(comp);
                        }
                    })
                    sub.topic.push(tpc);
                }
                sub.total = sub.topic.length;
            })
        }
    })
})
function handleTopicIsSave(chapterIndex, subIndex, tpc) {
    let id = '';
    if (!oldJsonData.chapter[chapterIndex].subject[subIndex]) {
        return;
    }
    oldJsonData.chapter[chapterIndex].subject[subIndex].topic.forEach((topic) => {
        if (topic.question.src === tpc.question.src) {
            id = topic.question.id;
        }
    })
    return id;
}

function getComponents(com, item) {
    const comp = new Components();
    comp.componentType = com.split('/')[0].replace(/^\s*|\s*$/g,"");
    comp.bizId = com.split(',')[1].replace(/^\s*|\s*$/g,"");
    const fileName = comp.componentType === 'widget' ? 'widget' : 'video';
    comp.url = "${workspace}/video/" +
        `${com.split('/')[1].split(',')[0].replace(/^\s*|\s*$/g,"")}`;
    comp.coverImg = "${workspace}/img/" +
        `${until.getGradeCode(item.grade).name}/${until.getSubjectCode(item).name}/${fileName}/${comp.bizId}.png`;
    return comp;
}

ebook.chapter.forEach((chapter) => {
    chapter.subject.forEach((subject) => {
        chapter.total += subject.total;
    })
    chapter.topicTotal = chapter.subject.length;
})

fs.writeFile('./output/zhentiji.json', JSON.stringify(ebook), 'utf-8', (err) => {
    if (err) {
        console.log('写入失败');
    } else {
        console.log('写入成功');
        console.log('\033[;37m');
    }
})
