export function prepareFields<T>(data: T): string {
    const arrData: string[] = []

    for (let key in data) {
        arrData.push(`${key} = '${data[key]}'`)
    }

    return arrData.join(', ')
}