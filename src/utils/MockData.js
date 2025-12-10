import { TravelInsurance, Scooter, CourierServices, Message, PremiumLounge, ProfileIconBox, ClanderIcon1, ClanderIcon2, Holidays, WeeklyIcon } from './SvgImage';
import { scale } from './Responsive';

export const COUNTRIE = [
  { label: 'Armenia', value: 'Armenia', iso: 'AM', iso3: 'ARM' },
  { label: 'Bahrain', value: 'Bahrain', iso: 'BH', iso3: 'BHR' },
  { label: 'Bolivia', value: 'Bolivia', iso: 'BO', iso3: 'BOL' },
  { label: 'Iran', value: 'Iran', iso: 'IR', iso3: 'IRN' },
  { label: 'Ireland', value: 'Ireland', iso: 'IE', iso3: 'IRL' },
  { label: 'Israel', value: 'Israel', iso: 'IL', iso3: 'ISR' },
  { label: 'Jordan', value: 'Jordan', iso: 'JO', iso3: 'JOR' },
  { label: 'Kenya', value: 'Kenya', iso: 'KE', iso3: 'KEN' },
  { label: 'Lebanon', value: 'Lebanon', iso: 'LB', iso3: 'LBN' },
  { label: 'Malaysia', value: 'Malaysia', iso: 'MY', iso3: 'MYS' },
  { label: 'Nepal', value: 'Nepal', iso: 'NP', iso3: 'NPL' },
  { label: 'Oman', value: 'Oman', iso: 'OM', iso3: 'OMN' },
  { label: 'South Africa', value: 'South Africa', iso: 'ZA', iso3: 'ZAF' },
  { label: 'United Kingdom', value: 'United Kingdom', iso: 'GB', iso3: 'GBR' },
  { label: 'Argentina', value: 'Argentina', iso: 'AR', iso3: 'ARG' },
  { label: 'Iraq', value: 'Iraq', iso: 'IQ', iso3: 'IRQ' },
  { label: 'Brazil', value: 'Brazil', iso: 'BR', iso3: 'BRA' },
  { label: 'Cambodia', value: 'Cambodia', iso: 'KH', iso3: 'KHM' },
  { label: 'Cuba', value: 'Cuba', iso: 'CU', iso3: 'CUB' },
  { label: 'Laos', value: 'Laos', iso: 'LA', iso3: 'LAO' },
  { label: 'Mongolia', value: 'Mongolia', iso: 'MN', iso3: 'MNG' },
  { label: 'Taiwan', value: 'Taiwan', iso: 'TW', iso3: 'TWN' },
];

export const COUNTRIES = [
  { label: 'Slovakia', value: 'Slovakia', iso: 'SK', iso3: 'SVK' },
];


