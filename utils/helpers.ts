export const formatNumber = (value: number) => {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");;
}

export const clusterStyle = (casesPerMil: number) => {
    const backgroundColor = casesPerMil < 50 ? "#347C03"
        : casesPerMil < 100 ? "#DDEF2B"
            : casesPerMil < 1000 ? "#F0932C"
                : "#AF3014"

    const size = casesPerMil < 50 ? "10"
        : casesPerMil < 100 ? "20"
            : casesPerMil < 1000 ? "40"
                : "60"

    const fontSize = casesPerMil < 50 ? ".5"
        : casesPerMil < 100 ? ".6"
            : casesPerMil < 1000 ? ".8"
                : "1"

    return { backgroundColor, size, fontSize }
}

export const groupByCritical = (casesPerMil: number) => {
    const category = casesPerMil < 50 ? "Minor"
        : casesPerMil < 100 ? "Moderate"
            : casesPerMil < 1000 ? "Considerable"
                : "Critical"

    return category
}

export const arraySubtraction = (arr: Array<number>) => {
    let newArr = []
    for (let i = 0; i < 14; i++) {
        newArr.push(Math.abs(arr[i] - arr[i + 1]))
    }
    return newArr;
}