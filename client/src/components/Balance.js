export const Balance = ({ value }) => {
  // Round the value to two decimal places
  const roundedValue = Math.round(value * 100) / 100// Rounds to two decimal places

  return (
    <div className="flex">
      <div className="font-bold text-lg">
        Your balance
      </div>
      <div className="font-semibold ml-4 text-lg">
        Rs {roundedValue}
      </div>
    </div>
  );
};
