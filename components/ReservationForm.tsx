'use client'

import React from 'react'
import dynamic from 'next/dynamic'
import { useForm } from 'react-hook-form'
import { Button } from "@/components/ui/button"
import { Car } from '@/types'
import 'react-phone-input-2/lib/style.css'

// Next.js dynamic import type conflict with react-phone-input-2 component
const PhoneInput = dynamic(() => import('react-phone-input-2'), {
  ssr: false,
  loading: () => <div className="mt-1 block w-full h-[38px] rounded-md border-gray-300 shadow-sm animate-pulse bg-gray-100" />
})

interface ReservationFormProps {
  car: Car;
  onClose: () => void;
}

interface FormData {
  name: string;
  email: string;
  phone: string;
  pickupLocation: string;
  customPickupLocation?: string;
  returnLocation: string;
  customReturnLocation?: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  additionalNotes?: string;
}

const locations = [
  { code: 'AGA', name: 'Agadir–Al Massira Airport - Agadir' },
  { code: 'CAG', name: 'Agadir-centre ville - Agadir' },
  { code: 'TIZ', name: 'Tiznit-centre ville - Tiznit' },
  { code: 'Autre', name: 'Autre' },
];

const timeSlots = [
  '00:00', '01:00', '02:00', '03:00', '04:00', '05:00',
  '06:00', '07:00', '08:00', '09:00', '10:00', '11:00',
  '12:00', '13:00', '14:00', '15:00', '16:00', '17:00',
  '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'
];

