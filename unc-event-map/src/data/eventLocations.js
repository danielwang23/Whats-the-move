const eventLocations = [
  { 
      name: "Student Union", 
      coordinates: [35.9106, -79.0478], 
      description: "A central hub for students to gather, study, and socialize.",
      categories: ["Social", "Community"],
      address: "Student Union, UNC Campus",
      startDate: "2024-11-02",
      endDate: "2024-11-03"
  },
  { 
      name: "Hamilton Hall", 
      coordinates: [35.9102, -79.0505], 
      description: "Home to the Political Science and History departments.",
      categories: ["Learning", "Academics"],
      address: "Hamilton Hall, UNC Campus",
      startDate: "2024-11-05",
      endDate: "2024-11-06"
  },
  { 
      name: "Carolina Union", 
      coordinates: [35.9089, -79.0483], 
      description: "Event space for student activities and gatherings.",
      categories: ["Social", "Community"],
      address: "Carolina Union, UNC Campus",
      startDate: "2024-11-07",
      endDate: "2024-11-08"
  },
  { 
      name: "Hill Hall", 
      coordinates: [35.9100, -79.0480], 
      description: "Concert hall hosting various music performances.",
      categories: ["Arts & Music"],
      address: "Hill Hall, UNC Campus",
      startDate: "2024-11-09",
      endDate: "2024-11-10"
  },
  { 
      name: "Margaret Lane Gallery", 
      coordinates: [36.0751, -79.1004], 
      description: "Art gallery featuring local artists' work.",
      categories: ["Arts & Music"],
      address: "Margaret Lane, Hillsborough",
      startDate: "2024-11-11",
      endDate: "2024-11-12"
  },
  { 
    name: "Research Symposium", 
    coordinates: [35.9102, -79.0505], 
    description: "A showcase of undergraduate research projects across multiple disciplines.",
    categories: ["Academics", "Learning"],
    address: "Hamilton Hall, UNC Campus",
    startDate: "2024-11-14",
    endDate: "2024-11-14"
},
{ 
    name: "Community Service Day", 
    coordinates: [35.9089, -79.0483], 
    description: "Join us in a day of service at local organizations around Chapel Hill.",
    categories: ["Community", "Service"],
    address: "Carolina Union, UNC Campus",
    startDate: "2024-11-16",
    endDate: "2024-11-16"
},
{ 
    name: "Outdoor Yoga Session", 
    coordinates: [35.9100, -79.0480], 
    description: "Relax and unwind with a yoga session in the park.",
    categories: ["Health & Wellness", "Recreation"],
    address: "McCorkle Place, UNC Campus",
    startDate: "2024-11-18",
    endDate: "2024-11-18"
},
{ 
    name: "Thanksgiving Potluck", 
    coordinates: [35.9051, -79.0490], 
    description: "Celebrate Thanksgiving early with a potluck dinner. Bring a dish to share!",
    categories: ["Social", "Community"],
    address: "Campus Commons, UNC Campus",
    startDate: "2024-11-20",
    endDate: "2024-11-20"
},
{ 
    name: "Job Fair", 
    coordinates: [35.9065, -79.0532], 
    description: "Meet with top employers from various industries looking to hire UNC students.",
    categories: ["Career", "Networking"],
    address: "Carolina Union Ballroom, UNC Campus",
    startDate: "2024-11-22",
    endDate: "2024-11-22"
},
{ 
    name: "Basketball Game: UNC vs. Duke", 
    coordinates: [35.9049, -79.0426], 
    description: "Watch the UNC Tar Heels take on rival Duke in a thrilling basketball game.",
    categories: ["Sports"],
    address: "Dean Smith Center, UNC Campus",
    startDate: "2024-11-24",
    endDate: "2024-11-24"
},
{ 
    name: "Environmental Sustainability Workshop", 
    coordinates: [35.9098, -79.0515], 
    description: "Learn about sustainable practices and how you can make a difference.",
    categories: ["Academics", "Environmental"],
    address: "Global Center, UNC Campus",
    startDate: "2024-11-25",
    endDate: "2024-11-25"
},
{ 
    name: "Holiday Craft Fair", 
    coordinates: [35.9112, -79.0489], 
    description: "Find unique handmade gifts from local artisans and support small businesses.",
    categories: ["Arts & Music", "Shopping"],
    address: "Carolina Union, UNC Campus",
    startDate: "2024-12-01",
    endDate: "2024-12-01"
},
{ 
    name: "Winter Film Screening: Home Alone", 
    coordinates: [35.9103, -79.0497], 
    description: "Kick off the holiday season with a classic screening of 'Home Alone'.",
    categories: ["Entertainment", "Social"],
    address: "Union Auditorium, UNC Campus",
    startDate: "2024-12-05",
    endDate: "2024-12-05"
},
{ 
    name: "Stress Relief Puppy Play Day", 
    coordinates: [35.9124, -79.0451], 
    description: "Take a break and destress with therapy dogs during finals week.",
    categories: ["Health & Wellness", "Social"],
    address: "Polk Place, UNC Campus",
    startDate: "2024-12-08",
    endDate: "2024-12-08"
},
{ 
    name: "Open Coding Workshop", 
    coordinates: [35.9093, -79.0520], 
    description: "Join us for a collaborative coding workshop open to all skill levels.",
    categories: ["Academics", "Technology"],
    address: "Sitterson Hall, UNC Campus",
    startDate: "2024-12-10",
    endDate: "2024-12-10"
},
{ 
    name: "International Food Festival", 
    coordinates: [35.9108, -79.0517], 
    description: "Taste foods from around the world at our annual International Food Festival.",
    categories: ["Cultural", "Food"],
    address: "Carolina Quad, UNC Campus",
    startDate: "2024-12-12",
    endDate: "2024-12-12"
},
{ 
    name: "Winter Gala", 
    coordinates: [35.9076, -79.0503], 
    description: "Dress up and join us for an elegant evening of music, dancing, and celebration.",
    categories: ["Social", "Arts & Music"],
    address: "Great Hall, UNC Campus",
    startDate: "2024-12-15",
    endDate: "2024-12-15"
},
{ 
    name: "Art Exhibit: Student Showcase", 
    coordinates: [35.9067, -79.0494], 
    description: "Admire artworks from talented students in this end-of-semester showcase.",
    categories: ["Arts & Music"],
    address: "Ackland Art Museum, UNC Campus",
    startDate: "2024-12-18",
    endDate: "2024-12-18"
},
{ 
    name: "Holiday Caroling Night", 
    coordinates: [35.9115, -79.0462], 
    description: "Join in or listen to holiday caroling as we spread cheer around campus.",
    categories: ["Arts & Music", "Social"],
    address: "Old Well, UNC Campus",
    startDate: "2024-12-20",
    endDate: "2024-12-20"
},
{ 
    name: "Finals Study Break with Snacks", 
    coordinates: [35.9091, -79.0485], 
    description: "Take a break from studying and enjoy free snacks provided by the Student Union.",
    categories: ["Health & Wellness", "Social"],
    address: "Student Union, UNC Campus",
    startDate: "2024-12-21",
    endDate: "2024-12-21"
},
{ 
    name: "End of Semester Bonfire", 
    coordinates: [35.9063, -79.0527], 
    description: "Celebrate the end of the semester with a bonfire and s'mores!",
    categories: ["Social", "Recreation"],
    address: "Outdoor Rec Area, UNC Campus",
    startDate: "2024-12-22",
    endDate: "2024-12-22"
},
{ 
    name: "Student Band Concert", 
    coordinates: [35.9110, -79.0471], 
    description: "Support student bands as they perform live on campus.",
    categories: ["Arts & Music"],
    address: "Carolina Union, UNC Campus",
    startDate: "2024-12-23",
    endDate: "2024-12-23"
},
{ 
    name: "Midnight Pancake Breakfast", 
    coordinates: [35.9105, -79.0492], 
    description: "Fuel up with free pancakes served at midnight during finals week.",
    categories: ["Food", "Social"],
    address: "Student Union, UNC Campus",
    startDate: "2024-12-24",
    endDate: "2024-12-24"
}
];

export default eventLocations;
