export interface IndiaCity {
  name: string;
  pincode?: string;
  localities?: string[];
}

export interface IndiaDistrict {
  name: string;
  cities: string[];
}

export interface IndiaState {
  code: string;
  name: string;
  type: 'state' | 'ut';
  capital: string;
  districts: IndiaDistrict[];
}

// Complete official list of all 28 States and 8 Union Territories of India
export const INDIA_STATES_DATA: IndiaState[] = [
  // 28 STATES
  {
    code: 'AP',
    name: 'Andhra Pradesh',
    type: 'state',
    capital: 'Amaravati',
    districts: [
      { name: 'Anantapur', cities: ['Anantapur', 'Dharmavaram', 'Guntakal', 'Tadipatri', 'Kadiri'] },
      { name: 'Chittoor', cities: ['Chittoor', 'Tirupati', 'Madanapalle', 'Srikalahasti', 'Punganur'] },
      { name: 'East Godavari', cities: ['Kakinada', 'Rajahmundry', 'Amalapuram', 'Samalkot', 'Pithapuram'] },
      { name: 'Guntur', cities: ['Guntur', 'Tenali', 'Narasaraopet', 'Bapatla', 'Mangalagiri'] },
      { name: 'Krishna', cities: ['Vijayawada', 'Machilipatnam', 'Gudivada', 'Nuzvid', 'Jaggayyapeta'] },
      { name: 'Kurnool', cities: ['Kurnool', 'Nandyal', 'Adoni', 'Yemmiganur', 'Dhone'] },
      { name: 'Nellore', cities: ['Nellore', 'Kavali', 'Gudur', 'Venkatagiri', 'Sullurpeta'] },
      { name: 'Prakasam', cities: ['Ongole', 'Chirala', 'Markapur', 'Kandukur', 'Giddalur'] },
      { name: 'Srikakulam', cities: ['Srikakulam', 'Palasa', 'Amadalavalasa', 'Ichchapuram', 'Rajam'] },
      { name: 'Visakhapatnam', cities: ['Visakhapatnam', 'Anakapalle', 'Bheemunipatnam', 'Gajuwaka', 'Narsipatnam'] },
      { name: 'Vizianagaram', cities: ['Vizianagaram', 'Bobbili', 'Parvathipuram', 'Salur', 'Cheepurupalli'] },
      { name: 'West Godavari', cities: ['Eluru', 'Bhimavaram', 'Tadepalligudem', 'Palakollu', 'Tanuku'] },
      { name: 'YSR Kadapa', cities: ['Kadapa', 'Proddatur', 'Rayachoti', 'Pulivendula', 'Jammalamadugu'] }
    ]
  },
  {
    code: 'AR',
    name: 'Arunachal Pradesh',
    type: 'state',
    capital: 'Itanagar',
    districts: [
      { name: 'Papum Pare', cities: ['Itanagar', 'Naharlagun', 'Doimukh', 'Yupia'] },
      { name: 'Changlang', cities: ['Changlang', 'Jairampur', 'Miao', 'Bordumsa'] },
      { name: 'East Siang', cities: ['Pasighat', 'Ruksin', 'Mebo'] },
      { name: 'Lohit', cities: ['Tezu', 'Sunpura', 'Wakro'] },
      { name: 'Tawang', cities: ['Tawang', 'Lumla', 'Jang'] },
      { name: 'West Kameng', cities: ['Bomdila', 'Rupa', 'Bhalukpong', 'Dirang'] },
      { name: 'Lower Subansiri', cities: ['Ziro', 'Yachuli', 'Old Ziro'] }
    ]
  },
  {
    code: 'AS',
    name: 'Assam',
    type: 'state',
    capital: 'Dispur',
    districts: [
      { name: 'Kamrup Metropolitan', cities: ['Guwahati', 'Dispur', 'North Guwahati', 'Chandrapur'] },
      { name: 'Dibrugarh', cities: ['Dibrugarh', 'Chabua', 'Naharkatia', 'Namrup'] },
      { name: 'Cachar', cities: ['Silchar', 'Lakhipur', 'Sonai'] },
      { name: 'Jorhat', cities: ['Jorhat', 'Mariani', 'Titabor', 'Teok'] },
      { name: 'Nagaon', cities: ['Nagaon', 'Raha', 'Dhing', 'Samaguri'] },
      { name: 'Sonitpur', cities: ['Tezpur', 'Dhekiajuli', 'Rangapara'] },
      { name: 'Tinsukia', cities: ['Tinsukia', 'Digboi', 'Margherita', 'Doomdooma'] },
      { name: 'Barpeta', cities: ['Barpeta', 'Howly', 'Sarthebari', 'Barpeta Road'] }
    ]
  },
  {
    code: 'BR',
    name: 'Bihar',
    type: 'state',
    capital: 'Patna',
    districts: [
      { name: 'Patna', cities: ['Patna', 'Danapur', 'Barh', 'Fatuha', 'Khagaul', 'Mokama', 'Bihta'] },
      { name: 'Gaya', cities: ['Gaya', 'Bodh Gaya', 'Sherghati', 'Tekari'] },
      { name: 'Muzaffarpur', cities: ['Muzaffarpur', 'Kanti', 'Motipur', 'Sahebganj'] },
      { name: 'Bhagalpur', cities: ['Bhagalpur', 'Kahalgaon', 'Sultanganj', 'Naugachhia'] },
      { name: 'Darbhanga', cities: ['Darbhanga', 'Benipur', 'Baheri'] },
      { name: 'Purnia', cities: ['Purnia', 'Kasba', 'Banmankhi', 'Baisi'] },
      { name: 'Rohtas', cities: ['Sasaram', 'Dehri', 'Nokha', 'Bikramganj'] },
      { name: 'Saran', cities: ['Chhapra', 'Revelganj', 'Marhaura', 'Dighwara'] },
      { name: 'Begusarai', cities: ['Begusarai', 'Barauni', 'Teghra', 'Bakhri'] },
      { name: 'Nalanda', cities: ['Bihar Sharif', 'Rajgir', 'Hilsa', 'Islampur'] }
    ]
  },
  {
    code: 'CG',
    name: 'Chhattisgarh',
    type: 'state',
    capital: 'Raipur',
    districts: [
      { name: 'Raipur', cities: ['Raipur', 'Birgaon', 'Tilda Newra', 'Arang'] },
      { name: 'Durg', cities: ['Bhilai', 'Durg', 'Kumhari', 'Patan'] },
      { name: 'Bilaspur', cities: ['Bilaspur', 'Bodri', 'Kota', 'Takhatpur'] },
      { name: 'Korba', cities: ['Korba', 'Katghora', 'Dipka'] },
      { name: 'Rajnandgaon', cities: ['Rajnandgaon', 'Dongargarh', 'Gandai'] },
      { name: 'Raigarh', cities: ['Raigarh', 'Kharsia', 'Sarangarh'] },
      { name: 'Bastar', cities: ['Jagdalpur', 'Bastanar', 'Tokapal'] }
    ]
  },
  {
    code: 'GA',
    name: 'Goa',
    type: 'state',
    capital: 'Panaji',
    districts: [
      { name: 'North Goa', cities: ['Panaji', 'Mapusa', 'Bicholim', 'Ponda', 'Calangute', 'Candolim', 'Porvorim'] },
      { name: 'South Goa', cities: ['Margao', 'Vasco da Gama', 'Curchorem', 'Cuncolim', 'Canacona', 'Colva'] }
    ]
  },
  {
    code: 'GJ',
    name: 'Gujarat',
    type: 'state',
    capital: 'Gandhinagar',
    districts: [
      { name: 'Ahmedabad', cities: ['Ahmedabad', 'Sanand', 'Dholka', 'Viramgam', 'Bavla', 'Bopal'] },
      { name: 'Surat', cities: ['Surat', 'Bardoli', 'Navsari Road', 'Kamrej', 'Mandvi'] },
      { name: 'Vadodara', cities: ['Vadodara', 'Padra', 'Dabhoi', 'Karjan', 'Savli'] },
      { name: 'Rajkot', cities: ['Rajkot', 'Gondal', 'Jetpur', 'Dhoraji', 'Upleta'] },
      { name: 'Gandhinagar', cities: ['Gandhinagar', 'Kalol', 'Mansa', 'Dehgam'] },
      { name: 'Bhavnagar', cities: ['Bhavnagar', 'Palitana', 'Sihor', 'Mahuva'] },
      { name: 'Jamnagar', cities: ['Jamnagar', 'Kalavad', 'Dhrol', 'Jodiya'] },
      { name: 'Kutch', cities: ['Bhuj', 'Gandhidham', 'Anjar', 'Mandvi', 'Mundra'] },
      { name: 'Junagadh', cities: ['Junagadh', 'Keshod', 'Mangrol', 'Manavadar'] },
      { name: 'Mehsana', cities: ['Mehsana', 'Kadi', 'Visnagar', 'Vadnagar', 'Unjha'] }
    ]
  },
  {
    code: 'HR',
    name: 'Haryana',
    type: 'state',
    capital: 'Chandigarh',
    districts: [
      { name: 'Gurugram', cities: ['Gurugram', 'Sohna', 'Manesar', 'Pataudi', 'Farrukhnagar'] },
      { name: 'Faridabad', cities: ['Faridabad', 'Ballabhgarh', 'Tigaon', 'Hodal'] },
      { name: 'Panchkula', cities: ['Panchkula', 'Kalka', 'Pinjore', 'Raipur Rani'] },
      { name: 'Ambala', cities: ['Ambala Cantt', 'Ambala City', 'Naraingarh', 'Barara'] },
      { name: 'Karnal', cities: ['Karnal', 'Gharaunda', 'Taraori', 'Assandh', 'Nilokheri'] },
      { name: 'Panipat', cities: ['Panipat', 'Samalkha', 'Israna', 'Madlauda'] },
      { name: 'Sonipat', cities: ['Sonipat', 'Gohana', 'Ganaur', 'Kharkhoda', 'Kundli'] },
      { name: 'Rohtak', cities: ['Rohtak', 'Meham', 'Sampla', 'Kalanaur'] },
      { name: 'Hisar', cities: ['Hisar', 'Hansi', 'Barwala', 'Ukrana'] }
    ]
  },
  {
    code: 'HP',
    name: 'Himachal Pradesh',
    type: 'state',
    capital: 'Shimla',
    districts: [
      { name: 'Shimla', cities: ['Shimla', 'Rampur', 'Rohru', 'Theog', 'Kufri', 'Mashobra'] },
      { name: 'Kangra', cities: ['Dharamshala', 'Kangra', 'Palampur', 'Nurpur', 'Dehra'] },
      { name: 'Mandi', cities: ['Mandi', 'Sundernagar', 'Sarkaghat', 'Jogindernagar'] },
      { name: 'Solan', cities: ['Solan', 'Baddi', 'Nalagarh', 'Parwanoo', 'Kasauli'] },
      { name: 'Kullu', cities: ['Kullu', 'Manali', 'Bhuntar', 'Banjar'] },
      { name: 'Sirmaur', cities: ['Nahan', 'Paonta Sahib', 'Rajgarh'] }
    ]
  },
  {
    code: 'JH',
    name: 'Jharkhand',
    type: 'state',
    capital: 'Ranchi',
    districts: [
      { name: 'Ranchi', cities: ['Ranchi', 'Kanke', 'Bundu', 'Hatia', 'Tupudana'] },
      { name: 'East Singhbhum', cities: ['Jamshedpur', 'Ghatshila', 'Musabani', 'Jugsalai', 'Mango'] },
      { name: 'Dhanbad', cities: ['Dhanbad', 'Jharia', 'Katras', 'Sindri', 'Nirsa'] },
      { name: 'Bokaro', cities: ['Bokaro Steel City', 'Chas', 'Bermo', 'Phusro'] },
      { name: 'Hazaribagh', cities: ['Hazaribagh', 'Barhi', 'Barkagaon'] },
      { name: 'Deoghar', cities: ['Deoghar', 'Madhupur', 'Jasidih'] }
    ]
  },
  {
    code: 'KA',
    name: 'Karnataka',
    type: 'state',
    capital: 'Bengaluru',
    districts: [
      { name: 'Bengaluru Urban', cities: ['Bengaluru', 'Indiranagar', 'Koramangala', 'Whitefield', 'HSR Layout', 'Jayanagar', 'Electronic City', 'Yelahanka', 'Hebbal', 'Marathahalli', 'BTM Layout'] },
      { name: 'Bengaluru Rural', cities: ['Nelamangala', 'Doddaballapura', 'Devanahalli', 'Hosakote'] },
      { name: 'Mysuru', cities: ['Mysuru', 'Nanjangud', 'Hunsur', 'T. Narasipura', 'K.R. Nagar'] },
      { name: 'Dakshina Kannada', cities: ['Mangaluru', 'Puttur', 'Bantwal', 'Belthangady', 'Sullia'] },
      { name: 'Dharwad', cities: ['Hubballi', 'Dharwad', 'Navalgund', 'Kalghatgi'] },
      { name: 'Belagavi', cities: ['Belagavi', 'Gokak', 'Chikkodi', 'Bailhongal', 'Nipani'] },
      { name: 'Kalaburagi', cities: ['Kalaburagi', 'Sedam', 'Chittapur', 'Aland'] },
      { name: 'Ballari', cities: ['Ballari', 'Hosapete', 'Kampli', 'Siruguppa'] },
      { name: 'Shivamogga', cities: ['Shivamogga', 'Bhadravati', 'Sagara', 'Shikaripura'] },
      { name: 'Tumakuru', cities: ['Tumakuru', 'Tiptur', 'Kunigal', 'Sira', 'Madhugiri'] },
      { name: 'Udupi', cities: ['Udupi', 'Manipal', 'Kundapura', 'Karkala', 'Brahmavara'] }
    ]
  },
  {
    code: 'KL',
    name: 'Kerala',
    type: 'state',
    capital: 'Thiruvananthapuram',
    districts: [
      { name: 'Thiruvananthapuram', cities: ['Thiruvananthapuram', 'Neyyattinkara', 'Attingal', 'Nedumangad', 'Varkala'] },
      { name: 'Ernakulam', cities: ['Kochi', 'Ernakulam', 'Aluva', 'Kakkanad', 'Tripunithura', 'Angamaly', 'Perumbavoor'] },
      { name: 'Kozhikode', cities: ['Kozhikode', 'Vatakara', 'Koyilandy', 'Feroke'] },
      { name: 'Thrissur', cities: ['Thrissur', 'Chalakudy', 'Kunnamkulam', 'Guruvayur', 'Kodungallur'] },
      { name: 'Kollam', cities: ['Kollam', 'Punalur', 'Karunagappalli', 'Paravur'] },
      { name: 'Kannur', cities: ['Kannur', 'Thalassery', 'Payyanur', 'Mattannur'] },
      { name: 'Kottayam', cities: ['Kottayam', 'Changanassery', 'Pala', 'Vaikom'] },
      { name: 'Palakkad', cities: ['Palakkad', 'Ottapalam', 'Chittur', 'Shoranur'] },
      { name: 'Malappuram', cities: ['Malappuram', 'Manjeri', 'Tirur', 'Perinthalmanna'] },
      { name: 'Alappuzha', cities: ['Alappuzha', 'Cherthala', 'Kayamkulam', 'Mavelikkara'] }
    ]
  },
  {
    code: 'MP',
    name: 'Madhya Pradesh',
    type: 'state',
    capital: 'Bhopal',
    districts: [
      { name: 'Bhopal', cities: ['Bhopal', 'Berasia', 'Kolar', 'Govindpura'] },
      { name: 'Indore', cities: ['Indore', 'Mhow', 'Depalpur', 'Sanwer', 'Rau'] },
      { name: 'Jabalpur', cities: ['Jabalpur', 'Sihora', 'Panagar', 'Patan'] },
      { name: 'Gwalior', cities: ['Gwalior', 'Dabra', 'Morar', 'Bhitarwar'] },
      { name: 'Ujjain', cities: ['Ujjain', 'Nagda', 'Mahidpur', 'Khachrod'] },
      { name: 'Sagar', cities: ['Sagar', 'Bina', 'Khurai', 'Deori'] },
      { name: 'Rewa', cities: ['Rewa', 'Mauganj', 'Teonthar', 'Mangawan'] },
      { name: 'Satna', cities: ['Satna', 'Maihar', 'Nagod', 'Amarpatan'] }
    ]
  },
  {
    code: 'MH',
    name: 'Maharashtra',
    type: 'state',
    capital: 'Mumbai',
    districts: [
      { name: 'Mumbai City', cities: ['Mumbai', 'Colaba', 'Dadar', 'Worli', 'Nariman Point', 'Byculla'] },
      { name: 'Mumbai Suburban', cities: ['Bandra', 'Andheri', 'Borivali', 'Goregaon', 'Juhu', 'Powai', 'Malad', 'Kurla', 'Ghatkopar'] },
      { name: 'Pune', cities: ['Pune', 'Pimpri-Chinchwad', 'Hinjawadi', 'Kothrud', 'Viman Nagar', 'Hadapsar', 'Wakdewadi', 'Baner', 'Baramati', 'Lonavala'] },
      { name: 'Thane', cities: ['Thane', 'Kalyan', 'Dombivli', 'Mira-Bhayandar', 'Ulhasnagar', 'Bhiwandi', 'Badlapur'] },
      { name: 'Nagpur', cities: ['Nagpur', 'Kamptee', 'Umred', 'Katol', 'Ramtek'] },
      { name: 'Nashik', cities: ['Nashik', 'Malegaon', 'Sinnar', 'Deolali', 'Niphad'] },
      { name: 'Chhatrapati Sambhaji Nagar', cities: ['Chhatrapati Sambhaji Nagar (Aurangabad)', 'Paithan', 'Vaijapur', 'Gangapur'] },
      { name: 'Solapur', cities: ['Solapur', 'Pandharpur', 'Barshi', 'Akkalkot'] },
      { name: 'Kolhapur', cities: ['Kolhapur', 'Ichalkaranji', 'Jaysingpur', 'Gadhinglaj'] },
      { name: 'Amravati', cities: ['Amravati', 'Achalpur', 'Anjangaon', 'Badnera'] },
      { name: 'Raigad', cities: ['Navi Mumbai (Panvel)', 'Alibaug', 'Karjat', 'Khopoli', 'Pen', 'Uran'] }
    ]
  },
  {
    code: 'MN',
    name: 'Manipur',
    type: 'state',
    capital: 'Imphal',
    districts: [
      { name: 'Imphal East', cities: ['Imphal', 'Porompat', 'Andro', 'Lamlai'] },
      { name: 'Imphal West', cities: ['Imphal', 'Lamphelpat', 'Lilong', 'Mayang Imphal'] },
      { name: 'Thoubal', cities: ['Thoubal', 'Kakching', 'Yairipok'] },
      { name: 'Bishnupur', cities: ['Bishnupur', 'Moirang', 'Nambol'] },
      { name: 'Churachandpur', cities: ['Churachandpur', 'Tuibong', 'Singngat'] }
    ]
  },
  {
    code: 'ML',
    name: 'Meghalaya',
    type: 'state',
    capital: 'Shillong',
    districts: [
      { name: 'East Khasi Hills', cities: ['Shillong', 'Cherrapunji (Sohra)', 'Pynursla', 'Mawkynrew'] },
      { name: 'West Garo Hills', cities: ['Tura', 'Tikrikilla', 'Dalu'] },
      { name: 'Ri Bhoi', cities: ['Nongpoh', 'Umsning', 'Byrnihat'] },
      { name: 'West Jaintia Hills', cities: ['Jowai', 'Thadlaskein', 'Amlarem'] }
    ]
  },
  {
    code: 'MZ',
    name: 'Mizoram',
    type: 'state',
    capital: 'Aizawl',
    districts: [
      { name: 'Aizawl', cities: ['Aizawl', 'Darlawn', 'Sairang'] },
      { name: 'Lunglei', cities: ['Lunglei', 'Tlabung', 'Hnahthial'] },
      { name: 'Champhai', cities: ['Champhai', 'Khawzawl', 'North Vanlaiphai'] },
      { name: 'Kolasib', cities: ['Kolasib', 'Bairabi', 'Vairengte'] },
      { name: 'Serchhip', cities: ['Serchhip', 'Thenzawl'] }
    ]
  },
  {
    code: 'NL',
    name: 'Nagaland',
    type: 'state',
    capital: 'Kohima',
    districts: [
      { name: 'Kohima', cities: ['Kohima', 'Tseminyu', 'Chiephobozou'] },
      { name: 'Dimapur', cities: ['Dimapur', 'Chumoukedima', 'Medziphema'] },
      { name: 'Mokokchung', cities: ['Mokokchung', 'Changtongya', 'Tuli'] },
      { name: 'Wokha', cities: ['Wokha', 'Bhandari', 'Sanis'] },
      { name: 'Tuensang', cities: ['Tuensang', 'Longkhim', 'Noksen'] }
    ]
  },
  {
    code: 'OD',
    name: 'Odisha',
    type: 'state',
    capital: 'Bhubaneswar',
    districts: [
      { name: 'Khurda', cities: ['Bhubaneswar', 'Jatni', 'Khordha', 'Banapur'] },
      { name: 'Cuttack', cities: ['Cuttack', 'Choudwar', 'Banki', 'Athagarh'] },
      { name: 'Ganjam', cities: ['Berhampur', 'Chhatrapur', 'Aska', 'Hinjilicut', 'Bhanjanagar'] },
      { name: 'Sundargarh', cities: ['Rourkela', 'Sundargarh', 'Rajgangpur', 'Biramitrapur'] },
      { name: 'Puri', cities: ['Puri', 'Pipili', 'Konark', 'Nimapada'] },
      { name: 'Balasore', cities: ['Balasore', 'Jaleswar', 'Soro', 'Nilagiri'] },
      { name: 'Sambalpur', cities: ['Sambalpur', 'Burla', 'Hirakud', 'Kuchinda'] }
    ]
  },
  {
    code: 'PB',
    name: 'Punjab',
    type: 'state',
    capital: 'Chandigarh',
    districts: [
      { name: 'Ludhiana', cities: ['Ludhiana', 'Khanna', 'Jagraon', 'Samrala', 'Raikot'] },
      { name: 'Amritsar', cities: ['Amritsar', 'Majitha', 'Ajnala', 'Attari'] },
      { name: 'Jalandhar', cities: ['Jalandhar', 'Phagwara Road', 'Kartarpur', 'Nakodar', 'Phillaur'] },
      { name: 'SAS Nagar (Mohali)', cities: ['Mohali (SAS Nagar)', 'Kharar', 'Zirakpur', 'Dera Bassi', 'Kurali'] },
      { name: 'Patiala', cities: ['Patiala', 'Nabha', 'Rajpura', 'Samana'] },
      { name: 'Bathinda', cities: ['Bathinda', 'Rampura Phul', 'Talwandi Sabo', 'Maur'] },
      { name: 'Hoshiarpur', cities: ['Hoshiarpur', 'Dasuya', 'Mukerian', 'Garhshankar'] }
    ]
  },
  {
    code: 'RJ',
    name: 'Rajasthan',
    type: 'state',
    capital: 'Jaipur',
    districts: [
      { name: 'Jaipur', cities: ['Jaipur', 'Chomu', 'Amer', 'Sanganer', 'Bagru', 'Kotputli'] },
      { name: 'Jodhpur', cities: ['Jodhpur', 'Phalodi', 'Piparcity', 'Bilara'] },
      { name: 'Kota', cities: ['Kota', 'Ramganj Mandi', 'Sangod', 'Itawa'] },
      { name: 'Bikaner', cities: ['Bikaner', 'Nokha', 'Lunkaransar', 'Sridungargarh'] },
      { name: 'Ajmer', cities: ['Ajmer', 'Kishangarh', 'Beawar', 'Pushkar', 'Nasirabad'] },
      { name: 'Udaipur', cities: ['Udaipur', 'Fatehnagar', 'Salumbar', 'Mavli'] },
      { name: 'Alwar', cities: ['Alwar', 'Bhiwadi', 'Tijara', 'Behror', 'Rajgarh'] },
      { name: 'Bhilwara', cities: ['Bhilwara', 'Shahpura', 'Mandal', 'Gulabpura'] },
      { name: 'Sikar', cities: ['Sikar', 'Fatehpur', 'Lachhmangarh', 'Neem Ka Thana', 'Khandela'] }
    ]
  },
  {
    code: 'SK',
    name: 'Sikkim',
    type: 'state',
    capital: 'Gangtok',
    districts: [
      { name: 'East Sikkim', cities: ['Gangtok', 'Singtam', 'Rangpo', 'Pakyong'] },
      { name: 'West Sikkim', cities: ['Geyzing', 'Pelling', 'Dentam', 'Yuksom'] },
      { name: 'South Sikkim', cities: ['Namchi', 'Jorethang', 'Ravangla'] },
      { name: 'North Sikkim', cities: ['Mangan', 'Chungthang', 'Lachen', 'Lachung'] }
    ]
  },
  {
    code: 'TN',
    name: 'Tamil Nadu',
    type: 'state',
    capital: 'Chennai',
    districts: [
      { name: 'Chennai', cities: ['Chennai', 'T. Nagar', 'Anna Nagar', 'Adyar', 'Velachery', 'Tambaram', 'Guindy', 'Mylapore'] },
      { name: 'Coimbatore', cities: ['Coimbatore', 'Pollachi', 'Mettupalayam', 'Sulur', 'Valparai'] },
      { name: 'Madurai', cities: ['Madurai', 'Melur', 'Thirumangalam', 'Usilampatti', 'Sholavandan'] },
      { name: 'Tiruchirappalli', cities: ['Tiruchirappalli (Trichy)', 'Manapparai', 'Thuraiyur', 'Lalgudi'] },
      { name: 'Salem', cities: ['Salem', 'Attur', 'Mettur', 'Edappadi', 'Omalur'] },
      { name: 'Tiruppur', cities: ['Tiruppur', 'Udumalaipettai', 'Dharapuram', 'Avinashi', 'Palladam'] },
      { name: 'Chengalpattu', cities: ['Tambaram', 'Chengalpattu', 'Pallavaram', 'Chromepet', 'Mahabalipuram'] },
      { name: 'Erode', cities: ['Erode', 'Gobichettipalayam', 'Bhavani', 'Perundurai'] },
      { name: 'Tirunelveli', cities: ['Tirunelveli', 'Palayamkottai', 'Ambasamudram', 'Nanguneri'] },
      { name: 'Vellore', cities: ['Vellore', 'Katpadi', 'Gudiyatham', 'Anaicut'] }
    ]
  },
  {
    code: 'TS',
    name: 'Telangana',
    type: 'state',
    capital: 'Hyderabad',
    districts: [
      { name: 'Hyderabad', cities: ['Hyderabad', 'Secunderabad', 'Banjara Hills', 'Jubilee Hills', 'Gachibowli', 'Madhapur', 'Kukatpally', 'Ameerpet', 'Charminar', 'Dilsukhnagar'] },
      { name: 'Medchal-Malkajgiri', cities: ['Malkajgiri', 'Medchal', 'Kompally', 'Alwal', 'Quthbullapur', 'Ghatkesar'] },
      { name: 'Rangareddy', cities: ['Shamshabad', 'Rajendranagar', 'L.B. Nagar', 'Hayathnagar', 'Ibrahimpatnam'] },
      { name: 'Warangal Urban', cities: ['Warangal', 'Hanamkonda', 'Kazipet'] },
      { name: 'Karimnagar', cities: ['Karimnagar', 'Huzurabad', 'Choppadandi', 'Jammikunta'] },
      { name: 'Nizamabad', cities: ['Nizamabad', 'Bodhan', 'Armoor', 'Bheemgal'] },
      { name: 'Khammam', cities: ['Khammam', 'Madhira', 'Sathupalli', 'Wyra'] }
    ]
  },
  {
    code: 'TR',
    name: 'Tripura',
    type: 'state',
    capital: 'Agartala',
    districts: [
      { name: 'West Tripura', cities: ['Agartala', 'Ranirbazar', 'Mohanpur'] },
      { name: 'Gomati', cities: ['Udaipur', 'Amarpur', 'Karbook'] },
      { name: 'South Tripura', cities: ['Belonia', 'Sabroom', 'Santirbazar'] },
      { name: 'North Tripura', cities: ['Dharmanagar', 'Kanchanpur', 'Panisagar'] },
      { name: 'Dhalai', cities: ['Ambassa', 'Kamalpur', 'Gandacharra'] }
    ]
  },
  {
    code: 'UP',
    name: 'Uttar Pradesh',
    type: 'state',
    capital: 'Lucknow',
    districts: [
      { name: 'Lucknow', cities: ['Lucknow', 'Gomti Nagar', 'Alambagh', 'Hazratganj', 'Indira Nagar', 'Malihabad'] },
      { name: 'Kanpur Nagar', cities: ['Kanpur', 'Kalyanpur', 'Kidwai Nagar', 'Govind Nagar', 'Bilhaur'] },
      { name: 'Gautam Buddha Nagar', cities: ['Noida', 'Greater Noida', 'Dadri', 'Jewar'] },
      { name: 'Ghaziabad', cities: ['Ghaziabad', 'Indirapuram', 'Vaishali', 'Modinagar', 'Muradnagar', 'Loni'] },
      { name: 'Varanasi', cities: ['Varanasi', 'Ramnagar', 'Pindra', 'Shivpur'] },
      { name: 'Prayagraj', cities: ['Prayagraj (Allahabad)', 'Naini', 'Phulpur', 'Soraon', 'Koraon'] },
      { name: 'Agra', cities: ['Agra', 'Fatehabad', 'Etmadpur', 'Kheragarh', 'Bah'] },
      { name: 'Meerut', cities: ['Meerut', 'Sardhana', 'Mawana', 'Hastinapur'] },
      { name: 'Bareilly', cities: ['Bareilly', 'Aonla', 'Baheri', 'Faridpur', 'Nawabganj'] },
      { name: 'Aligarh', cities: ['Aligarh', 'Khair', 'Atrauli', 'Iglas'] },
      { name: 'Gorakhpur', cities: ['Gorakhpur', 'Sahjanwa', 'Campierganj', 'Bansgaon'] },
      { name: 'Mathura', cities: ['Mathura', 'Vrindavan', 'Govardhan', 'Chhata', 'Barsana'] },
      { name: 'Ayodhya', cities: ['Ayodhya', 'Faizabad', 'Bikapur', 'Rudauli'] },
      { name: 'Jhansi', cities: ['Jhansi', 'Mauranipur', 'Babina', 'Moth'] },
      { name: 'Moradabad', cities: ['Moradabad', 'Kanth', 'Bilari', 'Thakurdwara'] }
    ]
  },
  {
    code: 'UK',
    name: 'Uttarakhand',
    type: 'state',
    capital: 'Dehradun',
    districts: [
      { name: 'Dehradun', cities: ['Dehradun', 'Rishikesh', 'Mussoorie', 'Vikasnagar', 'Doiwala'] },
      { name: 'Haridwar', cities: ['Haridwar', 'Roorkee', 'Laksar', 'Bhagwanpur'] },
      { name: 'Nainital', cities: ['Nainital', 'Haldwani', 'Ramnagar', 'Bhimtal', 'Lalkuan'] },
      { name: 'Udham Singh Nagar', cities: ['Rudrapur', 'Kashipur', 'Kichha', 'Khatima', 'Sitarganj'] },
      { name: 'Pauri Garhwal', cities: ['Pauri', 'Kotdwar', 'Srinagar', 'Lansdowne'] },
      { name: 'Almora', cities: ['Almora', 'Ranikhet', 'Dwarahat'] }
    ]
  },
  {
    code: 'WB',
    name: 'West Bengal',
    type: 'state',
    capital: 'Kolkata',
    districts: [
      { name: 'Kolkata', cities: ['Kolkata', 'Salt Lake', 'Park Street', 'New Town', 'Ballygunge', 'Dum Dum', 'Behala', 'Alipore'] },
      { name: 'North 24 Parganas', cities: ['Barasat', 'Barrackpore', 'Bidhannagar', 'Madhyamgram', 'Habra', 'Basirhat'] },
      { name: 'South 24 Parganas', cities: ['Alipore', 'Baruipur', 'Canning', 'Diamond Harbour', 'Sonarpur'] },
      { name: 'Howrah', cities: ['Howrah', 'Uluberia', 'Bally', 'Domjur', 'Amta'] },
      { name: 'Hooghly', cities: ['Chinsurah', 'Chandannagar', 'Serampore', 'Uttarpara', 'Arambagh'] },
      { name: 'Paschim Bardhaman', cities: ['Asansol', 'Durgapur', 'Raniganj', 'Kulti'] },
      { name: 'Purba Medinipur', cities: ['Tamluk', 'Haldia', 'Digha', 'Contai'] },
      { name: 'Darjeeling', cities: ['Darjeeling', 'Siliguri', 'Kurseong', 'Mirik'] },
      { name: 'Malda', cities: ['English Bazar (Malda)', 'Old Malda', 'Chanchal'] }
    ]
  },

  // 8 UNION TERRITORIES
  {
    code: 'AN',
    name: 'Andaman and Nicobar Islands',
    type: 'ut',
    capital: 'Port Blair',
    districts: [
      { name: 'South Andaman', cities: ['Port Blair', 'Garacharma', 'Ferrargunj'] },
      { name: 'North and Middle Andaman', cities: ['Mayabunder', 'Diglipur', 'Rangat'] },
      { name: 'Nicobar', cities: ['Car Nicobar', 'Great Nicobar', 'Nancowry'] }
    ]
  },
  {
    code: 'CH',
    name: 'Chandigarh',
    type: 'ut',
    capital: 'Chandigarh',
    districts: [
      { name: 'Chandigarh', cities: ['Chandigarh', 'Sector 17', 'Sector 35', 'Sector 22', 'Manimajra', 'Industrial Area'] }
    ]
  },
  {
    code: 'DH',
    name: 'Dadra and Nagar Haveli and Daman and Diu',
    type: 'ut',
    capital: 'Daman',
    districts: [
      { name: 'Daman', cities: ['Daman', 'Nani Daman', 'Moti Daman'] },
      { name: 'Diu', cities: ['Diu', 'Ghoghla', 'Fudam'] },
      { name: 'Dadra and Nagar Haveli', cities: ['Silvassa', 'Dadra', 'Amli', 'Naroli'] }
    ]
  },
  {
    code: 'DL',
    name: 'Delhi',
    type: 'ut',
    capital: 'New Delhi',
    districts: [
      { name: 'New Delhi', cities: ['Connaught Place', 'Chanakyapuri', 'Barakhamba Road', 'Khan Market'] },
      { name: 'South Delhi', cities: ['Hauz Khas', 'Saket', 'Greater Kailash', 'Lajpat Nagar', 'Malviya Nagar', 'Vasant Kunj'] },
      { name: 'South West Delhi', cities: ['Dwarka', 'Janakpuri', 'Najafgarh', 'Vasant Vihar', 'Palam'] },
      { name: 'West Delhi', cities: ['Rajouri Garden', 'Punjabi Bagh', 'Patel Nagar', 'Tilak Nagar', 'Paschim Vihar'] },
      { name: 'North Delhi', cities: ['Civil Lines', 'Kashmere Gate', 'Sadar Bazar', 'Model Town'] },
      { name: 'North West Delhi', cities: ['Rohini', 'Pitampura', 'Shalimar Bagh', 'Saraswati Vihar'] },
      { name: 'East Delhi', cities: ['Preet Vihar', 'Mayur Vihar', 'Laxmi Nagar', 'Patparganj'] },
      { name: 'North East Delhi', cities: ['Seelampur', 'Yamuna Vihar', 'Shahdara', 'Dilshad Garden'] }
    ]
  },
  {
    code: 'JK',
    name: 'Jammu and Kashmir',
    type: 'ut',
    capital: 'Srinagar / Jammu',
    districts: [
      { name: 'Srinagar', cities: ['Srinagar', 'Lal Chowk', 'Rajbagh', 'Hazratbal', 'Soura'] },
      { name: 'Jammu', cities: ['Jammu', 'Gandhi Nagar', 'R.S. Pura', 'Akhnoor', 'Bishnah'] },
      { name: 'Anantnag', cities: ['Anantnag', 'Bijbehara', 'Pahalgam', 'Dooru'] },
      { name: 'Baramulla', cities: ['Baramulla', 'Sopore', 'Gulmarg', 'Uri', 'Pattan'] },
      { name: 'Udhampur', cities: ['Udhampur', 'Ramnagar', 'Chenani'] },
      { name: 'Pulwama', cities: ['Pulwama', 'Awantipora', 'Pampore', 'Tral'] }
    ]
  },
  {
    code: 'LA',
    name: 'Ladakh',
    type: 'ut',
    capital: 'Leh',
    districts: [
      { name: 'Leh', cities: ['Leh', 'Nubra', 'Chushul', 'Khaltse'] },
      { name: 'Kargil', cities: ['Kargil', 'Drass', 'Sankoo', 'Zanskar'] }
    ]
  },
  {
    code: 'LD',
    name: 'Lakshadweep',
    type: 'ut',
    capital: 'Kavaratti',
    districts: [
      { name: 'Lakshadweep', cities: ['Kavaratti', 'Agatti', 'Andrott', 'Amini', 'Minicoy'] }
    ]
  },
  {
    code: 'PY',
    name: 'Puducherry',
    type: 'ut',
    capital: 'Puducherry',
    districts: [
      { name: 'Puducherry', cities: ['Puducherry', 'Ozhukarai', 'Villianur', 'Ariyankuppam'] },
      { name: 'Karaikal', cities: ['Karaikal', 'Kottucherry', 'Nedungadu', 'Neravy'] },
      { name: 'Mahe', cities: ['Mahe', 'Pandakkal', 'Chalakkara'] },
      { name: 'Yanam', cities: ['Yanam', 'Guerempeta', 'Farampeta'] }
    ]
  }
];

