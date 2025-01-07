import NewTicketForm from "../../_components/Ticket/NewTicketForm";
import { cookies } from "next/headers";

export const metadata = {
  title: "New Ticket",
};

export default function Page() {
  const session = cookies().get("session")?.value;
  return (
    <div className="flex flex-col gap-10 mt-10 items-center">
      <h2 className="text-3xl font-semibold">Create New Ticket</h2>
      <NewTicketForm session={session} />
    </div>
  );
}
