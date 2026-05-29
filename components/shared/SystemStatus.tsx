import { TSystemStatus } from '@/types/system-status.type'
import { Activity, Database, Shield, CheckCircle2, XCircle, Loader2 } from 'lucide-react'

type Props = {
  systemStatus: TSystemStatus | null
}

function StatusRow({
  icon: Icon,
  label,
  value,
  status,
}: {
  icon: React.ElementType
  label: string
  value: string
  status: 'ok' | 'error' | 'neutral'
}) {
  const statusColors = {
    ok: 'text-emerald-400',
    error: 'text-red-400',
    neutral: 'text-gray-400',
  }

  const dotColors = {
    ok: 'bg-emerald-400 shadow-emerald-400/50',
    error: 'bg-red-400 shadow-red-400/50',
    neutral: 'bg-gray-500',
  }

  return (
    <div className="flex items-center justify-between py-3.5 px-4 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.05] transition-colors">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
          <Icon className="w-4 h-4 text-gray-400" />
        </div>
        <span className="text-sm font-semibold text-gray-300">{label}</span>
      </div>
      <div className="flex items-center gap-2.5">
        <span className={`text-sm font-bold ${statusColors[status]}`}>{value}</span>
        <span
          className={`w-2 h-2 rounded-full shadow-[0_0_6px] ${dotColors[status]} ${
            status === 'ok' ? 'animate-pulse' : ''
          }`}
        />
      </div>
    </div>
  )
}

function SystemStatus({ systemStatus }: Props) {
  const allOk = Boolean(
    systemStatus?.kite_authenticated &&
    systemStatus?.is_runtime_ready &&
    systemStatus?.total_instruments > 0
  )

  return (
    <div className="bg-[#0a0a0a] rounded-[2.5rem] p-8">
      {!systemStatus ? (
        <div className="flex flex-col items-center justify-center py-12 gap-3">
          <Loader2 className="w-6 h-6 text-gray-500 animate-spin" />
          <p className="text-sm text-gray-500 font-medium">Loading system status…</p>
        </div>
      ) : (
        <>
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-1">
              <Activity className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-black text-white tracking-tight">System Status</h2>
            </div>
            <p className="text-xs text-gray-500 font-medium ml-8">
              Real-time health of your trading environment
            </p>
          </div>

          {/* Overall badge */}
          <div
            className={`flex items-center gap-2.5 px-4 py-3 rounded-xl mb-5 border ${
              allOk
                ? 'bg-emerald-500/10 border-emerald-500/20'
                : 'bg-red-500/10 border-red-500/20'
            }`}
          >
            {allOk ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <XCircle className="w-4 h-4 text-red-400 shrink-0" />
            )}
            <span className={`text-sm font-bold ${allOk ? 'text-emerald-400' : 'text-red-400'}`}>
              {allOk ? 'All systems operational' : 'Action required'}
            </span>
          </div>

          {/* Status rows */}
          <div className="flex flex-col gap-2">
            <StatusRow
              icon={Shield}
              label="Kite Authentication"
              value={systemStatus.kite_authenticated ? 'Authenticated' : 'Not logged in'}
              status={systemStatus.kite_authenticated ? 'ok' : 'error'}
            />
            <StatusRow
              icon={Activity}
              label="Runtime"
              value={systemStatus.is_runtime_ready ? 'Ready' : 'Not ready'}
              status={systemStatus.is_runtime_ready ? 'ok' : 'error'}
            />
            <StatusRow
              icon={Database}
              label="Instruments"
              value={
                systemStatus.total_instruments > 0
                  ? `${systemStatus.total_instruments.toLocaleString()} loaded`
                  : 'None loaded'
              }
              status={systemStatus.total_instruments > 0 ? 'ok' : 'error'}
            />
          </div>
        </>
      )}
    </div>
  )
}

export default SystemStatus