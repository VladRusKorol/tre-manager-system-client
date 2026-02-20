export interface ITireStatusTrans {
  idTireStatusTrans: number;
  idTireStatusTransPrev?: number | null;
  idLocation: number;
  idStatus: number;
  idTire: number;
  idTirePosition: number;
  idProcessEvent: number;
  startTimestamp: Date | string;
  startDate: Date | string;
  endTimestamp?: Date | string | null;
  endDate: Date | string | null;
  comment?: string | null;
  startMiliage: number;
  endMiliage?: number | null;
  durationMiliage?: number | null;
}