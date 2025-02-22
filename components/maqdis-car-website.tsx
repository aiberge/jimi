'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { 
  Mail, 
  Phone, 
  Menu, 
  X, 
  Globe, 
  Check, 
  ChevronDown, 
  Clock, 
  UserCheck, 
  MapPin,
  Armchair,
  Fuel,
  Gauge,
  Briefcase,
  CheckCircle2,
  Palette
} from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { translations } from '../translations/translations'
import Modal from './Modal'
import ReservationForm from './ReservationForm'
import { useLanguageSwitch, Language, languageNames } from '@/utils/language'

// Define the Car type
type Car = {
  id: number;
  name: string;
  version: string;
  type: string;
  price: number;
  image: string;
  featured: boolean;
  transmission: string;
  seats: number;
  luggage: number;
  airConditioning: boolean;
  fuel: string;
  maxSpeed: number;
  trunkSize: number;
  colors: string[];
}

const cars: Car[] = [
  {
    id: 1,
    name: 'Dacia Logan',
    version: 'Diesel',
    type: 'Économique',
    price: 250,
    image: '/dacia.jpg',
    featured: false,
    transmission: 'Manuelle',
    seats: 5,
    luggage: 3,
    airConditioning: true,
    fuel: 'diesel',
    maxSpeed: 170,
    trunkSize: 510,
    colors: ['gris', 'noir']
  },
  {
    id: 2,
    name: 'Dacia Sandero',
    version: 'Base',
    type: 'Économique',
    price: 250,
    image: '/strtt.jpg',
    featured: false,
    transmission: 'Manuelle',
    seats: 5,
    luggage: 2,
    airConditioning: true,
    fuel: 'diesel',
    maxSpeed: 170,
    trunkSize: 320,
    colors: ['noir', 'blanc']
  },
  {
    id: 3,
    name: 'Renault Clio 5',
    version: 'Diesel',
    type: 'Économique',
    price: 300,
    image: '/clio24.jpg',
    featured: true,
    transmission: 'Manuelle',
    seats: 5,
    luggage: 2,
    airConditioning: true,
    fuel: 'diesel',
    maxSpeed: 180,
    trunkSize: 391,
    colors: ['noir', 'gris', 'bleu']
  },
  {
    id: 4,
    name: 'Citroën C3',
    version: 'Diesel',
    type: 'Économique',
    price: 250,
    image: '/c3.jpg',
    featured: false,
    transmission: 'Manuelle',
    seats: 5,
    luggage: 2,
    airConditioning: true,
    fuel: 'diesel',
    maxSpeed: 170,
    trunkSize: 300,
    colors: ['gris', 'blanc']
  },
  {
    id: 5,
    name: 'Citroën C3',
    version: 'Automatique',
    type: 'Économique',
    price: 300,
    image: '/c3.jpg',
    featured: true,
    transmission: 'Automatique',
    seats: 5,
    luggage: 2,
    airConditioning: true,
    fuel: 'essence',
    maxSpeed: 170,
    trunkSize: 300,
    colors: ['gris', 'blanc']
  },
  {
    id: 6,
    name: 'Peugeot 208',
    version: 'Diesel',
    type: 'Économique',
    price: 300,
    image: '/208.jpeg',
    featured: true,
    transmission: 'Manuelle',
    seats: 5,
    luggage: 2,
    airConditioning: true,
    fuel: 'diesel',
    maxSpeed: 180,
    trunkSize: 311,
    colors: ['gris', 'noir']
  },
  {
    id: 7,
    name: 'Citroën C-Elysée',
    version: 'Diesel',
    type: 'Berline',
    price: 300,
    image: '/Celyse.jpg',
    featured: false,
    transmission: 'Manuelle',
    seats: 5,
    luggage: 3,
    airConditioning: true,
    fuel: 'diesel',
    maxSpeed: 180,
    trunkSize: 506,
    colors: ['gris']
  },
  {
    id: 8,
    name: 'Dacia Sandero Stepway',
    version: 'Diesel',
    type: 'SUV',
    price: 300,
    image: '/dacia-Stepway.webp',
    featured: true,
    transmission: 'Manuelle',
    seats: 5,
    luggage: 3,
    airConditioning: true,
    fuel: 'diesel',
    maxSpeed: 170,
    trunkSize: 320,
    colors: ['orange']
  },
  {
    id: 9,
    name: 'Dacia Lodgy',
    version: '7 Places',
    type: 'Monospace',
    price: 400,
    image: '/lodg.jpg',
    featured: true,
    transmission: 'Manuelle',
    seats: 7,
    luggage: 4,
    airConditioning: true,
    fuel: 'diesel',
    maxSpeed: 170,
    trunkSize: 827,
    colors: ['noir']
  },
  {
    id: 10,
    name: 'Volkswagen Touareg',
    version: 'V6 TDI',
    type: 'SUV',
    price: 1200,
    image: '/w.jpeg',
    featured: true,
    transmission: 'Automatique',
    seats: 5,
    luggage: 4,
    airConditioning: true,
    fuel: 'diesel',
    maxSpeed: 235,
    trunkSize: 810,
    colors: ['noir', 'argent', 'blanc']
  },
  {
    id: 11,
    name: 'Hyundai Tucson',
    version: 'CRDi',
    type: 'SUV',
    price: 800,
    image: '/tucson.jpeg',
    featured: false,
    transmission: 'Automatique',
    seats: 5,
    luggage: 3,
    airConditioning: true,
    fuel: 'diesel',
    maxSpeed: 201,
    trunkSize: 620,
    colors: ['gris', 'blanc', 'bleu']
  },
];

