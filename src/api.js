export const fetchData = async (url, options) => {
    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } 
    catch (error) {
        throw new Error(`Error during fetch: ${error.message}`);
    }
};