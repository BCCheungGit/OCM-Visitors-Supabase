import { Button } from "@/components/ui/button";
import Link from "next/link";


export default function ErrorPage() {
    return (
        <div className="min-w-screen flex flex-row justify-center items-center h-full">
            <div className="w-fit flex mt-10 flex-col items-center border-2 p-4 gap-4 rounded-lg shadow-xl">
                <h1 className="sm:text-xl text-lg font-semibold">Error</h1>
                <p>Something went wrong. Please try again later.</p>
                <Link href="/"><Button>Go Home</Button></Link>
            </div>
        </div>
    )
}