export function calculateEarningsData(
    income: number,
    mileage: number
) {
    const mileage_rate = 0.725;     // IRS mileage rate for 2026
    const se_tax_rate = 0.153;

    const gross_profit = income - mileage * mileage_rate;
    const se_tax = gross_profit * se_tax_rate;
    const net_profit = income - se_tax;

    return {
        gross_profit,
        se_tax,
        net_profit
    }
}
