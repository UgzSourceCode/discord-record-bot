import { ContentParam } from "../types/contentParam";


export const replaceParams = (content: string, params: ContentParam[]): string => {
    let result = content;
    params.forEach(param => {
        result = result.replace(`{$${param.name}}`, param.content);
    });
    
    return result;
};
