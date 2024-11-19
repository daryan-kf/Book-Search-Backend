import {listBooks} from "../src/services/bookService.js";

const testCRUDOperations = async () => {
  const books = await listBooks();
  console.log("All Books:", books);
};

testCRUDOperations();
