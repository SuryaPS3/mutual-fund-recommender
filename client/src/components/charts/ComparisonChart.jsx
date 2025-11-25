import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const ComparisonChart = ({ data, funds }) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        {funds.map((fund, index) => (
          <Line
            key={fund.fund_id}
            type="monotone"
            dataKey={`fund_${fund.fund_id}`}
            stroke={`hsl(${index * 60}, 70%, 50%)`}
            name={fund.scheme_name}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
};

export default ComparisonChart;