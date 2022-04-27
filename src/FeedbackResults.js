//This is my second component where I use props to display the data from the API. It displays all the feedback snippets
const FeedbackResults = (props) => {
    const feedback = props.feedback
    const handleDelete = props.handleDelete
    const selectComment = props.selectComment
    const helpful = props.helpful

    return (  
        <div className="feedback-results">
            <h3>Results:</h3>
{/* Here I map through all the feedback snippets and display them. I conditionally render the thumbs up/down based on the value of feedback.wasHelpful */}
            {feedback.map((feedback) => (
                <div className="results-preview" key={feedback.id}>
                    <p>Helpful: 
                    { 
                    (feedback.wasHelpful) 
                    ? <i className="fa-solid fa-thumbs-up"></i>
                    : <i className="fa-solid fa-thumbs-down"></i>
                    }
                    </p>
                    <p>Comment: { feedback.comment }</p>
                    <button onClick={() => selectComment(feedback.id)} className="btn">Edit</button>
                    <button onClick={() => handleDelete(feedback.id)} className="btn">Delete</button>
                </div>   
             ))}
        </div>
    );
}
 
export default FeedbackResults;