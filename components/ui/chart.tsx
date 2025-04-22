interface ChartProps {
  data: any[]
  index: string
  categories: string[]
  colors: string[]
  valueFormatter?: (value: number) => string
  yAxisWidth?: number
}

export const BarChart = ({ data, index, categories, colors, valueFormatter, yAxisWidth }: ChartProps) => {
  return (
    <div>
      {/* Placeholder for BarChart */}
      <p>BarChart Component</p>
    </div>
  )
}

export const LineChart = ({ data, index, categories, colors, valueFormatter, yAxisWidth }: ChartProps) => {
  return (
    <div>
      {/* Placeholder for LineChart */}
      <p>LineChart Component</p>
    </div>
  )
}

interface PieChartProps {
  data: any[]
  index: string
  category: string
  valueFormatter?: (value: number) => string
  colors: string[]
}

export const PieChart = ({ data, index, category, valueFormatter, colors }: PieChartProps) => {
  return (
    <div>
      {/* Placeholder for PieChart */}
      <p>PieChart Component</p>
    </div>
  )
}
