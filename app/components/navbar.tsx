import Image from "next/image";

export default function Navbar() {
  return (
    <nav>
      <div className="bg-black">
        <div className="flex items-center space-x-2">
          <Image
            src={"/logo.png"}
            alt="MoneroPay Logo"
            width={50}
            height={50}
          />
          <h1 className="text-2xl font-bold text-white">MoneroPay</h1>
        </div>
      </div>
    </nav>
  );
}
