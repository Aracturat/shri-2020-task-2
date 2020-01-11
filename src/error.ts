export interface Error {
    code: string;
    error: string;

    location: {
        start: { line: number; column: number; };
        end: { line: number; column: number; };
    };
}
