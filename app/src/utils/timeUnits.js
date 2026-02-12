// Conversões de períodos assumindo ano comercial de 360 dias e mês de 30 dias
// Unidades: 'dia' | 'mes' | 'trimestre' | 'semestre' | 'ano'

const toMonths = {
  dia: (v) => (v / 30),
  mes: (v) => v,
  trimestre: (v) => v * 3,
  semestre: (v) => v * 6,
  ano: (v) => v * 12,
};

const fromMonths = {
  dia: (v) => v * 30,
  mes: (v) => v,
  trimestre: (v) => v / 3,
  semestre: (v) => v / 6,
  ano: (v) => v / 12,
};

export function convertPeriods(value, fromUnit, toUnit) {
  if (value == null) return value;
  const f = (toMonths[fromUnit] || toMonths.mes)(value);
  return (fromMonths[toUnit] || fromMonths.mes)(f);
}

export const TIME_UNIT_OPTIONS = [
  { value: 'dia', label: 'dia(s)' },
  { value: 'mes', label: 'mês(es)' },
  { value: 'trimestre', label: 'trimestre(s)' },
  { value: 'semestre', label: 'semestre(s)' },
  { value: 'ano', label: 'ano(s)' },
];

export const RATE_UNIT_OPTIONS = [
  { value: 'dia', label: '% a.d.' },
  { value: 'mes', label: '% a.m.' },
  { value: 'trimestre', label: '% a.t.' },
  { value: 'semestre', label: '% a.s.' },
  { value: 'ano', label: '% a.a.' },
];
