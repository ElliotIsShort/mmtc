'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Calendar, MapPin, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Show } from '@/types';
import Modal from './ui/Modal';
import Button from './ui/Button';

interface ShowCardProps {
  show: Show;
}

export default function ShowCard({ show }: ShowCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const hasGallery = show.galleryImages && show.galleryImages.length > 0;

  const nextImage = () => {
    if (hasGallery) {
      setCurrentImageIndex((prev) =>
        prev === show.galleryImages!.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (hasGallery) {
      setCurrentImageIndex((prev) =>
        prev === 0 ? show.galleryImages!.length - 1 : prev - 1
      );
    }
  };

  return (
    <>
      {/* Card */}
      <div
        className="card cursor-pointer group"
        onClick={() => setIsModalOpen(true)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            setIsModalOpen(true);
          }
        }}
        aria-label={`View details for ${show.title}`}
      >
        {/* Poster */}
        <div className="relative aspect-[3/4] overflow-hidden">
          {show.posterUrl ? (
            <Image
              src={show.posterUrl}
              alt={show.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary-200 to-primary-300 flex items-center justify-center p-4">
              <span className="text-primary-700 font-display text-lg text-center">
                {show.title}
              </span>
            </div>
          )}
          {/* Year Badge */}
          <div className="absolute top-3 right-3 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-medium">
            {show.year}
          </div>
        </div>

        {/* Info */}
        <div className="p-4">
          <h3 className="font-display font-semibold text-lg text-gray-900 line-clamp-1 group-hover:text-primary-700 transition-colors">
            {show.title}
          </h3>
          {show.subtitle && (
            <p className="text-gray-600 text-sm line-clamp-1 mt-1">{show.subtitle}</p>
          )}
          <div className="flex items-center gap-2 text-gray-500 text-sm mt-3">
            <MapPin size={14} />
            <span className="line-clamp-1">{show.venue}</span>
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setCurrentImageIndex(0);
        }}
        title={show.title}
        size="lg"
      >
        <div className="space-y-6">
          {/* Poster / Gallery */}
          <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
            {hasGallery ? (
              <>
                <Image
                  src={show.galleryImages![currentImageIndex]}
                  alt={`${show.title} - Image ${currentImageIndex + 1}`}
                  fill
                  className="object-contain"
                />
                {show.galleryImages!.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                      aria-label="Previous image"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                      aria-label="Next image"
                    >
                      <ChevronRight size={20} />
                    </button>
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
                      {show.galleryImages!.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`w-2 h-2 rounded-full transition-colors ${
                            index === currentImageIndex
                              ? 'bg-white'
                              : 'bg-white/50 hover:bg-white/75'
                          }`}
                          aria-label={`Go to image ${index + 1}`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </>
            ) : show.posterUrl ? (
              <Image
                src={show.posterUrl}
                alt={show.title}
                fill
                className="object-contain"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-primary-200 to-primary-300 flex items-center justify-center">
                <span className="text-primary-700 font-display text-2xl">
                  {show.title}
                </span>
              </div>
            )}
          </div>

          {/* Details */}
          <div>
            {show.subtitle && (
              <p className="text-xl text-gray-600 mb-4">{show.subtitle}</p>
            )}

            <div className="flex flex-wrap gap-4 mb-4">
              <div className="flex items-center gap-2 text-gray-700">
                <Calendar className="text-primary-600" size={18} />
                <span>{show.dates}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <MapPin className="text-primary-600" size={18} />
                <span>{show.venue}</span>
              </div>
            </div>

            {show.description && (
              <p className="text-gray-700 leading-relaxed">{show.description}</p>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end pt-4 border-t border-gray-200">
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
              Close
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
