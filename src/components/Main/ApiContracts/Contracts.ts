export interface ingredientSectionData {
    title: string
}

export interface FoodItem {
    _id: string;
    name: string;
    type: string;
    proteins: number;
    fat: number;
    carbohydrates: number;
    calories: number;
    price: number;
    image: string;
    image_mobile: string;
    image_large: string;
    __v: number;
}

export interface IngredientsApiResponse {
    success: boolean;
    data: FoodItem[];
    loading: boolean;
    error: string;
}