export declare function dbCID(): Promise<{
    success: boolean;
    error: string;
    type: string;
    cid?: undefined;
    id?: undefined;
    created_at?: undefined;
    unixTimestamp?: undefined;
} | {
    success: boolean;
    cid: any;
    id: any;
    created_at: any;
    unixTimestamp: string;
    error?: undefined;
    type?: undefined;
}>;
//# sourceMappingURL=dbCID.d.ts.map