export const destinationData = [
  {
    id: '1',
    name: 'Armenia',
    location: 'Geghard',
    rating: 4.7,
    users: 50,
    Flag: {
      image: require('../assets/images/Armania_flag.png')
    },
    image: require('../assets/images/Armenia.png'),
    details: {
      header: {
        title: "Welcome to BLS Armenia Visa Centre",
        description: "BLS International Services Ltd. is a trustworthy partner of the Embassy of Armenia for managing the administrative and non-judgmental tasks of processing visa applications. Applicants are solely responsible for the application(s) they submit. Any false information or misrepresentation of facts, incomplete or invalid supporting documents will have a direct bearing on the decision carried out by the Embassy of Armenia.",
      },
      favoritePlaces: {
        title: "Favorite Places",
        navigation: {
          places: [
            {
              id: '1',
              name: 'Colosseum',
              image: require('../assets/images/FavoritePlaces3.png'),
            },
            {
              id: '2',
              name: 'Trevi Fountain',
              image: require('../assets/images/FavoritePlaces2.png'),
            },
            {
              id: '3',
              name: 'Europe',
              image: require('../assets/images/FavoritePlaces1.png'),
            },
          ],
          activeTab: "vas"
        },
      },
      contact: {
        title: "Contact",
        description: "For any queries, kindly contact us on our call centre or write to us.",
        phone: "+374 10 123456",
        email: "info.armenia@blshelpline.com",
        operatingHours: {
          submission: {
            schedule: "Monday to Friday 09:00-17:00"
          },
          collection: {
            schedule: "Monday to Friday 09:00-17:00"
          }
        }
      },
    }
  },
  {
    id: '2',
    name: 'Bahrain',
    location: 'Bahrain International Circuit',
    rating: 4.5,
    users: 30,
    image: require('../assets/images/Bahrain.png'),
  },
  {
    id: '3',
    name: 'Bolivia',
    location: 'La Paz',
    rating: 4.5,
    users: 30,
    image: require('../assets/images/Bolivia.png'),
  },
  {
    id: '4',
    name: 'Iran',
    location: 'Golestan Palace',
    rating: 4.5,
    users: 30,
    image: require('../assets/images/iran.png'),
  },
  {
    id: '5',
    name: 'Ireland',
    location: 'Cliffs of Moher',
    rating: 4.5,
    users: 30,
    image: require('../assets/images/Ireland.png'),
  },
  {
    id: '6',
    name: 'Israel',
    location: 'The Israel Museum, Jerusalem',
    rating: 4.5,
    users: 30,
    image: require('../assets/images/Israel.png'),
  },
];
export const Long_data = [
  { id: '1', title: 'Tourism' },
  { id: '2', title: 'Business' },
  { id: '3', title: 'Transit' },
];
export const data = [
  { id: '1', title: 'Tourism' },
  { id: '2', title: 'Business' },
  { id: '3', title: 'Transit' },
  { id: '4', title: 'Medical' },
];

export const services = [
  { id: '1', title: 'Doorstep Delivery Services', icon: <Scooter width={scale(54)} height={scale(44)} /> },
  { id: '2', title: 'Automated SMS of Visa Status', icon: <Message width={scale(54)} height={scale(44)} /> },
  { id: '3', title: 'Courier Services', icon: <CourierServices width={scale(54)} height={scale(44)} /> },
  { id: '4', title: 'Travel Insurance', icon: <TravelInsurance width={scale(54)} height={scale(44)} /> },
  { id: '5', title: 'Premium Lounge', icon: <PremiumLounge width={scale(54)} height={scale(44)} /> },
];


export const data_center = [
  {
    "l_id": "1",
    "l_name": "Islamabad",
    "c_name": "Pakistan"
  },
  {
    "l_id": "2",
    "l_name": "Lahore",
    "c_name": "Pakistan"
  },
  {
    "l_id": "3",
    "l_name": "Karachi",
    "c_name": "Pakistan"
  },
  {
    "l_id": "4",
    "l_name": "Faisalabad",
    "c_name": "Pakistan"
  },
  {
    "l_id": "5",
    "l_name": "Multan",
    "c_name": "Pakistan"
  },
  {
    "l_id": "6",
    "l_name": "Quetta",
    "c_name": "Pakistan"
  }
]
export const boxData = [
  {
    id: '1',
    text: 'Appointment Available',
    IconComponent: ProfileIconBox,
    backgroundColor: '#5cb85c',
    span: 1, // Indicates it takes 1 column (half width)
  },
  {
    id: '2',
    text: 'Appointment Booked',
    IconComponent: ClanderIcon1,
    backgroundColor: '#d9534f',
    span: 1,
  },
  {
    id: '3',
    text: 'Currently Selected Day',
    IconComponent: ClanderIcon2,
    backgroundColor: '#337ab7',
    span: 1,
  },
  {
    id: '4',
    text: 'Weekly Off Day',
    IconComponent: WeeklyIcon,
    backgroundColor: '#6c757d',
    span: 1,
  },
  {
    id: '5',
    text: 'Holiday',
    IconComponent: Holidays,
    backgroundColor: '#f0ad4e',
    span: 2,
  },
];