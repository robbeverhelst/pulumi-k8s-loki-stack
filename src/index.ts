import { config, Helm } from '@homelab/shared'

const cfg = config('loki-stack')

const loki = new Helm('loki-stack', {
  namespace: cfg.get('namespace', 'loki-stack'),
  chart: 'loki-stack',
  repo: 'https://grafana.github.io/helm-charts',
  version: process.env.LOKI_STACK_VERSION || cfg.get('version'),
  values: {
    loki: {
      enabled: true,
      persistence: {
        enabled: true,
        storageClassName: cfg.get('storageClass', 'truenas-hdd-mirror-nfs'),
        size: cfg.get('lokiSize', '50Gi'),
      },
      service: {
        type: 'ClusterIP',
        port: 3100,
      },
    },
    promtail: {
      enabled: true,
    },
    grafana: { enabled: false },
    prometheus: { enabled: false },
  },
})

export const namespace = loki.namespace.metadata.name
export const release = loki.release.name
