export const apiErrorMsg = 'Упс! Космические тараканы сожрали интернет и я не могу получить ингредиенты'

export const formatDate = (dateString: string): string => {
    const date = new Date(dateString);

    const options: Intl.DateTimeFormatOptions = {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    };

    const time = date.toLocaleTimeString('ru-RU', options);
    const today = 'Сегодня,';

    return `${today} ${time}`;
}

export const getStatus = (status: string): string => {
    switch (status){
        case 'done':
            return 'Выполнен'
        case 'created':
            return 'Создан'
        case 'pending':
            return 'Готовится'
        default:
            return 'Неизвестен'
    }
}
