export const getRandomFromMap = <K, T>(map: Map<K, T>): T | undefined => {
    if (map.size > 0) {
        const objects = Array.from(map.values());
        const randomId = Math.floor(Math.random() * (objects.length));

        return objects[randomId];
    } else
        return undefined;
};