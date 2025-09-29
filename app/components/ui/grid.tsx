import Image from "next/image";

export default function Grid({
  feature,
  header,
  text,
  imageUrl,
}: {
  feature: string;
  header: string;
  text: string;
  imageUrl?: string;
}) {
  return (
    <div className="bg-pumpkin-900 feature-privacy p-6 flex items-center gap-4 rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-300 w-full">
      <div>
        <span className="text-black-300 pb-6"> {feature}</span>
        <h2 className="font-bold text-xl text-black-50 pt-10">{header}</h2>
        <p className="text-black-100 pt-4">{text}</p>
      </div>
      <div>
        {imageUrl && (
          <Image src={imageUrl} width={400} height={400} alt="Main right" />
        )}
      </div>
    </div>
  );
}
