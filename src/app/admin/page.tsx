

// import { User } from "@supabase/supabase-js";

// import { createClient } from "../../../utils/supabase/server";
// import { redirect } from "next/navigation";
// import { is_claims_admin } from "@/server/claims/claims";
// import { TopNav } from "../_components/topnav";
// import { SearchUsers } from "./_search-users";
// import { Search } from "lucide-react";
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// import { searchUsers } from "@/server/queries";
// import Image from "next/image";
// import { Button } from "@/components/ui/button";
// import { DeleteModal, ImageModal } from "../_components/modals";

// function convertToESTFormat(dateString: string): string {

//     const date = new Date(dateString);
    
//     return date.toLocaleTimeString("en-US", {
//       year: "numeric",
//       day: "numeric",
//       month: "short",
//       hour: "2-digit",
//       minute: "2-digit",
//     })
  
//   }



// export default async function AdminPage(params: {
//     searchParams: {search?: string }
// }) {

//     const supabase = createClient();


//     const { data, error } = await supabase.auth.getUser();
//     const result = await is_claims_admin();
//     if (result === false) {
//         redirect("/dashboard/print");
//     }


//     const query = params.searchParams.search;

//     const users = await searchUsers(query ? query : "");
//     if (data) {
//         return (
//             <>
//             <TopNav />
//             <div className="flex flex-col items-center justify-center min-w-screen min-h-full mt-20">
//                 <SearchUsers />
//                 <Table>
//             <TableHeader>
//               <TableRow>
//                 <TableHead className="font-bold text-base">Image 圖片</TableHead>
//                 <TableHead className="font-bold text-base">Full Name 姓名</TableHead>
//                 <TableHead className="font-bold text-base">Phone Number 電話號碼</TableHead>
//                 <TableHead className="font-bold text-base">Last Sign In 登錄時間</TableHead>
//                 <TableHead className="font-bold text-base">Admin Actions</TableHead>
//               </TableRow>
//             </TableHeader>
//             <TableBody>
//                 {users.users?.map((user) => (
//                     <TableRow key={user.id}>
//                         <TableCell>
//                             <ImageModal image={user.image} />
//                         </TableCell>
//                         <TableCell>{user.first_name} {user.last_name}</TableCell>
//                         <TableCell>{user.phone}</TableCell>
//                         <TableCell>{convertToESTFormat(user.sign_in_time)}</TableCell>
//                         <TableCell>
//                             {data.user?.id !== user.id ? (
//                                 <DeleteModal firstName={user.first_name} lastName={user.last_name} userId={user.id} />
//                             )
//                             :
//                             (
//                                 <><p className="font-semibold opacity-40">Cannot Delete Self</p></>
//                             )
//                             }
//                         </TableCell>
//                     </TableRow>
//                 ))}
//             </TableBody>
//             </Table>
//             </div>
        
//         </>
//         )
//     }

//     else {
//         redirect("/");
//     }
    

// }