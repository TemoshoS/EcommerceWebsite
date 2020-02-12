export class Deliveryform {

    username: string;
    deliveryaddress: string;
    phone: string;
    email: string;
    message: string;
    amount: number;

    constructor(username: string,deliveryaddress: string, phone: string, email: string, message: string, amount: number) {
        this.username = username;
        this.deliveryaddress =deliveryaddress;
        this.phone = phone;
        this.email = email;
        this.message = message;
        this.amount = amount;
      
    }
}
