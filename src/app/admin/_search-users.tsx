"use client";


import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const SearchUsers = () => {
    const router = useRouter();
    const pathname = usePathname();


    return (
        <div className="sm:w-[700px] w-200px flex flex-col justify-center">
            <h2 className="sm:text-2xl text-xl font-semibold">
                Search Users by First Name
            </h2>
            <form 
                onSubmit={
                    async (e) => {
                        e.preventDefault();
                        const formData = new FormData(e.target as HTMLFormElement);
                        const queryTerm = formData.get("search") as string;
                        router.push(pathname + "?search=" + queryTerm);
                    }
                }
                className="flex flex-row gap-4 items-center justify-center pb-4 pt-4 sm:text-xl text-base font-semibold border-b mb-4"
            >
                <Input name="search" placeholder="Search by First Name" type="text" />

                <Button type="submit">Search</Button>
            </form>

        </div>
    )
}