import { generateHash, generateBlockHash, generateBookingId } from "@/lib/blockchain";

const STORAGE_KEYS = {
  BOOKINGS: 'gaschain_mock_bookings_v2',
  BLOCKS: 'gaschain_mock_blocks_v2',
  SUBSIDIES: 'gaschain_mock_subsidies_v2'
};

const getStorage = (key, defaultValue = []) => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : defaultValue;
};

const setStorage = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
};

export const mockData = {
  bookings: {
    list: () => getStorage(STORAGE_KEYS.BOOKINGS),
    create: (data) => {
      const bookings = getStorage(STORAGE_KEYS.BOOKINGS);
      const newBooking = {
        ...data,
        id: Math.random().toString(36).substr(2, 9),
        created_date: new Date().toISOString(),
        updated_date: new Date().toISOString(),
      };
      bookings.unshift(newBooking);
      setStorage(STORAGE_KEYS.BOOKINGS, bookings);
      return newBooking;
    },
    update: (id, updates) => {
      const bookings = getStorage(STORAGE_KEYS.BOOKINGS);
      const index = bookings.findIndex(b => b.id === id);
      if (index !== -1) {
        bookings[index] = { ...bookings[index], ...updates, updated_date: new Date().toISOString() };
        setStorage(STORAGE_KEYS.BOOKINGS, bookings);
        return bookings[index];
      }
      return null;
    },
    filter: (query) => {
      const bookings = getStorage(STORAGE_KEYS.BOOKINGS);
      return bookings.filter(b => Object.entries(query).every(([k, v]) => b[k] === v));
    }
  },
  blocks: {
    list: () => getStorage(STORAGE_KEYS.BLOCKS),
    create: (data) => {
      const blocks = getStorage(STORAGE_KEYS.BLOCKS);
      const newBlock = {
        ...data,
        id: Math.random().toString(36).substr(2, 9),
        created_date: new Date().toISOString(),
      };
      blocks.unshift(newBlock);
      setStorage(STORAGE_KEYS.BLOCKS, blocks);
      return newBlock;
    },
    filter: (query) => {
      const blocks = getStorage(STORAGE_KEYS.BLOCKS);
      return blocks.filter(b => Object.entries(query).every(([k, v]) => b[k] === v));
    }
  },
  subsidies: {
    list: () => getStorage(STORAGE_KEYS.SUBSIDIES),
    create: (data) => {
      const subsidies = getStorage(STORAGE_KEYS.SUBSIDIES);
      const newSubsidy = {
        ...data,
        id: Math.random().toString(36).substr(2, 9),
        created_date: new Date().toISOString(),
      };
      subsidies.unshift(newSubsidy);
      setStorage(STORAGE_KEYS.SUBSIDIES, subsidies);
      return newSubsidy;
    }
  },
  initialize: () => {
    // Add some initial data if empty
      const sampleBookings = [];
      const sampleBlocks = [];
      const sampleSubsidies = [];
      
      const names = ["Aarav", "Priya", "Rahul", "Anita", "Vikram", "Sanjay", "Deepa", "Amit", "Kavita", "Rohan"];
      const states = Object.keys(Object.keys(window.STATES_CITIES || { Maharashtra: [] })); // Fallback if not globally available, but we'll use hardcoded for safety
      const cities = ["Mumbai", "Delhi", "Bengaluru", "Ahmedabad", "Chennai", "Lucknow", "Pune", "Noida", "Surat", "Kanpur"];
      
      let prevHash = "0x0000000000000000";

      for (let i = 0; i < 35; i++) {
        const bId = generateBookingId();
        const bHash = generateHash({ bookingId: bId, i });
        const name = names[i % names.length] + " " + (i > 10 ? String.fromCharCode(65 + (i % 26)) : "Verma");
        const status = i < 5 ? (i === 0 ? "pending" : "in_transit") : "delivered";
        const date = new Date(Date.now() - (35 - i) * 3600000 * 4); // Spacing out by 4 hours
        
        const booking = {
          id: String(i + 1),
          booking_id: bId,
          customer_name: name,
          customer_phone: `9${Math.floor(100000000 + Math.random() * 900000000)}`,
          customer_address: `${100 + i}, Main St, ${cities[i % cities.length]}, India`,
          cylinder_type: i % 3 === 0 ? '14.2kg_domestic' : (i % 3 === 1 ? '19kg_commercial' : '5kg_portable'),
          quantity: (i % 2) + 1,
          status,
          payment_method: i % 4 === 0 ? 'freighter' : 'online',
          total_amount: 900 * ((i % 2) + 1),
          subsidy_applied: (i % 3 === 0) ? 200 * ((i % 2) + 1) : 0,
          final_amount: (900 * ((i % 2) + 1)) - ((i % 3 === 0) ? 200 * ((i % 2) + 1) : 0),
          block_hash: bHash,
          created_date: date.toISOString(),
          updated_date: date.toISOString(),
        };

        const block = {
          id: `b${i + 1}`,
          block_index: i + 1,
          block_hash: bHash,
          previous_hash: prevHash,
          timestamp: date.toISOString(),
          booking_id: bId,
          event_type: i === 0 ? 'booking_created' : (status === 'delivered' ? 'delivered' : 'in_transit'),
          event_data: JSON.stringify({ status, payment: booking.payment_method }),
          location: cities[i % cities.length],
          verified_by: i % 4 === 0 ? 'Freighter Node' : 'System Node',
          created_date: date.toISOString(),
        };

        if (booking.subsidy_applied > 0) {
          sampleSubsidies.push({
            id: `s${i + 1}`,
            subsidy_type: 'ujjwala',
            scheme: 'Ujjwala Yojana',
            amount: booking.subsidy_applied,
            status: status === 'delivered' ? 'credited' : 'pending',
            booking_id: bId,
            beneficiary_name: name,
            created_date: date.toISOString(),
          });
        }

        sampleBookings.push(booking);
        sampleBlocks.push(block);
        prevHash = bHash;
      }

      setStorage(STORAGE_KEYS.BOOKINGS, sampleBookings.reverse());
      setStorage(STORAGE_KEYS.BLOCKS, sampleBlocks.reverse());
      setStorage(STORAGE_KEYS.SUBSIDIES, sampleSubsidies.reverse());
  }
};
