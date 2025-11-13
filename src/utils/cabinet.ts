import type { Cabinet } from '@/types/api.types';

type RawCabinet = Cabinet & {
  device_id?: string;
  connection_type?: 'wifi' | 'ethernet' | '4g';
  ip_address?: string;
  last_ping_at?: string;
  signal_strength?: number;
};

export const normalizeCabinet = (cabinet: RawCabinet): Cabinet => ({
  ...cabinet,
  deviceId: cabinet.deviceId ?? cabinet.device_id,
  connectionType: cabinet.connectionType ?? cabinet.connection_type,
  ipAddress: cabinet.ipAddress ?? cabinet.ip_address,
  lastPingAt: cabinet.lastPingAt ?? cabinet.last_ping_at,
  signalStrength: cabinet.signalStrength ?? cabinet.signal_strength,
});
