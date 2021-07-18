interface Product {
    id: number
    name: string
    ingredient: Ingredient
    createdBy: User
    createdDate: string
}

interface UserProduct {
    Id: number
    ProductId: number
    Product: Product
    Quantity: number
    AmountAvailable: number
    Size: number
    Units: string
    UserId: string
}
