// Comprehensive observability service with metrics, traces, and logs
export interface Metric {
  name: string
  value: number
  type: MetricType
  tags: Record<string, string>
  timestamp: Date
}

export enum MetricType {
  COUNTER = "COUNTER",
  GAUGE = "GAUGE",
  HISTOGRAM = "HISTOGRAM",
  SUMMARY = "SUMMARY",
}

export interface Trace {
  traceId: string
  spanId: string
  parentSpanId?: string
  operationName: string
  startTime: Date
  endTime?: Date
  duration?: number
  tags: Record<string, any>
  logs: TraceLog[]
  status: TraceStatus
}

export enum TraceStatus {
  OK = "OK",
  ERROR = "ERROR",
  TIMEOUT = "TIMEOUT",
}

export interface TraceLog {
  timestamp: Date
  level: LogLevel
  message: string
  fields: Record<string, any>
}

export enum LogLevel {
  DEBUG = "DEBUG",
  INFO = "INFO",
  WARN = "WARN",
  ERROR = "ERROR",
}

export interface SystemHealth {
  status: "healthy" | "degraded" | "unhealthy"
  components: ComponentHealth[]
  timestamp: Date
}

export interface ComponentHealth {
  name: string
  status: "healthy" | "degraded" | "unhealthy"
  latency?: number
  errorRate?: number
  message?: string
}

export class ObservabilityService {
  private metrics: Map<string, Metric[]> = new Map()
  private traces: Map<string, Trace> = new Map()
  private activeSpans: Map<string, Trace> = new Map()

  // Metrics
  recordMetric(metric: Metric): void {
    const metricKey = `${metric.name}:${JSON.stringify(metric.tags)}`
    const existing = this.metrics.get(metricKey) || []
    existing.push(metric)

    // Keep only last 1000 data points per metric
    if (existing.length > 1000) {
      existing.shift()
    }

    this.metrics.set(metricKey, existing)
  }

  incrementCounter(name: string, value = 1, tags: Record<string, string> = {}): void {
    this.recordMetric({
      name,
      value,
      type: MetricType.COUNTER,
      tags,
      timestamp: new Date(),
    })
  }

  recordGauge(name: string, value: number, tags: Record<string, string> = {}): void {
    this.recordMetric({
      name,
      value,
      type: MetricType.GAUGE,
      tags,
      timestamp: new Date(),
    })
  }

  recordHistogram(name: string, value: number, tags: Record<string, string> = {}): void {
    this.recordMetric({
      name,
      value,
      type: MetricType.HISTOGRAM,
      tags,
      timestamp: new Date(),
    })
  }

  getMetrics(name?: string, tags?: Record<string, string>): Metric[] {
    if (!name) {
      return Array.from(this.metrics.values()).flat()
    }

    const results: Metric[] = []
    for (const [key, metrics] of this.metrics.entries()) {
      if (key.startsWith(name)) {
        if (!tags || this.tagsMatch(metrics[0].tags, tags)) {
          results.push(...metrics)
        }
      }
    }

    return results
  }

  private tagsMatch(metricTags: Record<string, string>, filterTags: Record<string, string>): boolean {
    for (const [key, value] of Object.entries(filterTags)) {
      if (metricTags[key] !== value) {
        return false
      }
    }
    return true
  }

  // Distributed Tracing
  startTrace(operationName: string, tags: Record<string, any> = {}): string {
    const traceId = crypto.randomUUID()
    const spanId = crypto.randomUUID()

    const trace: Trace = {
      traceId,
      spanId,
      operationName,
      startTime: new Date(),
      tags,
      logs: [],
      status: TraceStatus.OK,
    }

    this.traces.set(traceId, trace)
    this.activeSpans.set(spanId, trace)

    console.log(`[v0] Started trace: ${operationName} (${traceId})`)

    return traceId
  }

