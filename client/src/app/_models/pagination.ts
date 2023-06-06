export interface Pagination{
    currentPage: number;
    itemsPerPage: number;
    totalItems: number;
    totalPages: number;
}

//result what we get back from API

export class PaginatedResult<T>{
    result?: T;
    pagination?: Pagination;
}