const airports = [
  { code: 'FEZ', name: 'Fès–Saïs Airport - Fès' },
  { code: 'FES', name: 'Fès-centre ville - Fès' },
  { code: 'TIZ', name: 'Fes-centre ville - Fès' },
]

const CarCard = ({ car }: { car: Car }) => {
  const [isReservationModalOpen, setIsReservationModalOpen] = useState(false);

  const handleWhatsAppClick = (car: Car) => {
    const message = `Bonjour, je suis intéressé(e) par la location de ${car.name} à ${car.price}dh/jour.`
    const whatsappUrl = `https://wa.me/212664691080?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
  };

  return (
    <>
      <Modal
        isOpen={isReservationModalOpen}
        onClose={() => setIsReservationModalOpen(false)}
      >
        <ReservationForm
          car={car}
          onClose={() => setIsReservationModalOpen(false)}
        />
      </Modal>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
      >
        <div className="relative h-64">
          <div className="absolute top-4 left-4 z-10">
            <span className="bg-white text-primary px-4 py-2 rounded-full text-sm font-semibold">
              {car.type}
            </span>
          </div>
          <Image
            src={car.image}
            alt={`${car.name} ${car.version} - Voiture à louer à Fès - ${car.type}`}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={car.featured}
          />
        </div>

        <div className="p-6">
          <h3 className="text-2xl font-bold text-gray-800 mb-2">{car.name}</h3>
          <div className="grid grid-cols-2 gap-6 mb-8">
            <div className="flex items-center gap-2">
              <Armchair className="w-5 h-5 text-primary" />
              <span className="text-gray-700 text-sm">{car.seats} places</span>
            </div>
            <div className="flex items-center gap-2">
              <Fuel className="w-5 h-5 text-primary" />
              <span className="text-gray-700 text-sm">{car.fuel}</span>
            </div>
            <div className="flex items-center gap-2">
              <Gauge className="w-5 h-5 text-primary" />
              <span className="text-gray-700 text-sm">{car.transmission}</span>
            </div>
            <div className="flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-primary" />
              <span className="text-gray-700 text-sm">{car.luggage} bagages</span>
            </div>
            <div className="flex items-center gap-2">
              <Palette className="w-5 h-5 text-primary" />
              <div className="flex gap-1">
                {car.colors?.map((color) => (
                  <div
                    key={color}
                    className="w-6 h-6 rounded-full border-2 border-gray-200 hover:scale-110 transition-transform"
                    style={{
                      backgroundColor: color === 'blanc' ? '#fff' : color === 'noir' ? '#000' : color === 'gris' ? '#ccc' : color === 'bleu' ? '#00f' : color === 'orange' ? '#ffa07a' : '#fff'
                    }}
                    title={color}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h4 className="text-lg font-semibold mb-4">Équipements</h4>
            <div className="grid grid-cols-2 gap-y-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                <span className="text-gray-700 text-sm">{car.seats} places</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                <span className="text-gray-700 text-sm">Climatisation</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                <span className="text-gray-700 text-sm">Bluetooth</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                <span className="text-gray-700 text-sm">ABS</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                <span className="text-gray-700 text-sm">Airbags</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                <span className="text-gray-700 text-sm">Direction assistée</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col mb-6">
            <div className="flex items-center justify-between mb-2">
              <div>
                <span className="text-2xl font-bold text-primary">{car.price} MAD</span>
                <p className="text-xs text-gray-500">par jour</p>
              </div>
              <div className="flex gap-3">
                <Button 
                  onClick={() => handleWhatsAppClick(car)}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  WhatsApp
                </Button>
                <Button
                  onClick={() => setIsReservationModalOpen(true)}
                  size="sm"
                >
                  Réserver
                </Button>
              </div>
            </div>
            <div className="flex items-center bg-green-50 rounded-lg p-2">
              <div className="flex-1">
                <div className="flex items-center gap-1">
                  <svg className="w-4 h-4 text-green-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 8V12L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                  <span className="text-sm font-medium text-green-800">+5 jours</span>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-lg font-bold text-green-700">{car.price - 50} MAD</span>
                  <span className="text-xs text-green-600">par jour</span>
                </div>
              </div>
              <div className="text-xs text-green-600 text-right">
                Économisez<br/>50 MAD/jour
              </div>
            </div>
          </div>
          <div className="flex gap-2 mt-2 flex-wrap">
            <Badge 
              className="bg-blue-100 text-blue-800"
              variant="outline" 
            >
              Disponible maintenant
            </Badge>
            <Badge
              className="bg-green-100 text-green-800"
              variant="outline"
            >
              +5jrs • Kilométrage illimité
            </Badge>
          </div>
        </div>
      </motion.div>
    </>
  );
};

const FilterSection = ({ onFilterChange, selectedType, cars }: { 
  onFilterChange: (type: string, value: string) => void,
  selectedType: string,
  cars: Car[]
}) => {
  // Get unique car types using filter
  const uniqueTypes = cars
    .map(car => car.type)
    .filter((type, index, array) => array.indexOf(type) === index);
  const carTypes = ['all'].concat(uniqueTypes);
  
  return (
    <div className="container mx-auto px-4 mb-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-2xl shadow-lg p-8"
      >
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">Notre Flotte</h2>
        <div className="flex flex-wrap justify-center gap-4">
          {carTypes.map((type) => (
            <motion.button
              key={type}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onFilterChange('type', type)}
              className={`px-6 py-3 rounded-lg transition-all duration-200 font-medium ${
                selectedType === type
                  ? 'bg-primary text-white shadow-lg shadow-primary/30'
                  : 'bg-gray-50 text-gray-700 hover:bg-gray-100 hover:shadow'
              }`}
            >
              {type === 'all' ? 'Tous les Véhicules' : type}
            </motion.button>
          ))}
        </div>
        <div className="mt-6 text-center text-gray-500">
          {selectedType === 'all' 
            ? `${cars.length} véhicules disponibles`
            : `${cars.filter(car => car.type === selectedType).length} véhicules de type ${selectedType}`
          }
        </div>
      </motion.div>
    </div>
  )
}

const AirportShuttleSection = ({ language }: { language: Language }) => {
  const t = translations[language]
  
  const openWhatsApp = () => {
    const whatsappMessage = encodeURIComponent("Bonjour, je voudrais réserver un service de transport aéroport.")
    const whatsappUrl = `https://wa.me/212664691080?text=${whatsappMessage}`
    window.open(whatsappUrl, '_blank')
  }

  return (
    <section className="py-16 px-4 md:px-8 bg-white">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto"
      >
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{t.airport.title}</h2>
          <p className="text-xl text-gray-600">{t.airport.subtitle}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-6"
          >
            <p className="text-lg text-gray-700 mb-6">{t.airport.description}</p>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="p-4 bg-gray-50 rounded-xl">
                <Clock className="w-8 h-8 text-primary mb-2" />
                <h3 className="font-semibold mb-1">{t.airport.service247}</h3>
                <p className="text-sm text-gray-600">{t.airport.available}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl">
                <UserCheck className="w-8 h-8 text-primary mb-2" />
                <h3 className="font-semibold mb-1">{t.airport.proChauffeur}</h3>
                <p className="text-sm text-gray-600">{t.airport.personalService}</p>
              </div>
            </div>

            <div className="flex items-center justify-between bg-primary/5 p-4 rounded-xl">
              <div>
                <p className="text-sm text-gray-600">{t.airport.startingFrom}</p>
                <p className="text-2xl font-bold text-primary">300 MAD</p>
              </div>
              <button 
                onClick={openWhatsApp}
                className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors flex items-center space-x-2"
              >
                <span>{t.airport.bookNow}</span>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="relative h-[400px] rounded-2xl overflow-hidden"
          >
            <Image
              src="/air.jpg"
              alt="Airport Shuttle Service"
              fill
              className="object-cover"
            />
          </motion.div>
        </div>
      </motion.div>
    </section>
  )
}

