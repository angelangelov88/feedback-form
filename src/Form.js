import { useState } from 'react'
import axios from 'axios'
import FeedbackResults from './FeedbackResults'


const Form = () => {
//Those are my state hooks so that I can change their status in the code later
    const [feedback, setFeedback] = useState(null)
    const [wasHelpful, setWasHelpful] = useState(true)
    const [helpful, setHelpful] = useState(null)
    const [comment, setComment] = useState("")
    const [updateFormShow, setUpdateFormShow] = useState(false)
    const [updateId, setUpdateId] = useState("")
//This is a local JSON server I was using to test
    // const url = 'http://localhost:8000/feedback'
    const url = 'https://6239be97bbe20c3f66c93c18.mockapi.io/api/v1/feedback'
    const [data, setData] = useState({
        wasHelpful: true,
        comment: ""
    })

//This is the function that toggles the thumbs up/down functionality. So on click I set it to the opposite of what it was and I start with True
    const toggleThumbs = () => {
        setWasHelpful(!wasHelpful)
    }

//This is the handling function for my form
    const handle = (e) => {
        const newData = {...data}
        newData[e.target.id] = e.target.value
        setData(newData)
    }

//This is the submit function which uses axios and post to submit the input to the API endpoint
    const handleSubmit = (e) => {
        e.preventDefault()
        axios.post(url, {
            wasHelpful: wasHelpful,
            comment: data.comment
        })
        .then(res => {
            fetchApi()
            setData({comment: ""})   
        })
    }

//This is the fetch function which uses fetch and get to get the data from the API and adds it the Feedback variable
    const fetchApi = () => {
        fetch(url)
            .then(res => {
                return res.json()
            })
            .then(data => {
                setFeedback(data)
            })
            .catch(err => {console.log(err.message)})
    }

//This is the function that adds the delete functionality. It uses axios and delete
    const handleDelete = (id) => {
        axios.delete(`${url}/${id}`)
        .then(res => {
            fetchApi()
            // console.log(data)
            // console.log(feedback)
        })
    }

//This is the function I have added to allow the user to update their input. I fetch the data from the API and the user can update or delete any entry by clicking on the button
    const handleUpdate = () => {
        axios.put(`${url}/${updateId}`, {
            comment: comment,
            wasHelpful: helpful,
            id: updateId
        })
        .then(res => {
            fetchApi()
            setUpdateFormShow(false)
        })
    }

//This is the function I have created to select the comment the user wants to modify. I use the id I got from the FeedbackResults page as parameter and then use it to select the correct comment. I have added a forEach loop to loop through all the items and select only the one that the id equals the id selected. I did that because otherwise it gets the array index and if it does not match the id it gives an error.
    const selectComment = (id) => {
        feedback.forEach(loopThroughFeedbackResults)
        function loopThroughFeedbackResults(entry){
            if (entry.id == id){
                setComment(entry.comment)
                setHelpful(entry.wasHelpful)
                setUpdateId(entry.id)
                setUpdateFormShow(true)
            }
        }
    }

  return (
    <div className='container'>
        <div className="Form">
            <div className="content">
                <p className="title">Is this page helpful?</p>
                    <div className="thumbs-container">
{/* This is where my toggle function is and it does toggle between thumbs up and down. Based on useHelpful state I change the display of the thumb */}
                        <div className="thumbs" onClick={toggleThumbs}>
                            {wasHelpful 
                            ? <i className="fa-solid fa-thumbs-up"></i>
                            : <i className="fa-regular fa-thumbs-up"></i>
                            }
                            <p>Yes</p>
                        </div>
                        <div className="thumbs" onClick={toggleThumbs}>
                            {!wasHelpful 
                            ? <i className="fa-solid fa-thumbs-down"></i>
                            : <i className="fa-regular fa-thumbs-down"></i>
                            }
                            <p>No</p>
                        </div>
                    </div>
                </div>
{/* This is the form where I use handle and handleSubmit functions to send the data to the API endpoint */}
                <form onSubmit={(e) => handleSubmit(e)}>
                    <textarea onChange={(e) => handle(e)} id="comment" value={data.comment} placeholder="Any additional feedback?" type="text" required></textarea>
                    <div className="buttons">
                        <div name="skip" id="skip">Skip</div>
                        <button className="btn" type="submit" name="submit" id="submit">Submit</button>
                    </div>
                </form>
            </div>
{/* This is the results component being referenced. I used props to transfer the data available there */}
            <div className="results">
                {feedback && 
                <FeedbackResults 
                feedback={feedback} 
                helpful={helpful}
                handleDelete={handleDelete}
                handleUpdate={handleUpdate}
                selectComment={selectComment}
                />}   
            </div>
{/* This is the update form which I render only is the updateFormShow is true */}
            {updateFormShow &&  
            <div className='updateForm'>
                <h4>Update form</h4>
                <p>Helpful?
                <select type="text" value={helpful} onChange={(e) => setHelpful(e.target.value)}> 
                <option value={true}>Yes</option>
                <option value={false}>No</option>
                </select></p>
                <p>Comment:
                <input type="text" value={comment} onChange={(e) => setComment(e.target.value)} /></p>
                <button onClick={() => handleUpdate(feedback.id)} className="btn">Update</button>
            </div>
            }
    </div>
  );
}

export default Form;
