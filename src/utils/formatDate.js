export default function formatDate(param = null) {
    if (!param) return "";
    const fulldays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const dt = new Date(param),
        date = dt.getDate(),
        timeDiff = dt - Date.now(),
        diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24)),
        diffYears = new Date().getFullYear() - dt.getFullYear(),
        hours = dt.getHours(),
        mins = dt.getMinutes(),
        month = dt.getMonth(),
        year = dt.getFullYear();

    if (diffYears === 0 && diffDays === 0) {
        return `${("0" + hours).slice(-2)}.${("0" + mins).slice(-2)}`;
    } else if (diffYears === 0 && diffDays === -1) {
        return "Yesterday";
    } else if (diffYears === 0 && (diffDays < -1 && diffDays > -7)) {
        return fulldays[dt.getDay()];
    } else if (diffYears >= 1) {
        return `${date}/${month + 1}/${year}`;
    } else {
        return `${date}/${month + 1}`;
    }
}