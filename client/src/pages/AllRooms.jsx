import React, { useState, useEffect } from 'react';
import { facilityIcons, roomsDummyData } from '../assets/assets';
import { useNavigate } from 'react-router-dom';
import StarRating from '../components/StarRating';
import { assets } from '../assets/assets';

// CheckBox Component
const CheckBox = ({ label, selected = false, onChange = () => { } }) => {
  return (
    <label className="flex items-center gap-3 cursor-pointer mt-2 text-sm">
      <input
        type="checkbox"
        checked={selected}
        onChange={(e) => onChange(e.target.checked, label)}
      />
      <span className='font-light select-none'>{label}</span>
    </label>
  );
};

// RadioButton Component
const RadioButton = ({ label, selected = false, onChange = () => { } }) => {
  return (
    <label className="flex items-center gap-3 cursor-pointer mt-2 text-sm">
      <input
        type="radio"
        name="sortOption"
        checked={selected}
        onChange={() => onChange(label)}
      />
      <span className='font-light select-none'>{label}</span>
    </label>
  );
};

const AllRooms = () => {
  const navigate = useNavigate();
  const [openFilters, setOpenFilters] = useState(false);
  const [filteredRooms, setFilteredRooms] = useState(roomsDummyData); // State for filtered rooms

  const roomTypes = [
    "Single Bed",
    "Double Bed",
    "Luxury Room",
    "Family Suite",
  ];
  const priceRanges = [
    '0 to 500',
    '500 to 1000',
    '1000 to 2000',
    '2000 to 3000',
  ];
  const sortOptions = [
    "Price Low to High",
    "Price High to Low",
    "Newest First"
  ];

  // State for selected filters
  const [selectedRoomTypes, setSelectedRoomTypes] = useState([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState(null);
  const [selectedSortOption, setSelectedSortOption] = useState(null);

    // Handlers for filter changes
    const handleRoomTypeChange = (isChecked, label) => {
        if (isChecked) {
            setSelectedRoomTypes(prev => [...prev, label]);
        } else {
            setSelectedRoomTypes(prev => prev.filter(type => type !== label));
        }
    };

    const handlePriceRangeChange = (label) => {
        setSelectedPriceRange(label); // Only one price range can be selected
    };

    const handleSortOptionChange = (label) => {
        setSelectedSortOption(label);
    };

    const handleClearFilters = () => {
        setSelectedRoomTypes([]);
        setSelectedPriceRange(null);
        setSelectedSortOption(null);
        setOpenFilters(false); // Optionally close the filter section on clear
    };

  // Apply filters and sorting
  useEffect(() => {
    let tempRooms = [...roomsDummyData];

    // 1. Filter by Room Type
    if (selectedRoomTypes.length > 0) {
      tempRooms = tempRooms.filter(room => {
        return selectedRoomTypes.includes(room.roomType); // Assuming each room has a 'type' property
      });
    }

    // 2. Filter by Price Range
        if (selectedPriceRange) {
            const [min, max] = selectedPriceRange.split(' to ').map(Number);
            tempRooms = tempRooms.filter(room => {
                return room.pricePerNight >= min && room.pricePerNight <= max;
            });
        }

    // 3. Sorting
    if (selectedSortOption) {
      if (selectedSortOption === "Price Low to High") {
        tempRooms.sort((a, b) => a.pricePerNight - b.pricePerNight);
      } else if (selectedSortOption === "Price High to Low") {
        tempRooms.sort((a, b) => b.pricePerNight - a.pricePerNight);
      } else if (selectedSortOption === "Newest First") {
        //  tempRooms.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));  //use if you have date
        tempRooms.sort((a,b) => b._id.localeCompare(a._id)); //added a fallback, you can use any unique Id.
      }
    }
    setFilteredRooms(tempRooms);
  }, [selectedRoomTypes, selectedPriceRange, selectedSortOption]);

  return (
    <div className='flex flex-col-reverse lg:flex-row items-start justify-between pt-28 md:pt-35 px-4 md:px-16 lg:px-24 xl:px-32'>
      <div>
        <div className='flex flex-col items-start text-left'>
          <h1 className='font-playfair text-4xl md:text-[40px]'>Hotel Rooms</h1>
          <p className='text-sm md:text-base text-gray-500/90 mt-2 max-w-[74ch]'>
            Take advantage of our limited-time offers and special packages to enhance your stay and create unforgettable memories.
          </p>
        </div>
        {filteredRooms.map((room) => ( // Use filteredRooms here
          <div key={room._id} className='flex flex-col md:flex-row items-start py-10 gap-6 border-b border-gray-300 last:pb-30 last:border-0'>
            <img
              onClick={() => {
                navigate(`/rooms/${room._id}`);
                window.scrollTo(0, 0);
              }}
              src={room.images[0]}
              alt="hotel-img"
              title='View Room Details'
              className='max-h-65 md:w-1/2 rounded-xl shadow-lg object-cover cursor-pointer'
            />
            <div className='md:w-1/2 flex flex-col gap-2'>
              <p className='text-gray-500'>{room.hotel.city}</p>
              <p
                onClick={() => {
                  navigate(`/rooms/${room._id}`);
                  window.scrollTo(0, 0);
                }}
                className='text-gray-800 text-3xl font-playfair cursor-pointer'
              >
                {room.hotel.name}
              </p>
              <div className='flex items-center'>
                <StarRating />
                <p className='flex items-center ml-2 text-sm text-gray-600'> 200+ reviews </p>
              </div>
              <div className='flex items-center gap-1 text-gray-500 mt-2 text-sm'>
                <img src={assets.locationIcon} alt="location-icon" className='w-4 h-4' />
                <span>{room.hotel.address}</span>
              </div>
              {/* Room Amenities */}
              <div className='flex flex-wrap items-center mt-3 mb-6 gap-2'>
                {room.amenities.map((item, index) => (
                  <div key={index} className='flex items-center gap-1 px-2 py-1 rounded-lg bg-[#F5F5FF]/70'>
                    <img src={facilityIcons[item]} alt={item} className='w-4 h-4' />
                    <p className='text-xs'>{item}</p>
                  </div>
                ))}
              </div>
              {/* Room Price per Night */}
              <div>
                <p className='text-xl font-medium text-gray-700'>${room.pricePerNight} /night</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/*filters*/}
      <div className='bg-white w-80 border border-gray-300 text-gray-600 max-lg:mb-8 min-lg:mt-16 p-4 rounded-lg shadow-md'>
        <div className={`flex items-center justify-between px-5 py-2.5 min-lg:border-b border-gray-300 ${openFilters && "border-b"}`}>
          <p className='text-base font-medium text-gray-800'>FILTERS</p>
          <div className='text-xs cursor-pointer'>
            <span onClick={() => setOpenFilters(!openFilters)} className='lg:hidden text-blue-600 hover:underline'>
              {openFilters ? 'HIDE' : 'SHOW'}
            </span>
            <span className='hidden lg:block text-blue-600 hover:underline' onClick={handleClearFilters}>CLEAR</span>
          </div>
        </div>
        <div className={`${openFilters ? 'h-auto' : "h-0 lg:h-auto"} overflow-hidden transition-all duration-700`}>
          <div className='px-5 pt-5 border-b border-gray-200 pb-4'>
            <p className='font-medium text-gray-800 pb-2'>Room Type</p>
            {roomTypes.map((roomType, index) => (
              <CheckBox
                key={index}
                label={roomType}
                selected={selectedRoomTypes.includes(roomType)}
                onChange={handleRoomTypeChange}
              />
            ))}
          </div>
          <div className='px-5 pt-5 border-b border-gray-200 pb-4'>
            <p className='font-medium text-gray-800 pb-2'>Price Range</p>
            {priceRanges.map((range, index) => {
                const [min, max] = range.split(' to ').map(Number);
                const isSelected = selectedPriceRange === range;
                return (
                    <CheckBox
                        key={index}
                        label={`$${range}`}
                        selected={isSelected}
                        onChange={() => handlePriceRangeChange(range)} 
                    />
                );
            })}
          </div>
          <div className='px-5 pt-5 pb-7'>
            <p className='font-medium text-gray-800 pb-2'>Sort By</p>
            {sortOptions.map((option, index) => (
              <RadioButton
                key={index}
                label={option}
                selected={selectedSortOption === option}
                onChange={handleSortOptionChange}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllRooms;
