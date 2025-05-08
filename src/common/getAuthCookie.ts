// noinspection RegExpRedundantEscape

export const getAuthCookie = () => {
    const name = "accessToken"
    const matches = document.cookie.match(
        // eslint-disable-next-line no-useless-escape
        new RegExp('(?:^|; )' + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + '=([^;]*)')
    );
    return matches ? decodeURIComponent(matches[1]) : undefined;
}

export const getAccessToken = () => {
    const name = "accessToken"
    const matches = document.cookie.match(
        // eslint-disable-next-line no-useless-escape
        new RegExp('(?:^|; )' + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + '=([^;]*)')
    );
    if (matches) {
        const prefix = 'Bearer ';
        if (matches[1].startsWith(prefix)) {
            return matches[1].slice(prefix.length).trim();
        }
        return undefined;
    }

    return undefined;
}