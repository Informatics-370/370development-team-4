import { EstimateLineVM } from "./estimate-line-vm";

export interface EstimateVM {
    estimateID : number;
    estimateStatusID : number;
    estimateStatusDescription : string;
    estimateDurationID : number;
    confirmedTotal : number;
    userId : string;
    customerFullName : string;
    estimate_Lines : EstimateLineVM[];
}
