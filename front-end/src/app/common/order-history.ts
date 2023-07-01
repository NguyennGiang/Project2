export class OrderHistory {
    constructor(public id: String, 
        public orderTrackingNumber: String, 
        public totalPrice: number, 
        public totalQuantity: number,
        public dateCreated: Date){}
}
