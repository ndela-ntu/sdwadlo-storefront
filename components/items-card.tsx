import Link from "next/link";
import Image from "next/image";
import ITag from "@/models/tag";
import ICategory from "@/models/category";

export default function ItemsCard({ item, className }: { item: ITag | ICategory; className?: string; }) {
  const isVideo = item.media_url?.match(/\.(mp4|webm|mov|avi)$/i);
  const placeholderImage = '/placeholder-image.svg';

  return (
    <Link
      href={item.type === 'Tag' ? `/collection/${item.id}` : `/category/${item.id}`}
      className={`${className} ${!className?.includes('col-span') ? 'aspect-square' : ''} relative block overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 group`}
    >
      {/* Media - Takes full card area */}
      <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
        {item.media_url ? (
          isVideo ? (
            <video
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
            >
              <source
                src={item.media_url}
                type={`video/${item.media_url?.split(".").pop()}`}
              />
            </video>
          ) : (
            <Image
              src={item.media_url}
              alt={`${item.name} media`}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          )
        ) : (
          <Image
            src={placeholderImage}
            alt={`${item.name} placeholder`}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        )}
      </div>

      {/* Item Name - Bottom with gradient overlay */}
      <div className="absolute inset-0 flex items-center justify-center p-4 bg-black/40">
        <h3 className="text-white font-bold text-xl text-center">
          {item.name}
        </h3>
      </div>

      {/* Optional hover overlay effect */}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />
    </Link>
  );
}