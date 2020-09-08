interface Product {
    Id: number;
    Name: string;
    Ingredient: Ingredient;
    CreatedBy: User;
    CreatedDate: string;
}

interface UserProduct {
    Id: number;
    ProductId: number;
    Product: Product;
    Quantity: number;
    AmountAvailable: number;
    Size: number;
    Units: string;
    UserId: string;
}