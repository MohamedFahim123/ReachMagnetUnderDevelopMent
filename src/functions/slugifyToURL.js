export  const slugifyFilteration = (str) => {
        return str
                .toLowerCase()
                .trim()
                .replace(/[^\w\s.-]/g, '')
                .replace(/\s+/g, '-')
                .replace(/--+/g, '-');
        };

export const reverseSlugToObj = (slug) => {
                const keyValuePairs = slug.split('&');

                const obj = keyValuePairs.reduce((acc, pair) => {
                const [key, value] = pair.split('=');
                acc[key] = value ? decodeURIComponent(value) : '';
                return acc;
                }, {});
                return obj;
        };