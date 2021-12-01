const topicUrl = require('../config').topicUrl;
const videoUrl = require('../config').videoUrl;
const topicType = require('../config').topicType;

class Until {
    constructor() {
    }

    //根据年级获取文件夹名称
    getGradeCode(grade) {
        let info = { name: '', num: 0 };
        switch (grade) {
            case '一年级': info.name = 'grade_one'; info.num = 1; break;
            case '二年级': info.name = 'grade_two'; info.num = 2; break;
            case '三年级': info.name = 'grade_three'; info.num = 3; break;
            case '四年级': info.name = 'grade_four'; info.num = 4; break;
            case '五年级': info.name = 'grade_five'; info.num = 5; break;
            case '六年级': info.name = 'grade_six'; info.num = 6; break;
        }
        return info;
    }

    //根据年级获取文件夹名称
    getGradeCodebyNum(grade) {
        let info = { name: '', num: 0, chineseName: '' };
        switch (grade) {
            case '1年级': info.name = 'grade_one'; info.num = 1; info.chineseName = '一年级'; break;
            case '2年级': info.name = 'grade_two'; info.num = 2; info.chineseName = '二年级'; break;
            case '3年级': info.name = 'grade_three'; info.num = 3; info.chineseName = '三年级'; break;
            case '4年级': info.name = 'grade_four'; info.num = 4; info.chineseName = '四年级'; break;
            case '5年级': info.name = 'grade_five'; info.num = 5; info.chineseName = '五年级'; break;
            case '6年级': info.name = 'grade_six'; info.num = 6; info.chineseName = '六年级'; break;
        }
        return info;
    }

    // 根据专题获取文件夹名称
    getSubjectCode(item) {
        let info = { name: '', num: 0 };
        const topic = item.gradeName.slice(0, 3);
        switch (topic) {
            case '专题一': info.name = 'topic1'; info.num = 1; break;
            case '专题二': info.name = 'topic2'; info.num = 2; break;
            case '专题三': info.name = 'topic3'; info.num = 3; break;
            case '专题四': info.name = 'topic4'; info.num = 4; break;
            case '专题五': info.name = 'topic5'; info.num = 5; break;
            case '专题六': info.name = 'topic6'; info.num = 6; break;
            case '专题七': info.name = 'topic7'; info.num = 7; break;
            case '专题八': info.name = 'topic8'; info.num = 8; break;
            case '专题九': info.name = 'topic9'; info.num = 9; break;
        }
        return info;
    }

    // 根据专题获取文件夹名称
    getSubjectCodeByStr(str, isSlece) {
        let info = { name: '', num: 0, chineseName: '' };
        let topic = isSlece ? str.slice(3, 6) : str;
        switch (topic) {
            case '专题1': info.name = 'topic1'; info.num = 1; info.chineseName = '专题一'; break;
            case '专题2': info.name = 'topic2'; info.num = 2; info.chineseName = '专题二'; break;
            case '专题3': info.name = 'topic3'; info.num = 3; info.chineseName = '专题三'; break;
            case '专题4': info.name = 'topic4'; info.num = 4; info.chineseName = '专题四'; break;
            case '专题5': info.name = 'topic5'; info.num = 5; info.chineseName = '专题五'; break;
            case '专题6': info.name = 'topic6'; info.num = 6; info.chineseName = '专题六'; break;
            case '专题7': info.name = 'topic7'; info.num = 7; info.chineseName = '专题七'; break;
            case '专题8': info.name = 'topic8'; info.num = 8; info.chineseName = '专题八'; break;
            case '专题9': info.name = 'topic9'; info.num = 9; info.chineseName = '专题九'; break;
            case '专题10': info.name = 'topic10'; info.num = 10; info.chineseName = '专题十'; break;
            case '专题11': info.name = 'topic11'; info.num = 11; info.chineseName = '专题十一'; break;
            case '专题12': info.name = 'topic12'; info.num = 12; info.chineseName = '专题十二'; break;
            case '专题13': info.name = 'topic13'; info.num = 13; info.chineseName = '专题十三'; break;
            case '专题14': info.name = 'topic14'; info.num = 14; info.chineseName = '专题十四'; break;
            case '专题15': info.name = 'topic15'; info.num = 15; info.chineseName = '专题十五'; break;
            case '专题16': info.name = 'topic16'; info.num = 16; info.chineseName = '专题十六'; break;
            case '专题17': info.name = 'topic17'; info.num = 17; info.chineseName = '专题十七'; break;
            case '专题18': info.name = 'topic18'; info.num = 18; info.chineseName = '专题十八'; break;
            case '专题19': info.name = 'topic19'; info.num = 19; info.chineseName = '专题十九'; break;
        }
        return info;
    }

    // 获取题目类型
    getSubjectType(item) {
        let type = '';
        switch (item.topicType) {
            case '例题': type = topicType.example; break;
            case '图形题': type = topicType.figure; break;
            case '拍照题': type = topicType.text; break;
        }
        return type;
    }

    // 获取图片名称
    getPictureName(item) {
        const grade = this.getGradeCode(item.grade).num;
        const subject = this.getSubjectCode(item).num;
        const topic = item.topic.slice(2);
        const name = topic.split('-');
        if (item.topicType === topicType.example) {
            return `${grade}.${subject}_${name[0]}`
        }
        if (item.topicType === topicType.figure || topicType.photograph) {
            return `${grade}.${subject}_${name[0]}_${name[1]}`
        }
    }

    getPicureNameByURL(url) {
        url = url.replace(" ", "");
        const dir = url.split(`${topicUrl}/`)[1];
        const info = dir.split('/');
        const grade = info[0][0];
        const subject = info[1][5];
        const topic = info[2][2];
        if (!grade || !subject || !topic) {
            console.log('error', {grade: grade, subject: subject, topic: topic});
            return false;
        }
        if (info[3].indexOf('例题') !== -1) {
            return `${grade}.${subject}_${topic}`
        }
        if (info[3].indexOf('例') !== -1) {
            return `${grade}.${subject}_${topic}`
        }
        if (!info[3].split('-')[1])
        {
            console.log(url);
            return false;
        }
        const name = info[3].split('-')[1][0];
        return `${grade}.${subject}_${topic}_${name}`
    }

    getOutPutPicNameByURL(url, isIntro) {
        url = url.replace(" ", "");
        const dir = url.split(`${topicUrl}/`)[1];
        const info = dir.split('/');
        const grade = this.getGradeCodebyNum(info[0]).name;
        const subject = this.getSubjectCodeByStr(info[1], true).name;
        if (isIntro) {
            return `${grade}/${subject}/`;
        }
        if (info[3].indexOf('答案') !== -1 || info[3].indexOf('解析') !== -1) {
            return `${grade}/${subject}/answer/`
        } 
        return `${grade}/${subject}/question/`
    }

    getOutPutVideoNameByUrl(url) {
        url = url.replace(" ", "");
        const dir = url.split(`${videoUrl}/`)[1];
        const info = dir.split('/');
        console.log(info);
        const grade = this.getGradeCodebyNum(info[0]).name;
        const subject = this.getSubjectCodeByStr(info[1], false).name;
        return `${grade}/${subject}/video`
    }
}
module.exports = Until;