const LocationSection = ({ language }: { language: Language }) => {
  const t = translations[language]
  
  return (
    <section id="location" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">{t.location.title}</h2>
          <p className="text-gray-600">{t.location.subtitle}</p>
        </div>
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-2">{t.location.description}</h3>
                <div className="flex items-start space-x-2">
                  <MapPin className="w-5 h-5 mt-1 text-primary" />
                  <p>{t.location.address}</p>
                </div>
              </div>
              <div className="mb-6">
                <h4 className="font-semibold mb-2">{t.location.openHours}</h4>
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-primary" />
                    <span>{t.location.weekdays}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-primary" />
                    <span>{t.location.weekends}</span>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4 text-primary" />
                  <a href={`tel:${t.location.phone}`} className="hover:text-primary">
                    {t.location.phone}
                  </a>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4 text-primary" />
                  <a href={`mailto:contact@jimicar.ma`} className="hover:text-primary">
                    contact@jimicar.ma
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className="h-[450px] w-full">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4460.26325662127!2d-4.992279499999962!3d33.9502674!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd9f890af4ca3be9%3A0xa6bceb2aa13423f5!2sJimiCar!5e1!3m2!1sfr!2sma!4v1739981103799!5m2!1sfr!2sma"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="rounded-lg shadow-lg"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

const Navigation = ({ onPageChange, currentPage }: { 
  onPageChange: (page: string) => void, 
  currentPage: string
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isLangOpen, setIsLangOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const langMenuRef = useRef<HTMLDivElement>(null)
  const { currentLanguage, switchLanguage } = useLanguageSwitch()

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)
  const toggleLang = () => setIsLangOpen(!isLangOpen)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close language menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langMenuRef.current && !langMenuRef.current.contains(event.target as Node)) {
        setIsLangOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Close menus when language changes
  useEffect(() => {
    setIsLangOpen(false)
    setIsMenuOpen(false)
  }, [currentLanguage])

  const t = translations[currentLanguage]

  const handleLanguageChange = (lang: Language) => {
    switchLanguage(lang)
    setIsLangOpen(false)
  }

  return (
    <nav className={`fixed w-full top-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white/90 backdrop-blur-sm shadow-md' : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          {/* Logo/Brand */}
          <div className="flex items-center space-x-2">
            <div className={`relative transition-all duration-300 ${
              isScrolled ? 'w-24 h-24 md:w-28 md:h-28' : 'w-40 h-40 md:w-52 md:h-52'
            }`}>
              <Image
                src="/jimi.png"
                alt="jimi Car Logo"
                fill
                className="object-contain"
                priority
                quality={100}
              />
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => onPageChange('home')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                currentPage === 'home'
                  ? 'bg-primary text-white'
                  : isScrolled 
                    ? 'text-gray-700 hover:bg-gray-100'
                    : 'text-white hover:bg-white/10'
              }`}
            >
              {t.navigation.home}
            </button>
            <button
              onClick={() => onPageChange('about')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                currentPage === 'about'
                  ? 'bg-primary text-white'
                  : isScrolled 
                    ? 'text-gray-700 hover:bg-gray-100'
                    : 'text-white hover:bg-white/10'
              }`}
            >
              {t.navigation.about}
            </button>

            {/* Language Switcher - Desktop */}
            <div className="relative" ref={langMenuRef}>
              <button
                onClick={toggleLang}
                aria-expanded={isLangOpen}
                aria-controls="language-menu"
                aria-label="Select language"
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  isScrolled 
                    ? 'hover:bg-gray-100 text-gray-700'
                    : 'text-white hover:bg-white/10'
                }`}
              >
                <Globe className="w-5 h-5" />
                <span className="font-medium">{languageNames[currentLanguage]}</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${isLangOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Language Dropdown */}
              <AnimatePresence>
                {isLangOpen && (
                  <motion.div
                    id="language-menu"
                    role="menu"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className={`absolute ${currentLanguage === 'ar' ? 'left-0' : 'right-0'} mt-2 py-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 z-50`}
                  >
                    {(['fr', 'en', 'ar'] as Language[]).map((lang) => (
                      <motion.button
                        key={lang}
                        role="menuitem"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleLanguageChange(lang)}
                        className={`w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-all ${
                          currentLanguage === lang ? 'text-primary font-semibold bg-primary/5' : 'text-gray-700'
                        } ${lang === 'ar' ? 'flex-row-reverse' : ''}`}
                      >
                        <span className="font-medium">{languageNames[lang]}</span>
                        {currentLanguage === lang && (
                          <Check className="w-4 h-4 text-primary" />
                        )}
                      </motion.button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-4">
            {/* Mobile Language Switcher */}
            <button
              onClick={toggleLang}
              aria-expanded={isLangOpen}
              aria-controls="mobile-language-menu"
              aria-label="Select language"
              className={`p-2 rounded-lg transition-colors ${
                isScrolled 
                  ? 'hover:bg-gray-100 text-gray-700'
                  : 'text-white hover:bg-white/10'
              }`}
            >
              <Globe className="w-6 h-6" />
            </button>

            <button
              onClick={toggleMenu}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              className={`p-2 rounded-lg transition-colors ${
                isScrolled 
                  ? 'hover:bg-gray-100 text-gray-700'
                  : 'text-white hover:bg-white/10'
              }`}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              id="mobile-menu"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white shadow-lg rounded-b-xl overflow-hidden"
            >
              <div className="py-4 space-y-2">
                <button
                  onClick={() => {
                    onPageChange('home')
                    setIsMenuOpen(false)
                  }}
                  className={`w-full text-left px-6 py-3 ${
                    currentPage === 'home'
                      ? 'bg-primary text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  } ${currentLanguage === 'ar' ? 'text-right' : 'text-left'}`}
                >
                  {t.navigation.home}
                </button>
                <button
                  onClick={() => {
                    onPageChange('about')
                    setIsMenuOpen(false)
                  }}
                  className={`w-full text-left px-6 py-3 ${
                    currentPage === 'about'
                      ? 'bg-primary text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  } ${currentLanguage === 'ar' ? 'text-right' : 'text-left'}`}
                >
                  {t.navigation.about}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile Language Menu */}
        <AnimatePresence>
          {isLangOpen && (
            <motion.div
              id="mobile-language-menu"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden absolute left-0 right-0 bg-white shadow-lg rounded-b-xl"
            >
              <div className="py-4 space-y-2">
                {(['fr', 'en', 'ar'] as Language[]).map((lang) => (
                  <motion.button
                    key={lang}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleLanguageChange(lang)}
                    className={`w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-all ${
                      currentLanguage === lang ? 'text-primary font-semibold bg-primary/5' : 'text-gray-700'
                    } ${lang === 'ar' ? 'flex-row-reverse' : ''}`}
                  >
                    <span className="font-medium">{languageNames[lang]}</span>
                    {currentLanguage === lang && (
                      <Check className="w-5 h-5 text-primary" />
                    )}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  )
}

const HeroSection = ({ onPageChange, currentPage, language }: { onPageChange: (page: string) => void, currentPage: string, language: Language }) => {
  const [departureAgency, setDepartureAgency] = useState('')
  const [returnAgency, setReturnAgency] = useState('')
  const [customDepartureAgency, setCustomDepartureAgency] = useState('')
  const [customReturnAgency, setCustomReturnAgency] = useState('')
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0])
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0])
  const [showDatePicker, setShowDatePicker] = useState(false)

  const handleBooking = () => {
    const message = `Bonjour, je souhaite réserver une voiture avec les détails suivants:

🛫 Départ: ${departureAgency === 'Autre' ? customDepartureAgency : airports.find(a => a.code === departureAgency)?.name || ''}
🛬 Retour: ${returnAgency === 'Autre' ? customReturnAgency : airports.find(a => a.code === returnAgency)?.name || ''}
📅 Date de début: ${startDate}
📅 Date de fin: ${endDate}`;

    const whatsappUrl = `https://wa.me/212664691080?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  }

  const t = translations[language]

  return (
    <section className="relative h-screen">
      <div className="absolute inset-0">
        <Image
          src="/herojimii.jpg"
          alt="Flotte de voitures de location Ouail Car à Fès - Large choix de véhicules"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/50 to-black/70" />
      </div>

      <Navigation onPageChange={onPageChange} currentPage={currentPage} />
      
      {/* Hero Content */}
      <div className="relative container mx-auto px-4 h-screen flex flex-col justify-center">
        {/* Text Content */}
        <div className="max-w-3xl mx-auto text-center text-white space-y-4 sm:space-y-6">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight"
          >
            {t.hero.title}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-base sm:text-lg md:text-xl text-gray-200 max-w-2xl mx-auto"
          >
            {t.hero.description}
          </motion.p>
        </div>
        
        {/* Booking Form */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="w-full max-w-4xl mx-auto mt-8 sm:mt-12"
        >
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-2xl border border-white/10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
              {/* Departure Selection */}
              <div className="col-span-1 sm:col-span-2 md:col-span-1">
                <label className="block text-white text-base sm:text-lg font-semibold">
                  {t.hero.departure}
                </label>
                <div className="relative">
                  {departureAgency === 'Autre' ? (
                    <input
                      type="text"
                      value={customDepartureAgency}
                      onChange={(e) => setCustomDepartureAgency(e.target.value)}
                      placeholder={t.hero.enterDeparture}
                      className="w-full px-4 py-3 sm:px-5 sm:py-4 rounded-xl sm:rounded-2xl bg-white/10 text-white 
                               border-2 border-white/20 focus:outline-none focus:border-red-500 appearance-none 
                               text-sm sm:text-base transition-colors hover:bg-white/20"
                    />
                  ) : (
                    <select
                      value={departureAgency}
                      onChange={(e) => {
                        setDepartureAgency(e.target.value)
                        if (e.target.value === 'Autre') {
                          setCustomDepartureAgency('')
                        }
                      }}
                      className="w-full px-4 py-3 sm:px-5 sm:py-4 rounded-xl sm:rounded-2xl bg-white/10 text-white 
                               border-2 border-white/20 focus:outline-none focus:border-red-500 appearance-none 
                               text-sm sm:text-base transition-colors hover:bg-white/20"
                    >
                      <option value="" className="bg-gray-900">{t.hero.selectDeparture}</option>
                      {airports.map((airport) => (
                        <option key={airport.code} value={airport.code} className="bg-gray-900">
                          {airport.name}
                        </option>
                      ))}
                      <option value="Autre" className="bg-gray-900">Autre</option>
                    </select>
                  )}
                </div>
              </div>

              {/* Return Selection */}
              <div className="col-span-1 sm:col-span-2 md:col-span-1">
                <label className="block text-white text-base sm:text-lg font-semibold">
                  {t.hero.return}
                </label>
                <div className="relative">
                  {returnAgency === 'Autre' ? (
                    <input
                      type="text"
                      value={customReturnAgency}
                      onChange={(e) => setCustomReturnAgency(e.target.value)}
                      placeholder={t.hero.enterReturn}
                      className="w-full px-4 py-3 sm:px-5 sm:py-4 rounded-xl sm:rounded-2xl bg-white/10 text-white 
                               border-2 border-white/20 focus:outline-none focus:border-red-500 appearance-none 
                               text-sm sm:text-base transition-colors hover:bg-white/20"
                    />
                  ) : (
                    <select
                      value={returnAgency}
                      onChange={(e) => {
                        setReturnAgency(e.target.value)
                        if (e.target.value === 'Autre') {
                          setCustomReturnAgency('')
                        }
                      }}
                      className="w-full px-4 py-3 sm:px-5 sm:py-4 rounded-xl sm:rounded-2xl bg-white/10 text-white 
                               border-2 border-white/20 focus:outline-none focus:border-red-500 appearance-none 
                               text-sm sm:text-base transition-colors hover:bg-white/20"
                    >
                      <option value="" className="bg-gray-900">{t.hero.selectReturn}</option>
                      {airports.map((airport) => (
                        <option key={airport.code} value={airport.code} className="bg-gray-900">
                          {airport.name}
                        </option>
                      ))}
                      <option value="Autre" className="bg-gray-900">Autre</option>
                    </select>
                  )}
                </div>
              </div>

              {/* Date Selection */}
              <div className="col-span-1 sm:col-span-2 md:col-span-1">
                <label className="block text-white text-base sm:text-lg font-semibold">
                  {t.hero.dates}
                </label>
                <div className="relative">
                  <div 
                    onClick={() => setShowDatePicker(!showDatePicker)}
                    className="w-full px-4 py-3 sm:px-5 sm:py-4 rounded-xl sm:rounded-2xl bg-white/10 text-white 
                             border-2 border-white/20 cursor-pointer text-sm sm:text-base transition-colors 
                             hover:bg-white/20 flex items-center justify-between"
                  >
                    <span>{startDate === endDate ? startDate : `${startDate} - ${endDate}`}</span>
                  </div>
                  
                  {showDatePicker && (
                    <div className="absolute top-full left-0 mt-2 sm:mt-4 w-full bg-white rounded-xl sm:rounded-2xl 
                                  shadow-2xl z-50 p-4 sm:p-6 border border-gray-100">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        <div>
                          <label className="block text-gray-800 text-sm sm:text-base font-semibold mb-2">
                            {t.hero.startDate}
                          </label>
                          <input
                            type="date"
                            value={startDate}
                            onChange={(e) => {
                              setStartDate(e.target.value)
                              if (new Date(e.target.value) > new Date(endDate)) {
                                setEndDate(e.target.value)
                              }
                            }}
                            min="2025-01-04"
                            className="w-full px-3 py-2 sm:px-4 sm:py-3 border-2 border-gray-200 rounded-lg sm:rounded-xl 
                                     focus:outline-none focus:border-red-500 text-sm sm:text-base transition-colors"
                          />
                        </div>
                        <div>
                          <label className="block text-gray-800 text-sm sm:text-base font-semibold mb-2">
                            {t.hero.endDate}
                          </label>
                          <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            min={startDate}
                            className="w-full px-3 py-2 sm:px-4 sm:py-3 border-2 border-gray-200 rounded-lg sm:rounded-xl 
                                     focus:outline-none focus:border-red-500 text-sm sm:text-base transition-colors"
                          />
                        </div>
                      </div>
                      <button
                        onClick={() => setShowDatePicker(false)}
                        className="mt-4 sm:mt-6 w-full bg-red-500 text-white py-2 sm:py-3 rounded-lg sm:rounded-xl 
                                 hover:bg-red-600 text-sm sm:text-base font-semibold transition-colors"
                      >
                        {t.hero.confirm}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="mt-6 sm:mt-8">
              <Button 
                onClick={handleBooking}
                className="w-full bg-red-500 hover:bg-red-600 text-white px-6 py-3 sm:px-8 sm:py-4 
                         rounded-xl sm:rounded-2xl text-base sm:text-lg font-semibold transition-all 
                         duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 
                         active:scale-100"
                disabled={!departureAgency || !returnAgency || !startDate || !endDate}
              >
                {t.hero.bookNow}
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white"
        >
          <div className="flex flex-col items-center space-y-2">
            <span className="text-sm text-gray-300">{t.hero.discoverMore}</span>
            <ChevronDown className="w-6 h-6 animate-bounce" />
          </div>
        </motion.div>
      </div>
    </section>
  )
}

const Footer = () => {
  return (
    <motion.footer 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-gray-900 text-white py-12"
    >
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            <div className="flex items-center space-x-3">
              <div className="relative w-12 h-12">
                <Image
                  src="/jimi.png"
                  alt="Jimi Car Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <h3 className="text-xl font-bold">Jimi Car</h3>
            </div>
            <p className="text-gray-400">
              Votre partenaire de confiance pour la location de voitures à Fès
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-4"
          >
            <h3 className="text-xl font-bold">Contact</h3>
            <div className="space-y-2">
              <a href="tel:+212664691080" className="flex items-center space-x-2 text-gray-400 hover:text-white">
                <Phone className="w-5 h-5" />
                <span>+212 664-691080</span>
              </a>
              <a href="mailto:contact@jimicar.ma" className="flex items-center space-x-2 text-gray-400 hover:text-white">
                <Mail className="w-5 h-5" />
                <span>contact@jimicar.ma</span>
              </a>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-4"
          >
            <h3 className="text-xl font-bold">Adresse</h3>
            <div className="flex items-start space-x-2 text-gray-400">
              <MapPin className="w-5 h-5 mt-1 flex-shrink-0" />
              <span>fes X225+32H, N8, Oulad Tayeb, Maroc</span>
            </div>
          </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400"
        >
          <p>&copy; {new Date().getFullYear()} Jimi Car. Tous droits réservés. Made by    
            <a 
              href="https://wa.me/212626973549" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-white hover:underline"
            >
               -Imad
            </a>
          </p>
        </motion.div>
      </div>
    </motion.footer>
  )
}

const FloatingContactButtons = () => {
  return (
    <div className="fixed bottom-4 right-4 flex flex-col space-y-2 z-50">
      <a
        href="tel:+212664691080"
        className="bg-primary text-white p-3 rounded-full shadow-lg hover:bg-primary/90 transition-colors"
        title="Call us"
      >
        <Phone className="w-6 h-6" />
      </a>
      <a
        href="https://wa.me/212664691080"
        target="_blank"
        rel="noopener noreferrer"
        className="bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 transition-colors"
        title="WhatsApp"
      >
        <svg
          className="w-6 h-6"
          fill="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </a>
    </div>
  )
}

const AboutPage = ({ language }: { language: Language }) => {
  const t = translations[language]

  return (
    <div className="min-h-screen pt-16">
      {/* Hero Section */}
      <div className="relative h-[50vh] bg-gradient-to-r from-primary/10 to-primary/5 mb-16">
        <div className="container mx-auto px-4 h-full flex items-center">
          <div className="max-w-3xl">
            <motion.h1 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-bold text-gray-900 mb-6"
            >
              {t.about.title} <span className="text-primary">{t.about.subtitle}</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-gray-600 leading-relaxed"
            >
              {t.about.description}
            </motion.p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 space-y-24 mb-24">
        {/* Mission & Values Section */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid md:grid-cols-2 gap-12 items-center"
        >
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-900">{t.about.mission.title}</h2>
            <p className="text-gray-600 leading-relaxed">{t.about.mission.description}</p>
            <div className="grid grid-cols-2 gap-6">
              {t.about.values.map((value, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 bg-white rounded-lg shadow-sm border border-gray-100"
                >
                  <h3 className="font-semibold text-primary mb-2">{value.title}</h3>
                  <p className="text-sm text-gray-600">{value.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
          <div className="relative h-[400px] rounded-2xl overflow-hidden">
            <Image
              src="/hero.webp"
              alt="Notre Mission"
              fill
              className="object-cover"
            />
          </div>
        </motion.section>

        {/* Statistics Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl p-12"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {t.about.stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl font-bold text-primary mb-2">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Contact Section */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center bg-gradient-to-r from-primary/10 to-primary/5 p-12 rounded-2xl"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-6">{t.about.contact.title}</h2>
          <div className="flex flex-col md:flex-row items-center justify-center gap-4">
            <a 
              href={`tel:${t.about.contact.phone}`}
              className="flex items-center space-x-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              <Phone className="w-5 h-5" />
              <span>{t.about.contact.phone}</span>
            </a>
            <a 
              href={`mailto:${t.about.contact.email}`}
              className="flex items-center space-x-2 px-6 py-3 bg-white text-primary rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Mail className="w-5 h-5" />
              <span>{t.about.contact.email}</span>
            </a>
          </div>
        </motion.section>
      </div>
    </div>
  )
}

const MaqdisCarWebsite = () => {
  const [currentPage, setCurrentPage] = useState('home')
  const { currentLanguage: language } = useLanguageSwitch()
  const [selectedType, setSelectedType] = useState('all')
  const [filteredCars, setFilteredCars] = useState(cars)

  const handlePageChange = (page: string) => {
    setCurrentPage(page)
    window.scrollTo(0, 0)
  }

  const handleFilterChange = (type: string, value: string) => {
    setSelectedType(value)
    if (value === 'all') {
      setFilteredCars(cars)
    } else {
      setFilteredCars(cars.filter(car => car.type === value))
    }
  }

  return (
    <div className="relative">
      <Navigation onPageChange={handlePageChange} currentPage={currentPage} />
      
      {currentPage === 'home' ? (
        <>
          <HeroSection onPageChange={handlePageChange} currentPage={currentPage} language={language} />
          <main>
            <FilterSection 
              onFilterChange={handleFilterChange} 
              selectedType={selectedType}
              cars={cars}
            />
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="container mx-auto px-4 py-16"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <AnimatePresence mode="popLayout">
                  {filteredCars.map((car) => (
                    <motion.div
                      key={car.id}
                      layout
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.3 }}
                    >
                      <CarCard car={car} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </motion.div>
            <AirportShuttleSection language={language} />
            <LocationSection language={language} />
          </main>
        </>
      ) : (
        <AboutPage language={language} />
      )}
      
      <Footer />
      <FloatingContactButtons />
    </div>
  )
}

export { MaqdisCarWebsite }
