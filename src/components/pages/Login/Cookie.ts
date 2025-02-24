export const SetAuthCookie = (setErrorMessage: () => void, refreshToken: string, accessToke: string) => {
    setErrorMessage();
    localStorage.removeItem('refreshToken');
    localStorage.setItem('refreshToken', refreshToken);

    const date = new Date();
    date.setTime(date.getTime() + (20 * 60 * 1000));
    document.cookie = `accessToken=${accessToke}; expires=${date.toUTCString()}; path=/`;
}