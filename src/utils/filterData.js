export const filterData = (data = [], option = "") =>
    data.filter(item =>
        Object.keys(item).some(key =>
            typeof item[key] === "string" && item[key]
                .toString()
                .toLowerCase()
                .includes(option.toString().toLowerCase())
        )
    );