export default function ReservationForm({ car, onClose }: ReservationFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormData>();

  const startDate = watch('startDate');
  const endDate = watch('endDate');

  // Calculate number of days between dates for display
  const numberOfDays = React.useMemo(() => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
    }
    return 0;
  }, [startDate, endDate]);

  const selectedPickupLocation = watch('pickupLocation');
  const selectedReturnLocation = watch('returnLocation');
  const showCustomPickupLocation = selectedPickupLocation === 'Autre';
  const showCustomReturnLocation = selectedReturnLocation === 'Autre';

  const onSubmit = async (data: FormData) => {
    const formatTimeForMessage = (time: string) => {
      return time || "Non spécifié";
    };

    const message = 
      "*Nouvelle Réservation*\n\n" +
      `*Voiture:* ${car.name}\n` +
      `*Date de début:* ${new Date(data.startDate).toLocaleDateString('fr-FR')} à ${formatTimeForMessage(data.startTime)}\n` +
      `*Date de fin:* ${new Date(data.endDate).toLocaleDateString('fr-FR')} à ${formatTimeForMessage(data.endTime)}\n` +
      `*Nom:* ${data.name}\n` +
      `*Email:* ${data.email}\n` +
      `*Téléphone:* ${data.phone}\n` +
      `*Lieu de prise en charge:* ${data.pickupLocation === 'Autre' ? data.customPickupLocation : data.pickupLocation}\n` +
      `*Lieu de retour:* ${data.returnLocation === 'Autre' ? data.customReturnLocation : data.returnLocation}\n` +
      `*Message:* ${data.additionalNotes ? data.additionalNotes : ''}\n` +
      `*Réservation envoyée via Jimi Car*\n` +
      `*Service client:* +212664691080`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/212664691080?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
    onClose();
  };

  return (
    <div className="w-full max-h-[80vh] overflow-y-auto">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">
            Réserver {car.name}
          </h2>

          {numberOfDays > 0 && (
            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="text-blue-800 text-sm">
                Durée de location: <span className="font-semibold">{numberOfDays} jours</span>
              </p>
              <p className="text-blue-800 text-xs mt-1">
                Prix total estimé: <span className="font-semibold">
                  {numberOfDays > 4 
                    ? ((car.price - 50) * numberOfDays).toFixed(0) 
                    : (car.price * numberOfDays).toFixed(0)
                  } MAD
                </span>
                {numberOfDays > 4 && (
                  <span className="ml-2 text-green-600">(-50 MAD/jour)</span>
                )}
              </p>
            </div>
          )}

          {/* Client Information */}
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Nom complet
              </label>
              <input
                type="text"
                {...register('name', { required: 'Ce champ est requis' })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary text-sm"
                placeholder="Votre nom complet"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="text"
                {...register('email')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary text-sm"
                placeholder="contact@jimicar.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Téléphone
              </label>
              <div className="mt-1 relative">
                <PhoneInput
                  country={'ma'}
                  value={watch('phone')}
                  onChange={(phone: string) => {
                    const event = {
                      target: {
                        name: 'phone',
                        value: '+' + phone
                      }
                    };
                    register('phone').onChange(event);
                  }}
                  inputProps={{
                    name: 'phone',
                    required: true,
                  }}
                  containerClass="phone-input-container"
                  buttonClass="!border !border-gray-300 !rounded-l-md !h-[38px] hover:!bg-gray-50"
                  inputClass="!w-full !h-[38px] !text-sm !border-gray-300 !rounded-r-md !pl-[48px] focus:!ring-primary focus:!border-primary"
                  dropdownClass="!rounded-lg !shadow-lg !border-gray-200"
                  searchClass="!p-2 !m-2 !border !border-gray-300 !rounded-md !text-sm"
                  buttonStyle={{ 
                    backgroundColor: 'white',
                    borderRight: 'none',
                  }}
                  inputStyle={{
                    fontSize: '0.875rem',
                  }}
                />
              </div>
              {errors.phone && (
                <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
              )}
            </div>
          </div>

          {/* Reservation Details */}
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Lieu de prise
              </label>
              <select
                {...register('pickupLocation', { required: 'Ce champ est requis' })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary text-sm"
              >
                <option value="">Sélectionnez un lieu</option>
                {locations.map((location) => (
                  <option key={location.code} value={location.code}>
                    {location.name}
                  </option>
                ))}
              </select>
              {showCustomPickupLocation && (
                <input
                  type="text"
                  {...register('customPickupLocation', { required: true })}
                  placeholder="Entrez le lieu de prise"
                  className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary text-sm"
                />
              )}
              {errors.pickupLocation && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.pickupLocation.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Lieu de retour
              </label>
              <select
                {...register('returnLocation', { required: 'Ce champ est requis' })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary text-sm"
              >
                <option value="">Sélectionnez un lieu</option>
                {locations.map((location) => (
                  <option key={location.code} value={location.code}>
                    {location.name}
                  </option>
                ))}
              </select>
              {showCustomReturnLocation && (
                <input
                  type="text"
                  {...register('customReturnLocation', { required: true })}
                  placeholder="Entrez le lieu de retour"
                  className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary text-sm"
                />
              )}
              {errors.returnLocation && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.returnLocation.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Date de début
                </label>
                <input
                  type="date"
                  {...register('startDate', { required: 'Ce champ est requis' })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary text-sm"
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Date de fin
                </label>
                <input
                  type="date"
                  {...register('endDate', { required: 'Ce champ est requis' })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary text-sm"
                  min={startDate}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Heure de début
                </label>
                <select
                  {...register('startTime', { required: 'Ce champ est requis' })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary text-sm"
                >
                  <option value="">Sélectionnez l&apos;heure</option>
                  {timeSlots.map((time) => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
                {errors.startTime && (
                  <p className="mt-1 text-sm text-red-600">{errors.startTime.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Heure de fin
                </label>
                <select
                  {...register('endTime', { required: 'Ce champ est requis' })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary text-sm"
                >
                  <option value="">Sélectionnez l&apos;heure</option>
                  {timeSlots.map((time) => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
                {errors.endTime && (
                  <p className="mt-1 text-sm text-red-600">{errors.endTime.message}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Notes additionnelles
              </label>
              <textarea
                {...register('additionalNotes')}
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary text-sm"
                placeholder="Informations supplémentaires..."
              />
            </div>
          </div>
        </div>

        <div className="pt-2">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-2 px-4 rounded-lg"
          >
            Réserver maintenant
          </Button>
        </div>
      </form>
      <style jsx global>{`
        .phone-input-container {
          font-family: inherit;
        }
        .phone-input-container .selected-flag:hover,
        .phone-input-container .selected-flag:focus,
        .phone-input-container .selected-flag:active {
          background-color: #f9fafb !important;
        }
        .phone-input-container .country-list {
          max-height: 200px;
          overflow-y: auto;
          scrollbar-width: thin;
        }
        .phone-input-container .country-list::-webkit-scrollbar {
          width: 6px;
        }
        .phone-input-container .country-list::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 3px;
        }
        .phone-input-container .country-list::-webkit-scrollbar-thumb {
          background: #888;
          border-radius: 3px;
        }
        .phone-input-container .country-list .country:hover {
          background-color: #f3f4f6;
        }
        .phone-input-container .country-list .country.highlight {
          background-color: #f3f4f6;
        }
      `}</style>
    </div>
  );
}
