import React from 'react'
import './employeeChatSidebar.css'
import avatar1 from '../../assets/messageImages/Avatar1.png'
import avatar2 from '../../assets/messageImages/Avatar2.png'
import avatar3 from '../../assets/messageImages/Avatar3.png'
export default function EmployeeChatSidebar() {
    const messgaeChatsItems = [
        {
            chatName: 'Jumia',
            chatImg: avatar3,
            chatMessage: 'Me: massage goes here',
            messageTime: '9:12 PM',
            chatStatu: 'online',
            activeHover: 'activeHover'
        },
        {
            chatName: 'Mohamed Amged',
            chatImg: avatar1,
            chatMessage: 'Me: massage goes here',
            messageTime: '5:12 AM',
            chatStatu: 'offline'
        },
        {
            chatName: 'Israa Mohamed',
            chatImg: avatar2,
            chatMessage: 'massage goes here',
            messageTime: '7:12 PM',
            chatStatu: 'online'
        },

    ]
    return (
        <div className='employeeChatSidebar__content userChatSidebar__content'>
            <div className="container">
                <div className="yourInfoPart">
                    <div className="yourMainInfo">
                        <div className="yourAvatarImage">
                            <span className={`online chatStatuNow`}></span>
                            <img src={avatar1} alt="avatar-1" />
                        </div>
                        <div className="yourContactInfo">
                            <h1>
                                Name here
                            </h1>
                            <p>
                                3 Member
                            </p>
                        </div>
                    </div>
                    <div className="lastSeenMessage">
                        <p>
                            Last Massage Today, 3:47 PM
                        </p>
                    </div>
                </div>
                <div className="companyChatsPart">
                    <h5>
                        company staff
                    </h5>
                    {
                        messgaeChatsItems?.map((item, index) => {
                            return (
                                <div key={index} className={`messageChatItem ${item.activeHover}`}>
                                    <div className="messageChatMainInfo">
                                        <div className="messageChatImg">
                                            <span className={`${item.chatStatu} chatStatuNow`}></span>
                                            <img src={item.chatImg} alt="avatar-2" />
                                        </div>
                                        <div className="messageChatInfo">
                                            <div className="messageChatName">
                                                <h3>
                                                    {item.chatName}
                                                </h3>
                                            </div>
                                            <div className="messageChatContent">
                                                <p>
                                                    {item.chatMessage}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="timeOfMessage">
                                        <span>{item.messageTime}</span>
                                    </div>
                                </div>
                            )
                        })
                    }

                </div>
                <div className="labelChatsPart">
                    <h5>
                        Add Label
                    </h5>
                    <div className="labelItem">
                        <input  type="radio" name="example" value="1"/>
                        <label>Client</label>
                    </div>
                    <div className="labelItem">
                        <input  type="radio" name="example" value="2"/>
                        <label>Leads</label>
                    </div>
                    <div className="labelItem">
                        <input  type="radio" name="example" value="3"/>
                        <label>Other</label>
                    </div>
                </div>
                <div className="addChatNote">
                    <h5>
                        Chat Note
                    </h5>
                    <textarea rows={6} className='form-control' placeholder='Add your note..'></textarea>
                </div>
            </div>
        </div>
    )
}
