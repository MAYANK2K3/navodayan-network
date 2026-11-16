import { CityData } from "@/types";

export const ALL_CITIES_DATA: CityData[] = [
  // Metro & Major Indian Tech / Administrative Hubs
  { city: "Bengaluru", state: "Karnataka", stateCode: "KA", country: "India", latitude: 12.9716, longitude: 77.5946, alumni_count: 1420 },
  { city: "Delhi / NCR", state: "Delhi", stateCode: "DL", country: "India", latitude: 28.6139, longitude: 77.2090, alumni_count: 1850 },
  { city: "Hyderabad", state: "Telangana", stateCode: "TG", country: "India", latitude: 17.3850, longitude: 78.4867, alumni_count: 980 },
  { city: "Pune", state: "Maharashtra", stateCode: "MH", country: "India", latitude: 18.5204, longitude: 73.8567, alumni_count: 890 },
  { city: "Mumbai", state: "Maharashtra", stateCode: "MH", country: "India", latitude: 19.0760, longitude: 72.8777, alumni_count: 1120 },
  { city: "Chennai", state: "Tamil Nadu", stateCode: "TN", country: "India", latitude: 13.0827, longitude: 80.2707, alumni_count: 640 },
  { city: "Kolkata", state: "West Bengal", stateCode: "WB", country: "India", latitude: 22.5726, longitude: 88.3639, alumni_count: 730 },
  { city: "Ahmedabad", state: "Gujarat", stateCode: "GJ", country: "India", latitude: 23.0225, longitude: 72.5714, alumni_count: 510 },
  { city: "Jaipur", state: "Rajasthan", stateCode: "RJ", country: "India", latitude: 26.9124, longitude: 75.7873, alumni_count: 670 },
  { city: "Lucknow", state: "Uttar Pradesh", stateCode: "UP", country: "India", latitude: 26.8467, longitude: 80.9462, alumni_count: 820 },
  { city: "Patna", state: "Bihar", stateCode: "BR", country: "India", latitude: 25.5941, longitude: 85.1376, alumni_count: 790 },
  { city: "Chandigarh", state: "Chandigarh", stateCode: "CH", country: "India", latitude: 30.7333, lng: 76.7794, longitude: 76.7794, alumni_count: 580 },
  { city: "Bhopal", state: "Madhya Pradesh", stateCode: "MP", country: "India", latitude: 23.2599, longitude: 77.4126, alumni_count: 530 },
  { city: "Indore", state: "Madhya Pradesh", stateCode: "MP", country: "India", latitude: 22.7196, longitude: 75.8577, alumni_count: 490 },
  { city: "Ranchi", state: "Jharkhand", stateCode: "JH", country: "India", latitude: 23.3441, longitude: 85.3096, alumni_count: 420 },
  { city: "Bhubaneswar", state: "Odisha", stateCode: "OD", country: "India", latitude: 20.2961, longitude: 85.8245, alumni_count: 460 },
  { city: "Guwahati", state: "Assam", stateCode: "AS", country: "India", latitude: 26.1445, longitude: 91.7362, alumni_count: 390 },
  { city: "Dehradun", state: "Uttarakhand", stateCode: "UK", country: "India", latitude: 30.3165, longitude: 78.0322, alumni_count: 340 },
  { city: "Shimla", state: "Himachal Pradesh", stateCode: "HP", country: "India", latitude: 31.1048, longitude: 77.1734, alumni_count: 310 },
  { city: "Jammu", state: "Jammu & Kashmir", stateCode: "JK", country: "India", latitude: 32.7266, longitude: 74.8570, alumni_count: 280 },
  { city: "Srinagar", state: "Jammu & Kashmir", stateCode: "JK", country: "India", latitude: 34.0837, longitude: 74.7973, alumni_count: 240 },
  { city: "Raipur", state: "Chhattisgarh", stateCode: "CG", country: "India", latitude: 21.2514, longitude: 81.6296, alumni_count: 310 },
  { city: "Varanasi", state: "Uttar Pradesh", stateCode: "UP", country: "India", latitude: 25.3176, longitude: 82.9739, alumni_count: 390 },
  { city: "Prayagraj", state: "Uttar Pradesh", stateCode: "UP", country: "India", latitude: 25.4358, longitude: 81.8463, alumni_count: 370 },
  { city: "Nagpur", state: "Maharashtra", stateCode: "MH", country: "India", latitude: 21.1458, longitude: 79.0882, alumni_count: 430 },
  { city: "Coimbatore", state: "Tamil Nadu", stateCode: "TN", country: "India", latitude: 11.0168, longitude: 76.9558, alumni_count: 220 },
  { city: "Kochi", state: "Kerala", stateCode: "KL", country: "India", latitude: 9.9312, longitude: 76.2673, alumni_count: 310 },
  { city: "Thiruvananthapuram", state: "Kerala", stateCode: "KL", country: "India", latitude: 8.5241, longitude: 76.9366, alumni_count: 290 },
  { city: "Visakhapatnam", state: "Andhra Pradesh", stateCode: "AP", country: "India", latitude: 17.6868, longitude: 83.2185, alumni_count: 280 },
  { city: "Vijayawada", state: "Andhra Pradesh", stateCode: "AP", country: "India", latitude: 16.5062, longitude: 80.6480, alumni_count: 260 },
  { city: "Noida / Greater Noida", state: "Uttar Pradesh", stateCode: "UP", country: "India", latitude: 28.5355, longitude: 77.3910, alumni_count: 940 },
  { city: "Gurugram", state: "Haryana", stateCode: "HR", country: "India", latitude: 28.4595, longitude: 77.0266, alumni_count: 1080 },

  // Global Diaspora Hubs
  { city: "San Francisco Bay Area", state: "California", stateCode: "CA", country: "USA", latitude: 37.7749, longitude: -122.4194, alumni_count: 310 },
  { city: "Seattle", state: "Washington", stateCode: "WA", country: "USA", latitude: 47.6062, longitude: -122.3321, alumni_count: 190 },
  { city: "New York City", state: "New York", stateCode: "NY", country: "USA", latitude: 40.7128, longitude: -74.0060, alumni_count: 240 },
  { city: "Austin", state: "Texas", stateCode: "TX", country: "USA", latitude: 30.2672, longitude: -97.7431, alumni_count: 130 },
  { city: "London", state: "Greater London", stateCode: "LDN", country: "United Kingdom", latitude: 51.5074, longitude: -0.1278, alumni_count: 280 },
  { city: "Toronto", state: "Ontario", stateCode: "ON", country: "Canada", latitude: 43.6532, longitude: -79.3832, alumni_count: 260 },
  { city: "Vancouver", state: "British Columbia", stateCode: "BC", country: "Canada", latitude: 49.2827, longitude: -123.1207, alumni_count: 140 },
  { city: "Dubai", state: "Dubai Emirate", stateCode: "DXB", country: "UAE", latitude: 25.2048, longitude: 55.2708, alumni_count: 380 },
  { city: "Singapore", state: "Singapore", stateCode: "SG", country: "Singapore", latitude: 1.3521, longitude: 103.8198, alumni_count: 220 },
  { city: "Berlin", state: "Berlin", stateCode: "BER", country: "Germany", latitude: 52.5200, longitude: 13.4050, alumni_count: 160 },
  { city: "Munich", state: "Bavaria", stateCode: "BY", country: "Germany", latitude: 48.1351, longitude: 11.5820, alumni_count: 110 },
  { city: "Sydney", state: "New South Wales", stateCode: "NSW", country: "Australia", latitude: -33.8688, longitude: 151.2093, alumni_count: 170 },
  { city: "Melbourne", state: "Victoria", stateCode: "VIC", country: "Australia", latitude: -37.8136, longitude: 144.9631, alumni_count: 150 },
  { city: "Dublin", state: "Leinster", stateCode: "DUB", country: "Ireland", latitude: 53.3498, longitude: -6.2603, alumni_count: 95 },
  { city: "Amsterdam", state: "North Holland", stateCode: "NH", country: "Netherlands", latitude: 52.3676, longitude: 4.9041, alumni_count: 110 },
  { city: "Tokyo", state: "Tokyo", stateCode: "TYO", country: "Japan", latitude: 35.6762, longitude: 139.6503, alumni_count: 75 },
];

export function searchCities(query: string): CityData[] {
  const q = query.toLowerCase().trim();
  if (!q) return ALL_CITIES_DATA.slice(0, 15);
  return ALL_CITIES_DATA.filter(
    (c) =>
      c.city.toLowerCase().includes(q) ||
      c.state.toLowerCase().includes(q) ||
      c.country.toLowerCase().includes(q)
  );
}
