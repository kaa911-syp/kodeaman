export interface ZapAlertInstance {
  uri: string;
  method: string;
  param: string;
  attack: string;
  evidence: string;
  otherinfo: string;
}

export interface ZapAlert {
  pluginid: string;
  alertRef: string;
  alert: string;
  name: string;
  riskcode: string;
  confidence: string;
  riskdesc: string;
  desc: string;
  instances: ZapAlertInstance[];
  count: string;
  solution: string;
  otherinfo: string;
  reference: string;
  cweid: string;
  wascid: string;
  sourceid: string;
  tags?: Record<string, string>;
}

export interface ZapSite {
  "@name": string;
  "@host": string;
  "@port": string;
  "@ssl": string;
  alerts: ZapAlert[];
}

export interface ZapRawReport {
  "@version": string;
  "@generated": string;
  site: ZapSite[];
}

export interface ZapScanContext {
  reportPath?: string;
  targetUrl?: string;
  configPath?: string;
  extraArgs?: string[];
  timeout?: number;
}
