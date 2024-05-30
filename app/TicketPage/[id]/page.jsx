import EditTicketForm from "@/app/(components)/EditTicketForm";

const getTicketById = async (id) => {
  try {
    const res = await fetch(`http://localhost:3000/api/Tickets/${id}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch topic");
    }

    const data = await res.json();
    return data.foundTicket; // Assuming foundTicket is the relevant data
  } catch (error) {
    console.error("Error fetching ticket:", error);
    throw error; // Re-throw the error to handle it higher up
  }
};

const TicketPage = async ({ params }) => {
  try {
    const EDITMODE = params.id !== "new"; // Checking if it's not "new"

    let updateTicketData = {};
    if (EDITMODE) {
      updateTicketData = await getTicketById(params.id);
    } else {
      updateTicketData = {
        _id: "new",
      };
    }

    return <EditTicketForm ticket={updateTicketData} />;
  } catch (error) {
    // Handle errors here or let it bubble up
    console.error("Error in TicketPage:", error);
    return <div>Error loading ticket data.</div>;
  }
};

export default TicketPage;
