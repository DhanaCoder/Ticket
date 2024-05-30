import EditTicketForm from "@/app/(components)/EditTicketForm";

const getTicketById = async (id) => {
  try {
    const res = await fetch(`http://localhost:3000/api/Tickets/${id}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch ticket");
    }

    const data = await res.json();
    return data.foundTicket;
  } catch (error) {
    console.error("Error fetching ticket:", error);
    throw error;
  }
};

const TicketPage = async ({ params }) => {
  try {
    const { id } = params;
    const EDITMODE = id !== "new";

    let updateTicketData = {};
    if (EDITMODE) {
      updateTicketData = await getTicketById(id);
    } else {
      updateTicketData = { _id: "new" };
    }

    return <EditTicketForm ticket={updateTicketData} />;
  } catch (error) {
    console.error("Error in TicketPage:", error);
    return <div>Error loading ticket data.</div>;
  }
};

export default TicketPage;
