export interface IRentalRequest {
    propertyId: string;
    startDate: Date;
    endDate: Date;
    totalPrice: number,
    message?: string;
}