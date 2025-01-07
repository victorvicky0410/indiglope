import { useEffect } from 'react';

const useDocTitle = (title) => {
    useEffect(() => {
        if (title) {
            document.title = `${title} - Indiglope`;
        } else {
            document.title = 'Indiglope | The Perfect Bio Product';
        }
    }, [title]);

    return null;
};

export default useDocTitle;
