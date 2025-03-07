export interface ReviewInterface {
    _id?: string;
    bookId?: string;
    userId?: string;
    username: string;
    reviewText: string;
    rating: number;
    createdAt: string;
    __v?: number;
}