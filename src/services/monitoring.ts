// Monitoring & error tracking service (spec 2.14 + 2.15)
export interface AlertRule { id: string; api_id: string; metric: string; condition: string; threshold: number; window_min: number; channels: string[]; enabled: boolean; created_at: string; }
export interface Incident { id: string; api_id: string; title: string; severity: 'minor'|'major'|'critical'; status: 'open'|'investigating'|'resolved'; started_at: string; resolved_at: string|null; summary: string; }
export interface ErrorGroup { id: string; api_id: string; fingerprint: string; title: string; endpoint: string; status_code: number; first_seen: string; last_seen: string; occurrence_count: number; status: 'new'|'acknowledged'|'resolved'|'ignored'; assigned_to: string|null; }
export interface MonitoringSample { api_id: string; timestamp: string; avg_latency_ms: number; p95_latency_ms: number; p99_latency_ms: number; error_rate: number; request_count: number; }

const alertRules: AlertRule[] = [];
const incidents: Incident[] = [];
const errorGroups: ErrorGroup[] = [];
const samples: MonitoringSample[] = [];

export const monitoring = {
  // Alert Rules
  listRules(apiId: string): AlertRule[] { return alertRules.filter(r => r.api_id === apiId); },
  createRule(d: Omit<AlertRule,'id'|'created_at'>): AlertRule {
    const r: AlertRule = { id:'alrt-'+crypto.randomUUID().slice(0,6), ...d, created_at: new Date().toISOString() };
    alertRules.push(r); return r;
  },
  deleteRule(id: string, apiId: string): boolean {
    const idx = alertRules.findIndex(r => r.id === id && r.api_id === apiId);
    if (idx === -1) return false; alertRules.splice(idx, 1); return true;
  },
  updateRule(id: string, apiId: string, patch: Partial<AlertRule>): AlertRule|null {
    const r = alertRules.find(r => r.id === id && r.api_id === apiId);
    if (!r) return null; Object.assign(r, patch); return r;
  },

  // Incidents
  listIncidents(apiId: string): Incident[] {
    return incidents.filter(i => i.api_id === apiId).sort((a,b) => new Date(b.started_at).getTime() - new Date(a.started_at).getTime());
  },
  createIncident(d: Omit<Incident,'id'>): Incident {
    const i: Incident = { id:'inc-'+crypto.randomUUID().slice(0,6), ...d };
    incidents.push(i); return i;
  },
  updateIncident(id: string, patch: Partial<Incident>): Incident|null {
    const i = incidents.find(i => i.id === id); if (!i) return null;
    Object.assign(i, patch); if (patch.status === 'resolved') i.resolved_at = new Date().toISOString();
    return i;
  },

  // Error Groups
  listErrorGroups(apiId: string, status?: string): ErrorGroup[] {
    let r = errorGroups.filter(e => e.api_id === apiId);
    if (status) r = r.filter(e => e.status === status);
    return r.sort((a,b) => b.occurrence_count - a.occurrence_count);
  },
  getErrorGroup(id: string): ErrorGroup|null { return errorGroups.find(e => e.id === id) || null; },
  recordError(apiId: string, endpoint: string, statusCode: number, message: string): ErrorGroup {
    const fp = `${endpoint}:${statusCode}:${message.slice(0,50)}`;
    let group = errorGroups.find(e => e.api_id === apiId && e.fingerprint === fp);
    if (group) {
      group.occurrence_count++; group.last_seen = new Date().toISOString();
      if (group.status === 'resolved') group.status = 'new';
    } else {
      group = { id:'err-'+crypto.randomUUID().slice(0,6), api_id: apiId, fingerprint: fp, title: message, endpoint, status_code: statusCode, first_seen: new Date().toISOString(), last_seen: new Date().toISOString(), occurrence_count: 1, status: 'new', assigned_to: null };
      errorGroups.push(group);
    }
    return group;
  },
  updateErrorGroup(id: string, patch: Partial<ErrorGroup>): ErrorGroup|null {
    const g = errorGroups.find(e => e.id === id); if (!g) return null; Object.assign(g, patch); return g;
  },

  // Samples (for dashboards)
  recordSample(d: Omit<MonitoringSample,'timestamp'>): MonitoringSample {
    const s: MonitoringSample = { ...d, timestamp: new Date().toISOString() };
    samples.push(s); return s;
  },
  getRecentSamples(apiId: string, minutes = 60): MonitoringSample[] {
    const cutoff = Date.now() - minutes * 60000;
    return samples.filter(s => s.api_id === apiId && new Date(s.timestamp).getTime() > cutoff);
  },
  getCurrentHealth(apiId: string): { uptime: number; avg_latency: number; error_rate: number; status: 'healthy'|'degraded'|'down' } {
    const recent = this.getRecentSamples(apiId, 5);
    if (recent.length === 0) return { uptime: 100, avg_latency: 0, error_rate: 0, status: 'healthy' };
    const avgLat = recent.reduce((s,r)=>s+r.avg_latency_ms,0)/recent.length;
    const avgErr = recent.reduce((s,r)=>s+r.error_rate,0)/recent.length;
    let status: 'healthy'|'degraded'|'down' = 'healthy';
    if (avgErr > 10) status = 'down';
    else if (avgErr > 2 || avgLat > 500) status = 'degraded';
    return { uptime: 100 - avgErr, avg_latency: Math.round(avgLat*100)/100, error_rate: Math.round(avgErr*100)/100, status };
  },
};
export default monitoring;
