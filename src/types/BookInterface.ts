export interface BookInterface {
    id: string;
    volumeInfo: {
        title: string;
        authors?: string[];
        imageLinks?: {
            thumbnail: string;
        };
        description?: string;
    };
}