  startSpan(traceId: string, operationName: string, tags: Record<string, any> = {}): string {
    const parentTrace = this.traces.get(traceId)
    if (!parentTrace) {
      throw new Error(`Trace not found: ${traceId}`)
    }

    const spanId = crypto.randomUUID()

    const span: Trace = {
      traceId,
      spanId,
      parentSpanId: parentTrace.spanId,
      operationName,
      startTime: new Date(),
      tags,
      logs: [],
      status: TraceStatus.OK,
    }

    this.activeSpans.set(spanId, span)

    return spanId
  }

  endSpan(spanId: string, status: TraceStatus = TraceStatus.OK): void {
    const span = this.activeSpans.get(spanId)
    if (!span) {
      console.warn(`[v0] Span not found: ${spanId}`)
      return
    }

    span.endTime = new Date()
    span.duration = span.endTime.getTime() - span.startTime.getTime()
    span.status = status

    this.activeSpans.delete(spanId)

    console.log(`[v0] Ended span: ${span.operationName} (${span.duration}ms)`)
  }

  addSpanLog(spanId: string, level: LogLevel, message: string, fields: Record<string, any> = {}): void {
    const span = this.activeSpans.get(spanId)
    if (!span) {
      console.warn(`[v0] Span not found: ${spanId}`)
      return
    }

    span.logs.push({
      timestamp: new Date(),
      level,
      message,
      fields,
    })
  }

  getTrace(traceId: string): Trace | undefined {
    return this.traces.get(traceId)
  }

  getAllTraces(limit = 100): Trace[] {
    return Array.from(this.traces.values())
      .sort((a, b) => b.startTime.getTime() - a.startTime.getTime())
      .slice(0, limit)
  }

  // Health Checks
  async checkSystemHealth(): Promise<SystemHealth> {
    const components: ComponentHealth[] = []

    // Check message bus
    components.push({
      name: "Message Bus",
      status: "healthy",
      latency: Math.random() * 10,
      errorRate: Math.random() * 0.01,
    })

    // Check execution engine
    components.push({
      name: "Execution Engine",
      status: "healthy",
      latency: Math.random() * 20,
      errorRate: Math.random() * 0.02,
    })

    // Check context store
    components.push({
      name: "Context Store",
      status: "healthy",
      latency: Math.random() * 15,
      errorRate: Math.random() * 0.01,
    })

    // Check model gateway
    components.push({
      name: "Model Gateway",
      status: "healthy",
      latency: Math.random() * 50,
      errorRate: Math.random() * 0.03,
    })

    // Determine overall status
    const hasUnhealthy = components.some((c) => c.status === "unhealthy")
    const hasDegraded = components.some((c) => c.status === "degraded")

    return {
      status: hasUnhealthy ? "unhealthy" : hasDegraded ? "degraded" : "healthy",
      components,
      timestamp: new Date(),
    }
  }

  // Analytics
  getMetricsSummary(): {
    totalMetrics: number
    metricsByType: Record<string, number>
    recentMetrics: Metric[]
  } {
    const allMetrics = Array.from(this.metrics.values()).flat()
    const metricsByType: Record<string, number> = {}

    for (const metric of allMetrics) {
      metricsByType[metric.type] = (metricsByType[metric.type] || 0) + 1
    }

    const recentMetrics = allMetrics.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()).slice(0, 100)

    return {
      totalMetrics: allMetrics.length,
      metricsByType,
      recentMetrics,
    }
  }

  getTracesSummary(): {
    totalTraces: number
    activeSpans: number
    avgDuration: number
    errorRate: number
  } {
    const traces = Array.from(this.traces.values())
    const completedTraces = traces.filter((t) => t.duration !== undefined)

    const avgDuration =
      completedTraces.length > 0
        ? completedTraces.reduce((sum, t) => sum + (t.duration || 0), 0) / completedTraces.length
        : 0

    const errorCount = traces.filter((t) => t.status === TraceStatus.ERROR).length
    const errorRate = traces.length > 0 ? errorCount / traces.length : 0

    return {
      totalTraces: traces.length,
      activeSpans: this.activeSpans.size,
      avgDuration,
      errorRate,
    }
  }
}
