import "../../public/css/chat.css"

export default function Chat() {
  return (
    <>
    <div className="char-box">
      <h1 className="title">Chat App</h1>
      <div className="messages">
        {/* Display messages here */}
        <p className="left">Sample message 1</p>
        <p className="right">Sample message 2</p>
        <p className="left">Sample message 3</p>
        <p className="right">Sample message 4</p>
      </div>
      <div className="send-message" >
        <form className="message-form">
          <input type="text" placeholder="Type a message" />
          <button type="submit">Send</button>
        </form>
      </div>
    </div>
    </>
  )
}
