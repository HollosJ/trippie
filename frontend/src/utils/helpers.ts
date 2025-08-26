export const formatDate = (date: Date) => date.toISOString().split("T")[0];

export const createDayArray = (start: Date, end: Date) => {
    const dateArray = new Array();

    let currentDate = start;
    while (currentDate <= end) {
        dateArray.push(formatDate(currentDate));
        currentDate = new Date(currentDate.setDate(currentDate.getDate() + 1));
    }

    return dateArray;
}