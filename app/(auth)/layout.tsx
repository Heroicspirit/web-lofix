import Image from "next/image";

export default function Layout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
    <section className="h-screen w-full flex overflow-hidden bg-white">
    <div className="h-full w-full grid grid-cols-1 md:grid-cols-2">
        <div className="relative hidden md:block h-full w-full">
        <Image
            src="/images/loginphoto.jpg"
            alt="Music Headphones"
            fill
            priority
            className="object-cover"
        />
        </div>
        <div className="flex h-full items-center justify-center bg-white px-6 md:px-12">
        <div className="w-full max-w-[400px]">
            {children}
        </div>
        </div>

    </div>
    </section>
);
}