import Link from "next/link";
import Image from "next/image";
import IBrand from "@/models/brand";
export default function BrandsCard({ brand }: { brand: IBrand }) {
  const isVideo = brand.media_url.match(/\.(mp4|webm|mov|avi)$/i);

  return (
    <Link
      href={`/brands/${brand.id}`}
      className="relative block aspect-square overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 group"
    >
      {/* Brand Logo - Top Left - Updated for perfect fit */}
      {brand.logo_url && (
        <div className="absolute top-1 left-1 z-10 w-16 h-16 bg-transparent p-1 rounded-md shadow-sm aspect-square">
          <div className="relative w-full h-full">
            <Image
              src={brand.logo_url}
              alt={`${brand.name} logo`}
              fill
              className="object-contain"
              sizes="64px"
            />
          </div>
        </div>
      )}

      {/* Media - Center (unchanged) */}
      <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
        {isVideo ? (
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          >
            <source
              src={brand.media_url}
              type={`video/${brand.media_url.split(".").pop()}`}
            />
          </video>
        ) : (
          <Image
            src={brand.media_url}
            alt={`${brand.name} media`}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        )}
      </div>

      {/* Brand Name - Bottom Left (unchanged) */}
      <div className="absolute bottom-0 left-0 right-0 p-1 bg-gradient-to-t from-black/80 to-transparent">
        <h3 className="text-white font-bold text-xl">{brand.name}</h3>
      </div>
    </Link>
  );
}
