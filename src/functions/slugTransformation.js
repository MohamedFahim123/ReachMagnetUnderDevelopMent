export const clearEmptyQueryValues = (queryString) => {
        return queryString
            .split('&')
            .filter(pair => pair.split('=')[1])
            .join('&');
        }
