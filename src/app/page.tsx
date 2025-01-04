'use client';


import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useEffect } from "react";
import { TopNav } from "./_components/topnav";

export default function Home() {

      const router = useRouter();

      return (
        <>
        <TopNav />
      <div className="flex flex-col min-w-screen items-center justify-start mt-10 gap-4 min-h-screen">
        <div className="w-1/4 min-w-96 items-center justify-center flex flex-col gap-4 border-2 rounded-xl shadow-lg p-4">
        <div className="flex flex-row gap-4 items-center justify-center">
        <Image src="https://avatars.planningcenteronline.com/uploads/organization/217202-1482195203/avatar.1.png" alt="OCM Logo" width={30} height={30} />
        <h1 className="font-semibold">Welcome to OCM!</h1>

        </div>
        <Link className="w-full" href="/sign-up"><Button className="w-full">Sign Up as Visitor</Button></Link>
        </div>
      </div>
    </>
  );


}
