import React, { useState, useEffect } from "react";
import { useUserUpdateRequest, DynamicContextProvider, useDynamicContext } from '@dynamic-labs/sdk-react-core';
import "./../../assets/styles.css";
import myImage from "./../../assets/camera.png";
import TopNav from "../Layout/TopNav";
import Footer from "../Layout/Footer";
import avatarImage from "./../../assets/ls.png";

function TextAreaComponent({ value, onChange, rows = 1, cols = 80 }, {
  background = "#acacacbd",
  color = "black",
}) {
  const [isActive, setIsActive] = useState(false);

  const handleFocus = () => {
    setIsActive(true);
  };
  const handleBlur = () => {
    setIsActive(false);
  };
  return (
    <textarea
      onFocus={handleFocus}
      onBlur={handleBlur}
      style={{
        resize: "none",
        color: isActive ? color : "black",
        background: "#AAAAAA",
        border: isActive ? "1px solid #969696" : "1px solid #E6E6E6",
        outline: "none",
        padding: "2px 4px",
      }}
      value={value}
      onChange={onChange}
      cols={cols}
      rows={rows}
    />
  );
}

function EditAuthorInfo() {
  const { user } = useDynamicContext();
  const { updateUser } = useUserUpdateRequest();
  const [alias, setAlias] = useState(user.alias);
  const [bio, setBio] = useState(user.author ? user.author.bio : "");
  const [avatar, setAvatar] = useState(localStorage.getItem('avatar') || avatarImage);
  const [website, setWebsite] = useState(user.author ? user.author.website : "");
  const [socialLink, setSocialLink] = useState(user.author ? user.author.socialLink : "");

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      const imageUrl = reader.result;
      setAvatar(imageUrl.toString());
      localStorage.setItem('avatar', imageUrl);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    const author = { "name": alias, "bio": bio, "avatar": avatar, "website": website, "socialLink": socialLink };
    const fields = {
      alias: alias,
      metadata: { author }
    };
    updateUser(fields)
      .then((updatedFields) => {
        alert('Success',
          'Profile updated successfully', 'success',
          JSON.stringify(updatedFields));
        console.log("updated", updatedFields);
      })

      .catch((errorMessage) => {
        console.log("error", errorMessage);
      });
  };

  useEffect(() => {

    const savedAvatar = localStorage.getItem('avatar');
    if (savedAvatar) {
      setAvatar(savedAvatar);
    }
  }, []);

  return (
    <>
      <TopNav />
      <div className="workspace">
        <div className="container mx-auto">
          <button className="text-medium">Back</button>
          <p className="font-semibold font-['DM Sans'] leading-tight mt-5 text-large">
            edit your profile
          </p>
          <h1 className="font-normal font-['DM Sans'] leading-tight mt-10 mb-2 text-medium">
            Name
          </h1>
          <TextAreaComponent value={alias} onChange={(e) => setAlias(e.target.value)} />
          <h1 className="font-normal font-['DM Sans'] leading-tight mt-10 mb-2 text-medium">
            Bio
          </h1>
          <TextAreaComponent rows="7" value={bio} onChange={(e) => setBio(e.target.value)} />
          <h1 className="font-normal font-['DM Sans'] leading-tight mt-2 mb-2 text-medium">
            1000 max.c
          </h1>
          <h1 className="font-normal font-['DM Sans'] leading-tight mt-7 mb-2 text-medium">
            profile icon
          </h1>
          <div className="img-thumbnail img-circle">
            <img src={avatar} className="img-circle" />
            <div className="image-upload container overlay">
              <label htmlFor="file-input">
                <img src={myImage} />
              </label>
              <input
                id="file-input"
                type="file"
                accept="image/png, image/jpeg"
                onChange={handleImageChange}
                style={{ display: "none" }}
              />
            </div>
          </div>
          <h1 className="font-normal font-['DM Sans'] leading-tight mt-10 mb-2 text-medium">
            Website
          </h1>
          <TextAreaComponent value={website} onChange={(e) => setWebsite(e.target.value)} />
          <h1 className="font-normal font-['DM Sans'] leading-tight mt-10 mb-2 text-medium">
            Social link
          </h1>
          <TextAreaComponent value={socialLink} onChange={(e) => setSocialLink(e.target.value)} />
          <div>
            <button className="bg-black hover:bg-gray-700 text-white font-bold py-2 px-7 mt-10 rounded text-medium" onClick={handleSave}>
              Save
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default EditAuthorInfo;
