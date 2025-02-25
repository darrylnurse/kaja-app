import React, { useState, useEffect } from 'react';

function TransportationSelector({ selectedDate, handleTransportationChange }) {
  const [transportationEntries, setTransportationEntries] = useState([{ type: '', price: '' }]);

  useEffect(() => {
    // Fetch the stored transportation data for the selected date
    const storedTransportationData = JSON.parse(localStorage.getItem('transportationData')) || {};
    const transportationForDate = storedTransportationData[selectedDate] || [{ type: '', price: '' }];

    // Set the fetched data to the state
    setTransportationEntries(transportationForDate);
  }, [selectedDate]);

  const handleEntryChange = (index, field, value) => {
    if (value === "remove") {
      // Remove the entry if "Remove" option is selected
      const newEntries = transportationEntries.filter((_, i) => i !== index);
      setTransportationEntries(newEntries);
      handleTransportationChange(selectedDate, newEntries);
    } else {
      // Update the entry with new type or price
      const newEntries = transportationEntries.map((entry, i) => {
        if (i === index) {
          return { ...entry, [field]: value };
        }
        return entry;
      });
      setTransportationEntries(newEntries);
      handleTransportationChange(selectedDate, newEntries);
    }
  };

  const addTransportationEntry = () => {
    setTransportationEntries([...transportationEntries, { type: '', price: '' }]);
  };

  return (
    <div className="bg-white px-4 pt-2 pb-1 small:p-4 rounded-lg shadow-md mx-auto text-center mb-1 small:mb-5">
      <h3 className="text-lg font-semibold text-gray-700 mb-1 small:mb-3">Transportation for {selectedDate}</h3>
      <div className="h-24 overflow-y-auto overflow-x-hidden w-full xl:h-auto">
        {transportationEntries.map((entry, index) => (
          <div key={index} className="mb-2 small:mb-4">
            <select
              className="bg-gray-200 rounded small:p-2 p-1 mr-2 w-full"
              value={entry.type}
              onChange={(e) => handleEntryChange(index, 'type', e.target.value)}
            >
              <option value="">Select Transportation</option>
              <option value="Car">Car</option>
              <option value="Bus">Bus</option>
              <option value="Train">Train</option>
              <option value="Plane">Plane</option>
              {transportationEntries.length > 1 && <option value="remove">Remove</option>}
              {/* Add more transportation types */}
            </select>
            <div className="flex mt-2">
              <span className="bg-gray-200 rounded-l p-2 flex items-center text-gray-700">$</span>
              <input
                className="bg-gray-200 rounded-r rounded-l-none p-2 w-full"
                type="text"
                pattern="\d*"
                placeholder="Price"
                value={entry.price}
                onChange={(e) => handleEntryChange(index, 'price', e.target.value)}
              />
            </div>
          </div>
        ))}
      </div>
      <button
        className="bg-coral text-white p-2 rounded small:mt-2 hover:bg-coral-dark"
        onClick={addTransportationEntry}
      >
        Add More Transportation
      </button>
    </div>
  );
}

export default TransportationSelector;
