import React, { useState, useEffect } from "react";
import { db } from "../firebase-config";
import { collection, getDocs } from "firebase/firestore";
import adminLayout from "../hoc/adminLayout";

const ShowNewsPage = () => {
  const [news, setNews] = useState([]);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "news"));
        const newsList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setNews(newsList);
      } catch (error) {
        console.error("Error fetching news: ", error);
      }
    };

    fetchNews();
  }, []);

  return (
    <div className="table-container">
      <div className="row">
        <div className="col">
          <h5 className="pb-2 mb-0">News</h5>
        </div>
      </div>
      <p>
        Here is the list of news articles stored in the database.
      </p>
      <div className="d-flex text-muted">
        <table className="table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Description</th>
              <th>Crop Type</th>
              <th>Location</th>
              <th>Image</th>
              <th>Created On</th>
            </tr>
          </thead>
          <tbody>
            {news.map(item => (
              <tr key={item.id}>
                <td>{item.title}</td>
                <td>{item.description}</td>
                <td>{item.cropType}</td>
                <td>{item.location}</td>
                <td>
                  {item.imageUrl ? (
                    <img src={item.imageUrl} alt={item.title} style={{ width: "100px" }} />
                  ) : (
                    "No image"
                  )}
                </td>
                <td>{new Date(item.createdAt.seconds * 1000).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <nav>
        <ul className="pagination justify-content-end">
          <li className="page-item disabled">
            <a className="page-link" href="#" tabIndex="-1">Previous</a>
          </li>
          <li className="page-item"><a className="page-link" href="#">1</a></li>
          <li className="page-item"><a className="page-link" href="#">2</a></li>
          <li className="page-item"><a className="page-link" href="#">3</a></li>
          <li className="page-item">
            <a className="page-link" href="#">Next</a>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default adminLayout(ShowNewsPage);
