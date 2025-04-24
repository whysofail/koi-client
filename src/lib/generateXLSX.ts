import { utils, writeFile } from "xlsx"; // install xlsx if you haven't: pnpm add xlsx

const downloadTemplate = (format: "csv" | "xlsx" = "csv") => {
  const headers = [
    "item",
    "title",
    "description",
    "buynow_price",
    "participation_fee",
    "bid_starting_price",
    "bid_increment",
    "start_datetime",
    "end_datetime",
  ];

  const sampleData = [
    {
      item: "123",
      title: "Sample Koi",
      description: "Beautiful koi example",
      buynow_price: 1000000,
      participation_fee: 100000,
      bid_starting_price: 500000,
      bid_increment: 50000,
      start_datetime: "2025-05-01T10:00:00", // you could leave empty if you want
      end_datetime: "2025-05-05T18:00:00",
    },
  ];

  // Ensure the raw data types are maintained and no extra formatting is applied
  const worksheet = utils.json_to_sheet(sampleData, {
    header: headers,
    skipHeader: false,
  });

  // Create a new workbook
  const workbook = utils.book_new();
  utils.book_append_sheet(workbook, worksheet, "Auctions");

  // Write the file in the requested format (CSV or XLSX)
  if (format === "csv") {
    writeFile(workbook, "auction_template.csv", { bookType: "csv" });
  } else {
    writeFile(workbook, "auction_template.xlsx", { bookType: "xlsx" });
  }
};

export default downloadTemplate;
