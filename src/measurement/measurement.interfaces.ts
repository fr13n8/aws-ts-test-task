export interface Measurement {
    id: string;
    name: string;
    updatedAt?: string;
    createdAt?: string;
}

export type MeasurementList = Measurement[];
