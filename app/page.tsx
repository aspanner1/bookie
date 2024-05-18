"use client";
import { useState, ChangeEvent, FormEvent } from "react";
import axios from "axios";
import Image from "next/image";
import styles from "./page.module.scss";

type Book = {
  book_title: string;
  cover_url: string;
};

const UploadPage = () => {
  const [file, setFile] = useState<File | null>(null);
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    setFile(event.target.files?.[0] || null);
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!file) {
      setError("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("personCsv", file); // Changed to match API expectation

    setIsLoading(true);
    setError("");

    try {
      const { data } = await axios.post("/api/recommend", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setBooks(data.books);
    } catch (err: any) {
      setError(
        `Failed to fetch recommendations. ${
          err.response?.data?.error || err.message
        }`
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Upload your CSV File</h1>
      {error && <p className={styles.error}>{error}</p>}
      <form className={styles.form} onSubmit={handleSubmit}>
        <input type="file" onChange={handleFileChange} accept=".csv" />
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Loading..." : "Upload and Get Recommendations"}
        </button>
      </form>
      <div className={styles.bookList}>
        <h2>Recommended Books</h2>
        {books.map((book, index) => (
          <div key={index} className={styles.bookItem}>
            <Image
              src={book.cover_url}
              alt={book.book_title}
              width={100}
              height={150}
              layout="fixed"
              className={styles.bookImage}
            />
            <p className={styles.bookTitle}>{book.book_title}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UploadPage;
