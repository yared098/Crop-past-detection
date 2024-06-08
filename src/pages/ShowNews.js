import React from "react";
import adminLayout from "../hoc/adminLayout";
import { db } from "../firebase-config";
import { collection, onSnapshot, deleteDoc, doc } from "firebase/firestore";

class ShowNews extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            news: []
        };
    }

    componentDidMount() {
        const newsRef = collection(db, "News");
        onSnapshot(newsRef, (querySnapshot) => {
            const data = [];
            querySnapshot.forEach((doc) => {
                data.push({ id: doc.id, ...doc.data() });
            });
            this.setState({ news: data });
        });
    }

    handleDelete = async (id) => {
        try {
            await deleteDoc(doc(db, "News", id));
            // Remove the deleted news item from state
            this.setState(prevState => ({
                news: prevState.news.filter(newsItem => newsItem.id !== id)
            }));
            console.log("Document successfully deleted!");
        } catch (error) {
            console.error("Error removing document: ", error);
        }
    };

    render() {
        return (
            <div className="container">
                <div className="row">
                    {this.state.news.map(newsItem => (
                        <div className="col-md-4 mb-4" key={newsItem.id}>
                            <div className="card">
                                <img
                                    src={newsItem.image}
                                    className="card-img-top"
                                    alt={newsItem.title}
                                />
                                <div className="card-body">
                                    <h5 className="card-title">{newsItem.title}</h5>
                                    <p className="card-text">{newsItem.body}</p>
                                    <div className="btn-group" role="group">
                                        <button type="button" className="btn btn-primary">View Detail</button>
                                        <button type="button" className="btn btn-warning">Edit</button>
                                        <button type="button" className="btn btn-danger" onClick={() => this.handleDelete(newsItem.id)}>Delete</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }
}

export default adminLayout(ShowNews);
