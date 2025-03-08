export interface ReviewInterface {
    _id?: string;
    bookId?: string;
    bookTitle: string;
    userId?:  string;
    username: string;
    reviewText: string;
    rating: number;
    created?: string;
    __v?: number;
}