import { useState } from "react";
import "./index.css";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

function Button({ onClick, children }) {
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
}

export default function App() {
  const [friends, setFriends] = useState(initialFriends);
  // When user clicks to Select a friend, we store that object in this state:
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [showAddFriendButton, setShowAddFriendButton] = useState(true);
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [showDeleteFriendButton, setShowDeleteFriendButton] = useState(true);
  const [showDeleteButton, setShowDeleteButton] = useState(false);
  const [showDeleteForm, setShowDeleteForm] = useState(false);
  const [friendToDelete, setFriendToDelete] = useState(null);

  function handleSelection(friend) {
    if (showDeleteButton) {
      setShowDeleteForm(true);
      setFriendToDelete(friend);
    } else {
      setSelectedFriend((cur) => (cur?.id === friend.id ? null : friend));
      setShowAddFriend(false);
      setShowDeleteFriendButton(true);
    }
  }

  function handleShowAddFriend() {
    setShowAddFriend((show) => !show);
    setShowDeleteButton(false);
    setShowDeleteForm(false);
    setShowDeleteFriendButton((show) => !show);
    setSelectedFriend(null);
  }

  function handleActivateDeleteFriend(friend) {
    setShowDeleteFriendButton(false);
    setShowDeleteButton((show) => !show);
    setSelectedFriend(null);
    setShowAddFriendButton(false);
  }

  function handleAddFriend(friend) {
    setFriends((friends) => [...friends, friend]);
    setShowAddFriend(false);
    setShowDeleteFriendButton(true);
  }

  function handleDeleteFriend() {
    setFriends((friends) =>
      friends.filter((friend) => friend.id !== friendToDelete.id)
    );
    console.log(friendToDelete.name);
    setShowDeleteForm(false);
    setFriendToDelete(null);
    setShowDeleteButton(false);
    setShowDeleteFriendButton(true);
    setShowAddFriendButton(true);
  }

  const handleCancel = () => {
    setShowDeleteForm(false);
    setFriendToDelete(null);
    setShowDeleteButton(false);
    setShowDeleteFriendButton(true);
    setShowAddFriendButton(true);
  };

  function handleSplitBill(value) {
    setFriends((friends) =>
      friends.map((friend) =>
        friend.id === selectedFriend.id
          ? { ...friend, balance: friend.balance + value }
          : friend
      )
    );
    setSelectedFriend(null);
  }

  return (
    <div className="app">
      <div className="sidebar">
        <FriendsList
          friends={friends}
          onSelection={handleSelection}
          selectedFriend={selectedFriend}
          onShowDeleteButton={showDeleteButton}
        />

        {showDeleteFriendButton && (
          <Button onClick={handleActivateDeleteFriend}>Delete Friend</Button>
        )}

        {showAddFriend && <FormAddFriend onAddFriend={handleAddFriend} />}

        {showAddFriendButton && (
          <Button onClick={handleShowAddFriend}>
            {showAddFriend ? "Close" : "Add Friend"}
          </Button>
        )}
      </div>

      {selectedFriend && (
        <FormSplitBill
          selectedFriend={selectedFriend}
          onSplitBill={handleSplitBill}
        />
      )}
      {showDeleteForm && (
        <div className="modal">
          <div className="modal-content">
            <p>Are you sure you want to delete {friendToDelete.name}?</p>
            <Button onClick={handleDeleteFriend}>Yes</Button>
            <Button onClick={handleCancel}>No</Button>
          </div>
        </div>
      )}
    </div>
  );
}

function FriendsList({
  friends,
  onSelection,
  selectedFriend,
  onShowDeleteButton,
}) {
  return (
    <ul className="sidebar">
      {friends.map((friend) => (
        <Friend
          friend={friend}
          key={friend.id}
          selectedFriend={selectedFriend}
          onSelection={onSelection}
          onShowDeleteButton={onShowDeleteButton}
        />
      ))}
    </ul>
  );
}

function Friend({ friend, onSelection, selectedFriend, onShowDeleteButton }) {
  const isSelected = selectedFriend?.id === friend.id;

  return (
    <li className={isSelected ? "selected" : ""}>
      <img src={friend.image} alt={friend.name} />
      <h3 className="">{friend.name}</h3>
      {friend.balance < 0 && (
        <p className="red">
          You owe {friend.name} ${Math.abs(friend.balance)}
        </p>
      )}
      {friend.balance > 0 && (
        <p className="green">
          {friend.name} owes you ${Math.abs(friend.balance)}
        </p>
      )}
      {friend.balance === 0 && <p>You and {friend.name} are even </p>}
      <Button onClick={() => onSelection(friend)}>
        {onShowDeleteButton ? "Delete" : isSelected ? "Close" : "Select"}
      </Button>
    </li>
  );
}

function FormAddFriend({ onAddFriend }) {
  const [name, setName] = useState("");
  const [image, setImage] = useState("https://i.pravatar.cc/48");

  function handleSubmit(e) {
    e.preventDefault();

    if (!name || !image) return;
    const id = crypto.randomUUID();
    const newFriend = {
      id,
      name,
      image: `${image}?=${id}`,
      balance: 0,
    };
    onAddFriend(newFriend);

    setName("");
    setImage("https://i.pravatar.cc/48");
  }

  return (
    <form className="form-add-friend" onSubmit={handleSubmit}>
      <label>👫 Friend name</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <label>🌄 Image URL</label>
      <input
        type="text"
        value={image}
        onChange={(e) => setImage(e.target.value)}
      />
      <Button className="button">Add Friend</Button>
    </form>
  );
}

function FormSplitBill({ selectedFriend, onSplitBill }) {
  const [bill, setBill] = useState("");
  const [paidByUser, setPaidByUser] = useState("");
  const paidByFriend = bill ? bill - paidByUser : "";
  const [whoIsPaying, setWhoIsPaying] = useState("user");

  function handleSubmit(e) {
    e.preventDefault();

    if (!bill || !paidByUser) return;
    onSplitBill(whoIsPaying === "user" ? paidByFriend : -paidByUser);
  }

  return (
    <form className="form-split-bill" onSubmit={handleSubmit}>
      <h2>Split a bill with {selectedFriend.name}</h2>
      <label>💰 Bill value</label>
      <input
        type="text"
        value={bill}
        onChange={(e) => setBill(Number(e.target.value))}
      />
      <label>🧑 Your expense</label>
      <input
        type="text"
        value={paidByUser}
        onChange={(e) =>
          setPaidByUser(
            Number(e.target.value) > bill ? paidByUser : Number(e.target.value)
          )
        }
      />
      <label>👫 {selectedFriend.name}'s expense</label>
      <input type="text" value={paidByFriend} disabled />
      <label>🤑 Who is playing the bill</label>
      <select
        value={whoIsPaying}
        onChange={(e) => setWhoIsPaying(e.target.value)}
      >
        <option value="user">You</option>
        <option value="friend">{selectedFriend.name}</option>
      </select>
      <Button className="button">Split bill</Button>
    </form>
  );
}
