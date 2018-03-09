const fullTime = (isYesterday) => {
    const date    = new Date();
    const yesterdayM = date.getTime() - (1000 * 60 * 60 * 24);
    if (isYesterday) {
        date.setTime(yesterdayM);
    }
    const dateObj = {};

    dateObj.getFullYear = date.getFullYear();
    dateObj.getMonth    = date.getMonth() + 1;
    dateObj.getMonth = dateObj.getMonth > 9 ? dateObj.getMonth : `0${dateObj.getMonth}`;
    dateObj.getDate     = date.getDate();
    dateObj.getDate = dateObj.getDate > 9 ? dateObj.getDate : `0${dateObj.getDate}`;
    dateObj.getTime     = date.getTime();

    return dateObj;
};

export default fullTime;

