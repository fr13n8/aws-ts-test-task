export interface Point {
    id: string;
    x: number;
    y: number;
    z: number;
    measurementId: string;
    accuracy: number;
    updatedAt?: string;
    createdAt?: string;
}

export type PointsList = Point[];
