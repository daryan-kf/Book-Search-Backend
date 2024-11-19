const express = require("express");
const axios = require("axios");
const fs = require("fs");

const app = express();
const PORT = 3000;

const apiKey = "AIzaSyDOYJj7Y3-CPtjwmsQg2GYqlkpvmRujy8Y"; // Replace with your actual API key
const maxBooks = 5000;
const maxResultsPerRequest = 40;

// Comprehensive list of categories
const categories = [
  "Fiction",
  "Nonfiction",
  "Fantasy",
  "Science Fiction",
  "Mystery",
  "Thriller",
  "Romance",
  "Horror",
  "Biography",
  "History",
  "Science",
  "Philosophy",
  "Psychology",
  "Self-Help",
  "Health",
  "Travel",
  "Art",
  "Cooking",
  "Poetry",
  "Children",
  "Business",
  "Economics",
  "Technology",
  "Education",
  "Religion",
  "Spirituality",
  "Comics",
  "Graphic Novels",
  "Sports",
  "Politics",
  "Law",
  "Music",
  "Drama",
  "Adventure",
  "Classics",
  "Humor",
  "Short Stories",
  "Anthologies",
  "Environmental",
  "Nature",
  "Mathematics",
  "Medical",
  "True Crime",
  "War",
  "Western",
  "Dystopian",
  "Cyberpunk",
  "Steampunk",
  "Fairy Tales",
  "Folklore",
  "Mythology",
  "Epic",
  "Dark Fantasy",
  "High Fantasy",
  "Space Opera",
  "Contemporary",
  "Historical Fiction",
  "Chick Lit",
  "Erotica",
  "Family",
  "Relationships",
  "Cultural",
  "Artificial Intelligence",
  "Programming",
  "Data Science",
  "Engineering",
  "Design",
  "Photography",
  "Gardening",
  "Architecture",
  "Space",
  "Astronomy",
  "Astrology",
  "Crafts",
  "Hobbies",
];

const maxBooksPerCategory = Math.floor(maxBooks / categories.length) + 1;

let books = [];
let uniqueIds = new Set();

const fetchBooks = async () => {
  for (let category of categories) {
    let startIndex = 0;
    let booksInCategory = 0;

    while (
      booksInCategory < maxBooksPerCategory &&
      startIndex < 1000 &&
      books.length < maxBooks
    ) {
      const url = "https://www.googleapis.com/books/v1/volumes";
      const params = {
        q: `subject:${category}`,
        orderBy: "relevance",
        startIndex: startIndex,
        maxResults: maxResultsPerRequest,
        key: apiKey,
      };

      try {
        const response = await axios.get(url, {params});
        const data = response.data;

        // Check for errors
        if (data.error) {
          console.log(`API Error: ${data.error.message}`);
          break;
        }

        if (data.items && data.items.length > 0) {
          for (let item of data.items) {
            const volumeInfo = item.volumeInfo || {};
            const imageLinks = volumeInfo.imageLinks || {};

            // Ensure the book has at least one image
            if (!imageLinks.thumbnail && !imageLinks.smallThumbnail) {
              continue;
            }

            const bookId = item.id;
            if (uniqueIds.has(bookId)) {
              continue; // Skip duplicates
            }
            uniqueIds.add(bookId);

            // Include all available data points
            const bookInfo = {
              id: bookId,
              title: volumeInfo.title,
              subtitle: volumeInfo.subtitle,
              authors: volumeInfo.authors,
              publisher: volumeInfo.publisher,
              publishedDate: volumeInfo.publishedDate,
              description: volumeInfo.description,
              industryIdentifiers: volumeInfo.industryIdentifiers,
              readingModes: volumeInfo.readingModes,
              pageCount: volumeInfo.pageCount,
              printType: volumeInfo.printType,
              categories: volumeInfo.categories,
              maturityRating: volumeInfo.maturityRating,
              allowAnonLogging: volumeInfo.allowAnonLogging,
              contentVersion: volumeInfo.contentVersion,
              panelizationSummary: volumeInfo.panelizationSummary,
              imageLinks: imageLinks,
              language: volumeInfo.language,
              previewLink: volumeInfo.previewLink,
              infoLink: volumeInfo.infoLink,
              canonicalVolumeLink: volumeInfo.canonicalVolumeLink,
              averageRating: volumeInfo.averageRating,
              ratingsCount: volumeInfo.ratingsCount,
            };

            books.push(bookInfo);
            booksInCategory++;

            if (
              booksInCategory >= maxBooksPerCategory ||
              books.length >= maxBooks
            ) {
              break;
            }
          }
          startIndex += maxResultsPerRequest;
          // Delay between requests to respect rate limits
          await new Promise(resolve => setTimeout(resolve, 1000));
        } else {
          console.log(`No more items found for category '${category}'.`);
          break;
        }
      } catch (error) {
        console.log(
          `An error occurred for category '${category}': ${error.message}`
        );
        break;
      }
    }
    console.log(
      `Collected ${booksInCategory} books for category '${category}'.`
    );

    if (books.length >= maxBooks) {
      console.log("Reached maximum number of books.");
      break;
    }
  }

  // Save to JSON file
  fs.writeFileSync("fetch_books.json", JSON.stringify(books, null, 2), "utf-8");

  console.log(
    `Saved ${books.length} books with images to diverse_books_with_images.json`
  );
};

app.get("/fetch-books", async (req, res) => {
  await fetchBooks();
  res.send("Books have been fetched and saved.");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
