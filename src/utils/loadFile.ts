import fs from "fs";

export const loadFile = (path: string): Promise<string> => {
    return new Promise<string>((resolve, reject) => {
        fs.readFile(path, 'utf-8', (err, data) => {
            if (err) {
                reject(err);
            }

            resolve(data);
        });
    });
};

export const loadFileAsType = async <T>(path: string): Promise<T> => {
    return JSON.parse(await loadFile(path)) as T;
};
