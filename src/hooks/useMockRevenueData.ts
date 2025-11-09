import { useMemo } from 'react';
import { RevenueStats } from '@/types/api.types';

type PeriodOption = '7d' | '30d' | '90d' | '1y';

/**
 * Hook para generar datos de ingresos de ejemplo
 * Útil para desarrollo cuando el backend no está disponible
 */
export function useMockRevenueData(period: PeriodOption): RevenueStats {
  return useMemo(() => {
    const days = period === '7d' ? 7 : period === '30d' ? 30 : period === '90d' ? 90 : 365;
    const byDay = [];
    let totalRevenue = 0;

    // Generar datos diarios
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);

      // Simular variación de ingresos
      const baseRevenue = 500;
      const variance = Math.random() * 300;
      const dayOfWeek = date.getDay();
      const weekendBoost = (dayOfWeek === 0 || dayOfWeek === 6) ? 1.5 : 1;

      const revenue = (baseRevenue + variance) * weekendBoost;
      const count = Math.floor(Math.random() * 15) + 5;

      totalRevenue += revenue;

      byDay.push({
        date: date.toISOString().split('T')[0],
        revenue: Math.round(revenue * 100) / 100,
        count,
      });
    }

    // Calcular ingresos por período
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    const todayData = byDay.find(d => d.date === todayStr);
    const todayRevenue = todayData?.revenue || 0;

    const last7Days = byDay.slice(-7);
    const weekRevenue = last7Days.reduce((sum, d) => sum + d.revenue, 0);

    const last30Days = byDay.slice(-30);
    const monthRevenue = last30Days.reduce((sum, d) => sum + d.revenue, 0);

    // Simular desglose por tipo
    const byType = [
      {
        type: 'RENTAL' as const,
        total: totalRevenue * 0.7,
        count: Math.floor(byDay.reduce((sum, d) => sum + d.count, 0) * 0.7),
      },
      {
        type: 'LATE_FEE' as const,
        total: totalRevenue * 0.2,
        count: Math.floor(byDay.reduce((sum, d) => sum + d.count, 0) * 0.15),
      },
      {
        type: 'LOST_FEE' as const,
        total: totalRevenue * 0.08,
        count: Math.floor(byDay.reduce((sum, d) => sum + d.count, 0) * 0.05),
      },
      {
        type: 'REFUND' as const,
        total: totalRevenue * 0.02,
        count: Math.floor(byDay.reduce((sum, d) => sum + d.count, 0) * 0.03),
      },
    ];

    const totalCount = byDay.reduce((sum, d) => sum + d.count, 0);
    const averageTransaction = totalCount > 0 ? totalRevenue / totalCount : 0;

    return {
      totalRevenue: Math.round(totalRevenue * 100) / 100,
      todayRevenue: Math.round(todayRevenue * 100) / 100,
      weekRevenue: Math.round(weekRevenue * 100) / 100,
      monthRevenue: Math.round(monthRevenue * 100) / 100,
      byDay,
      byType,
      averageTransaction: Math.round(averageTransaction * 100) / 100,
    };
  }, [period]);
}

/**
 * Verifica si la respuesta del API es válida
 */
export function isValidRevenueStats(data: any): data is RevenueStats {
  return (
    data &&
    typeof data === 'object' &&
    'byDay' in data &&
    Array.isArray(data.byDay)
  );
}
