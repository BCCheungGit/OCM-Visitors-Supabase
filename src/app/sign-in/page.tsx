import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";



export default function SignInPage() {
    return (
        <div className="min-w-screen flex flex-row justify-center items-center h-full">
            <div className="w-fit flex mt-10 flex-col items-center border-2 p-4 gap-4 rounded-lg shadow-xl">
                <h1 className="sm:text-xl text-lg font-semibold">Sign In</h1>
                <form className="flex flex-col gap-4">
                    <div>
                        <label htmlFor="phone" className="sm:text-base text-sm">Phone Number</label>
                        <Input type="text" name="phone" />
                    </div>
                    <Button type="submit">Sign In</Button>
                </form>
            </div>
        </div>
    )
}