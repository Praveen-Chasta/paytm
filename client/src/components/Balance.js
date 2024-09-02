export const Balance = ({ value }) => {
    // Convert value to integer and format it as needed
    const intValue = Math.floor(value); // Rounds down to the nearest integer
    
    return (
      <div className="flex">
        <div className="font-bold text-lg">
          Your balance
        </div>
        <div className="font-semibold ml-4 text-lg">
          Rs {intValue}
        </div>
      </div>
    );
  };
  