// Helper functions for dynamic lookups
export function getAllStates(): { code: string; name: string; type: 'state' | 'ut' }[] {
  return INDIA_STATES_DATA.map(s => ({ code: s.code, name: s.name, type: s.type }));
}

export function getDistrictsByState(stateName: string): IndiaDistrict[] {
  const state = INDIA_STATES_DATA.find(
    s => s.name.toLowerCase() === stateName.toLowerCase() || s.code.toLowerCase() === stateName.toLowerCase()
  );
  return state ? state.districts : [];
}

export function getCitiesByDistrict(stateName: string, districtName: string): string[] {
  const districts = getDistrictsByState(stateName);
  const district = districts.find(d => d.name.toLowerCase() === districtName.toLowerCase());
  return district ? district.cities : [];
}

// Search across all cities in India for quick search autocomplete
export function searchLocations(query: string, limit = 15): { city: string; district: string; state: string }[] {
  if (!query || query.trim().length < 2) return [];
  const q = query.trim().toLowerCase();
  const results: { city: string; district: string; state: string }[] = [];

  for (const state of INDIA_STATES_DATA) {
    for (const dist of state.districts) {
      for (const city of dist.cities) {
        if (
          city.toLowerCase().includes(q) ||
          dist.name.toLowerCase().includes(q) ||
          state.name.toLowerCase().includes(q)
        ) {
          results.push({ city, district: dist.name, state: state.name });
          if (results.length >= limit) return results;
        }
      }
    }
  }

  return results;
}
