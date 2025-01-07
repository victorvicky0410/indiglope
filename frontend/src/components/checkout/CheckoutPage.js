import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { handlePayment } from "./RazorpayHandler";
import "./checkout.css";
import Footer from "../common/Footer";
import Header from "../common/Header";
import BackTop from "../common/BackTop";

const CheckoutPage = () => {
  const location = useLocation();
  const { totalAmount, displayTotalAmount,displayCartTotal,displayCartDiscount} = location.state || {};

  const [amount, setAmount] = useState(totalAmount || "");
  const [formDetails, setFormDetails] = useState({
    country: "India",
    fullName: "",
    mobile: "",
    houseDetails: "",
    area: "",
    street: "",
    village: "",
    landmark: "",
    pinCode: "",
    townCity: "",
    state: "",
    district: "", // New state for district
  });

  // Complete list of states with their respective districts (sample)
  const stateDistricts = {
    "Andhra Pradesh": [
      "Anakapalli", "Anantapur", "Annamayya", "Bapatla", "Chittoor", "East Godavari", "Eluru",
      "Guntur", "Kakinada", "Konaseema", "Krishna", "Kurnool", "Nandyal", "Nellore", "Palnadu",
      "Parvathipuram Manyam", "Prakasam", "Srikakulam", "Tirupati", "Visakhapatnam", "Vizianagaram",
      "West Godavari", "YSR Kadapa", "NTR", "Alluri Sitharama Raju", "Sri Sathya Sai"
    ],
    "Arunachal Pradesh": [
      "Tawang", "West Kameng", "East Kameng", "Pakke Kessang", "Papum Pare", "Kurung Kumey", 
      "Kra Daadi", "Lower Subansiri", "Upper Subansiri", "West Siang", "East Siang", "Siang", 
      "Upper Siang", "Lower Siang", "Lepa Rada", "Shi Yomi", "Dibang Valley", "Lower Dibang Valley", 
      "Anjaw", "Changlang", "Tirap", "Longding"
    ],
    "Assam": [
      "Baksa", "Barpeta", "Biswanath", "Bongaigaon", "Cachar", "Charaideo", "Chirang", "Darrang",
      "Dhemaji", "Dhubri", "Dibrugarh", "Goalpara", "Golaghat", "Hailakandi", "Hojai", "Jorhat",
      "Kamrup Metropolitan", "Kamrup", "Karbi Anglong", "Karimganj", "Kokrajhar", "Lakhimpur",
      "Majuli", "Morigaon", "Nagaon", "Nalbari", "Sivasagar", "Sonitpur", "South Salmara-Mankachar",
      "Tinsukia", "Udalguri", "West Karbi Anglong"
    ],
    "Bihar": [
      "Araria", "Arwal", "Aurangabad", "Banka", "Begusarai", "Bhagalpur", "Bhojpur", "Buxar", 
      "Darbhanga", "East Champaran", "Gaya", "Gopalganj", "Jamui", "Jehanabad", "Kaimur", "Katihar",
      "Khagaria", "Kishanganj", "Lakhisarai", "Madhepura", "Madhubani", "Munger", "Muzaffarpur",
      "Nalanda", "Nawada", "Patna", "Purnia", "Rohtas", "Saharsa", "Samastipur", "Saran", "Sheikhpura",
      "Sheohar", "Sitamarhi", "Siwan", "Supaul", "Vaishali", "West Champaran"
    ],
    "Chhattisgarh": [
      "Balod", "Baloda Bazar", "Balrampur", "Bastar", "Bemetara", "Bijapur", "Bilaspur", "Dantewada",
      "Dhamtari", "Durg", "Gariaband", "Gaurela-Pendra-Marwahi", "Janjgir-Champa", "Jashpur", "Kabirdham",
      "Kanker", "Kondagaon", "Korba", "Koriya", "Mahasamund", "Mungeli", "Narayanpur", "Raigarh",
      "Raipur", "Rajnandgaon", "Sukma", "Surajpur", "Surguja"
    ],
    "Goa": ["North Goa", "South Goa"],
    "Gujarat": [
      "Ahmedabad", "Amreli", "Anand", "Aravalli", "Banaskantha", "Bharuch", "Bhavnagar", "Botad", 
      "Chhota Udaipur", "Dahod", "Dang", "Devbhoomi Dwarka", "Gandhinagar", "Gir Somnath", "Jamnagar",
      "Junagadh", "Kheda", "Kutch", "Mahisagar", "Mehsana", "Morbi", "Narmada", "Navsari", "Panchmahal",
      "Patan", "Porbandar", "Rajkot", "Sabarkantha", "Surat", "Surendranagar", "Tapi", "Vadodara", "Valsad"
    ],
    "Haryana": [
      "Ambala", "Bhiwani", "Charkhi Dadri", "Faridabad", "Fatehabad", "Gurugram", "Hisar", "Jhajjar",
      "Jind", "Kaithal", "Karnal", "Kurukshetra", "Mahendragarh", "Nuh", "Palwal", "Panchkula", 
      "Panipat", "Rewari", "Rohtak", "Sirsa", "Sonipat", "Yamunanagar"
    ],
    "Himachal Pradesh": [
      "Bilaspur", "Chamba", "Hamirpur", "Kangra", "Kinnaur", "Kullu", "Lahaul and Spiti", "Mandi", 
      "Shimla", "Sirmaur", "Solan", "Una"
    ],
    "Jharkhand": [
      "Bokaro", "Chatra", "Deoghar", "Dhanbad", "Dumka", "East Singhbhum", "Garhwa", "Giridih",
      "Godda", "Gumla", "Hazaribagh", "Jamtara", "Khunti", "Koderma", "Latehar", "Lohardaga",
      "Pakur", "Palamu", "Ramgarh", "Ranchi", "Sahebganj", "Seraikela Kharsawan", "Simdega", 
      "West Singhbhum"
    ],
    "Karnataka": [
      "Bagalkot", "Bangalore Rural", "Bangalore Urban", "Belagavi", "Bellary", "Bidar", "Chamarajanagar", 
      "Chikballapur", "Chikkamagaluru", "Chitradurga", "Dakshina Kannada", "Davanagere", "Dharwad", 
      "Gadag", "Hassan", "Haveri", "Kalaburagi", "Kodagu", "Kolar", "Koppal", "Mandya", "Mysore",
      "Raichur", "Ramanagara", "Shivamogga", "Tumakuru", "Udupi", "Uttara Kannada", "Vijayanagara", 
      "Vijayapura", "Yadgir"
    ],
    "Kerala": [
      "Alappuzha", "Ernakulam", "Idukki", "Kannur", "Kasaragod", "Kollam", "Kottayam", "Kozhikode",
      "Malappuram", "Palakkad", "Pathanamthitta", "Thiruvananthapuram", "Thrissur", "Wayanad"
    ],
    "Madhya Pradesh": [
      "Agar Malwa", "Alirajpur", "Anuppur", "Ashoknagar", "Balaghat", "Barwani", "Betul", "Bhind",
      "Bhopal", "Burhanpur", "Chhatarpur", "Chhindwara", "Damoh", "Datia", "Dewas", "Dhar", "Dindori",
      "Guna", "Gwalior", "Harda", "Hoshangabad", "Indore", "Jabalpur", "Jhabua", "Katni", "Khandwa",
      "Khargone", "Mandla", "Mandsaur", "Morena", "Narsinghpur", "Neemuch", "Panna", "Raisen",
      "Rajgarh", "Ratlam", "Rewa", "Sagar", "Satna", "Sehore", "Seoni", "Shahdol", "Shajapur",
      "Sheopur", "Shivpuri", "Sidhi", "Singrauli", "Tikamgarh", "Ujjain", "Umaria", "Vidisha"
    ],
    "Maharashtra": [
      "Ahmednagar", "Akola", "Amravati", "Aurangabad", "Beed", "Bhandara", "Buldhana", "Chandrapur",
      "Dhule", "Gadchiroli", "Gondia", "Hingoli", "Jalgaon", "Jalna", "Kolhapur", "Latur", "Mumbai City",
      "Mumbai Suburban", "Nagpur", "Nanded", "Nandurbar", "Nashik", "Osmanabad", "Palghar", "Parbhani",
      "Pune", "Raigad", "Ratnagiri", "Sangli", "Satara", "Sindhudurg", "Solapur", "Thane", "Wardha",
      "Washim", "Yavatmal"
    ],
      "Manipur": [
        "Bishnupur", "Chandel", "Churachandpur", "Imphal East", "Imphal West", "Jiribam",
        "Kakching", "Kamjong", "Kangpokpi", "Noney", "Pherzawl", "Senapati", "Tamenglong",
        "Tengnoupal", "Thoubal", "Ukhrul"
      ],
      "Meghalaya": [
        "East Garo Hills", "East Jaintia Hills", "East Khasi Hills", "North Garo Hills",
        "Ri Bhoi", "South Garo Hills", "South West Garo Hills", "South West Khasi Hills",
        "West Garo Hills", "West Jaintia Hills", "West Khasi Hills"
      ],
      "Mizoram": [
        "Aizawl", "Champhai", "Kolasib", "Lawngtlai", "Lunglei", "Mamit", "Saiha", "Serchhip"
      ],
      "Nagaland": [
        "Chumukedima", "Dimapur", "Kiphire", "Kohima", "Longleng", "Mokokchung", "Mon", "Noklak",
        "Peren", "Phek", "Tuensang", "Wokha", "Zunheboto"
      ],
      "Odisha": [
        "Angul", "Balangir", "Balasore", "Bargarh", "Bhadrak", "Boudh", "Cuttack", "Debagarh",
        "Dhenkanal", "Gajapati", "Ganjam", "Jagatsinghpur", "Jajpur", "Jharsuguda", "Kalahandi",
        "Kandhamal", "Kendrapara", "Kendujhar (Keonjhar)", "Khordha", "Koraput", "Malkangiri",
        "Mayurbhanj", "Nabarangpur", "Nayagarh", "Nuapada", "Puri", "Rayagada", "Sambalpur",
        "Subarnapur", "Sundargarh"
      ],
      "Punjab": [
        "Amritsar", "Barnala", "Bathinda", "Faridkot", "Fatehgarh Sahib", "Fazilka", "Ferozepur",
        "Gurdaspur", "Hoshiarpur", "Jalandhar", "Kapurthala", "Ludhiana", "Mansa", "Moga",
        "Mohali", "Muktsar", "Nawanshahr (Shahid Bhagat Singh Nagar)", "Pathankot", "Patiala",
        "Rupnagar", "Sangrur", "Tarn Taran"
      ],
      "Rajasthan": [
        "Ajmer", "Alwar", "Banswara", "Baran", "Barmer", "Bharatpur", "Bhilwara", "Bikaner",
        "Bundi", "Chittorgarh", "Churu", "Dausa", "Dholpur", "Dungarpur", "Hanumangarh", "Jaipur",
        "Jaisalmer", "Jalore", "Jhalawar", "Jhunjhunu", "Jodhpur", "Karauli", "Kota", "Nagaur",
        "Pali", "Pratapgarh", "Rajsamand", "Sawai Madhopur", "Sikar", "Sirohi", "Sri Ganganagar",
        "Tonk", "Udaipur"
      ],
      "Sikkim": [
        "East Sikkim", "North Sikkim", "South Sikkim", "West Sikkim"
      ],
      "Tamil Nadu": [
        "Ariyalur", "Chengalpattu", "Chennai", "Coimbatore", "Cuddalore", "Dharmapuri", "Dindigul",
        "Erode", "Kallakurichi", "Kanchipuram", "Kanyakumari", "Karur", "Krishnagiri", "Madurai",
        "Nagapattinam", "Namakkal", "Nilgiris", "Perambalur", "Pudukkottai", "Ramanathapuram",
        "Ranipet", "Salem", "Sivaganga", "Tenkasi", "Thanjavur", "Theni", "Thiruvallur",
        "Thiruvarur", "Thoothukudi", "Tiruchirappalli", "Tirunelveli", "Tirupattur", "Tiruppur",
        "Tiruvannamalai", "Vellore", "Viluppuram", "Virudhunagar"
      ],
      "Tripura": [
        "Dhalai", "Gomati", "Khowai", "North Tripura", "Sepahijala", "South Tripura", "Unakoti",
        "West Tripura"
      ],
      "Uttar Pradesh": [
        "Agra", "Aligarh", "Ambedkar Nagar", "Amethi", "Amroha", "Auraiya", "Ayodhya",
        "Azamgarh", "Badaun", "Baghpat", "Bahraich", "Ballia", "Balrampur", "Banda", "Barabanki",
        "Bareilly", "Basti", "Bijnor", "Budaun", "Bulandshahr", "Chandauli", "Chitrakoot",
        "Deoria", "Etah", "Etawah", "Farrukhabad", "Fatehpur", "Firozabad", "Gautam Buddha Nagar",
        "Ghaziabad", "Ghazipur", "Gonda", "Gorakhpur", "Hamirpur", "Hapur", "Hardoi", "Hathras",
        "Jalaun", "Jaunpur", "Jhansi", "Kannauj", "Kanpur Dehat", "Kanpur Nagar", "Kasganj",
        "Kaushambi", "Kushinagar", "Lakhimpur Kheri", "Lalitpur", "Lucknow", "Maharajganj",
        "Mahoba", "Mainpuri", "Mathura", "Mau", "Meerut", "Mirzapur", "Moradabad", "Muzaffarnagar",
        "Pilibhit", "Pratapgarh", "Prayagraj", "Raebareli", "Rampur", "Saharanpur", "Sambhal",
        "Sant Kabir Nagar", "Sant Ravidas Nagar", "Shahjahanpur", "Shamli", "Shravasti",
        "Siddharthnagar", "Sitapur", "Sonbhadra", "Sultanpur", "Unnao", "Varanasi"
      ],
      "Uttarakhand": [
        "Almora", "Bageshwar", "Chamoli", "Champawat", "Dehradun", "Haridwar", "Nainital",
        "Pauri Garhwal", "Pithoragarh", "Rudraprayag", "Tehri Garhwal", "Udham Singh Nagar",
        "Uttarkashi"
      ],
      "West Bengal": [
        "Alipurduar", "Bankura", "Birbhum", "Cooch Behar", "Darjeeling", "Hooghly", "Howrah",
        "Jalpaiguri", "Jhargram", "Kalimpong", "Kolkata", "Malda", "Murshidabad", "Nadia",
        "North 24 Parganas", "Paschim Bardhaman", "Paschim Medinipur", "Purba Bardhaman",
        "Purba Medinipur", "Purulia", "South 24 Parganas", "Uttar Dinajpur"
      ],
      "Andaman and Nicobar Islands": [
        "Nicobar", "North and Middle Andaman", "South Andaman"
      ],
      "Chandigarh": ["Chandigarh"],
      "Dadra and Nagar Haveli and Daman and Diu": [
        "Dadra and Nagar Haveli", "Daman", "Diu"
      ],
      "Delhi": [
        "Central Delhi", "East Delhi", "New Delhi", "North Delhi", 
        "North East Delhi", "North West Delhi", "Shahdara", "South Delhi", 
        "South East Delhi", "South West Delhi", "West Delhi"
      ],
      "Jammu and Kashmir": [
        "Anantnag", "Bandipora", "Baramulla", "Budgam", "Doda", "Ganderbal",
        "Jammu", "Kathua", "Kishtwar", "Kulgam", "Kupwara", "Poonch", "Pulwama",
        "Rajouri", "Ramban", "Reasi", "Samba", "Shopian", "Srinagar", "Udhampur"
      ],
      "Ladakh": ["Kargil", "Leh"],
      "Lakshadweep": [
        "Agatti", "Amini", "Andrott", "Bitra", "Chetlat", "Kadmat",
        "Kalpeni", "Kavaratti", "Kilthan", "Minicoy"
      ],
      "Puducherry": [
        "Karaikal", "Mahe", "Puducherry", "Yanam"
      ],
  };
  

  const allStates = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat",
    "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh",
    "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan",
    "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
    "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu",
    "Lakshadweep", "Delhi", "Puducherry",
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormDetails((prev) => ({ ...prev, [name]: value }));
  };

  const initiatePayment = () => {
    if (!amount || amount <= 0) {
      alert("Please enter a valid amount");
      return;
    }
    if (!formDetails.fullName || !formDetails.mobile || !formDetails.pinCode) {
      alert("Please fill all required fields");
      return;
    }
    handlePayment(amount);
  };

  useEffect(() => {
    if (totalAmount) {
      setAmount(totalAmount);
    }
  }, [totalAmount]);

  // Get the districts based on selected state
  const districts = stateDistricts[formDetails.state] || [];
  const onPayNowClick = () => {
    if (!totalAmount || !formDetails.fullName || !formDetails.mobile) {
      alert("Please fill in all required details.");
      return;
    }
    handlePayment(totalAmount, formDetails);
  };
  return (
    <> 
    <Header/>
    <div className="checkout-container">
      <h2>Checkout</h2>
      <form className="checkout-form">
        <label>
          Country/Region:
          <input
            type="text"
            name="country"
            value={formDetails.country}
            readOnly
            className="input-field"
          />
        </label>
        <label>
          Full Name:
          <input
            type="text"
            name="fullName"
            value={formDetails.fullName}
            onChange={handleInputChange}
            placeholder="Enter your full name"
            className="input-field"
          />
        </label>
        <label>
          Mobile Number:
          <input
            type="text"
            name="mobile"
            value={formDetails.mobile}
            onChange={handleInputChange}
            onInput={(e) => {
              e.target.value = e.target.value.replace(/[^0-9]/g, '').slice(0, 10);
            }}
            placeholder="Enter your mobile number"
            className="input-field"
          />
        </label>
        <label>
          Address:
          <input
            type="text"
            name="houseDetails"
            value={formDetails.houseDetails}
            onChange={handleInputChange}
            placeholder="Enter house or flat details"
            className="input-field"
          />
        </label>
        <label>
          Area:
          <input
            type="text"
            name="area"
            value={formDetails.area}
            onChange={handleInputChange}
            placeholder="Enter area"
            className="input-field"
          />
        </label>
        <label>
          Street:
          <input
            type="text"
            name="street"
            value={formDetails.street}
            onChange={handleInputChange}
            placeholder="Enter street"
            className="input-field"
          />
        </label>
        <label>
          Village:
          <input
            type="text"
            name="village"
            value={formDetails.village}
            onChange={handleInputChange}
            placeholder="Enter village"
            className="input-field"
          />
        </label>
        <label>
          Landmark:
          <input
            type="text"
            name="landmark"
            value={formDetails.landmark}
            onChange={handleInputChange}
            placeholder="Enter landmark"
            className="input-field"
          />
        </label>
        <label>
          Pin Code:
          <input
            type="text"
            name="pinCode"
            value={formDetails.pinCode}
            onChange={handleInputChange}
            onInput={(e) => {
              e.target.value = e.target.value.replace(/[^0-9]/g, '').slice(0, 6);
            }}
            placeholder="Enter pin code"
            className="input-field"
          />
        </label>
        <label>
          Town/City:
          <input
            type="text"
            name="townCity"
            value={formDetails.townCity}
            onChange={handleInputChange}
            placeholder="Enter town or city"
            className="input-field"
          />
        </label>
        <label>
          State:
          <select
            name="state"
            value={formDetails.state}
            onChange={handleInputChange}
            className="input-field"
          >
            <option value="">Select State</option>
            {allStates.map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>
        </label>

        {/* District Selection based on state */}
        {formDetails.state && (
          <label>
            District:
            <select
              name="district"
              value={formDetails.district}
              onChange={handleInputChange}
              className="input-field"
            >
              <option value="">Select District</option>
              {districts.map((district) => (
                <option key={district} value={district}>
                  {district}
                </option>
              ))}
            </select>
          </label>
        )}

        <label>
          Amount:
          <input
            type="text"
            placeholder="Amount"
            value={amount}
            readOnly
            className="input-field"
          />
        </label>

        <div className="order-summary">
          <h3>Order Summary</h3>
          <p><strong>Original Price:</strong>{displayCartTotal}</p>
          <p><strong>Discount:</strong>{displayCartDiscount}</p>
          <p><strong>Total Price:</strong>{displayTotalAmount}</p>
        </div>

        <button

          type="button"
          onClick={onPayNowClick}
          className="pay-button"
        >
          Pay ₹{amount}
        </button>
      </form>
    </div>
    <Footer/>

    <BackTop />


    </>
  );
};

export default CheckoutPage;


